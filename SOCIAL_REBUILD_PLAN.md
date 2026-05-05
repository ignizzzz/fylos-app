# Social Tab — Rebuild Plan

> Πλήρες rebuild του "Pack" tab σε νέο "Social" tab. Νέα δομή φακέλων + shared data hook + clean redesign και των 3 modes (Profile / Network / Playdates) + cleanup legacy screens + rename παντού.

## Context

Το σημερινό "Pack" tab ζει **inline** στο 16.419-line `06_PETS_ProfileShell_Documents_v1.jsx` (mis-named — είναι το unified app shell). Έχει 3 modes (Profile / Network / Playdates). Το Playdates mode ανοίγει το ξεχωριστό 4.950-line `61_PLAYDATE_MATCHING_v1.jsx`. Παράλληλα υπάρχουν 6+ legacy standalone screens (25/26/28/29/66/91) που δεν χρησιμοποιούνται.

**Goals**:

1. **Καθαρή αρχιτεκτονική**: νέο `src/features/social/` με υπο-modes, νέο `src/data/social/` με shared fixtures, ένα `useSocialData()` hook.
2. **Coherent data flow**: likes / memories / personality / friends / playdates περνάνε από ένα κοινό data layer ώστε να φαίνονται σωστά παντού (profile ↔ network ↔ playdates).
3. **Redesign βάσει FYLOS_DESIGN_SYSTEM**: warm peach palette, Inter, light surface, no dark hero, no photo-as-hero, sticky header + scroll-collapse.
4. **Brand rename Pack → Social**: UI label, file/component names, state vars. Update `FYLOS_PRODUCT_DIRECTION.md` αντίστοιχα.
5. **Cleanup legacy**: αφαίρεση/συγχώνευση των standalone duplicate screens.

## Target folder structure

```
src/
├── data/
│   └── social/
│       ├── pets.js              # MOCK_PETS, MOCK_DASHBOARD_PETS, archetypes
│       ├── friends.js           # friends, suggestions, requests
│       ├── memories.js          # memory cards, story-of-the-week seed
│       ├── playdates.js         # upcoming, pending, completed
│       ├── places.js            # MOCK_PLACES + hotspots
│       ├── feed.js              # ACTIVITY_SOCIAL_FEED, FRIENDS_ACTIVITIES
│       └── index.js             # re-exports
│
├── features/
│   └── social/
│       ├── SocialTab.jsx        # top-level orchestrator (ex-ActivityScreen)
│       ├── useSocialData.js     # central data hook (likes/memories/playdates state)
│       ├── components/
│       │   ├── ModeSwitcher.jsx        # Profile/Network/Playdates segmented
│       │   ├── SocialHeader.jsx        # sticky header + bell + insights + menu
│       │   ├── PetSelector.jsx         # pet pill switcher
│       │   └── shared/                  # cards, sheets shared across modes
│       ├── profile/
│       │   ├── ProfileMode.jsx         # was ProfileTabContainer
│       │   ├── IdentityHero.jsx
│       │   ├── StatsStrip.jsx
│       │   ├── AboutTab.jsx
│       │   ├── MutualTab.jsx
│       │   └── AddMemorySheet.jsx
│       ├── network/
│       │   ├── NetworkMode.jsx         # was FriendsActivityContainer
│       │   ├── FeedTab.jsx
│       │   ├── RequestsTab.jsx
│       │   ├── FylosTab.jsx            # discovery/suggestions
│       │   ├── PlacesView.jsx
│       │   ├── PostCard.jsx
│       │   └── CreatePostSheet.jsx
│       └── playdates/
│           ├── PlaydatesMode.jsx        # in-tab summary
│           ├── PlaydateMatchingScreen.jsx  # rebuilt full-screen (was 61_*)
│           ├── DiscoverTab.jsx
│           ├── PlaymatesTab.jsx
│           ├── ScheduledTab.jsx
│           └── CreatePlaydateSheet.jsx
│
└── screens/06_PETS_ProfileShell_Documents_v1.jsx
    └── (το unified shell καταναλώνει SocialTab — δεν περιέχει πλέον το Pack inline)
```

## Phasing

### Phase 1 — Data extraction (foundation)
- Create `src/data/social/*.js` with all the mock arrays now lurking inside the unified file.
- No behavior change yet — just move literals out.
- Verify: app still runs identically.

### Phase 2 — `useSocialData` hook
- One hook owns: pets, friends, memories, playdates, posts, likes-by-post.
- Returns: read state + dispatchers (`addMemory`, `likePost`, `acceptRequest`, `schedulePlaydate`, …).
- Replace ad-hoc useState calls inside the unified file with `useSocialData()` calls.
- Verify: app still runs identically.

