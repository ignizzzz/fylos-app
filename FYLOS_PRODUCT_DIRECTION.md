# Fylos · Product Direction

> Αυτό το document δεν είναι tech ούτε design system. Είναι η **κατεύθυνση**: ποιος είναι ο Fylos, για ποιον υπάρχει, τι μοιάζει και τι ΔΕΝ μοιάζει. Διαβάζεται από καινούργιο designer/developer πριν αγγίξει οθόνη.
>
> **Είναι αδελφό αρχείο** του `FYLOS_TECH_BRIEF.md` (πώς το χτίζουμε) και `FYLOS_DESIGN_SYSTEM.md` (πώς φαίνεται).
>
> **Status**: v1 · founder-defined · ζει μαζί με το product

---

## 1. Why Fylos exists

> [TODO: founder fill — αυτό είναι το προσωπικό σου "γιατί". Αφήνω παρακάτω τη σκαλωσιά για να γράψεις πάνω της.]

**Το πρόβλημα που βλέπω.**
Οι πιο πολλοί άνθρωποι που αγαπούν τον σκύλο/γάτα τους έχουν τις πληροφορίες τους σκόρπιες σε:

- φωτογραφίες WhatsApp με τον κτηνίατρο
- πρόχειρα στο Notes/Calendar
- email επιβεβαιώσεις από εμβολιασμούς
- το κεφάλι τους (ημερομηνίες, βάρη, αλλαγές)

Όταν φεύγουν για ταξίδι, αλλάζουν κτηνίατρο, χάνουν το ζώο, ή το παραδίδουν προσωρινά σε φίλο — **όλη η γνώση είναι κλειδωμένη μέσα τους**, μη μεταβιβάσιμη.

**Η Fylos υπάρχει για να γίνει το "δεύτερο μυαλό" του pet parent.** Όχι αρχείο. Όχι social network. **Σύντροφος.**

**Γιατί τώρα.**

- Pet ownership-as-family είναι παγκόσμιο trend μετά το COVID
- Νέα γενιά parents βλέπει το ζώο ως μέλος οικογένειας, όχι κατοικίδιο
- Apple/Google data ecosystems έγιναν open enough για health/calendar sync
- Η Ευρώπη έχει υψηλό spending per pet αλλά κανένα app-of-record

**Γιατί εμείς.**
*[TODO: founder — γιατί έχεις εσύ unfair advantage; Personal story · vision · experience.]*

---

## 2. Ο κρίσιμος χρήστης

**Πρωτεύων**: ο **καινούργιος pet parent** (πρώτα 6-24 μήνες με ζώο). Ηλικία 28-45. Αστικό περιβάλλον. Αγχωμένος ότι κάτι θα ξεχάσει. Έχει ένα-δύο ζώα. Πιστεύει ότι ο σκύλος του είναι μέλος της οικογένειας. Δίνει €50-200/μήνα στο ζώο.

**Δευτερεύων**: ο **έμπειρος multi-pet owner** που ζητάει organization όχι coaching. Multi-generational data (παλιά εμβόλια, ιστορικό). Πιθανώς και walker/sitter του τοπικά.

**Geographic launch order**:

1. **Switzerland** (πρώτο launch) — υψηλό spending, premium aesthetic, 4 γλώσσες σε μία χώρα
2. **Northern Europe** (Q3 2026)
3. **Greece** (homecoming, αργότερα — δεν είναι launch market)

**Anti-personas (ΔΕΝ είμαστε για αυτούς)**:

- breeder/business owner που θέλει ERP για kennel
- influencer που θέλει social platform για το ζώο του
- επαγγελματίας κτηνίατρος που θέλει practice management
- gamer που θέλει tamagotchi-like badges/streaks

---

## 3. Το emotional promise

> Ο χρήστης πρέπει να φεύγει από κάθε session με μία από τις 3 αισθήσεις:
>
> **(α) "Ο Fylos μου είναι καλά."**
> Calm-confidence. Δεν είναι κρίσιμη μέρα · απλά ξέρω.
>
> **(β) "Δεν θα ξεχάσω."**
> Memory-offload. Η app κρατάει εκείνα που θα μου διέφευγαν.
>
> **(γ) "Δεν είμαι μόνος."**
> Companion-feel. Η app μιλάει σαν φίλος που νοιάζεται για τον Bobby — όχι σαν tracker.

