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

---

# English version (for the new session)

---

Hi! You are continuing work that was planned in a previous session. Full context below — then execute.

## What this project is

Fylos is a premium pet-care companion app ("the second brain for pet parents"). Brand: cream #FBF7F2, coral #E85D2A, ink #111111, warm minimal, editorial serif accents. We are building the marketing website (fylos.app) with the explicit goal of winning at Awwwards (Site of the Day and beyond). This is the company's first public advertisement.

## The locked creative direction

The website is a FILM you scroll through: "FYLOS presents". Five cinematic scenes (letterbox bars, scroll acts as a camera dolly) alternate with normal startup sections (features, for pros, waitlist, FAQ). Locked aesthetic: MODERN SOFT 3D ANIMATION — big-studio quality, Pixar-like golden-hour lighting, rounded stylized forms, pastel palette (cream, powder pink, mint) with a single coral accent #E85D2A. Universal settings only (home, park, vet clinic) — no city-specific theming. The recurring protagonist is a small cream dog with a coral collar, and a coral ball #E85D2A is hidden somewhere in EVERY scene (a brand thread and a visitor easter egg).

## What already exists in the repo (branch: claude/website-design-concepts-fwtqe6)

- The website is BUILT at route /website (src/screens/WEBSITE_FILM_v1.jsx). It has sticky cinema scenes with letterbox + scroll dolly, pet-name personalization (the visitor types their pet's name and the whole film rewrites for it, also via ?pet= URL), acts with features / pro earnings slider / health, a finale with rolling credits + waitlist + poster share, FAQ and footer. Each scene has an ASSET SLOT: it looks for files in public/film/ by exact name and shows a styled CSS placeholder until the file exists. Dropping in the files upgrades the site with zero code changes.
- FYLOS_WEBSITE_ASSET_PROMPTS.md — the complete production plan: every generation prompt, the global style block, aspect ratios, video specs, execution order, file naming. This file is the source of truth: follow it to the letter.
- public/film/README.md — the exact filenames the site expects.
- FYLOS_WEBSITE_PAGE_DESIGN_GR.md — the scroll-by-scroll page design (in Greek).

## Step 0 — Higgsfield connection

First verify the Higgsfield MCP tools are available (e.g. generate_image, generate_video). If they are not, stop and tell me to authorize the Higgsfield connector at claude.ai → Settings → Connectors → Higgsfield → Connect (I will log in there myself — never ask me for tokens or codes), then continue once it is connected.

## What to create in Higgsfield (in this order)

1. A0 — Character sheet of the dog (front / three-quarter / side, cream fur, coral collar, big warm amber eyes, floppy ears). Generate it FIRST and SHOW ME for approval before anything else. This image is the identity reference for every other asset.
2. After my approval: A1–A5 — the five scene KEYFRAMES as 16:9 images, using A0 as the character/image reference so the dog is identical everywhere:
   - Scene 1 "The Living Room" (hero): symmetric living room, dog centered on a round rug, golden-hour windows, coral ball beside it.
   - Scene 2 "The Hallway of Chaos": narrow corridor, walls covered in neatly pinned paper chaos (vaccination cards, sticky notes, vet letters), dog in the middle, glowing coral doorway at the end.
   - Scene 3 "The Park": round fountain, spherical trees, a friendly dog-walker holding three leashes, golden afternoon, coral ball floating in the fountain.
   - Scene 4 "The Vet": mint waiting room, row of identical chairs with the dog in the center seat, bone-shaped eye chart, card-catalog cabinet, nurse at the desk, coral ball in a toy basket.
   - Scene 5 "The Night": cozy bedroom at night kept warm, dog asleep at the foot of the bed, open journal on the nightstand, pastel moon in a round window, coral ball beside the dog.
   Show me all five keyframes for approval.
3. After approval: the five VIDEOS via image-to-video, each using its keyframe as input. 6–8 seconds, seamless loop, GENTLE ambient motion only (breathing, blinking, tail wag, drifting dust, shimmering water, falling paper) and STRICTLY NO CAMERA MOVEMENT — the scroll of the website is the camera.
4. The connectors/extras: ball.webm (a glossy coral ball rolling left-to-right across a plain cream floor, ~3s — used as a chapter transition), og.jpg (1200×630 share image from the Scene 1 frame with the film title), poster-blank.jpg (2:3 movie-poster background for the "make your pet the star" generator), pro.jpg (the dog-walker character hero frame for the For Pros section). Exact prompts for all of these are in FYLOS_WEBSITE_ASSET_PROMPTS.md.

## How it becomes the website

1. Download every generated file and place it in public/film/ with these EXACT names: scene-01.jpg + scene-01.mp4 … scene-05.jpg + scene-05.mp4, plus ball.webm, og.jpg, poster-blank.jpg, pro.jpg. The site picks them up automatically.
2. Commit and push to branch claude/website-design-concepts-fwtqe6 (git push -u origin claude/website-design-concepts-fwtqe6).
3. Run the site (npm install && npm run dev, port 3000) and open /website. Verify every scene plays its loop, the letterbox titles read correctly, and the placeholders are gone. Send me screenshots (desktop 1440px and mobile 390px, hero + at least two scenes + finale).
4. If any scene drifts off-model (character looks different, palette shifts, camera moved), REGENERATE with A0 as reference instead of accepting it. Quality over speed — this site is going to Awwwards.

## Rules

- Follow FYLOS_WEBSITE_ASSET_PROMPTS.md verbatim for prompts and specs; do not invent new scene content.
- Keep the single coral accent discipline: nothing else in the frames should be saturated orange/red.
- Pause for my approval at exactly two gates: after A0, and after the five keyframes. Then proceed through videos and extras without further pauses.
- When done, summarize what was generated, where it lives, and the total credits/cost if visible.

---
