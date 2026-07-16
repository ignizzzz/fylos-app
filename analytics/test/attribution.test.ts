import { describe, it, expect } from 'vitest';
import {
  captureAttribution,
  readTouch,
  getStoredAttribution,
  ATTRIBUTION_STORAGE_KEY,
} from '../src/attribution';
import { MemoryStore } from '../src/storage';

const now = () => new Date('2026-07-15T12:00:00.000Z');

describe('readTouch', () => {
  it('captures all five UTM params, referrer and landing page', () => {
    const touch = readTouch({
      now,
      source: {
        search:
          '?utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale&utm_content=hero-cta&utm_term=dog+walker',
        pathname: '/why',
        referrer: 'https://www.google.com/search?q=fylos',
      },
    });
    expect(touch.utmSource).toBe('newsletter');
    expect(touch.utmMedium).toBe('email');
    expect(touch.utmCampaign).toBe('spring-sale');
    expect(touch.utmContent).toBe('hero-cta');
    expect(touch.utmTerm).toBe('dog walker');
    expect(touch.referrer).toBe('https://www.google.com/search');
    expect(touch.landingPage).toBe('/why');
    expect(touch.capturedAt).toBe('2026-07-15T12:00:00.000Z');
  });

  it('nulls missing params and strips referrer query', () => {
    const touch = readTouch({
      now,
      source: { search: '', pathname: '/', referrer: 'https://t.co/abc?x=1' },
    });
    expect(touch.utmSource).toBeNull();
    expect(touch.utmMedium).toBeNull();
    expect(touch.referrer).toBe('https://t.co/abc');
    expect(touch.landingPage).toBe('/');
  });

  it('treats an empty referrer as null', () => {
    const touch = readTouch({ now, source: { search: '', pathname: '/join', referrer: '' } });
    expect(touch.referrer).toBeNull();
  });
});

describe('captureAttribution first-touch', () => {
  it('persists the first touch and returns it thereafter', () => {
    const store = new MemoryStore();
    const first = captureAttribution(store, {
      now,
      source: { search: '?utm_source=first', pathname: '/', referrer: '' },
    });
    expect(first.isNew).toBe(true);
    expect(first.firstTouch.utmSource).toBe('first');

    // A later page load with different attribution must NOT overwrite first-touch.
    const second = captureAttribution(store, {
      now,
      source: { search: '?utm_source=second', pathname: '/why', referrer: '' },
    });
    expect(second.isNew).toBe(false);
    expect(second.firstTouch.utmSource).toBe('first');
    expect(second.lastTouch.utmSource).toBe('second');
  });

  it('exposes the stored first touch', () => {
    const store = new MemoryStore();
    captureAttribution(store, {
      now,
      source: { search: '?utm_campaign=abc', pathname: '/', referrer: '' },
    });
    const stored = getStoredAttribution(store);
    expect(stored?.utmCampaign).toBe('abc');
    expect(store.get(ATTRIBUTION_STORAGE_KEY)).not.toBeNull();
  });
});
