# FocusForge Product Design

## Product

FocusForge is a mobile-first productivity app that turns uninterrupted focus sessions into the growth loop of a compact idle civilization. A session produces gold and research while the page remains visible. Completing the session awards a gold bonus and territory. Leaving the page during an active session ends the session with a randomized disaster.

The attached `FocusForge (3).jsx` is the balance and behavior baseline. The attached build prompt is the requirements baseline. The new app is isolated in `C:/Users/Atomic/Documents/New project/focusforge` and does not modify any prior project.

## Platform

- Standalone React 18+ application built with Vite.
- Plain JavaScript and JSX.
- Static deployment with no backend or account system.
- Versioned localStorage persistence under `focusforge:v5` with migration support for the reference `ff_v4` save.
- Responsive shell: phone-first, tablet two-column Forge layout, and a desktop command-board layout.

## Visual System

- Dark Roman workshop and archive character rather than a generic dashboard.
- Near-black charcoal canvas, bronze borders, parchment text, and `#f5a623` forge-gold as the primary accent.
- Cinzel for display and navigation, Crimson Text for prose, and tabular system numerals for resource and timer values.
- Stone, bronze, and ember texture is expressed through CSS gradients and restrained noise-like patterning so the interface remains crisp and fast.
- The generated concept at `docs/design/focusforge-concept.png` is the visual reference. Existing building emoji are retained because the source explicitly defines them as the game language.

## Information Architecture

### Forge

The primary command screen includes civilization identity and progress, settlement grid, live production rates, focus-duration selector, session launch control, and the building roster. Locked buildings explain which research unlocks them. Purchases require both available gold and unoccupied territory.

### Focus

The active state centers a circular countdown ring, session intention, live income, settlement activity, pause/resume controls, and a deliberate abandon action. Completion shows total passive earnings, completion bonus, and territory gained. A distraction shows the disaster, exact losses, building damage, and active mitigations.

### Research

The technology tree preserves the ten reference technologies, costs, unlocks, and multipliers. Dependencies create an understandable progression without changing costs. The selected technology receives a detailed explanation and one clear action.

### Chronicle

The Chronicle includes lifetime totals, current and best streak, seven-day focus heatmap, learned focus-window suggestions based on completed-session timestamps, event history, save export/import, and guarded reset.

## Game Rules

- Preserve the six civilization tiers and cumulative-gold thresholds.
- Preserve all building costs, production rates, maximum counts, technology costs/effects, disaster percentages, and 15/25/45/60/90-minute presets.
- Passive income is awarded once per elapsed second only while a session is active and visible.
- Completion bonus remains five gold per selected minute and completion adds one territory.
- Resilience halves disaster gold damage. Each Barracks reduces remaining damage by 15%, with a minimum multiplier of 30%.
- Great Fire destroys one random owned building when possible.
- Pausing is allowed but produces no resources and does not count down. Hiding the page while paused is not a disaster.

## Data Model

Persistent state contains resources, cumulative totals, buildings, unlocked buildings, researched technology IDs, event log, completed-session records, streak data, preferences, and schema version. Timer state is separately persisted with wall-clock timestamps so refreshes cannot duplicate earnings or reset an active session.

## Reliability And Accessibility

- Corrupt or incompatible saves recover to a validated default state.
- Save import validates the schema before replacing progress.
- Timer controls use accessible labels and keyboard-visible focus states.
- Motion respects `prefers-reduced-motion`.
- The app warns before abandoning an active session and before resetting progress.
- All core game calculations are pure functions covered by unit tests; major player workflows are covered by component tests and a browser smoke pass.

