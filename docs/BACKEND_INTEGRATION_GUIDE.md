# BACKEND INTEGRATION GUIDE

_Last verified: 2026-07-16 against branch `fylos-dev`. For Panagiotis (.NET backend
+ Kotlin/Compose mobile) and any assistant wiring the real backend._

This repository is **frontend only** by design (see [AGENTS.md](../AGENTS.md), rule 4).
Every surface below already works end to end against a **typed, in-memory mock**.
Going live is, in every case, "replace one mock seam with a real call and keep the
same shape." Nothing else in the UI changes.

This guide tells you **exactly where each seam is, what contract it speaks, and what
must not change.** It does not build a backend and it does not tell you how to build
yours; it tells you what the frontend expects to talk to.

Golden rules while wiring:
- **Do not build the backend inside this repo.** Point the frontends at your API
  (`app.fylos.me` / a new API host). The swap is a config/one-function change here.
- **Keep the existing type shapes.** They are the contract. If your API differs,
  map to these shapes in a thin adapter, do not rewrite the UI.
- **Never send personal data to analytics** (see §5). This is enforced in code;
  keep it that way.
- **Never touch the locked film** (`website-live/index.html`) or its assets
  (see [LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md)).

---

## At a glance: the five seams

| # | Surface | Where it lives | Mock seam to replace | Auth needed |
|---|---|---|---|---|
| 1 | Website lead forms (`/apply`, `/join`) | `website-live/apply.html`, `join.html` (static) | client-only "thank you" panel | no (public) |
| 2 | React form library (8 forms) | `src/forms/` | `submitForm()` -> `mockSubmit` | no (public) |
| 3 | Email / Newsletter | `src/email/` | `emailService.*` mock | public tokens + admin |
| 4 | Growth Admin (CRM) | `src/admin/` | `AdminServices` mock | yes (staff) |
| 5 | Analytics + consent | `@fylos/analytics` (`analytics/`), dropped into `website-live/` | `NoopAdapter` | no (anonymous) |

Plus one product-data gap: the **per-tag QR flow** (§6).

Everything is currently `success`/mock and all six zone check suites are green
(§7). You can wire these seams in any order and independently.

---

## 1. Website lead forms — `/apply` and `/join`

**What they are.** Two public static HTML pages with a real, validated form. On
submit they run client-side required-field validation and then reveal a
confirmation panel. **Nothing is sent anywhere.**

- `website-live/apply.html` — vet-clinic early-access application (`<form id="applyForm">`).
- `website-live/join.html` — pros application (`<form id="joinForm">`).

**Seam.** Each page has an inline `<script>` at the bottom with the submit handler.
Today it does `e.preventDefault()`, validates, then shows the panel. To go live,
send the field values to your endpoint before showing the confirmation (keep the
confirmation panel for the success case; show an inline error on failure).

**`/apply` field names** (the `name=` attributes, exactly):
`clinic_name`, `city`, `country`, `canton`, `vet_count`, `website`,
`responsible_vet_name`, `cantonal_authorization` (checkbox), `practice_software`,
`practice_software_other`, `practice_volume`, `goals`, `contact_name`,
`contact_role`, `contact_email`, `attestation` (checkbox, required),
`application_consent` (checkbox, required), `marketing_optin` (checkbox).

**`/join` field names:** the pros form; `#prof` (profession) reveals a free-text
`profOther` when set to "other". Walkers/sitters are pushed to the app
(`app.fylos.me`) rather than this form.

**Attribution to capture server-side.** These pages are linked from the commercial
pages with tracked query strings, e.g.
`/apply?type=early-access&from=partners`, `/join?type=walker&from=pilot`. Read
`type` and `from` from `location.search` and store them with the submission so you
know which funnel produced the lead. (The React library in §2 captures full UTM +
referrer automatically; if you prefer, standardize on that library for these pages.)

**Compliance.** `/apply` collects `attestation` + `application_consent` (both
required) and shows Swiss-FADP fineprint pointing at `privacy@fylos.me`. Persist the
consent booleans and the timestamp with the record.

