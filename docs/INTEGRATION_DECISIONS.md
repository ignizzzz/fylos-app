# Integration Decisions

Which implementation was chosen for each area, and why. The rule applied
throughout: **the original scroll-film website is the source of truth**; newer
session work is folded around it, never over it.

## 1. Foundation

| Area | Chosen | Over | Why |
|---|---|---|---|
| Film page (`website/index.html`) | `website-live/index.html` from `fylos-dev` | `public/film/city/v2/site/index.html` from the film branch | The recovered live file is one deploy newer: it already carries the founder's Jul-14 "batch wire" (Layout-6 tag rows, vet recipients card, peach apply box, `/apply`+`/join` links), the intro veil, the real-QR try card and the `#hero=` deep link. Verified byte-identical to production. |
| Film frames + dwell keyframes | film branch `public/film/city/v2/site/assets` | — | Only place the 703 frames exist. Copied to `website/assets/`. |
| Sub-pages (apply, join, why, found, layouts, vet, groomer, park) | `website-live/*` from `fylos-dev` | — | Only source; byte-identical to production. |
| `/tag` page | recovered from the live deployment | — | Missing from every branch. |
| Repo layout | everything under one `website/` folder (deployable root) | keeping `website-live/` name | One canonical site folder; `website-live/` was moved (git rename) so there is no duplicate copy on this branch. The originals remain on `fylos-dev`. |
| `takes.html` / `quality.html` + ~175MB of take/quality videos | left on the film branch | copying into `website/` | They are production evidence, 404 on the live site, and would triple the branch's asset weight. |
| App design-viewer (`src/`) | `fylos-dev` state (incl. Paw Card 98) | `main`'s older state | Strictly newer, builds green, and is the design reference Panagiotis uses. Public site and viewer remain fully separate surfaces. |
| `website-lab/` concepts | kept as-is (design archive, not routed) | deleting | Session output preserved for reference; not part of the public site. |
| Social templates branch | left on its branch | merging | Marketing collateral, not website code. |
| `claude/code-review-discussion-3wStH` fix | nothing to do | cherry-pick | The fix is already in current `main` (pre-rewrite lineage; see inventory). |

## 2. Wiring the founder-approved cards into the film

HANDOFF_STATUS §5 named the batch wire as the biggest open item. Audit result:
the live file had already wired the tag rows, all three vet stages and the park
P1 two-stage. Still missing, now done:

| Scene | State found | What was integrated (source: founder-approved gallery mockups) |
|---|---|---|
| Tag (`#ovl-tag`) | Layout 6 rows + QR try card present, **primary CTA missing** | The single coral full-width **"Get {pet}'s ID"** button (petname-aware, falls back to "Milo"), → `https://app.fylos.me`. Sits between the status rows and the QR try card, using the batch-wire `.cta` style. |
| Vet (`#ovl-vet`) | 3 stages wired | Added the one missing decided element: the **dark reception screen** on the desk monitor ("FYLOS · Reception / 15:30 · {pet} / booked just now / History loaded"), anchored to the existing `#anc-screen`, dotted drop-line, visible only in stage 2, hidden ≤760px where the anchor clamp would misplace it. |
| Groomer (`#ovl-groomer`) | single static card + lamppost card — **not the decided 3-stage swap** | Rebuilt as the decided 3-stage swap using the film's existing `.vstage` machinery: **s0** the shop (untouched original card), **s1** the neighbors (Sofia M. / Marc T. rows, "Not a faceless agency…"), **s2** the join branch (Walkers & sitters · FASTEST in-app / Groomers & every other pro) with one "Apply to join" → `/join`. The old lamppost card's content and destination live on in s2, so nothing was lost — one card per moment, as in the mockups. |
| Park (`#ovl-glass`) | P1 two-stage wired | Nothing to change. |

## 3. Protected-file modification log (`website/index.html`)

Every change to the film file, exhaustively:

