# @fylos/analytics

Typed, replaceable, **consent-gated**, **PII-safe** frontend analytics + consent
infrastructure for the Fylos marketing website.

It is intentionally provider-agnostic: **no real analytics vendor is wired in.**
The default adapter sends nothing. Connecting a provider later is one small
adapter and a one-line config change, with zero product-code changes.

## Guarantees

- **Nothing nonessential leaves the browser before consent.** Analytics events
  are dropped until the visitor grants analytics consent. The default adapter is
  a no-op on top of that.
- **No personal data ever reaches analytics.** The event catalogue has no field
  for a name, email, message or pet health data, and every payload additionally
  passes through a runtime PII guard that redacts denied keys, email/phone-shaped
  values, URL query strings and over-long free text.
- **Drop-in, no layout edits.** The banner renders inside a Shadow DOM, so its
  styles cannot touch (or be touched by) the page. Ship it with one script tag.

## What it provides

| Piece | Where |
|---|---|
| Replaceable adapter (`AnalyticsAdapter`, `NoopAdapter`, `ConsoleAdapter`, `MemoryAdapter`) | `src/adapter.ts` |
| Typed events (the 8 below) | `src/events.ts` |
| Consent-gated dispatcher + PII choke point | `src/analytics.ts`, `src/pii.ts` |
| Attribution (UTM x5, referrer, landing page) | `src/attribution.ts` |
| Consent store (necessary/analytics/marketing) | `src/consent/consentStore.ts` |
| Consent banner + preferences dialog | `src/consent/consentBanner.ts` |
| One-call bootstrap | `src/bootstrap.ts` |
| Browser drop-in (globals) | `src/browser.ts` |
| Declarative `data-fylos-*` click tracking | `src/dom.ts` |

### Events

`cta_click`, `storytelling_started`, `storytelling_completed`, `feature_viewed`,
`form_started`, `form_submitted`, `download_clicked`, `article_viewed`.

Every event defaults to the **analytics** (nonessential) consent category.

## Scripts

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # vitest (jsdom)
npm run build       # tsup -> dist/ (ESM + CJS + d.ts + browser IIFE)
```

## Quick start — static pages (zero layout edits)

Build once, then add a single tag to a page. The banner mounts itself,
attribution is captured, and `data-fylos-*` click tracking is enabled.

```html
<!-- optional: configure before the library loads -->
<script>window.FylosAnalyticsConfig = { debug: false };</script>
<script defer src="/analytics/fylos-analytics.global.js"></script>
```

Fire events with the globals, or declaratively with attributes:

```html
<!-- declarative: no inline JS -->
<a href="https://app.fylos.me"
   data-fylos-event="cta_click"
   data-fylos-cta-id="hero_start"
   data-fylos-label="Start in the app"
   data-fylos-location="hero">Start</a>

<script>
  // programmatic
  FylosAnalytics.storytellingStarted({ storyId: 'neighborhood_film', entryPoint: 'scroll' });
  FylosAnalytics.formSubmitted({ formId: 'join', fields: ['name', 'email'], success: true });
</script>
```

### Reopen preferences from the footer (no HTML edit needed)

The footer already has a `Cookie preferences` link. Wire it either way:

- Add the attribute to it: `<a href="#" data-fylos-consent-open>Cookie preferences</a>`, or
- Point the config at your existing selector without touching the markup:

```js
window.FylosAnalyticsConfig = {
  bannerOptions: { reopenSelectors: ['[data-fylos-consent-open]', 'a[href="#cookie-preferences"]'] }
};
```

You can also call `FylosConsent.openPreferences()` from anywhere.

## Quick start — bundler / React

```ts
import { createFylosAnalytics } from '@fylos/analytics';

export const fylos = createFylosAnalytics({ debug: import.meta.env.DEV });

fylos.ctaClick({ ctaId: 'hero_get_id', label: "Get Rex's ID", location: 'hero' });
fylos.articleViewed({ articleId: 'why', locale: 'el' });
```

## Consent model

Three categories: `necessary` (always on), `analytics`, `marketing`. Until the
visitor decides, `status` is `unset` and both nonessential categories are `false`.

Banner / API actions:

| Action | Effect |
|---|---|
| **Accept all** | analytics + marketing granted |
| **Necessary only** | analytics + marketing rejected |
| **Preferences → Save** | per-category selection (analytics/marketing consent) |
| **Reopen preferences** | `FylosConsent.openPreferences()` or a `reopenSelectors` element |

The decision is persisted (first-party `localStorage`) and versioned; bump
`CONSENT_SCHEMA_VERSION` (or pass `consentVersion`) to re-prompt everyone.

## Attribution

On the first landing, first-touch is captured and persisted:
`utm_source/medium/campaign/content/term`, `referrer` (query stripped),
`landing page` (query stripped). It is attached to every event's context and is
only transmitted once analytics consent is granted.

## Replacing the adapter (connecting a real provider later)

Implement `AnalyticsAdapter` and pass it in. The core still handles consent
gating and PII sanitization, so the adapter only forwards clean envelopes.

```ts
import { createFylosAnalytics, type AnalyticsAdapter } from '@fylos/analytics';

const myAdapter: AnalyticsAdapter = {
  name: 'my-provider',
  init(ctx) { /* boot the SDK */ },
  track(envelope) { /* envelope.name, envelope.props, envelope.context — already PII-safe */ },
  setConsent(consent) { /* e.g. set the provider's consent mode */ },
};

createFylosAnalytics({ adapter: myAdapter });
// or swap at runtime: fylos.setAdapter(myAdapter);
```

There is deliberately **no `identify()`**: the interface offers no way to send a
person's identity.

## PII guard

Applied to every event **payload AND context** before it reaches the adapter
(`sanitizeProps`):

- **Denied keys** (name, email, phone, message, address, dob, and pet/human
  health terms like diagnosis, medication, vaccine, allergy, weight, microchip)
  are redacted. Compound keys are covered too: anything ending in `name`
  (ownerName, petName) or `email`/`phone` is denied, except technical keys like
  `formName`/`fileName`.
- **Email/phone-shaped values** are redacted even under safe keys.
- **URL-ish fields** are query-stripped; `mailto:`/`tel:` collapse to the scheme.
- **Over-long free text** is redacted (likely a typed message).
- Prototype-polluting keys are ignored.

The context is sanitized because it is assembled from DOM/URL-derived values
(`document.title`, `location.pathname`, referrer, UTM parameters) that can carry
PII just like a payload. UTM values that look like an email or phone are also
dropped at capture, so the persisted first-touch stays clean.

Types are the first line of defence; the guard is the second, covering the
dynamic `track()` escape hatch and every context field.

## Verification

`example/index.html` is a harness demonstrating the whole flow (blocked before
consent, banner, preferences, attribution, and PII redaction). Serve the package
folder and open `/example/index.html`.
