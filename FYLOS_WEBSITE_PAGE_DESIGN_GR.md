# Fylos Website — Σχέδιο σελίδας scroll-προς-scroll

Ημερομηνία: 2026-07-12 · Concept: «FYLOS presents» (site = ταινία) · Αισθητική: E — Σύγχρονο 3D.
Υλοποίηση: `src/screens/WEBSITE_FILM_v1.jsx` · Route: `/website` · Assets: `public/film/` (βλ. FYLOS_WEBSITE_ASSET_PROMPTS.md).
Γλώσσα site: EN (βάση brand)· DE/FR σε φάση i18n.

Αρχή σχεδίασης: οι 5 «σκηνές» είναι σινεμά (sticky viewport, letterbox, dolly με το scroll)· ανάμεσά τους οι «πράξεις» είναι κανονικές ενότητες startup site (features, pros, FAQ, waitlist) ώστε το site να ενημερώνει ΚΑΙ να εντυπωσιάζει. Ο επισκέπτης εναλλάσσεται: σκηνή → πληροφορία → σκηνή.

## Χάρτης scroll

0. **Nav** (fixed): FYLOS. αριστερά · The film / Features / For pros / FAQ · CTA «Get early access». Διακριτικό, blur φόντο.

1. **ΣΚΗΝΗ 1 — «Το Σαλόνι» (hero)** · asset scene-01
   - Sticky οθόνη, letterbox μπάρες πάνω/κάτω, ελαφρύ dolly-in (scale 1.06→1) καθώς μπαίνεις.
   - Τίτλοι πάνω στη σκηνή: «FYLOS presents» (small caps, mono) → «The Story of a Very Good Boy» (serif italic, μεγάλο).
   - **Personalization:** πεδίο «Or better: the story of ______» — γράφεις το όνομα του pet, ο τίτλος ξαναγράφεται ζωντανά («The Story of Leo»), αποθηκεύεται (localStorage) και όλο το site μιλάει για εκείνον. Οι κριτές το λατρεύουν, το προϊόν το επιβάλλει (το pet πάντα ονομάζεται).
   - Scroll hint: «Scroll to roll the film».

2. **ΠΡΑΞΗ I — Το πρόβλημα** (content, cream)
   - Kicker «CHAPTER ONE — The scattered years».
   - Copy: «Vaccines in a drawer. Photos in three apps. The vet's advice in your head.» + σκόρπιες «χάρτινες» κάρτες που μαζεύονται σε μία καθώς σκρολάρεις.

3. **ΣΚΗΝΗ 2 — «Ο Διάδρομος του Χάους»** · asset scene-02 · caption: «Their life is scattered everywhere.»

4. **ΠΡΑΞΗ II — Το app** (content, λευκό)
   - «One place for everything that matters»: 3 κάρτες — Health records & reminders · Weight tracking · Document vault — δίπλα σε phone mockup (CSS) με timeline «Today».
   - Μικρή γραμμή αξιοπιστίας: «Built in the EU · GDPR native · Your data is yours».

5. **ΣΚΗΝΗ 3 — «Το Πάρκο»** · asset scene-03 · caption: «CHAPTER TWO — The walk».

