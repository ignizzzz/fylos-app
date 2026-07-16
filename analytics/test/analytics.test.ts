import { describe, it, expect } from 'vitest';
import { Analytics } from '../src/analytics';
import type { AnalyticsOptions } from '../src/analytics';
import { ConsentStore } from '../src/consent/consentStore';
import { MemoryAdapter } from '../src/adapter';
import { MemoryStore } from '../src/storage';
import { readTouch } from '../src/attribution';

const now = () => new Date('2026-07-15T12:00:00.000Z');

function setup(extra: Partial<AnalyticsOptions> = {}) {
  const store = new MemoryStore();
  const consent = new ConsentStore(store, { now });
  const adapter = new MemoryAdapter();
  const attribution = readTouch({
    now,
    source: {
      search: '?utm_source=news&utm_medium=email',
      pathname: '/why',
      referrer: 'https://google.com/search?q=x',
    },
  });
  const analytics = new Analytics({
    adapter,
    consent,
    attribution,
    now,
    getPage: () => ({ path: '/why', title: 'Why Fylos' }),
    ...extra,
  });
  return { store, consent, adapter, analytics };
}

describe('consent gating', () => {
  it('drops nonessential events before a consent decision', () => {
    const { analytics, adapter } = setup();
    expect(analytics.ctaClick({ ctaId: 'hero' })).toBe(false);
    expect(analytics.storytellingStarted({ storyId: 'film' })).toBe(false);
    expect(adapter.events).toHaveLength(0);
  });

  it('sends events once analytics consent is granted', () => {
    const { analytics, adapter, consent } = setup();
    consent.acceptAll();
    expect(analytics.ctaClick({ ctaId: 'hero', label: 'Get ID' })).toBe(true);
    expect(adapter.events).toHaveLength(1);
    expect(adapter.events[0].name).toBe('cta_click');
    expect(adapter.events[0].category).toBe('analytics');
  });

  it('keeps blocking analytics events after necessary-only', () => {
    const { analytics, adapter, consent } = setup();
    consent.necessaryOnly();
    expect(analytics.featureViewed({ feature: 'vet' })).toBe(false);
    expect(adapter.events).toHaveLength(0);
  });

  it('always allows events overridden to the necessary category', () => {
    const { analytics, adapter } = setup({ categoryOverrides: { cta_click: 'necessary' } });
    // No consent decision at all, yet a necessary event still flows.
    expect(analytics.ctaClick({ ctaId: 'essential' })).toBe(true);
    expect(adapter.events).toHaveLength(1);
    expect(adapter.events[0].category).toBe('necessary');
  });

  it('notifies the adapter of consent changes', () => {
    const { adapter, consent } = setup();
    consent.acceptAll();
    expect(adapter.consentChanges.at(-1)?.analytics).toBe(true);
  });
});

describe('pre-consent queue (opt-in)', () => {
  it('buffers then flushes on accept when enabled', () => {
    const { analytics, adapter, consent } = setup({ queueBeforeConsent: true });
    analytics.ctaClick({ ctaId: 'a' });
    analytics.ctaClick({ ctaId: 'b' });
    expect(analytics.pendingCount()).toBe(2);
    expect(adapter.events).toHaveLength(0);
    consent.acceptAll();
    expect(adapter.events.map((e) => e.props.ctaId)).toEqual(['a', 'b']);
    expect(analytics.pendingCount()).toBe(0);
  });

  it('drops the buffer on necessary-only', () => {
    const { analytics, adapter, consent } = setup({ queueBeforeConsent: true });
    analytics.ctaClick({ ctaId: 'a' });
    consent.necessaryOnly();
    expect(adapter.events).toHaveLength(0);
    expect(analytics.pendingCount()).toBe(0);
  });

  it('drops nothing by default (queue disabled)', () => {
    const { analytics, consent, adapter } = setup();
    analytics.ctaClick({ ctaId: 'a' });
    expect(analytics.pendingCount()).toBe(0);
    consent.acceptAll();
    expect(adapter.events).toHaveLength(0);
  });
});

