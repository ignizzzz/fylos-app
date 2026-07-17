# MOBILE AUDIT · Round 1 · 2026-07-16

_The complete mobile audit of the FYLOS website (`website-live/`), performed at
320 / 360 / 375 / 390 / 414 / 430 px widths, short (568-667px) and tall (844-932px)
heights, with the iOS Safari dynamic-toolbar and safe-area lens. Sources: a full
code audit of every page (11 parallel review agents, 135 findings) plus a live
visual pass of the film and pages in a real browser at 390x844 and 320x568._

Verdict in one line: **the inner pages are structurally healthy (zero horizontal
overflow at 320px on all 24 routes), the film needs a real portrait adaptation,
and the global chrome (nav pill, consent banner, finale) has a handful of
mobile-specific defects.**

---

## 1. The ten problems that matter most

Ranked by how hard they hurt a phone visitor. "Film" items are handled in Round 2,
chrome/pages in Rounds 3-4.

1. **Film · dwell cards clip at ≤390px.** Every overlay card carries a fixed
   `max-width` (350-440px) set inline; the frame-lock clamp (`left ≥ 10`) cannot
   shrink them, and `.sticky{overflow:hidden}` cuts the right edge. At 320px the
   vet stage-1 card loses its whole right column. **Verified visually at 320.**
2. **Film · nav pill wider than the viewport.** Mark + "For partners" + CTA +
   burger ≈ 365px. At 320-360px the pill clips or the CTA wraps to three lines
   (verified at 390 over the endbar: the pill becomes a 3-line blob).
3. **Film · finale collision.** `#finCopy` (label + tagline + CTA + badges)
   overlaps the phone's lower third in portrait, and the shrinking watercolor
   town is LARGER than the phone screen on portrait (`iconScale > 1` when
   `phoneH-20 > min(W,H)`), so it spills around the bezel instead of landing on
   the screen. **Verified at 390x844, `#dock=95`.**
4. **Film · intro bottom stack collision.** `.scrollhint` renders on top of the
   `.gatewait` email pill (verified at 390x844); on short screens the gate bar,
   the email pill and the hint all fight for the same 120px band, under the iOS
   toolbar (`100vh` sticky).
5. **Film · vet stage-1 and stage-2 compositions don't fit portrait.** The
   `.consent` 2-column grid crushes at ≤390 (toggle column + recips column both
   wrap word-by-word); the dark `.recpanel` (236px, translateX(-50%) at a clamped
   anchor) overflows the right screen edge at 390. **Both verified visually.**
6. **Forms · iOS auto-zoom everywhere.** Every input on `/apply`, `/join`,
   `/waitlist`, the film modal (14px), the film gatewait (13px) is under 16px,
   so iOS zooms the page on focus and never quite restores it.
7. **Forms · submit states.** `/apply`: after submit the thank-you panel lands
   off-screen (page doesn't scroll to it); `/join`: the groomer form's
   confirmation is buried under the second form; both accept invalid emails
   silently (`novalidate` + emptiness-only check).
8. **Chrome · consent banner vs menu.** The consent banner (z-index 2147483000)
   covers the open mobile menu's bottom links; and the shell mobile menu is a
   right-side drawer, the exact pattern the founder rejected on the film («ανοίγει
   αυτή η μαλακία κάπου δεξιά») — it should become the N4 glass canopy language.
9. **Pages · figurine negative margins in 1-column stacks.** On `/pilot`, `/demo`,
   `/join` (and the film's own roles row is fine, it has `gap:86px`), the pop-out
   figurine (`margin-top:-70..-78px`) overlaps the preceding card's CTA and can
   block taps when cards stack on mobile.
10. **Film · all 703 frames prefetch unconditionally** once the intro segment
    loads (~165MB decoded worst-case on a phone) — needs a gentler, scene-aware
    strategy on mobile + honoring Save-Data. (Round 5.)

## 2. What is already healthy (do not touch)

- **Zero horizontal overflow at 320px on all 24 routes** (measured in-browser,
  iframe sweep, both batches).
- The inner pages' shared system (photo hero + glass card, alternating photo
  sections, pill rows, peach closing band) collapses to one column properly at
  their 880/820/720/560/520/480 breakpoints.
- The waitlist modal at 390px is already excellent (stacked form <480px).
- The groomer dwell (all 3 stages) and the park dwell read beautifully in
  portrait — scene visible, card compact. They are the quality bar for the rest.
- The night scene and the town intro are stunning in portrait cover-crop. The
  film's cover-fit engine handles portrait correctly; only the OVERLAY layer and
  a handful of anchor/finale numbers need adaptation.
- The roles row (4 cards, 1-col ≤920px) works; figurines pop out cleanly thanks
  to `gap:86px`.
- Shell header/menu mechanics (focus trap, Escape, scroll lock) are sound.

## 3. Known non-issues / false positives

- **"Missing" images (`k-lines.jpg`, `kvet-hi.jpg`, `k-walker.jpg`,
  `square-hi.jpg`, `ktagqr-hi.jpg`, `kgroom-hi.jpg`, `kpark-hi.jpg`,
  `roles/pet.png`, `roles/walker.png`, `roles/clinic.png`, `tag-qr.png`,
  `wc-city.jpg`, `city-03.mp4`, all film frames):** these are intentionally NOT
  in the repo. The deploy bundle = `website-live/*` + the assets downloaded from
  the current preview (see the handoff §1). All 724 assets were re-downloaded and
  verified this session (0 failures). Local preview serves them via fallback.
- `/options*`-style picker pages: exist only on the deployed preview, by design.

## 4. Full findings appendix

135 findings from the code audit (6 blockers, 30 major, 62 minor, 37 polish),
per file, with evidence and a suggested breakpoint-scoped fix each, live in the
session working notes and are folded into the fix rounds. The blocker/major set
is summarized above; minor/polish items are picked up page-by-page in Round 4
(the notable recurring ones: sub-11px uppercase micro-labels, touch targets
under 44px on chips/slots, `letter-spacing:.22em` kickers touching viewport
edges, hero `min-height:64vh` with `100vh`-style toolbar blindness, figurine
`filter:drop-shadow` cost on low-end GPUs).

## 5. Round plan (as executed)

- **Round 2 — the film on phones**: cards, gate stack, nav pill, canopy, finale,
  vet/tag compositions, per-breakpoint card widths, `dvh`, inputs at 16px.
  Documented in [MOBILE_STORYTELLING_DECISIONS.md](MOBILE_STORYTELLING_DECISIONS.md).
- **Round 3 — homepage globals**: roles row, endbar, post-film transition.
- **Round 4 — every inner page + forms**: canopy menu for the shell, consent
  banner coexistence, form validation/thank-you states, figurine stacks, page
  polish at 320-430.
- **Round 5 — performance + accessibility**: frame preload strategy, Save-Data,
  reduced-motion, touch targets, contrast, focus.
- **Round 6 — final QA** at all six widths + desktop regression pass.
