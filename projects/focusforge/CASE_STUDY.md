# FocusForge — Case Study

## Summary

FocusForge is a local-first gamified productivity web app that turns uninterrupted focus sessions into a growing idle civilization. The app combines a focus timer, resource generation, building upgrades, research unlocks, streaks, activity history, JSON export/import, and browser-only persistence into one polished static React product.

- **Runnable app:** [../../apps/focusforge](../../apps/focusforge)
- **Local port:** `http://127.0.0.1:5179/`
- **Deployment status:** Vercel Pending

The app includes Vercel SPA configuration. A production URL will be added only after Vercel reports a ready deployment and the focus, recovery, persistence, export, and responsive workflows are verified.

## Problem

Traditional focus timers are useful but often disposable. They count down, then disappear without much sense of momentum. FocusForge explores a different pattern: convert protected attention into visible progress while keeping the workflow private, fast, and low-friction.

The timer remains the core action; the civilization layer reinforces consistent sessions rather than replacing the work.

## Product Decisions

- **Local-first by default:** no account, backend, analytics service, payment flow, or API key is required.
- **Short feedback loop:** focus sessions generate gold and research that can be spent on buildings and technologies.
- **Progression with constraints:** buildings have territory, cost, unlock, and maximum-count rules.
- **Distraction handling:** Page Visibility events create disaster pressure, while Barracks and Resilience mitigate penalties.
- **Recoverable sessions:** refreshing during an active timer can recover the countdown without granting uncontrolled offline income.
- **Portable data:** Chronicle export/import lets a user back up or move local progress without a server account.
- **Accessible polish:** responsive layouts, reduced-motion support, visible keyboard focus, semantic controls, and readable contrast.

## Core Capabilities

- 15, 25, 45, 60, and 90-minute focus campaigns
- Live countdown with pause, resume, abandon, and reset confirmation flows
- Gold and research generation based on completed focus minutes
- Six civilization tiers from Hamlet through Empire
- Eight building types with unlock requirements and scaling costs
- Ten research technologies with unlocks and global multipliers
- Forge, Focus, Research, and Chronicle destinations
- Seven-day activity heatmap, streaks, learned focus-window suggestions, and event history
- Versioned local save model with legacy `ff_v4` migration
- JSON export/import and guarded full reset

## Technical Implementation

FocusForge is implemented as a Vite and React app with no backend runtime. The app separates product mechanics from UI rendering so rules can be tested independently.

```text
apps/focusforge/
  src/components/   Shared app shell, timer, city, icon, and modal UI
  src/game/         Balance data, pure rules, persistence, and tests
  src/hooks/        Session controller and player actions
  src/screens/      Forge, Focus, Research, and Chronicle destinations
  src/utils/        Number and time formatting
  vercel.json       Vercel build and SPA routing configuration
```

Notable implementation details:

- Pure functions cover purchases, unlocks, tier calculation, rates, session rewards, and history updates.
- Browser storage is versioned and guarded against malformed imports.
- Timer state is persisted separately from the main game save to reduce recovery edge cases.
- The standard workflow requires no runtime network requests.
- Vercel migration uses a static `dist/` build with SPA fallback.

## Quality Checks

```powershell
npm run lint --workspace apps/focusforge
npm run test:run --workspace apps/focusforge
npm run build --workspace apps/focusforge
```

The app has focused unit coverage around the game engine, storage migration, and core workflow. A Vercel preview must also be checked for timer recovery, import/export, visibility handling, direct-route refresh, mobile layout, and browser-console errors.

## Portfolio Value

FocusForge demonstrates:

- Product-system thinking around motivation, habit loops, and progression design
- Frontend state management for a non-trivial client-only app
- Local persistence and migration discipline without a backend
- Responsive application polish suitable for mobile and desktop review
- Vercel-ready static architecture with no secrets or service dependency

## Responsible Scope

FocusForge is a productivity tool, not medical or mental-health software. It avoids clinical claims, does not diagnose attention issues, and does not upload behavioral data. Progress remains on the user's device unless they choose to export it.

## What This Demonstrates for Employers

- Ability to turn a familiar productivity pattern into a more engaging product loop
- Comfort separating game and focus rules from React UI components
- Practical thinking around lightweight habit support, rewards, and user motivation
- Testable JavaScript logic for a small but complete interactive app
- Clear separation between deployment readiness and a verified live Vercel claim

## Future Improvements

- Complete and verify the Vercel production deployment.
- Add optional achievement filters and custom focus tags.
- Add printable weekly focus summaries from Chronicle.
- Add keyboard shortcuts for power users.
- Add more research branches and late-game balancing.
- Add Playwright smoke tests for export/import and timer recovery.