# FocusForge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally launch a polished, fully client-side FocusForge productivity idle game without changing existing projects.

**Architecture:** A Vite React app separates immutable game data, pure game rules, persistence, the timer/session controller, and focused UI components. Persistent game data uses a versioned localStorage adapter while transient presentation state stays in React.

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS, localStorage, Page Visibility API

---

### Task 1: Scaffold The Isolated App

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/styles.css`

- [ ] Add Vite, React, Vitest, Testing Library, jsdom, and ESLint scripts and dependencies.
- [ ] Add the root HTML, React mount point, font preconnects, metadata, and theme color.
- [ ] Add the global design tokens, responsive shell rules, focus states, and reduced-motion behavior.

### Task 2: Build The Game Rules With TDD

**Files:**
- Create: `src/game/data.js`
- Create: `src/game/engine.test.js`
- Create: `src/game/engine.js`

- [ ] Write failing tests for civilization levels, level progress, production rates, building purchase validation, research application, disaster mitigation, session completion rewards, focus-window analysis, and save validation.
- [ ] Run `npm test -- --run src/game/engine.test.js` and confirm failures are caused by missing exports.
- [ ] Implement the smallest pure functions needed to satisfy each rule while preserving the reference tables exactly.
- [ ] Re-run the focused suite and refactor only after it passes.

### Task 3: Add Persistence And Session Recovery With TDD

**Files:**
- Create: `src/game/storage.test.js`
- Create: `src/game/storage.js`
- Create: `src/hooks/useFocusForge.js`

- [ ] Write failing tests for default loading, corrupt-save fallback, legacy `ff_v4` migration, export/import validation, and active-timer snapshot normalization.
- [ ] Implement the versioned storage adapter and migration.
- [ ] Implement the session hook with interval cleanup, pause/resume, visibility disasters, wall-clock reconciliation, event logging, and save synchronization.
- [ ] Run the storage and engine suites together.

### Task 4: Build The Product UI

**Files:**
- Create: `src/App.jsx`
- Create: `src/components/AppHeader.jsx`
- Create: `src/components/AppNavigation.jsx`
- Create: `src/components/CityGrid.jsx`
- Create: `src/components/CountdownRing.jsx`
- Create: `src/components/Modal.jsx`
- Create: `src/screens/ForgeScreen.jsx`
- Create: `src/screens/FocusScreen.jsx`
- Create: `src/screens/ResearchScreen.jsx`
- Create: `src/screens/ChronicleScreen.jsx`

- [ ] Add a failing component smoke test that expects all four navigation destinations and the Forge launch workflow.
- [ ] Implement the responsive app shell and shared components from the approved concept.
- [ ] Implement all four screens with real game state, disabled states, confirmations, import/export, and empty states.
- [ ] Add ARIA labels, live regions, keyboard focus treatment, and mobile-safe controls.

### Task 5: Validate And Launch

**Files:**
- Create: `README.md`
- Create: `src/App.test.jsx`
- Copy: `docs/design/focusforge-concept.png`

- [ ] Run `npm run lint`, `npm test -- --run`, and `npm run build` and fix all failures.
- [ ] Start Vite on `127.0.0.1` and verify Forge, building purchase, Research, Focus start/pause/resume, Chronicle, persistence, and reset protection in the Browser plugin.
- [ ] Capture desktop and phone screenshots, inspect them against the generated concept, and repair visible mismatch or overflow.
- [ ] Document exact setup, run, test, build, persistence, and deployment instructions in `README.md`.

