# Fylos · Sheet & Modal Plan

> Όταν κάτι ανοίγει "από κάτω", "από πάνω" ή "πάνω από όλα", ποιο είναι το σωστό
> surface; Αυτό το αρχείο κρατάει την απόφαση του founder και τον κανόνα που
> ακολουθούμε σε όλη την εφαρμογή. Cross-link με
> [FYLOS_DESIGN_SYSTEM.md](FYLOS_DESIGN_SYSTEM.md) και
> [FYLOS_PRODUCT_DIRECTION.md](FYLOS_PRODUCT_DIRECTION.md).

## TL;DR — 3 surfaces, μία ξεκάθαρη επιλογή ανά case

| Surface | Πότε | Παραδείγματα |
|---|---|---|
| **Bottom sheet** | **ΜΟΝΟ chat-style flows** ή OS-native conventions (share menu, alert sheet σε mobile). Παραμένει τέλειος για conversation UI όπου ο composer ζει στο κάτω μέρος. | ChatSheet (Activity → Discover match → Say hi) |
| **Center modal** | Brief, single-moment decisions / inputs. ≤3 fields. Visual moments (celebration, share preview, confirm). | Match overlay · ShareSheet preview · AddPhoto · AddMilestone · AddMemory · CreatePost · ProfilePeek · PlacePeek · Confirm-cancel-playdate |
| **Full page** | Multi-step flows · settings lists · detail views με δικό τους header · browsing με πολλά items. Push-style transition (slide από δεξιά) ή stack (πάνω από το tab content). | EditProfile · Settings · Archetype quiz (5 βήματα) · Archetype picker (12 cards) · ScheduleSheet (date+time+place+invitees) · WrapUpSheet (rating+tags+note+photo) · PlaydateDetail · PostDetail (photo+comments+likers) |

## Decision tree

```
Action ανοίγει νέο surface
│
├── Είναι chat / message thread με composer στο κάτω μέρος;
│   └── YES → Bottom sheet (88% height, drag handle, header, composer pinned bottom)
│
├── Είναι single-decision moment (confirm / share / preview / quick form ≤3 fields);
│   └── YES → Center modal (max-width ~340, rounded-[20], peach card, no chrome,
│              tap outside dismisses)
│
└── Όλα τα άλλα (multi-step, list, settings, detail) → Full page
    (push-style transition, sticky header με back+title, content scrolls)
```

## Concrete migration map (από το current state)

### ΜΕΝΕΙ bottom sheet
- `ChatSheet` (PlaydateMatching) — chat convention.
- `PhotoLightbox` (ProfileMode) — full-screen black backdrop, όχι sheet ακριβώς αλλά full-overlay.
- Toast — όχι sheet, μένει.

### ΓΙΝΕΤΑΙ center modal
- `AddPhotoSheet` (3 fields, preview, save)
- `AddMilestoneSheet` (label + date + icon picker)
- `AddMemorySheet` (partner + place + vibe + 1-line note)
- `CreatePostSheet` (text + visibility)
- `ShareSheet` (preview share-card + 3 buttons)
- `ProfilePeekSheet` (read-only preview before action)
- `PlacePeekSheet` (read-only place card)
- `MiniProfileSheet` (PlaydateMatching)
- Match overlay — ήδη είναι center-style, κρατάμε.

### ΓΙΝΕΤΑΙ full page
- `EditProfileSheet` (name + bio + multiple looking-for chips)
- `SettingsSheet` (toggles + public link + future privacy controls)
- `ArchetypePickerSheet` (12 cards browse)
- `ArchetypeQuizSheet` (5 βήματα)
- `ScheduleSheet` (date · time · place · invitees · note)
- `WrapUpSheet` (rating · tags · photo · note)
- `PlaydateDetailSheet` (read view + Cancel/Message)
- `PostDetailSheet` (photo + caption + likers + comments thread + composer)

## Shared primitives (να φτιαχτούν)

- `<Modal>` — center pop-up. Props: `title`, `onClose`, `children`. Max-width 340, rounded-[20], peach card, backdrop fade, body-scroll-lock, `Esc` closes.
- `<FullPage>` — slide-in stacked page. Props: `title`, `onClose`, `actionRight`, `children`. Sticky header (back chevron, centered title, optional right action), peach background, push transition, body-scroll-lock.
- Existing `<SheetShell>` (bottom sheet) **μένει** μόνο για ChatSheet (rename: `<ChatBottomSheet>` ή keep generic).

## Implementation order (όταν ξεκινήσουμε)

1. Φτιάξε `Modal` + `FullPage` primitives σε `src/features/social/components/shared/` (ή κοινό `src/components/surfaces/` αν αξιοποιηθούν παντού).
2. Migrate τα 4-5 πιο εμφανή sheets πρώτα (Edit, Settings, ScheduleSheet, ArchetypeQuiz, PostDetail) — verify visually κάθε φορά.
3. Migrate τα center-modal-bound (AddPhoto, AddMilestone, AddMemory, CreatePost, ShareSheet) — μικρά διφραίνωτα sheets.
4. Cleanup pass: drop unused SheetShell variants, keep μόνο ChatBottomSheet.
5. Update FYLOS_DESIGN_SYSTEM.md §11 (Bottom Sheet) → προσθήκη Modal + FullPage spec.

## Σημειώσεις

- Backdrop: όλα τα 3 surfaces έχουν blurred dark backdrop (`rgba(0,0,0,0.42)` + `backdrop-filter: blur(2-4px)`).
- Tap outside: dismisses Modal & FullPage (όπως sheet σήμερα).
- Body scroll lock: ναι σε όλα.
- Animations: Modal fade+scale-in (200ms), FullPage slide-from-right (260ms cubic-bezier(0.32,0.72,0,1)), bottom sheet slide-up (260ms ίδιο easing).
- Scrollbars στο content area: `.custom-scrollbar` (ήδη hidden globally σε `src/index.css`).

---

**Status**: v1 draft · founder-approved direction · ζει μαζί με το product.
**Last updated**: 2026-05 · session #2 της Activity rebuild.
