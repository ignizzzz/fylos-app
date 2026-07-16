/**
 * Consent banner + preferences dialog (framework-agnostic, vanilla DOM).
 *
 * Rendered inside a Shadow DOM attached to a single injected host element, so
 * its styles cannot leak into or be affected by the host page. This is what
 * lets the infrastructure drop into any page WITHOUT touching page layout or
 * CSS.
 *
 * Surfaces required by the brief:
 *   - the banner itself,
 *   - "Necessary only",
 *   - "Accept all",
 *   - "Preferences" with per-category selection (analytics + marketing consent),
 *   - a way to reopen preferences later.
 */

import type { ConsentStore } from './consentStore';

export interface ConsentBannerTexts {
  bannerTitle: string;
  bannerBody: string;
  acceptAll: string;
  necessaryOnly: string;
  preferences: string;
  dialogTitle: string;
  dialogIntro: string;
  save: string;
  close: string;
  necessaryLabel: string;
  necessaryState: string;
  necessaryDesc: string;
  analyticsLabel: string;
  analyticsDesc: string;
  marketingLabel: string;
  marketingDesc: string;
}

export interface ConsentBannerOptions {
  /**
   * Selectors that, when clicked anywhere on the page, reopen the preferences
   * dialog. Defaults to `[data-fylos-consent-open]`. Add e.g. a footer
   * "Cookie preferences" link's selector here to wire it without editing HTML.
   */
  reopenSelectors?: string[];
  /** Copy overrides / localization. */
  texts?: Partial<ConsentBannerTexts>;
  /** Host element id (default "fylos-consent-root"). */
  rootId?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface ConsentBannerController {
  openPreferences(): void;
  closePreferences(): void;
  showBanner(): void;
  hideBanner(): void;
  destroy(): void;
  readonly root: HTMLElement | null;
}

const DEFAULT_TEXTS: ConsentBannerTexts = {
  bannerTitle: 'Your privacy, your call',
  bannerBody:
    'We use necessary cookies to run this site. With your permission we also use analytics and marketing cookies to see what works and reach the right people. You can change this any time.',
  acceptAll: 'Accept all',
  necessaryOnly: 'Necessary only',
  preferences: 'Preferences',
  dialogTitle: 'Privacy preferences',
  dialogIntro:
    'Choose what you are comfortable with. Necessary cookies are always on. We never collect your name, email, messages or any pet health information.',
  save: 'Save preferences',
  close: 'Close',
  necessaryLabel: 'Necessary',
  necessaryState: 'Always on',
  necessaryDesc: 'Required for the site to work. These do not track you across sites.',
  analyticsLabel: 'Analytics',
  analyticsDesc:
    'Helps us see which parts of the story people reach, so we can make it better. Anonymous only.',
  marketingLabel: 'Marketing',
  marketingDesc: 'Lets us measure campaigns and reach people who would love Fylos.',
};

const STYLES = `
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; }
.wrap {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #2B2320;
}
button { font-family: inherit; cursor: pointer; border: 0; }

.banner {
  position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 2147483000;
  max-width: 560px; margin: 0 auto;
  background: #FBF7F2; border: 1px solid rgba(43,35,32,.08);
  border-radius: 20px; padding: 20px 22px;
  box-shadow: 0 12px 40px rgba(90,60,40,.18);
}
.banner[hidden] { display: none; }
.banner h2 { margin: 0 0 6px; font-size: 16px; font-weight: 800; letter-spacing: -.01em; }
.banner p { margin: 0 0 14px; font-size: 13px; line-height: 1.5; color: #6E625B; }
.row { display: flex; flex-wrap: wrap; gap: 8px; }
.btn {
  border-radius: 14px; padding: 11px 16px; font-size: 13px; font-weight: 700;
  transition: transform .05s ease, filter .15s ease;
}
.btn:active { transform: translateY(1px); }
.btn-primary { background: #E85D2A; color: #fff; box-shadow: 0 6px 16px rgba(232,93,42,.28); }
.btn-primary:hover { filter: brightness(1.03); }
.btn-secondary { background: #FFE9DC; color: #2B2320; }
.btn-ghost { background: transparent; color: #6E625B; text-decoration: underline; padding: 11px 8px; }
.btn:focus-visible, .toggle input:focus-visible + .track { outline: 2px solid #E85D2A; outline-offset: 2px; }

.overlay {
  position: fixed; inset: 0; z-index: 2147483001;
  background: rgba(43,35,32,.42); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.overlay[hidden] { display: none; }
.dialog {
  width: 100%; max-width: 480px; max-height: 90vh; overflow: auto;
  background: #FBF7F2; border-radius: 22px; padding: 22px 22px 20px;
  box-shadow: 0 24px 70px rgba(90,60,40,.3);
}
.dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.dialog h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -.01em; }
.dialog .intro { margin: 8px 0 16px; font-size: 12.5px; line-height: 1.5; color: #6E625B; }
.x { background: transparent; color: #6E625B; font-size: 20px; line-height: 1; padding: 4px 8px; border-radius: 10px; }
.x:hover { background: #FFE9DC; }

.item { display: flex; gap: 12px; padding: 12px 0; border-top: 1px solid rgba(43,35,32,.08); }
.item:first-of-type { border-top: 0; }
.item .meta { flex: 1; }
.item .label { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; }
.item .state { font-size: 11px; font-weight: 700; color: #7C9271; text-transform: uppercase; letter-spacing: .08em; }
.item .desc { margin: 4px 0 0; font-size: 12px; line-height: 1.45; color: #6E625B; }

.toggle { position: relative; flex: 0 0 auto; align-self: center; }
.toggle input { position: absolute; opacity: 0; width: 44px; height: 26px; margin: 0; cursor: pointer; }
.toggle input:disabled { cursor: not-allowed; }
.track {
  display: block; width: 44px; height: 26px; border-radius: 999px;
  background: #E3D8CE; transition: background .18s ease; position: relative;
}
.track::after {
  content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
  border-radius: 50%; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,.18); transition: left .18s ease;
}
.toggle input:checked + .track { background: #E85D2A; }
.toggle input:checked + .track::after { left: 21px; }
.toggle input:disabled + .track { background: #C9BCB0; }

.dialog-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.dialog-actions .btn-primary { flex: 1 1 auto; }
@media (max-width: 420px) {
  .banner { left: 10px; right: 10px; bottom: 10px; padding: 18px; }
  .row .btn { flex: 1 1 auto; text-align: center; }
}
`;

/** Create an element with attributes/text in one call. */
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text != null) node.textContent = text;
  return node;
}

