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
