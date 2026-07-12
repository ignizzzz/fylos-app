# Fylos — Website Concepts 01

Ημερομηνία: 2026-07-12 · Στόχος: το fylos.app ως η πρώτη μας διαφήμιση, με ρεαλιστικό δρόμο προς Awwwards (Site of the Day και πάνω).

Συνοδευτικό οπτικό concept board με live demos: βλ. artifact «Fylos — Website Concepts 01» στο Claude session.

---

## 1. Τι μάθαμε από την έρευνα

Μελετήθηκαν οι νικητές Site of the Year των Awwwards (Igloo Inc 2024, Lando Norris & Messenger 2025, Lusion, Bruno Simon, Simply Chocolate) και τα trend reports του 2026.

Πέντε μοτίβα που επαναλαμβάνονται στους νικητές:

1. **Ένας μηχανισμός-υπογραφή.** Οι μεγάλοι νικητές δεν έχουν δέκα εφέ, έχουν ένα αξέχαστο, δεμένο με το brand (το fluid simulation της Igloo Inc, το αυτοκινητάκι του Bruno Simon).
2. **Minimal και βάθος μαζί.** Καθαρές, ήσυχες επιφάνειες που κρύβουν βάθος στην αλληλεπίδραση. Το λιτό δεν σημαίνει στατικό.
3. **Το εφέ αφηγείται το προϊόν.** Ό,τι κινείται πρέπει να λέει κάτι για το τι κάνει η εφαρμογή. Εφέ χωρίς νόημα κόβονται από την επιτροπή.
4. **Kinetic typography και ήχος.** Τυπογραφία που αποκρίνεται σε scroll και cursor, διακριτικό sound design.
5. **Performance και μια shareable στιγμή.** Το scoring περιλαμβάνει ταχύτητα και προσβασιμότητα. Και κάτι που θες να δείξεις σε φίλο (personalization, easter egg) κάνει το site διαφήμιση από μόνο του.

**Το κενό της αγοράς:** τα websites των pet apps είναι όλα το ίδιο template (φωτογραφία σκύλου, «Book now», τρία feature cards). Κανένα δεν έχει σχεδιαστική ταυτότητα. Το brand μας (cream, coral, editorial serif) είναι ήδη πιο ώριμο από όλο τον ανταγωνισμό.

---

## 2. Concept 01 — «Η Τελεία»

**Θέση:** Η coral τελεία του λογότυπου γίνεται πρωταγωνιστής όλου του site. Ένα στοιχείο, μία συνεχής αφήγηση.

Η τελεία μεταμορφώνεται καθώς κατεβαίνεις: το μπαλάκι που κυνηγάει ο σκύλος στο hero, η καρφίτσα στον χάρτη της βόλτας, ο παλμός στο διάγραμμα βάρους, η κουκκίδα της υπενθύμισης εμβολίου, και στο τέλος η τελεία στο «Stress less. Fylos more.» Σε όλη τη διαδρομή συμπεριφέρεται σαν κατοικίδιο: ακολουθεί τον κέρσορα με φυσική ελατηρίου, «κάθεται» και ανασαίνει όταν σταματάς, έρχεται όταν την φωνάζεις (κλικ).

Μηχανισμοί:
- Scroll-driven μεταμορφώσεις της τελείας (GSAP ScrollTrigger + SVG/Canvas morphs).
- Cursor companionship με spring physics.
- Personalization: γράφεις το όνομα του pet σου στο hero και όλο το site μιλάει για εκείνο («Πώς είναι ο Leo σήμερα;»). Δένει με τον κανόνα του brand «το pet πάντα ονομάζεται».
- Easter egg / waitlist: «μάθε στην τελεία ένα κόλπο» για να ξεκλειδώσεις early access.

Γιατί κερδίζει: ακραίος μινιμαλισμός με ιδέα, brand mark ως αφηγητής, δεν αντιγράφεται χωρίς να αντιγραφεί το λογότυπο. Χωρίς WebGL, άρα άριστο performance και σε κινητό.

Πολυπλοκότητα ●●○○ · 3–4 εβδομάδες ως award-ready · Ρίσκο χαμηλό.

---

## 3. Concept 02 — «Μια μέρα μαζί»

**Θέση:** Το scroll είναι χρόνος. Μία μέρα με το κατοικίδιό σου, 07:00–23:00.