**Τι ΔΕΝ πρέπει να νιώθει**: άγχος, χρέωση, "πρέπει να γίνεις καλύτερος pet parent", FOMO, gamification-pressure.

---

## 4. Το DNA: Revolut × Airbnb × Uber × Fylos

Δανειζόμαστε **DNA**, όχι **shell**. Από το καθένα κρατάμε την ψυχή, όχι τα χρώματα/styling.

| Brand | Surface (NEVER) | DNA (YES) |
|---|---|---|
| **Revolut** | Dark hero, neon, "trader" feel, gradient gimmicks, financial-coldness | Data-density με hierarchy · big-number scorecards · sparklines/mini-charts · "everything-is-a-card" · precision typography · haptic-grade microinteractions · "scan in 3 sec" |
| **Airbnb** | Hero photo dominance, large cover images, "discovery" overload, marketplace-search-first | Storytelling cards · generous whitespace στις right zones · soft warm tone · trust visuals (avatars, micro-bio) · friendly copy που μιλά σε πρόσωπο όχι σε "user" · "this is yours" feel |
| **Uber** | Map-as-screen, neon orange, "operator" feel, gig-economy coldness | Stateful immediacy ("8:00 — vacant in 15 min") · live timeline ως 1st-class citizen · bottom-sheet staging (info reveals progressively) · one big primary action per screen |
| **Fylos** | (όλα τα παραπάνω anti-surfaces) | Warm peach palette · Inter typography · light surface (#F9F9FB) · ποτέ dark hero · ποτέ photo-as-hero · "Fylos" λέξη-σύντροφος |

**Synthesis (μία πρόταση)**:

> *Ένα warm, peach-toned "Revolut" που σου διηγείται (Airbnb) τι πέρασε ο Fylos σου σήμερα και σου λέει την επόμενη κίνηση (Uber) — με εμπιστοσύνη και τρυφερότητα, όχι με alarms και dashboards.*

---

## 5. Density Strategy: Bipolar by Zone

Δεν προσπαθούμε να βρούμε ΕΝΑ όγκο πληροφορίας για όλο το app. **Κάθε ζώνη έχει τη δική της ανάσα.**

### Zone R — Revolut-dense (data, scan, precision)

**Surfaces που ανήκουν εδώ**:

- `03_HOME_Dashboard` — μικρά scorecards, today timeline, quick log
- `05_PETS_ProfileShell_Health` — βάρος curve, εμβόλια countdown, meds frequency
- `21_VAULT_HealthRecords` — tabular density, filters
- `29_ACTIVITY_Insights` — sparklines, trends
- `54_PRO_EARNINGS` — financial scorecards
- `57_PAYMENT_WALLET` — transaction list

**Κανόνες ζώνης**:

- 4-6 sections per scroll, καθεμία με νούμερο/μετρική στο prominent position
- Sparklines/mini-charts όπου υπάρχει χρονική σειρά (βάρος, βόλτες, meals)
- Cards με `rounded-[16px]`, padding 16px, scan-friendly hierarchy (μεγάλο number → label → trend)
- Μικρά chips/badges για state (Up/Down/Stable, Due/Overdue)
- ΟΧΙ μεγάλες φωτογραφίες πάνω από data
- ΟΧΙ generous whitespace μεταξύ sections — 12-16px gap

**Test**: *Αν κάποιος ανοίξει αυτό το screen και κλείσει το app σε 3 δευτερόλεπτα, έμαθε κάτι; Ναι → Zone R είναι σωστό. Όχι → είσαι σε Zone S.*

### Zone S — Airbnb-airy (story, warmth, identity)

**Surfaces που ανήκουν εδώ**:

- `04_PETS_ProfileShell_About` — το "listing" του Fylou
- `08_PETS_ProfileShell_Share` — invite/share moments
- `25_ACTIVITY_Feed` — memory cards, story of the week
- `26_ACTIVITY_FriendSystem` — pack/friend discovery
- `36_ONBOARDING` — first impression
- `66_PET_PROFILE_DETAIL` — public pet card
- `90_INVITE_PUBLIC` — shareable card

**Κανόνες ζώνης**:

- 1-2 sections per scroll, breathing room ~32-40px gaps
- Photo-as-content (όχι photo-as-hero) — εμφανίζεται μετά από title/identity, όχι πριν
- Storytelling copy ("Bobby's first vet visit", όχι "Vet Visit · Mar 12")
- Avatars/micro-bio strong presence
- Soft tone, trust signals
- **Επιτρέπεται** generous whitespace

**Test**: *Αν δείξω αυτό το screen σε φίλο εκτός app, λέει "ωραίο" ή "πληροφοριακό"; Πρέπει "ωραίο".*

### Zone L — Uber-stateful (live, now, action)

**Surfaces που ανήκουν εδώ**:

- `40_GPS_TRACKING` — live walk
- `45_LOST_PET_ALERT` — emergency state
- `46_VET_TELEHEALTH` — call/wait state
- `53_PRO_WALK_CHECKIN` — walker progress
- `59_HEALTH_REMINDERS` — countdown to next med/vaccine
- `61_PLAYDATE_MATCHING` — live match status
- `64_CHAT_MESSAGING` — incoming/outgoing
- `67_EMERGENCY_SOS` — panic state

**Κανόνες ζώνης**:

- ΕΝΑ primary action per screen, μεγάλο, αντίκρυσμα
- Bottom-sheet staging: πληροφορία αποκαλύπτεται τμηματικά
- Real-time state visible: live dot pulsing, ETA, countdown timer
- Map ή timeline as content κανόνας (όχι chrome)
- Λιγότερα chips/options · σαφέστερο next-step
- Time-sensitive copy ("now", "in 12 min", "since 3 min ago")

**Test**: *Αν αυτό το screen βρισκόταν σε pause, θα έχανε νόημα; Ναι → Zone L είναι σωστό.*

### Zone-classification table

| Screen | Zone | Reasoning |
|---|---|---|
| `03_HOME_Dashboard` | R+L | Data scorecards (R) + Today live timeline (L) |
| `04_PETS_About` | S | Listing/identity story |
| `05_PETS_Health` | R | Vaccine countdown, weight curve |
| `06_PETS_Documents` | R | Tabular |
| `07_PETS_Emergency` | L | State of emergency |
| `08_PETS_Share` | S | Invite story |
| `09_SERVICES_Home` | S+R | Discovery (S) + provider density (R) |
| `21_VAULT_HealthRecords` | R | Tabular density |
| `22_VAULT_Documents` | R | Tabular |
| `25_ACTIVITY_Feed` | S | Memory storytelling |
| `26_ACTIVITY_FriendSystem` | S | Social network discovery |
| `29_ACTIVITY_Insights` | R | Sparklines |
| `36_ONBOARDING` | S | First impression warmth |
| `40_GPS_TRACKING` | L | Live |
| `45_LOST_PET_ALERT` | L | Emergency live |
| `46_VET_TELEHEALTH` | L | Call/wait state |
| `49_SUBSCRIPTION` | S | "This is yours" feel |
| `53_PRO_WALK_CHECKIN` | L | Live progress |
| `54_PRO_EARNINGS` | R | Financial precision |
| `56_DANGER_REPORTS` | R+L | Map (L) + report list (R) |
| `57_PAYMENT_WALLET` | R | Transactions |
| `59_HEALTH_REMINDERS` | L | Countdown |
| `61_PLAYDATE_MATCHING` | S+L | Discover/Playmates tabs (S, browse like Airbnb) + Scheduled tab (L, live state) |
| `64_CHAT_MESSAGING` | L | Incoming/outgoing |
| `66_PET_PROFILE_DETAIL` | S | Public card |
| `67_EMERGENCY_SOS` | L | Panic state |
| `90_INVITE_PUBLIC` | S | Shareable card |

(Πλήρης table maintained per release · κάθε νέα screen παίρνει Zone-tag στο PR description.)

---

## 6. The 3 Always-On Layers (per screen)

Ανεξάρτητα από τη Zone, **κάθε screen έχει 3 layers κρυμμένα μέσα**, με διαφορετικές αναλογίες:

```
SCAN-LAYER     (Revolut DNA)  — η ματιά σκανάρει data σε 3 sec
LIVE-LAYER     (Uber DNA)     — κάτι είναι NOW · έχει state · έχει time
WARMTH-LAYER   (Airbnb DNA)   — ο Fylos είναι by name, όχι "pet 1"
```

**Παράδειγμα: HOME_Dashboard greeting**

- SCAN: "3 reminders today · weight stable · last walk 2h ago"
- LIVE: "Bobby is napping" *(if integration available)* · "next reminder in 2h"
- WARMTH: "Good morning, Anna. How is **Bobby** today?"

**Παράδειγμα: HEALTH_REMINDERS row**

- SCAN: "Rabies · due in 14 days"
- LIVE: countdown badge που ανανεώνεται · "URGENT" όταν <3 days
- WARMTH: "**Bobby's** rabies booster is coming up"

**Παράδειγμα: PLAYDATE_MATCHING active match**

- SCAN: "3 matches nearby · 0.4km · 0.8km · 1.2km"
- LIVE: "Luna is interested · responded 2 min ago"
- WARMTH: "**Luna** could be a great friend for **Bobby**"

**Anti-pattern**: ένα screen που έχει ΜΟΝΟ Scan layer (Revolut clone) ή ΜΟΝΟ Warmth (Airbnb clone). Πάντα και τα 3, με διαφορετικά βάρη ανά Zone.

| Zone | Scan | Live | Warmth |
|---|---|---|---|
| R | **dominant** | secondary | accent |
| S | accent | secondary | **dominant** |
| L | secondary | **dominant** | accent |

---

## 7. Voice & Tone

### Brand-name rules

- **"Fylos"** είναι το brand AND μία λέξη μέσα στην app. Σημαίνει "**friend / σύντροφος**" στα ελληνικά.
- **Ποτέ δεν μεταφράζεται** στα DE/FR/IT. Παραμένει **Fylos** σε όλες τις γλώσσες.
- Χρησιμοποιείται σε copy ως αντικείμενο αγάπης: *"Add your Fylos"*, *"Your Fylos's first vet visit"*, *"How is your Fylos today?"*
- Όταν ο χρήστης έχει 1 ζώο → η app χρησιμοποιεί **το όνομα** ("Bobby's day"). Όταν έχει πολλά → **"your Fylos"** ή **"your Fylos pack"**.

### Πρόσωπο copy

- Δεύτερο πρόσωπο, ζεστό. *"You logged 5km with Bobby today"*, ΟΧΙ *"User logged a walk."*
- Όταν η app μιλά για τον εαυτό της: 1ο πληθυντικό, όχι ψεύτικο corporate. *"We'll remind you when Bobby's vaccine is due"*, ΟΧΙ *"Fylos will notify the user."*
- **Avoid**: "Premium", "Unlock", "Upgrade", "Boost", "Smart", "AI-powered". Ηχούν εμπορικά → χάνουν warmth.
- **Prefer**: "Together", "We", "Your Fylos", "Daily", "Calm", "Simple".

### Tonal range (3 modes)

| Mode | Use case | Example |
|---|---|---|
| **Calm-friend** (default) | Home, profile, settings | *"Good morning, Anna. Bobby is doing great."* |
| **Coach-quiet** | Health, reminders | *"Bobby's rabies booster is in 14 days. Let's plan it."* |
| **Companion-urgent** | Emergency, lost pet, SOS | *"We're on it. Sharing your last known location with nearby friends."* |

**ΠΟΤΕ**: cheerful-marketing ("🐾 Pawsome!"), corporate-cold ("Your subscription has been activated."), gamified ("+50 XP · streak 7"), urgent-alarmist ("⚠️ ATTENTION: vaccine overdue").

### Languages — v1.0 scope

- **Primary**: **English** (Swiss expats, internationally-relevant baseline)
- **Translations**: **German (de-CH)** · **French (fr-CH)** · **Italian (it-CH)**
- **OXI v1.0**: Greek. Παρ' ότι "Fylos" είναι ελληνική λέξη, η ελληνική γλώσσα **δεν** ρίχνεται στο app στο launch. Greece είναι **homecoming market** για αργότερα (post Northern Europe).

**Translation philosophy**:

- Brand-words ποτέ δεν μεταφράζονται: *Fylos*, *Vault*. (Το παλιό *Pack* αντικαταστάθηκε από το λειτουργικό **Social**, που μεταφράζεται κανονικά.)
- Functional copy μεταφράζεται με Swiss localization (de-CH, όχι de-DE)
- "**Fylos**" παραμένει capitalized, μη-translated, σε όλες τις γλώσσες

---

## 8. Visual DNA — anti-patterns

Από τη μνήμη του founder και τη δομή του design system, αυτά **ποτέ**:

- **OXI dark hero cards σε light UI** — σπάει τη warm-neutral ομοιογένεια
- **OXI photo-as-hero** — η φωτογραφία είναι content, όχι chrome. Πάντα μετά από identity/title.
- **OXI multi-color "circus" tile grids** — quick actions έχουν ΕΝΑ peach accent χρώμα, όχι ουράνιο τόξο
- **OXI gradient AI-vibe CTAs** — ηχεί 2023-AI-app, όχι Fylos. Solid color ή soft gradient εντός peach palette ΜΟΝΟ.
- **OXI dark mode v1.0** — η Fylos είναι warm-light. Dark mode μπαίνει αν ζητηθεί από >20% users post-launch.
- **OXI gamification** — badges, streaks, levels, XP, leaderboards. Σπάει το emotional promise.
- **OXI hero gradients σε δεκάδες χρώματα** — 1-2 max gradient surfaces per session, όχι σε κάθε section
- **OXI emoji στο copy ως decoration** (🐾, 🦴, ❤️). Επιτρέπονται ΜΟΝΟ ως peer-content (user-generated comment).
- **OXI alarmist copy/colors** στο default state. Red μόνο σε true emergency (SOS, lost pet).
- **OXI "AI suggestion" framing** όπου η app προτείνει — λέγεται *"we noticed"*, όχι *"AI recommends"*.

---

## 9. Decision filters

Όταν ο designer/developer είναι σε δίλημμα, ρωτάει με αυτή τη σειρά:

**1. Σε ποια Zone είναι αυτό το screen;** (R / S / L / hybrid)
→ Καθορίζει density, copy length, photo placement.

**2. Ποιο είναι το emotional promise edition;** (α / β / γ από §3)
→ Καθορίζει tone (calm-friend vs coach-quiet vs companion-urgent).

**3. Ποιο είναι το PRIMARY action αυτού του screen;**
→ Πρέπει να μπορώ να το πω σε ΜΙΑ πρόταση. Αν δεν μπορώ, το screen κάνει πολλά πράγματα · split το.

**4. Αναφέρω τον Fylos by name;**
→ Αν ο χρήστης έχει 1 ζώο: ναι. Αν πολλά: "your Fylos pack" ή το επιλέγει.

**5. Είναι κάτι που ο user θέλει να ΔΕΙΞΕΙ σε άλλον;** (πχ. invite, profile share)
→ Τότε Zone S, photo-allowed, generous whitespace.

**6. Κάποιος "competitor" το έχει αυτό; Αν ναι, πώς το διαφοροποιώ από Fylos;**
→ Αν δεν μπορώ να απαντήσω, είναι σκέτο copy/clone — ξανακάνω.

**7. Έχει το screen και τα 3 layers (Scan/Live/Warmth);**
→ Αν λείπει το Warmth: το screen ηχεί robotic. Αν λείπει το Scan: ο χρήστης χάνει την precision. Αν λείπει το Live: είναι static αρχείο.

---

## 10. Πώς ζει αυτό το έγγραφο

- **Versioned**: μένει στο root, στην v1 τώρα. Update με ρητή PR commit message: `docs(direction): bump to v1.x for [reason]`
- **Δεν αλλάζει ελαφριά** — μόνο founder approval ή consensus με dev/designer team
- **Το Zone-classification table στο §5 ανανεώνεται με κάθε νέα screen**
- **Διαβάζεται σε kickoff** κάθε νέου designer/developer πριν αγγίξει UI
- **Cross-link**: όταν αλλάζει visual rule εδώ, σύγχρονο update στο `FYLOS_DESIGN_SYSTEM.md`. Όταν αλλάζει user/scope, σύγχρονο update στο `FYLOS_TECH_BRIEF.md`.

---

## 11. Open questions — founder to fill

- [ ] **§1 Why Fylos**: το προσωπικό σου story (γιατί το ξεκίνησες, τι personal pain σε έφερε εδώ)
- [ ] **§1 unfair advantage**: γιατί εσύ έχεις την unique θέση να το χτίσεις
- [ ] **§3 emotional promise**: είναι σωστά τα 3 (α/β/γ) ή υπάρχει 4ο που λείπει;
- [ ] **§7 voice samples**: 3-5 πραγματικά παραδείγματα copy που "θα έγραφες εσύ" για να καλιμπράρουμε το tone

(Αυτά κλείνουν σε επόμενες κουβέντες. Δεν blockάρουν το release του αρχείου.)

---

**End v1 draft.**
