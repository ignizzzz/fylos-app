# `_archive/` — out of v1.0 launch scope

Αυτός ο φάκελος **δεν περιλαμβάνεται στο app**. Είναι κρατημένος κώδικας από προηγούμενα iterations που βγαίνει εκτός scope για το πρώτο launch.

**Τίποτα εδώ μέσα δεν εισάγεται από το active codebase.** Το prefix `_` σταματάει tooling που σαρώνει το `src/` να το ψάχνει σαν ενεργό φάκελο.

## Why archived (decision: 2026-05-07)

Founder decision μετά από συζήτηση Παναγιώτη × Κάλτσος × founder review:

- v1.0 launch επικεντρώνεται σε **Services / Marketplace / Walkers / Sitters / Bookings / Chat** — αυτή είναι η ουσία της εφαρμογής (το booking + revenue path).
- Το **community / social κομμάτι** (friends feed, network discovery, playdate matching, bond scoring) **βγαίνει εκτός v1.0** και ξανασυζητιέται για v1.1+.
- Συγκεκριμένα gamification UI (energy bars, levels, bond score) επίσης φύγει — παραβιάζει και το anti-gamification rule του `FYLOS_PRODUCT_DIRECTION.md §8`.

## What's here

```
_archive/
├── screens/        Screens that were either orphan (no route) or part of community
│   ├── 25_ACTIVITY_Feed_v1.jsx
│   ├── 26_ACTIVITY_FriendSystem_v1.jsx
│   ├── 28_ACTIVITY_Social-Interactions_v1.jsx
│   ├── 29_ACTIVITY_Insights_v1.jsx
│   ├── 61_PLAYDATE_MATCHING_v1.jsx
│   └── 91_NETWORK_PROFILE_v1.jsx
│
├── features/
│   └── social/     Whole social feature folder (Profile/Network/Playdates rebuild)
│
├── data/
│   └── social/     Mock fixtures for social tab (friends, memories, playdates, places)
│
└── components/     Pack/Memory/Bond/Hotspot/Gamification UI
    ├── PackDiagram.jsx
    ├── PackInlines.jsx
    ├── PackPageSheet.jsx
    ├── PersonalityCardSheet.jsx
    ├── BondScoreSheet.jsx
    ├── MemoryOfTheWeekSheet.jsx
    ├── MemoryCard.jsx
    ├── PetOfTheDaySheet.jsx
    ├── StoryCardSheet.jsx
    ├── TwinFinderSheet.jsx
    ├── HotspotPlaceSheet.jsx
    ├── ReasonStack.jsx
    └── EarnedCounter.jsx
```

## Restore checklist (όταν επιστρέψει στο scope)

1. Move back σε αρχικά paths.
2. Restore imports + routes στο `src/App.jsx`.
3. Restore inline `ActivityScreen` block + `'activity'` tab στο `06_PETS_ProfileShell_Documents_v1.jsx`.
4. Test ότι `useSocialData` + το hook chain δεν έχει αποκλίνει.

## Σχετικά docs

- `FYLOS_TECH_BRIEF.md §6` — αρχικό MVP scope ορίζει αυτή τη γραμμή.
- `SOCIAL_REBUILD_PLAN.md` — το πλήρες σχέδιο για το social tab όταν επιστρέψει.
- `FYLOS_PRODUCT_DIRECTION.md §8` — anti-gamification rules.