Το φως αλλάζει σαν πραγματική μέρα (αυγή, μεσημέρι, χρυσό απόγευμα, βράδυ) και κάθε feature εμφανίζεται τη στιγμή που έχει σημασία: βόλτα και dog walker το πρωί, υπενθύμιση κτηνιάτρου το μεσημέρι, ζύγισμα το απόγευμα, ημερολόγιο το βράδυ. Το δυνατό σημείο: **το site ανοίγει στην πραγματική τοπική ώρα του επισκέπτη** — στις 9 το πρωί βλέπεις άλλο site από ό,τι στις 11 το βράδυ. Το PR hook γράφεται μόνο του: «το website με κιρκάδιο ρυθμό».

Μηχανισμοί:
- Scroll = ώρα, συνεχής μετάβαση φωτός/σκιών με color scripting (CSS custom properties driven by scroll).
- Άνοιγμα στην τωρινή ώρα του επισκέπτη.
- Προαιρετικό ambient sound ανά ώρα (πουλιά, πόλη, βροχή) με διακριτικό toggle.

Προσοχή: η «νύχτα» πρέπει να μείνει ζεστή (peach/dusk), όχι σκοτεινό hero — συμβατότητα με τον κανόνα «light surfaces only» του brand.

Πολυπλοκότητα ●●●○ · 4–6 εβδομάδες · Ρίσκο μέτριο (color script, ήχος).

---

## 4. Concept 03 — «Φύλος, ουσιαστικό»

**Θέση:** Anti-marketing. Το site ξεκινάει σαν λήμμα λεξικού για τη λέξη «Φύλος» και ξεδιπλώνεται οριζόντια σαν φωτεινή αθηναϊκή γκαλερί.

Περπατάς (drag) ανάμεσα σε «τεκμήρια φροντίδας» σαν εκθέματα: το βιβλιάριο εμβολίων, μια σημείωση 03:40 «δεν έφαγε καλά σήμερα», η βόλτα της Τρίτης. Serif kinetic τυπογραφία, φως Αττικής, και τα screenshots της εφαρμογής εμφανίζονται μόνο στο τέλος, σαν αποκάλυψη.

Μηχανισμοί:
- Οριζόντια πλοήγηση με drag, σαν περίπατος σε γκαλερί.
- Kinetic serif τυπογραφία (variable font).
- Παράλλαξη βάθους στα τεκμήρια.
- Ετυμολογία της λέξης ως άνοιγμα («Φύλος, ο /ˈfi.los/ · 1. φίλος και φύλακας. 2. αυτός που θυμάται όσα αγαπάς, για σένα.»).

Γιατί κερδίζει: καμία pet εφαρμογή δεν μιλάει έτσι· τυπογραφική δεξιοτεχνία και πολιτισμική ταυτότητα («Designed in Athens»). Προσοχή στη μετάφραση του οριζόντιου σε mobile.

Πολυπλοκότητα ●●●○ · 4–5 εβδομάδες · Ρίσκο μέτριο (mobile, art direction).

---

## 5. Σύγκριση

| Κριτήριο | 01 · Η Τελεία | 02 · Μια μέρα μαζί | 03 · Φύλος, ουσιαστικό |
|---|---|---|---|
| Ιδέα-υπογραφή | Brand mark ως χαρακτήρας | Site με κιρκάδιο ρυθμό | Λεξικό και γκαλερί φροντίδας |
| Συναίσθημα | Παιχνιδιάρικο, έξυπνο | Ζεστό, κινηματογραφικό | Καλλιεργημένο, ποιητικό |
| Ρίσκο υλοποίησης | Χαμηλό | Μέτριο | Μέτριο |
| Performance | Άριστο (χωρίς WebGL) | Καλό | Καλό |
| Χρόνος ως award-ready | 3–4 εβδ. | 4–6 εβδ. | 4–5 εβδ. |
| Shareable στιγμή | «Μάθε στην τελεία ένα κόλπο» | «Δες το στις 11 το βράδυ» | Το λήμμα ως poster |

---

## 6. Πρόταση

**Concept 01 («Η Τελεία») ως βάση, με τη φωνή του 03.**

- Η Τελεία είναι ο πιο ownable μηχανισμός, με το χαμηλότερο ρίσκο και τον πιο καθαρό δρόμο προς Site of the Day.
- Από το 03 κρατάμε την editorial serif φωνή και το λήμμα «Φύλος, ο» ως άνοιγμα ή κλείσιμο.
- Από το 02 κρατάμε το κιρκάδιο φως ως φάση 2, όταν το site καθιερωθεί.

### Πλάνο υλοποίησης

