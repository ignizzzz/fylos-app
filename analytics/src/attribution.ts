/**
 * Frontend attribution.
 *
 * On the first page a visitor lands on we capture, from the URL and referrer:
 *   utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer,
 *   landing page.
 *
 * This is stored first-party (localStorage) as the canonical FIRST-TOUCH and is
 * attached to every event's context. Capture is purely local; nothing is
 * transmitted until analytics consent is granted and an event passes the
 * consent gate (see `analytics.ts`). Query strings are stripped from the
 * referrer and landing page so no query-string PII is ever retained.
 */

import type { Attribution, KeyValueStore } from './types';
import { readJson, writeJson } from './storage';
import { looksLikeEmail, looksLikePhone } from './pii';

export const ATTRIBUTION_STORAGE_KEY = 'fylos_attribution_v1';

/** Minimal shape we need from the environment; injectable for tests. */
export interface AttributionSource {
  search: string;
  pathname: string;
  referrer: string;
}

export interface AttributionOptions {
  storageKey?: string;
  now?: () => Date;
  source?: AttributionSource;
}

const UTM_PARAM_TO_FIELD: Readonly<Record<string, keyof Attribution>> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_content: 'utmContent',
  utm_term: 'utmTerm',
};

const MAX_UTM_LENGTH = 256;

// Matches ASCII control characters (0x00-0x1F and 0x7F).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f]/g;

function cleanParam(value: string | null): string | null {
  if (value == null) return null;
  // Strip control chars and cap length; UTM values are marketing metadata.
  const stripped = value.replace(CONTROL_CHARS_RE, '').trim();
  if (!stripped) return null;
  const cleaned =
    stripped.length > MAX_UTM_LENGTH ? stripped.slice(0, MAX_UTM_LENGTH) : stripped;
  // UTM values are attacker/marketing controlled (e.g. refer-a-friend links) and
  // can embed an email or phone. Never persist or transmit those.
  if (looksLikeEmail(cleaned) || looksLikePhone(cleaned)) return null;
  return cleaned;
}

/** Reduce a referrer URL to origin + path (drop query/fragment). Null if invalid or same-doc. */
function sanitizeReferrer(referrer: string): string | null {
  const raw = referrer?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  } catch {
    // Not an absolute URL; keep only the part before ?/# if anything.
    const cut = raw.split(/[?#]/, 1)[0] ?? '';
    return cut || null;
  }
}

function resolveSource(explicit?: AttributionSource): AttributionSource {
  if (explicit) return explicit;
  let search = '';
  let pathname = '/';
  let referrer = '';
  try {
    if (typeof location !== 'undefined') {
      search = location.search ?? '';
      pathname = location.pathname ?? '/';
    }
  } catch {
    /* ignore */
  }
  try {
    if (typeof document !== 'undefined') {
      referrer = document.referrer ?? '';
    }
  } catch {
    /* ignore */
  }
  return { search, pathname, referrer };
}

/** Parse the current environment into an Attribution touch. */
export function readTouch(options?: AttributionOptions): Attribution {
  const source = resolveSource(options?.source);
  const now = options?.now ?? (() => new Date());

  const params = new URLSearchParams(source.search);
  const touch: Attribution = {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    referrer: sanitizeReferrer(source.referrer),
    landingPage: source.pathname || '/',
    capturedAt: now().toISOString(),
  };

  for (const [param, field] of Object.entries(UTM_PARAM_TO_FIELD)) {
    const value = cleanParam(params.get(param));
    if (value != null) {
      // Only utm* fields are assigned here, all of which are `string | null`.
      (touch as unknown as Record<string, string | null>)[field] = value;
    }
  }

  return touch;
}

export interface AttributionResult {
  /** The persisted first-touch, attached to events. */
  firstTouch: Attribution;
  /** The attribution parsed from the current page load. */
  lastTouch: Attribution;
  /** Whether this call created the first-touch record. */
  isNew: boolean;
}

/**
 * Capture attribution for this page load. Persists first-touch on first ever
 * visit and returns both first-touch and current (last) touch.
 */
export function captureAttribution(
  store: KeyValueStore,
  options?: AttributionOptions,
): AttributionResult {
  const key = options?.storageKey ?? ATTRIBUTION_STORAGE_KEY;
  const lastTouch = readTouch(options);
  const existing = readJson<Attribution>(store, key);

  if (existing && isAttributionShape(existing)) {
    return { firstTouch: existing, lastTouch, isNew: false };
  }

  writeJson(store, key, lastTouch);
  return { firstTouch: lastTouch, lastTouch, isNew: true };
}

function isAttributionShape(value: unknown): value is Attribution {
  return (
    typeof value === 'object' &&
    value !== null &&
    'capturedAt' in value &&
    'landingPage' in value
  );
}

/** Read the stored first-touch attribution, if any. */
export function getStoredAttribution(
  store: KeyValueStore,
  storageKey: string = ATTRIBUTION_STORAGE_KEY,
): Attribution | null {
  const value = readJson<Attribution>(store, storageKey);
  return value && isAttributionShape(value) ? value : null;
}
