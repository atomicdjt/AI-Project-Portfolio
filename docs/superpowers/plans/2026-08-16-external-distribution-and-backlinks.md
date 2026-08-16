# External Distribution and Backlinks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build legitimate third-party discovery paths to David Turner's portfolio and strongest projects through qualified developer/product communities, public project profiles, technical writing, and curated listings.

**Architecture:** Maintain a source-backed distribution ledger and publication packets in the portfolio repository. Research each external surface from current official rules before recommending or submitting; automate publication only where an authorized connected action exists.

**Tech Stack:** Markdown/CSV-style documentation, public web research, existing project screenshots/social assets, GitHub/Vercel canonical URLs.

## Global Constraints

- Target 8–12 qualified opportunities in the first cycle.
- Produce at least 3 publication-ready launch/listing packets.
- No paid links, link farms, bulk directory spam, fake votes, fake reviews, coordinated engagement, or reciprocal-link schemes.
- Do not create third-party accounts or accept terms under David's identity without an authorized account/action surface.
- A prepared draft is not counted as a backlink until a public crawlable page exists.
- Tailor content to each community; do not paste identical promotional copy everywhere.

---

### Task 1: Research and score external discovery surfaces

**Files:**
- Create: `docs/discovery/external-opportunities.md`
- Create: `docs/discovery/discovery-ledger.md`

- [ ] **Step 1:** Research current official submission/profile rules for candidate classes: Peerlist or comparable developer portfolios, Product Hunt, Hacker News Show HN, DEV Community, Hashnode, relevant GitHub curated lists, and other current developer/product directories with public indexable pages.
- [ ] **Step 2:** Reject any target whose main value proposition is paid backlinks, mass SEO submission, reciprocal linking, or unverifiable traffic claims.
- [ ] **Step 3:** Score 8–12 surviving opportunities on `audience relevance`, `indexability`, `link quality`, `project fit`, `maintenance cost`, and `submission friction` using High/Medium/Low plus a short rationale.
- [ ] **Step 4:** Record official rule/source URLs and the date checked for every recommended target.
- [ ] **Step 5:** Create ledger columns for opportunity, target project, canonical URL, status, submission date, published URL, discovery notes, and evidence.
- [ ] **Step 6:** Commit with `docs: add qualified external discovery backlog`.

### Task 2: Select three strongest publication candidates

**Files:**
- Modify: `docs/discovery/external-opportunities.md`

- [ ] **Step 1:** Select at least three combinations of project + surface where the product is live, publicly testable, and a genuine fit for that audience.
- [ ] **Step 2:** Prefer different intents rather than three identical directory listings, for example: developer project profile, substantive Show HN/community launch, and technical case-study publication.
- [ ] **Step 3:** Document why each candidate is appropriate and any account-bound/manual final step.
- [ ] **Step 4:** Commit with `docs: prioritize external distribution targets`.

### Task 3: Build publication-ready packets

**Files:**
- Create: `docs/discovery/packets/buildworld-ai.md`
- Create: `docs/discovery/packets/weavestudio.md`
- Create: `docs/discovery/packets/validation-ledger.md`
- Create additional packet only if a stronger project/surface match is found.

- [ ] **Step 1:** For each packet include: canonical URL, repository URL if public, 60–80 character title, one-sentence description, 2–3 paragraph audience-specific description, tags/categories, maker/author note, screenshot/social asset references, limitations, and a non-promotional discussion prompt.
- [ ] **Step 2:** For Show HN-style candidates, include what people can try immediately, what is technically interesting, what is intentionally limited, and the specific feedback requested.
- [ ] **Step 3:** For Product Hunt-style candidates, include maker-first product positioning and accurate launch status without traction claims.
- [ ] **Step 4:** For technical writing targets, outline a substantive case study with problem, design choices, implementation, verification, failures/limitations, and lessons.
- [ ] **Step 5:** Commit with `docs: add publication-ready discovery packets`.

### Task 4: Publish where authorized and record evidence

**Files:**
- Modify: `docs/discovery/discovery-ledger.md`

- [ ] **Step 1:** Check whether an installed/connected action supports each selected platform and the required write operation.
- [ ] **Step 2:** Where a write-capable authorized action exists, publish only the already-reviewed packet content and capture the resulting public URL.
- [ ] **Step 3:** Where no authorized action exists, leave the final account-bound submission as a clearly marked manual step; do not invent completion.
- [ ] **Step 4:** Record only actually published crawlable URLs as live backlinks/listings.
- [ ] **Step 5:** Commit evidence updates with `docs: record external discovery publications`.

### Task 5: Open documentation PR

- [ ] **Step 1:** Check all canonical project URLs and official external-rule sources are current.
- [ ] **Step 2:** Confirm the ledger distinguishes `researched`, `packet ready`, `submitted`, and `published` states.
- [ ] **Step 3:** Open a PR titled `Add external discovery and backlink program`; do not merge automatically.