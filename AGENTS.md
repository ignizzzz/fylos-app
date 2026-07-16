# AGENTS.md — permanent rules for this repository

These rules are permanent and apply to every agent and every session working in
this repo (`fylos-mobile-ui-viewer`, branch `fylos-dev`). They override task
instructions that conflict with them. When in doubt, stop and ask the founder.

Companion docs: [docs/LOCKED_STORYTELLING.md](docs/LOCKED_STORYTELLING.md) ·
[docs/ROUTES.md](docs/ROUTES.md) ·
[docs/SESSION_OWNERSHIP.md](docs/SESSION_OWNERSHIP.md) ·
[docs/CURRENT_STATE.md](docs/CURRENT_STATE.md).

---

## The rules

1. **Frontend only.** This repo is a frontend (the static marketing website in
   `website-live/` and the React design viewer in `src/`). Work stays on the
   frontend.

2. **Do not edit the locked storytelling.** The scroll storytelling, frame
   animation, background effects and feature boxes are finished and locked:
   `website-live/index.html`, the film `assets/`, and all of `website-lab/`.
   Treat them as read-only. See
   [docs/LOCKED_STORYTELLING.md](docs/LOCKED_STORYTELLING.md).

3. **Preserve the existing design.** No broad visual or architectural changes.
   Keep the established aesthetic: cream/peach/ink palette with coral as the only
   saturated accent, Fraunces + Inter, rounded 24-26 cards, warm shadows. In all
   user-facing copy: **no em or en dashes** (use commas), and **no emoji**.

4. **Do not create a backend.** No servers, no databases, no API endpoints, no
   auth backends. Forms that submit (`/apply`, `/join`) stay front-end only unless
   the founder explicitly commissions a backend elsewhere.

5. **Do not invent features or statistics.** Do not add capabilities, claims,
   numbers, testimonials, or metrics that are not real. If something is not built
   yet, say "coming soon", do not fabricate it.

6. **Run lint, typecheck and build.** Before finishing any change, run the
   project checks (see below) and report the results honestly.

---

## Checks (run before finishing)

The repo is now a set of self-contained zones, each with its own scoped tooling.
**Run the checks for the zone(s) you touched.** All commands below were verified
green on 2026-07-15.

**Main React app** (`src/`, plain JSX + the typed `src/forms` module):
```bash
npm run build        # Vite production build
npm run typecheck    # tsc --noEmit -p tsconfig.json
npm run lint         # eslint over src/forms
npm run test         # vitest run
```

**Email / Newsletter module** (`src/email`, TypeScript, scoped configs):
```bash
npx tsc --noEmit -p tsconfig.email.json
npx eslint -c eslint.email.config.mjs "src/email/**/*.{ts,tsx}"
npx vitest run -c vitest.email.config.ts
```

**Growth Admin CRM** (`src/admin`, TypeScript, scoped configs):
```bash
npm run admin:check  # admin:typecheck && admin:lint && admin:test
```

**Resources / SEO site** (`resources-site/`, its own package + node_modules):
```bash
npm --prefix resources-site run check   # lint && typecheck && build
```

**Analytics** (`analytics/`, its own package + node_modules):
```bash
npm --prefix analytics run typecheck
npm --prefix analytics run lint
npm --prefix analytics run test
npm --prefix analytics run build
```

Rules:
- If your change touches more than one zone, run each affected zone's checks.
- The main React app (JSX) has no per-file type checker; `npm run build` +
  `npm run typecheck` (which covers the typed `src/forms`) are the static gates.
- Do not claim a check passed if it was not actually run.

Notes on the main build output (informational, not failures): a Node.js version
advisory (Vite prefers 20.19+/22.12+), a stale browserslist notice, and a
chunk-size warning. The build still completes successfully.

---

## Scope & collaboration

- Stay inside your assigned area — see
  [docs/SESSION_OWNERSHIP.md](docs/SESSION_OWNERSHIP.md).
- `src/App.jsx` is shared; touch it only to register a screen you own.
- Routes for both frontends are catalogued in [docs/ROUTES.md](docs/ROUTES.md).