1. **Κλείδωμα concept και motion tests** της τελείας (spring physics, morphs) σε απομονωμένο prototype.
2. **Copy και αρχιτεκτονική σελίδας** — αξιοποίηση του υλικού από `MARKETING_SHOWCASE_v1.jsx` (hero copy, waitlist, provenance) και `FYLOS_UX_COPY.md`.
3. **Build** πάνω στο υπάρχον stack (React + Vite + Tailwind + Framer Motion, προσθήκη GSAP + Lenis), ως ξεχωριστό web entry στο repo.
4. **Polish**: performance budget, a11y, prefers-reduced-motion, τρίγλωσσο EN/DE/FR (Ελληνικά ως easter egg στο λήμμα).
5. **Launch στο fylos.app** (Vercel, Cloudflare DNS κατά το tech brief) και υποβολή στα Awwwards + CSS Design Awards + FWA.

### Κόκκινες γραμμές (από το brand)

- Light surfaces only· ποτέ σκοτεινό hero. Coral το μοναδικό accent.
- Όχι photo-as-hero, όχι gradient AI-vibe CTAs, όχι πολύχρωμα grids.
- Sentence case, χωρίς emojis στο UI, το pet πάντα ονομάζεται.

---

# Προσθήκη 02 — «Ένα site, δύο αναγνώσεις» και ζωντανές λεπτομέρειες

Ημερομηνία: 2026-07-12 · Αφορμή: ιδέα του founder για διαχωρισμό απλού χρήστη / Pro.

## 1. Το dual-audience ως μηχανισμός-υπογραφή

Αρχή: ΟΧΙ δύο ξεχωριστά sites (διπλή συντήρηση, μισή ιστορία). Ένα site που **ξαναδιαβάζεται** ανάλογα με το ποιος είσαι:

- **Η τελεία ως διακόπτης.** Στην κορυφή, σέρνεις την coral τελεία αριστερά («Έχω έναν Φύλο») ή δεξιά («Είμαι ο Φύλος κάποιου»). Δεν είναι κουμπί — είναι το ίδιο το brand mark που αλλάζει ρόλο.
- **Kinetic rewrite, όχι reload.** Οι ίδιες προτάσεις ξαναγράφονται μπροστά σου: «Μην ξεχάσεις ποτέ ένα εμβόλιο» ⇄ «Μην χάσεις ποτέ μια κράτηση». Τα νούμερα αντιστρέφονται: ο owner βλέπει «2.400 βόλτες αυτή την εβδομάδα στη Ζυρίχη», ο pro «μέσος pro: CHF 400–900/μήνα».
- **View Transitions API** για το morph μεταξύ των δύο κόσμων, με την τελεία ως shared element (μοντέρνο API, το προσέχουν οι επιτροπές).
- **Δύο URLs, ένα site**: fylos.app και fylos.app/pro — shareable state, διαφορετικό OG image ανά mode.
- **Μνήμη.** Το site θυμάται την επιλογή (localStorage) και στην επόμενη επίσκεψη σε υποδέχεται αλλιώς. Οι κριτές επισκέπτονται τα sites πολλές φορές — θα το προσέξουν.

Τι βλέπει ο καθένας ανά section:

| Section | Owner | Pro |
|---|---|---|
| Hero | «Ο δεύτερος εγκέφαλος για τον Φύλο σου» | «Η δουλειά που αγαπάς, με σοβαρά εργαλεία» |
| Στατιστικό | Υπενθυμίσεις που δεν χάθηκαν, βόλτες κοντά σου | CHF 400–900/μήνα, % επαναλαμβανόμενοι πελάτες |
| Demo | Timeline υγείας του pet | Earnings dashboard + GPS check-in βόλτας |
| Ιστορίες | Ιστορίες κατοικιδίων | Ιστορίες pros («η Άννα, 14 τακτικοί πελάτες») |
| CTA | «Get early access» — 1.000 θέσεις | «Γίνε από τους πρώτους 100 pros στη Ζυρίχη» |

## 2. Ζωντανές λεπτομέρειες (ίδιο πνεύμα: το site ξέρει, θυμάται, ζει)

