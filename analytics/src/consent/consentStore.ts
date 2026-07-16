/**
 * Consent state machine + persistence.
 *
 * Categories: `necessary` (always granted), `analytics`, `marketing`.
 * Until the visitor makes an explicit choice, `status` is `'unset'` and the two
 * nonessential categories are `false`, so nonessential analytics stays disabled.
 *
 * Flows exposed to the banner:
 *   - acceptAll()        -> analytics + marketing on
 *   - necessaryOnly()    -> analytics + marketing off (reject nonessential)
 *   - savePreferences()  -> per-category selection
 * Each decision is persisted and broadcast to subscribers.
 */

import type {
  ConsentCategory,
  ConsentDecisionSource,
  ConsentPreferences,
  ConsentSnapshot,
  ConsentState,
  KeyValueStore,
} from '../types';
import { CONSENT_SCHEMA_VERSION } from '../version';
import { readJson, writeJson } from '../storage';

export const CONSENT_STORAGE_KEY = 'fylos_consent_v1';

export type ConsentListener = (state: ConsentState, source: ConsentDecisionSource) => void;

export interface ConsentStoreOptions {
  storageKey?: string;
  version?: number;
  now?: () => Date;
}

function unsetState(version: number): ConsentState {
  return {
    version,
    status: 'unset',
    categories: { necessary: true, analytics: false, marketing: false },
    updatedAt: null,
  };
}

function isValidStoredState(value: unknown, version: number): value is ConsentState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<ConsentState>;
  if (v.version !== version) return false;
  if (v.status !== 'set' && v.status !== 'unset') return false;
  if (typeof v.categories !== 'object' || v.categories === null) return false;
  const c = v.categories as unknown as Record<string, unknown>;
  return typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean';
}

export class ConsentStore {
  private readonly store: KeyValueStore;
  private readonly storageKey: string;
  private readonly version: number;
  private readonly now: () => Date;
  private readonly listeners = new Set<ConsentListener>();
  private state: ConsentState;

  constructor(store: KeyValueStore, options: ConsentStoreOptions = {}) {
    this.store = store;
    this.storageKey = options.storageKey ?? CONSENT_STORAGE_KEY;
    this.version = options.version ?? CONSENT_SCHEMA_VERSION;
    this.now = options.now ?? (() => new Date());
    this.state = this.load();
  }

  private load(): ConsentState {
    const stored = readJson<ConsentState>(this.store, this.storageKey);
    if (stored && isValidStoredState(stored, this.version)) {
      // Re-pin necessary in case of tampering.
      stored.categories.necessary = true;
      return stored;
    }
    return unsetState(this.version);
  }

  private persist(): void {
    writeJson(this.store, this.storageKey, this.state);
  }

  private commit(
    categories: { analytics: boolean; marketing: boolean },
    source: ConsentDecisionSource,
  ): void {
    this.state = {
      version: this.version,
      status: 'set',
      categories: { necessary: true, ...categories },
      updatedAt: this.now().toISOString(),
    };
    this.persist();
    this.emit(source);
  }

  private emit(source: ConsentDecisionSource): void {
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(snapshot, source);
      } catch {
        /* a broken listener must not break the rest */
      }
    }
  }

  /** Current state (defensive copy). */
  getState(): ConsentState {
    return {
      version: this.state.version,
      status: this.state.status,
      categories: { ...this.state.categories },
      updatedAt: this.state.updatedAt,
    };
  }

  /** PII-free snapshot for adapters and event context. */
  snapshot(): ConsentSnapshot {
    return {
      status: this.state.status,
      analytics: this.state.categories.analytics,
      marketing: this.state.categories.marketing,
      updatedAt: this.state.updatedAt,
    };
  }

  /** Has the visitor made an explicit choice yet? */
  hasDecision(): boolean {
    return this.state.status === 'set';
  }

  /** Is a category currently granted? `necessary` is always true. */
  isGranted(category: ConsentCategory): boolean {
    if (category === 'necessary') return true;
    return this.state.categories[category] === true;
  }

  /** Accept all nonessential categories. */
  acceptAll(): void {
    this.commit({ analytics: true, marketing: true }, 'accept_all');
  }

  /** Reject all nonessential categories (necessary only). */
  necessaryOnly(): void {
    this.commit({ analytics: false, marketing: false }, 'necessary_only');
  }

  /** Save an explicit per-category selection. */
  savePreferences(prefs: ConsentPreferences): void {
    this.commit(
      { analytics: prefs.analytics === true, marketing: prefs.marketing === true },
      'save_preferences',
    );
  }

  /** Update a single nonessential category, keeping the others. */
  setCategory(category: 'analytics' | 'marketing', granted: boolean): void {
    const next = {
      analytics: this.state.categories.analytics,
      marketing: this.state.categories.marketing,
    };
    next[category] = granted === true;
    this.commit(next, 'save_preferences');
  }

  /** Clear the decision (used mainly for tests / "forget me"). */
  reset(): void {
    this.state = unsetState(this.version);
    this.store.remove(this.storageKey);
    this.emit('reset');
  }

  /** Subscribe to consent changes. Returns an unsubscribe function. */
  subscribe(listener: ConsentListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
