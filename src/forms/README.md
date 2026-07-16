# Fylos form system (`src/forms`)

Reusable, typed, **frontend-only** forms for the marketing-site routes described
in [`docs/ROUTES.md`](../../docs/ROUTES.md). No backend: every submission flows
through one centralized, typed mock service that can simulate success,
validation failure, server failure, a network failure and a delay.

This module is self-contained and owns the default tooling configs
(`tsconfig.json`, `eslint.config.js`, `vitest.config.ts`) and the default
`test` / `typecheck` / `lint` npm scripts. It does not import or modify any
existing page layout or the React app in `src/`.

## The eight forms

| Form id        | Route           | Consent required          |
| -------------- | --------------- | ------------------------- |
| `early-access` | `/early-access` | Contact                   |
| `newsletter`   | `/newsletter`   | Subscribe                 |
| `contact`      | `/contact`      | Reply + privacy           |
| `partnership`  | `/partners`     | Contact                   |
| `veterinary`   | `/apply`        | Attestation + application |
| `demo`         | `/demo`         | Contact                   |
| `support`      | `/support`      | Handle details            |
| `press`        | `/press`        | Contact                   |

`veterinary` mirrors the real fields of the live `/apply` page. `/join` (pros)
is deliberately out of scope and untouched.

## Every form handles

validation (inline + summary, first-invalid focus), loading, success,
backend/server error, network error, duplicate submission, retry, accessible
labels (`<label>` + `aria-describedby` + `aria-invalid` + live regions), a
required consent checkbox where the table says so, and first-touch UTM +
referrer capture on every submission.

## Architecture

```
core/
  types.ts        shared types (the contracts everything speaks)
  mockConfig.ts   ONE place that decides mock scenario + delay
  validation.ts   pure validators (no React/DOM)
  meta.ts         UTM + referrer capture (first-touch, injectable)
  mockClient.ts   the mock transport: fabricates every response
  service.ts      submitForm(): the single typed entry point
hooks/
  useFormSubmit.ts   the submit state machine (reducer)
components/
  FormField, SubmitButton, StatusBanner, SuccessPanel, Form
schemas.ts        the eight form definitions (pure data)
demo/             a playground (forms-demo.html); not a live page
```

Going live = swap `mockSubmit` for a real `fetch` in `core/service.ts`. Nothing
else changes.

## Usage

```tsx
import { Form, FORMS } from './src/forms'

<Form schema={FORMS.contact} />
```

Or drive the machine yourself with `useFormSubmit(schema)` and compose
`FormField` / `StatusBanner` / `SubmitButton` / `SuccessPanel`.

## Driving the mock

Priority: `setMockConfig()` > URL (`?mock=server&delay=1500`) >
env (`VITE_FORMS_MOCK`, `VITE_FORMS_MOCK_DELAY`) > defaults (`success`, 700ms).
Scenarios: `success`, `validation`, `server`, `network`, `duplicate`.

## Checks

```bash
npm run typecheck   # tsc --noEmit -p tsconfig.json (src/forms only)
npm run lint        # eslint src/forms
npm test            # vitest run (src/forms only)
npm run build       # vite build (whole app; must stay green)
```

Playground: `npm run dev`, then open `/forms-demo.html`.