1. **Το waitlist ως 1.000 τελείες.** Όχι φόρμα — ένα πεδίο από 1.000 κουκκίδες που γεμίζουν. Γράφεσαι, η δική σου τελεία μπαίνει στη θέση της με το όνομα του pet σου στο hover. «Ο Leo είναι το νούμερο 341.» Πραγματικό scarcity (de-quieting §12), ορατό, shareable.
2. **Κάθε pet παίρνει δικό του URL.** fylos.app/leo → μίνι σελίδα «Ο Leo περιμένει τον Φύλο του · Νο 341» με dynamic OG image. Ο κόσμος μοιράζεται σελίδα του σκύλου του, όχι διαφήμισή μας. Viral μηχανισμός πριν καν υπάρξει app.
3. **Ο simulator εσόδων για pros.** Slider «πόσες βόλτες την εβδομάδα;» → «≈ CHF 640/μήνα», με ειλικρινή μαθηματικά (money as calm facts). Το πιο πειστικό pro-side στοιχείο.
4. **Καιρός + πόλη.** Αν βρέχει τώρα στη Ζυρίχη: «Βρέχει στη Ζυρίχη — οι Φύλοι προτιμούν παιχνίδι μέσα σήμερα» και διακριτική βροχή στο visual. Το site μοιάζει να ζει στην πόλη σου.
5. **Κιρκάδιος χαιρετισμός** (κρατάμε από Concept 02 ως λεπτομέρεια): καλημέρα/καλησπέρα, θερμοκρασία φωτός ανά ώρα.
6. **Scroll-λουρί.** Ο δείκτης προόδου είναι λουρί: η τελεία-pet τραβάει μπροστά όταν σκρολάρεις γρήγορα, σε περιμένει όταν αργείς.
7. **Πατουσιές στο idle.** 30" αδράνεια → μικρές πατουσιές διασχίζουν την οθόνη και οδηγούν στο CTA.
8. **Ελληνικά marginalia.** Χειρόγραφες σημειώσεις στο περιθώριο (Caveat), στα ελληνικά, που μεταφράζονται στο hover. Το «Designed in Athens» γίνεται απτό.
9. **Ηχητική υπογραφή.** Ένα και μόνο sound: το κουδουνάκι ταυτότητας κολάρου στο κλείσιμο του waitlist (opt-in, muted by default).
10. **Επιστροφή.** Δεύτερη επίσκεψη: «Καλώς ήρθες πίσω. Η θέση του Leo σε περιμένει ακόμα.»

## 3. Προτεραιοποίηση για v1

Must-have (award impact × κόστος): dual-lens με την τελεία-διακόπτη (1) · waitlist-1.000-τελείες (2) · pet URLs με dynamic OG (3) · earnings simulator (4) · κιρκάδιος χαιρετισμός (5).
Phase 2: καιρός/πόλη, ηχητική υπογραφή, marginalia, scroll-λουρί.
Πάντα: πατουσιές και μνήμη επιστροφής είναι φθηνά — μπαίνουν όποτε θέλουμε.

---

# Προσθήκη 03 — AI visualization prompts

Ημερομηνία: 2026-07-12 · Prompts για οπτικοποίηση του concept σε image AI πριν το build. Προτεινόμενα εργαλεία για UI με ευανάγνωστο κείμενο: Ideogram 3, Adobe Firefly, GPT-4o images. Το Midjourney βγάζει ωραία αισθητική αλλά χαλάει τα γράμματα (v7 --ar 16:9).

## Style block (κολλάει στο τέλος κάθε prompt)

> Style: Awwwards Site of the Day, premium minimal web design, Swiss editorial grid, generous whitespace, flat UI mockup, crisp typography, soft warm shadows, no photos, no illustrations, no gradients, no dark mode, no purple, no clutter.

## Prompt 1 — Hero, owner mode (η τελεία-διακόπτης)

> Website hero mockup for "Fylos", a premium pet-care app. Warm cream background #FBF7F2, ink text #111111, one coral accent #E85D2A. Top left: wordmark "FYLOS." in heavy rounded sans with a coral dot. Top center: a slim pill toggle where a coral dot sits on the left of two labels: "I have a Fylos" / "I am someone's Fylos". Center: huge editorial serif italic headline "Never forget a vaccine again." where the final period is a physical coral ball casting a soft warm shadow, as if a dog just dropped it. Below: small mono uppercase label "DESIGNED IN ATHENS · BUILT FOR ZURICH" and one quiet button "Get early access". 16:9.

## Prompt 2 — Hero, pro mode (ίδιο layout, άλλη ανάγνωση)

> Same website hero, same layout and cream background #FBF7F2, but the coral dot of the top toggle now sits on the right label "I am someone's Fylos". Headline rewritten in the same editorial serif italic: "Never miss a booking again." Next to it a small clean stat card: "Pros in Zürich earn CHF 400–900/month" with a tiny coral sparkline. Button: "Join the first 100 pros". Everything else identical, so the two images read as one site re-reading itself. 16:9.

