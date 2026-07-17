# MOBILE BREAKPOINTS · the system

_Round 1 foundation, 2026-07-16. The rules every mobile fix in this repo follows._

## The existing scale (kept)

The inner pages already share a de-facto scale; we keep it and give it names:

| Token | Width | What changes there |
|---|---|---|
| `lg` | ≤1200px | film roles row 4→2 cols |
| `md` | ≤880-920px | page two-column sections stack, heros go `min-height:64vh`, roles 2→1 col |
| `sm` | ≤720px | shell nav → burger + menu |
| `phone` | **≤600px** | **the mobile band. Film overlay cards go fluid width, gate stacks, typography floors apply** |
| `xs` | ≤480px | forms stack fully (already: `.wlm-form`), micro-labels drop or grow |
| `tight` | ≤360px | last-resort compressions only (nav pill, card paddings) |

New mobile work targets **`phone` (≤600px)** as the primary band, with `xs` and
`tight` refinements. We do not invent new mid-range breakpoints; desktop starts
untouched at >600px unless a page already had its own stack point.

## Hard rules (apply to every fix)

1. **Desktop is approved and frozen.** Every mobile rule lives inside
   `@media (max-width:600px)` (or the page's existing breakpoint) — never edit a
   base rule to fix a phone problem.
2. **Dynamic viewport**: anything sized or anchored to the visible viewport uses
   `100dvh`-with-`100vh`-fallback (`height:100vh; height:100dvh`). Fixed bottom
   elements add `env(safe-area-inset-bottom, 0px)`.
3. **Inputs are ≥16px on phones** (iOS zoom). Buttons/labels may stay smaller,
   fields never.
4. **Touch targets ≥44px** for anything tappable on phones (padding, not font
   size, does the growing).
5. **Cards on the film**: fluid `max-width:calc(100vw - 20px)` at `phone`,
   compact paddings (18-20px), type steps down one notch (h3 29→22-24px).
   One message per screen: a dwell card should never exceed ~62vh.
6. **No new fonts, colors, radii, shadows.** The mobile site uses exactly the
   approved palette/type/radius tokens. No em/en dashes, no emoji, ever.
7. **Reduced motion**: every new transition/animation respects
   `prefers-reduced-motion: reduce`.
8. **The film engine (SEGS, resolve, drawFrame, tick, zones) is untouchable.**
   Mobile adaptation happens in CSS, in overlay markup, and in the
   founder-editable overlay placement layer only. Any touched protected line is
   documented in MOBILE_STORYTELLING_DECISIONS.md with the reason.

## Test matrix (every round)

320x568 · 360x800 · 375x667 · 390x844 · 414x896 · 430x932, portrait; 768x1024
tablet sanity; ≥1280 desktop regression. iOS-toolbar behavior approximated via
`dvh` + resize events; reduced motion via emulation.
