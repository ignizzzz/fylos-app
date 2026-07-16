# ROUTES

_Last verified: 2026-07-15 against branch `fylos-dev`._

This repository ships **two separate frontends**, each with its own routing model.
Neither has a backend in this repo.

1. **The marketing website** — static HTML pages in `website-live/`, deployed to
   `https://fylos-neighborhood.vercel.app`. The homepage is the locked scroll film.
2. **The React design viewer** — a Vite + React Router SPA in `src/`, deployed as
   the `fylos-mobile-ui-viewer` Vercel project (root `index.html`). It renders every
   mobile app screen for design review.

---

## 1. Website routes (static HTML — `website-live/`)

Each clean route is served by one HTML file. The homepage (`/`) is the **locked
storytelling film** — see [LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md).

| Route | File | Purpose | Status |
|---|---|---|---|
| `/` | `website-live/index.html` | The scroll film (homepage). **LOCKED.** | Live |
| `/why` | `website-live/why.html` | Concept rationale ("why a neighborhood"), Greek, internal | Live |
| `/layouts` | `website-live/layouts.html` | Tag layout gallery | Live |
| `/vet` | `website-live/vet.html` | Vet cards (final) | Live |
| `/groomer` | `website-live/groomer.html` | Groomer cards | Live |
| `/park` | `website-live/park.html` | Park card options | Live |
| `/apply` | `website-live/apply.html` | Vet clinic early-access application | Live, front-end only |
| `/join` | `website-live/join.html` | Pros & helpers sign-up | Live, front-end only |
| `/found` | `website-live/found.html` | "You found {pet}" QR landing (demo, one shared page) | Live, demo |
| `/product` | `website-live/product.html` | Product overview (the whole neighborhood) | Built, awaiting deploy |
| `/features` | `website-live/features.html` | Honest feature catalogue (live now vs coming soon) | Built, awaiting deploy |
| `/how-it-works` | `website-live/how-it-works.html` | Getting-started journey, first minute to first walk | Built, awaiting deploy |
| `/health-book` | `website-live/health-book.html` | The pet health book (feature page) | Built, awaiting deploy |
| `/book-care` | `website-live/book-care.html` | Book walks, sitting, grooming (feature page) | Built, awaiting deploy |
| `/the-tag` | `website-live/the-tag.html` | Digital ID / lost-pet tag (feature page) | Built, awaiting deploy |
| `/partners` | `website-live/partners.html` | Partner / commercial overview. Funnels into `/apply` and `/join` | Live |
| `/for-vets` | `website-live/for-vets.html` | Vet-clinic commercial page. Funnels into `/apply` | Live |
| `/pilot` | `website-live/pilot.html` | Pilot-program page. Funnels into `/apply` and `/join` | Live |
| `/demo` | `website-live/demo.html` | Request-a-demo page (mailto + funnels into `/apply`, `/join`) | Live |
| `/error` | `website-live/error.html` | Generic error page (shell chrome) | Live |

Also served, not navigable routes: `website-live/404.html` (Vercel serves it on
any unmatched path).

Notes:
- `/apply` and `/join` render a thank-you state on submit but **do not send
  anything** (no backend). See [CURRENT_STATE.md](CURRENT_STATE.md) and
  [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md).
- The four commercial pages above (`/partners`, `/for-vets`, `/pilot`, `/demo`)
  carry tracked query strings when they funnel, e.g.
  `/apply?type=early-access&from=partners`, `/join?type=walker&from=partners`.
- **Analytics + consent** ships on every shell page (via `shell/shell.js`) and on
  the four commercial pages (direct tag). It loads
  `/analytics/fylos-analytics.global.js` (the built `@fylos/analytics` bundle,
  copied to `website-live/analytics/`), mounts a Shadow-DOM consent banner,
  captures first-touch attribution, and blocks all nonessential events until
  consent. No real analytics provider is wired in. The **locked** film
  (`index.html`) is not instrumented (adding the one tag there is a
  founder-directed change to the locked file). See
  [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md).
- `/found` is a single shared demo page; the real product needs per-tag codes
  (`/p/<id>`).
- Redeploy the website with the founder's authenticated Vercel CLI:
  `vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects`.

---

## 2. React app routes (SPA — `src/App.jsx`)

React Router routes, defined in [src/App.jsx](../src/App.jsx). Root `/` is a gate:
it redirects to `/onboarding-v4` on first run, or `/sign-in` once
`localStorage['fylos.intro'] === '1'`. There are **96 routes**; grouped below.

**Root / entry**
- `/` (gate → onboarding or sign-in), `/welcome`, `/app-shell`, `/home`,
  `/home-dashboard`

**Onboarding & auth**
- `/onboarding`, `/onboarding-v2`, `/onboarding-v3`, `/onboarding-v4`,
  `/onboarding-directions`, `/onboarding-connected`, `/onboarding-preview`,
  `/splash-variants`
- `/sign-in`, `/sign-in-password`, `/sign-in-phone`, `/create-account`,
  `/create-account-v1`, `/forgot-password`, `/verify-email`

**Pets**
- `/pets-home`, `/pets-profile`, `/pets-health`, `/pet-profile`, `/pet-view`,
  `/add-pet`, `/edit-pet`

