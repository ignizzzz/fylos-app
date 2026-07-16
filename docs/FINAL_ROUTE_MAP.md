# Final Route Map

One canonical route table for the public website (`website/`, deployed with
`cleanUrls`). Navigation, footer, CTAs and internal links all resolve inside
this table — verified by an automated pass (no dead links, no `href="#"`).

## Public routes

| Route | File | Purpose | Linked from |
|---|---|---|---|
| `/` | `index.html` | The scroll film: gate → square → tag → vet → groomer → journal run → park → night → finale → roles footer | everywhere ("Back to Fylos", logo) |
| `/apply` | `apply.html` | Vet-clinic early-access application (mock mode) | film vet card s2, footer clinic card, `/join` vet line, `/why` |
| `/join` | `join.html` | Pro application: walkers/sitters fast lane → app; every other pro → form (mock mode) | film groomer card s2, footer walker card, 404 page, `/why` |
| `/found` | `found.html` | What a finder sees after scanning a tag (demo pet; tel/sms placeholders) | the real QR + "Try it" card in the film's tag scene |
| `/privacy` | `privacy.html` | Privacy policy (draft for counsel) + cookie preferences opener | footer fine print, consent panel, forms' fine print |
| `/terms` | `terms.html` | Terms of use (draft for counsel) | footer fine print |
| `/imprint` | `imprint.html` | Impressum | footer fine print |
| any other path | `404.html` | "This street is not on the map" → `/`, `/join` | — |

## Internal design-reference routes (kept, not publicly linked)

Live-deployed gallery pages the team uses for review; they carry the approved
card designs that are now wired into the film. Not part of public navigation.

| Route | File | Purpose |
|---|---|---|
| `/why` | `why.html` | Concept rationale (Greek, for team meetings); links to the galleries |
| `/tag` | `tag.html` | Tag-moment layout variants (Layout 6 = final) |
| `/layouts` | `layouts.html` | Tag design gallery (l1–l6) |
| `/vet` | `vet.html` | Vet scene final cards 1–3 |
| `/groomer` | `groomer.html` | Groomer scene final cards 1–3 |
| `/park` | `park.html` | Park card options (P1 = final) |

## External destinations used by the site

| URL | Used by |
|---|---|
| `https://app.fylos.me` | tag card CTA, join fast lane, footer/finale "The web app", endlinks |
| `https://fylos.me` | endlinks "fylos.me" |
| `mailto:` hello/privacy/vets/pros`@fylos.me` | footers, legal pages, error boxes |
| `tel:`/`sms:` `+41000000000` (placeholder) | `/found` demo actions |

## In-page anchors

`#partners` (roles footer, from nav "For partners"), `#fylos` (endbar, from nav
"Get the app" + pet-parent role card), `#proform` (join page form),
`/privacy#cookies` (cookie section, no-JS fallback for the consent opener).

## Review deep links (film debugging, unchanged)

`/#f=<frame>`, `/#ovl=<name>[:<pct>]`, `/#dock=<pct>`, `/#solo=<id>`,
`/#hero=<name>` — used during production review; left intact.

## Removed / consolidated

- Duplicate film source (`public/film/city/v2/site/index.html`, one deploy older) — superseded; lives on its branch.
- `website-live/` folder name — renamed to `website/` (no duplicate tree on this branch).
- Dead links: store badges (`#`, `#download`), social `#` anchors, fine-print `#` anchors — all replaced (see INTEGRATION_DECISIONS §3).
- Groomer lamppost card — absorbed into groomer stage 3 (same `/join` destination).

## Separation of surfaces

The public website is `website/` (static). The **app design-viewer** (React,
`src/`, deployed separately with the repo-root `vercel.json` SPA rewrite) is an
internal tool — the closest thing to an "admin" surface in this repo — and shares
no routes, layouts or bundles with the public site.
