# Validation Ledger Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Validation Ledger easier to discover as a traceable product-discovery/evidence workspace and strengthen its creator, repository, canonical demo, and portfolio relationships.

**Architecture:** Preserve the existing React/TypeScript/Vite application and local-first data model. Limit changes to README, static metadata/JSON-LD, crawler assets, and verified cross-links unless an existing route metadata bug is discovered.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Dexie/IndexedDB, Vitest, Playwright, oxlint.

## Global Constraints

- Branch + PR only in `atomicdjt/validation-ledger`.
- Canonical demo remains `https://validation-ledger.vercel.app/`.
- Preserve local-first and evidence/claim boundaries.
- Do not represent internal evidence records as independent external validation.

---

### Task 1: Clarify public category and creator identity

**Files:**
- Modify: `README.md`
- Modify as needed: `index.html`

- [ ] **Step 1:** Make the first README occurrence identify `Validation Ledger — local-first evidence workspace for traceable product discovery and decisions` and attribute the project naturally to David Turner/`atomicdjt`.
- [ ] **Step 2:** Align title, description, Open Graph, and Twitter copy with the implemented product-discovery/evidence workflow.
- [ ] **Step 3:** Avoid broad phrases such as `AI validation platform` that could imply independent certification.
- [ ] **Step 4:** Keep canonical demo, repository, and Portfolio Hub links consistent.
- [ ] **Step 5:** Commit with `seo: clarify Validation Ledger search identity`.

### Task 2: Normalize structured data and crawler assets

**Files:**
- Modify as needed: `index.html`
- Verify: `public/robots.txt`
- Verify: `public/sitemap.xml`

- [ ] **Step 1:** Add or normalize stable JSON-LD identifiers for the application and creator.
- [ ] **Step 2:** Link the application to its `codeRepository`, canonical demo, creator GitHub profile, and Portfolio Hub.
- [ ] **Step 3:** Keep the sitemap restricted to substantive public routes.
- [ ] **Step 4:** Validate JSON-LD with Python `json.loads` and sitemap XML with `xml.etree.ElementTree`.
- [ ] **Step 5:** Commit with `seo: strengthen Validation Ledger entity metadata`.

### Task 3: Verification and PR

- [ ] **Step 1:** Run `npm run lint`.
- [ ] **Step 2:** Run `npm test`.
- [ ] **Step 3:** Run `npm run build`.
- [ ] **Step 4:** Run `npm run test:e2e` if any rendered-route behavior changed.
- [ ] **Step 5:** Inspect the complete diff for unrelated product/data-model changes.
- [ ] **Step 6:** Open a PR titled `Improve Validation Ledger search discovery`; do not merge automatically.