# MOBILE FINAL REPORT · 2026-07-17

_The mobile edition of the FYLOS website: what was reviewed, what changed,
what was verified, and what remains. Work ran in six rounds on `fylos-dev`,
every round committed and deployed to the throwaway preview
(`fylos-preview`). The production site `fylos-neighborhood` was never touched._

## Final state

- **Final preview:** https://fylos-preview.vercel.app (check it from a phone)
- **Final commit:** the round-6 commit on `fylos-dev` (chain:
  `14b592f` audit → `3f77e73` film → `d3762d6` globals → `2e89a4b` pages +
  forms → `8140984` performance/a11y → round-6 final)
- **Branch:** `fylos-dev`, pushed. `main` untouched. No merge to any
  protected branch.

## Routes reviewed (all 24 public website routes)

`/` (the film, incl. every review state), `/product`, `/features`,
`/how-it-works`, `/health-book`, `/book-care`, `/the-tag`, `/partners`,
`/for-vets`, `/pilot`, `/demo`, `/apply`, `/join`, `/waitlist`, `/found`,
`/why`, `/privacy`, `/terms`, `/impressum`, `/404`, `/error`, plus the
archive galleries `/layouts`, `/vet`, `/groomer`, `/park` (audited, left
untouched — internal reference pages, no mobile-critical defects).

## Widths and conditions tested

320x568 · 360x800 (sweep) · 375x667 (sweep) · 390x844 (primary visual pass) ·
414x896 (sweep) · 430x932 · tablet 768x1024 · desktop 1280 and 1440x900.
Automated horizontal-overflow sweep across all 20 shell/content routes at
320 and 430: **zero overflow**. iOS behaviors covered via `dvh/svh`
fallbacks, safe-area insets, 16px inputs, keyboard-vs-gate guard. Slow
network covered by progressive frame loading (also honors `Save-Data`/2G).

## The storytelling on phones (the heart of the work)

Same story, same order, same copy — recomposed for a narrow tall frame.
Full decision log: [MOBILE_STORYTELLING_DECISIONS.md](MOBILE_STORYTELLING_DECISIONS.md).

- Fluid overlay cards (never clipped, never dominating: ~45-60vh), one clear
  message per screen, the scene always visible.
- Vet consent stage rebuilt for portrait (stacked columns, 2-col toggle grid,
  thumb-size toggles); clinic stage stacks with a vertical thread; the
  reception panel hides on phones (its monitor is off-crop) and leans left on
  portrait tablets.
- Intro stack rebuilt bottom-up (gate, waitlist line, hint — no collisions on
  any tested height); nav pill = mark + CTA + burger; the canopy goes
  full-width with denser glass.
- Finale: the phone bows to the viewport height, the copy never touches the
  bezel, badges compress.
- Park arc sags deeper so it passes under the glass shards in portrait.
- Phones stream the film: ~69MB up front instead of ~161MB, later scenes load
  only when approached. Desktop keeps the original eager load.
- The canvas engine (`SEGS`, `resolve`, `drawFrame`, `tick`) is untouched.
  Every protected-file change is enumerated in the decisions doc.

## Mobile-specific components created

None as separate files (by design): the film needed no second renderer, and
every page adaptation is breakpoint-scoped CSS inside the page it belongs to.

## Shared components modified

- `shell/shell.css`: the mobile menu is now a **glass canopy** under the
  header pill (founder's N4 language; the right-side drawer he rejected is
  gone). Dialog mechanics (Escape, focus trap, scroll lock, inert) unchanged.
  Menu stacks above the consent banner.
- `shell/shell.js`: one visibility-aware focus line (the canopy hides its
  redundant close button; focus lands on the first link).

## Forms

`/apply` and both `/join` forms: email-format validation with a visible
in-place error (`role="alert"`), the confirmation panel scrolls into view on
submit, 16px fields at ≤600px, `autocomplete` on email, figurines never
steal taps. The film's waitlist (modal + gate line) got 16px inputs and a
placeholder that fits the pill. (`/apply`/`/join` still submit nowhere —
front-end only, per AGENTS.md; the Klaviyo waitlist remains the only live
capture.)

## Accessibility findings and fixes

Reduced-motion support on the film (ornaments stop, story stays);
visible keyboard focus on every film control; ≥44px touch targets
(toggles, slots, menu links, mailto rows, text links); ≥11px label floor;
semantic dialogs preserved; skip links and shell a11y intact
(`check-website-shell.mjs` green throughout).

## Performance findings

See [MOBILE_PERFORMANCE_REPORT.md](MOBILE_PERFORMANCE_REPORT.md). Headline:
progressive film loading on phones (verified in the network waterfall both
ways), lazy below-fold page media, DPR-capped canvas (pre-existing).
Accepted risks documented there (decoded-frame memory for full watch-throughs,
no re-encode of locked art masters).

## Desktop regression results

Verified pixel-identical at 1280/1440x900 against the approved states after
every round: film intro, tag:50, vet:90 (reception panel + leader geometry),
dock:95 (A4 finale, phone right, 4° tilt), /product, /join. The film's
desktop code paths (card widths, eager loading, finale formula) are literally
the original expressions behind `wide`/width guards. One pre-existing quirk
left as approved: the scrollhint/gatewait graze on short desktop windows.

## Build and test results

- `node scripts/check-website-shell.mjs`: ✓ all shell pages pass (run after
  every round)
- Dash grep: only the pre-existing allowed CSS-comment dash in
  `index.html:101`; zero em/en dashes introduced anywhere
- `npm run build` (main React app, Vite): ✓ built, with the known
  non-blocking advisories (Node version notice, chunk-size warning). Run in
  the main working tree, which also carries another session's in-progress
  `src/comms` work — the build is green with it present.
- The website itself has no build step (static files), per ROUTES.md.

## One regression caught and fixed in final QA

The round-4 image-attribute pass had added `width/height` attributes to
figurines whose CSS constrains only height — distorting them and forcing
horizontal overflow on `/health-book` (and squish on two more pages). Caught
by the final-round sweep, attributes removed, sweep re-run clean. This is why
the sweep exists.

## Remaining issues / follow-ups (all founder-gated or out of scope)

1. `/apply` + `/join` have no backend (standing decision; see
   BACKEND_INTEGRATION_GUIDE.md).
2. Analytics tag on the film itself: still founder-gated.
3. Film frames are single-resolution art masters; a mobile re-encode
   (smaller JPGs / AVIF) would halve the stream further but touches locked
   assets — founder call.
4. Coral-on-cream accent contrast: standing founder decision, flagged before.
5. The archive galleries (`/layouts`, `/vet`, `/groomer`, `/park`) were left
   as-is (internal reference).
6. Launch day: revert waitlist labels to "Get the app" + store links (single
   revert, see the Jul-16 handoff §2.11).
