# Handoff prompt για νέο session (παραγωγή assets με Higgsfield)

Copy-paste το παρακάτω σε νέο Claude session πάνω στο repo ignizzzz/fylos-app:

---

Γεια! Συνεχίζουμε δουλειά που έγινε σε προηγούμενο session. Το πλήρες context:

ΤΙ ΕΙΝΑΙ ΤΟ PROJECT: Το Fylos είναι premium pet-care companion app («ο δεύτερος εγκέφαλος για pet parents») με brand: cream #FBF7F2, coral #E85D2A, ink #111111, ζεστό minimal ύφος. Φτιάχνουμε το marketing site (fylos.app) με στόχο βραβείο στα Awwwards.

ΤΙ ΕΧΕΙ ΑΠΟΦΑΣΙΣΤΕΙ: Το concept του site είναι «FYLOS presents» — το site είναι μια ΤΑΙΝΙΑ που τη σκρολάρεις. 5 σκηνές σαν καρέ ταινίας (letterbox, scroll = dolly κάμερας) εναλλάσσονται με κανονικές ενότητες startup (features, for pros, waitlist, FAQ). Η αισθητική που κλείδωσε: ΣΥΓΧΡΟΝΟ SOFT 3D ANIMATION (Pixar-like φως, στρογγυλεμένες φόρμες, παστέλ + ένα coral accent) — ΟΧΙ Ζυρίχη/πόλεις, οικουμενικά σκηνικά (σπίτι, πάρκο, κτηνίατρος). Πρωταγωνιστής: μικρός cream σκύλος με coral κολάρο, και σε ΚΑΘΕ σκηνή κρύβεται ένα coral μπαλάκι #E85D2A.

ΤΙ ΥΠΑΡΧΕΙ ΗΔΗ ΣΤΟ REPO (branch: claude/website-design-concepts-fwtqe6):
- Το site είναι ΧΤΙΣΜΕΝΟ στο route /website (src/screens/WEBSITE_FILM_v1.jsx) με έτοιμες υποδοχές assets: ψάχνει αρχεία στο public/film/ με συγκεκριμένα ονόματα, και μέχρι να υπάρξουν δείχνει CSS placeholders.
- FYLOS_WEBSITE_ASSET_PROMPTS.md: ΟΛΑ τα prompts παραγωγής, έτοιμα, με global style block, σειρά εκτέλεσης και ονοματολογία.
- public/film/README.md: τα ακριβή ονόματα αρχείων που περιμένει το site.
- FYLOS_WEBSITE_PAGE_DESIGN_GR.md: το σχέδιο της σελίδας scroll-προς-scroll.

ΟΙ 5 ΣΚΗΝΕΣ (η ιστορία): 1) «Το Σαλόνι» — hero, ο σκύλος στο κέντρο συμμετρικού σαλονιού, τίτλοι «FYLOS presents». 2) «Ο Διάδρομος του Χάους» — τοίχοι γεμάτοι καρφιτσωμένα χαρτιά εμβολίων/σημειώσεις (το πρόβλημα: η ζωή του pet σκόρπια παντού). 3) «Το Πάρκο» — χρυσό απόγευμα, dog walker με τρία λουριά, σιντριβάνι. 4) «Ο Κτηνίατρος» — mint αίθουσα αναμονής, οπτότυπο από κόκαλα. 5) «Η Νύχτα» — ο σκύλος κοιμάται, ανοιχτό ημερολόγιο, φεγγάρι.

ΤΙ ΘΕΛΩ ΝΑ ΚΑΝΕΙΣ ΤΩΡΑ (με το Higgsfield MCP, είναι συνδεδεμένο):
1. Διάβασε το FYLOS_WEBSITE_ASSET_PROMPTS.md και ακολούθησέ το ΚΑΤΑ ΓΡΑΜΜΑ (prompts, ratios, ονόματα).
2. Παρήγαγε πρώτα το A0 (character sheet του σκύλου) και δείξε μου το για έγκριση πριν προχωρήσεις.
3. Μετά την έγκριση: A1-A5 keyframe εικόνες (16:9, με το A0 ως reference για συνέπεια χαρακτήρα), δείξε μου τες, και μετά τα αντίστοιχα βίντεο με image-to-video από κάθε keyframe (6-8s, loopable, ΧΩΡΙΣ κίνηση κάμερας — το dolly το κάνει το scroll του site).
4. Κατέβασε τα αρχεία και βάλε τα στο public/film/ με τα ακριβή ονόματα: scene-01.jpg/scene-01.mp4 έως scene-05.jpg/scene-05.mp4 (και προαιρετικά og.jpg, ball.webm, poster-blank.jpg, pro.jpg).
5. Commit + push στο branch claude/website-design-concepts-fwtqe6.
6. Τρέξε το site (npm run dev, route /website) και δείξε μου screenshots με τα πραγματικά assets.

Global style block για κάθε prompt (υπάρχει και στο αρχείο): "Modern 3D animated film still, big-studio animation quality, soft global illumination like golden hour, rounded stylized forms, gentle subsurface materials, cinematic depth of field, pastel palette of cream #FBF7F2, powder pink and mint with a single coral accent #E85D2A, warm and premium, 16:9."

Αν κάτι δεν βγαίνει καλά (π.χ. ο χαρακτήρας αλλάζει μεταξύ σκηνών), προτίμησε ξαναγέννημα με το A0 ως reference αντί να δεχτείς ασυνέπεια. Ποιότητα πάνω από ταχύτητα — πάμε για Awwwards.

---