1. `<head>`: added `meta description` and brand favicon (additive).
2. `#ovl-tag` card: added the Layout-6 primary CTA (one `<a class="cta">`).
3. `#anc-screen`: added the `.recscreen` reception panel (markup only; visibility is CSS-driven by the existing stage system).
4. CSS: one new commented block "integration wire (Jul 16)" — `.recscreen`, `.recip .ic.av`, `.recip .rr`, `.fastpill`, `.badge.soon`, `.endlinks .muted`; plus `white-space:nowrap` on `.nav a` (mobile nav labels were wrapping inside the pill).
5. `#ovl-groomer`: restructured into `data-stage` + three `.vstage` blocks (contents per §2); lamppost card removed (absorbed into s2).
6. `SEGS` timing: groomer `dwell 1500 → 2600` — three stages need the same room as the vet's three stages. Only timing change made.
7. `setOverlay()`: one added line — groomer stage thresholds (.38/.72), identical to the vet's.
8. Footer roles: Clinic & Shop card `https://fylos.me` → `/apply` (completes HANDOFF §5.3; walker card already pointed to `/join`).
9. Store badges (endbar + finale): the dead `href="#"`/`#download` badges became **one real link** ("Open now · The web app" → app.fylos.me) and **one honest non-interactive "Coming soon" badge**. No fake store links.
10. Social links: dead `#` anchors → non-interactive muted labels with "Soon".
11. Fine print: `#` anchors → `/privacy`, `/terms`, `/imprint`, and "Cookie preferences" opens the consent panel (`data-consent-open`, no-JS fallback `/privacy#cookies`).
12. Appended one `<script src="assets/js/fylos-consent.js" defer>` include.

**Not touched:** the scroll engine, frame loader, canvas renderer, zone resolver,
anchors/leader math, gate, ball, finale shrink animation, all frame sequences,
loop video handling, square/night overlays, review hooks (`#f=`, `#ovl=`, `#dock=`, `#solo=`, `#hero=`).

## 4. New shared infrastructure (kept out of the film's inline code)

- `assets/js/fylos-api.js` — single typed adapter all forms submit through.
  Mock mode on; `?mockfail=1` and `?mockslow=1` exercise error/loading states.
  Backend connection = flip `mock:false` + two endpoint URLs.
- `assets/js/fylos-consent.js` — cookie-preferences dialog. Honest: states the
  site sets no tracking cookies and has no analytics; can forget the stored pet
  name; holds the analytics opt-in switch for later. FYLOS palette/type.
- Forms (`apply.html`, `join.html`): loading spinner + disabled state, existing
  success panels kept, new warm error box with retry guidance. Validation
  behavior unchanged.
- `privacy.html`, `terms.html`, `imprint.html` — the footer promised them; written
  in the site's voice, visibly marked as drafts for counsel, honest about what
  the site actually does. Same top-bar pattern as apply/join.
- `404.html` — in the neighborhood's voice, links back to `/` and `/join`.
- `vercel.json` (`cleanUrls`) so `/apply` etc. resolve exactly like production.

## 5. Design consistency

One design system already existed (cream/peach/ink/coral/sage, Fraunces + Inter,
rounded cards, warm shadows). Everything added reuses those exact tokens and the
film's own component vocabulary (`.rows`, `.recips`, `.cta`, `.livepill`,
kickers, chips). No second navigation, no second footer, no card-grid sections,
no fake statistics/testimonials/partners were introduced. The galleries
(`/tag`, `/layouts`, `/vet`, `/groomer`, `/park`) stay as internal design
references, not linked from public navigation.

## 6. Honesty rules applied

Store badges, social links and legal links no longer pretend. Everything
clickable goes somewhere real; everything not yet real is visibly labeled
"Coming soon"/"Soon" per the product direction's FOMO voice. The QR on the tag
card remains a real, working code (opens `/found`).