**Where the leads should land.** The Growth Admin (§4) already models form
submissions (`FormSubmission`, a `submissions` resource). The natural target is:
website form -> your API -> the same store the Admin reads. See §4 for that shape.

---

## 2. React form library — `src/forms` (8 typed forms)

**What it is.** A reusable, typed, framework-agnostic form system. Eight forms
(`early-access`, `newsletter`, `contact`, `partnership`, `veterinary`, `demo`,
`support`, `press`), each with validation, loading/success/error/duplicate states,
accessible markup, and first-touch UTM + referrer capture. It is a **library +
playground** (`/forms-demo.html`), not currently mounted on an app route.
`veterinary` mirrors the live `/apply` fields, so it can replace the static `/apply`
form if you want one implementation.

**The single seam.** [`src/forms/core/service.ts`](../src/forms/core/service.ts) —
`submitForm(formId, values, options)`. Today it calls `mockSubmit(payload)`.
Replace that one call with a real `fetch`:

```ts
// src/forms/core/service.ts — the ONLY change to go live
const res = await fetch(endpointFor(formId), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),          // payload is SubmissionPayload (below)
  signal: options.signal,
})
return mapResponseToSubmitResult(res)     // map onto the SubmitResult union (below)
```

**Request shape** (`SubmissionPayload`, from
[`src/forms/core/types.ts`](../src/forms/core/types.ts)):

```ts
{ formId: FormId,
  values: Record<string, string | boolean>,
  meta: {
    utm: { source?, medium?, campaign?, term?, content? },
    clickIds: { gclid?, fbclid?, msclkid? },
    referrer: string | null,
    landingPath: string,        // first path this session
    submittedFrom: string,      // path submitted from
    userAgent: string | null,
    submittedAt: string,        // ISO 8601
  } }
```

**Response shape you must return** (`SubmitResult`, a discriminated union — return
exactly one):

```ts
// success
{ ok: true, id: string, message: string }
// failures (kind drives the UI)
{ ok: false, kind: 'validation', message, fieldErrors?: Record<field,string> }
{ ok: false, kind: 'server',     message, retryable?: true, status?: number }
{ ok: false, kind: 'network',    message, retryable?: true }   // usually thrown, see below
{ ok: false, kind: 'duplicate',  message, id?: string }
```

`submitForm` already turns a thrown/aborted `fetch` into the `network` failure, so
you only need to map HTTP responses to `success` / `validation` / `server` /
`duplicate`. Do not throw for expected outcomes; return the typed result.

**No other file changes.** The hook (`useFormSubmit`), components, schemas and the
113 tests all speak `SubmitResult` and keep working.

---

## 3. Email / Newsletter — `src/email` (`/newsletter/*`)

**What it is.** Public subscriber flows (double opt-in confirm, preferences,
unsubscribe, resubscribe, invalid/expired link) plus an admin campaign console
(list/detail across draft/scheduled/sending/sent/failed, draft editor, audience
selection, email preview, delivery summary, subscriber list, suppression).
Front-end only; **no email provider is connected and no mail is ever sent.**

**The seam.** [`src/email/core/service.ts`](../src/email/core/service.ts) exports
`emailService` (and named functions). Every method is `async` and returns typed
results from [`src/email/core/types.ts`](../src/email/core/types.ts). Provide a
real implementation with the same signatures and inject it (the module already
routes all UI through this service object).

Methods to back with your API + provider (Mailgun/SES/Postmark/etc.):

- **Public, token-based** (the token comes from the email link):
  `resolveToken`, `confirmSubscription`, `getSubscriberByToken`,
  `updatePreferences`, `unsubscribe`, `resubscribe`.
- **Admin console:** `listCampaigns`, `getCampaign`, `saveDraft`,
  `scheduleCampaign`, `sendCampaign`, `retryCampaign`, `getDeliverySummary`,
  `listAudiences`, `getAudience`, `listSubscribers`, `getSubscriber`,
  `listSuppression`, `removeSuppression`.

**What the backend owns:** the double opt-in token lifecycle (issue, resolve,
expire, mark used), the actual send (provider), delivery/bounce/complaint stats
that feed `getDeliverySummary`, and the suppression list. The failure path is
already modelled (`ServiceError`, `failed` campaign state, retry), so surface real
provider errors through the same shapes.

