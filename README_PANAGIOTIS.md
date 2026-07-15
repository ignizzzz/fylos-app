# FYLOS — app handoff

This is the full Fylos app: a React + Vite single-page app, wrapped with
Capacitor for iOS. All screen data is currently mock/hardcoded — there is
no backend wired in yet. This is the package to connect to the database.

## Stack
- React 18 + Vite 5, React Router 6, Tailwind CSS 3, lucide-react icons
- Capacitor 7 for the iOS build (`ios/` folder, CocoaPods)
- Node 20+

## What's NOT in this zip (regenerate these)
- `node_modules/`  → run `npm install`
- `dist/`          → run `npm run build`
- `ios/App/Pods/`  → run `cd ios/App && pod install` (or `npx cap sync ios`)

## Run it on the web (fastest way to see it)
```bash
npm install
npm run dev      # opens http://localhost:3000
```

## Build the web bundle
```bash
npm run build    # outputs to dist/
```

## Run it on an iPhone (Capacitor + Xcode)
```bash
npm run build
npx cap sync ios
npx cap open ios   # opens Xcode → pick device → Run
```
Bundle id: `com.fylos.app` · App name: Fylos

## First-run flow & state
The app fakes auth/onboarding with browser storage flags (no backend):
- `localStorage['fylos.intro']` = '1' once onboarding is seen
- `localStorage['fylos.auth']`  = '1' once "signed in"
- `sessionStorage` `fylos.warm`, `fylos.tab`, `fylos.proMode` = in-session UI state
Clear localStorage to replay the full first-run: onboarding → sign-in →
welcome → add pet → dashboard. Logout clears these and returns to onboarding.

## Where things live
- `src/App.jsx`          → all routes + the auth gate (RootGate)
- `src/screens/`         → every screen (the unified app shell is
                           `06_PETS_ProfileShell_Documents_v1.jsx`)
- `src/features/`        → services / social feature folders
- `public/brand/`        → logos + app icons
- `FYLOS_*.md`           → product direction, design system, tech brief

## Database — what's needed to wire it
The app reads from mock objects inside the screen files. To connect the DB,
the entry point is the data layer (currently inline mock arrays). Send the
DB connection string + keys and we can add a data client.
