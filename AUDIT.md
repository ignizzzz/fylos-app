# FYLOS — Audit (Finish & Ship pass)

_Date: 2026-06-09 · Stack: React 18 + Vite + Tailwind (CDN-style utility classes) + react-router + lucide-react. Local-only, mock data, no backend._

## Architecture map

- **`src/App.jsx`** — flat route table. `/` = the real app (`06_PETS_ProfileShell_Documents_v1` "UnifiedApp"); everything else is either a sub-screen the app navigates to (settings sub-screens, add-pet, user-profile) or a standalone design-reference screen.
- **`06_PETS_ProfileShell_Documents_v1.jsx` (UnifiedApp)** — phone frame, status bar, global gradient-fade header, bottom tab bar (Home · Pets · ＋ · Services · Journal), overlays (Settings, Inbox, Search), and `renderScreen()` routing per tab.
- **Embedded tab screens** (render inside the dashboard, `embedded` prop):
  - Pets list → `70_PETS_HOME_v1`
  - Pet profile → `92_PET_PROFILE_v1` (per-pet data passed in)
  - Journal → `93_JOURNAL_v1`
  - Services (Discover/Bookings/Saved) → `94_SERVICES_v1`
  - Home → in-file `HomeScreen`; Vault (Health records) → in-file `VaultScreen`
- **Routed sub-screens** (canonical settings style): 49 Subscription, 57 Wallet, 58 Notifications, 59 Health reminders, 60 Help, 65 User profile, 71 Add Pet, 83 Primary vet, 67 Emergency, 70/71/72-89 security·privacy·legal, 56 Danger reports, 60 Invite.
- **State**: all local React state + mock constants; deep-links via props (`focusedBookingId`) and `sessionStorage` flags (`fylos.settingsOpen`, `fylos.journalAdd`).
- **Scripts**: `dev` / `build` / `preview`. No lint/type/test tooling exists in the project.

## Verified working (walked as a user, this pass)

Home (alerts, Booked rows → Bookings deep-link expands correct booking, Next up, Track, Explore: Bookings/Calendar/Health→Vault) · Pets list (cards, smart status, empty states, Add) · Pet profile (tabs, add/edit/remove vaccines·allergies·conditions·meds·contacts·docs, lost mode, share, more-sheet) · Add Pet (7 steps, breed picker, mixed breeds, presets+custom) · Journal (summary, filters, pet switcher, FAB add, entry detail, pin/delete) · Services Discover (search, pet switcher, categories, Next up, providers, save) · Bookings (filters, accordion, actions) · Saved · Walking booking flow · FAB menu (Book/Log entry/Moment/Add pet — all live targets) · Settings (every row navigates: notifications, wallet, subscription, health reminders, primary vet, emergency, language, currency, password/2FA/biometric, become a pro, help, terms/privacy/licenses) · User profile (editors, verified, delete gate) · Invite.

## Fixed during this pass (must-fix items found)

1. **Stale FAB targets** — Log med→`/feeding-tracker`, Photo→`/photo-gallery`, Upload→`/help` pointed at screens no longer part of the product. Replaced with Book / Log entry / Moment / Add pet (all wired).
2. **Old Services & Journal tabs** — replaced with rebuilt `94`/`93`; booking deep-link ids (b1–b3) preserved.
3. **Old pet list/profile** — replaced with `70`/`92`; per-pet data flows in; global header hidden on profile (it has its own).
4. **Data bug** — Leo was `sex: 'Female'` in `INITIAL_MOCK_PETS`.
5. **Dead import** — old `features/journal/JournalScreen` unwired.

## Known limitations (accepted for this prototype, prioritized)

- **(P2) Legacy-styled flows still in use:** WalkingScreen booking flow and Vault (health records/documents) work but predate the final aesthetic. Functional; restyle is the next design batch.
- **(P2) Dead code in `06_PETS...`:** old `ServicesTab`, `BookingsScreen`, `PetListScreen`, `PetProfileScreen` remain defined but unreferenced (~large file). Deleting is safe in principle but high-churn; deferred deliberately.
- **(P3) Persistence:** toggles/edits persist in component state for the session (no backend by design). `sessionStorage` only for cross-screen flags.
- **(P3) Dev-only quirk:** React StrictMode double-mount can eat the `fylos.settingsOpen` restore flag in dev; fine in production build.
- **(P3) Standalone reference routes** (`/pets-home`, `/pet-view`, `/journal-view`, `/services-view`, onboarding variants, etc.) are intentional design previews, not product dead-ends.
- **(P3) Pro Registration** functional but visually parked — awaiting a reference design (explicit product decision from earlier).