## Prompt 3 — Το waitlist ως 1.000 τελείες

> Minimal website section on cream #FBF7F2: a large field of 1,000 tiny dots arranged in an organic grid, most dots hollow (outline peach #FFD4BD), 341 of them filled coral #E85D2A. One filled dot is highlighted with a small tooltip card: "Leo · No 341". Serif italic heading above: "1,000 places. 341 taken." Small mono caption: "ZURICH FIRST · ONE UPDATE PER MONTH, NO SPAM". 16:9.

## Prompt 4 — Full-page scroll (το ταξίδι της τελείας)

> Full-length website screenshot, long vertical scroll, for premium pet-care app "Fylos". Cream #FBF7F2 and soft peach #FFE9DC alternating sections, ink text, single coral accent #E85D2A. The same coral dot travels down the page transforming: a ball in the hero, a pin on a minimal walk map, a pulse point on a weight chart, a notification dot on a vaccine reminder card, and finally the period of the closing tagline "Stress less. Fylos more." Editorial serif italic headlines, clean sans body, small mono labels, one phone mockup near the end. 9:16 tall.

## Tips

- Δώσε τα hex codes ΠΑΝΤΑ (αλλιώς το coral γίνεται κόκκινο ή πορτοκαλί neon).
- Ζήτα δύο γενιές του Prompt 1+2 μαζί για να δεις το «rewrite» σαν δίπτυχο.
- Ό,τι βγει είναι μόνο mood — το κινητικό κομμάτι (spring physics, morph, rewrite) θα το δείξει μόνο το code prototype.

---

# Προσθήκη 04 — 10 κατευθύνσεις, 10 διαφορετικά design (με AI prompts)

Ημερομηνία: 2026-07-12 · Ο founder ζήτησε 10 ιδέες με διαφορετικό design η καθεμία, συν image prompt ανά ιδέα για mood εικόνες πριν το build. Σημείωση: οι 05 και 10 σπάνε συνειδητά κανόνες του brand book (φωτογραφία/σκούρο φόντο) — επιτρεπτό στη φάση εξερεύνησης.

01 Το Νήμα — όλο το site το σχεδιάζει μία συνεχής coral γραμμή (λουρί → σκύλος → underline → καρδιογράφημα → διαδρομή). Line-art minimal.
02 Ο Φάκελος — το site ως ιατρικός φάκελος/ντοσιέ σε γραφείο: καρτέλες, σφραγίδες, polaroid, συνδετήρες. Tactile paper design.
03 Η Γειτονιά — μινιατούρα 3D γειτονιά της Ζυρίχης (πάρκο, κτηνίατρος, τραμ), scroll = βόλτα μέσα της. Clay/diorama WebGL.
04 Η Εφημερίδα — «The Daily Fylos: Good news only», πρωτοσέλιδο με τις μικρές νίκες του pet σου. Broadsheet typography + coral spot color.
05 Το Χρώμα — ασπρόμαυρος κόσμος που γεμίζει χρώμα εκεί που περνάει η φροντίδα. Cinematic duotone-to-color.
06 Ο Καθρέφτης — split-screen: αριστερά η μέρα του ανθρώπου, δεξιά η ίδια στιγμή από τα μάτια του σκύλου· sync scroll, ενώνονται στο τέλος.
07 Το Κοινό Κατοικίδιο — ένας ζωντανός χαρακτήρας («Filo») που τον φροντίζουν ΟΛΟΙ οι επισκέπτες μαζί, real-time. Multiplayer playful stage.
08 Μια Ολόκληρη Ζωή — ένα scroll = 15 χρόνια ζωής, από κουτάβι σε γκρίζο μουσούδι, μέσα από εποχές. Watercolor emotional scrollytelling.
09 Swiss Blueprint — «Η ανατομία της καλής φροντίδας»: ο σκύλος ως τεχνικό σχέδιο ακριβείας με διαστάσεις και annotations. Ultra-Swiss grid.
10 Το Πορτρέτο από Δεδομένα — γράφεις το όνομα του pet και η ζωή του γίνεται generative πορτρέτο από σωματίδια (βόλτες, χτύποι καρδιάς). Art poster, shareable.

Τα πλήρη prompts ανά ιδέα δόθηκαν στο chat της 2026-07-12 (ίδια δομή με Προσθήκη 03: hex codes, 16:9, εργαλεία Ideogram/Firefly/GPT-4o).

---

