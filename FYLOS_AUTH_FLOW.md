# Fylos — Auth flow

Everything from the onboarding hand-off to the inside of the app. This is
the brief Panagiotis can read once and have the whole picture.

---

## Brand strategy in one line

Apple/Google one-tap sign-in is the default path. Manual signup asks for
only what Apple/Google would already hand us (name + email), plus a
password. Anything beyond that — pets, address, prefs, payment — lives
behind a **"finish your profile"** prompt **inside the app**, so the
SSO and manual paths converge on the same in-app completion step.

---

## One file rules them all

The entire auth flow — shell, primitives, sheets, every screen — lives
in **`src/screens/FYLOS_AUTH_v1.jsx`**. That's the only file Panagiotis
needs to open. Named exports per screen.

## Routes

| Route | Exported component | Purpose |
| --- | --- | --- |
| `/sign-in` | `SignIn` | Magic-link primary + Apple/Google. Top-level entry, no back button. |
| `/sign-in-password` | `SignInPassword` | Classic email + password. SSO row included so users can still bail to a provider. |
| `/sign-in-phone` | `SignInPhone` | Phone + SMS OTP. Two internal steps: number → 6-digit code. |
| `/create-account` | `CreateAccountV2` | **Two-step wizard.** Step 1 = first name + last name + SSO. Step 2 = email + password ×2 + Terms/Privacy. |
| `/forgot-password` | `ForgotPassword` | Email → reset link. Reachable via "Forgot it?" on `/sign-in-password`. |
| `/verify-email` | `VerifyEmail` | Post-signup confirmation. Reads email from router state. |
| `/welcome` | `ProfileCompletion` | Post-auth profile-completion harness (popup + multi-step sheet). |

Top-level entries (`/sign-in`, `/create-account`) have **no back button**
— after the onboarding plays once, there's nothing to go back to. Sub-
screens keep their back button.

---

## Shared building blocks

All live in **`src/screens/FYLOS_AUTH_v1.jsx`** alongside the screens.

| Export | What it is |
| --- | --- |
| `AuthShell` | The whole-page wrapper: iPhone frame, header (back / help), bilingual brand lockup (`φίλος` watercolor + `FYLOS` wordmark), title + subtitle, form slot, optional secondary actions (SSO), footer cross-link, optional overlays slot. |
| `FylosBilingualLockup` | The lockup itself, exported in case other surfaces want it. Uses `public/onboarding/philos.png` for the hand-painted Greek line. |
| `AuthInput` | Coral-soft white pill input. `error` prop renders a red border + helper text. Supports `trailing` slot for the password eye toggle. |
| `AuthCta` | The coral pill CTA. `disabled` and `loading` props (loading shows `Loader2` + "One sec…"). |
| `AuthSsoRow` | Full-width stacked "Continue with Apple" / "Continue with Google" buttons. SMS button is opt-in via the `onPhone` prop (currently unused). |
| `AuthHelpSheet` | Bottom sheet that opens when the user taps `?`. Renders per-screen FAQ items + an Email us button. Closed via X, backdrop tap, ESC, or "Close". |
| `AuthDocSheet` | Centered popup for Terms / Privacy. Floating title + Close (no background, mask gradient softens the scroll behind them). Optional "Read the full version ↗" link. |

---

## Help system

Each screen passes its own contextual FAQ. The "?" lives in the top-right
of every auth screen.

| Screen | Help topics |
| --- | --- |
| `/sign-in` | What is a one-tap link? · How long does it take? · Can I use a password instead? |
| `/sign-in-password` | Forgot your password? · Prefer no password at all? · Why are Apple and Google here? |
| `/sign-in-phone` | How does the code work? · Do I get charged? · Prefer email? |
| `/create-account` step 1 | Why first and last name? · Can I sign up with Apple or Google instead? |
| `/create-account` step 2 | Why do you need a password? · What counts as strong? · Why type it twice? |
| `/forgot-password` | How does this work? · Didn't get the link? |
| `/verify-email` | Why am I here? · Can I skip this? · Wrong email? |

Bottom of every help sheet: `Need more help? We're here.` + an **Email
us** button that opens `mailto:hello@fylos.me`.

---

## Voice / copy

- Gen-Z modern, never AI-vibe. No em-dashes in user copy.
- Domain is `fylos.me` (not `.app`). Support email: `hello@fylos.me`.
- Welcome line on `/sign-in`: **"Look who's back."**
- Step 1 on `/create-account`: **"Hi, friend."**
- Step 2 on `/create-account`: **"Almost there."**
- Reset on `/forgot-password`: **"Forgot it? No drama."**
- Verify: **"One last tap."**
- Phone step 1: **"Got a phone?"** Step 2 (OTP): **"Pop in the code."**

---

## Brand mark

`FylosBilingualLockup` renders:

1. **φίλος** — the actual onboarding watercolor (`public/onboarding/philos.png`)
2. **FYLOS•** — Nunito Extra Bold with a coral dot, same `fontSize`

Both sit at the top of every auth screen, no tagline.

---

## Validation rules

| Field | Rule | Error copy |
| --- | --- | --- |
| First / Last name | ≥ 2 characters | "Two letters at least." |
| Email | basic `\S+@\S+\.\S+` regex | "That looks off. Try again?" |
| Password | ≥ 6 characters | "Six characters minimum." |
| Confirm password | matches `password` | "Passwords don't match yet." |
| Phone | `^[+]?[\d\s()-]{8,}$` | "Use a real number, please." |
| OTP | exactly 6 digits | — (button just stays disabled) |

Errors only appear after the first submit attempt for that field, and
clear as the user keeps editing.

---

## What's wired vs placeholder

**Wired (UI-only flows):**
- All client-side validation
- All transitions between screens
- Loading state on submit (700ms `setTimeout` mock)
- Magic-link "Link sent." in-place swap
- Phone OTP step transition (number → code grid)
- Forgot-password "Reset link sent." swap
- Verify-email resend acknowledgement
- Help sheet + Terms / Privacy popups
- Apple / Google buttons fire `alert('… coming soon.')`

**Needs backend (Panagiotis):**
- Magic-link send + click handler
- Password auth + session
- Phone OTP (Twilio or equivalent). **Cost note:** SMS to GR
  numbers is roughly `$0.05+` per text via Twilio. Recommend
  rate-limiting `send-code` server-side and adding a captcha
  before the first send.
- Apple sign-in (Sign in with Apple, native SDK on iOS)
- Google sign-in (One Tap or GIS)
- Email verification link handler
- Password reset link handler

---

## Onboarding hand-off

After the last onboarding slide (`/onboarding-v4` slide 5: "Earn with
Fylos"), the user lands on **`/create-account`**. From there, the path
diverges:

- Apple / Google → returns user data → dropped into the app, finish
  profile in-app
- Manual → step 1 (name) → step 2 (email + password) → `/verify-email` →
  `/add-pet`

The existing `/add-pet` flow (and everything after) is unchanged.

---

## Files

```
src/screens/FYLOS_AUTH_v1.jsx   ← everything: shell, primitives, sheets, 7 screens
src/App.jsx                     ← routes wired
FYLOS_AUTH_FLOW.md              ← this brief
```

Brand asset reused from onboarding: `public/onboarding/philos.png`.

---

## How to preview

```bash
npm install
npm run dev
# then visit http://localhost:5173/sign-in
```

The iPhone frame, Dynamic Island, and rounded bezel show automatically
on viewport ≥ 640px. Below that, the screen takes over the full
viewport like on a real device.
