# Fylos — Website & Design Handoff

_Status snapshot: 2026-07-15. Branch: `fylos-dev` on `github.com/ignizzzz/fylos-app`._

This document is the single brief for whoever picks this up next (Panagiotis and/or an AI assistant). It says what was decided, what is done, what is still pending, and where everything lives.

---

## 1. What the project is

Two parallel tracks:

1. **The marketing website** — a scroll-driven "one continuous film" through a miniature clay-diorama pet neighborhood (dog/pet-care app). **Live:** https://fylos-neighborhood.vercel.app
2. **The app** — Panagiotis owns this (.NET backend + Kotlin/Compose mobile; backend live at `app.fylos.me`). The design work below is the reference for both the app UI and the site.

This branch holds: the React design-viewer, all the spec `.md` docs, and `website-live/` (the exact HTML of the live pages, recovered from Vercel).

---

## 2. Live pages (open from any browser)

| Page | URL |
|---|---|
| Film / site | https://fylos-neighborhood.vercel.app |
| Concept rationale (why "neighborhood") | https://fylos-neighborhood.vercel.app/why |
| Tag design gallery | https://fylos-neighborhood.vercel.app/layouts |
| Vet cards | https://fylos-neighborhood.vercel.app/vet |
| Groomer cards | https://fylos-neighborhood.vercel.app/groomer |
| Park card | https://fylos-neighborhood.vercel.app/park |
| Apply (vet clinics) | https://fylos-neighborhood.vercel.app/apply |
| Join (pros) | https://fylos-neighborhood.vercel.app/join |

Source of all of these is in `website-live/`.

---

## 3. Aesthetic (applies everywhere)

- **Palette:** cream `#FBF7F2`, peach `#FFE9DC`, ink `#2B2320`, ink-soft `#6E625B`, **coral `#E85D2A` (the only saturated accent)**, sage `#7C9271`.
- **Type:** Fraunces (serif display, italic coral accents) + Inter (body).
- **Cards:** rounded 24-26, warm shadow, coral CTAs, peach chips + coral icons.
- **COPY RULES (hard):** never use em or en dashes (use commas), never use emoji. Voice is warm, confident, with "coming soon / be first" FOMO for anything not yet live.
- **Visuals:** prefer **cinematic diorama scenes** (a character or a place from the miniature world) over flat UI icons for hero/visual moments. Example: the /join path cards use the walker-with-dog scene and the groomer shop, not icons.

---

## 4. Design decisions CHOSEN (these are final)

### Tag moment — "Layout 6"
- Headline "One scan, and {pet} walks home." + 3 status rows:
  - **Digital ID · LIVE NOW** (download in the app, print it, put it on the collar)
  - **Engraved metal tag · COMING SOON** (does not exist yet)
  - **"You always choose what a finder sees" · your call** (private by default)
- ONE coral full-width button **"Get {pet}'s ID"** (uses the pet name entered at the start; falls back to "Download the app").
- Collar chip reads just **"FYLOS ID"** (no pet name), placed BELOW the tag disc so it does not cover the engraved "FYLOS" on the tag.
- Store badges and a "free to start" caption were tried and REJECTED. An animated pointer/ring was tried and REJECTED. Keep it clean.

### Vet scene — 3 cards that swap on scroll
- **Card 1 (Health book):** "{pet}'s health book, always up to date." Rows: vaccines / next check / weight / allergies.
- **Card 2 (It travels, your call):** "You choose what travels, and to whom." Left = toggles of what is in the book; Right = "Who sees what · your call": **Your vet** (full history), **Walker, sitter** (allergies, routine, how to handle him), **Every other pro** (each sees only what you allow). Foot: their notes and prescriptions come back to the same book. CORE MESSAGE: the moment you book, the vet already has the whole history, automatically, with the owner's consent, both ways.
- **Card 3 (Run a clinic):** "One book, both sides of the leash." Reception + pocket panels + warm peach apply box, PLUS a dark "reception screen" element on the desk monitor showing an incoming booking with the history loaded. Coming soon + Apply → /apply.

