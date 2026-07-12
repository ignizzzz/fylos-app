# Fylos Website — Asset Production Plan (Higgsfield) · v2

Ημερομηνία: 2026-07-12 · **Αισθητική: Η ΑΡΧΙΚΗ ΤΑΙΝΙΑ (Concept 11)** — κινηματογραφικό live-action καρέ σε ύφος Wes Anderson: τέλεια συμμετρία, παστέλ production design, αληθινός σκύλος-πρωταγωνιστής, χρυσό φως, διακριτικός φιλμικός κόκκος. ΟΧΙ 3D animation, ΟΧΙ μινιατούρες, ΟΧΙ 2D/clay/paper.
Η v1 (Σύγχρονο 3D) αποσύρθηκε με απόφαση founder 2026-07-12. Η ιστορία των 5 σκηνών παραμένει ίδια.

## Κανόνες παραγωγής

1. **Πρώτα το «casting».** Παράγεται το A0 (reference του σκύλου-πρωταγωνιστή) και χρησιμοποιείται ως image reference σε ΟΛΑ τα keyframes — ίδιος σκύλος παντού.
2. **Image → Video.** Κάθε σκηνή: πρώτα keyframe εικόνα, μετά image-to-video με input το keyframe.
3. **Βίντεο loopable**, 6–8s, διακριτική live κίνηση (ανάσα, βλεφάρισμα, ουρά, κουρτίνα, σκόνη στο φως), **ΚΑΜΙΑ κίνηση κάμερας** — το dolly το κάνει το scroll του site.
4. **Ονοματολογία** (φάκελος `public/film/`, τα slots του site τα περιμένουν έτσι):
   - `scene-01.jpg` + `scene-01.mp4` … `scene-05.jpg` + `scene-05.mp4` (16:9, min 1920×1080)
   - `scene-0X-m.jpg` mobile πορτραίτα (9:16) όπου σημειώνεται
   - `ball.webm` (transition), `og.jpg` (1200×630), `poster-blank.jpg` (2:3), `pro.jpg`

## Global style block (κολλάει στο τέλος ΚΑΘΕ prompt)

