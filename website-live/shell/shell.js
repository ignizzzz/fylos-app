/* ==========================================================================
   FYLOS website shell  ·  shell.js   (vanilla, no dependencies)

   Progressive enhancement for the static marketing pages. The header, nav and
   footer are real HTML and work with JS disabled; this file only adds:
     1. active-route marking (aria-current="page")
     2. the mobile menu behaviour: keyboard access, Escape, focus trap,
        focus restoration, and scroll locking
     3. a global loading state: a navigation progress bar plus a reusable
        full-screen overlay exposed as window.FylosShell.showLoading / hideLoading

   The shell never touches page content or the locked storytelling.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  var burger = null;
  var menu = null;
  var panel = null;
  var menuOpen = false;
  var lastFocused = null;

  var FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  /* ---------------------------------------------------------------- helpers */
  function normalizePath(p) {
    if (!p) return '/';
    p = String(p).split('#')[0].split('?')[0];
    p = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p === '' ? '/' : p;
  }

  // internal = same-site navigation (not a scheme link, not a bare #anchor)
  function isInternal(href) {
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false; // http:, mailto:, tel:, sms: ...
    return true;
  }

  function focusables(container) {
    return Array.prototype.slice
      .call(container.querySelectorAll(FOCUSABLE))
      .filter(function (el) {
        return el.offsetParent !== null || el.getClientRects().length > 0;
      });
  }

  /* ----------------------------------------------------------- active route */
  function markActive() {
    var here = normalizePath(location.pathname);
    var links = doc.querySelectorAll('.fy-nav a, .fy-menu__link');
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href');
      if (isInternal(href) && normalizePath(href) === here) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* ------------------------------------------------------------ scroll lock */
  var savedScrollY = 0;
  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    var sw = window.innerWidth - root.clientWidth;
    if (sw > 0) root.style.paddingRight = sw + 'px';
    // position:fixed on <body> is what actually holds iOS Safari still;
    // overflow:hidden on <html> alone does not stop touch/momentum scroll.
    var body = doc.body;
    body.style.position = 'fixed';
    body.style.top = -savedScrollY + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    root.classList.add('fy-scroll-lock');
  }
  function unlockScroll() {
    var body = doc.body;
    root.classList.remove('fy-scroll-lock');
    root.style.paddingRight = '';
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  /* ------------------------------------------------------------ mobile menu */
  function openMenu() {
    if (menuOpen || !menu || !panel) return;
    lastFocused = doc.activeElement;
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    lockScroll();
    menuOpen = true;
    // the canopy hides its close button; focusables() filters hidden elements
    var closeBtn = panel.querySelector('[data-fy-close]');
    var target = (closeBtn && closeBtn.offsetParent) ? closeBtn : focusables(panel)[0];
    if (target) target.focus();
    doc.addEventListener('keydown', onKeydown, true);
  }

  function closeMenu(returnFocus) {
    if (!menuOpen || !menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    unlockScroll();
    menuOpen = false;
    doc.removeEventListener('keydown', onKeydown, true);
    if (returnFocus !== false && burger) burger.focus();
    else if (returnFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      var items = focusables(panel);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (!panel.contains(doc.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* --------------------------------------------------- global loading state */
  var bar = null;
  var barTimer = null;

  function ensureBar() {
    if (!bar) {
      bar = doc.createElement('div');
      bar.className = 'fy-progress';
      bar.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(bar);
    }
    return bar;
  }
  function startProgress() {
    var b = ensureBar();
    clearTimeout(barTimer);
    b.classList.add('is-active');
    b.style.width = '0';
    void b.offsetWidth; // reflow so the width transition runs
    b.style.width = '82%';
  }
  function completeProgress() {
    if (!bar) return;
    bar.style.width = '100%';
    clearTimeout(barTimer);
    barTimer = setTimeout(function () {
      bar.classList.remove('is-active');
      bar.style.width = '0';
    }, 260);
  }

  var overlay = null;
  var overlayLabel = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = doc.createElement('div');
    overlay.className = 'fy-loading';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="fy-loading__spinner" aria-hidden="true"></div>' +
      '<p class="fy-loading__label">Loading</p>';
    overlayLabel = overlay.querySelector('.fy-loading__label');
    doc.body.appendChild(overlay);
    return overlay;
  }
  function showLoading(label) {
    var o = ensureOverlay();
    o.setAttribute('aria-hidden', 'false');
    o.classList.add('is-open');
    // expose the live region first, THEN mutate its text on the next frame so
    // the role="status" / aria-live announcement actually fires.
    var text = label || 'Loading';
    overlayLabel.textContent = '';
    (window.requestAnimationFrame || setTimeout)(function () {
      overlayLabel.textContent = text;
    });
  }
  function hideLoading() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function wireProgress() {
    doc.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      if (
        a.target === '_blank' ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;
      if (a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '#') return;
      if (isInternal(href)) startProgress();
    });
    // pageshow covers first load and bfcache back/forward restores
    window.addEventListener('pageshow', completeProgress);
  }

  /* -------------------------------------------------------------------- init */
  function init() {
    markActive();

    burger = doc.querySelector('[data-fy-burger]');
    menu = doc.querySelector('[data-fy-menu]');
    panel = menu ? menu.querySelector('.fy-menu__panel') : null;

    if (burger && menu && panel) {
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');

      burger.addEventListener('click', function () {
        if (menuOpen) closeMenu();
        else openMenu();
      });

      var closeBtn = panel.querySelector('[data-fy-close]');
      if (closeBtn) closeBtn.addEventListener('click', function () { closeMenu(); });

      var backdrop = menu.querySelector('[data-fy-menu-backdrop]');
      if (backdrop) backdrop.addEventListener('click', function () { closeMenu(); });

      // a tapped menu link navigates away; close without stealing focus first
      panel.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (a) closeMenu(false);
      });

      // if the viewport grows past the mobile breakpoint, drop the overlay.
      // Exact complement of the CSS switch (@media max-width:720px) so there is
      // no fractional-width band where the menu stays stuck open.
      var mq = window.matchMedia('not all and (max-width:720px)');
      var onMq = function (ev) { if (ev.matches && menuOpen) closeMenu(false); };
      if (mq.addEventListener) mq.addEventListener('change', onMq);
      else if (mq.addListener) mq.addListener(onMq);
    }

    wireProgress();
  }

  window.FylosShell = {
    showLoading: showLoading,
    hideLoading: hideLoading,
    openMenu: openMenu,
    closeMenu: closeMenu,
    startProgress: startProgress,
    completeProgress: completeProgress
  };

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   FYLOS analytics + consent  ·  integration hook

   Loads the consent-gated, PII-safe @fylos/analytics bundle on every shell
   page and gives the footer a "Cookie preferences" control that reopens the
   consent dialog. The bundle mounts its own Shadow-DOM consent banner, captures
   first-touch attribution, and blocks all nonessential events until the visitor
   grants analytics consent. No real analytics provider is wired in (the default
   adapter sends nothing); connecting one later is a one-line adapter swap in the
   analytics package. See docs/BACKEND_INTEGRATION_GUIDE.md.

   Purely additive and self-contained: if anything here throws, the shell chrome
   above is unaffected. To rebuild the bundle after changing the analytics
   package:
     npm --prefix analytics run build
     cp analytics/dist/fylos-analytics.global.js website-live/analytics/
   ========================================================================== */
(function () {
  'use strict';

  function bootAnalytics() {
    try {
      // 1) Load the analytics + consent bundle once. It self-mounts the consent
      //    banner and enables declarative data-fylos-* click tracking.
      if (!document.querySelector('script[data-fylos-analytics]')) {
        var s = document.createElement('script');
        s.src = '/analytics/fylos-analytics.global.js';
        s.defer = true;
        s.setAttribute('data-fylos-analytics', '');
        document.head.appendChild(s);
      }

      // 2) Add a "Cookie preferences" control to the footer legal line. The
      //    bundle reopens its preferences dialog for any click that matches
      //    [data-fylos-consent-open] (delegated), so load order does not matter.
      var legal = document.querySelector('.fy-footer__legal');
      if (legal && !legal.querySelector('[data-fylos-consent-open]')) {
        legal.appendChild(document.createTextNode(' · '));
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fy-footer__cookie';
        btn.setAttribute('data-fylos-consent-open', '');
        btn.textContent = 'Cookie preferences';
        legal.appendChild(btn);
      }

      // 3) Track the primary conversion CTAs (Open the app / For vets / For pros)
      //    as cta_click from one delegated listener, so no per-page markup edits
      //    are needed. Consent gating + PII redaction still happen in the bundle.
      document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        var id = null;
        if (/^https?:\/\/app\.fylos\.me/i.test(href)) id = 'open_app';
        else if (href === '/apply') id = 'for_vets';
        else if (href === '/join') id = 'for_pros';
        if (!id) return;
        if (window.FylosAnalytics && window.FylosAnalytics.ctaClick) {
          window.FylosAnalytics.ctaClick({
            ctaId: id,
            label: (a.textContent || '').trim().slice(0, 60),
            location: a.closest('.fy-header') ? 'header'
              : a.closest('.fy-footer') ? 'footer' : 'body'
          });
        }
      });
    } catch (err) { /* analytics is best-effort; never break the page */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAnalytics);
  } else {
    bootAnalytics();
  }
})();
