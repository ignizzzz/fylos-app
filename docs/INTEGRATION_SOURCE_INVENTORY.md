# Integration Source Inventory

Everything inspected while locating the previous sessions' work, 2026-07-16.
Repo: `github.com/ignizzzz/fylos-app`. Integration branch: `claude/fylos-integration-preview-b1qlqk`.

## Environment sweep

| Check | Result |
|---|---|
| `git status` at session start | clean, on `claude/fylos-integration-preview-b1qlqk` (= `main`, `ea3859a`) |
| Local branches | `main`, `claude/fylos-integration-preview-b1qlqk` only |
| `git worktree list` | one worktree (the repo itself). The `~/fylos-website-film` worktree mentioned in HANDOFF_STATUS existed on the founder's machine, not in this environment; its branch is on the remote and was fetched. |
| `git stash list` | empty |
| `git fsck --lost-found` | no dangling commits |
| Sibling folders in `/home/user` | none (fresh clone environment) |
| GitHub pull requests (open + closed) | none |
| Remote refs | 6 branches, fetched and inspected below |

## Branches

### `origin/main` — `ea3859a`, 2026-07-09 · the production branch (UNTOUCHED)
The FYLOS app design-viewer (React/Vite, `src/screens/*`), spec docs, brand assets.
Contains no website. Preserved exactly; also tagged `backup/pre-integration-main`.

### `origin/fylos-dev` — `0e32a45`, 2026-07-15 · "website + design handoff snapshot" ⭐ primary source
`main` + two commits:
- `076bbbb` Paw Card rewards mockup (app design-viewer screen 98)
- `0e32a45` the handoff snapshot: **`website-live/`** (recovered source of the live
  pages: the film `index.html` with the Jul-14 batch wire, `apply`, `join`, `why`,
  `found`, `layouts`, `vet`, `groomer`, `park`), **`website-lab/`** (10 design-direction
  concepts + build lab), `HANDOFF_STATUS.md` (decisions, done/pending, where things
  live), `FYLOS_DESIGN_TOKENS.md`, `README_PANAGIOTIS.md`, iOS/Capacitor shell.

Builds: yes (`vite build` green). Conflicts with original site: none — it contains it.

### `origin/claude/website-design-concepts-fwtqe6` — `e385ef0`, 2026-07-14 · the film production branch ⭐ asset source
`main` + the whole film production line (concept docs → storyboard → v1 site →
v2 "one continuous take" → City film v2 as deployed). Key payload:
`public/film/city/v2/site/` = deployed site source + **all 703 scroll frames**
(`v9-one`, `v4-t2b`, `v4-t3`, `v4-t4`, `v4-s4`, `v4-t5`, `v4-t7b`), loop video,
hi-res dwell keyframes, role figurines; `masters/` = 4K keyframes + source Kling
takes (~150MB, production archive); `takes.html`/`quality.html` evidence pages.
Its `site/index.html` is one deploy OLDER than `website-live/index.html`
(no batch wire, no intro veil, no QR try card) — superseded as code, used for assets.

### `origin/claude/typeless-social-templates-8de4r8` — `32789fb`, 2026-07-09
`social-templates/` (4 final social templates + export) and
`design/onboarding-concept/` (art-direction one-pager). Social media collateral,
not website code. Left on its branch; nothing to integrate into the site.

### `origin/claude/services-continuation` — `c031de0`, 2026-06-07
Fully contained in `main`'s history (is-ancestor: yes). Stale pointer, no unique work.

### `origin/claude/code-review-discussion-3wStH` — `e256963`
The repo's pre-rewrite May lineage (separate root, no common ancestor with today's
`main`). Its one fix — merging the duplicate `style` attribute on the booking
calendar grid — is already present in current `main`
(`src/screens/Explore-booking-v1.jsx:297`). No action needed.

## Live deployment (recovered from)

`https://fylos-neighborhood.vercel.app` — reachable during integration.
- Every `website-live/*.html` page verified **byte-identical** to production.
- **`/tag`** (tag layout variants page) existed live but was missing from the
  snapshot → recovered into `website/tag.html`.
- Assets that existed only on Vercel (never committed) were downloaded:
  `tag-qr.png`, `kvet-hi.jpg`, `k-walker.jpg`, `kgroom-hi.jpg`, `kpark-hi.jpg`,
  gallery mockups `layouts/l1–l6-final.png`, `vet/final1–3.png`,
  `groomer/final1–3.png`, `park/p1–p4.png`.
- `/takes` and `/quality` are 404 in production — confirmed not part of the site.

## Work described in the brief but NOT FOUND in any accessible source

Searched all six branches (`git grep` for newsletter/blog/consent/admin/cookie etc.),
GitHub PRs, stashes, dangling objects, and the live deployment:

- Growth Admin — no implementation anywhere. The only related artifact is the
  Paw Card growth **mockup** (app screen 98) and `FYLOS_MEMBERSHIP_GROWTH_PLAN.md`
  (referenced by a commit message; the plan doc itself is not in the repo).
- Newsletter / email preference UI — none. (The apply form's `marketing_optin`
  checkbox is the only opt-in surface.)
- Blog / SEO resource pages — none.
- Analytics / consent UI — none existed; a consent panel was **built new** during
  integration (see INTEGRATION_DECISIONS.md) because footer "Cookie preferences"
  links needed a real destination.

If those Codex sessions saved work anywhere, it was never pushed to this repository
and is not recoverable from this environment. Nothing was invented in their place.

## Safety measures taken

- Tag `backup/pre-integration-main` pins the pre-integration state of `main`.
- `main` and every source branch left untouched; no branch deleted.
- All integration work lives only on `claude/fylos-integration-preview-b1qlqk`.