> Cinematic live-action film still in the style of a Wes Anderson movie: perfectly symmetrical frontal composition, flat lensing, meticulous pastel production design (cream #FBF7F2, powder pink, mint, butter yellow) with a single coral accent #E85D2A, warm golden practical lighting, subtle vintage film grain, quirky deadpan charm, premium art direction, 16:9.

---

## A0 — Casting reference (ο πρωταγωνιστής)

Χρήση: image reference για όλα τα υπόλοιπα. Δεν μπαίνει στο site.

> Casting reference of the film's star: a small scruffy cream-white terrier with warm brown eyes and a coral #E85D2A collar with a small round gold tag, photographed on a plain cream seamless studio backdrop in three positions — sitting facing camera, standing three-quarter view, walking side profile. Soft even studio light, consistent fur detail, cinematic film still, subtle grain. + style block

## A1 — Σκηνή 1 «Το Σαλόνι» (hero)

- `scene-01.jpg`:

> A dignified small scruffy cream terrier with a coral collar sitting on a round velvet ottoman in the exact center of a powder-pink living room with two tall symmetric windows, vintage floral wallpaper, meticulous pastel set dressing, herringbone parquet floor, a glossy coral rubber ball #E85D2A on the floor beside the ottoman, golden afternoon light streaming through sheer curtains, dust motes in the light beams. Wide symmetrical establishing shot, eye level. + style block

- `scene-01.mp4` (i2v): «The dog breathes gently, blinks, one ear twitches, sheer curtains sway almost imperceptibly, dust motes drift in the light. No camera movement. Seamless loop, 8 seconds.»
- `scene-01-m.jpg`: ίδιο prompt, «vertical 9:16 composition, dog and ball centered low».

## A2 — Σκηνή 2 «Ο Διάδρομος του Χάους»

- `scene-02.jpg`:

> A long narrow hallway photographed frontally, its walls covered edge to edge with neatly pinned paper chaos — vaccination cards, sticky notes, vet letters, small photographs — arranged in obsessive symmetric grids, the small cream terrier sitting in the center of the corridor looking at the camera slightly overwhelmed, at the far end a glowing doorway with a coral #E85D2A painted door frame, one paper caught falling mid-air. + style block

- `scene-02.mp4`: «Two or three pinned papers flutter and one falls slowly, the dog's ears twitch, the light from the doorway breathes subtly. No camera movement. Loop, 6 seconds.»

## A3 — Σκηνή 3 «Το Πάρκο»

- `scene-03.jpg`:

> A perfectly symmetrical city park in late golden afternoon: a round stone fountain in the center, rows of manicured spherical trees on both sides, vintage green benches, a friendly dog walker in a mustard-yellow uniform coat holding three leashes with three different small dogs — one of them the cream terrier with the coral collar — and the coral rubber ball #E85D2A floating in the fountain water. Wide symmetric shot. + style block

- `scene-03.mp4`: «Fountain water shimmers, leaves tremble lightly in a breeze, the dogs' tails wag, the walker shifts weight once. No camera movement. Loop, 8 seconds.»
- `scene-03-m.jpg`: 9:16 variant.

## A4 — Σκηνή 4 «Ο Κτηνίατρος»

- `scene-04.jpg`:

> A charming retro veterinary waiting room: mint-green walls, a row of identical wooden chairs against the wall with the cream terrier sitting patiently in the exact center chair, a framed eye-test chart on the wall made of bone shapes in decreasing sizes, a wooden card-catalog cabinet with small brass-labeled drawers, a kind nurse in a vintage pale uniform behind a rounded reception desk, the coral ball #E85D2A in a wicker toy basket. Frontal symmetric composition. + style block

- `scene-04.mp4`: «The dog's tail wags against the chair, the nurse stamps a card once and looks up with a small smile, ceiling light flickers warmly. No camera movement. Loop, 6 seconds.»

## A5 — Σκηνή 5 «Η Νύχτα»

- `scene-05.jpg`:

> A cozy bedroom at night, kept warm: dusk-blue walls with golden lamplight from a bedside lamp, the cream terrier asleep curled at the foot of a neatly made bed with a quilted cover, an open journal with a fountain pen on the nightstand, a round window showing a pale moon, the coral ball #E85D2A resting beside the sleeping dog. Quiet, tender, symmetrical. + style block

- `scene-05.mp4`: «The dog's chest rises and falls slowly in sleep, the lamplight breathes almost imperceptibly, one star twinkles through the window. No camera movement. Loop, 8 seconds.»
- `scene-05-m.jpg`: 9:16 variant.

## A6 — Transition «Το μπαλάκι»

- `ball.webm` (ή mp4):

> Macro cinematic shot of a single glossy coral rubber ball #E85D2A rolling smoothly from left to right across a warm herringbone parquet floor, soft shadow, shallow depth of field, subtle film grain, nothing else in frame. 3 seconds.

## A7 — OG / share image

- `og.jpg` (1200×630): το καρέ της Σκηνής 1 με letterbox και τίτλο «FYLOS presents — The Story of a Very Good Friend» (η τυπογραφία μπορεί να μπει και από εμάς σε post αν το κείμενο βγει αλλοιωμένο).

## A8 — Poster template (generator «κάνε το pet σου πρωταγωνιστή»)

- `poster-blank.jpg` (2:3):

> A vertical 2:3 movie poster composition, live-action Wes Anderson style: the cream terrier with coral collar sitting proudly on the round velvet ottoman in the powder-pink living room, centered, empty cream space in the top third for a title, a subtle credits block area at the bottom, warm golden light, film grain. + style block

## A9 — Pro frame (ενότητα For pros)

- `pro.jpg` (16:9):

> Portrait-style cinematic frame of the friendly dog walker in the mustard-yellow uniform coat standing proudly in the symmetric park holding three leashes, a coral #E85D2A canvas messenger bag across the shoulder, three happy small dogs at their feet, warm confident deadpan smile, golden light. + style block

## Σειρά εκτέλεσης

1. A0 → έγκριση founder (1 γύρος διορθώσεων).
2. A1–A5 keyframes (με A0 ως reference) → έγκριση → i2v βίντεο.
3. A6–A9.
Σύνολο: ~9 εικόνες + 6 βίντεο + variants ≈ 1–2 ώρες παραγωγής.
Ποιότητα πάνω από ταχύτητα: αν ο σκύλος «αλλάζει» μεταξύ σκηνών, ξαναγέννημα με το A0 ως reference — όχι συμβιβασμός.

---

## Απαιτήσεις συνέχειας (v2 — continuous film με parallax)

Το site πλέον κάνει cross-dissolve μεταξύ των σκηνών ΧΩΡΙΣ διακοπές. Για να «λιώνουν» όμορφα τα πλάνα:

1. **Ίδια γραμμή δαπέδου/ορίζοντα** σε όλες τις σκηνές: το πάτωμα να πιάνει περίπου το κάτω 25–30% του κάδρου.
2. **Ίδια θερμοκρασία φωτός στα άκρα**: όλες οι σκηνές ξεκινούν/κλείνουν σε ζεστό χρυσό φως, ώστε τα dissolves να μη «χτυπάνε» (η νύχτα της Σκηνής 5 κρατά ζεστό lamplight στο κέντρο).
3. **Καθαρός «αέρας» για overlays**: το πάνω τρίτο και οι δύο πλαϊνές ζώνες (αριστερό & δεξί 30%) σχετικά ήσυχες — εκεί πατούν οι parallax κάρτες περιεχομένου. Ο σκύλος και η δράση στο κέντρο.
4. **Το μπαλάκι σε συμβατή θέση**: σε κάθε keyframe το coral μπαλάκι στο κάτω μισό (το site έχει και δικό του «ταξιδιάρικο» μπαλάκι που περνά από σκηνή σε σκηνή — οι θέσεις πρέπει να μην συγκρούονται οπτικά).
5. **Βίντεο απολύτως στατικής κάμερας** (ισχύει ήδη): κάθε pan/zoom μέσα στο clip θα χαλάσει το dissolve.
