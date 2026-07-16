/**
 * @fylos/analytics — public API.
 *
 * Typed, replaceable, consent-gated, PII-safe frontend analytics for the Fylos
 * website. No real analytics provider is wired here; swap in an adapter to
 * connect one later.
 */

export * from './types';
export * from './events';
export * from './storage';
export * from './pii';
export * from './attribution';
export * from './consent/consentStore';
export * from './consent/consentBanner';
export * from './adapter';
export * from './analytics';
export * from './dom';
export * from './bootstrap';
export { LIBRARY_VERSION, CONSENT_SCHEMA_VERSION } from './version';
