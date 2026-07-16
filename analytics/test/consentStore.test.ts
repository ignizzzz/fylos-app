import { describe, it, expect, vi } from 'vitest';
import { ConsentStore, CONSENT_STORAGE_KEY } from '../src/consent/consentStore';
import { MemoryStore } from '../src/storage';

const fixedNow = () => new Date('2026-07-15T10:00:00.000Z');

function make(store = new MemoryStore()) {
  return { store, consent: new ConsentStore(store, { now: fixedNow }) };
}

describe('ConsentStore', () => {
  it('starts unset with nonessential categories disabled', () => {
    const { consent } = make();
    const state = consent.getState();
    expect(state.status).toBe('unset');
    expect(state.categories.necessary).toBe(true);
    expect(state.categories.analytics).toBe(false);
    expect(state.categories.marketing).toBe(false);
    expect(consent.hasDecision()).toBe(false);
    expect(consent.isGranted('necessary')).toBe(true);
    expect(consent.isGranted('analytics')).toBe(false);
    expect(consent.isGranted('marketing')).toBe(false);
  });

  it('acceptAll grants both nonessential categories', () => {
    const { consent } = make();
    consent.acceptAll();
    expect(consent.hasDecision()).toBe(true);
    expect(consent.isGranted('analytics')).toBe(true);
    expect(consent.isGranted('marketing')).toBe(true);
    expect(consent.getState().updatedAt).toBe('2026-07-15T10:00:00.000Z');
  });

  it('necessaryOnly rejects both nonessential categories', () => {
    const { consent } = make();
    consent.necessaryOnly();
    expect(consent.hasDecision()).toBe(true);
    expect(consent.isGranted('analytics')).toBe(false);
    expect(consent.isGranted('marketing')).toBe(false);
    expect(consent.isGranted('necessary')).toBe(true);
  });

  it('savePreferences honours a per-category selection', () => {
    const { consent } = make();
    consent.savePreferences({ analytics: true, marketing: false });
    expect(consent.isGranted('analytics')).toBe(true);
    expect(consent.isGranted('marketing')).toBe(false);
  });

  it('setCategory flips one category, keeping the other', () => {
    const { consent } = make();
    consent.savePreferences({ analytics: true, marketing: true });
    consent.setCategory('marketing', false);
    expect(consent.isGranted('analytics')).toBe(true);
    expect(consent.isGranted('marketing')).toBe(false);
  });

  it('persists the decision and reloads it', () => {
    const store = new MemoryStore();
    make(store).consent.savePreferences({ analytics: true, marketing: false });
    // Fresh store instance over the same backing storage.
    const reloaded = new ConsentStore(store, { now: fixedNow });
    expect(reloaded.hasDecision()).toBe(true);
    expect(reloaded.isGranted('analytics')).toBe(true);
    expect(reloaded.isGranted('marketing')).toBe(false);
  });

  it('re-prompts (unset) when the stored schema version differs', () => {
    const store = new MemoryStore();
    new ConsentStore(store, { version: 1, now: fixedNow }).acceptAll();
    const bumped = new ConsentStore(store, { version: 2, now: fixedNow });
    expect(bumped.hasDecision()).toBe(false);
    expect(bumped.isGranted('analytics')).toBe(false);
  });

  it('re-pins necessary=true even if storage was tampered', () => {
    const store = new MemoryStore();
    store.set(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        status: 'set',
        categories: { necessary: false, analytics: false, marketing: false },
        updatedAt: '2026-01-01T00:00:00.000Z',
      }),
    );
    const consent = new ConsentStore(store, { version: 1, now: fixedNow });
    expect(consent.isGranted('necessary')).toBe(true);
  });

  it('notifies subscribers with the decision source', () => {
    const { consent } = make();
    const listener = vi.fn();
    const unsub = consent.subscribe(listener);
    consent.acceptAll();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][1]).toBe('accept_all');
    unsub();
    consent.necessaryOnly();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reset returns to unset and clears storage', () => {
    const store = new MemoryStore();
    const consent = new ConsentStore(store, { now: fixedNow });
    consent.acceptAll();
    consent.reset();
    expect(consent.hasDecision()).toBe(false);
    expect(store.get(CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('a throwing listener does not break other listeners', () => {
    const { consent } = make();
    const good = vi.fn();
    consent.subscribe(() => {
      throw new Error('boom');
    });
    consent.subscribe(good);
    expect(() => consent.acceptAll()).not.toThrow();
    expect(good).toHaveBeenCalled();
  });
});
