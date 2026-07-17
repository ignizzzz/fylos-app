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
