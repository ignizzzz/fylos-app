# MOBILE STORYTELLING DECISIONS · Round 2 · 2026-07-17

_How the approved desktop film was adapted for phones, and exactly what was
touched inside the protected file (`website-live/index.html`). The engine —
`SEGS`, `zones`, `resolve()`, `drawFrame()`, `loadSeg()`, `tick()`, `onScroll()`
— is untouched. Every change below is breakpoint-scoped or guarded so desktop
renders pixel-identical (verified at 1440x900 against the approved states:
intro, `#ovl=vet:90`, `#dock=95`)._

## The mobile direction in one paragraph

The film's cover-fit engine already crops the 16:9 frames beautifully on
portrait; the scenes and the night ride need nothing. What broke on phones was
the OVERLAY layer: fixed-width cards clipping, two-column compositions
crushing, the intro's bottom stack colliding, and the finale phone being taller
than the room left for it. The adaptation keeps the same story, the same order,
the same copy, and simply re-composes each overlay for a narrow tall frame:
full-width warm cards, one message per screen, the scene always visible above
or below the card.

## Scene-by-scene

- **Intro / gate**: title and question get side padding and a lower type floor
  (h1 34-44px fluid, question 30-40px). The gate pill wraps to two rows (name
  field on top, "Just looking around" + "Let's stroll" split below); the paw
  icon hides. The waitlist email line sits below the gate, the scroll hint at
  the very bottom (drip line hidden on phones, safe-area padded) — the three no
  longer collide on any tested height (844, 568). The email placeholder was
  clipping, so phones get the modal's shorter `you@example.com`.
- **01 · The tag**: card goes fluid (`calc(100vw - 20px)` cap), paddings and
  row gaps one notch tighter, h3 23px. Card now ends ~48% of the viewport and
  the scene (the tag coin) shows beneath.
- **02 · The vet, stage 0**: fits as-is with the fluid card width.
- **02 · The vet, stage 1 (consent)**: the two `.consent` columns stack; the
  five toggles become a compact 2-column grid; the three recipients become
  full-width rows. Toggles grew to 34x20 (thumb-sized). Card ~57vh, scene below.
- **02 · The vet, stage 2 (clinic)**: card full-width; `.shared` stacks
  vertically with the thread rotated 90° (reception above, pocket below). The
  dark reception panel (`.recpanel`) is **hidden on ≤600px**: it is pinned to
  the desk monitor, which sits outside the portrait crop, so on phones it
  floated meaninglessly and clipped off-screen (verified). Desktop keeps it
  exactly as approved.
- **03 · The groomer (all 3 stages)**: already the quality bar on portrait;
  only inherited the fluid width + touch-target slots (10x14 padding).
- **04 · The park**: card fits; the pointing arc now sags 128px (was 84) on
  phones only, so it passes under the glass shards in the tighter portrait
  crop instead of through them. The `Reported · east path` label stays clear.
- **Night ride**: untouched, gorgeous in portrait as-is (founder had already
  stripped it bare).
- **Finale (A4)**: on portrait the phone now also bows to the viewport height
  (`width:min(300px, 74vw, 21.8vh)` — 21.8vh = 46vh tall at 9:19), so the
  copy block below never touches the bezel and the shrinking watercolor lands
  proportionally. Copy block gets safe-area bottom padding; badges compress a
  notch. Desktop (≥1000px) uses the exact original formula.
- **Nav pill**: on phones it is mark + "Join the waitlist" + burger (the "For
  partners" link hides — it exists inside the canopy). The canopy goes
  `calc(100vw - 20px)` with a denser glass (94% cream) so it stays readable
  over the dark endbar; single column under 360px.
- **Waitlist modal**: inputs to 16px (kills the iOS focus zoom), tighter card
  padding under 600px. Same for the gate and gatewait inputs.

## Protected-file changes, line by line

All in `website-live/index.html` (the locked film), founder-directed by the
mobile mandate; the engine block is untouched:

1. **CSS, end of `<style>`**: one clearly-marked mobile block —
   `#film .sticky{height:100vh; height:100dvh}` (iOS toolbar), a
   `@media (max-width:999px)` finale clamp, the `@media (max-width:600px)`
   phone band, and a `@media (max-width:360px)` tightening. Nothing outside
   media queries except the dvh pair.
2. **JS `setFinale`**: `phoneW` gains a portrait-only third clamp
   (`wide ? old formula : min(old, H*.218)`), mirroring the CSS. Desktop path
   is literally the original expression.
3. **JS `placeAnchors`, park-arc block** (founder-directed code from Jul 16):
   sag constant 84 → `stickyEl.clientWidth <= 600 ? 128 : 84`.
4. **JS name gate**: the auto-finish-on-scroll listener now skips while the
   name input has focus (the iOS keyboard scrolls the page and was dismissing
   the gate mid-typing).
5. **JS tail script (waitlist wiring, unlocked)**: on ≤600px the gatewait
   placeholder becomes `you@example.com` (the long line clipped).

## Why not…

- **…a separate mobile film renderer?** Not needed: the canvas engine is
  resolution-independent and portrait crops are already cinematic. Only overlay
  composition had to change — pure CSS + 4 guarded lines.
- **…repositioning cards with per-breakpoint `data-fx/fy`?** The frame-lock
  clamp already pins full-width cards to the top-band positions the founder
  approved; adding portrait anchor sets would complicate the protected file for
  no visible gain.
- **…moving the vet reception panel into the card on phones?** It would push
  the stage-2 card past 70vh and mix two messages. Hiding it keeps one clear
  message; the monitor it annotates is off-crop anyway.

## Performance note

Frame preloading is deliberately NOT touched in this round (engine); the
mobile preload strategy is Round 5's scope.

## Round 5 addendum (2026-07-17)

Two more founder-mandate changes to the protected file, both documented in
[MOBILE_PERFORMANCE_REPORT.md](MOBILE_PERFORMANCE_REPORT.md):

6. **Progressive frame loading on phones** — the eager "load all 703 frames
   after the intro" loop is now wrapped by `scheduleSegLoads()`: on ≤820px
   viewports, `Save-Data`, or 2G it loads the current segment + two ahead and
   feeds the rest as the visitor scrolls (a self-removing passive listener).
   Desktop and the review hashes take the ORIGINAL eager path (the very same
   `loadSeg` loop). `loadSeg`, `drawFrame` and the rest of the engine are
   untouched; the nearest-frame fallback that ships in `drawFrame` is what
   makes streaming safe.
7. **Reduced motion + visible focus (CSS only)** — a
   `prefers-reduced-motion: reduce` block stops the self-playing ornaments
   (ring sweep/pulse, pin ripple, SOS dot, hint drip) and collapses entrance
   transitions; a `:focus-visible` block gives every interactive film element
   the coral keyboard ring. Appended to the mobile CSS block.
