/**
 * Partner applications → Fylos API (PartnerApplications table).
 * Same endpoint the old landing page used: POST /api/PartnerApplication
 */
(function (global) {
  var API_BASE = (global.API_BASE_URL || 'https://app.fylos.me').replace(/\/$/, '');
  var SITE_KEY = global.RECAPTCHA_SITE_KEY || '6LeQ3jIsAAAAAKexf43tim8Y8SSTxBEuj9-4PBgU';

  function okEmail(v) {
    v = (v || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function getRecaptchaToken(action) {
    action = action || 'partner_application';
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

  function clip(s, n) {
    s = (s || '').trim();
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  /**
   * Pack extra form context into websiteOrSocialMedia (max 500) so admins
   * still see city / role / notes without a schema change.
   */
  function packWebsite(url, extras) {
    var parts = [];
    if (url) parts.push(url);
    if (extras && extras.length) parts.push(extras.filter(Boolean).join(' · '));
    return clip(parts.join(' | '), 500) || null;
  }

  /**
   * @param {{
   *   contactName: string,
   *   businessName: string,
   *   businessEmail: string,
   *   businessType: string,
   *   country: string,
   *   websiteOrSocialMedia?: string|null,
   *   swissUid?: string|null,
   *   registrationOrLicenseId?: string|null,
   *   fileNames?: string[]|null
   * }} payload
   */
  function submit(payload) {
    return getRecaptchaToken('partner_application').then(function (token) {
      return fetch(API_BASE + '/api/PartnerApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          contactName: payload.contactName,
          businessName: payload.businessName,
          businessEmail: payload.businessEmail,
          businessType: payload.businessType,
          country: payload.country,
          websiteOrSocialMedia: payload.websiteOrSocialMedia || null,
          swissUid: payload.swissUid || null,
          registrationOrLicenseId: payload.registrationOrLicenseId || null,
          fileNames: payload.fileNames || null,
          website: '',
          recaptchaToken: token
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            throw new Error((data && data.message) || 'Failed to submit application');
          }
          return data;
        });
      });
    });
  }

  global.FylosPartner = {
    okEmail: okEmail,
    packWebsite: packWebsite,
    clip: clip,
    submit: submit
  };
})(typeof window !== 'undefined' ? window : this);
