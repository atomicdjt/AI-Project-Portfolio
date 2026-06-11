# ScamShield AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, accessible, local-first scam evidence and prevention MVP that can be demonstrated locally and deployed as a static Netlify site.

**Architecture:** Pure TypeScript domain modules perform all analysis, extraction, scoring, checklist, timeline, storage, and report preparation. A typed Zustand store coordinates a five-step React workflow, while CSS provides the custom civic-tech visual system without runtime services.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, Lucide React, jsPDF, Vitest, Testing Library, Playwright, ESLint, Netlify.

---

### Task 1: Standalone project and test harness

**Files:** `package.json`, TypeScript/Vite/ESLint/Vitest/Playwright configuration, `index.html`, `src/test/setup.ts`

- [ ] Create the isolated package and quality scripts without changing the workspace root.
- [ ] Install dependencies and verify the test runner starts.
- [ ] Add a failing smoke test that expects the ScamShield application shell.

### Task 2: Typed domain model and deterministic engine

**Files:** `src/types/*`, `src/data/scamPatterns.ts`, `src/lib/analyzeScam.ts`, `src/lib/riskScoring.ts`, `src/lib/extractEntities.ts`, `src/lib/safetyChecklist.ts`, `src/lib/timelineSuggestions.ts`, `src/lib/storage.ts`

- [ ] Write failing unit tests for every scoring band, severity weight, category match, URL heuristic, entity type, sensitive-data warning, checklist branch, and timeline suggestion.
- [ ] Implement the minimum pure functions needed to pass each test.
- [ ] Refactor shared normalization and deduplication while keeping all tests green.

### Task 3: Demo and reporting data

**Files:** `src/data/demoCases.ts`, `src/data/reportingResources.ts`, `src/test/demoCases.test.ts`

- [ ] Write tests requiring five clearly fake, analysis-ready demo cases.
- [ ] Add official reporting resource configuration and safe-channel guidance.
- [ ] Verify demos produce their expected risk categories without containing real personal data.

### Task 4: State and persistence

**Files:** `src/store/useCaseStore.ts`, `src/test/store.test.ts`

- [ ] Write failing tests for case reset, demo loading, analysis updates, checklist state, timeline edits, mode toggles, and safe persisted-state hydration.
- [ ] Implement the typed Zustand store and versioned localStorage adapter.
- [ ] Confirm clearing data removes both active state and persisted evidence.

### Task 5: Accessible workflow UI

**Files:** `src/App.tsx`, `src/components/**`, `src/styles.css`, `src/main.tsx`

- [ ] Write component tests for landing actions, case intake, caregiver fields, evidence warnings, analysis results, timeline editing, reporting guidance, privacy clearing, and export consent.
- [ ] Implement the five-step responsive workflow with semantic landmarks, labels, live regions, focus states, and plain-language variants.
- [ ] Match the approved calm civic-tech concept at desktop and mobile sizes.

### Task 6: PDF and print output

**Files:** `src/lib/pdfReport.ts`, `src/components/export/ExportReportPanel.tsx`, `src/components/checklist/SafetyChecklist.tsx`

- [ ] Write tests for deterministic report-section preparation and sensitive-information warning behavior.
- [ ] Implement a multi-page jsPDF evidence packet with cover, risk, evidence, findings, timeline, checklist, reporting, notes, and privacy sections.
- [ ] Add print-only checklist styling and a user-visible export confirmation.

### Task 7: Public documentation and deployment

**Files:** `README.md`, `EVALUATION.md`, `ROADMAP.md`, `SECURITY.md`, `LICENSE`, `netlify.toml`, `.gitignore`

- [ ] Document the problem, users, feature set, safety boundaries, privacy model, local commands, limitations, evaluation, funding position, and roadmap.
- [ ] Add Netlify build and security-header configuration with no environment variables.
- [ ] Add a responsible-disclosure placeholder that does not imply active monitoring.

### Task 8: Verification and security review

**Files:** all project files and `e2e/scamshield.spec.ts`

- [ ] Run `npm run lint`, `npm run typecheck`, `npm run test -- --run`, and `npm run build`; fix every failure.
- [ ] Run the Codex Security scan, confirm no active crawling, credential collection, or unsafe link behavior, and fix actionable findings.
- [ ] Start the app, run Playwright desktop/mobile smoke tests, and inspect final screenshots.
- [ ] Confirm the root workspace and every pre-existing sibling project remain untouched.