**Services / booking / providers**
- `/services-view`, `/services-variants`, `/providers`, `/provider-detail`,
  `/provider-card-variants`, `/provider-reviews`, `/booking`, `/booking-flow`,
  `/booking-confirm`, `/booking-details`, `/cancel-reschedule`, `/review`,
  `/map-providers`, `/upcoming`, `/next-up-variants`

**Journal / activity / trackers**
- `/journal-view`, `/photo-gallery`, `/feeding-tracker`, `/gps-tracking`,
  `/training-tips`, `/health-reminders`

**Pro (service provider) side**
- `/pro-registration`, `/pro-dashboard`, `/pro-requests`, `/pro-walk`,
  `/pro-earnings`, `/pro-profile`

**Chat / social / invites**
- `/chat`, `/walker-chat`, `/invite`, `/invite/:inviteId`, `/user-profile`

**Emergency & safety**
- `/emergency`, `/lost-pet`, `/danger-reports`, `/vet-telehealth`, `/vet/primary`

**Money**
- `/wallet`, `/walker-payment`, `/subscription`, `/paw-card`, `/currency`

**Settings — security**
- `/security/password`, `/security/2fa`, `/security/biometric`,
  `/security/sessions`, `/security/connected-accounts`

**Settings — privacy**
- `/privacy/visibility`, `/privacy/discoverable`, `/privacy/location`,
  `/privacy/activity`

**Settings — account / system**
- `/region`, `/language`, `/notification-prefs`, `/data/export`,
  `/integrations/calendar`, `/integrations/health-sync`, `/help`

**Legal**
- `/legal/terms`, `/legal/privacy`, `/legal/licenses`

**Design-system / lab (not shipped app screens)**
- `/design-system`, `/brand`, `/marketing-preview`, `/iconography-lab`,
  `/felt-icons`, `/icons-compare`, `/profile-hero-variants`

**Email & Newsletter (`src/email` module, not `src/screens`)**
- Public subscriber states: `/newsletter` (hub), `/newsletter/confirm`,
  `/newsletter/preferences`, `/newsletter/unsubscribe`, `/newsletter/resubscribe`,
  `/newsletter/expired`
- Admin console: `/newsletter/admin/campaigns`, `/newsletter/admin/campaigns/:id`
  (plus `/edit`, `/audience`, `/preview`), `/newsletter/admin/subscribers`,
  `/newsletter/admin/suppression`
- Self-contained TypeScript module in `src/email`, mounted as `/newsletter/*` in
  `src/App.jsx`. Front-end only, typed in-memory mock service, no email provider.
  Own scoped configs: `tsconfig.email.json`, `eslint.email.config.mjs`,
  `vitest.email.config.ts`. A floating "Preview state" control (or `?state=`) shows
  every screen in its loading / empty / error / failed states.

Each route maps to a file in `src/screens/` (imported at the top of
`src/App.jsx`). The `path=` → screen-file mapping is the import list in that file.

---

## 3. How each frontend is served

- **Website:** static files under `website-live/`, one `.html` per route, on the
  `fylos-neighborhood` Vercel project. No build step for the website itself.
- **React app:** `npm run build` (Vite) emits `dist/`; `vercel.json` rewrites all
  paths to `/` so React Router handles routing client-side. Root `index.html` is
  the SPA entry (do not confuse it with `website-live/index.html`).

---

## 4. Resources / SEO frontend (static, generated, `resources-site/`)

A third frontend: a self-contained, typed static site generator in `resources-site/`
that emits crawlable HTML for the marketing resources and SEO surface. It is its own
mini project (own `package.json`, `node_modules`, `tsconfig.json`, `eslint.config.js`),
mirroring the `analytics/` zone. It does not touch the homepage, product pages, or the
locked film. Full details in [resources-site/README.md](../resources-site/README.md).

| Route | Page | Output |
|---|---|---|
| `/resources/` | Resources hub | `dist/resources/index.html` |
| `/resources/<category>/` | Category | `dist/resources/<category>/index.html` |
| `/resources/<category>/<slug>/` | Article | `dist/resources/<category>/<slug>/index.html` |
| `/product-updates/` | Product updates index | `dist/product-updates/index.html` |
| `/product-updates/<slug>/` | Product update | `dist/product-updates/<slug>/index.html` |
| `/company/announcements/` | Announcements index | `dist/company/announcements/index.html` |
| `/company/announcements/<slug>/` | Announcement | `dist/company/announcements/<slug>/index.html` |
| `/sitemap.xml` | Sitemap for this frontend | `dist/sitemap.xml` |
| `/robots.txt` | Robots (disallows `/admin/`) | `dist/robots.txt` |
| `/404.html` | Not found (noindex) | `dist/404.html` |

Notes:
- Content is typed local data under `resources-site/src/content/`, designed to be
  swapped for a backend or CMS without changing templates. No backend is built here.
- Every page ships title, meta description, canonical, Open Graph, Twitter card,
  JSON-LD, breadcrumbs, related articles, and responsive typography.
- Private `/admin/*` routes are excluded from indexing (`Disallow: /admin/`); `404.html`
  is `noindex` and omitted from the sitemap.
- Build: `npm run build` in `resources-site/` (origin via `SITE_URL`, default
  `https://fylos.me`). Output `dist/` deploys at the site root.
