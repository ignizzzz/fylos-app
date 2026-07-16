import { describe, it, expect } from 'vitest';
import { MemoryAdapter } from '../src/adapter';

// The browser entry boots on import. We inject a MemoryAdapter via the global
// config BEFORE importing it (dynamic import), so we can observe events.
describe('browser entry', () => {
  it('boots, exposes globals, wires consent and auto-tracking', async () => {
    document.body.innerHTML = '';
    const adapter = new MemoryAdapter();
    (window as unknown as { FylosAnalyticsConfig: unknown }).FylosAnalyticsConfig = { adapter };

    const mod = await import('../src/browser');
    const instance = mod.boot();
    expect(instance).toBeDefined();

    const w = window as unknown as {
      FylosAnalytics?: { acceptAll(): void };
      FylosConsent?: { get(): { analytics: boolean }; openPreferences(): void };
    };
    expect(w.FylosAnalytics).toBeDefined();
    expect(w.FylosConsent).toBeDefined();

    // Nonessential disabled until consent.
    const link = document.createElement('a');
    link.setAttribute('data-fylos-event', 'cta_click');
    link.setAttribute('data-fylos-cta-id', 'hero');
    document.body.appendChild(link);
    link.click();
    expect(adapter.events).toHaveLength(0);

    // Grant, then it flows.
    w.FylosConsent!.get(); // smoke
    w.FylosAnalytics!.acceptAll();
    link.click();
    expect(adapter.events).toHaveLength(1);
    expect(adapter.events[0].name).toBe('cta_click');

    // The consent banner mounted into the DOM.
    expect(document.getElementById('fylos-consent-root')).not.toBeNull();
  });
});