# Προσθήκη 05 — Δεύτερη δεκάδα κατευθύνσεων (11–20, με AI prompts)

Ημερομηνία: 2026-07-12 · Συνέχεια της Προσθήκης 04: 10 νέες, διαφορετικές μεταξύ τους και από τις 01–10.

11 Η Ταινία — το site ως ταινία Wes Anderson: συμμετρικά παστέλ καρέ, τίτλοι αρχής, «FYLOS presents». Scroll = σκηνές της ταινίας.
12 FylosOS — το site ως ρετρό λειτουργικό σύστημα: παράθυρα, dock, pop-up υπενθυμίσεις· ο επισκέπτης «ανοίγει» τα αρχεία της ζωής του pet.
13 Οι Κάρτες — αρχέτυπα κατοικιδίων σε engraved κάρτες τύπου ταρώ («The Guardian», «The Explorer»)· quiz «ποιος Φύλος ζει μαζί σου;», τραβάς την κάρτα σου, τη μοιράζεσαι.
14 Η Συνταγή — «Recipe for a happy dog» σε ύφος Kinfolk cookbook: υλικά (2 βόλτες, 1 εμβόλιο στην ώρα του, 40 χάδια), βήματα, πιάτο ημέρας.
15 Το Άλμπουμ με Αυτοκόλλητα — glossy puffy stickers που ξεκολλάνε με τον κέρσορα· συλλέγεις αυτοκόλλητα όσο σκρολάρεις, γεμίζεις τη σελίδα σου.
16 Ο Χάρτης του Μετρό — η ζωή του pet ως χάρτης συγκοινωνιών: γραμμή Υγείας, γραμμή Βόλτας, γραμμή Φίλων — όλες συναντιούνται στον σταθμό «FYLOS».
17 Το Παιχνίδι — ρετρό φορητή κονσόλα: pixel-art βόλτα, «CARE LVL 12», «PRESS START»· η φροντίδα ως το πιο ανταποδοτικό παιχνίδι.
18 Το Πικάπ — «Sounds of a happy home»: δίσκος βινυλίου με tracks τους ήχους του σπιτιού (πρωινά ζουμ, βροχή στο τζάμι, ο ύπνος)· sound-first site.
19 Ο Κήπος — botanical herbarium: κάθε συνήθεια είναι σπόρος που ανθίζει όσο σκρολάρεις· «Η φροντίδα είναι κήπος. Πότιζέ τον καθημερινά.»
20 Τα Γράμματα — γράμματα από τον σκύλο στον άνθρωπό του («Αγαπητέ άνθρωπε, σήμερα θυμήθηκες το χάπι μου. Το πρόσεξα.»)· generator «γράμμα από το pet σου» για share.

Πλήρη prompts στο chat της 2026-07-12, ίδια δομή με πριν (hex, ύφος, 16:9, εργαλεία Ideogram/Firefly/GPT-4o).

---

# Προσθήκη 06 — Shortlist του founder και προτεινόμενη σύνθεση

Ημερομηνία: 2026-07-12 · Feedback στον κατάλογο των 20.

## Shortlist

- Αγαπημένα: 03 Η Γειτονιά (3D), 11 Η Ταινία (Wes Anderson scroll).
- Άρεσαν: 07 Το Κοινό Κατοικίδιο, 12 FylosOS, 17 Το Παιχνίδι.
- Δευτερεύοντα: 05 Το Χρώμα, 10 Το Πορτρέτο από Δεδομένα (άρεσε το share/UGC σκέλος).
- Κοινό νήμα: κόσμοι-που-μπαίνεις-μέσα, παιχνίδι, ζεστασιά, κινηματογραφικότητα. Όχι αυστηρός τυπογραφικός μινιμαλισμός.

## Πρόταση σύνθεσης: «FYLOS presents: The Neighborhood»

Ραχοκοκαλιά η Ταινία (11), σκηνικά η Γειτονιά (03), σε αισθητική μινιατούρας/film set (βλ. Isle of Dogs — Wes Anderson με σκύλους και μακέτες, το τέλειο reference για εμάς):

