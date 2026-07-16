/**
 * Browser drop-in entry.
 *
 * Built to `dist/fylos-analytics.global.js` (IIFE). Include it on any static
 * page with a single tag and it will, once the DOM is ready:
 *   - capture attribution,
 *   - mount the consent banner,
 *   - enable declarative `data-fylos-*` click tracking,
 *   - expose `window.FylosAnalytics` and `window.FylosConsent`.
 *
 * No page layout changes are required.
 *
 * Optional configuration (set BEFORE the script tag):
 *   <script>window.FylosAnalyticsConfig = { debug: true };</script>
 *   <script defer src="/analytics/fylos-analytics.global.js"></script>
 */

import { createFylosAnalytics } from './bootstrap';
import type { FylosAnalytics, FylosAnalyticsConfig } from './bootstrap';
import { initAutoTracking } from './dom';
import type { ConsentPreferences, ConsentSnapshot } from './types';

declare global {
  interface Window {
    FylosAnalyticsConfig?: FylosAnalyticsConfig;
    FylosAnalytics?: FylosAnalytics;
    FylosConsent?: {
      openPreferences(): void;
      acceptAll(): void;
      necessaryOnly(): void;
      savePreferences(prefs: ConsentPreferences): void;
      get(): ConsentSnapshot;
    };
  }
}

/** Bootstrap the default instance and expose globals. Idempotent. */
export function boot(): FylosAnalytics | undefined {
  if (typeof window === 'undefined') return undefined;
  if (window.FylosAnalytics) return window.FylosAnalytics;

  const instance = createFylosAnalytics(window.FylosAnalyticsConfig ?? {});
  initAutoTracking(instance);

  window.FylosAnalytics = instance;
  window.FylosConsent = {
    openPreferences: () => instance.openPreferences(),
    acceptAll: () => instance.acceptAll(),
    necessaryOnly: () => instance.necessaryOnly(),
    savePreferences: (prefs) => instance.savePreferences(prefs),
    get: () => instance.getConsent(),
  };

  return instance;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot(), { once: true });
  } else {
    boot();
  }
}

export { createFylosAnalytics };
