# Fylos · Technical Brief

> Ένα document για να αρχίσουμε να χτίζουμε. Από web prototype → Swiss App Store σε 4 μήνες.
>
> **Audience**: developer (Παναγιώτης) + founder (Ιάκωβος)
> **Status**: ready for review · χρειάζονται sign-off σε 3 αποφάσεις (βλ. τέλος)

---

## 1. Που είμαστε σήμερα

- **90+ screens** σε React + Vite + Tailwind, mock data, χωρίς backend
- Live demo: https://fylos-mobile-ui-viewer-cebkvqo0u.vercel.app
- Design system: warm minimal, peach/coral palette (#E85D2A), Inter font, iPhone frame
- **Στόχος**: Swiss App Store launch σε 4 μήνες · μετά Northern Europe · μετά Greece (homecoming)

## 2. Τι θα χτίσουμε — 4 κομμάτια

```
1. MOBILE APP        → iPhone (πρώτα) + Android (Q2 2026)
2. BACKEND           → Database + Auth + File storage + Realtime
3. MARKETING SITE    → fylos.app (waitlist → public site)
4. OPERATIONS        → Email · Push · Analytics · Errors · Maps
```

## 3. Stack — η απόφαση

### 3.1 Mobile app: **Expo + React Native + NativeWind**

**Γιατί**:
- Reuse 80%+ του υπάρχοντος React/Tailwind κώδικα
- Single codebase για iPhone + Android + Web
- NativeWind = Tailwind classes που τρέχουν native (το design system μεταφέρεται 1:1)
- EAS Build/Submit κάνει iOS deployment χωρίς να μάθεις Xcode

**Τι ΔΕΝ διαλέγουμε**:
- Native Swift/SwiftUI: ξεκινάς από zero, χάνεις 90 screens
- Capacitor (wrap το web app): performance compromise, δείχνει "web app"
- Flutter: άσχετη γλώσσα (Dart), χάνουμε React γνώσεις

### 3.2 Backend: **Supabase** (Frankfurt region)

**Γιατί ένα service**:
- Postgres database
- Auth (email + Apple Sign In + Google + biometric)
- File storage (pet photos, documents)
- Realtime (για future chat)
- Edge Functions (server-side logic)
- Row-Level Security (built-in permissions)

**Region: Frankfurt (eu-central-1)** — όχι US. Λόγος: GDPR + Swiss nLPD compliance. User data ζουν στην ΕΕ. Marketing angle.

### 3.3 Marketing site: **Framer**

`fylos.app` waitlist → μετά full marketing site. Drag-and-drop, premium aesthetic. Cloudflare DNS.

### 3.4 Operations stack

| Need | Service | Plan |
|------|---------|------|
| Email (transactional + marketing) | **Resend** | Free <3K, $20 για 50K |
| Push notifications | **Expo Push** | Free |
| Maps (Safety, Places) | **Mapbox** | Free <50K loads |
| Analytics | **PostHog EU** | Free <1M events |
| Error monitoring | **Sentry EU** | Free <5K errors, $26 Team |
| Subscriptions (post-launch) | **RevenueCat** | Free <$2.5K MRR |
| Translations | **DeepL Pro** | €8/μήνα |

## 4. Hosting map — που ζει τι

| Component | Service | Region | URL |
|-----------|---------|--------|-----|
| App code | GitHub | US | github.com/fylos/fylos-app |
| App builds | Expo EAS | US | expo.dev/accounts/fylos |
| App distribution | Apple App Store | EU edge | apps.apple.com |
| **Database** | **Supabase Postgres** | **Frankfurt** | xxxxx.supabase.co |
| **File storage** | **Supabase Storage** | **Frankfurt** | xxxxx.supabase.co/storage |
| **Auth** | **Supabase Auth** | **Frankfurt** | xxxxx.supabase.co/auth |
| Marketing site | Framer | Global CDN | fylos.app |
| Domain & DNS | Cloudflare | Global | — |
| Email | Resend | EU | — |
| Maps | Mapbox | Global CDN | — |
| Analytics | PostHog EU | Frankfurt | eu.posthog.com |
| Errors | Sentry EU | Frankfurt | sentry.io (EU instance) |

## 5. Database schema — MVP (v1.0)

10 tables. SQL migrations στο GitHub repo (versioned).

```
users
  ├── id (uuid, pk)
  ├── email (text, unique)
  ├── name (text)
  ├── locale (text)         -- 'de-CH' | 'fr-CH' | 'en' | 'el'
  ├── country (text)        -- ISO code
  ├── created_at (timestamptz)
  └── apple_user_id (text)  -- για Apple Sign In

pets
  ├── id (uuid, pk)
  ├── name (text)
  ├── species (enum)        -- 'dog' | 'cat' | 'other'
  ├── breed (text)
  ├── birthdate (date)
  ├── current_weight_kg (numeric)
  ├── photo_url (text)
  └── created_at (timestamptz)

pet_owners                  -- many-to-many: shared pet access
  ├── pet_id (fk → pets)
  ├── user_id (fk → users)
  └── role (enum)           -- 'primary' | 'co-owner' | 'view'

vaccinations
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── name (text)           -- 'DHPP', 'Rabies', etc.
  ├── given_at (date)
  ├── due_at (date)
  ├── vet_id (fk → vets, nullable)
  └── notes (text)

medications
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── name (text)
  ├── dosage (text)
  ├── frequency (text)      -- 'daily', '2x daily', etc.
  ├── started_at (date)
  └── ended_at (date, nullable)

weight_log
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── weight_kg (numeric)
  └── recorded_at (timestamptz)

documents
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── type (enum)           -- 'passport' | 'health_cert' | 'insurance' | 'other'
  ├── title (text)
  ├── file_url (text)       -- Supabase Storage path
  ├── uploaded_at (timestamptz)

vets
  ├── id (uuid, pk)
  ├── name (text)
  ├── address (text)
  ├── phone (text)
  ├── lat (numeric)
  ├── lng (numeric)

vet_visits
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── vet_id (fk → vets)
  ├── visit_date (date)
  ├── notes (text)

pet_health_reminders
  ├── id (uuid, pk)
  ├── pet_id (fk → pets)
  ├── type (enum)           -- 'vaccine' | 'medication' | 'vet_visit' | 'custom'
  ├── title (text)
  ├── due_at (timestamptz)
  ├── recurring (text)      -- cron-style ή 'monthly', etc.
  ├── completed_at (timestamptz, nullable)

notifications
  ├── id (uuid, pk)
  ├── user_id (fk → users)
  ├── type (text)
  ├── title (text)
  ├── body (text)
  ├── data (jsonb)
  ├── read_at (timestamptz, nullable)
  └── created_at (timestamptz)
```

**Row-Level Security (RLS)**: ενεργό σε όλα τα tables. Ένας user βλέπει μόνο pets που είναι στο `pet_owners` join. Supabase αυτό built-in.

### Επεκτάσεις για v1.1 (3 μήνες μετά v1.0)
`playdates`, `playdate_matches`, `safety_reports`, `friendships`, `activity_posts`

### Επεκτάσεις για v2.0 (6 μήνες μετά v1.0)
`pro_walkers`, `bookings`, `chats`, `chat_messages`, `subscriptions`

## 6. MVP feature scope — τι μπαίνει στο v1.0

**Συμπεριλαμβάνεται** (~25 από τα 90 screens):
- Onboarding + Create Account + Apple Sign In + biometric unlock
- Add Pet (με photo upload)
- Pet Profile: About + Health + Documents + Emergency tabs
- Pet selector carousel
- Home Dashboard (greeting, today timeline, alerts, quick log)
- Health Reminders (vaccines, meds)
- Vault: Documents + Health Records + Emergency Contacts
- Notifications inbox
- Settings (basic): Language, Notifications, Privacy, Account
- Help Center

**ΔΕΝ μπαίνει στο v1.0** (μένουν για v1.1+):
- Activity Feed / Friends System
- Playdate Matching
- Safety Reports map
- Services marketplace (walkers, sitters, vet booking)
- Pro side (walker dashboard, earnings)
- Chat / messaging
- Subscriptions / payments

**Λόγος**: shippable σε 4 μήνες. Κάθε feature που προσθέτουμε στο v1.0 = +2 εβδομάδες. Πρέπει να σαλπάρουμε με κάτι σφιχτό και να προσθέτουμε γρήγορα.

## 7. 16-εβδομάδες roadmap

| Εβδ. | Φάση | Παραδοτέο |
|------|------|-----------|
| 1 | Setup | Όλα τα accounts. Repo. Expo init. Supabase project. Domain. |
| 2 | Backend foundation | Migrations για 10 tables · Auth (email + Apple) · Storage bucket για photos |
| 3-4 | First 5 screens | Onboarding · Create Account · Add Pet · Pet Profile (About) · Home Dashboard — wired to backend |
| 5-6 | Health stack | Pet Profile (Health + Documents) · Health Reminders · Vaccinations CRUD |
| 7-8 | Vault + Notifications | Vault tabs · Notifications inbox · Push notifications |
| 9-10 | Settings + polish | Settings · Privacy · Language switching · Localization (DE/FR/EN/IT) |
| 11 | Native polish | Biometric unlock · Apple Health sync · Calendar sync · deep links |
| 12 | Internal testing | Internal builds μέσω TestFlight · 5-10 testers (φίλοι, οικογένεια) |
| 13 | Public beta | TestFlight public · 50-100 Swiss waitlist signups · bug fixing |
| 14 | App Store prep | Screenshots σε DE/FR/EN/IT · App Store description · Privacy policy live · Press kit |
| 15 | Apple submission | EAS Submit · Apple review (~5-7 μέρες) · respond σε rejection comments |
| 16 | Swiss launch | Public release στο Swiss App Store · Marketing campaign goes live |

## 8. Costs — αναλυτικά

### Setup (one-time)
| Item | Cost |
|------|------|
| Apple Developer Program | €99/year |
| Domain `fylos.app` | €12/year (Cloudflare at-cost) |
| Privacy policy (Termly) ή δικηγόρος | €0 (Termly free) ή €800-1500 |
| Business entity (Greek IKE) | €200-500 |
| **Total setup** | **€311-2,011** |

### Pre-launch monthly (Phase 1, εβδομάδα 1-12)
| Service | €/μήνα |
|---------|--------|
| Supabase Pro | 23 |
| Cursor Pro | 18 |
| Claude/ChatGPT Pro | 18 |
| Framer Mini | 5 |
| **Subtotal essential** | **64** |
| Figma Pro (optional) | 12 |
| DeepL Pro | 8 |
| **Total** | **~70-85/μήνα** |

### Post-launch monthly (Phase 2, first 1K users)
| Service | €/μήνα |
|---------|--------|
| Supabase Pro | 23 |
| Expo EAS Production | 18 |
| Mapbox (after free tier) | 0-30 |
| Resend Pro | 19 |
| Sentry Team | 24 |
| PostHog Scale | 0-50 |
| Termly Pro | 25 |
| Framer Basic | 14 |
| Apple Developer | 8 |
| Tools (Cursor, Claude, Figma) | 50 |
| **Total** | **~180-260/μήνα** |

### Apple's cut από subscriptions
- **15%** (Small Business Program — έως $1M revenue) από κάθε in-app subscription
- RevenueCat: 0% extra μέχρι $2.5K MRR

## 9. Επιπλέον non-tech που χρειάζεται

### Νομικά (πριν το launch)
- [ ] Privacy policy (EN + DE + FR + IT)
- [ ] Terms of Service
- [ ] AGB (Swiss German contract terms)
- [ ] GDPR Data Processing Agreement (Supabase, Resend, Sentry, PostHog)
- [ ] Cookie banner στο fylos.app

### Brand assets (πριν το launch)
- [ ] App icon (1024×1024 master) → auto-generates όλα τα sizes
- [ ] App Store screenshots: 6.7" + 5.5" iPhone × 4 γλώσσες = 8+ unique
- [ ] App preview video 30s (optional, +30% downloads)
- [ ] Press kit (logo, founder photo, 3 hero screens)

### Επιχειρηματικά
- [ ] Greek IKE (ή Swiss GmbH αργότερα)
- [ ] Bank account
- [ ] Apple Developer enrolled με business entity
- [ ] Stripe ή RevenueCat account (όταν προστεθούν payments)

## 10. Επόμενα 5 πράγματα που χρειάζονται απόφαση

1. **MVP scope confirmation** — συμφωνούμε ότι Activity / Playdates / Safety Reports / Pro βγαίνουν από v1.0; Yes/No
2. **Multi-pet ή single-pet account;** — πιθανώς multi (DB schema είναι έτοιμο για αυτό), αλλά να επιβεβαιώσουμε
3. **Free vs Freemium subscription;** — αν freemium, χρειάζεται RevenueCat + Stripe από day 1. Αν free, αργότερα.
4. **Business entity;** — Greek IKE τώρα, Swiss GmbH αργότερα; Ή κάτι άλλο;
5. **Pet types στο v1.0;** — μόνο σκύλοι, ή και γάτες; (Affects copywriting + UI nuances)

## 11. Day 1 checklist για τον Παναγιώτη

- [ ] Cloudflare account → register `fylos.app`
- [ ] GitHub org `fylos` + repo `fylos-app` (private)
- [ ] Apple Developer enrollment (Greek IKE ή προσωπικό για start)
- [ ] Supabase account → 2 projects: `fylos-staging` + `fylos-prod` σε **Frankfurt region**
- [ ] Expo account + EAS access
- [ ] Resend account + verify `fylos.app` domain
- [ ] Sentry EU + PostHog EU + Linear + Notion accounts
- [ ] Cursor + Claude/ChatGPT Pro subscriptions
- [ ] First commit στο `fylos-app`: Expo blank template + NativeWind setup
- [ ] First migration: `users` + `pets` + `pet_owners` tables στο Supabase staging

Εκτιμώμενος χρόνος Day 1: **4-5 ώρες** για όλο το onboarding.

---

**Status**: draft v1 · ready for Παναγιώτη review
**Next sync**: μετά τις 5 αποφάσεις του §10
