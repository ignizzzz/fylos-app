import { describe, it, expect, beforeEach } from 'vitest';
import { createFylosAnalytics } from '../src/bootstrap';
import { MemoryAdapter } from '../src/adapter';
import { MemoryStore } from '../src/storage';

const now = () => new Date('2026-07-15T12:00:00.000Z');

function make() {
  const adapter = new MemoryAdapter();
  const store = new MemoryStore();
  const fylos = createFylosAnalytics({ adapter, store, now, banner: false });
  return { fylos, adapter, store };
}

describe('createFylosAnalytics', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps nonessential analytics disabled before consent', () => {
    const { fylos, adapter } = make();
    fylos.ctaClick({ ctaId: 'hero' });
    fylos.storytellingStarted({ storyId: 'film' });
    fylos.formSubmitted({ formId: 'join', fields: ['name'] });
    expect(adapter.events).toHaveLength(0);
    expect(fylos.getConsent().status).toBe('unset');
  });

  it('flows events after acceptAll and stamps context', () => {
    const { fylos, adapter } = make();
    fylos.acceptAll();
    expect(fylos.getConsent().analytics).toBe(true);
    const ok = fylos.ctaClick({ ctaId: 'hero', label: 'Get ID' });
    expect(ok).toBe(true);
    expect(adapter.events).toHaveLength(1);
    expect(adapter.events[0].context.consent.analytics).toBe(true);
    expect(adapter.events[0].context.attribution).toBeTruthy();
  });

  it('exposes first-touch attribution', () => {
    const { fylos } = make();
    const attr = fylos.getAttribution();
    expect(attr).toHaveProperty('landingPage');
    expect(attr).toHaveProperty('capturedAt');
  });

  it('does not mount a banner when banner:false', () => {
    make();
    expect(document.getElementById('fylos-consent-root')).toBeNull();
  });

  it('supports swapping the adapter at runtime', () => {
    const { fylos } = make();
    fylos.acceptAll();
    const next = new MemoryAdapter();
    fylos.setAdapter(next);
    fylos.downloadClicked({ target: 'app', platform: 'ios' });
    expect(next.events).toHaveLength(1);
    expect(next.events[0].name).toBe('download_clicked');
  });

  it('persists consent across instances (same storage)', () => {
    const store = new MemoryStore();
    createFylosAnalytics({ store, now, banner: false }).acceptAll();
    const second = createFylosAnalytics({ store, now, banner: false });
    expect(second.getConsent().analytics).toBe(true);
  });

  it('reuses one sessionId across page loads (sessionStorage-backed)', () => {
    sessionStorage.clear();
    const a1 = new MemoryAdapter();
    const f1 = createFylosAnalytics({ adapter: a1, store: new MemoryStore(), now, banner: false });
    f1.acceptAll();
    f1.ctaClick({ ctaId: 'x' });

    const a2 = new MemoryAdapter();
    const f2 = createFylosAnalytics({ adapter: a2, store: new MemoryStore(), now, banner: false });
    f2.acceptAll();
    f2.ctaClick({ ctaId: 'y' });

    expect(a1.events[0].context.sessionId).toBe(a2.events[0].context.sessionId);
  });
});
