# WeaveStudio Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Differentiate WeaveStudio from unrelated brands and make its local-first workflow-canvas category, creator relationship, canonical demo, and portfolio relationship easier to understand and discover.

**Architecture:** Preserve the existing React/TypeScript/Vite application and acquisition packaging. Restrict changes to README/search copy, static metadata, crawler assets, and verified creator/portfolio cross-links unless a discovered route metadata issue requires a minimal app change.

**Tech Stack:** React 19, TypeScript 6, Vite 8, React Router, Vitest, Playwright, oxlint.

## Global Constraints

- Branch + PR only in `atomicdjt/weavestudio`.
- Canonical demo remains `https://weavestudio-nine.vercel.app/`.
- Preserve acquisition/licensing boundaries and consent-gated BYOK AI positioning.
- Do not imply completed acquisition, customers, revenue, or production-scale usage.

---

### Task 1: Align README and metadata around a qualified category

**Files:**
- Modify: `README.md`
- Modify as needed: `index.html`

- [ ] **Step 1:** Make the first README occurrence identify `WeaveStudio — local-first visual workflow canvas by David Turner` or an equivalent precise descriptor.
- [ ] **Step 2:** Keep the implemented use case explicit: turning messy research/client inputs into structured, reviewable, exportable deliverables.
- [ ] **Step 3:** Align page title, meta description, Open Graph, and Twitter copy with the same category while preserving natural language.
- [ ] **Step 4:** Keep canonical demo and acquisition route links correct and distinguish the product from generic design/simulation studios.
- [ ] **Step 5:** Commit with `seo: differentiate WeaveStudio search identity`.

### Task 2: Strengthen creator/project graph

**Files:**
- Modify as needed: `index.html`
- Verify: `public/robots.txt`
- Verify: `public/sitemap.xml`

- [ ] **Step 1:** Add or normalize stable JSON-LD identifiers for the application and creator if absent.
- [ ] **Step 2:** Ensure creator references link to `https://github.com/atomicdjt` and the canonical Portfolio Hub.
- [ ] **Step 3:** Ensure the sitemap includes only genuine indexable public routes; include `/acquire` only if it is intentionally public and contains substantive unique content.
- [ ] **Step 4:** Validate JSON-LD and XML syntax with standard parsers.
- [ ] **Step 5:** Commit with `seo: strengthen WeaveStudio entity relationships`.

### Task 3: Full repository verification and PR

- [ ] **Step 1:** Run `npm run test`.
- [ ] **Step 2:** Run `npm run lint`.
- [ ] **Step 3:** Run `npm run typecheck`.
- [ ] **Step 4:** Run `npm run build`.
- [ ] **Step 5:** Run `npm run test:browser` if any rendered route or metadata-serving behavior changed.
- [ ] **Step 6:** Run `npm run verify:buyer` if acquisition-facing copy or links changed.
- [ ] **Step 7:** Inspect the complete diff for unrelated product behavior changes.
- [ ] **Step 8:** Open a PR titled `Improve WeaveStudio search differentiation`; do not merge automatically.