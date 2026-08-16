# BuildWorld AI Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Differentiate BuildWorld AI from unrelated name-collision results and strengthen the relationship between the project, David Turner/`atomicdjt`, its canonical demo, and the Portfolio Hub.

**Architecture:** Preserve the existing TypeScript/Vite app. Limit implementation to README/search copy, static metadata/JSON-LD, crawler assets, and verified cross-links; no simulation behavior changes.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, oxlint, static JSON-LD/XML.

## Global Constraints

- Branch + PR only in `atomicdjt/buildworld-ai`.
- Canonical demo remains `https://buildworld-ai-v01-improvements.vercel.app/`.
- Repository remains the authoritative source.
- Keep local-first, deterministic/reproducible, and heuristic limitations accurate.

---

### Task 1: Align public identity language

**Files:**
- Modify: `README.md`
- Modify: `index.html`

- [ ] **Step 1:** Ensure the README opening uses the qualified descriptor `BuildWorld AI — local-first systems simulation lab by David Turner` or an equally precise natural-language equivalent.
- [ ] **Step 2:** Keep category terms specific to implemented behavior: graph systems, bottlenecks, cascade analysis, sensitivity/resilience analysis, reproducible reports.
- [ ] **Step 3:** Update `<title>`, description, Open Graph, and Twitter copy only where needed for consistency with that qualified descriptor.
- [ ] **Step 4:** Keep `codeRepository`, canonical URL, and creator links intact.
- [ ] **Step 5:** Commit with `seo: differentiate BuildWorld AI search identity`.

### Task 2: Strengthen entity relationships without schema inflation

**Files:**
- Modify: `index.html`
- Verify: `public/robots.txt`
- Verify: `public/sitemap.xml`

- [ ] **Step 1:** Add a stable `@id` to the `SoftwareApplication` and creator `Person` JSON-LD nodes.
- [ ] **Step 2:** Ensure the creator node links to the GitHub profile and Portfolio Hub without asserting employment, awards, ratings, downloads, or user counts.
- [ ] **Step 3:** Keep one canonical sitemap URL unless the app exposes additional genuinely index-worthy static routes.
- [ ] **Step 4:** Parse JSON-LD and sitemap using Python standard-library parsers.
- [ ] **Step 5:** Commit with `seo: strengthen BuildWorld entity relationships`.

### Task 3: Verification and PR

- [ ] **Step 1:** Run `npm run lint`.
- [ ] **Step 2:** Run `npm run typecheck`.
- [ ] **Step 3:** Run `npm test`.
- [ ] **Step 4:** Run `npm run build`.
- [ ] **Step 5:** Inspect the complete diff for simulation/source changes; there should be none unless strictly required by a discovered link issue.
- [ ] **Step 6:** Open a PR titled `Improve BuildWorld AI search differentiation`; do not merge automatically.