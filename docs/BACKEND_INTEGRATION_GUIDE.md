# Backend Integration Guide

For Panagiotis. The public website is intentionally frontend-only today; every
backend-shaped behavior is fenced behind one small adapter so connecting the
real backend is a config change, not a refactor.

## Where frontend API calls are defined

One file: **`website/assets/js/fylos-api.js`**.

- `FYLOS_CONFIG.mock` — `true` today. Nothing leaves the browser.
- `FYLOS_CONFIG.endpoints` — the only URLs the site will ever POST to:

| Key | Suggested endpoint | Used by | Payload |
|---|---|---|---|
| `applyClinic` | `POST /api/apply-clinic` | `/apply` (vet clinics) | `{kind, fields, meta}` — `fields` = the form's name→value map (clinic_name, city, country, canton, vet_count, website, responsible_vet_name, cantonal_authorization, practice_software, practice_software_other, practice_volume, goals, contact_name, contact_role, contact_email, attestation, application_consent, marketing_optin) |
| `joinPro` | `POST /api/join-pro` | `/join` (groomers & other pros) | `{kind, fields, meta}` — fields: profession, profession_other, name, business, city, website, offer, email, consent |

Success = any 2xx. Non-2xx or network failure shows the site's error state and
lets the visitor retry (their input is preserved).

## How to connect

1. In `fylos-api.js`: set `mock: false`, point the two endpoints at the real API
   (absolute URLs are fine; CORS or same-domain rewrites, your call).
2. Deploy. That is the whole frontend change.

## How to test the states while still in mock mode

- `/join?mockfail=1` (or `/apply?mockfail=1`) → error state.
- `?mockslow=1` → 4s delay to inspect the loading state.
- Normal submit → success panel; payload is logged to the console
  (`[fylos mock submit]`).

## Forms that need endpoints

Only the two above. The walkers/sitters path on `/join` intentionally has no
form — it sends people into the app (`app.fylos.me`), where pro onboarding
already lives.

## Email

No email service is wired anywhere. The site uses plain `mailto:` links
(hello@, privacy@, vets@, pros@fylos.me). When application submissions become
real you likely want server-side notification/reply mail on the two endpoints —
that belongs behind the API, not in the frontend.

## Authentication

The public website has none and needs none. Everything account-shaped links to
`app.fylos.me` (your surface). The React design-viewer in `src/` is an internal
mockup viewer — its auth screens are simulated by design.

## Consent / analytics

**`website/assets/js/fylos-consent.js`** stores
`localStorage.fylos_consent_v1 = {essential:true, analytics:boolean|null}`.
There are NO analytics today and the UI says so honestly. If you add a tracker:
load it only when `FylosConsent.get().analytics === true`, and update the
wording in the panel and in `/privacy`. The panel also clears
`fylos_pet_name` (the only other thing the site stores).

## The tag / found flow

The film's tag card shows a real QR (`assets/tag-qr.png`) that opens `/found` —
currently one shared demo page with placeholder `tel:`/`sms:` (+41000000000).
The intended product flow (HANDOFF_STATUS §5.2): each physical tag gets a unique
code at `/p/<id>` resolving to that pet's finder page with owner-controlled
visibility. That needs backend routing + data; the demo page is the template.

## What is currently simulated

| Feature | Simulation | Real version needs |
|---|---|---|
| Clinic application | mock adapter, success after delay | `applyClinic` endpoint + storage + reply mail |
| Pro application | same | `joinPro` endpoint + storage + reply mail |
| Found-pet page | static demo pet, placeholder tel/sms | `/p/<id>` per-tag pages |
| Analytics consent switch | stored locally, gates nothing yet | a tracker that honors it |
| Pet-name personalization | localStorage only (by design) | nothing — this should stay client-side |
| App store badges | honest "Coming soon" labels | swap to real store links at launch |
| Booking/chat/health cards in the film | narrative UI inside the story, not widgets | nothing — they sell the app, the app does the work |

## Environment variables

The static site expects **none** — deliberate; it must stay deployable as plain
files (`vercel deploy` from `website/`, `cleanUrls` is in its `vercel.json`).
If you later template the endpoints per environment, inject them at build time
into `fylos-api.js` (the two URLs are the only thing that varies).

## The app design-viewer (repo root)

`npm install && npm run dev` (Vite, React). `npm run build` is green on this
branch. It is a design reference, not a product surface; nothing in it calls a
backend. `README_PANAGIOTIS.md` covers how it maps to the real app.
