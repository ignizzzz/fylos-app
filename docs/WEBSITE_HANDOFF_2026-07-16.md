# Fylos Website · Session Handoff · 2026-07-16

_Written at the end of a full founder-directed design session (commits `0e32a45..2da2f5b`
on `fylos-dev`). The founder is moving to another account to run the NEXT session._

**THE NEXT JOB: make the whole website perfect on MOBILE (phone screens), start to
finish.** Everything below is what you need to do that job without breaking what the
founder has already approved.

---

## 0. Read these first

1. [AGENTS.md](../AGENTS.md) — permanent repo rules (frontend only, no backend, no
   em/en dashes, no emoji, honesty discipline, run the checks).
2. [docs/LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md) — the film is locked, BUT
   this session made founder-directed edits to it (documented below). The engine
   (canvas, SEGS, scroll) remains untouchable; overlays/cards/nav/footer are now
   founder-editable territory when he asks.
3. [docs/ROUTES.md](ROUTES.md) — every route, including the new ones.
4. This file.

---

## 1. Where everything stands

- **Everything is committed and pushed** on `fylos-dev` (`2da2f5b`). `main` untouched.
- **Founder review surface:** https://fylos-preview.vercel.app (Vercel project
  `fylos-preview`, a THROWAWAY preview, safe to redeploy). The REAL production site
  `fylos-neighborhood.vercel.app` still runs the OLD version and has NOT been
  touched this whole session. Do not deploy to it without the founder's word.
- **Founder verdict on desktop:** «Ωραία, πολύ ωραία, νομίζω έχουμε τελειώσει» —
  desktop is approved as-is. Mobile is the next battle.

### Deploy pipeline (IMPORTANT, non-obvious)

The film needs 703 frame JPGs (`assets/v9-one/0001.jpg` … `assets/v4-t7b/0121.jpg`,
4-digit, 1-based) which are NOT in the repo. The deploy bundle = `website-live/*`
+ those assets. The previous bundle lived in a session scratchpad you cannot access.
To rebuild it:

1. Copy `website-live/` into a staging dir.
2. Download every asset from the CURRENT preview (it has everything, including the
   new generated images): frames per the SEGS counts in `index.html`
   (`v9-one:181, v4-t2b:61, v4-t3:61, v4-t4:61, v4-s4:121, v4-t5:97, v4-t7b:121`)
   plus every `assets/...` path referenced in the HTML, from
   `https://fylos-preview.vercel.app/<path>`.
3. `vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects` from the
   staging dir (the `--scope` flag is REQUIRED non-interactively). First run in a
   fresh dir: it will link; make sure it links to project `fylos-preview`, NEVER to
   `fylos-neighborhood`.

Checks before any handback: `node scripts/check-website-shell.mjs` (validates all
shell pages: links, routes, anchors, a11y) + `npm run build` + the dash grep
(`grep -lP '[\x{2013}\x{2014}]' website-live/*.html` — only index.html line ~101, a
pre-existing CSS comment, is allowed).

---

## 2. What shipped this session (chronological)

1. **Final integration + QA baseline** — all six repo zones green; analytics/consent
   wired into the static site via `shell/shell.js` (bundle at
   `website-live/analytics/fylos-analytics.global.js`); `/apply` & `/join` fire
   consent-gated form events (field NAMES only, never values).
2. **Batch wire of the chosen cards INTO the film** (founder-directed edit of the
   locked file): tag Layout 6 (two-line rows + one coral CTA), vet 3 stages
   (health book / who-sees-what / run-a-clinic **with the dark reception panel
   pinned above the desk monitor**), groomer 3 stages (shop / neighbors / join),
   park P1 (report/cleared). Night scene stripped bare (no chips, no Little Shop).
3. **Frame-locked cards**: dwell cards carry `data-fx/data-fy` (and `data-fx2/fy2`
   for vet stage 2) and are positioned in FRAME space by `placeAnchors()`, clamped
   to the viewport. They sit on the same spot of the scene at any screen size.
   Approved positions: tag .06/.11 · vet s0/s1 .06/.10 · vet s2 .30/.33 (clears the
   cat) · groomer .21/.28 · park .06/.11.
4. **Park pointer**: a dashed coral ARC drawn by `placeAnchors` (`#leader-park`)
   from the card, sagging UNDER the glass shards, rendered BEHIND the
   `Reported · east path` label. The sketch-frame idea was tried twice and killed.
