# GitHub Profile Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `github.com/atomicdjt` communicate identity, strongest work, differentiated project categories, evidence, and contact paths within the first screen while preserving the profile's current claim discipline.

**Architecture:** This is a content-only change in the profile README repository. Keep the current builder-first structure, reduce redundant prose, qualify collision-prone project names, and preserve direct links to canonical demos and evidence.

**Tech Stack:** GitHub profile README, Markdown.

## Global Constraints

- Use a feature branch and PR in `atomicdjt/atomicdjt`; never update `main` directly.
- Preserve the canonical Portfolio Hub, GitHub, LinkedIn, and email links.
- Do not add badges or numbers that imply unverified traction.
- Keep AI-assisted authorship and evidence limitations visible.

---

### Task 1: Tighten the first-screen identity block

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Keep `# David Turner` and rewrite the opening identity sentence so it consistently connects `David Turner`, `atomicdjt`, practical/reviewable applied AI, local-first software, and technical-operations workflows without keyword stuffing.
- [ ] **Step 2:** Keep the Portfolio Hub, Five-minute review, LinkedIn, and Email links in the first link row.
- [ ] **Step 3:** Keep the first three flagship projects visible before long explanatory sections.
- [ ] **Step 4:** Qualify collision-prone names in the first occurrence: `BuildWorld AI — local-first systems simulation lab` and `WeaveStudio — local-first visual workflow canvas`.
- [ ] **Step 5:** Commit with `docs: sharpen profile identity and flagship discovery`.

### Task 2: Remove redundancy and strengthen inbound paths

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Remove or consolidate repeated explanations of the same portfolio philosophy when they push evidence/contact links below the fold.
- [ ] **Step 2:** Preserve `I am actively looking for outside critique`, direct issue links, and public feedback invitations.
- [ ] **Step 3:** Preserve evidence, authorship, limitations, role alignment, and core tools sections, but make them scannable rather than promotional.
- [ ] **Step 4:** Ensure every public flagship points either to its canonical repository, canonical live demo, or both.
- [ ] **Step 5:** Verify every absolute URL in the README returns a valid target before PR creation.
- [ ] **Step 6:** Commit with `docs: improve profile referral and contact flow`.

### Task 3: Review and PR

- [ ] **Step 1:** Inspect the rendered Markdown diff for broken tables, malformed links, or duplicated project descriptions.
- [ ] **Step 2:** Confirm QuoteForge Local remains linked as a public product/demo while its source repository remains private.
- [ ] **Step 3:** Confirm no claim of revenue, customers, active users, acquisition, rankings, or press was added.
- [ ] **Step 4:** Open a PR titled `Improve GitHub profile discoverability and conversion`; do not merge automatically.