- Το site είναι μια «ταινία» που τη σκρολάρεις: letterbox, τίτλοι αρχής «FYLOS presents», το scroll είναι η κάμερα που κάνει dolly μέσα από σκηνικά-διοράματα της γειτονιάς (πάρκο, κτηνίατρος, σπίτι, τραμ).
- Κάθε σκηνή = ένα feature τη στιγμή που έχει νόημα (βόλτα/walker στο πάρκο, υπενθυμίσεις στον κτηνίατρο, ημερολόγιο στο σαλόνι).
- Ο «Filo» (από το 07) είναι ο πρωταγωνιστής που περπατά από σκηνή σε σκηνή. Το live/κοινοτικό layer (όλοι φροντίζουν τον Filo real-time) πάει Phase 2 για να μη φουσκώσει το v1.
- Το 17 γίνεται easter egg: μέσα σε ένα σκηνικό υπάρχει μια μικρή τηλεόραση/κονσόλα όπου παίζεις 20 δευτερόλεπτα pixel βόλτα.
- Το 10 γίνεται το φινάλε: «Κάνε το δικό σου pet πρωταγωνιστή» — γράφεις όνομα, βγαίνει το film poster / credits card του pet σου για share (το UGC σκέλος που άρεσε).
- Το 05 γίνεται τεχνική μίας σκηνής: μια στιγμή όπου το πλάνο είναι γκρι και η φροντίδα επαναφέρει το χρώμα.

## Ρεαλισμός υλοποίησης

- Full WebGL 3D κόσμος (καθαρό 03): το πιο εντυπωσιακό, αλλά και το πιο ακριβό/αργό (3D assets, mobile perf). 6–10 εβδομάδες, θέλει σοβαρό asset pipeline.
- Προτεινόμενο μονοπάτι: 2.5D κινηματογραφικό — σκηνικά ως pre-rendered 3D εικόνες/βίντεο (Blender ή AI-assisted) με parallax layers και scroll-driven camera. Κρατάει το 90% της αίσθησης στο 40% του κόστους, άψογο σε κινητό. Hero scene μπορεί αργότερα να γίνει real-time 3D.
- 12 FylosOS: δεν προκρίνεται ως κύριο (ρετρό-tech αισθητική μακριά από το ζεστό premium brand, και πατημένο μονοπάτι — poolside.fm κ.λπ.). Στοιχεία του μπορούν να ζήσουν ως σκηνή («το γραφείο»).

## Επόμενο βήμα

Motion prototype μίας σκηνής (scroll = dolly σε διόραμα με letterbox και τίτλους) για να κριθεί η αίσθηση πριν την πλήρη παραγωγή.

---

# Προσθήκη 07 — «FYLOS presents»: Το storyboard των 5 σκηνών

Ημερομηνία: 2026-07-12 · Απόφαση founder: βάση το Concept 11 (Η Ταινία), ΧΩΡΙΣ θεματική Ζυρίχης — παγκόσμια, οικουμενικά σκηνικά (σπίτι, πάρκο, κτηνίατρος). Αισθητική: Wes Anderson μινιατούρα/film set, παστέλ + cream, με το coral #E85D2A ως νήμα σε κάθε σκηνή (το μπαλάκι εμφανίζεται κρυμμένο παντού — easter egg εύρεσης).

Δομή site = δομή ταινίας. Scroll = κάμερα (dolly). Letterbox σταθερό. Κάθε σκηνή ένα feature τη στιγμή που έχει νόημα.

- Σκηνή 1 «Το Σαλόνι» (hero/τίτλοι): συμμετρικό σαλόνι, ο σκύλος στο κέντρο σε σκαμπό, τίτλοι «FYLOS presents — The Story of a Very Good Boy». Εδώ: όνομα του pet → η ταινία γίνεται δική του.
- Σκηνή 2 «Ο Διάδρομος του Χάους» (το πρόβλημα): διάδρομος με τοίχο γεμάτο καρφιτσωμένα χαρτιά εμβολίων, post-it, φακέλους κτηνιάτρου — τακτοποιημένο χάος α λα Anderson. Εδώ: «Η ζωή του είναι σκόρπια παντού» → μετάβαση στο app.
- Σκηνή 3 «Το Πάρκο» (βόλτες & services): οικουμενικό πάρκο — σιντριβάνι, στρογγυλά δέντρα, παγκάκια — dog walker με λουριά, χρυσό απογευματινό φως. Εδώ: κράτηση βόλτας, GPS check-in, playdates.
- Σκηνή 4 «Ο Κτηνίατρος» (υγεία): παστέλ αίθουσα αναμονής, συμμετρικές καρέκλες, «οπτότυπο για σκύλους» στον τοίχο. Εδώ: health records, υπενθυμίσεις εμβολίων, document vault.
- Σκηνή 5 «Η Νύχτα» (μνήμες & φινάλε): βράδυ, ο σκύλος κοιμάται στα πόδια του κρεβατιού, αναμμένο πορτατίφ, ανοιχτό ημερολόγιο, φεγγάρι στο παράθυρο. Εδώ: journal, «Stress less. Fylos more.», τίτλοι τέλους με τα ονόματα του waitlist + generator «κάνε το pet σου πρωταγωνιστή» (poster για share).