5. **Roles row = 4 separate cards** (Pet Parent / Walker & Sitter / Clinic /
   Groomer), each figurine on the same square-box geometry, ALL CTAs docked to the
   card bottom (flex + `margin-top:auto`). Clinic → `/apply`, Groomer →
   `/join#groomerform`.
6. **Nav**: the film's liquid-glass pill got a discreet 2-line burger that blooms
   an **N4 glass canopy** under the bar (founder pick over N1-N3 and over a
   right-side drawer he hated: «ανοίγει αυτή η μαλακία κάπου δεξιά»). The shell
   header on ALL inner pages is the same floating glass pill (`shell/shell.css`).
7. **10 pages redesigned** minimal + photographic (product, features,
   how-it-works, health-book, book-care, the-tag, partners, pilot, demo + join
   restructure). No fake phone-UI mockups anywhere («δεν αντιπροσωπεύει αυτό που
   κάνουμε τώρα»). Shared system: photo hero + film-style glass card, alternating
   photo sections, LIVE NOW / COMING SOON pill rows, peach closing band with
   EXACTLY TWO figurines (uniform count is a founder rule), shell everywhere.
8. **Higgsfield asset family** (recipe in §5): figurines groomer/vet/sitter/
   trainer (`assets/roles/*.png`, committed) + scenes `k-partners.jpg` (both sides
   of the leash), `k-book.jpg` (health book still), `k-home.jpg` (dog safe on the
   doorstep), `k-vetexam.jpg` (vet leaning over the retriever).
9. **Business hierarchy** (founder + team decision): vets = first priority
   (coming soon), groomers = next in line (coming soon, own early-access path),
   walkers/sitters = live now, every other pro = quiet demand capture. `/join` has
   TWO separate forms: `#groomerform` (locked to Groomer) and the every-other-pro
   form (Groomer removed from its select). Features page: Document vault and
   Hazard reports are LIVE (founder: already in the app); Share links and The
   little shop REMOVED (shop stays a hidden vision).
10. **Legal + uniform footers**: same fy-footer everywhere (film keeps its ink
    endbar); legal line links Privacy / Terms / Impressum (real pages, plain
    honest language, noindex) + the injected Cookie preferences control.
11. **WAITLIST (live!)**: there is no downloadable app for ~2-3 weeks, so every
    "Get the app" became "Join the waitlist". A REAL signup: the browser posts to
    Klaviyo's public client endpoint — company id `WMLwVg`, list `WLGCbr`
    ("Fylos App Waitlist", single opt-in), account org shows as "ARISTEIA".
    Surfaces: `/waitlist` page, an in-film glass MODAL (every `/waitlist` link in
    the film opens it in place), and an optional email pill UNDER the name gate
    that stores `pet_name` as a profile property alongside the email. Verified
    end-to-end twice; two smoke-test profiles (`waitlist-smoke-test@fylos.me`,
    `gate-smoke-test@fylos.me`) can be deleted from the list. **Launch day:**
    revert labels to "Get the app"/store links (single revert) and send ONE
    campaign to the list («η πόρτα άνοιξε», personalized with pet_name).

Parked/not done: analytics still NOT loaded on the film itself (founder-gated);
`/apply` + `/join` forms still submit nowhere (front-end thank-you only — the
waitlist is the only live capture); `/options`, `/options2`, `/options3` picker
pages exist only on the deployed preview, not in the repo (archives of decided
choices: A4 finale, C2 footer, F1 ledgers, N4 canopy).

---

## 3. The founder's taste (learned the hard way — follow it)

**Loves:**
- The miniature clay-diorama world. Photography over UI. Real film stills and the
  figurine family as the visual language of every page.
- **Warm cards**: white + peach-gradient panels, cream pill rows, radius 24-26,
  warm shadows. He REJECTED a plain-white editorial/hairline ledger as «τελείως
  άσπρο» and picked the warm-cards variant (F1).
- The **liquid glass** language: the floating pill nav, glass cards over photos,
  the N4 canopy. Everything that opens should feel like it GROWS from the bar, not
  appear beside it.
- **Options to choose from**: when a design call is subjective, build 3-4 LIVE
  variants on a throwaway page (pattern: /options*.html deployed on the preview),
  each labeled with a code (A1..A4, F1..F4, N1..N4) + one-line tradeoffs, and let
  him pick by code. This worked every single time.
