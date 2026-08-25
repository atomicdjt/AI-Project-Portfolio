# Portfolio flagship reconciliation implementation plan

**Objective:** Remove the confirmed contradiction between Portfolio Hub metadata/static discovery and its interactive recruiter-facing catalogue, while preserving truthful audience-specific routes and evidence boundaries.

**Evidence used:** `main` at `8234022`; current GitHub/CI state; Vercel production records; canonical project pages; and the August 25 source audit. The current Portfolio Hub source SHA is *not* deployment-verified because the controlled Vercel deploy was quota-blocked; this change must not claim otherwise.

## Architecture decision

Use four named **core technical flagships**: Validation Ledger, Agent Session Bridge, BuildWorld AI, and WeaveStudio. They are distinct from:

- an **employer/operations review path** (ProcessHarbor and the projects that best evidence role fit);
- an **external technical-proof path** (accepted upstream GitHub contributions);
- a **commercial/buyer path** (WeaveStudio and QuoteForge Local).

This is not a universal ranking and it does not imply adoption, customers, revenue, company endorsement, scientific validation, or current deployment of this branch.

## Task 1 — Add a regression guard for the public hierarchy

**Files:** `tests/portfolio-hub/flagship-review-path.test.mjs` (new), `package.json`.

1. Add a Node test that reads the Portfolio Hub source and fails unless the interactive catalogue contains Validation Ledger, Agent Session Bridge, BuildWorld AI, and WeaveStudio.
2. Make it fail against the current source before changing the application.
3. Add a focused `test:portfolio-hierarchy` script, and keep the check narrow: it asserts the architecture boundary rather than snapshots all prose.

## Task 2 — Reconcile the interactive Portfolio Hub

**Files:** `apps/portfolio-hub/src/App.jsx`, `apps/portfolio-hub/index.html` only if structured metadata needs a truthful wording alignment.

1. Add first-class project-card/catalogue entries for Validation Ledger and Agent Session Bridge, with their authoritative repositories, canonical project pages, current verified package/live status, and narrow evidence statements.
2. Add a `Technical` audience and a `Published` status option where needed so catalogue filters remain semantically correct.
3. Separate the core technical-flagship collection from the employer/operations collection. Do not call the employer subset “the three flagships.”
4. Make `/review` follow the core technical-proof sequence, while the employer section retains role-fit framing and the commercial section retains its non-traction disclaimer.

## Task 3 — Reconcile public written paths and stale records

**Files:** `README.md`, `docs/recruiter-quick-review.md`, `docs/EMPLOYER_OVERVIEW.md`, `docs/PROJECT_INDEX.md`, `docs/project-ranking.md`, `docs/accessibility/PLAN2A_STATUS.md`, `docs/accessibility/PLAN2B_STATUS.md`.

1. Document the four technical flagships and audience-specific review paths consistently across recruiter and employer documents.
2. Add Validation Ledger and Agent Session Bridge to the human-readable Project Index with source authority and claim boundaries.
3. Correct VariantVision’s status from “deployment pending” to a narrowly worded live Vercel deployment statement; retain non-diagnostic and deployment-evidence limits.
4. Correct accessibility status files to say source-level remediation is merged. Keep provider-proven production retest, NVDA/equivalent assistive-technology use, and actual 200% browser zoom as outstanding gates.

## Task 4 — Validate, review, and package the coherent diff

1. Run the focused hierarchy test, documentation check, Portfolio Hub lint and build, and relevant release checks.
2. Serve the Portfolio Hub and use Playwright to inspect `/` and `/review`, validating visible flagship cards, filter behavior, no framework error overlay, and console health at desktop and a mobile viewport.
3. Inspect the final diff for stale “three flagships” wording and false deployment/validation claims.
4. Run CodeRabbit against the coherent diff if its authenticated CLI is available. Treat its output as review evidence and address only valid findings.
5. Do not deploy, push, release, or claim that this new source is in production. Commit only after fresh verification succeeds.
