# Habit Tracker

Personal habit-tracking PWA. React + Vite + TypeScript + Tailwind, Firebase (Auth + Firestore, offline-first), deployed to Cloudflare Pages via GitHub Actions.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind v4
- **PWA:** `vite-plugin-pwa` (Workbox service worker, installable manifest)
- **Data:** Firebase Auth (Google sign-in) + Firestore, with persistent local cache for offline use — logging a habit with no signal syncs once back online
- **Hosting:** Cloudflare Pages (free, no bandwidth cap)
- **CI/CD:** GitHub Actions → builds and deploys on push to `main`

## Setup

1. **Firebase project**
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable **Authentication → Google** sign-in provider
   - Create a **Firestore** database (production mode)
   - Deploy `firestore.rules` (or paste into the console Rules tab) — restricts each user to their own `users/{uid}/**` subtree
   - Copy the web app config into `.env.local` (copy from `.env.example`)

2. **Local dev**
   ```bash
   npm install
   cp .env.example .env.local   # fill in Firebase config
   npm run dev
   ```

3. **Deploy (Cloudflare Pages)**
   - Create a Pages project named `habit-tracker` in the Cloudflare dashboard (or via `wrangler pages project create habit-tracker`)
   - Add these repo secrets in GitHub (Settings → Secrets → Actions):
     - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
     - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
   - Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically

4. **Install as app**
   - Android: Chrome will prompt "Add to Home Screen" automatically
   - iOS: Safari → Share → Add to Home Screen (required once, manually — no auto-prompt). Push notifications only work after this step, on iOS 16.4+

## Not yet built

- Push notifications (FCM) for daily reminders
- Streak calculation / stats view
- Habit editing, reordering, archiving UI (data layer supports archive already)
