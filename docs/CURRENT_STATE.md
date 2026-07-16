# CURRENT STATE

_Last verified: 2026-07-16 against branch `fylos-dev`. Build: green. Final
frontend-integration + QA pass done 2026-07-16 (analytics/consent wired into the
site, form events, route-doc reconciliation, broken-link + copy fixes, backend
guide). See [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)._

What is complete and what is still missing across the two frontends in this repo.
This is a snapshot; keep it honest and update it when reality changes. Source of
truth for decisions is [HANDOFF_STATUS.md](../HANDOFF_STATUS.md).

---

## Complete / working

### Marketing website (`website-live/`)
- **The scroll film (`/`)** — the full scroll-driven canvas film: frame
  animation, background effects (grain, veils, night), the six feature-box
  overlays, the name gate, and the finale. **Working and locked.** See
  [LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md).
- **Content pages** — `/why`, `/layouts`, `/vet`, `/groomer`, `/park`, `/apply`,
  `/join`, `/found` are all live and render correctly (see [ROUTES.md](ROUTES.md)).
- **Deployed** — live at `https://fylos-neighborhood.vercel.app`.
- **Aesthetic locked** — palette, type, card language, copy rules all decided
  (HANDOFF_STATUS §3–§4).

### React design viewer (`src/`)
- **Builds green** — `npm run build` succeeds (Vite 7). 1,987 modules, ~2.28 MB JS
  bundle.
- **96 routes** wired in `src/App.jsx`, covering onboarding/auth, pets, services &
  booking, journal/trackers, the Pro side, chat/social, emergency, money,
  settings (security/privacy/account), legal, and design-system labs.
- **First-run gate** — root `/` routes to onboarding on first visit, sign-in
  afterwards (via `localStorage['fylos.intro']`).
- Home dashboard is treated as final.
- **Email & Newsletter module (`src/email`, at `/newsletter`)** — public subscriber
  states (confirm, preferences, unsubscribe, resubscribe, invalid/expired) plus an
  admin campaign console (campaigns list/detail across draft/scheduled/sending/sent/
  failed, draft editor, audience selection, email preview, delivery summary,
  subscriber list, suppression). Front-end only, typed in-memory mock service, no
  email provider. Self-contained TypeScript with its own scoped checks, all green:
  `tsc -p tsconfig.email.json`, `eslint -c eslint.email.config.mjs`,
  `vitest -c vitest.email.config.ts` (32 tests), and the shared `npm run build`.

---

## Missing / not done yet

### Website — content & wiring
1. ~~New cards not yet wired into the film~~ **DONE 2026-07-16, founder-directed.**
   All chosen cards (HANDOFF_STATUS §4) are wired into the film: tag Layout 6
   with the coral "Get {pet}'s ID" CTA, vet 3 stages + the dark reception screen
   on the desk monitor (stage 2) + Allergies toggle, groomer converted to a
   3-stage swap (shop / neighbors / join), park P1 was already in. Engine
   untouched except groomer dwell 1500→2600 and one stage-threshold line.
2. ~~Footer role links~~ **DONE 2026-07-16.** Clinic card → `/apply`, walker →
   `/join`, zero dead `href="#"` left; the film footer now links every site page
   (Explore + Partners columns) and the store badges point to app.fylos.me.

### Website — backend (out of scope for this repo)
3. **`/apply` and `/join` do not submit anywhere.** Both render a thank-you state
   only; nothing is sent. A real submission target (email or DB) is needed — but
   per [AGENTS.md](../AGENTS.md), **no backend is built in this repo.** This is a
   separate, founder-commissioned effort.
4. **QR product flow.** The `/found` page is a single shared demo. The real
   product needs a unique code per physical tag (`/p/<id>`). Not built.

### Tooling — now wired (was a gap, closed 2026-07-15)
5. **Build advisories (non-blocking).** Node.js version notice (Vite prefers
   20.19+/22.12+; local is 20.13.1), stale browserslist data, and a >500 kB chunk
   warning on the main app. None fail the build.
6. **All zone checks currently pass.** Lint, typecheck and tests are now wired
   per zone (main app, `src/email`, `src/admin`, `resources-site`, `analytics`)
   and every suite was verified green on 2026-07-15. Commands are listed in
   [AGENTS.md](../AGENTS.md#checks-run-before-finishing). Earlier snapshots of this
   file said these were "installed but not wired" — that is no longer true.

> Provenance note: the TypeScript modules and their tooling (`src/email`,
> `src/admin`, `src/forms`, `resources-site/`, `analytics/`) were added on
> 2026-07-15 by parallel sessions in this working tree, not as part of writing
> these docs. As of this snapshot they are all uncommitted (`git status` shows
> them untracked/modified). This doc records their verified state; it does not
> claim ownership of that work.

---

## At a glance

| Area | State |
|---|---|
| Scroll film (storytelling) | ✅ Complete, LOCKED (not instrumented for analytics, see below) |
| Website content pages | ✅ Live |
| Commercial funnel (`/partners` `/for-vets` `/pilot` `/demo`) | ✅ Live, funnel into `/apply` + `/join` with tracked query params |
| Analytics + consent on the site | ✅ Wired (shell pages + commercial pages), consent-gated, PII-safe, no real provider |
| `/apply`, `/join` submission | ⚠️ Front-end only, no backend (now fire `form_started`/`form_submitted`) |
| Per-tag QR (`/p/<id>`) | ❌ Not built (demo `/found` only) |
| Film: chosen cards wired (tag L6, vet 3-stage + reception, groomer 3-stage, park P1) | ✅ Done 2026-07-16, founder-directed |
| Film footer links (roles, badges, page links) | ✅ Fixed 2026-07-16, zero dead links |
| Main app: build · typecheck · lint · test | ✅ Green |
| Email module (`src/email`) checks | ✅ Green |
| Admin CRM (`src/admin`) checks | ✅ Green |
| resources-site checks | ✅ Green |
| analytics checks | ✅ Green |

---

## How to reproduce the checks

The full per-zone check commands (all verified green) live in
[AGENTS.md](../AGENTS.md#checks-run-before-finishing). Quick start for the main app:

```bash
npm install          # first time only (node_modules is present already)
npm run build        # Vite build — expect "✓ built in …s", no errors
npm run typecheck && npm run lint && npm run test   # main-app static gates + tests
npm run dev          # local dev server on http://localhost:3000 (React viewer)
```

The website pages are static; open `website-live/*.html` directly or via the
`fylos-neighborhood` Vercel deploy.
