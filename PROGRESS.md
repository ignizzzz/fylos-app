# FYLOS — Progress log (Finish & Ship pass)

_All work local-only; no new dependencies added; build (`npm run build`) green after every change; every flow verified by running in the browser preview, not by reasoning._

## Completed in this pass (chronological)

1. **Pets tab rebuilt** (`70_PETS_HOME_v1`, embedded in dashboard)
   - Editorial photo cards + smart status (green "Healthy" / coral attention e.g. "Vaccine · 5d").
   - Adaptive add: odd pet count → "Add pet" card fills the grid gap; even → full-width dashed bar.
   - Coming up (pet avatar + care badge; rows open that pet's profile) · Recent activity.
   - Empty states: no pets (watercolor onboarding + "Add your first pet"), empty Coming up.
2. **Add Pet rebuilt** (`71_ADD_PET_v1`, replaces deleted `37_ADD_PET_v1`)
   - 7 grouped Revolut-style steps (identity / breed / about / personality / daily care / health / care team); steps 4–7 skippable.
   - 9-species grid + free-text "Other" with suggestions; breed bottom-sheet picker (search + custom + Mixed = 2 breeds).
   - Age: Months/Years stepper + exact DOB; weight kg/lb + "approximate ±"; microchip with explanation + "not chipped".
   - Select-rows + bottom sheets instead of pill clouds; content scrolls behind gradient header & footer.
   - Celebration end state (confetti burst + "Welcome, {name}!").
   - Mascot fully removed app-wide (deleted component + onboarding/dashboard usages) — product decision.
3. **Pet Profile rebuilt** (`92_PET_PROFILE_v1`, embedded; receives the tapped pet's data)
   - Revolut hero (avatar, name, status) + circular quick actions + category tabs; collapsing top bar (name fades in).
   - Fully editable: detailed add/edit/remove sheets for vaccines (date/next due/by/lot), allergies (severity/reaction), conditions, medications (dose/freq), documents, emergency contacts; personality chips editable only in Edit mode; weight log; lost-mode dialog; share sheet.
4. **Journal rebuilt** (`93_JOURNAL_v1`, embedded)
   - Week summary, pet switcher, type filters, date-grouped timeline (photos, mood, location, tags, pin).
   - FAB → New entry sheet (type/pet/title/notes/mood) → entry lands in Today; entry detail sheet with Pin/Delete.
5. **Services rebuilt** (`94_SERVICES_v1`, embedded; replaces old ServicesTab + BookingsScreen wiring)
   - Segments Discover / Bookings / Saved with counts.
   - Discover: search, per-pet needs, category grid (Walking opens the existing walking flow), Next up, top-rated providers with heart-save.
   - Bookings: Upcoming/Past, accordion detail (location/pet/notes/total), Message/Reschedule/Book again; **home "Booked" deep-links (b1–b3) preserved and verified**.
   - Saved: hearted providers + empty state.
6. **Settings money screens** — single **Wallet** (cards + fylos credits + this-month stats + activity + auto-pay toggle + billing history; non-bank framing: credits only, charges via Stripe/Link), **Notifications** (grouped MiniToggles, master push gate), **Subscription** (Free vs fylos Plus, monthly/yearly, perks, trial CTA) — all in the exact canonical Settings style.
7. **FAB menu refresh** — Book / Log entry / Moment / Add pet (removed dead Photo/Log med/Upload targets); journal deep-link via `fylos.journalAdd` sessionStorage flag.
8. **Docs** — this file + `AUDIT.md`.

## Decisions & assumptions (made to avoid blocking)

- **No lint/type/test tooling exists** in the repo → `vite build` + manual user-walk is the verification bar (added nothing new per "minimal dependencies").
- **Persistence**: prototype keeps state in-memory per session (consistent with the whole codebase); no localStorage layer invented.
- **Walking flow & Vault** kept functional in their older style rather than risk breaking a working booking flow late in the pass (flagged P2 in AUDIT).
- **Dead legacy components** inside the 12k-line dashboard file left in place (unreferenced) — deleting them is pure churn risk with zero user-visible gain; flagged in AUDIT.
- **Payment/Wallet merged** into one screen per explicit earlier feedback; Apple Pay row removed (always available on iOS — no setting needed).
- **Pro Registration** left as-is per explicit earlier "park it" decision.

## Needs a human decision (flagged, not blocking)

- Visual direction for Pro Registration (waiting on your reference).
- Whether to restyle Walking flow + Vault next (P2 batch).
- Copy/pricing for fylos Plus (CHF 6.50/7.99 are placeholders).
