/* Fylos website · privacy & storage preferences
 *
 * The site sets NO tracking cookies today. The only thing it stores is
 * the pet name typed at the film's gate (localStorage, this device only)
 * and this preference itself. This panel tells the truth about that,
 * lets the visitor clear it, and holds the switch analytics consent
 * will hang from when analytics exist (see docs/BACKEND_INTEGRATION_GUIDE.md).
 *
 * API: FylosConsent.get() → {essential:true, analytics:boolean|null}
 *      FylosConsent.open() → shows the panel
 * Any element with [data-consent-open] opens the panel on click.
 */
(function () {
  'use strict';

  var KEY = 'fylos_consent_v1';

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { essential: true, analytics: null }; /* null = not asked yet */
  }

  function write(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }

  var css = [
    '#fylosConsent{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:18px}',
    '#fylosConsent.on{display:flex}',
    '#fylosConsent .veil{position:absolute;inset:0;background:rgba(43,35,32,.42);backdrop-filter:blur(3px)}',
    '#fylosConsent .panel{position:relative;width:min(480px,94vw);background:#FBF7F2;border-radius:24px;padding:28px 26px 24px;box-shadow:0 30px 80px rgba(43,35,32,.35);font-family:Inter,-apple-system,sans-serif;color:#2B2320}',
    '#fylosConsent h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:23px;letter-spacing:-.01em}',
    '#fylosConsent h2 em{font-style:italic;color:#E85D2A}',
    '#fylosConsent .lead{margin-top:9px;font-size:13px;line-height:1.6;color:#6E625B}',
    '#fylosConsent .rowc{display:flex;align-items:flex-start;gap:12px;background:#fff;border-radius:14px;padding:13px 15px;margin-top:12px;box-shadow:0 4px 14px rgba(90,60,40,.06)}',
    '#fylosConsent .rowc b{display:block;font-size:13px}',
    '#fylosConsent .rowc span{display:block;font-size:11.5px;line-height:1.5;color:#6E625B;margin-top:3px}',
    '#fylosConsent .state{margin-left:auto;flex:none;font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#7C9271;background:#E9F0E5;border-radius:99px;padding:5px 10px}',
    '#fylosConsent .tglc{margin-left:auto;flex:none;width:34px;height:20px;border-radius:99px;background:#E4D6C6;border:none;position:relative;cursor:pointer;transition:background .25s}',
    '#fylosConsent .tglc::after{content:"";position:absolute;top:2.5px;left:3px;width:15px;height:15px;border-radius:50%;background:#fff;transition:left .25s;box-shadow:0 1px 3px rgba(0,0,0,.2)}',
    '#fylosConsent .tglc.on{background:#E85D2A}',
    '#fylosConsent .tglc.on::after{left:16px}',
    '#fylosConsent .clearline{margin-top:12px;font-size:11.5px;color:#6E625B;line-height:1.5}',
    '#fylosConsent .clearline button{background:none;border:none;color:#E85D2A;font-weight:700;font-size:11.5px;cursor:pointer;text-decoration:underline;text-underline-offset:2px;padding:0}',
    '#fylosConsent .acts{display:flex;gap:10px;margin-top:18px}',
    '#fylosConsent .acts .save{flex:1;background:#E85D2A;color:#fff;font-weight:800;font-size:14px;border:none;border-radius:13px;padding:13px;cursor:pointer;box-shadow:0 10px 26px rgba(232,93,42,.3)}',
    '#fylosConsent .acts .save:hover{background:#C94A1E}',
    '#fylosConsent .acts .close{background:none;border:none;color:#6E625B;font-weight:700;font-size:13px;cursor:pointer;padding:0 14px}',
    '#fylosConsent .finep{margin-top:14px;font-size:10.5px;color:#9a8d82;line-height:1.5}',
    '#fylosConsent .finep a{color:#E85D2A;text-decoration:none}'
  ].join('\n');

  var html =
    '<div class="veil" data-consent-close></div>' +
    '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="fcTitle">' +
    '  <h2 id="fcTitle">Your data, <em>your call.</em></h2>' +
    '  <p class="lead">Fylos sets no tracking cookies today. Here is everything this site keeps, and the one switch we will ask for later.</p>' +
    '  <div class="rowc"><div><b>Remembering your pet’s name</b><span>The name you type at the start stays on this device so the story greets you next time. It is never sent anywhere.</span></div><span class="state">On device</span></div>' +
    '  <div class="rowc"><div><b>Analytics</b><span>There are none yet. If we ever add them, they stay off unless you turn this on.</span></div><button class="tglc" id="fcAnalytics" role="switch" aria-checked="false" aria-label="Allow analytics"></button></div>' +
    '  <p class="clearline">Want a clean slate? <button id="fcClear">Forget my pet’s name on this device</button></p>' +
    '  <div class="acts"><button class="save" id="fcSave">Save my choices</button><button class="close" data-consent-close>Close</button></div>' +
    '  <p class="finep">The long version lives in the <a href="/privacy">privacy policy</a>. Questions go to <a href="mailto:privacy@fylos.me">privacy@fylos.me</a>.</p>' +
    '</div>';

  var root = null;

  function build() {
    if (root) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    root = document.createElement('div');
    root.id = 'fylosConsent';
    root.innerHTML = html;
    document.body.appendChild(root);

    var tgl = root.querySelector('#fcAnalytics');
    var current = read();
    if (current.analytics === true) { tgl.classList.add('on'); tgl.setAttribute('aria-checked', 'true'); }

    tgl.addEventListener('click', function () {
      var on = tgl.classList.toggle('on');
      tgl.setAttribute('aria-checked', on ? 'true' : 'false');
    });

    root.querySelector('#fcClear').addEventListener('click', function () {
      try { localStorage.removeItem('fylos_pet_name'); } catch (e) {}
      this.textContent = 'Done, forgotten.';
      this.disabled = true;
      this.style.textDecoration = 'none';
      this.style.cursor = 'default';
    });

    root.querySelector('#fcSave').addEventListener('click', function () {
      write({ essential: true, analytics: root.querySelector('#fcAnalytics').classList.contains('on') });
      close();
    });

    root.querySelectorAll('[data-consent-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function open() { build(); root.classList.add('on'); }
  function close() { if (root) root.classList.remove('on'); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-consent-open]');
    if (t) { e.preventDefault(); open(); }
  });

  window.FylosConsent = { get: read, open: open };
})();
