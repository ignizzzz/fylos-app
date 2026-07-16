# Integration Preview Report

2026-07-16 · Integration of all recoverable FYLOS website work around the
original scroll-film site.

## Preview

| | |
|---|---|
| **Branch** | `claude/fylos-integration-preview-b1qlqk` (pushed to origin) |
| **Backup of original state** | tag `backup/pre-integration-main` (= `main`, untouched) |
| **Local preview** | `npx serve -l 4173 website` → **http://localhost:4173** |
| **App design-viewer** (separate surface) | `npm install && npm run dev` → http://localhost:5173 |
| **Production parity** | `website/` mirrors fylos-neighborhood.vercel.app plus the integration work; deploy with `vercel deploy` from `website/` when approved |

The film needs ~160MB of frames on first load; the loader bar covers this, and
a local static server (above) behaves like production (`cleanUrls`, 404).

## What was integrated

**Foundation (unchanged creative core):** the deployed film — gate with pet-name
personalization, 703-frame scrub through the miniature town, dwell overlays
(square, tag, vet, groomer, park, night), grain, coral-ball progress, watercolor
finale into the phone, roles footer. Verified byte-identical to production
before wiring began.

**Completed from the handoff's pending list (HANDOFF_STATUS §5):**
1. Tag scene: the missing Layout-6 primary CTA — "Get {pet}'s ID" → web app.
2. Vet scene stage 3: the dark reception screen on the desk monitor (booked
   just now · history loaded), per the approved Card-3 mockup.
3. Groomer scene: now the decided 3-stage swap (shop → neighbors → join branch),
   built with the film's own stage machinery and the approved card contents.
4. Footer role links: clinic card → `/apply` (walker card already → `/join`).

**Pages:** `/apply` and `/join` (recovered forms, now with loading/success/error
states through a mock service adapter), `/found`, `/why`, the five design
galleries (incl. the `/tag` page missing from the snapshot, recovered from
production), new `/privacy`, `/terms`, `/imprint` (drafts for counsel), styled
404. All assets recovered (repo + Vercel-only files).

**Features:** typed form adapter with mock mode (`fylos-api.js`), working
cookie-preferences panel (`fylos-consent.js`), honest store badges/social labels
(one real web-app CTA + visible "Coming soon"), favicons + meta descriptions,
clean-URL config.

## Storytelling files modified

Only `website/index.html`, 12 documented changes (full log in
INTEGRATION_DECISIONS.md §3): the three wiring items above, the footer/badge
honesty pass, head metadata, one mobile nav `white-space` fix, groomer dwell
1500→2600, one added JS line for groomer stages, one script include. The scroll
engine, frame pipeline, canvas rendering, anchors, gate, finale and all other
scenes are untouched. Frame sequences and videos: untouched.

## Tests completed

- **Automated browser pass: 47/47 green** (Playwright/Chromium, desktop 1440px
  + mobile 390px): film loads and paints; gate personalizes; every dwell overlay
  and every stage verified (tag CTA with pet name, vet s0/s1/s2 + reception
  screen, groomer s0/s1/s2, park s0/s1, night); finale badge real; footer role
  links exact; zero `href="#"` on the film page; consent panel opens/persists;
  join + apply submit in mock mode with loading → success, `?mockfail=1` →
  error box; "something else" profession reveal; all 14 routes render; unknown
  route → styled 404; no horizontal overflow on film or forms at 390px.
- **Production build** of the repo (React viewer): `vite build` green
  (pre-existing chunk-size advisory only).
- No formatter/linter/test suite exists in this repo to run (none configured on
  any branch); nothing was disabled or skipped.
- Screenshots of every verified moment are in the session log.

## Remaining issues / honest gaps

1. Fonts load from Google Fonts; in the sandboxed test browser they fell back
   (environment-only — production loads them fine).
2. `/found` uses placeholder tel/sms and one shared demo pet; per-tag `/p/<id>`
   pages need the backend (documented for Panagiotis).
3. Legal pages are drafts and say so; counsel review before launch.
4. Store badges stay "Coming soon" until the apps ship.
5. The reception screen is hidden ≤760px (anchor clamping would misplace it);
   the vet card itself carries the message on mobile.
6. `/why` is Greek by design (internal rationale page).

## Not recoverable from previous sessions

Growth Admin, newsletter/email-preference UI, blog/SEO pages, and any dedicated
analytics implementation exist in **no** accessible branch, PR, stash, dangling
commit, sibling folder, or the live deployment (full sweep in
INTEGRATION_SOURCE_INVENTORY.md). They were not reinvented; the consent UI was
built new only because the footer needed a real "Cookie preferences"
destination. If those sessions' output exists, it was never pushed here.

## State of the branches

`main` untouched (also tagged `backup/pre-integration-main`). `fylos-dev`,
`claude/website-design-concepts-fwtqe6` and all other source branches left
exactly as found. Nothing merged into `main` — this branch is the preview,
ready for visual review.
