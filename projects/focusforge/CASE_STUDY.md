# FocusForge - Case Study

## Summary

FocusForge is a local-first gamified productivity web app that turns uninterrupted focus sessions into a growing idle civilization. The app combines a focus timer, resource generation, building upgrades, research unlocks, streaks, activity history, JSON export/import, and browser-only persistence into one polished static React product.

- **Live demo:** [https://focusforge-productivity-game.netlify.app/](https://focusforge-productivity-game.netlify.app/)
- **Runnable app:** [../../apps/focusforge](../../apps/focusforge)
- **Local port:** `http://127.0.0.1:5179/`
- **Status:** Runnable MVP + live static deployment target

## Problem

Traditional focus timers are useful but often disposable. They count down, then disappear without much sense of momentum. FocusForge explores a different pattern: convert protected attention into visible progress while keeping the workflow private, fast, and low-friction.

The product goal was to make focus feel rewarding without turning the app into a distracting game. The timer remains the core action; the civilization layer exists to reinforce consistent sessions, not replace the work.

## Product Decisions

- **Local-first by default:** No account, backend, analytics service, payment flow, or API key is required.
- **Short feedback loop:** Focus sessions immediately generate gold and research, which can be spent on buildings and technologies.
- **Progression with constraints:** Buildings have territory, cost, unlock, and maximum-count rules so growth feels intentional instead of arbitrary.
- **Distraction handling:** Page Visibility events create "disaster" pressure, while Barracks and Resilience systems mitigate penalties.
- **Recoverable sessions:** Refreshing during an active timer can recover the countdown without granting long offline income.
- **Portable data:** Chronicle export/import lets a user back up or move local progress without a server account.
- **Accessible polish:** The UI includes responsive layouts, reduced-motion support, keyboard-visible focus states, semantic controls, and readable contrast.

## Core Capabilities

- 15, 25, 45, 60, and 90-minute focus campaigns.
- Live countdown with pause, resume, abandon, and reset confirmation flows.
- Gold and research generation based on completed focus minutes.
- Six civilization tiers from Hamlet through Empire.
- Eight building types with unlock requirements and scaling costs.
- Ten research technologies with unlocks and global multipliers.
- Forge, Focus, Research, and Chronicle destinations.
- Seven-day activity heatmap, streaks, learned focus-window suggestions, and event history.
- Versioned local save model with legacy `ff_v4` migration.
- JSON export/import and guarded full reset.

## Technical Implementation

FocusForge is implemented as a Vite + React app with no backend runtime. The app separates product mechanics from UI rendering so the rules can be tested independently.

```text
apps/focusforge/
  src/components/   Shared app shell, timer, city, icon, and modal UI
  src/game/         Balance data, pure rules, persistence, and tests
  src/hooks/        Session controller and player actions
  src/screens/      Forge, Focus, Research, and Chronicle destinations
  src/utils/        Number and time formatting
```

Notable implementation details:

- Pure game functions cover purchases, unlocks, tier calculation, rates, session rewards, and history updates.
- Browser storage is versioned and guarded against malformed imports.
- Timer state is persisted separately from the main game save to reduce recovery edge cases.
- Static hosting headers restrict network connections with `connect-src 'none'`.
- Netlify configuration deploys the `dist/` bundle with SPA fallback and immutable asset caching.

## Quality Checks

The standalone app has focused unit coverage around the game engine, storage migration, and core app workflow.

```powershell
npm run lint --workspace apps/focusforge
npm run test:run --workspace apps/focusforge
npm run build --workspace apps/focusforge
```

The app was also browser-smoke-tested across the main Forge, Focus, Research, and Chronicle flows before portfolio integration.

## Portfolio Value

FocusForge demonstrates:

- Product-system thinking around motivation, habit loops, and progression design.
- Frontend state management for a non-trivial client-only app.
- Local persistence and migration discipline without a backend.
- Responsive application polish suitable for mobile and desktop review.
- Static deployment readiness with no secrets or service dependency.

## Responsible Scope

FocusForge is a productivity tool, not medical or mental-health software. It avoids clinical claims, does not diagnose attention issues, and does not upload behavioral data. Progress remains on the user's device unless they choose to export it.

## Future Improvements

- Add optional achievement filters and custom focus tags.
- Add printable weekly focus summaries from Chronicle.
- Add keyboard shortcuts for power users.
- Add more research branches and advanced late-game balancing.
- Add Playwright smoke tests for export/import and timer recovery flows.
