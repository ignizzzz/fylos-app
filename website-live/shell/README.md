# Website shell

The quiet, shared chrome for the Fylos marketing pages: header plus desktop nav,
mobile menu, footer, page container, active-route state, a global loading state,
and the `404` / `error` pages. It is intentionally **quieter than the
storytelling film** and never touches page content or any locked file
(`index.html`, `website-lab/`, film `assets/`, see
[../../docs/LOCKED_STORYTELLING.md](../../docs/LOCKED_STORYTELLING.md)).

## Files

| File | What it is |
|---|---|
| `shell.css` | All shell styles, namespaced `fy-` so they never collide with a page's own classes. |
| `shell.js` | Vanilla, no dependencies. Progressive enhancement only. |
| `header.html` | Canonical header plus mobile-menu markup to paste into a page. |
| `footer.html` | Canonical footer markup to paste into a page. |

Everything the nav and footer link to is a real route from
[../../docs/ROUTES.md](../../docs/ROUTES.md) or an established Fylos destination
(`fylos.me`, `app.fylos.me`, `hello@fylos.me`). No invented legal, social, or
app-store links. No em or en dashes, no emoji.

## Add the shell to a page

1. In `<head>`, after the fonts you already use, add:

   ```html
   <link rel="stylesheet" href="/shell/shell.css">
   <noscript><style>@media (max-width:720px){.fy-burger{display:none!important}.fy-nav{display:flex!important;flex-wrap:wrap;width:100%;padding-bottom:8px}.fy-header__inner{flex-wrap:wrap}}</style></noscript>
   <script defer src="/shell/shell.js"></script>
   ```

   The `<noscript>` block is the no-JS fallback: with scripting off it reveals
   the nav links inline and hides the (non-working) burger. A `<style>` is only
   valid inside `<head>`, so it lives here, not in the header partial.

2. Paste `header.html` as the first thing inside `<body>`.
3. Give the page's main content the skip-link target and a landmark, and make it
   programmatically focusable so the skip link actually moves focus:
   `<main id="fy-main" tabindex="-1"> ... </main>`.
4. Paste `footer.html` as the last thing inside `<body>`.

Paths are root-absolute (`/shell/...`) so they resolve on the deployed site and
on the `404` page (which the server may serve from any path). Preview locally
with a static server rooted at `website-live/`, e.g. `npx serve website-live`.

### Retrofitting a page that already has its own chrome

`apply.html` and `join.html` ship with their own sticky `.top` bar and a bare
`<footer>` styled by a bare element selector (`footer{ max-width; margin:0 auto;
text-align:center }`). When you paste the shell in:

- remove the page's own `.top` bar markup (the shell header replaces it), and
- the shell footer defends itself against the host `footer{}` selector (it resets
  `max-width`, side margins, padding and `text-align`), so you can leave the
  page's `footer{}` rule in place, but deleting the now-unused `footer{}` /
  `footer a{}` rules keeps the stylesheet clean.

## Active route

`shell.js` reads `location.pathname`, normalizes it (drops `.html` and trailing
slashes), and sets `aria-current="page"` on the matching nav/menu link. CSS
styles `[aria-current="page"]`. No per-page configuration needed.

## Mobile menu accessibility

The burger is a real `<button aria-expanded aria-controls>`; the panel is a
`role="dialog" aria-modal="true"` region. `shell.js` provides:

- **Keyboard access**, button and links are natively focusable, in order.
- **Escape**, closes the menu and returns focus to the burger.
- **Focus trap**, Tab / Shift+Tab cycle inside the open panel.
- **Focus restoration**, focus returns to the burger on close.
- **Scroll lock**, on open the page is pinned with `position:fixed` on `<body>`
  (the reliable technique on iOS Safari) plus scrollbar-width compensation, and
  the scroll position is restored on close.
- Closes on backdrop click, on link tap, and when the viewport grows past the
  mobile breakpoint. The closed panel is `inert` plus `aria-hidden`.

## Global loading state

`shell.js` exposes `window.FylosShell`:

- A thin top **progress bar** appears automatically during page-to-page
  navigation (internal links only; ignores new-tab / modified clicks and
  downloads) and completes on the next `pageshow`.
- `FylosShell.showLoading(label?)` / `FylosShell.hideLoading()` toggle a
  reusable full-screen overlay (`role="status"`, `aria-live="polite"`) for any
  async operation.
- Also available: `openMenu()`, `closeMenu()`, `startProgress()`,
  `completeProgress()`.

All motion respects `prefers-reduced-motion` (including smooth scroll).

## Checks

- `node scripts/check-website-shell.mjs`, validates that every internal link on
  the shell pages is a real route from `docs/ROUTES.md` (or a served shell
  asset), that there are no dead `href="#"` placeholders, and that the mobile
  menu keeps its required accessibility attributes. Run it after editing any
  shell file or retrofitted page.
- `npm run build`, the shared repo gate (Vite). The shell is static and not part
  of that bundle, but the build must stay green.

## Deploy note

`website-live/vercel.json` sets `cleanUrls: true` so `/apply` serves
`apply.html` and Vercel serves `404.html` automatically. It takes effect on the
next founder-run redeploy of the `fylos-neighborhood` project; confirm the
deploy root is `website-live/` before relying on it.

## Accessibility: contrast

The shell chrome meets WCAG AA for text. The coral palette is naturally low
contrast, so the shell uses AA-safe variants for its interactive controls:

- Filled call-to-action buttons (nav CTA, menu CTA, `.fy-btn--primary`) use
  `--fy-coral-deep` (`#CF4A1C`), where white text is 4.52:1. Hover deepens to
  `--fy-coral-deeper`.
- The ghost button (`.fy-btn--ghost`) uses `--fy-coral-deep` text on white.
- The active-route pill and the state eyebrow keep the peach background as the
  cue but use ink text (13:1) instead of coral.

The rest of the site (page content in the other `website-live/*.html` files, and
the **locked** film `index.html`) still uses the founder's original coral, which
is below AA for text (white on coral `#E85D2A` is 3.48:1, coral on peach is
2.98:1). Bringing those to AA is a separate, founder-directed pass: it touches
page content and the locked film, so it is out of scope for the shell.
