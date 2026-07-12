# Fylos Website — Asset Production Plan (Higgsfield)

Ημερομηνία: 2026-07-12 · Αισθητική: **E — Το Σύγχρονο 3D** (soft CG, Pixar-like φως, παστέλ + coral #E85D2A).
Κατάσταση: τα prompts είναι έτοιμα προς εκτέλεση. Το Higgsfield MCP χρειάζεται εξουσιοδότηση connector στο claude.ai πριν τρέξει η παραγωγή.

## Κανόνες παραγωγής (για συνέπεια μεταξύ όλων των assets)

1. **Πρώτα ο χαρακτήρας.** Παράγεται το character sheet (A0) και χρησιμοποιείται ως image reference σε ΟΛΑ τα keyframes ώστε ο σκύλος να είναι παντού ο ίδιος.
2. **Image → Video.** Κάθε σκηνή: πρώτα keyframe εικόνα, μετά image-to-video με input το keyframe (όχι text-to-video από το μηδέν) για ίδιο φως/υλικά.
3. **Βίντεο loopable**, 6–8s, ήπια κίνηση (ανάσα, βλεφάρισμα, ουρά), ΚΑΜΙΑ κίνηση κάμερας μέσα στο clip — το dolly το κάνει το scroll του site, όχι το βίντεο.
4. **Ονοματολογία αρχείων** (τα slots του site τα περιμένουν ακριβώς έτσι, φάκελος `public/film/`):
   - `scene-01.jpg` + `scene-01.mp4` … `scene-05.jpg` + `scene-05.mp4` (16:9, min 1920×1080)
   - `scene-0X-m.jpg` mobile πορτραίτα (9:16) όπου σημειώνεται
   - `ball.webm` (transition), `og.jpg` (1200×630), `poster-blank.jpg` (2:3)

## Global style block (κολλάει στο τέλος ΚΑΘΕ prompt)

> Modern 3D animated film still, big-studio animation quality, soft global illumination like golden hour, rounded stylized forms, gentle subsurface materials, cinematic depth of field, pastel palette of cream #FBF7F2, powder pink and mint with a single coral accent #E85D2A, warm and premium, 16:9.

---

## A0 — Character sheet (ο πρωταγωνιστής)

Χρήση: reference για όλα τα υπόλοιπα. Δεν μπαίνει στο site.

> Character design sheet of an adorable small 3D animated dog: cream-beige fur, big warm amber eyes, floppy ears, a coral collar #E85D2A with a tiny round gold tag, friendly curious expression. Three poses on a neutral cream background: front view sitting, three-quarter view standing, side view walking. Consistent proportions, soft fur groom, expressive animation-ready face. + style block

## A1 — Σκηνή 1 «Το Σαλόνι» (hero)

- `scene-01.jpg` (keyframe):

> A softly lit, perfectly symmetrical living room in a modern 3D animated film: rounded stylized furniture, cream #FBF7F2 and powder-pink walls, two tall windows with golden-hour light, the small cream dog with coral collar sitting in the exact center on a round rug, a glossy coral ball #E85D2A beside it, dust motes floating in the light beams. Wide establishing shot, eye level, calm and inviting. + style block

- `scene-01.mp4` (i2v από το keyframe): «The dog breathes gently, blinks, tail wags once, dust motes drift in the light. No camera movement. Seamless loop, 8 seconds.»
- `scene-01-m.jpg`: ίδιο prompt με «vertical 9:16 composition, dog and ball centered low».

## A2 — Σκηνή 2 «Ο Διάδρομος του Χάους»

- `scene-02.jpg`:

> A long narrow hallway in a modern 3D animated film, walls covered edge-to-edge with neatly pinned paper chaos — vaccination cards, sticky notes, vet letters, tiny photos — arranged in obsessive grids, the small cream dog with coral collar standing in the center looking up slightly overwhelmed, at the far end a glowing doorway with a coral door frame #E85D2A, one paper gently falling mid-air. + style block

- `scene-02.mp4`: «Two or three papers flutter and fall slowly, the dog's ears twitch, the doorway glow pulses subtly. No camera movement. Loop, 6 seconds.»

## A3 — Σκηνή 3 «Το Πάρκο»

- `scene-03.jpg`:

> A sunlit public park in a modern 3D animated film: a round stone fountain in the center, rows of spherical stylized trees, tiny benches, a friendly dog-walker character holding three leashes with three different small dogs (one of them the cream dog with the coral collar), golden late-afternoon light, the coral ball #E85D2A floating in the fountain water. Wide symmetric shot. + style block

- `scene-03.mp4`: «Fountain water shimmers, leaves sway lightly, the dogs' tails wag, the walker shifts weight. No camera movement. Loop, 8 seconds.»
- `scene-03-m.jpg`: 9:16 variant.

## A4 — Σκηνή 4 «Ο Κτηνίατρος»

- `scene-04.jpg`:

> A charming veterinary waiting room in a modern 3D animated film: mint-green symmetric walls, a row of identical rounded chairs with the small cream dog sitting patiently in the center chair, an eye-test chart on the wall made of bone shapes in decreasing sizes, a wooden card-catalog cabinet with tiny labeled drawers, a kind nurse character behind a rounded reception desk, the coral ball #E85D2A in a toy basket. + style block

- `scene-04.mp4`: «The dog's tail wags against the chair, the nurse stamps a card once, a drawer glows softly. No camera movement. Loop, 6 seconds.»

## A5 — Σκηνή 5 «Η Νύχτα»

- `scene-05.jpg`:

> A cozy bedroom at night in a modern 3D animated film: warm dusk-blue walls with soft warm lamplight, the small cream dog sleeping curled at the foot of a neatly made bed, an open journal with a tiny pen on the nightstand, a round window showing a pastel moon and two stars, the coral ball #E85D2A resting beside the sleeping dog. Quiet, tender, warm-cold light balance kept warm. + style block

- `scene-05.mp4`: «The dog's chest rises and falls slowly, the lamp light breathes almost imperceptibly, one star twinkles. No camera movement. Loop, 8 seconds.»
- `scene-05-m.jpg`: 9:16 variant.

## A6 — Transition «Το μπαλάκι»

- `ball.webm` (ή mp4): σύντομο clip για μεταβάσεις μεταξύ κεφαλαίων.

> A single glossy coral ball #E85D2A rolling smoothly from left to right across a plain cream #FBF7F2 floor with a soft shadow, modern 3D animated film render, nothing else in frame. 3 seconds.

## A7 — OG / share image

- `og.jpg` (1200×630): το keyframe της Σκηνής 1 με letterbox και τίτλο «FYLOS presents — The Story of a Very Good Boy» (τυπογραφία μπαίνει και από εμάς σε post αν το κείμενο βγει αλλοιωμένο).

## A8 — Poster template (generator «κάνε το pet σου πρωταγωνιστή»)

- `poster-blank.jpg` (2:3):

> A movie poster composition in modern 3D animation style: the small cream dog with coral collar sitting heroically on a round rug in golden light, empty cream space at the top third for a title, subtle credits block area at the bottom, coral ball #E85D2A at its paws. Vertical 2:3 poster. + style block

## A9 — Pro frame (ενότητα For pros)

- `pro.jpg` (16:9): ο walker χαρακτήρας πρωταγωνιστής:

> The friendly dog-walker character from a modern 3D animated film standing proudly in the sunlit park holding leashes, a soft coral #E85D2A messenger bag, three happy small dogs around, warm confident smile, golden light. + style block

## Σειρά εκτέλεσης & εκτίμηση

1. A0 → έγκριση χαρακτήρα από founder (1 γύρος διορθώσεων).
2. A1–A5 keyframes (με A0 ως reference) → έγκριση → i2v βίντεο.
3. A6–A9.
Σύνολο: ~9 εικόνες + 6 βίντεο + variants ≈ 1–2 ώρες παραγωγής όταν ανοίξει το Higgsfield.
