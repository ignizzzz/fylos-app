# SESSION OWNERSHIP

_Last verified: 2026-07-15 against branch `fylos-dev`._

To let multiple future sessions (human or AI) work in parallel without colliding,
each area below is owned by **one** session at a time. Stay inside your assigned
folders. Do not reach into another session's area, and never touch the LOCKED
zone. Shared files (see the last table) require a heads-up before editing.

Everything here is **frontend only**. See [AGENTS.md](../AGENTS.md) for the
permanent rules and [LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md) for what is
off limits.

---

## Ownership map

| Zone | Owns (files / folders) | May edit? | Notes |
|---|---|---|---|
| **LOCKED — Film** | `website-live/index.html`, film `assets/`, all of `website-lab/` | ❌ No | The scroll storytelling. Read-only for everyone. |
| **A — Website content pages** | `website-live/apply.html`, `join.html`, `why.html`, `vet.html`, `groomer.html`, `park.html`, `layouts.html`, `found.html` | ✅ Yes | Every website page **except** `index.html`. Keep the existing aesthetic. |
| **B — App screens** | `src/screens/**` | ✅ Yes | 94 mobile screen files. Largest area; can be split by screen-number range if two sessions run (e.g. `01`–`59` vs `60`–`98` and the named `*_v1` files). |
| **C — App features** | `src/features/services/**`, `src/features/social/**` | ✅ Yes | Self-contained feature folders (slide-in flows, hooks, sub-screens). |
| **D — Shared UI, data, theme** | `src/components/**`, `src/data/**`, `src/styles/**`, `src/lib/**` | ⚠️ Coordinate | Shared primitives and mock data. Changes ripple into B and C — announce before editing. |
| **E — Docs & specs** | `docs/**`, root `*.md` spec files, `AGENTS.md` | ✅ Yes | Documentation only. |
| **F — Growth Admin (CRM)** | `src/admin/**`, `tsconfig.admin.json`, `eslint.admin.config.mjs`, `vitest.admin.config.ts` | ✅ Yes | Private internal CRM, mounted at `/admin/*`. Self-contained TypeScript module with its own scoped tooling (namespaced so it never touches the shared `tsconfig.json` / `eslint.config.js` / `vitest.config.ts`). No live backend, mock auth only. |

---

## Detail per zone

### A — Website content pages (`website-live/`, not `index.html`)
Static HTML, one file per route (see [ROUTES.md](ROUTES.md)). Preserve the locked
aesthetic: cream/peach/ink/coral palette, Fraunces + Inter, rounded 24-26 cards,
no em/en dashes, no emoji. `/apply` and `/join` are front-end only — do not wire a
backend into them (that is a separate, out-of-repo decision).

### B — App screens (`src/screens/`)
94 `*.jsx` files, imported and routed in `src/App.jsx`. If you add or remove a
screen, update its `import` and `<Route>` in `src/App.jsx` (that file is shared —
coordinate). Home (`03_HOME_Dashboard`) is treated as final; do not re-port
alternate variants over it.

### C — App features (`src/features/`)
```
src/features/
  services/  (bookings, discover, flows, saved, sheets, subscreens, components)
  social/    (playdates, components)
```
These mirror each other's structure. Keep feature-local code inside its folder;
promote to zone D only when genuinely shared.

### D — Shared UI / data / theme (coordinate before editing)
```
src/components/ui/   BottomSheet.jsx, Primitives.jsx, index.js
src/data/services/   bookings, categories, messages, payment, providers, reviews
src/styles/theme.js  design tokens
src/lib/             (currently empty)
```
Anything here is imported widely. A change can break zones B and C, so post intent
first.

### E — Docs (`docs/`, root specs)
This folder, plus the root spec docs (`FYLOS_*.md`, `HANDOFF_STATUS.md`, etc.).
Keep specs and these docs in sync when reality changes.

---

## Rules for all sessions

1. **Never edit the LOCKED zone.** If a task seems to require it, stop and ask the
   founder.
2. **Stay in your zone.** Cross-zone changes need a heads-up in the shared channel
   / handoff note.
3. **`src/App.jsx` is shared.** Only touch it to register a screen you own, and say
   so.
4. **Run the checks** before finishing (see [AGENTS.md](../AGENTS.md)).
5. **Preserve the design.** No broad visual or architectural changes.
