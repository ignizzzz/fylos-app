/**
 * `createFylosAnalytics` — the one call that wires the whole system together:
 * storage -> consent store -> attribution capture -> consent-gated analytics
 * core -> consent banner. Returns a small, ergonomic facade.
 *
 * No real analytics provider is attached; the default adapter is a no-op.
 */

import type { AnalyticsAdapter } from './adapter';
import { NoopAdapter } from './adapter';
import { Analytics, generateSessionId } from './analytics';
import type { AnalyticsOptions } from './analytics';
import { ConsentStore } from './consent/consentStore';
import type { ConsentListener } from './consent/consentStore';
import { mountConsentBanner } from './consent/consentBanner';
import type { ConsentBannerController, ConsentBannerOptions } from './consent/consentBanner';
import { captureAttribution } from './attribution';
import type { AttributionResult } from './attribution';
import { resolveStore } from './storage';
import type {
  Attribution,
  ConsentCategory,
  ConsentPreferences,
  ConsentSnapshot,
  KeyValueStore,
  PiiGuardOptions,
} from './types';
import type { EventName, EventPropsMap } from './events';
import type {
  ArticleViewedProps,
  CtaClickProps,
  DownloadClickedProps,
  FeatureViewedProps,
  FormStartedProps,
  FormSubmittedProps,
  StorytellingCompletedProps,
  StorytellingStartedProps,
} from './events';

export interface FylosAnalyticsConfig {
  /** Replaceable provider. Defaults to NoopAdapter (sends nothing). */
  adapter?: AnalyticsAdapter;
  debug?: boolean;
  /** Mount the consent banner. Default true (when a DOM exists). */
  banner?: boolean;
  bannerOptions?: ConsentBannerOptions;
  consentVersion?: number;
  consentStorageKey?: string;
  attributionStorageKey?: string;
  categoryOverrides?: Partial<Record<EventName, ConsentCategory>>;
  piiOptions?: PiiGuardOptions;
  /** Buffer nonessential events fired before a decision (default false). */
  queueBeforeConsent?: boolean;
  /** Inject a storage backend (defaults to safe localStorage wrapper). */
  store?: KeyValueStore;
  /** Inject a clock (mainly for tests). */
  now?: () => Date;
}

export interface FylosAnalytics {
  readonly analytics: Analytics;
  readonly consent: ConsentStore;
  readonly banner: ConsentBannerController;
  readonly attribution: AttributionResult;

  track<K extends EventName>(name: K, props: EventPropsMap[K]): boolean;
  ctaClick(props: CtaClickProps): boolean;
  storytellingStarted(props: StorytellingStartedProps): boolean;
  storytellingCompleted(props: StorytellingCompletedProps): boolean;
  featureViewed(props: FeatureViewedProps): boolean;
  formStarted(props: FormStartedProps): boolean;
  formSubmitted(props: FormSubmittedProps): boolean;
  downloadClicked(props: DownloadClickedProps): boolean;
  articleViewed(props: ArticleViewedProps): boolean;

  /** Swap the analytics provider at runtime. */
  setAdapter(adapter: AnalyticsAdapter): void;

  acceptAll(): void;
  necessaryOnly(): void;
  savePreferences(prefs: ConsentPreferences): void;
  /** Reopen the preferences dialog (e.g. from a footer link). */
  openPreferences(): void;
  getConsent(): ConsentSnapshot;
  onConsentChange(listener: ConsentListener): () => void;

  getAttribution(): Attribution;
  destroy(): void;
}

const SESSION_ID_KEY = 'fylos_session_id';

/**
 * A per-browser-session anonymous id, persisted in sessionStorage so consecutive
 * full page loads reuse it. Returns undefined when sessionStorage is unavailable,
 * in which case Analytics generates a per-instance id.
 */
function resolveSessionId(): string | undefined {
  try {
    if (typeof sessionStorage === 'undefined') return undefined;
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

export function createFylosAnalytics(config: FylosAnalyticsConfig = {}): FylosAnalytics {
  const store = resolveStore(config.store);

  const consent = new ConsentStore(store, {
    version: config.consentVersion,
    storageKey: config.consentStorageKey,
    now: config.now,
  });

  const attribution = captureAttribution(store, {
    storageKey: config.attributionStorageKey,
    now: config.now,
  });

  const analyticsOptions: AnalyticsOptions = {
    adapter: config.adapter ?? new NoopAdapter(),
    consent,
    attribution: attribution.firstTouch,
    debug: config.debug,
    categoryOverrides: config.categoryOverrides,
    piiOptions: config.piiOptions,
    queueBeforeConsent: config.queueBeforeConsent,
    now: config.now,
    // Reuse one anonymous session id across full page loads within a browser
    // session, so a visit that spans several static pages stays one session.
    sessionId: resolveSessionId(),
  };
  const analytics = new Analytics(analyticsOptions);

  const banner: ConsentBannerController =
    config.banner === false
      ? {
          openPreferences() {},
          closePreferences() {},
          showBanner() {},
          hideBanner() {},
          destroy() {},
          root: null,
        }
      : mountConsentBanner(consent, config.bannerOptions);

  return {
    analytics,
    consent,
    banner,
    attribution,

    track: (name, props) => analytics.track(name, props),
    ctaClick: (props) => analytics.ctaClick(props),
    storytellingStarted: (props) => analytics.storytellingStarted(props),
    storytellingCompleted: (props) => analytics.storytellingCompleted(props),
    featureViewed: (props) => analytics.featureViewed(props),
    formStarted: (props) => analytics.formStarted(props),
    formSubmitted: (props) => analytics.formSubmitted(props),
    downloadClicked: (props) => analytics.downloadClicked(props),
    articleViewed: (props) => analytics.articleViewed(props),

    setAdapter: (adapter) => analytics.setAdapter(adapter),

    acceptAll: () => consent.acceptAll(),
    necessaryOnly: () => consent.necessaryOnly(),
    savePreferences: (prefs) => consent.savePreferences(prefs),
    openPreferences: () => banner.openPreferences(),
    getConsent: () => consent.snapshot(),
    onConsentChange: (listener) => consent.subscribe(listener),

    getAttribution: () => analytics.getAttribution(),
    destroy: () => {
      analytics.destroy();
      banner.destroy();
    },
  };
}