The floating "Preview state" control / `?state=` in the UI is a **demo affordance**
for reviewing loading/empty/error/failed states; it has no backend meaning and can
stay (it only drives the mock).

---

## 4. Growth Admin (CRM) — `src/admin` (`/admin/*`)

**What it is.** A private internal CRM: dashboard, leads, contacts, companies,
pipeline, form submissions, UTM attribution, tasks, follow-ups, notes, tags,
sources. Mock auth only (demo login `iakovos@fylos.me` / `fylos`). Loading, empty,
error, access-denied and session-expired states are all real and demo-switchable.

**The seam.** [`src/admin/services/index.ts`](../src/admin/services/index.ts)
builds `createMockServices(): AdminServices` and exports it as `services`. The whole
admin reads services through
[`ServicesProvider`](../src/admin/context/ServicesContext.tsx), never the store
directly. To go live, write `createHttpServices(): AdminServices` with the same
shape and pass it to the provider:

```tsx
// one line at the mount, e.g. in AdminApp
<ServicesProvider services={createHttpServices()}> ... </ServicesProvider>
```

**The interface to implement** (from
[`src/admin/services/types.ts`](../src/admin/services/types.ts)):

```ts
interface AdminServices {
  auth: AuthService;                       // signIn/signOut/getSession/isExpired/refresh/subscribe
  analytics: AnalyticsService;             // dashboard(), attribution(query)
  leads/contacts/companies/submissions/deals/notes/tasks/followUps/tags/sources/team/touches
    : ResourceService<T>;                  // list(query)/get(id)/create/update/remove
  pipeline: PipelineStage[];
}
interface ResourceService<T> {
  list(query: ResourceQuery): Promise<ListResult<T>>;  // paged, filtered, sorted
  get(id): Promise<T | null>;
  create(input: Partial<T>): Promise<T>;
  update(id, patch: Partial<T>): Promise<T>;
  remove(id): Promise<void>;
}
```

Model shapes are in [`src/admin/types/models.ts`](../src/admin/types/models.ts).
`ResourceQuery` (search/filters/sort/pagination) and `ListResult<T>` are in
`src/admin/types/`. Notes:

- **Auth** is real staff auth on your side. Map your session to `AdminSession`,
  keep `isExpired()` / `refresh()` honest so the session-expired UI works, and
  respect roles (`RequireRole` gates `submissions` and `attribution` to `manager`).
- **Server-side list()** should do the search/filter/sort/pagination (the mock does
  it in memory via the per-resource query configs; your API does it in SQL).
- **`submissions`** is the CRM view of the §1/§2 form leads. Feed website
  submissions here so the growth team sees them.
- Throw `AdminServiceError('session_expired' | 'access_denied' | ...)` (see
  `src/admin/types`) so the existing error states render; do not invent new error
  UIs.

---

## 5. Analytics + consent — `@fylos/analytics`

**What it is.** A consent-gated, PII-safe, provider-agnostic analytics + consent
layer. It ships as a built bundle and is **already wired into the marketing site**
(this integration pass): the shared shell (`website-live/shell/shell.js`) loads it
on every shell page and adds a footer "Cookie preferences" control; the four
commercial pages load it directly; `/apply` and `/join` fire `form_started` /
`form_submitted` (field names only). The bundle mounts a Shadow-DOM consent banner,
captures first-touch attribution, and **blocks every nonessential event until the
visitor grants analytics consent.** The default adapter (`NoopAdapter`) sends
nothing, so **no data leaves the browser today.**

Serving note: the built bundle is copied to
`website-live/analytics/fylos-analytics.global.js` (the static site has no build
step). If you change the analytics package, rebuild and re-copy:

```bash
npm --prefix analytics run build
cp analytics/dist/fylos-analytics.global.js website-live/analytics/
```

**The seam.** Implement one `AnalyticsAdapter`
([`analytics/src/adapter.ts`](../analytics/src/adapter.ts)) and pass it in:

