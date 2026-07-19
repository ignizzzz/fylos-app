/**
 * Waitlist → Fylos API (WaitlistUsers table).
 * No Klaviyo. Requires reCAPTCHA v3 when the API has a secret configured.
 */
(function (global) {
  var API_BASE = (global.API_BASE_URL || 'https://app.fylos.me').replace(/\/$/, '');
  var SITE_KEY = global.RECAPTCHA_SITE_KEY || '6LeQ3jIsAAAAAKexf43tim8Y8SSTxBEuj9-4PBgU';

  function okEmail(v) {
    v = (v || '').trim();
    return v.indexOf('@') > 0 && v.indexOf('.') > 0;
  }

  function getRecaptchaToken(action) {
    action = action || 'waitlist';
    if (!SITE_KEY || typeof global.grecaptcha === 'undefined') {
      return Promise.resolve(null);
    }
    return new Promise(function (resolve, reject) {
      var started = Date.now();
      function tryExec() {
        if (typeof global.grecaptcha !== 'undefined' && global.grecaptcha.ready) {
          global.grecaptcha.ready(function () {
            global.grecaptcha
              .execute(SITE_KEY, { action: action })
              .then(resolve)
              .catch(function () {
                reject(new Error('reCAPTCHA failed. Refresh and try again.'));
              });
          });
          return;
        }
        if (Date.now() - started > 5000) {
          reject(new Error('reCAPTCHA failed to load. Refresh and try again.'));
          return;
        }
        setTimeout(tryExec, 100);
      }
      tryExec();
    });
  }

  /**
   * @param {string} email
   * @param {string} [source]
   * @returns {Promise<void>}
   */
  function subscribe(email, source) {
    email = (email || '').trim();
    if (!okEmail(email)) {
      return Promise.reject(new Error('Please enter a valid email.'));
    }
    return getRecaptchaToken('waitlist').then(function (token) {
      return fetch(API_BASE + '/api/Waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          email: email,
          source: source || 'fylos website waitlist',
          website: '',
          recaptchaToken: token
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            throw new Error((data && data.message) || 'Failed to join waitlist');
          }
        });
      });
    });
  }

  global.FylosWaitlist = {
    okEmail: okEmail,
    subscribe: subscribe
  };
})(typeof window !== 'undefined' ? window : this);
