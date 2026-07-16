/**
 * Shared types for the Fylos analytics + consent infrastructure.
 *
 * Design goals encoded here:
 *  - Consent has three categories; `necessary` is always on and cannot be revoked.
 *  - Nonessential categories (`analytics`, `marketing`) default to OFF until the
 *    user makes an explicit choice.
 *  - No event payload type carries names, emails, messages, or pet health data.
 */

/** The consent categories the banner exposes. `necessary` is always granted. */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

/** The two user-controllable (nonessential) categories. */
export type NonEssentialCategory = 'analytics' | 'marketing';

/** Per-category grant map. `necessary` is pinned to `true` by the store. */
export interface ConsentCategories {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

/** User-editable subset used by the "selected preferences" flow. */
export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

/**
 * Persisted consent state.
 * `status: 'unset'` means the user has not chosen yet, so nonessential analytics
 * must remain disabled.
 */
export interface ConsentState {
  version: number;
  status: 'unset' | 'set';
  categories: ConsentCategories;
  /** ISO timestamp of the last decision, or null while unset. */
  updatedAt: string | null;
}

/**
 * Immutable, PII-free snapshot handed to adapters and attached to event context.
 * Adapters use this to configure downstream consent (e.g. gtag consent mode).
 */
export interface ConsentSnapshot {
  status: 'unset' | 'set';
  analytics: boolean;
  marketing: boolean;
  updatedAt: string | null;
}

/** Reason a consent change happened, for logging/telemetry (no PII). */
export type ConsentDecisionSource =
  | 'accept_all'
  | 'necessary_only'
  | 'save_preferences'
  | 'reset'
  | 'load';

/**
 * First-touch attribution captured from the landing URL. Every field is
 * marketing metadata only, never personal data.
 */
export interface Attribution {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  /** Referring origin + path only; query string is stripped. */
  referrer: string | null;
  /** Path of the first page the visitor landed on; query string is stripped. */
  landingPage: string | null;
  /** ISO timestamp of when this touch was captured. */
  capturedAt: string;
}

/** Context attached to every dispatched event. Contains no PII. */
export interface EventContext {
  timestamp: string;
  sessionId: string;
  page: {
    path: string;
    title?: string;
    referrer?: string;
  };
  attribution: Attribution;
  consent: ConsentSnapshot;
  libraryVersion: string;
}

/** A safe key/value store abstraction (localStorage-shaped, SSR/quota safe). */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** Options controlling the PII guard applied to every event payload. */
export interface PiiGuardOptions {
  /** Extra property names to deny in addition to the built-in deny list. */
  deniedKeys?: string[];
  /** Replace fully denied values with this token. */
  redactionToken?: string;
  /** Strings longer than this are treated as free text and redacted. */
  maxStringLength?: number;
  /** Throw instead of redacting when PII is detected (used in tests/CI). */
  throwOnViolation?: boolean;
  /** Called (in debug builds) whenever something is redacted. */
  onRedact?: (info: { path: string; reason: PiiReason }) => void;
}

/** Why a value was redacted. */
export type PiiReason =
  | 'denied_key'
  | 'email_pattern'
  | 'phone_pattern'
  | 'free_text_length';
