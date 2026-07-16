# LOCKED — Storytelling

_Last verified: 2026-07-15 against branch `fylos-dev`._

The scroll storytelling ("one continuous film"), its frame animation, background
effects and feature boxes are **finished and locked**. Do not redesign, refactor,
restructure, or "clean up" any file listed here. Treat these as read-only.

Small copy typo fixes inside the overlay text are the only edits ever allowed,
and only when the founder explicitly asks. Anything touching layout, motion,
the canvas engine, the scroll timeline, or the background effects is off limits.

---

## 1. The film itself (primary locked file)

| Path | What it is |
|---|---|
| `website-live/index.html` | The entire scroll film in one file: styles, markup, and the canvas engine. This is the live homepage. **Locked in full.** |

`website-live/index.html` is self-contained (~1,472 lines):

- **`<style>` block** (lines ~10–756) — all layout, type, the grain/veil/night
  background effects, and every overlay card style.
- **HTML body** (lines ~757–1049) — the film stage, the name gate, the hero,
  the six overlays, the anchor nodes, and the finale.
- **`<script>` engine** (lines ~1050–1470) — the scroll-driven canvas film.

### Storytelling internals (all inside that one file — do not touch)

- **Frame animation** — a `<canvas id="cv">` scrubbed by scroll. The timeline is
  the `SEGS` array (7 segments: `v9-one`, `v4-t2b`, `v4-t3`, `v4-t4`, `v4-s4`,
  `v4-t5`, `v4-t7b`), with per-segment frame counts, pixels-per-frame, and dwell
  times. `loadSeg()` preloads JPG frames; `drawFrame()` does the cover-fit draw,
  zoom, and cross-fades.
- **Preloader** — `#loader` / `#loadbar`.
- **Name gate** — `#gate`, `#gateForm`, `#gateName`, `#gateSkip` (the pet-name
  entry that personalises overlay copy).
- **Background effects** — `#grain`, `#introVeil`, `#ovl-night`, and the inline
  SVG `fractalNoise` data-URI textures. These are the "background effects" that
  are locked.
- **Feature boxes / overlays** — `#ovl-tag`, `#ovl-vet`, `#ovl-groomer`,
  `#ovl-glass`, `#ovl-night`, `#ovl-square`.
- **Anchor system** — `#anc-tag`, `#anc-cat`, `#anc-screen`, `#anc-pin`,
  `#anc-sos`, `#anc-info1`, `#anc-info2`, the `ANCHORS` frame-space map, plus
  the leader line (`#leader-vet`) and the sketch-circle pins. Overlays are pinned
  to points in the frame via these.
- **Finale** — `#finBadges`, `#finPhone`, `#finScreen`, `#finTag`, `#finPill`,
  `#finLabel`, `#finBg`.

---

## 2. Film assets (locked, and NOT stored on this branch)

`website-live/index.html` references these paths. They are **not** committed to
`fylos-dev`; the masters (4K + all frames, ~167MB) live on branch
`claude/website-design-concepts-fwtqe6` under `public/film/city/v2/` (worktree
`~/fylos-website-film`). The live site serves them from Vercel. Do not attempt to
regenerate, re-encode, or re-path them.

- `assets/v9-one/NNNN.jpg` … `assets/v4-t7b/NNNN.jpg` — the film frame sequences
  (7 folders matching the `SEGS` dirs above).
- `assets/square-hi.jpg`, `assets/ktagqr-hi.jpg`, `assets/k-lines.jpg` — hi-res
  overlay stills.
- `assets/city-03.mp4`, `assets/wc-city.jpg` — background media.
- `assets/tag-qr.png`, `assets/roles/pet.png`, `assets/roles/walker.png`,
  `assets/roles/clinic.png` — overlay imagery.

---

## 3. Concept lab that produced the film (frozen reference)

`website-lab/` holds the experimental concept variants the film was built from.
It is historical reference — **frozen, not a live surface.** Do not edit, and do
not treat any lab file as the source of truth (the film in `website-live/` is).

- `website-lab/01-quiet-flagship.html` … `10-bento.html`
- `website-lab/one-walk.html`, `website-lab/build.html`,
  `website-lab/build-proto.html`, `website-lab/index.html`
- `website-lab/art/` (concept art)

---

## 4. Quick rule of thumb

> If a file is under `website-live/index.html`, `website-lab/`, or the film
> `assets/`, assume it is LOCKED. The editable website surfaces are the other
> content pages in `website-live/` — see [ROUTES.md](ROUTES.md) and
> [SESSION_OWNERSHIP.md](SESSION_OWNERSHIP.md).
