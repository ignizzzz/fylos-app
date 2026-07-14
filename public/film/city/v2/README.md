# The Neighborhood — city film v2 (Jul 14, 2026)

Snapshot of the scroll-film website as deployed to https://fylos-neighborhood.vercel.app

## What is here

- `site/` — the complete working site. `index.html` is the scroll-film (canvas scrubs JPG
  sequences, dwell overlays, dock finale into the phone, roles + legal footer).
  `takes.html` = archive of every take we shot for the opening. `quality.html` = the
  original vs Topaz vs ByteDance upscale comparison that set the quality pipeline.
  Serve statically from this folder (`python3 -m http.server`), no build step.
- `site/assets/<seg>/NNNN.jpg` — live scrub frames, 2560px, extracted at 12 fps, JPEG q3.
  Segments in play: `v9-one` (opening one-shot), `v4-t2b` (tag→vet), `v4-t3` (through the
  door), `v4-t4` (→groomer), `v4-s4` (dusk glide), `v4-t5` (park corridor→glass),
  `v4-t7b` (night rise).
- `masters/keyframes/` — the native 4K anchor stills every shot is pinned to
  (JPEG q1 from the 4K originals; `ktag-qr-macro.png` kept lossless — it carries the
  engraved QR).
- `masters/takes/` — the source 1080p Kling takes of the live film (pre-upscale).

## The quality pipeline (the only one that works)

1. Pin every video to NATIVE 4K nano stills, never to extracted video frames.
2. Kling 3.0 pro, silent, start_image+end_image pinning; frozen-world prompts
   (figures glued in place, only fountain water moves). For long moves prefer ONE
   longer take (10–15 s) over chained takes; roll 2 variants and frame-check
   (dog duplication / figure drift hits ~50% of pair-to-dog camera transfers).
3. Upscale with **Topaz 2160p** (~8 cr / 10 s). NEVER the ByteDance "aigc" video
   upscaler — it redraws faces and lettering.
4. Extract frames: `ffmpeg -i take.mp4 -vf "fps=12,scale=2560:-2" -q:v 3 seg/%04d.jpg`

Live take job ids (Higgsfield): opening one-shot 91279b79 (Topaz 8334ee97),
tag→vet 69616bc7, s4 dusk ff22ca2f-src/486541a8, t5 d07c9d35, t7b 871d1096.
Keyframes: aerial-clean 60d11015, street-entrance 877086f7, square 80ba8309 (=C1new),
tag-QR macro 3c75b18b.

## Redeploy

`cd site && vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects`
(project: fylos-neighborhood)

Known open items: copy pass with the founder pending; tram still exists in the night
top-down world (only the opening was de-trammed); ~190 MB of frames wants a CDN or a
lighter mobile tier before public launch.
