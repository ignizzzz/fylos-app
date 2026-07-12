# Handoff prompt για νέο session (παραγωγή assets με Higgsfield) · v2

Αισθητική: **Η ΑΡΧΙΚΗ ΤΑΙΝΙΑ** — live-action Wes Anderson ύφος (αληθινός σκύλος, αληθινά σκηνικά, συμμετρία, παστέλ, film grain). Η προηγούμενη εκδοχή (Σύγχρονο 3D) αποσύρθηκε 2026-07-12 με απόφαση founder.

Copy-paste την αγγλική εκδοχή παρακάτω σε νέο Claude session πάνω στο repo ignizzzz/fylos-app.

---

# English version (paste this into the new session)

---

Hi! You are continuing work that was planned in a previous session. Full context below — then execute.

## What this project is

Fylos is a premium pet-care companion app ("the second brain for pet parents"). Brand: cream #FBF7F2, coral #E85D2A, ink #111111, warm minimal, editorial serif accents. We are building the marketing website (fylos.app) with the explicit goal of winning at Awwwards (Site of the Day and beyond). This is the company's first public advertisement.

## The locked creative direction

The website is a FILM you scroll through: "FYLOS presents". Five cinematic scenes (letterbox bars, scroll acts as a camera dolly) alternate with normal startup sections (features, for pros, waitlist, FAQ).

Locked aesthetic — THE ORIGINAL FILM LOOK: cinematic LIVE-ACTION stills in the style of a Wes Anderson movie. Perfectly symmetrical frontal compositions, flat lensing, meticulous pastel production design (cream #FBF7F2, powder pink, mint, butter yellow) with a SINGLE coral accent #E85D2A, warm golden practical lighting, subtle vintage film grain, quirky deadpan charm. A REAL dog as the star — NOT 3D animation, NOT miniatures, NOT 2D/clay/paper (those directions were explored and rejected). Universal settings only (home, park, vet clinic) — no city-specific theming.

The star: a small scruffy cream-white terrier with warm brown eyes and a coral collar with a gold tag. A coral rubber ball #E85D2A is hidden somewhere in EVERY scene (brand thread + visitor easter egg).

## What already exists in the repo (branch: claude/website-design-concepts-fwtqe6)

- The website is BUILT at route /website (src/screens/WEBSITE_FILM_v1.jsx): sticky cinema scenes with letterbox + scroll dolly, pet-name personalization (?pet= URL too), acts with features / pro earnings slider / health, finale with rolling credits + waitlist + poster share, FAQ, footer. Each scene has an ASSET SLOT: it looks for files in public/film/ by exact name and shows a CSS placeholder until the file exists. Dropping in files upgrades the site with zero code changes.
- FYLOS_WEBSITE_ASSET_PROMPTS.md (v2) — the complete production plan in the locked live-action aesthetic: every prompt, the global style block, ratios, video specs, order, naming. THIS FILE IS THE SOURCE OF TRUTH — follow it verbatim.
- public/film/README.md — the exact filenames the site expects.
- FYLOS_WEBSITE_PAGE_DESIGN_GR.md — the scroll-by-scroll page design (Greek).

## Step 0 — Higgsfield connection

Verify the Higgsfield MCP tools are available (generate_image, generate_video). If not, stop and tell me to authorize the Higgsfield connector at claude.ai → Settings → Connectors → Higgsfield → Connect (I will log in myself — never ask me for tokens or codes), then continue once connected.

## What to create in Higgsfield (in this order)

1. A0 — Casting reference of the star dog (three positions on a cream studio backdrop). Generate FIRST and SHOW ME for approval. It is the identity reference for everything else.
2. After my approval: A1–A5 — the five scene KEYFRAMES as 16:9 images, using A0 as image reference so the dog is identical everywhere:
   - Scene 1 "The Living Room" (hero): terrier on a round velvet ottoman, exact center of a powder-pink living room, symmetric windows, golden light, coral ball on the parquet.
   - Scene 2 "The Hallway of Chaos": narrow corridor, walls covered in neatly pinned papers (vaccination cards, sticky notes, vet letters), dog centered, glowing coral doorway at the far end.
   - Scene 3 "The Park": symmetric park, round fountain, spherical trees, dog walker in a mustard coat with three leashes, golden afternoon, coral ball floating in the fountain.
   - Scene 4 "The Vet": retro mint waiting room, identical wooden chairs with the dog in the center seat, bone-shaped eye chart, card-catalog cabinet, nurse at the desk, coral ball in a wicker basket.
   - Scene 5 "The Night": warm bedroom at night, dog asleep at the foot of the bed, open journal on the nightstand, pale moon in a round window, coral ball beside the dog.
   Show me all five keyframes for approval.
3. After approval: the five VIDEOS via image-to-video from each keyframe. 6–8 seconds, seamless loop, GENTLE live motion only (breathing, blinking, tail wag, curtain sway, drifting dust, shimmering water, one falling paper) and STRICTLY NO CAMERA MOVEMENT — the website's scroll is the camera.
4. The connectors/extras (exact prompts in the file): ball.webm (macro coral ball rolling across parquet, ~3s chapter transition), og.jpg (1200×630 share image from Scene 1 with the film title), poster-blank.jpg (2:3 movie-poster background for the "make your pet the star" generator), pro.jpg (the dog-walker hero frame for the For Pros section).

## How it becomes the website

1. Place every file in public/film/ with these EXACT names: scene-01.jpg + scene-01.mp4 … scene-05.jpg + scene-05.mp4, plus ball.webm, og.jpg, poster-blank.jpg, pro.jpg. The site picks them up automatically.
2. Commit and push to branch claude/website-design-concepts-fwtqe6.
3. Run the site (npm install && npm run dev, port 3000), open /website, verify every scene plays its loop and placeholders are gone. Send me screenshots (desktop 1440px and mobile 390px: hero + two scenes + finale).
4. If any frame drifts off-model (different dog, palette shift, camera moved, looks 3D/animated instead of live-action film), REGENERATE with A0 as reference. Quality over speed — this site is going to Awwwards.

## Rules

- Follow FYLOS_WEBSITE_ASSET_PROMPTS.md verbatim; do not invent new scene content.
- Single coral accent discipline: nothing else saturated orange/red in frame.
- Pause for my approval at exactly two gates: after A0, and after the five keyframes. Then proceed without further pauses.
- When done, summarize what was generated, where it lives, and total credits/cost if visible.
