/**
 * The replaceable analytics adapter.
 *
 * The core dispatcher is provider-agnostic: it decides *whether* an event may
 * be sent (consent) and *what* may be sent (PII guard), then hands a clean,
 * typed envelope to an adapter. Swapping analytics providers later means
 * writing one small adapter and passing it to `createFylosAnalytics({ adapter })`
 * — no product code changes.
 *
 * Per the brief, NO real provider is wired here. The default is `NoopAdapter`
 * (sends nothing). `ConsoleAdapter` is for local debugging and `MemoryAdapter`
 * for tests / QA.
 *
 * Note: there is deliberately no `identify()` method. Identifying a person is
 * exactly what we must not do, so the interface offers no way to send PII.
 */

import type { EventName } from './events';
import type { EventContext, ConsentSnapshot } from './types';

/** The fully-formed, sanitized envelope handed to an adapter. */
export interface AnalyticsEnvelope<K extends EventName = EventName> {
  /** Event name from the typed catalogue. */
  name: K;
  /** Consent category that gated this event. */
  category: 'necessary' | 'analytics' | 'marketing';
  /** Sanitized, PII-free properties. */
  props: Record<string, unknown>;
  /** Non-personal context (attribution, page, consent, session). */
  context: EventContext;
}

/** Passed to `adapter.init` once, when the adapter is attached. */
export interface AdapterContext {
  debug: boolean;
  libraryVersion: string;
  /** Current consent at init time. */
  consent: ConsentSnapshot;
}

/**
 * Implement this to send events somewhere real (later). Every method is
 * optional except `track`.
 */
export interface AnalyticsAdapter {
  /** Human-readable adapter name, used in debug logs. */
  readonly name: string;
  /** Called once when attached. */
  init?(ctx: AdapterContext): void;
  /** Receive a sanitized, consent-approved event. */
  track(envelope: AnalyticsEnvelope): void;
  /** Notified whenever consent changes (e.g. to set a provider's consent mode). */
  setConsent?(consent: ConsentSnapshot): void;
  /** Flush any buffered events (best-effort). */
  flush?(): void;
  /** Tear down (e.g. on "forget me"). */
  reset?(): void;
}

/** Default adapter: accepts events but sends nothing. Safe by construction. */
export class NoopAdapter implements AnalyticsAdapter {
  readonly name = 'noop';
  track(): void {
    /* intentionally does nothing */
  }
}

/** Debug adapter: logs every approved envelope to the console. */
export class ConsoleAdapter implements AnalyticsAdapter {
  readonly name = 'console';
  private readonly log: (...args: unknown[]) => void;

  constructor(logger: (...args: unknown[]) => void = (...a) => console.info(...a)) {
    this.log = logger;
  }

  init(ctx: AdapterContext): void {
    this.log('[fylos-analytics] adapter ready', ctx);
  }

  track(envelope: AnalyticsEnvelope): void {
    this.log(`[fylos-analytics] ${envelope.name}`, envelope);
  }

  setConsent(consent: ConsentSnapshot): void {
    this.log('[fylos-analytics] consent', consent);
  }
}

/** Test/QA adapter: records envelopes in memory for assertions. */
export class MemoryAdapter implements AnalyticsAdapter {
  readonly name = 'memory';
  readonly events: AnalyticsEnvelope[] = [];
  readonly consentChanges: ConsentSnapshot[] = [];
  initialized = false;

  init(): void {
    this.initialized = true;
  }

  track(envelope: AnalyticsEnvelope): void {
    this.events.push(envelope);
  }

  setConsent(consent: ConsentSnapshot): void {
    this.consentChanges.push(consent);
  }

  /** Names of all recorded events, in order. */
  names(): EventName[] {
    return this.events.map((e) => e.name);
  }

  clear(): void {
    this.events.length = 0;
    this.consentChanges.length = 0;
  }
}
