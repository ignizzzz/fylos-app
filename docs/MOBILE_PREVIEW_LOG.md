# MOBILE PREVIEW LOG

_One entry per review round. The preview target is ALWAYS the throwaway Vercel
project `fylos-preview` (https://fylos-preview.vercel.app). The production
project `fylos-neighborhood` is never touched by this work._

Deploy pipeline (unchanged from the handoff): staging dir = `website-live/*` +
the 724 film/site assets (downloaded from the previous preview, verified 0
failures) → `vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects`,
linked to project `fylos-preview`.

---

## Round 1 · Audit and mobile foundations · 2026-07-16

- **Commit:** (docs-only round; committed as the round-1 audit commit on `fylos-dev`)
- **Deployment target:** `fylos-preview` (production alias of that project only)
- **Preview URL:** https://fylos-preview.vercel.app
  (deployment `fylos-preview-p4spgcour-…`, baseline = desktop-approved state,
  redeployed to verify the rebuild-from-cache pipeline works before mobile edits)
- **Deployed:** 2026-07-16
- **Routes reviewed:** all 24 public routes (film `/` incl. `#ovl=tag/vet/groomer/
  glass/night`, `#dock`, `#solo` states; product, features, how-it-works,
  health-book, book-care, the-tag, partners, for-vets, pilot, demo, apply, join,
  waitlist, found, why, privacy, terms, impressum, 404, error, layouts, vet,
  groomer, park)
- **Widths reviewed:** 390x844 visual pass (film + chrome + modal + canopy +
  endbar + product), 320x568 spot checks (film cards, nav), 320px automated
  overflow sweep across all 24 routes (two iframe batches, zero horizontal
  overflow found)
- **Result:** full audit in [MOBILE_AUDIT.md](MOBILE_AUDIT.md) (135 code findings
  + visual verification of the film blockers), breakpoint system in
  [MOBILE_BREAKPOINTS.md](MOBILE_BREAKPOINTS.md)
- **Remaining issues:** everything in the audit; fixes begin Round 2 (film).

## Round 2 · The film on phones · 2026-07-17

- **Commit:** `3f77e73` on `fylos-dev`
- **Deployment target:** `fylos-preview`
- **Preview URL:** https://fylos-preview.vercel.app (verified live: the mobile
  CSS block and `100dvh` are in the served homepage)
- **Deployed:** 2026-07-17
- **Routes changed:** `/` (the film) only
- **Widths checked:** 390x844 (intro, tag:50, vet:20/55/90, groomer:20/55/90,
  glass:30, night:50, dock:95, nav + canopy, waitlist modal), 320x568 (intro,
  vet:55, nav), desktop regression at 1440x900 (intro, vet:90, dock:95 —
  pixel-identical)
- **What changed:** see [MOBILE_STORYTELLING_DECISIONS.md](MOBILE_STORYTELLING_DECISIONS.md)
- **Remaining issues:** frame preload strategy (Round 5); inner pages
  (Rounds 3-4); the desktop-only scrollhint/gatewait graze at short desktop
  windows is pre-existing approved behavior, left untouched.

## Round 3 · Homepage globals · 2026-07-17

- **Commit:** `d3762d6` on `fylos-dev`
- **Deployment target:** `fylos-preview` · **URL:** https://fylos-preview.vercel.app (verified live)
- **Routes changed:** `/` only (landscape card safeguard, tablet reception panel)
- **Widths checked:** full film scroll-through at 390x844 (all dwells, dock,
  film-to-roles handoff), roles/endbar/footer at 320x568, tablet 768x1024

## Round 4 · Inner pages and forms · 2026-07-17

- **Commit:** (this round's commit on `fylos-dev`)
- **Deployment target:** `fylos-preview` · **URL:** https://fylos-preview.vercel.app
- **Routes changed:** every shell page. Highlights:
  - Shell mobile menu is now a **glass canopy** under the header pill (the
    founder's N4 language; the rejected right-side drawer is gone). Same
    dialog mechanics (Escape, focus trap, scroll lock), CSS-only on the 18
    header copies, one visibility-aware focus line in shell.js. The menu now
    stacks above the consent banner.
  - `/apply` + `/join`: email format validation with a visible in-place error,
    confirmation panel scrolls into view on submit, 16px inputs at <=600px
    (no iOS zoom), autocomplete on email fields, figurines no longer block
    taps, stacked path cards breathe (gap 72px).
  - All content pages: hero photo band restored above the glass card on small
    phones (product/health-book), status rows wrap instead of crushing
    (features/health-book/book-care), touch targets >=44px, micro-labels >=11px,
    svh fallbacks on vh heros, lazy loading on below-fold imagery, figurine
    pop-outs never overlap a sibling CTA (pilot/demo/join), legal pages get
    tap-friendly mailto rows.
- **Widths checked:** 390x844 (canopy, product, features, pilot, join, apply
  form error + success flow), 320 spot checks, desktop 1280 regression pass
  on /product (approved layout intact)
- **Remaining issues:** Round 5 (performance, reduced-motion, contrast sweep)
  and Round 6 final QA.

## Round 5 · Performance and accessibility · 2026-07-17

- **Commit:** (this round's commit on `fylos-dev`)
- **Deployment target:** `fylos-preview` · **URL:** https://fylos-preview.vercel.app
- **Routes changed:** `/` (progressive frame loading on phones, reduced-motion,
  focus-visible); page media attributes shipped in Round 4
- **What changed:** phones/Save-Data stream the film (intro + 2 segments
  ahead, ~69MB instead of ~161MB up front, later scenes only if reached);
  desktop + review hashes keep the eager load. Reduced-motion quiets the
  self-playing ornaments; every film control has a visible keyboard focus.
  Full numbers in [MOBILE_PERFORMANCE_REPORT.md](MOBILE_PERFORMANCE_REPORT.md).
- **Verified:** network waterfall at 390px (only 3 segments up front; groomer
  scroll pulls t4/s4/t5; t7b stays cold) and at 1280px (everything eager).
- **Remaining issues:** Round 6 final QA.

## Round 6 · Final launch review · 2026-07-17

- **Commit:** the final commit on `fylos-dev` (see git log)
- **Deployment target:** `fylos-preview` · **URL:** https://fylos-preview.vercel.app
- **Routes reviewed:** all 24 (see MOBILE_FINAL_REPORT.md)
- **Widths:** overflow sweep at 320 + 430 across all 20 shell/content routes
  (zero overflow), 390 visual passes, desktop 1280/1440 regression states
- **Caught in QA:** round-4 `width/height` attributes distorted figurines and
  overflowed `/health-book`; removed, sweep re-run clean
- **Checks:** shell check ✓, dash grep ✓ (only the pre-existing allowed one),
  main `npm run build` ✓ (known advisories only)
- **Full wrap-up:** [MOBILE_FINAL_REPORT.md](MOBILE_FINAL_REPORT.md)
