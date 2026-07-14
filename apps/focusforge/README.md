# FocusForge

FocusForge is a mobile-first productivity web app that turns uninterrupted focus sessions into a growing idle civilization. It is fully client-side, saves locally, and builds as a static Vite application.

## Deployment Status

FocusForge is configured for Vercel through `vercel.json`. A production Vercel alias is not claimed until a preview and production deployment are verified.

## What Is Included

- 15, 25, 45, 60, and 90-minute focus campaigns
- Live gold and research generation with pause and resume
- Page Visibility distraction disasters with Barracks and Resilience mitigation
- Six civilization tiers from Hamlet through Empire
- Eight buildings with territory, cost, unlock, and maximum-count rules
- Ten technologies with building unlocks and global multipliers
- Forge, Focus, Research, and Chronicle destinations
- Learned focus-window suggestions, seven-day activity heatmap, streaks, and event history
- Versioned local saves, `ff_v4` migration, JSON export/import, and guarded reset
- Responsive phone, tablet, and desktop layouts
- Reduced-motion support and keyboard-visible focus states

## Run Locally

Requirements: Node.js 22 or newer and npm.

```powershell
cd apps/focusforge
npm install
npm run dev
```

Open `http://127.0.0.1:5179`. If that port is occupied, Vite prints the alternate local URL.

The production preview command serves the built app at `http://127.0.0.1:4179`.

## Quality Checks

```powershell
npm run lint
npm run test:run
npm run build
```

The production bundle is written to `dist/`.

## Preview the Production Build

```powershell
npm run build
npm run preview
```

## Deploy to Vercel

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

```text
Project name: focusforge
Root Directory: apps/focusforge
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Branch: main
Node.js: 22
```

No backend routes, secrets, or server-side environment variables are required.

Use a preview deployment first and verify:

1. every campaign duration,
2. pause, resume, and completion behavior,
3. visibility-change distraction handling,
4. building and research unlocks,
5. refresh recovery during an active session,
6. save migration and JSON export/import,
7. guarded reset,
8. mobile, tablet, and desktop layouts,
9. reduced-motion and keyboard focus behavior,
10. direct-route refresh, assets, and browser console.

Promote only after Vercel reports `READY` and the complete smoke workflow succeeds.

## Save Behavior

- Current game key: `focusforge:v5`
- Recoverable timer key: `focusforge:v5:timer`
- Legacy migration source: `ff_v4`
- Progress remains on the device unless exported from Chronicle.
- Active sessions recover after refresh without granting uncontrolled offline income.

Browser storage is device- and profile-specific and is not encrypted or cloud-synchronized.

## Project Structure

```text
src/
  components/   Shared app shell, timer, city, icon, and modal UI
  game/         Immutable balance data, pure rules, persistence, and tests
  hooks/        Session controller and player actions
  screens/      Forge, Focus, Research, and Chronicle destinations
  utils/        Number and time formatting
docs/
  design/       Generated concept and browser verification captures
  superpowers/  Product design and implementation plan
vercel.json     Vercel build and SPA routing configuration
```

## Design Reference

The visual concept is stored at `docs/design/focusforge-concept.png`. The app preserves the Roman dark-fantasy identity, gold accent, balance tables, and client-only architecture while replacing the original single-component reference with a maintainable product structure.

## Responsible Scope

FocusForge is a productivity game and self-management aid. It does not diagnose or treat attention disorders, guarantee productivity, or replace medical or mental-health care.