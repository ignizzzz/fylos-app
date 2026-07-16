import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountConsentBanner } from '../src/consent/consentBanner';
import type { ConsentBannerController } from '../src/consent/consentBanner';
import { ConsentStore } from '../src/consent/consentStore';
import { MemoryStore } from '../src/storage';

const now = () => new Date('2026-07-15T12:00:00.000Z');

let store: ConsentStore;
let ctrl: ConsentBannerController;

function shadow(): ShadowRoot {
  const host = document.getElementById('fylos-consent-root');
  if (!host || !host.shadowRoot) throw new Error('banner not mounted');
  return host.shadowRoot;
}

function q<T extends Element>(sel: string): T {
  const node = shadow().querySelector<T>(sel);
  if (!node) throw new Error(`missing ${sel}`);
  return node;
}

beforeEach(() => {
  document.body.innerHTML = '';
  store = new ConsentStore(new MemoryStore(), { now });
  ctrl = mountConsentBanner(store);
});

afterEach(() => {
  ctrl.destroy();
});

describe('consent banner', () => {
  it('renders inside a shadow root and shows the banner when consent is unset', () => {
    const host = document.getElementById('fylos-consent-root');
    expect(host).not.toBeNull();
    expect(host?.shadowRoot).toBeTruthy();
    expect(q<HTMLElement>('.banner').hidden).toBe(false);
  });

  it('Accept all grants everything and hides the banner', () => {
    q<HTMLButtonElement>('.banner .btn-primary').click();
    expect(store.isGranted('analytics')).toBe(true);
    expect(store.isGranted('marketing')).toBe(true);
    expect(q<HTMLElement>('.banner').hidden).toBe(true);
  });

  it('Necessary only rejects nonessential and hides the banner', () => {
    q<HTMLButtonElement>('.banner .btn-secondary').click();
    expect(store.hasDecision()).toBe(true);
    expect(store.isGranted('analytics')).toBe(false);
    expect(store.isGranted('marketing')).toBe(false);
    expect(q<HTMLElement>('.banner').hidden).toBe(true);
  });

  it('Preferences lets the user select categories and save', () => {
    q<HTMLButtonElement>('.banner .btn-ghost').click();
    expect(q<HTMLElement>('.overlay').hidden).toBe(false);

    const inputs = shadow().querySelectorAll<HTMLInputElement>('.item input');
    // [0] necessary, [1] analytics, [2] marketing
    inputs[1].checked = true;
    inputs[2].checked = false;
    q<HTMLButtonElement>('.dialog-actions .btn-primary').click();

    expect(store.isGranted('analytics')).toBe(true);
    expect(store.isGranted('marketing')).toBe(false);
    expect(q<HTMLElement>('.overlay').hidden).toBe(true);
  });

  it('the necessary toggle is always on and disabled', () => {
    const necessary = shadow().querySelectorAll<HTMLInputElement>('.item input')[0];
    expect(necessary.checked).toBe(true);
    expect(necessary.disabled).toBe(true);
  });

  it('can be reopened after a decision via a [data-fylos-consent-open] element', () => {
    store.acceptAll();
    expect(q<HTMLElement>('.banner').hidden).toBe(true);

    const link = document.createElement('button');
    link.setAttribute('data-fylos-consent-open', '');
    document.body.appendChild(link);
    link.click();

    expect(q<HTMLElement>('.overlay').hidden).toBe(false);
  });

  it('reopens via the programmatic controller too', () => {
    store.acceptAll();
    ctrl.openPreferences();
    expect(q<HTMLElement>('.overlay').hidden).toBe(false);
    ctrl.closePreferences();
    expect(q<HTMLElement>('.overlay').hidden).toBe(true);
  });

  it('Escape closes the dialog', () => {
    ctrl.openPreferences();
    q<HTMLElement>('.dialog').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(q<HTMLElement>('.overlay').hidden).toBe(true);
  });

  it('shows the banner again after a reset', () => {
    store.acceptAll();
    expect(q<HTMLElement>('.banner').hidden).toBe(true);
    store.reset();
    expect(q<HTMLElement>('.banner').hidden).toBe(false);
  });

  it('reflects prior consent by pre-checking toggles', () => {
    store.savePreferences({ analytics: true, marketing: false });
    ctrl.openPreferences();
    const inputs = shadow().querySelectorAll<HTMLInputElement>('.item input');
    expect(inputs[1].checked).toBe(true);
    expect(inputs[2].checked).toBe(false);
  });

  it('re-mounting tears down the previous instance (no leaked listeners)', () => {
    const openA = vi.fn();
    const openB = vi.fn();
    // beforeEach already mounted `ctrl`; mounting again on the same rootId must
    // tear the prior instance down rather than leak its listeners.
    const a = mountConsentBanner(store, { onOpen: openA });
    const b = mountConsentBanner(store, { onOpen: openB });
    ctrl = b; // let afterEach clean up the latest

    expect(document.querySelectorAll('#fylos-consent-root').length).toBe(1);

    const link = document.createElement('button');
    link.setAttribute('data-fylos-consent-open', '');
    document.body.appendChild(link);
    link.click();

    // Only the latest instance responds; the torn-down one does not.
    expect(openB).toHaveBeenCalledTimes(1);
    expect(openA).not.toHaveBeenCalled();
    void a;
  });

  it('destroy removes the host element', () => {
    ctrl.destroy();
    expect(document.getElementById('fylos-consent-root')).toBeNull();
    // re-mount so afterEach destroy is a no-op-safe call
    ctrl = mountConsentBanner(store);
  });
});
