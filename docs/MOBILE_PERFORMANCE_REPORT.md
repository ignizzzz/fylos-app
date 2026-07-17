# MOBILE PERFORMANCE REPORT · Round 5 · 2026-07-17

_What the phone downloads, when, and what changed._

## The film's frames (the dominant cost)

The film is 703 JPG frames across 7 segments, ~161MB total:

| Segment | Frames | Size |
|---|---|---|
| v9-one (town approach) | 181 | 45MB |
| v4-t2b | 61 | 11MB |
| v4-t3 (vet) | 61 | 13MB |
| v4-t4 (groomer) | 61 | 11MB |
| v4-s4 | 121 | 27MB |
| v4-t5 (park) | 97 | 22MB |
| v4-t7b (night) | 121 | 32MB |

**Before:** the intro segment loaded behind the loader bar, then ALL remaining
frames downloaded at once, regardless of device: ~161MB up front on a phone.

**After (this round):** on viewports ≤820px, on `Save-Data`, or on 2G-class
connections, the film streams: the intro + two segments ahead load first
(~69MB), and each further segment loads as the visitor scrolls within two
segments of it. A visitor who never scrolls past the vet scene never downloads
the night ride. Review hashes (`#f=`, `#ovl=`, `#dock=`) and desktop keep the
original eager load, byte-for-byte identical behavior.

Verified live in the browser: fresh load at 390px requested only
v9-one + v4-t2b + v4-t3; scrolling into the groomer dwell triggered v4-t4 +
v4-s4 + v4-t5; v4-t7b stayed unrequested until approached; at 1280px the
original eager load still requests everything.

The engine itself is untouched: `drawFrame()` already tolerates
not-yet-loaded frames (nearest-loaded fallback + repaint on arrival), which is
what makes streaming safe. If a visitor skips far ahead, the scene resolves
within a few seconds and the story continues.

Accepted risk, documented: decoded-image memory on iOS is unchanged for a
visitor who watches the whole film (all frames end up in memory, as on
desktop). Progressive loading bounds it by how far the visitor actually gets.

## Page media

- Below-fold photos and figurines on all content pages now carry
  `loading="lazy" decoding="async"`; heros keep eager (LCP) and product/
  book-care heros gained `fetchpriority="high"`.
- Known-size figurines got `width/height` attributes (no reflow shift).
- The canvas already caps `devicePixelRatio` at 2.

## Main-thread / scroll

- The film's scroll handler is passive and cheap (a resolve + class toggles);
  the rAF `tick` only redraws when the frame signature changes. Unchanged.
- The one added scroll listener (segment feeder) does two rect reads and
  removes itself once every segment is queued.

## Accessibility (this round)

- `prefers-reduced-motion`: the film's self-playing embellishments (ring
  sweeps and pulses, pin ripples, SOS dot, scroll-hint drip, chip pulse) stop;
  entrance transitions collapse to instant; the story itself stays fully
  readable because it is scroll-driven and user-paced. Shell pages already had
  a reduced-motion block.
- Visible keyboard focus on every interactive film element (nav, canopy,
  gate, waitlist line, card CTAs, roles, endbar links, modal).
- Round 2-4 groundwork: 16px inputs (no iOS zoom), ≥44px touch targets,
  ≥11px labels, form errors announced via `role="alert"`.

## Not done (and why)

- No srcset/AVIF re-encode of the frames: the film assets are locked art
  masters; re-encoding is a founder decision (it would touch every frame).
- No analytics tag on the film: still founder-gated (see ROUTES.md).
- Coral-on-cream contrast on marketing accents: a standing, founder-decided
  site-wide tradeoff (flagged historically); the functional chrome (shell CTA,
  focus rings) already uses the AA-safe coral-deep.