### Phase 3 — `src/features/social/profile/`
- Move `ProfileTabContainer.jsx` → `ProfileMode.jsx` and split its sub-components (IdentityHero, StatsStrip, About, Mutual, AddMemorySheet) into separate files.
- Wire to `useSocialData` for memories.
- Verify: Profile mode looks identical, but data is now centralised.

### Phase 4 — `src/features/social/network/`
- Extract `FriendsActivityContainer` (≈2k inline lines) into its own folder.
- Split into: NetworkMode, FeedTab, RequestsTab, FylosTab, PlacesView, sheets.
- Wire to `useSocialData`.
- Verify: Network mode looks identical.

### Phase 5 — `src/features/social/playdates/` (in-tab)
- Extract the in-tab Playdates summary (`ActivityCommunityPlaceholder`) → `PlaydatesMode.jsx`.
- It still opens the full screen for matching.
- Wire to `useSocialData`.

### Phase 6 — `SocialTab` orchestrator
- Build `src/features/social/SocialTab.jsx`: combines ModeSwitcher + the 3 modes + shared header/FAB/insights/notifications.
- Replace the inline `<ActivityScreen>` block in `06_*.jsx` with a single `<SocialTab>` call.
- Drop now-unused inline definitions from the unified file.

### Phase 7 — PLAYDATE_MATCHING rebuild
- Strip 4.950 lines down to a clean version (~800-1000 lines).
- Tabs: Discover · Playmates · Scheduled.
- Wire to `useSocialData` (same source of truth).
- Live state for active match (countdown / next step) per Zone-L rules in product doc.

### Phase 8 — Legacy cleanup
- Decide per-screen (delete vs keep route as redirect):
  - `25_ACTIVITY_Feed_v1.jsx`            → delete (covered by Network/FeedTab)
  - `26_ACTIVITY_FriendSystem_v1.jsx`    → delete (covered by NetworkMode)
  - `28_ACTIVITY_Social-Interactions`    → delete (covered by NetworkMode)
  - `29_ACTIVITY_Insights_v1.jsx`        → keep (separate insights surface)
  - `66_PET_PROFILE_DETAIL_v1.jsx`       → keep but rebuild as a thin viewer over `useSocialData`
  - `91_NETWORK_PROFILE_v1.jsx`          → delete (replaced by NetworkMode)
- Update `App.jsx` routes accordingly.

### Phase 9 — Rename Pack → Social
- Tab label: `Pack` → `Social`.
- Component / state names: `Pack*` → `Social*`, `activity` mode id → `social`.
- File names where they exist outside features/.
- Update `FYLOS_PRODUCT_DIRECTION.md`: drop "Pack" from brand-words list (§7).
- Drop legacy "Pack" references in copy / tests.

### Phase 10 — Final verification
- preview_start + screenshots of all 3 modes + the matching screen (light/dark, with/without data).
- Regression check: Home/Pets/Services tabs still untouched.
- Update CHANGELOG_GR.md.

## Technical features to polish (per user request §3b)

- **Schedule playdate**: live countdown badge in card · location auto-suggest from saved places · invitee list pulled from `useSocialData().friends`.
- **Parks** (places): unified `MOCK_PLACES` with `category`, `vibe`, `amenities`. Rendered consistently in PlacesView (Network) and CreatePlaydateSheet location picker.
- **Invite friends**: existing `90_INVITE_PUBLIC_v1.jsx` stays for the public landing; from inside the app the invite flow is a sheet inside NetworkMode that pulls from `useSocialData`.

## Checkpoints / commit boundary suggestions

- After Phase 1: `feat(social): extract mock data to src/data/social`
- After Phase 2: `feat(social): introduce useSocialData hook`
- After Phase 3: `refactor(social): extract ProfileMode`
- After Phase 4: `refactor(social): extract NetworkMode`
- After Phase 5+6: `refactor(social): introduce SocialTab orchestrator`
- After Phase 7: `feat(social): rebuild PlaydateMatchingScreen`
- After Phase 8: `chore(social): drop legacy duplicate screens`
- After Phase 9: `feat(social): rename Pack → Social across UI + docs`

## Verification per phase

- Always: `npm run dev` already running on port 5173 → preview screenshot.
- For data-extraction phases: visually identical screens (no regressions).
- For redesign phases: side-by-side check against `FYLOS_DESIGN_SYSTEM.md` tokens (radii, shadows, type scale, spacing).
- For final phase: run through happy-path navigation: home → social tab → all 3 modes → open matching → schedule playdate → back to feed.
