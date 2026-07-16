/**
 * PII guard — the single sanitization choke point.
 *
 * The typed event catalogue already excludes personal data at compile time.
 * This module is the runtime second line of defence: every payload that reaches
 * an adapter is first passed through `sanitizeProps`, which:
 *   - drops/redacts values under keys that name personal or pet-health data
 *     (name, email, phone, message, address, diagnosis, medication, weight ...),
 *   - redacts any value that looks like an email address or phone number,
 *   - strips query strings from URL-ish values (so query PII can't leak),
 *   - redacts over-long free text (likely a typed message),
 *   - ignores prototype-polluting keys.
 *
 * The result is that names, emails, messages and pet health information can
 * never reach analytics, even via the dynamic escape hatch.
 */

import type { PiiGuardOptions, PiiReason } from './types';

/** Property names (normalized) that must never have their value sent. */
const BUILT_IN_DENIED_KEYS: readonly string[] = [
  // identity
  'name', 'firstname', 'lastname', 'fullname', 'surname', 'givenname',
  'familyname', 'middlename', 'maidenname', 'username', 'nickname',
  'displayname', 'contactname', 'yourname',
  // contact
  'email', 'emailaddress', 'mail', 'useremail', 'contactemail',
  'phone', 'phonenumber', 'telephone', 'tel', 'mobile', 'mobilenumber',
  'mobilephone', 'whatsapp', 'cell',
  // secrets / financial
  'password', 'passwd', 'pwd', 'pin', 'otp', 'secret', 'token', 'apikey',
  'accesstoken', 'ssn', 'socialsecurity', 'passport', 'passportnumber',
  'nationalid', 'taxid', 'iban', 'bankaccount', 'creditcard', 'cardnumber',
  'cardno', 'cvv', 'cvc',
  // free-text messages
  'message', 'msg', 'note', 'notes', 'comment', 'comments', 'feedback',
  'freetext', 'enquiry', 'inquiry',
  // postal address
  'address', 'streetaddress', 'street', 'addressline', 'addressline1',
  'addressline2', 'postalcode', 'postcode', 'zip', 'zipcode',
  // dates of birth
  'dob', 'dateofbirth', 'birthdate', 'birthday',
  // pet / human health
  'health', 'healthbook', 'medical', 'medicalhistory', 'diagnosis',
  'diagnoses', 'symptom', 'symptoms', 'medication', 'medications',
  'prescription', 'prescriptions', 'vaccine', 'vaccines', 'vaccination',
  'vaccinations', 'allergy', 'allergies', 'condition', 'conditions',
  'treatment', 'treatments', 'illness', 'weight', 'microchip', 'chipid',
  'petweight', 'pethealth',
  // precise location
  'latitude', 'longitude', 'geolocation', 'coordinates',
];

/** Keys whose string values are URL-shaped and must be query-stripped. */
const URL_KEYS: readonly string[] = [
  'href', 'url', 'link', 'referrer', 'referer', 'landingpage', 'page',
  'pageurl', 'redirect', 'src', 'uri',
];

/** Keys that would pollute the prototype chain; never copied. */
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Technical keys that legitimately end in "name" but are NOT personal data, so
 * the compound-name heuristic below must not redact them. `formname` covers the
 * typed `formName` event field.
 */
const NAME_SUFFIX_ALLOWLIST = new Set([
  'formname', 'filename', 'eventname', 'featurename', 'classname', 'hostname',
  'tagname', 'pathname', 'domainname', 'appname', 'pagename', 'sitename',
  'fieldname', 'stepname',
]);

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
/** A run of 9-15 digits with optional phone punctuation. */
const PHONE_RE = /(?:\+?\d[\d\s\-().]{7,}\d)/;

const DEFAULT_REDACTION_TOKEN = '[redacted]';
const DEFAULT_MAX_STRING_LENGTH = 500;

/** Normalize a property key: lowercase, strip everything non-alphanumeric. */
export function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Does this property name denote personal / sensitive data? */
export function isPiiKey(key: string, deniedKeys?: string[]): boolean {
  const norm = normalizeKey(key);
  if (!norm) return false;
  if (BUILT_IN_DENIED_KEYS.includes(norm)) return true;
  if (deniedKeys) {
    for (const extra of deniedKeys) {
      if (normalizeKey(extra) === norm) return true;
    }
  }
  // Compound keys the exact list cannot enumerate: anything ending in "email" or
  // "phone" is contact PII; anything ending in "name" is a person/pet name
  // unless it is a known technical key (ownerName, petName -> denied; formName,
  // fileName -> allowed).
  if (/(?:email|phone)$/.test(norm)) return true;
  if (/name$/.test(norm) && !NAME_SUFFIX_ALLOWLIST.has(norm)) return true;
  return false;
}