```ts
const adapter: AnalyticsAdapter = {
  name: 'ga4' /* or your provider */,
  init(ctx) { /* boot SDK; ctx.consent is current consent */ },
  track(envelope) {
    // envelope = { name, category, props, context } — already consent-approved
    // and PII-sanitized. Just forward it.
  },
  setConsent(consent) { /* set the provider's consent mode */ },
};
// static site: window.FylosAnalyticsConfig = { adapter } BEFORE the bundle loads
// bundler:     createFylosAnalytics({ adapter })
```

**The 8 events** you will receive (`analytics/src/events.ts`): `cta_click`,
`storytelling_started`, `storytelling_completed`, `feature_viewed`, `form_started`,
`form_submitted`, `download_clicked`, `article_viewed`. All default to the
`analytics` (nonessential) consent category.

**Hard PII rule — do not weaken it.** There is deliberately **no `identify()`**.
Every payload and context passes a PII guard (redacts name/email/phone/message/
address/health terms, email/phone-shaped values, URL query strings, over-long
text). The event catalogue has no field for a person's identity. If your provider
wants a user id, that is exactly what must not be sent here. Verified in this pass:
submitting `/apply` with a real email + name emits only field **names**, zero
values.

**Two gaps to close on your side:**
1. **The locked film (`index.html`) is not instrumented.** It is the homepage and
   where `storytelling_started` / `storytelling_completed` naturally fire, but it is
   a LOCKED file. Adding the one `<script defer src="/analytics/fylos-analytics.global.js">`
   tag (and the two storytelling calls) is a **founder-directed** change to the
   locked film, not routine work. Until then, analytics covers the secondary pages
   only.
2. **A real consent record** (if you need server-side proof of consent) is not
   stored; consent lives in first-party `localStorage`. Persist it server-side if
   your compliance posture requires it.

---

## 6. Per-tag QR product flow (`/found` -> `/p/<id>`)

`website-live/found.html` is a single **shared demo** "you found {pet}" page with
placeholder `tel:`/`sms:` numbers (`+41000000000`). The real product needs a
**unique code per physical tag** resolving to that pet's finder view, e.g.
`/p/<tag-id>` -> the owner-chosen public subset of the pet record (the owner
"always chooses what a finder sees"). This needs: a tag-id -> pet mapping, a public
read endpoint returning only the fields the owner exposed, and real owner contact
routing. Not built anywhere in this repo; it is net-new product + backend.

---

## 7. After you wire anything: verify

Run the check(s) for the zone you touched (all were green on 2026-07-16). Full
commands live in [AGENTS.md](../AGENTS.md#checks-run-before-finishing):

```bash
# main app (build + typed src/forms gate + tests)
npm run build && npm run typecheck && npm run lint && npm run test
# email
npx tsc --noEmit -p tsconfig.email.json && npx vitest run -c vitest.email.config.ts
# admin
npm run admin:check
# analytics (rebuild the bundle if you changed it, then re-copy — see §5)
npm --prefix analytics run typecheck && npm --prefix analytics run test && npm --prefix analytics run build
# website shell (links/routes/anchors/a11y)
node scripts/check-website-shell.mjs
```

Website pages are static: serve `website-live/` (e.g. `python3 -m http.server
--directory website-live`) so root-absolute `/shell/*` and `/analytics/*` resolve
(they break under `file://`). Redeploy is founder-run:
`vercel deploy --prod --yes --scope iakovosignatiadis-6669s-projects` from the
`website-live/` root.

---

## 8. What to preserve (do not "fix" these)

- **The locked film** `website-live/index.html`, `website-lab/`, and film `assets/`
  are read-only. See [LOCKED_STORYTELLING.md](LOCKED_STORYTELLING.md).
- **No backend in this repo.** Point the frontends at your API; keep the mock seams
  as the local/dev default.
- **No PII to analytics**, ever (§5).
- **Copy rules:** no em/en dashes, no emoji in any user-facing text; do not invent
  features, numbers, testimonials, or claims (AGENTS.md rules 3 and 5).
- **The Kotlin/Compose app** (`~/Project-Fylos`, `app.fylos.me`) is the real mobile
  product; this repo's `src/` React app is a **design viewer** for review, not the
  shipping client. See `README_PANAGIOTIS.md`.
