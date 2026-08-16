# Portfolio Hub Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the Portfolio Hub's crawlability, entity signals, search-result differentiation, and contact conversion without changing source-authority or claim boundaries.

**Architecture:** Keep the existing Vite/React single-page application and canonical Vercel URL. Concentrate changes in static head metadata, structured data, sitemap/robots assets, and only minimal UI copy where needed; avoid adding a routing framework or new dependencies.

**Tech Stack:** React 19, Vite 8, JavaScript, static HTML metadata, JSON-LD, XML sitemap, Vercel.

## Global Constraints

- All implementation changes use a reviewable branch and pull request; never commit directly to `main`.
- Canonical Portfolio Hub URL remains `https://ai-project-portfolio-portfolio-hub.vercel.app/`.
- Preserve licensing, privacy, responsible-use, and evidence/claim-discipline language.
- Do not claim customers, revenue, adoption, rankings, testimonials, or external validation that is not documented.
- Do not add a dependency solely for SEO metadata.

---

### Task 1: Audit indexable route inventory

**Files:**
- Inspect: `apps/portfolio-hub/src/App.jsx`
- Modify: `apps/portfolio-hub/public/sitemap.xml`
- Verify: `apps/portfolio-hub/public/robots.txt`

**Interfaces:**
- Consumes: existing route selection in `App.jsx`.
- Produces: a sitemap containing only deliberate public review routes.

- [ ] **Step 1:** Read `App.jsx` and enumerate every pathname the application handles intentionally.
- [ ] **Step 2:** Classify each route as `index`, `no-index candidate`, or `fallback-only`; do not add incidental SPA fallback URLs to the sitemap.
- [ ] **Step 3:** Update `public/sitemap.xml` so each index-worthy route has one canonical `<loc>` and no duplicate/legacy host.
- [ ] **Step 4:** Validate XML with `python -c "import xml.etree.ElementTree as ET; ET.parse('apps/portfolio-hub/public/sitemap.xml'); print('sitemap ok')"`.
- [ ] **Step 5:** Confirm `robots.txt` allows `/` and references only the canonical sitemap.
- [ ] **Step 6:** Commit with `seo: align portfolio sitemap with public routes`.

### Task 2: Strengthen creator and project entity metadata

**Files:**
- Modify: `apps/portfolio-hub/index.html`

**Interfaces:**
- Consumes: canonical project URLs already used by the portfolio.
- Produces: valid `ProfilePage`/`Person` JSON-LD with explicit creator-to-project relationships.

- [ ] **Step 1:** Preserve the existing `ProfilePage` and `Person` structure; add a stable `@id` for the profile/person using the canonical portfolio URL plus a fragment identifier.
- [ ] **Step 2:** Expand project relationships using `hasPart`/`subjectOf` or equivalent Schema.org fields only for publicly documented flagship projects.
- [ ] **Step 3:** Keep `sameAs` restricted to real identity surfaces such as GitHub and LinkedIn.
- [ ] **Step 4:** Make the HTML title, meta description, OG title, and Twitter title consistently identify `David Turner`, `atomicdjt` where natural, and the category `Applied AI & Technical Operations`.
- [ ] **Step 5:** Parse the JSON-LD with `python -c "from pathlib import Path; import re,json; s=Path('apps/portfolio-hub/index.html').read_text(); j=re.search(r'<script type=\"application/ld\\+json\">(.*?)</script>',s,re.S).group(1); json.loads(j); print('json-ld ok')"`.
- [ ] **Step 6:** Commit with `seo: strengthen portfolio entity metadata`.

### Task 3: Improve first-contact conversion without marketing inflation

**Files:**
- Modify only if justified by audit: `apps/portfolio-hub/src/App.jsx`
- Modify only if needed for layout: `apps/portfolio-hub/src/styles.css`

**Interfaces:**
- Consumes: existing email, GitHub, LinkedIn, and review-path URLs.
- Produces: a low-friction contact/review path visible on high-intent pages.

- [ ] **Step 1:** Inspect whether the home and `/review` experiences expose a visible contact path without scrolling through unrelated content.
- [ ] **Step 2:** If missing, add a compact contact cluster using existing links only: Email, GitHub, LinkedIn, and Five-minute review.
- [ ] **Step 3:** Do not add conversion claims, urgency, fake social proof, visitor counters, or newsletter forms.
- [ ] **Step 4:** Run `npm --prefix apps/portfolio-hub run lint`.
- [ ] **Step 5:** Run `npm --prefix apps/portfolio-hub run build`.
- [ ] **Step 6:** Commit with `ux: clarify portfolio review and contact paths` if code changed.

### Task 4: Portfolio repository verification and PR

**Files:**
- Verify: all files changed above.

- [ ] **Step 1:** Run `npm run check:docs` from repository root.
- [ ] **Step 2:** Run `npm run check:deployment-policy`.
- [ ] **Step 3:** Run `npm run verify:public-links`.
- [ ] **Step 4:** Run `npm --prefix apps/portfolio-hub run lint` and `npm --prefix apps/portfolio-hub run build`.
- [ ] **Step 5:** Inspect the complete branch diff and confirm no legacy deployment became canonical and no claim boundary changed.
- [ ] **Step 6:** Open a PR titled `Improve Portfolio Hub search and entity discovery`; do not merge automatically.