function noopController(): ConsentBannerController {
  return {
    openPreferences() {},
    closePreferences() {},
    showBanner() {},
    hideBanner() {},
    destroy() {},
    root: null,
  };
}

/**
 * Mount the consent banner + preferences dialog. Returns a controller.
 * No-op (safe) when there is no DOM.
 */
export function mountConsentBanner(
  store: ConsentStore,
  options: ConsentBannerOptions = {},
): ConsentBannerController {
  if (typeof document === 'undefined' || !document.body) {
    return noopController();
  }

  const texts: ConsentBannerTexts = { ...DEFAULT_TEXTS, ...options.texts };
  const reopenSelectors = options.reopenSelectors ?? ['[data-fylos-consent-open]'];
  const rootId = options.rootId ?? 'fylos-consent-root';

  // On re-mount, fully tear down the previous instance first. Removing the old
  // host element alone would leak its document click listener and its store
  // subscription (neither lives on the host), so call its stored teardown.
  const existing = document.getElementById(rootId) as
    | (HTMLElement & { __fylosDestroy?: () => void })
    | null;
  if (existing) {
    if (typeof existing.__fylosDestroy === 'function') {
      try {
        existing.__fylosDestroy();
      } catch {
        existing.remove();
      }
    } else {
      existing.remove();
    }
  }

  const host = el('div', { id: rootId });
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = STYLES;
  shadow.appendChild(style);

  const wrap = el('div', { class: 'wrap' });
  shadow.appendChild(wrap);

  let lastFocused: Element | null = null;

  // ---- Banner --------------------------------------------------------------
  const banner = el('section', {
    class: 'banner',
    role: 'region',
    'aria-label': texts.bannerTitle,
  });
  banner.appendChild(el('h2', {}, texts.bannerTitle));
  banner.appendChild(el('p', {}, texts.bannerBody));
  const bannerRow = el('div', { class: 'row' });
  const acceptBtn = el('button', { class: 'btn btn-primary', type: 'button' }, texts.acceptAll);
  const necessaryBtn = el(
    'button',
    { class: 'btn btn-secondary', type: 'button' },
    texts.necessaryOnly,
  );
  const prefsBtn = el('button', { class: 'btn btn-ghost', type: 'button' }, texts.preferences);
  bannerRow.append(acceptBtn, necessaryBtn, prefsBtn);
  banner.appendChild(bannerRow);
  wrap.appendChild(banner);

  // ---- Preferences dialog --------------------------------------------------
  const overlay = el('div', { class: 'overlay', hidden: '' });
  const dialog = el('div', {
    class: 'dialog',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': `${rootId}-title`,
  });
  const head = el('div', { class: 'dialog-head' });
  head.appendChild(el('h2', { id: `${rootId}-title` }, texts.dialogTitle));
  const closeBtn = el('button', { class: 'x', type: 'button', 'aria-label': texts.close }, '×');
  head.appendChild(closeBtn);
  dialog.appendChild(head);
  dialog.appendChild(el('p', { class: 'intro' }, texts.dialogIntro));

  function makeItem(
    label: string,
    desc: string,
    opts: { checked: boolean; disabled?: boolean; state?: string },
  ): { item: HTMLElement; input: HTMLInputElement } {
    const item = el('div', { class: 'item' });
    const meta = el('div', { class: 'meta' });
    const labelRow = el('div', { class: 'label' });
    labelRow.appendChild(document.createTextNode(label));
    if (opts.state) labelRow.appendChild(el('span', { class: 'state' }, opts.state));
    meta.appendChild(labelRow);
    meta.appendChild(el('p', { class: 'desc' }, desc));

    const toggle = el('label', { class: 'toggle' });
    const input = el('input', { type: 'checkbox', 'aria-label': label }) as HTMLInputElement;
    input.checked = opts.checked;
    if (opts.disabled) input.disabled = true;
    const track = el('span', { class: 'track', 'aria-hidden': 'true' });
    toggle.append(input, track);

    item.append(meta, toggle);
    return { item, input };
  }

  const necessaryItem = makeItem(texts.necessaryLabel, texts.necessaryDesc, {
    checked: true,
    disabled: true,
    state: texts.necessaryState,
  });
  const state = store.getState();
  const analyticsItem = makeItem(texts.analyticsLabel, texts.analyticsDesc, {
    checked: state.categories.analytics,
  });
  const marketingItem = makeItem(texts.marketingLabel, texts.marketingDesc, {
    checked: state.categories.marketing,
  });
  dialog.append(necessaryItem.item, analyticsItem.item, marketingItem.item);

  const actions = el('div', { class: 'dialog-actions' });
  const saveBtn = el('button', { class: 'btn btn-primary', type: 'button' }, texts.save);
  const acceptAllInDialog = el(
    'button',
    { class: 'btn btn-secondary', type: 'button' },
    texts.acceptAll,
  );
  const necessaryInDialog = el(
    'button',
    { class: 'btn btn-ghost', type: 'button' },
    texts.necessaryOnly,
  );
  actions.append(saveBtn, acceptAllInDialog, necessaryInDialog);
  dialog.appendChild(actions);

  overlay.appendChild(dialog);
  wrap.appendChild(overlay);

  // ---- Behaviour -----------------------------------------------------------
  function showBanner(): void {
    banner.hidden = false;
  }
  function hideBanner(): void {
    banner.hidden = true;
  }

  function syncToggles(): void {
    const s = store.getState();
    analyticsItem.input.checked = s.categories.analytics;
    marketingItem.input.checked = s.categories.marketing;
  }

  function focusableInDialog(): HTMLElement[] {
    const nodes = dialog.querySelectorAll<HTMLElement>(
      'button, input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    return Array.from(nodes).filter((n) => !(n as HTMLButtonElement).disabled);
  }

  function openPreferences(): void {
    syncToggles();
    lastFocused = (document.activeElement as Element | null) ?? null;
    overlay.hidden = false;
    const focusables = focusableInDialog();
    (focusables[0] ?? dialog).focus?.();
    options.onOpen?.();
  }

  function closePreferences(): void {
    overlay.hidden = true;
    if (lastFocused instanceof HTMLElement) lastFocused.focus?.();
    options.onClose?.();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (overlay.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePreferences();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = focusableInDialog();
      if (focusables.length === 0) return;
      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;
      const active = shadow.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Banner buttons
  acceptBtn.addEventListener('click', () => store.acceptAll());
  necessaryBtn.addEventListener('click', () => store.necessaryOnly());
  prefsBtn.addEventListener('click', () => openPreferences());

  // Dialog buttons
  closeBtn.addEventListener('click', () => closePreferences());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePreferences();
  });
  saveBtn.addEventListener('click', () => {
    store.savePreferences({
      analytics: analyticsItem.input.checked,
      marketing: marketingItem.input.checked,
    });
    closePreferences();
  });
  acceptAllInDialog.addEventListener('click', () => {
    store.acceptAll();
    closePreferences();
  });
  necessaryInDialog.addEventListener('click', () => {
    store.necessaryOnly();
    closePreferences();
  });
  dialog.addEventListener('keydown', onKeydown);

  // Reopen from anywhere on the page (event delegation, no HTML edits needed).
  const selector = reopenSelectors.join(',');
  function onDocClick(e: Event): void {
    if (!selector) return;
    const target = e.target as Element | null;
    if (target && target.closest(selector)) {
      e.preventDefault();
      openPreferences();
    }
  }
  document.addEventListener('click', onDocClick);

  // Hide/show the banner as consent decisions come and go.
  const unsubscribe = store.subscribe((_s, source) => {
    if (source === 'reset') {
      showBanner();
    } else {
      hideBanner();
    }
    syncToggles();
  });

  // Initial visibility.
  if (store.hasDecision()) hideBanner();
  else showBanner();

  document.body.appendChild(host);

  let torndown = false;
  function teardown(): void {
    if (torndown) return;
    torndown = true;
    unsubscribe();
    document.removeEventListener('click', onDocClick);
    host.remove();
  }

  // Stash teardown on the host so a later re-mount (which only has the element)
  // can fully clean this instance up, not just detach the node.
  (host as HTMLElement & { __fylosDestroy?: () => void }).__fylosDestroy = teardown;

  return {
    openPreferences,
    closePreferences,
    showBanner,
    hideBanner,
    destroy: teardown,
    root: host,
  };
}
