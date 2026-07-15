# Fylos Kotlin Port — Consolidated Parity Audit

**Scope:** Kotlin app (`~/Project-Fylos/Fylos.Mobile/composeApp/.../me/fylos/mobile/`) audited against the shipped React prototype (`~/fylos-mobile-ui-viewer/src/`). Backend/mock/auth differences excluded.

**Path shorthand:** `R:` = `fylos-mobile-ui-viewer/src/`, `K:` = `Fylos.Mobile/composeApp/src/commonMain/kotlin/me/fylos/mobile/`. `06` = `R:screens/06_PETS_ProfileShell_Documents_v1.jsx` (the canonical UnifiedApp shell at route `/`).

**Framing note (important):** Several Kotlin screens were faithfully ported — but from *superseded* React drafts. Home was ported from the right file but stripped; Services was ported from the old `94_SERVICES_v1` instead of the shipping `features/services/`; the pet profile from an old draft of `92_PET_PROFILE_v1`; the user profile from a dead layout inside `65_USER_PROFILE_v1`. The parity target for each area is what the React app actually renders on `/`.

---

## 1. Master gap list (deduplicated, prioritized)

### P1 — visible everywhere / core UX, fix first

| # | Gap | Refs |
|---|-----|------|
| 1 | **Global color tokens wrong app-wide:** Background `#F2EFE6` → must be cream `#F7F5F2`; also CoralSoft → `#FBE7DD`, Divider → `#F1EDE8`, TextTertiary → `#9B9B9F`, Green → `#3F8D63`, add Danger `#E5484D` + DangerSoft `#FEE8E7`; card radius 20dp → 18dp | `K:theme/FylosColors.kt`, `K:ui/components/Common.kt:144` · `06:1156`, `FYLOS_DESIGN_TOKENS.md` |
| 2 | **Header scroll treatment wrong everywhere:** Kotlin headers are fixed blocks (home top bar even scrolls away, content hard-clips at the status bar); canonical is a fixed overlay with a cream gradient fade that content scrolls behind — one shared fix in `SubScreenHeader` + home `TopBar` cascades to every screen | `K:ui/home/HomeScreen.kt:150-166`, `K:ui/components/Common.kt:52-94` · `06:1507, 1719-1720` |
| 3 | **Bottom tab bar is an opaque white slab:** must be the floating frosted pill (white 80% + heavy blur, radius 26, h62, 22dp above bottom, hairline ring) with the sliding `#F3EFEB` indicator, active-icon stroke/scale change, and FAB that rotates 45° into a black X when open | `K:ui/main/MainShell.kt:219-268` · `06:1624-1689` |
| 4 | **Systemic icon mismatch:** entire app uses hand-drawn Canvas approximations + Material FILLED vectors instead of the chosen lucide line set — one mechanical fix (generate ~35 lucide ImageVectors, stroke 2, round caps, into FylosIcons; delete CanvasIcons + private copies) kills the whole class: Home/BookOpen/PawPrint tab glyphs, Stethoscope (Health tile, Vet chip, Journal health), LifeBuoy (First aid), Footprints (all walk contexts — never paw), Zap/HelpCircle/Wallet (settings), Send paper-plane, Mail/Lock/Eye (auth), ChevronLeft, Target, UtensilsCrossed, MessageSquare, ArrowRight | `K:ui/components/CanvasIcons.kt`, `K:ui/icons/FylosIcons.kt`, `K:ui/pets/PetsScreen.kt:590+` · lucide imports in `06`, `ICONS_COMPARE_v1.jsx` |
| 5 | **Header action cluster wrong:** SOS must be red `#E5484D` on `#FFEBEA` (38dp), bell warm-gray `#6E6058` on `#F3EFEB` (44dp) with a plain 7dp coral dot (no numeric badge), avatar 44dp with 2dp `#EDE8E2` border; also missing entirely from the Pets tab header | `K:ui/home/HomeScreen.kt:260-322`, `K:ui/pets/PetsScreen.kt:180-193` · `06:1513-1526` |
| 6 | **Pet deck interaction lost:** single static tap-to-cycle card instead of a horizontally swipeable snap deck (318dp cards, off-cards 0.97/75%) ending in a dashed "Add a pet" card, dots including it, tap-through to profile | `K:ui/home/HomeScreen.kt:180-215, 449-463` · `06:5804-5904` |
| 7 | **Pets-tab cards lost the editorial look:** plain white card + 52dp avatar instead of a 186px full-bleed photo card with bottom dark gradient, white name/breed on the photo, status chip top-right | `K:ui/pets/PetsScreen.kt:239-306` · `R:screens/70_PETS_HOME_v1.jsx:78-98` |
| 8 | **Pet profile is an old draft:** no About/Health/Documents/Emergency tabs (Documents & Emergency don't exist at all), no edit capability anywhere (no field/chip/item sheets, no EditPet destination), no Share/Edit/Records/Lost quick-action row (replaced by off-spec stat tiles showing "NEXT VET —"), no ⋯ menu (Share / Set as lost / Transfer / Remove pet — currently an empty spacer) | `K:ui/pets/PetProfileScreen.kt` · `R:screens/92_PET_PROFILE_v1.jsx`, `06:11673-11696`, `R:screens/38_EDIT_PET_v1.jsx` |
| 9 | **Services tab ported from the superseded 94 prototype:** no Discover/Bookings/Saved sub-tabs, and Discover is a single flat list missing Recommended rail, Top rated + See all, New on Fylos, Recently viewed, Quick actions (map / telehealth), tip card | `K:ui/services/ServicesScreen.kt:76-102, 452-479` · `R:features/services/ServicesTab.jsx:41-69`, `R:features/services/discover/DiscoverMode.jsx:373-484` |
| 10 | **Profile screen is an outdated layout:** must be rebuilt to ProfileOverviewMix — coral wallet membership card hero (gradient `#EF6A3C→#E85D2A→#D44D1B`, stacked peach edges, Member since/ID footer), 22sp/800 coral stats strip (Bookings/Pets/Streak), green verification strip. This also resolves the founder's "text too small" complaint — row sizes actually match spec; the missing large-type accents are what makes it read small | `K:ui/profile/ProfileScreen.kt:233-354` · `R:screens/65_USER_PROFILE_v1.jsx:797-859` |

### P2 — real feature gaps

**Home**
- Safety-alert ribbon (dismissable red pill, pulsing dot) + popup carousel missing — `06:5712-5745, 4097+`
- Live-service banner only renders as a loading mock, never on real data; no live popup — `K:ui/home/HomeScreen.kt:169-172, 327-354` · `06:5747-5802, 4341+`
- Pet-card status ring (green when live / coral arc by pending tasks) + top-pending-task line + tap-circle quick-complete missing — `K:HomeScreen.kt:389-447` · `06:5856-5887`
- Invite-a-friend CHF 10: home Explore row, profile entry row, and the full referral screen (voucher ticket, QR, stats, invite list) all missing — `06:6114-6126`, `65:912-921`, `R:screens/60_INVITE_FRIENDS_v1.jsx`
- FAB menu missing "Book" and wrong presentation (3 vertical rows vs 4 horizontal 54dp white circles, staggered bounce, blurred cream scrim) — `K:MainShell.kt:124-214` · `06:1551-1620`
- BOOKED "Show N more" navigates away instead of expanding inline with Show less toggle — `K:HomeScreen.kt:234-242` · `06:6031-6043`

**Pets**
- Health tab content mostly missing: weight sparkline + scrubbable trend chart, Allergies (severity chips), Conditions, Medications — `92:271-348, 469-503`
- Lost pet mode (Emergency-tab banner + confirm dialog) AND the standalone Lost Pet Alert screen (45) both absent — `92:259-269, 513-519`, `R:screens/45_LOST_PET_ALERT_v1.jsx`
- Share sheet (coral gradient QR card, copy link) + "Who has access" list missing — `92:234-242, 527-540`
- About tab missing Personality chips + Daily care card — `92:134-146, 448-465`
- "Coming up" / "Recent activity" gated to mock loading state — vanish for real users (empty-state card exists but is never shown) — `K:ui/pets/PetsScreen.kt:158-172` · `70:126-209`
- Vaccination reminder bell toggle on due rows missing — `92:477`

**Services & booking**
- Grooming/Vet disabled ("SOON") though active in prototype; Boarding + Pet Taxi coming-soon chips missing — `K:ServicesScreen.kt:110-117` · `R:data/services/categories.js`
- Category 2×2 tile grid + CategoryDetail screen (sort chips, Available-now filter, map shortcut) missing — `R:features/services/subscreens/CategoryDetail.jsx`
- Saved providers: no bookmark toggle anywhere, no Saved mode — `R:features/services/saved/SavedMode.jsx`, `ProviderCard.jsx:116-130`
- Provider reviews UI absent (profile preview + full histogram/filter screen; Kotlin permanently shows "Ratings coming soon") — `R:features/services/subscreens/ProviderReviews.jsx`
- Provider profile stripped: meta row (location/distance/response/languages), stats strip, trust chips, gallery, certifications, share/report sheet — `K:ui/services/ProviderDetailScreen.kt:237-317` · `ProviderProfile.jsx:104-353`
- Booking flow missing add-ons step + notes-to-provider (300-char) field — `K:ui/services/BookingFlowScreen.kt:275-317` · `BookingFlow.jsx:268-312`
- Payment step missing entirely (saved methods, cost breakdown, Pay CTA) — `R:features/services/flows/Payment.jsx`
- Booking details screen missing (status banner, provider actions, facts, timeline) — `K:ui/bookings/BookingsScreen.kt:308-433` · `BookingDetails.jsx`
- Reschedule absent everywhere (Kotlin Help screen even promises it); leave-review + rebook on completed bookings absent — `K:BookingsScreen.kt:411-429`, `K:ui/settings/HelpScreen.kt:79-82` · `CancelRescheduleSheet.jsx`, `AddReviewModal.jsx`
- Cancel flow lost its sheet: reason radios, optional note, fee-policy line, gated CTA (bare inline Yes/Keep now) — `K:BookingsScreen.kt:363-431` · `CancelRescheduleSheet.jsx:39-107`
- Map exploration screen missing (typed/colored pins, filters, bottom card) — `R:screens/41_MAP_PROVIDERS_v1.jsx`
- GPS live-walk tracking screen missing (stylized mock map — no SDK needed) — `R:screens/40_GPS_TRACKING_v1.jsx`
- Vet telehealth missing (browse vets, detail, consult CTA) — `R:screens/46_VET_TELEHEALTH_v1.jsx`

**Profile & settings**
- Finish-your-profile nudge (progress ring, Next step, Continue pill) + checklist sheet missing — `65:761-769, 861-876`
- "My pets" horizontal card strip + "+ Add pet" action missing — `65:878-897`
- Details card with value-bearing rows + the whole per-field bottom-sheet editor system (name rate-limit, DOB lock, email/phone verify, address, emergency contact) missing — `65:900-910, 396-602`
- Delete account row + checkbox-gated confirmation dialog missing — `65:927-996`
- Language settings screen (48) missing entirely — `R:screens/48_LANGUAGE_SETTINGS_v1.jsx`
- Subscription screen (49, fylos Plus) missing entirely — `R:screens/49_SUBSCRIPTION_v1.jsx`
- Notification prefs collapsed: no master push toggle that dims everything, 9 structured topics → 6 generic, no Email/SMS channel rows — `K:ui/settings/NotificationPrefsScreen.kt` · `58:56-110`
- Health Reminders settings screen (59) missing (NotificationPrefs is a different screen) — `R:screens/59_HEALTH_REMINDERS_v1.jsx`

**Wallet / chat / safety / extras**
- Feeding Tracker (44) and Photo Gallery (43) screens missing entirely
- Chat: inbox search bar; in-chat booking card message type; conversation-header status line + phone/info pill — `K:ui/chat/*` · `64:174-209, 358-461`
- Wallet: Billing-history row missing; spend-chart scrub interaction missing — `K:ui/wallet/WalletScreen.kt:493-501, 653-870` · `57:133-196, 334`
- Emergency screen dropped the red 24/7 vet-hotline hero card (+ green clinic call button); first-aid topics lost their per-topic peach icon chips — `K:ui/safety/*` · `67:23-70`
- Become-a-pro wizard shrank 9+1 phases → 4: welcome/earnings pitch, photo+bio, services & prices with 85% take-home, availability grid, perks/policies, ID verification, payout, live preview all gone (partly backend-scoped, but reads as missing) — `K:ui/pro/BecomeProScreen.kt` · `50:147-444`

### P3 — polish

- Home: time-based greeting + name in `#D14E1F`; BOOKED empty-state tappable row; pet-card gradient surface (white→`#FBF7F2`, 1dp `#F3EDE5` ring, warm shadows); Earn card drift (`#FBE7DD`, 15sp, ArrowRight glyph) + Explore tile sizing; motion (homeReveal stagger, 350ms pet-switch crossfade, 1.5% grain)
- Pets: profile hero single muted "Breed · Sex · Age" line (not coral chips) + collapsing top bar; empty-state watercolor artwork instead of paw circle
- Services: deep search (recent chips, browse empty state, cross-field matching); Next-up card 3-band hierarchy with status-colored pill; price `/hr` suffix; "Book Anna · from CHF 32" CTA; RequestSent next-step CTAs + timeline; 4 status tabs with counts + calendar view; Messages header entry with unread badge; multi-pet selector pill
- Chat: read receipts + per-bubble timestamps; attach/emoji/mic input accessories; thread-row metadata (role, booking chip, online dot); day-separator hairlines
- Wallet: signature motion (odometer, chart draw-in, staggered bars, pulsing dot); hero radial white highlight
- Settings: sign-out confirm dialog in danger red; change-password live helper + 10-char minimum; weight/size drifts (labelSmall→bold, header 17sp, value chips on `#F4EFE9`)
- Pro: role multi-select + full-width row layout + "coming later" footnote; success-screen celebration (rings, confetti, pulsing timeline); Become-a-Pro row subtitle "Walk or sit for others" (drop grooming)
- Scoped later by design: full fylos PRO provider mode (96+53; URL-only even in React, blocked on partner endpoints); Training Tips (orphan in React too)

**Founder decision needed:** the old `03_HOME_Dashboard` extras (Upcoming booking cards, Quick Actions grid, Today's reminders, Suggested services) were *deliberately removed* from the shipping home. Porting them would change the current design — confirm before anyone builds them.

---

## 2. Consolidated Compose spec — the three requested behaviors

### A. Top scroll fade (all screens)

- The scroll container is **full-bleed**: fills the whole screen, no `statusBarsPadding()` on it — content reaches under the status bar.
- The header is an **overlay Box on top of the scroller**, not part of it, `pointerEvents` pass-through except its buttons.
- **Main shell (Home/Pets/Services/Journal):** header backdrop = `Brush.verticalGradient(0f → Color(0xFFF7F5F2), 0.5f → Color(0xFFF7F5F2).copy(alpha = 0.95f), 1f → Color.Transparent)`; band height = status-bar inset + ~68dp (React: 56 top pad + 44 row + 24 bottom pad ≈ 124px). Content top padding = status inset + ~54dp so it starts below the row but dissolves under the fade when scrolled. No blur, no shadow, no hard edge.
- **Sub-screens (`SubScreenHeader` in Common.kt — one change fixes all):** backdrop = `verticalGradient(0f → #F7F5F2, 0.56f → #F7F5F2, 1f → transparent)`. Back button: 36dp white circle, warm shadow, lucide ChevronLeft (stroke 1.8, round caps). Title: 17sp / weight 700, centered.
- Extra behavior on Home: while any popup is open, header + tab bar animate out (`alpha 0`, `translationY +8dp`, 300ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`).

### B. Hero / greeting background removal

- The greeting has **no background block** — delete any tinted container behind the top-bar/greeting zone. It sits directly on the page canvas.
- Page canvas: `#F7F5F2` everywhere (fix `FylosColors.Background`), optionally + fractal-noise grain at 1.5% alpha.
- Greeting = one bare eyebrow row: left `MON · 16 FEB` — 11sp, semibold, `#9B9B9F`, uppercase, letterSpacing 0.14em; right `{Morning|Hi|Evening|Hey}, Talita` — 11.5sp semibold `#9B9B9F`, the name **bold `#D14E1F`** (dark coral, not `#E85D2A`). Greeting word by local hour: <11 "Morning", <17 "Hi", <21 "Evening", else "Hey".
- The **only surfaces** in the hero zone are the pet-deck cards: width 318dp, radius 24, background `Brush.linearGradient` 165° `#FFFFFF → #FBF7F2`, 1dp inset border `#F3EDE5` + 1.5dp inner top white highlight; shadow active `0 2 4 rgba(60,30,15,0.04) + 0 14 30 rgba(60,30,15,0.10)`, idle `0 1 2 rgba(60,30,15,0.03) + 0 6 16 rgba(60,30,15,0.06)` with scale 0.97 + alpha 0.75.

### C. Bottom treatment

- **Main shell: no bottom gradient.** The treatment is the floating translucent pill; the scroller just reserves 120dp bottom padding.
- Pill: positioned 22dp above screen bottom, 16dp side gutters, height 62dp, radius 26dp; background `Color.White.copy(alpha = 0.8f)` **with backdrop blur ~40** (haze/hazeChild — content must visibly blur through it); shadow `0 2 20 rgba(0,0,0,0.06)` + 0.5dp hairline ring `rgba(0,0,0,0.04)`; internal horizontal padding 4dp.
- Sliding indicator: `#F3EFEB` pill, inset 5dp top/bottom, radius 20dp, animated to the active tab's measured offset/width over 450ms with overshoot spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Tabs (Home / Pets / [FAB] / Services / Journal): icons 20dp, stroke 1.5 idle → 2.2 active, `#9B9B9F` idle → `#E85D2A` active + scale 1.1; 10sp bold label (tracking 0.04em) slides in only for the active tab.
- Center FAB: 44dp circle `#E85D2A`, shadow `0 4 14 rgba(232,93,42,0.3)` + inset white top highlight; open state: background `#111`, rotate 45°, scale 1.05. Menu: full-screen scrim `#F7F5F2 @ 85%` + blur(8dp); **four** actions (Book / Log entry / Moment / Add pet) as a horizontal row of 54dp white circles (shadow `0 4 20 rgba(0,0,0,0.1)` + 0.5dp ring) with 11sp semibold labels below, staggered bounce-in (0.4s, 60ms + 50ms·i delays, same overshoot easing).
- **Sub-screens with pinned CTA stacks only:** bottom fade `verticalGradient` to-top `#F7F5F2 → #F7F5F2@95% → transparent` behind the CTA.

---

## 3. Attack order

### Session 1 — the "looks like a different app" fixes (mostly mechanical, huge payoff)
1. **Token pass** in `FylosColors.kt` + `Common.kt` (P1 #1): ~10 one-line changes, cascades to every screen. Do first.
2. **Header gradient-fade** (P1 #2): rework `SubScreenHeader` once + hoist the Home TopBar into an overlay. Two touch points, app-wide effect.
3. **Bottom tab bar** (P1 #3): frosted pill + sliding indicator + FAB morph + add the Book action.
4. **Lucide icon generation** (P1 #4): batch-convert the ~35 SVGs to ImageVectors, swap call sites, delete CanvasIcons. Mechanical but kills ~80% of the icon complaint in one commit.
5. **Hero cleanup** (spec B): greeting row, background removal, pet-card surface, time-based greeting.

### Session 2 — home + pets at eye level
6. **Pet deck pager** with dashed Add-a-pet card + dots + tap-to-profile (P1 #6).
7. **Pets-tab full-bleed photo cards** (P1 #7) + un-gate Coming up/Recent activity.
8. **Header action cluster** (P1 #5) incl. adding it to the Pets tab.
9. Quick home wins: safety ribbon shell, live banner on real data, BOOKED inline expand, Earn-card fixes, invite row.

### Scheduled next (each is a real project, in this order)
10. **Pet profile rebuild to 92** (P1 #8) — biggest single effort: tabs, quick actions, ⋯ menu, edit sheets, then Health content + lost mode + share sheet.
11. **Profile screen rebuild to ProfileOverviewMix** (P1 #10) + Details sheets, delete account, sign-out dialog; then Language / Subscription / Notification-prefs / Invite screens.
12. **Services restructure** (P1 #9): Discover/Bookings/Saved sub-tabs + Discover sections + category grid/detail; then saved providers, provider-profile content, reviews UI.
13. **Booking lifecycle**: notes field + payment step + booking details screen + cancel sheet + reschedule + review/rebook.
14. **Missing standalone screens**: GPS tracking, vet telehealth, lost-pet alert, feeding tracker, photo gallery, health reminders; chat P2s; wallet billing/scrub.
15. **Later / gated**: Become-pro wizard restoration (partly blocked on the PartnerApplication DTO), fylos PRO provider mode (blocked on partner endpoints; not in React nav either), training tips (needs a home first), motion polish pass (homeReveal, wallet odometer, chart reveals).

**Rule of thumb for the whole effort:** Sessions 1–2 are restyling of existing code and change no behavior contracts; items 10–13 are rebuilds and should each land as their own reviewed branch per the beta-test protocol.