### Groomer scene — 3 cards that swap on scroll
- **Card 1 (The shop):** "Booked in two taps." Real booking (sold confidently, not "coming soon").
- **Card 2 (The neighbors):** "Walkers and sitters, two doors down." Checked, reviewed, local casual helpers.
- **Card 3 (Join, one door for all):** "Good with pets? Join the neighborhood." Branches: **Walkers & sitters** apply in the app in ~5 min (marked FASTEST); **Groomers & every other pro** fill a short form. Apply → /join.

### Park scene — "P1"
- "Something sharp? Say it once." Hazard report: broken glass on the path circled with a hand-drawn coral ellipse + "Reported · east path". Flow: you report → neighbors and the park keeper are warned → Cleared. Two stages in the film (report / cleared).

### Apply page (`/apply`, vet clinics)
- A full PAGE, not a modal. **Low-friction verification:** we ask clinic name, city, and the responsible vet's NAME, then verify ourselves through Switzerland's free public registers. Nothing to upload now; licences/diplomas only later if the clinic joins the pilot.
- Key field: **which practice-management software they use** (Vetera, easyVET, Provet Cloud, IDEXX Animana / Cornerstone / Neo, ezyVet, Digitail, Covetrus, Debevet, Other, Paper or none). This determines how the record sync works; paper clinics get a Fylos web view from day one.
- 4 sections: the clinic / the responsible vet / how they work today / about you (contact + attestation + application-consent + optional marketing + Swiss-FADP privacy fineprint, privacy@fylos.me).

### Join page (`/join`, pros)
- Two paths. **Walkers & sitters:** apply in the app (fast lane, "Start in the app" → app.fylos.me). **Groomers & every other pro:** a form with a profession select whose "Something else" reveals a free-text field, so we capture professions we have not modeled yet. Vet clinics get a link to /apply.

### Why page (`/why`)
- The concept rationale, in Greek, for internal / team-meeting use. Explains why "neighborhood": pet care is local, daily, and trust-based; each feature is a place in the town; the emotional brand is the moat; local density is the go-to-market; plus an objections-and-answers section.

---

## 5. What is PENDING / NOT done yet

1. **BATCH WIRE INTO THE FILM (the biggest open item).** The new cards in section 4 currently live only as separate gallery pages and mockups. They are NOT yet integrated into the actual film `website-live/index.html` overlays. The live film still shows the OLD cards. Wiring is needed for `#ovl-tag` (Layout 6), `#ovl-vet` (its 3 stages s0/s1/s2), `#ovl-groomer` (needs to become a 3-stage swap like the vet), and `#ovl-glass` (the park P1). The film ALREADY has the anchor systems for the vet monitor (`#anc-screen`, pulse ring + leader line) and the park glass sketch-circle (`#anc-pin`, ellipse + "Reported" label), so those can be reused.
2. **Backend for `/apply` and `/join`.** Both are front-end only right now (submit shows a thank-you state, nothing is sent). Need real submission to email or a DB. Related: the working QR product flow should give each physical tag a unique code (`/p/<id>`); the demo currently uses one shared `/found` page.
3. **Footer "Apply to join" links.** The walker/groomer role cards in the film footer still point to `fylos.me`. Only the clinic "Apply for early access" links were pointed to `/apply`. Point the walker/groomer ones to `/join`.

---

## 6. Where everything lives

- **Live site:** Vercel, https://fylos-neighborhood.vercel.app . Redeploy with the founder's authenticated CLI: `vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects` (the `--scope` flag is required in non-interactive mode).
- **This branch (`fylos-dev`):** the React design-viewer, all `.md` spec docs, `website-live/` (recovered page source), and this file.
- **The film source + 4K masters + all 167MB of frames:** on branch `claude/website-design-concepts-fwtqe6`, under `public/film/city/v2/` (git worktree at `~/fylos-website-film`). That branch has the full FILM and its production pipeline notes; this branch has today's page/card work.

---

## 7. Spec docs in this repo worth reading first

- `FYLOS_PRODUCT_DIRECTION.md` — DNA mix, voice rules, anti-patterns, launch order.
- `FYLOS_DESIGN_TOKENS.md` — the real palette, type, radii, shadows, motion.
- `FYLOS_UX_COPY.md`, `FYLOS_DESIGN_SYSTEM.md`, `FYLOS_TECH_BRIEF.md`, `FYLOS_AUTH_FLOW.md`, `FYLOS_SURFACE_PLAN.md`.
- `README_PANAGIOTIS.md` — the existing note to Panagiotis about the app integration.