/** Does this string contain an email address? */
export function looksLikeEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

/** Does this string look like a phone number (9-15 digits)? */
export function looksLikePhone(value: string): boolean {
  if (!PHONE_RE.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

function isUrlKey(key: string): boolean {
  return URL_KEYS.includes(normalizeKey(key));
}

/** Strip query string, fragment and any embedded address from a URL value. */
export function sanitizeUrlValue(value: string): string {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  // Collapse address-bearing schemes to the scheme only.
  if (lower.startsWith('mailto:')) return 'mailto:';
  if (lower.startsWith('tel:')) return 'tel:';
  // For absolute URLs, keep origin + path; otherwise keep the part before ?/#.
  const cut = trimmed.split(/[?#]/, 1)[0] ?? trimmed;
  return cut;
}

class PiiViolation extends Error {
  constructor(
    public readonly path: string,
    public readonly reason: PiiReason,
  ) {
    super(`PII guard: "${path}" blocked (${reason})`);
    this.name = 'PiiViolation';
  }
}

interface ResolvedOptions {
  deniedKeys: string[] | undefined;
  redactionToken: string;
  maxStringLength: number;
  throwOnViolation: boolean;
  onRedact: ((info: { path: string; reason: PiiReason }) => void) | undefined;
}

function resolveOptions(options?: PiiGuardOptions): ResolvedOptions {
  return {
    deniedKeys: options?.deniedKeys,
    redactionToken: options?.redactionToken ?? DEFAULT_REDACTION_TOKEN,
    maxStringLength: options?.maxStringLength ?? DEFAULT_MAX_STRING_LENGTH,
    throwOnViolation: options?.throwOnViolation ?? false,
    onRedact: options?.onRedact,
  };
}

function flag(opts: ResolvedOptions, path: string, reason: PiiReason): string {
  if (opts.throwOnViolation) throw new PiiViolation(path, reason);
  opts.onRedact?.({ path, reason });
  return opts.redactionToken;
}

function sanitizeString(
  value: string,
  key: string | null,
  path: string,
  opts: ResolvedOptions,
): string {
  let out = value;
  if (key != null && isUrlKey(key)) {
    out = sanitizeUrlValue(out);
  }
  if (looksLikeEmail(out)) return flag(opts, path, 'email_pattern');
  if (looksLikePhone(out)) return flag(opts, path, 'phone_pattern');
  if (out.length > opts.maxStringLength) return flag(opts, path, 'free_text_length');
  return out;
}

function sanitizeValue(
  value: unknown,
  key: string | null,
  path: string,
  opts: ResolvedOptions,
): unknown {
  if (value == null) return value;

  const t = typeof value;
  if (t === 'string') return sanitizeString(value as string, key, path, opts);
  if (t === 'number' || t === 'boolean') return value;
  if (t === 'bigint') return value.toString();
  if (t === 'function' || t === 'symbol') return undefined;

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item, i) => sanitizeValue(item, null, `${path}[${i}]`, opts));
  }

  if (t === 'object') {
    return sanitizeObject(value as Record<string, unknown>, path, opts);
  }

  return undefined;
}

function sanitizeObject(
  obj: Record<string, unknown>,
  basePath: string,
  opts: ResolvedOptions,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    const path = basePath ? `${basePath}.${key}` : key;
    if (isPiiKey(key, opts.deniedKeys)) {
      out[key] = flag(opts, path, 'denied_key');
      continue;
    }
    const cleaned = sanitizeValue(obj[key], key, path, opts);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

/**
 * Return a sanitized deep copy of an event payload. The input is never mutated.
 * Guarantees the output carries no denied keys, no email/phone-shaped strings,
 * no query strings on URL-ish fields, and no over-long free text.
 */
export function sanitizeProps<T extends Record<string, unknown>>(
  props: T,
  options?: PiiGuardOptions,
): Record<string, unknown> {
  const opts = resolveOptions(options);
  return sanitizeObject(props, '', opts);
}

export { PiiViolation };
