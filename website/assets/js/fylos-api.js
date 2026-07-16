/* Fylos website · form service adapter
 *
 * Every form on the public site submits through FylosAPI.submit().
 * Today the site has no backend, so MOCK MODE is on: submissions
 * resolve locally after a short delay and nothing leaves the browser.
 *
 * To connect the real backend (see docs/BACKEND_INTEGRATION_GUIDE.md):
 *   1. Set FYLOS_CONFIG.mock = false.
 *   2. Point the endpoints at the real API. Each one receives a POST
 *      with a JSON body of {kind, fields, meta} and must answer
 *      2xx JSON on success.
 * Testing the states while in mock mode:
 *   ?mockfail=1 on the page URL makes every submit fail (error state).
 *   ?mockslow=1 stretches the delay to 4s (loading state).
 */
(function () {
  'use strict';

  var FYLOS_CONFIG = {
    mock: true,
    mockDelayMs: 900,
    endpoints: {
      /* POST · vet clinic early-access application (apply.html) */
      applyClinic: '/api/apply-clinic',
      /* POST · pro application, groomers and every other pro (join.html) */
      joinPro: '/api/join-pro'
    }
  };

  function mockDelay() {
    var slow = /[?&]mockslow=1/.test(location.search);
    return FYLOS_CONFIG.mockDelayMs * (slow ? 4.5 : 1);
  }

  function mockShouldFail() {
    return /[?&]mockfail=1/.test(location.search);
  }

  /**
   * Submit a form payload.
   * @param {'applyClinic'|'joinPro'} kind  which endpoint to use
   * @param {Object} fields                 name → value map from the form
   * @returns {Promise<{ok:true}>}          resolves on success, rejects with Error on failure
   */
  function submit(kind, fields) {
    var payload = {
      kind: kind,
      fields: fields,
      meta: { page: location.pathname, submittedAt: new Date().toISOString() }
    };

    if (FYLOS_CONFIG.mock) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (mockShouldFail()) {
            reject(new Error('mock failure requested via ?mockfail=1'));
          } else {
            try { console.info('[fylos mock submit]', payload); } catch (e) {}
            resolve({ ok: true });
          }
        }, mockDelay());
      });
    }

    var url = FYLOS_CONFIG.endpoints[kind];
    if (!url) return Promise.reject(new Error('unknown form kind: ' + kind));
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('submit failed: HTTP ' + res.status);
      return { ok: true };
    });
  }

  /**
   * Wire a Fylos form to the adapter with loading / success / error states.
   * Expects: a <form>, a submit button inside it, a success panel element,
   * and an error box element (created by the caller, hidden by default).
   */
  function wireForm(opts) {
    var form = opts.form, btn = form.querySelector('.submit'),
        done = opts.done, errBox = opts.errBox;
    var btnHTML = btn.innerHTML;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        if (el.offsetParent === null) return; /* skip hidden fields */
        var bad = (el.type === 'checkbox') ? !el.checked : !el.value.trim();
        if (bad && !missing) missing = el;
      });
      if (missing) {
        missing.focus();
        missing.closest('.field, .check').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var fields = {};
      new FormData(form).forEach(function (v, k) { fields[k] = v; });

      errBox.classList.remove('on');
      btn.disabled = true;
      btn.classList.add('busy');
      btn.innerHTML = '<span class="spin"></span>' + opts.busyLabel;

      submit(opts.kind, fields).then(function () {
        form.style.display = 'none';
        done.classList.add('on');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }).catch(function () {
        errBox.classList.add('on');
        errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).finally(function () {
        btn.disabled = false;
        btn.classList.remove('busy');
        btn.innerHTML = btnHTML;
      });
    });
  }

  window.FylosAPI = { config: FYLOS_CONFIG, submit: submit, wireForm: wireForm };
})();
