/**
 * Analytics core — the consent gate + PII choke point.
 *
 * For every `track()` call the core:
 *   1. resolves the event's consent category (analytics by default),
 *   2. checks consent — `necessary` always passes; nonessential categories pass
 *      only after the visitor has granted them. Before a decision, nonessential
 *      events are dropped (or optionally buffered, off by default),
 *   3. sanitizes the payload through the PII guard,
 *   4. builds a non-personal context (attribution, page, consent, session),
 *   5. hands the envelope to the replaceable adapter.
 *
 * Nothing is transmitted before consent: the default adapter is a no-op and,
 * regardless of adapter, nonessential events never reach `adapter.track` until
 * their category is granted.
 */

import type { AdapterContext, AnalyticsAdapter, AnalyticsEnvelope } from './adapter';
import type { ConsentStore } from './consent/consentStore';
import type {
  Attribution,
  ConsentCategory,
  EventContext,
  PiiGuardOptions,
} from './types';
import type {
  ArticleViewedProps,
  CtaClickProps,
  DownloadClickedProps,
  EventName,
  EventPropsMap,
  FeatureViewedProps,
  FormStartedProps,
  FormSubmittedProps,
  StorytellingCompletedProps,
  StorytellingStartedProps,
} from './events';
import { DEFAULT_EVENT_CATEGORY } from './events';
import { sanitizeProps } from './pii';
import { LIBRARY_VERSION } from './version';

export interface PageInfo {
  path: string;
  title?: string;
}

export interface AnalyticsOptions {
  adapter: AnalyticsAdapter;
  consent: ConsentStore;
  /** First-touch attribution, attached to every event. */
  attribution: Attribution;
  debug?: boolean;
  /** Per-event category overrides (e.g. mark one event `necessary`). */
  categoryOverrides?: Partial<Record<EventName, ConsentCategory>>;
  piiOptions?: PiiGuardOptions;
  /**
   * If true, nonessential events fired BEFORE the visitor decides are buffered
   * and flushed once (and if) consent is granted. Default false: strictly no
   * pre-consent activity is retained.
   */
  queueBeforeConsent?: boolean;
  maxQueueSize?: number;
  now?: () => Date;
  getPage?: () => PageInfo;
  sessionId?: string;
}

interface QueuedEvent {
  name: EventName;
  category: ConsentCategory;
  props: Record<string, unknown>;
}

const MAX_TITLE_LENGTH = 200;
const DEFAULT_MAX_QUEUE = 50;