describe('envelope context', () => {
  it('attaches attribution, consent and session, but no PII', () => {
    const { analytics, adapter, consent } = setup();
    consent.acceptAll();
    analytics.articleViewed({ articleId: 'why', title: 'Why Fylos' });
    const env = adapter.events[0];
    expect(env.context.attribution.utmSource).toBe('news');
    expect(env.context.attribution.referrer).toBe('https://google.com/search');
    expect(env.context.consent.analytics).toBe(true);
    expect(env.context.page.path).toBe('/why');
    expect(typeof env.context.sessionId).toBe('string');
    expect(env.context.libraryVersion).toBeTruthy();
  });

  it('sanitizes PII out of payloads end to end', () => {
    const { analytics, adapter, consent } = setup();
    consent.acceptAll();
    // Dynamic path with PII smuggled in; guard must strip it.
    analytics.track('form_submitted', {
      formId: 'join',
      fields: ['name', 'email'],
      name: 'Jane Roe',
      email: 'jane@roe.com',
      message: 'my dog has a skin condition',
    } as never);
    const props = adapter.events[0].props;
    expect(props.formId).toBe('join');
    expect(props.fields).toEqual(['name', 'email']); // field NAMES are fine
    expect(props.name).toBe('[redacted]');
    expect(props.email).toBe('[redacted]');
    expect(props.message).toBe('[redacted]');
  });
});

describe('context is PII-safe (not just props)', () => {
  it('redacts PII in document.title before it reaches the adapter', () => {
    const store = new MemoryStore();
    const consent = new ConsentStore(store, { now });
    const adapter = new MemoryAdapter();
    const analytics = new Analytics({
      adapter,
      consent,
      attribution: readTouch({ now, source: { search: '', pathname: '/', referrer: '' } }),
      now,
      getPage: () => ({ path: '/account', title: 'Rex diabetes plan owner john.doe@example.com' }),
    });
    consent.acceptAll();
    analytics.ctaClick({ ctaId: 'x' });
    const title = adapter.events[0].context.page.title;
    expect(title).toBe('[redacted]');
  });

  it('redacts an email embedded in the URL path', () => {
    const store = new MemoryStore();
    const consent = new ConsentStore(store, { now });
    const adapter = new MemoryAdapter();
    const analytics = new Analytics({
      adapter,
      consent,
      attribution: readTouch({ now, source: { search: '', pathname: '/', referrer: '' } }),
      now,
      getPage: () => ({ path: '/verify/john.doe@example.com' }),
    });
    consent.acceptAll();
    analytics.ctaClick({ ctaId: 'x' });
    expect(adapter.events[0].context.page.path).toBe('[redacted]');
  });

  it('drops UTM values that look like an email or phone at capture', () => {
    const touch = readTouch({
      now,
      source: {
        search: '?utm_source=newsletter&utm_term=john.doe@example.com&utm_content=%2B41791234567',
        pathname: '/',
        referrer: '',
      },
    });
    expect(touch.utmSource).toBe('newsletter');
    expect(touch.utmTerm).toBeNull();
    expect(touch.utmContent).toBeNull();
  });
});

describe('adapter replaceability', () => {
  it('swaps the adapter at runtime', () => {
    const { analytics, consent } = setup();
    consent.acceptAll();
    const next = new MemoryAdapter();
    analytics.setAdapter(next);
    analytics.ctaClick({ ctaId: 'after-swap' });
    expect(next.events).toHaveLength(1);
    expect(next.initialized).toBe(true);
  });

  it('survives an adapter that throws', () => {
    const { consent } = setup();
    const store = new MemoryStore();
    const c = new ConsentStore(store, { now });
    const throwing = {
      name: 'boom',
      track() {
        throw new Error('nope');
      },
    };
    const a = new Analytics({
      adapter: throwing,
      consent: c,
      attribution: readTouch({ now, source: { search: '', pathname: '/', referrer: '' } }),
      now,
    });
    c.acceptAll();
    expect(() => a.ctaClick({ ctaId: 'x' })).not.toThrow();
    void consent;
  });
});