- Pixel-level precision: he annotates screenshots with red circles/squares and
  expects the element EXACTLY there («ούτε πίξελ δεξιά ή αριστερά»).
- Personalization moments (the pet's name in copy, pet_name on the waitlist).
- Uniformity: equal figurine counts, aligned buttons, same footer everywhere,
  consistent chips. Asymmetry reads as sloppiness to him.

**Hates:**
- Side drawers / foreign UI patterns («ξένο... καθόλου δημιουργικό»).
- Fake phone/UI mockups on marketing pages.
- Drop shadows behind figurine cutouts (removed everywhere, uniformly).
- Text/lines crossing labels or covering scene objects (the cat, the QR, the
  engraved FYLOS, the Reported tag).
- Cringe copy ("Not a faceless agency…" was killed). Keep copy warm, short, honest.
- Too much orange: peach backgrounds in many boxes at once.
- Em/en dashes and emoji in ANY user-facing text (hard repo rule; use commas, «·»).

**Working style:** speak Greek, plain language, no jargon; he is the product owner,
not an engineer — all git/build/deploy stays on you. Commit every approved round to
`fylos-dev` (NEVER main until he says), redeploy the preview after every round, and
give him URLs to check from his phone. Verify visually yourself before handing
back (the film has review hashes: `#ovl=tag:50 | vet:20/55/90 | groomer:20/55/90 |
glass:30/80`, `#f=NN`, `#dock=NN`, `#hero=NAME`). Honesty discipline is absolute:
LIVE vs COMING SOON exactly as listed above, never invent features, stats or dates.

---

## 4. Technical map (what you will touch for mobile)

- **The film** (`website-live/index.html`, self-contained): engine = canvas +
  `SEGS` + `resolve/onScroll/tick` — DO NOT touch. Founder-editable: overlay cards
  (frame-locked via `data-fx/fy`, clamped `left>=10, top>=66`), `.gatebar` +
  `.gatewait`, `.nav` pill + `.canopy`, `.wlmodal`, roles/endbar. Mobile watchpoints:
  the frame-lock clamp on portrait (cover crops the 16:9 frame hard — cards may
  need per-breakpoint max-widths), gate + gatewait stacking on short screens,
  canopy width `min(560px,92vw)`, modal on small screens (form goes column
  <480px), the A4 finale (copy bottom-docked <1000px, phone top:44%).
- **Inner pages**: each self-contained with the same head pattern (fonts →
  `/shell/shell.css` → noscript → `/shell/shell.js` → page `<style>`), shared
  header/menu/footer blocks (source of truth: `shell/header.html`,
  `shell/footer.html`). Page CSS breakpoints currently at 880/820/720/560/520/480.
- **Waitlist JS** lives in `waitlist.html` (page) and in the film's tail script
  (modal + gate). Company `WMLwVg`, list `WLGCbr` — public by design, safe in page
  source.
- **Analytics**: `@fylos/analytics` (consent-gated, PII-safe). Loaded by
  `shell/shell.js` on shell pages only. Rebuild: `npm --prefix analytics run build`
  then copy `analytics/dist/fylos-analytics.global.js` to `website-live/analytics/`.
- **Higgsfield recipe** (if new images are needed; balance was ~125 credits,
  SHARED pool — check `balance` first): model `nano_banana_pro`, reference image =
  `assets/roles/walker.png` (figurines) or `assets/kvet-hi.jpg` (world/scenes),
  prompt constants: matte clay/plaster, tilt-shift collectible model photography,
  cream #FBF7F2 studio bg, coral #E85D2A as the ONLY saturated accent, no text/logos.
  Figurine pipeline: generate → `remove_background` → PIL trim/getbbox → resize
  h≈900 → `assets/roles/`. Scenes: 16:9, quiet upper third, → JPEG q86 ≤2000px.

---

## 5. Suggested kickoff for the mobile session

Verify every page and the whole film at 390x844 and 360x800 (portrait) and at
tablet 768x1024. Known suspects: film dwell cards overflowing/clipping on portrait
(frame-lock projects a 16:9 frame), the gate + email pill + scroll hint spacing,
the canopy and modal, page heros (`min-height:64vh` + glass card), the two-column
sections stacking order, figurine strips on the closing bands, the 4-role grid
(2x2 at ≤1200, 1-col at ≤920 — check the film's media queries), the join double
form, and the footer wrap. Fix with the same design language, verify in the
browser, commit per round, deploy the preview, hand the founder URLs.