Prompts ανά σκηνή δόθηκαν στο chat (κοινό style block για συνέπεια μεταξύ των 5 εικόνων· ίδια εργαλεία όπως πριν). Επόμενο βήμα μετά την έγκριση εικόνων: motion prototype της Σκηνής 1 (scroll-dolly, letterbox, τίτλοι).

---

# Προσθήκη 08 — Camera test: 5 αισθητικές για την «ταινία»

Ημερομηνία: 2026-07-12 · Η θεματολογία κλείδωσε (site = ταινία, οικουμενικά σκηνικά). Πριν τα storyboards, επιλογή σχεδίου/αισθητικής: 5 «κινηματογραφικές γλώσσες», όλες δοκιμασμένες στο ΙΔΙΟ καρέ (σαλόνι/hero) για δίκαιη σύγκριση.

A. Η Μακέτα — stop-motion μινιατούρα (Wes Anderson): αληθινά υλικά, τέλεια συμμετρία, tilt-shift. Web: pre-rendered σκηνές + parallax. Αίσθηση: συλλεκτική, χειροποίητη, meticulous.
B. Το Ζωγραφισμένο — χειροποίητο 2D animation (watercolor, ζωγραφιστά backgrounds, χρυσό φως). Web: layered ζωγραφιές με πολύ ομαλό parallax, ελαφρύτατο. Αίσθηση: τρυφερή, παραμυθένια, διαχρονική.
C. Η Πλαστελίνη — claymation με δαχτυλιές (Aardman ύφος): χοντροκομμένη γοητεία, χιούμορ. Web: stop-motion loops (12fps) ως video textures. Αίσθηση: αστεία, ανθρώπινη, αξέχαστη.
D. Το Χάρτινο Θέατρο — paper cutout σκηνή: στρώσεις χαρτονιού, μαριονέτες, ραφές ορατές. Web: η ΚΑΛΥΤΕΡΗ μετάφραση σε parallax (κάθε στρώση χαρτί = layer)· φθηνό, γρήγορο, δικό μας. Αίσθηση: εφευρετική, ζεστή, DIY-premium.
E. Το Σύγχρονο 3D — soft CG render (Pixar-like φως, καθαρές φόρμες): το «3D» που άρεσε στον founder, σε film ένδυμα. Web: pre-rendered πλάνα, αργότερα real-time hero. Αίσθηση: μεγάλη παραγωγή, διεθνής, λαμπερή.

Πλήρη prompts στο chat (ίδιο καρέ σαλονιού, ίδια στοιχεία: σκύλος στο κέντρο, coral μπαλάκι #E85D2A, letterbox «FYLOS presents»). Μετά την επιλογή: αναπαραγωγή των 5 σκηνών (Προσθήκη 07) στη νικήτρια αισθητική.

---

# Προσθήκη 09 — Απόφαση: Αισθητική E (Σύγχρονο 3D) · Παραδοτέα build

Ημερομηνία: 2026-07-12 · Ο founder κλείδωσε την αισθητική E για το concept «FYLOS presents».

Παραδοτέα σε αυτό το branch:
1. `FYLOS_WEBSITE_ASSET_PROMPTS.md` — πλήρες production plan Higgsfield (character sheet, 5 σκηνές image+video, transitions, OG, poster, pro frame) με ονοματολογία αρχείων.
2. `FYLOS_WEBSITE_PAGE_DESIGN_GR.md` — σχέδιο σελίδας scroll-προς-scroll (σκηνές ↔ πράξεις).
3. `src/screens/WEBSITE_FILM_v1.jsx` + route `/website` — το site υλοποιημένο: sticky cinema scenes με letterbox και scroll-dolly, personalization ονόματος pet (και μέσω `?pet=`), acts με features/pros/earnings slider/health, FIN με rolling credits + waitlist + poster share, FAQ, footer. CSS placeholders μέχρι να μπουν τα renders στο `public/film/`.
4. `public/film/README.md` — οδηγίες ονομάτων αρχείων για τα assets.

Εκκρεμότητα εκτός repo: εξουσιοδότηση Higgsfield connector στο claude.ai για να τρέξει η παραγωγή των assets· σύνδεση waitlist form με backend/Resend πριν το launch.