export function generateSessionId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  // Non-cryptographic fallback; this is an anonymous session tag, not a secret.
  return `s-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

function defaultGetPage(): PageInfo {
  let path = '/';
  let title: string | undefined;
  try {
    if (typeof location !== 'undefined') path = location.pathname || '/';
  } catch {
    /* ignore */
  }
  try {
    if (typeof document !== 'undefined' && document.title) {
      title = document.title.slice(0, MAX_TITLE_LENGTH);
    }
  } catch {
    /* ignore */
  }
  return { path, title };
}

export class Analytics {
  private adapter: AnalyticsAdapter;
  private readonly consent: ConsentStore;
  private readonly attribution: Attribution;
  private readonly debug: boolean;
  private readonly categoryOverrides: Partial<Record<EventName, ConsentCategory>>;
  private readonly piiOptions: PiiGuardOptions | undefined;
  private readonly queueBeforeConsent: boolean;
  private readonly maxQueueSize: number;
  private readonly now: () => Date;
  private readonly getPage: () => PageInfo;
  private readonly sessionId: string;
  private queue: QueuedEvent[] = [];
  private unsubscribeConsent: (() => void) | null = null;

  constructor(options: AnalyticsOptions) {
    this.adapter = options.adapter;
    this.consent = options.consent;
    this.attribution = options.attribution;
    this.debug = options.debug ?? false;
    this.categoryOverrides = options.categoryOverrides ?? {};
    this.piiOptions = options.piiOptions;
    this.queueBeforeConsent = options.queueBeforeConsent ?? false;
    this.maxQueueSize = options.maxQueueSize ?? DEFAULT_MAX_QUEUE;
    this.now = options.now ?? (() => new Date());
    this.getPage = options.getPage ?? defaultGetPage;
    this.sessionId = options.sessionId ?? generateSessionId();

    this.initAdapter(this.adapter);
    this.unsubscribeConsent = this.consent.subscribe(() => this.onConsentChange());
  }

  private initAdapter(adapter: AnalyticsAdapter): void {
    const ctx: AdapterContext = {
      debug: this.debug,
      libraryVersion: LIBRARY_VERSION,
      consent: this.consent.snapshot(),
    };
    try {
      adapter.init?.(ctx);
    } catch (err) {
      this.warn('adapter init failed', err);
    }
  }

  /** Swap the analytics provider at runtime. Product code is unaffected. */
  setAdapter(adapter: AnalyticsAdapter): void {
    this.adapter = adapter;
    this.initAdapter(adapter);
    try {
      adapter.setConsent?.(this.consent.snapshot());
    } catch (err) {
      this.warn('adapter setConsent failed', err);
    }
  }

  private resolveCategory(name: EventName): ConsentCategory {
    return this.categoryOverrides[name] ?? DEFAULT_EVENT_CATEGORY[name];
  }

  private onConsentChange(): void {
    const snapshot = this.consent.snapshot();
    try {
      this.adapter.setConsent?.(snapshot);
    } catch (err) {
      this.warn('adapter setConsent failed', err);
    }
    this.flushQueue();
  }

  private flushQueue(): void {
    if (this.queue.length === 0) return;
    const pending = this.queue;
    this.queue = [];
    for (const item of pending) {
      if (this.consent.isGranted(item.category)) {
        this.dispatch(item.name, item.category, item.props);
      } else {
        this.log('dropped queued event (consent not granted):', item.name);
      }
    }
  }

  private buildContext(): EventContext {
    const page = this.getPage();
    const raw = {
      timestamp: this.now().toISOString(),
      sessionId: this.sessionId,
      page: {
        path: page.path,
        ...(page.title ? { title: page.title } : {}),
        ...(this.attribution.referrer ? { referrer: this.attribution.referrer } : {}),
      },
      attribution: this.attribution,
      consent: this.consent.snapshot(),
      libraryVersion: LIBRARY_VERSION,
    };
    // Defense in depth: the context is assembled from DOM/URL-derived values
    // (document.title, location.pathname, referrer, utm*) which can carry PII
    // just like a payload. Route the whole context through the same PII guard
    // as event props so the "context contains no PII" contract actually holds.
    return sanitizeProps(raw, this.piiOptions) as unknown as EventContext;
  }

  private dispatch(
    name: EventName,
    category: ConsentCategory,
    sanitized: Record<string, unknown>,
  ): void {
    const envelope: AnalyticsEnvelope = {
      name,
      category,
      props: sanitized,
      context: this.buildContext(),
    };
    try {
      this.adapter.track(envelope);
      this.log('sent', name, envelope);
    } catch (err) {
      this.warn('adapter track failed', err);
    }
  }

  /**
   * Track any catalogued event. Consent-gated and PII-sanitized.
   * Returns true if the event was dispatched, false if gated/queued/dropped.
   */
  track<K extends EventName>(name: K, props: EventPropsMap[K]): boolean {
    const category = this.resolveCategory(name);
    const sanitized = sanitizeProps(props as unknown as Record<string, unknown>, this.piiOptions);

    if (!this.consent.isGranted(category)) {
      if (this.queueBeforeConsent && !this.consent.hasDecision() && category !== 'necessary') {
        this.enqueue({ name, category, props: sanitized });
        this.log('queued pre-consent event:', name);
      } else {
        this.log('blocked event (consent not granted):', name);
      }
      return false;
    }

    this.dispatch(name, category, sanitized);
    return true;
  }

  private enqueue(item: QueuedEvent): void {
    this.queue.push(item);
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }
  }

  // ---- Typed convenience helpers -------------------------------------------

  ctaClick(props: CtaClickProps): boolean {
    return this.track('cta_click', props);
  }

  storytellingStarted(props: StorytellingStartedProps): boolean {
    return this.track('storytelling_started', props);
  }

  storytellingCompleted(props: StorytellingCompletedProps): boolean {
    return this.track('storytelling_completed', props);
  }

  featureViewed(props: FeatureViewedProps): boolean {
    return this.track('feature_viewed', props);
  }

  formStarted(props: FormStartedProps): boolean {
    return this.track('form_started', props);
  }

  formSubmitted(props: FormSubmittedProps): boolean {
    return this.track('form_submitted', props);
  }

  downloadClicked(props: DownloadClickedProps): boolean {
    return this.track('download_clicked', props);
  }

  articleViewed(props: ArticleViewedProps): boolean {
    return this.track('article_viewed', props);
  }

  // ---- Introspection / lifecycle -------------------------------------------

  /** The first-touch attribution attached to events. */
  getAttribution(): Attribution {
    return this.attribution;
  }

  /** The anonymous session id used for this instance. */
  getSessionId(): string {
    return this.sessionId;
  }

  /** Number of buffered pre-consent events (0 unless queueBeforeConsent). */
  pendingCount(): number {
    return this.queue.length;
  }

  flush(): void {
    try {
      this.adapter.flush?.();
    } catch (err) {
      this.warn('adapter flush failed', err);
    }
  }

  /** Tear down subscriptions and clear buffered events. */
  destroy(): void {
    this.unsubscribeConsent?.();
    this.unsubscribeConsent = null;
    this.queue = [];
    try {
      this.adapter.reset?.();
    } catch {
      /* ignore */
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) console.debug('[fylos-analytics]', ...args);
  }

  private warn(...args: unknown[]): void {
    if (this.debug) console.warn('[fylos-analytics]', ...args);
  }
}