6. **ΠΡΑΞΗ III — Services & κοινότητα** (content, peach)
   - Booking βόλτας/φύλαξης με vetted pros, live GPS walk, playdate matching, community safety map.
   - **For pros υπο-ενότητα** («Are you someone's Fylos?»): earnings slider — βόλτες/εβδομάδα → «≈ CHF …/month», ήρεμα νούμερα, CTA «Join the first 100 pros».

7. **ΣΚΗΝΗ 4 — «Ο Κτηνίατρος»** · asset scene-04 · caption: «CHAPTER THREE — The check-up».

8. **ΠΡΑΞΗ IV — Υγεία σε βάθος** (content, λευκό)
   - Vaccine schedule με έξυπνες υπενθυμίσεις · emergency card · telehealth · «never again "I'll check and call you back"».

9. **ΣΚΗΝΗ 5 — «Η Νύχτα»** · asset scene-05 · caption: «CHAPTER FOUR — The quiet hours» (journal, μνήμες).

10. **FIN — Credits & Waitlist** (ink φόντο — η μόνη σκούρα στιγμή, δικαιολογημένη ως «τέλος ταινίας»)
    - «Stress less. Fylos more.» με coral τελεία.
    - **Rolling credits:** κυλούν ονόματα pets του waitlist — το δικό σου πρώτο («LEO as The Very Good Boy»).
    - Waitlist form: email + pet name → «You're on the list. One update per month, no spam.» (TODO: σύνδεση backend/Resend).
    - **Poster generator:** «Make your pet the star» — κάρτα-αφίσα με το όνομα του pet για share/download (v1: preview, v2: dynamic OG).

11. **FAQ** (cream): launch πότε/πού · πλατφόρμες · τιμή · δεδομένα/GDPR · πώς μπαίνει pro · ποιες πόλεις.

12. **Footer**: wordmark, «Designed in Athens. Built for the world.», links, socials, legal, © 2026.

## Τεχνικά

- Stack: υπάρχον (React 18 + Vite + Tailwind + framer-motion). Sticky scenes με useScroll/useTransform. `useReducedMotion` → όλα λειτουργούν χωρίς animation.
- **Asset slots:** κάθε σκηνή ψάχνει `/film/scene-0X.mp4` (poster `/film/scene-0X.jpg`). Αν λείπει → όμορφο CSS placeholder με label· μόλις πέσουν τα αρχεία στο `public/film/`, το site τα παίζει χωρίς αλλαγή κώδικα.
- Letterbox: ink μπάρες μέσα στο sticky frame κάθε σκηνής.
- Performance: lazy videos (`preload="none"` εκτός scene-01), ένα μόνο βίντεο ενεργό κάθε φορά (IntersectionObserver-based play/pause), στόχος LCP < 2.5s.
- Awwwards checklist: signature mechanic (film-scroll) ✓ · personalization ✓ · craft τυπογραφίας ✓ · sound (φάση 2: προαιρετικό ambient ανά σκηνή, muted default) · a11y/reduced-motion ✓ · shareable (poster generator) ✓.

---

# v2 — Συνεχής ταινία (απόφαση founder 2026-07-12)

Το site ΔΕΝ εναλλάσσει πλέον σκηνές με ξεχωριστές λευκές ενότητες («κενά»). Όλη η ταινία είναι ΕΝΑ καρφιτσωμένο καρέ (~1300vh scroll):

- Οι 5 σκηνές κάνουν cross-dissolve η μία μέσα στην άλλη — καμία διακοπή, το letterbox δεν σπάει ποτέ.
- Το περιεχόμενο (features, pro earnings slider, health cards) αιωρείται ΠΑΝΩ στο πλάνο ως parallax overlays (cream glass κάρτες, διαφορετικές ταχύτητες), δεμένο με το κεφάλαιο που παίζει.
- Το coral μπαλάκι είναι το νήμα συνέχειας: HTML στοιχείο που ταξιδεύει σε όλη τη διαδρομή, από σκηνή σε σκηνή.
- FIN μέσα στην ταινία: σκοτείνιασμα, tagline, rolling credits, CTA. Μετά τους τίτλους: «After the credits» waitlist (ίδιο σκούρο φόντο — αδιάκοπη ροή), FAQ, footer.
- Υλοποίηση: route `/website` → WEBSITE_FILM_v2.jsx (useScroll global progress + useSpring crossfades — τα springs δίνουν και το βελούδινο, κινηματογραφικό feel). Το v1 κρατήθηκε στο `/website-v1` για σύγκριση.

## v2.1 — Award polish layer (brief founder: premium immersive, warm, όχι crypto)

- Oversized editorial serif statements πάνω στο footage (αντί για μικρές κάρτες) ανά κεφάλαιο.
- Interactive product demos δεμένα στο scroll: PhoneDemo (τα events της ημέρας «τσεκάρονται» καθώς κατεβαίνεις), RouteDemo (η GPS διαδρομή ζωγραφίζεται, χιλιόμετρα μετρούν live), StampCard (η σφραγίδα «Done · 3 days early» πέφτει στο vaccination record).
- Kinetic intertitles: τεράστιοι serif τίτλοι («The walk», «The check-up»…) διασχίζουν το καρέ στα όρια των κεφαλαίων.
- Cinematic film grain (SVG turbulence, respects reduced-motion) + timecode 00:00/02:10 + coral progress reel με chapter ticks στο κάτω letterbox.
- 3D cursor tilt σε όλες τις floating κάρτες.
- Media fallback αλυσίδα: video → keyframe jpg → CSS placeholder (browser χωρίς H.264 βλέπει την ταινία σε στατικά καρέ).
- Assets: παραδόθηκαν από το production session (Higgsfield: Nano Banana Pro stills + Kling 3.0 Turbo i2v), εγκεκριμένα και στα δύο gates, ζωντανά στο /website.
