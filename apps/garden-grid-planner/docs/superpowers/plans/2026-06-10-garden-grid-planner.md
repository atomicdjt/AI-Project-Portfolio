# GardenGrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch a polished local-first visual garden-bed spacing planner with square-foot and row modes, a 40-plant library, validation, local saves, and printable/portable exports.

**Architecture:** A static React/Vite application keeps plan state in a versioned Zustand store. Pure TypeScript domain modules own unit conversion, layout generation, validation, summary calculations, and export serialization; React components render an accessible HTML/CSS planning surface and responsive rails.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, Zod, Lucide React, Vitest, Testing Library, Playwright, ESLint, CSS.

---

## File Map

- `src/domain/types.ts`: plan, bed, plant, placement, issue, and persisted schema types.
- `src/domain/plants.ts`: curated built-in plant catalog and lookup/filter helpers.
- `src/domain/units.ts`: metric/imperial conversions and labels.
- `src/domain/layout.ts`: snapping, square-foot placement, and row generation.
- `src/domain/validation.ts`: boundary and spacing issue detection.
- `src/domain/summary.ts`: plan counts and area estimates.
- `src/domain/export.ts`: CSV and JSON serialization.
- `src/store/useGardenStore.ts`: versioned plan lifecycle, editing, selection, persistence, and undo/redo.
- `src/components/AppHeader.tsx`: identity, plan selection, save status, units, and exports.
- `src/components/PlantLibrary.tsx`: search, filters, and plant selection.
- `src/components/BedToolbar.tsx`: dimensions, presets, modes, history, and zoom.
- `src/components/GardenBed.tsx`: scaled bed, grid, placements, pointer and keyboard placement.
- `src/components/Inspector.tsx`: selected plant controls, plan summary, issues, and notes.
- `src/components/MobileTabs.tsx`: narrow-screen navigation.
- `src/App.tsx`: responsive application shell and dialogs.
- `src/styles.css`: visual system, layout, responsive behavior, and print styles.
- `src/test/*`: unit and component tests.
- `e2e/garden-grid.spec.ts`: primary user workflow.
- `README.md`: features, commands, storage/export behavior, and limitations.

### Task 1: Scaffold and Domain Contracts

- [ ] Create the Vite/React/TypeScript package, lint, test, and Playwright configuration.
- [ ] Write failing tests for unit conversion, plant lookup, square-foot positions, and row generation.
- [ ] Run the focused tests and confirm failures are caused by missing modules.
- [ ] Implement `types.ts`, `plants.ts`, `units.ts`, and `layout.ts` with normalized centimeter values.
- [ ] Run the focused tests to green and commit the domain foundation.

### Task 2: Validation, Summary, and Exports

- [ ] Write failing tests for out-of-bounds placements, minimum-spacing overlaps, plan totals, CSV output, and JSON round trips.
- [ ] Run the focused tests and confirm the expected failures.
- [ ] Implement `validation.ts`, `summary.ts`, and `export.ts` as pure functions.
- [ ] Run all domain tests to green and commit calculation behavior.

### Task 3: Versioned Store and Plan Lifecycle

- [ ] Write failing store tests for starter-plan creation, add/move/delete placement, unit/mode updates, undo/redo, duplicate/delete plan, and persisted schema recovery.
- [ ] Run store tests and confirm failures.
- [ ] Implement the bounded-history Zustand store with versioned local storage and stable plan IDs.
- [ ] Run store and domain tests to green and commit application state.

### Task 4: Core Planner Interface

- [ ] Write failing component tests for library search, plant selection, click-to-place, mode switching, dimension presets, and selected placement deletion.
- [ ] Run component tests and confirm failures.
- [ ] Implement the app shell, header, library, toolbar, accessible bed surface, and inspector.
- [ ] Implement placement previews, square-foot grid, row grid, issue highlighting, live announcements, and keyboard controls.
- [ ] Run component and domain tests to green and commit the working planner.

### Task 5: Persistence, Export, Responsive, and Print UX

- [ ] Write failing component tests for plan creation/duplication, JSON import/export triggers, CSV generation, and mobile tab navigation.
- [ ] Run the focused tests and confirm failures.
- [ ] Implement local-save feedback, plan dialogs, JSON import/export, CSV download, print action, responsive drawers/tabs, and print report styles.
- [ ] Add error boundaries, invalid-dimension handling, import failure messaging, empty states, and reduced-motion behavior.
- [ ] Run the full unit/component suite to green and commit product-completion behavior.

### Task 6: Documentation and End-to-End Verification

- [ ] Write the end-to-end test for load, plant search, placement, spacing warning, row-mode placement, persistence reload, and export action.
- [ ] Run the e2e test and fix only failures demonstrated by the test.
- [ ] Write `README.md` with exact install, development, test, build, preview, storage, and export instructions.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`, and `npm run e2e`.
- [ ] Launch the app locally and verify desktop and mobile workflows, console health, responsive layout, and visual fidelity against the approved concept.
- [ ] Commit the verified application and leave the local server running for handoff.

## Acceptance Checklist

- [ ] Existing projects outside `garden-grid-planner` are unchanged.
- [ ] The catalog contains at least 40 vegetables and herbs with both spacing models.
- [ ] Square-foot and row placement are visually distinct and functional.
- [ ] Spacing and boundary issues are visible in the bed and inspector.
- [ ] Imperial/metric display, multiple plans, undo/redo, local persistence, CSV, JSON, and print are functional.
- [ ] Desktop, tablet, and mobile layouts remain usable.
- [ ] Automated checks and browser verification pass with no relevant console errors.
