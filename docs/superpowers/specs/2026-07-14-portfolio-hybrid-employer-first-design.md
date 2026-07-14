# Hybrid Employer-First Portfolio Redesign

**Date:** 2026-07-14  
**Owner:** David Turner  
**Scope:** `atomicdjt/atomicdjt`, `atomicdjt/AI-Project-Portfolio`, `atomicdjt/weavestudio`, `atomicdjt/buildworld-ai`, and `atomicdjt/quoteforge-local`

## 1. Objective

Create one coherent public portfolio system that serves two audiences without mixing their priorities:

1. **Employers and recruiters** should immediately see role fit, technical judgment, deployment discipline, documentation quality, and the strongest evidence of execution.
2. **Potential buyers and commercial partners** should have a separate, clearly labeled path to acquisition-ready products and commercially packaged assets.

The redesign must improve clarity, credibility, navigation, and consistency without claiming customers, revenue, adoption, compliance, senior engineering tenure, or capabilities that are not verified.

## 2. Recommended Positioning

Use a **hybrid employer-first structure**.

The first visible path across the GitHub profile and main portfolio remains oriented toward hiring and professional evaluation. Commercial products are presented as a secondary but prominent proof of product packaging, source handoff, licensing, and acquisition readiness.

### Primary identity

> Applied AI workflow and technical-operations builder creating local-first tools, structured product workflows, documented validation, and transferable software assets.

### Supporting proof hierarchy

1. **WeaveStudio** — most complete product and strongest acquisition-ready asset.
2. **BuildWorld AI** — most technically original and ambitious implementation.
3. **RedactReady Pro** — strongest privacy and document-intelligence workflow.
4. **ProcessHarbor** — clearest employer-facing technical-operations and knowledge-work product.
5. **ScamShield AI** — strongest public-interest safety workflow.
6. **QuoteForge Local** — shipped commercial product and licensing/package evidence.

This hierarchy is contextual rather than a universal ranking. Employer-facing surfaces may prioritize BuildWorld, RedactReady Pro, and ProcessHarbor, while commercial surfaces prioritize WeaveStudio and QuoteForge.

## 3. Information Architecture

### 3.1 GitHub profile repository

The profile README will contain:

1. A concise identity statement.
2. Two clearly separated entry paths:
   - **Hiring and technical review**
   - **Products and acquisition assets**
3. A short flagship table with no more than six projects.
4. A role-alignment section.
5. A verification and source-of-truth section.
6. A short technical-focus section.

The profile must not repeat the complete project catalog. Its purpose is routing, positioning, and first-impression quality.

### 3.2 Main portfolio repository

The main README will remain the authoritative employer-facing catalog for source-backed portfolio applications.

Its upper section will be simplified to:

1. Portfolio purpose and evidence standard.
2. Fast review routes.
3. Recommended recruiter sequence.
4. Flagship applications.
5. Separate commercial products and acquisition assets.
6. Verification and responsible-use boundaries.

Deep project inventories, supplemental demos, research materials, and archive references remain below the main review path or in dedicated documents.

### 3.3 Public Portfolio Hub

The Portfolio Hub will have two distinct visual sections:

- **Employer Review:** BuildWorld AI, RedactReady Pro, and ProcessHarbor as the default three-project quick path.
- **Products and Acquisition Assets:** WeaveStudio and QuoteForge Local, clearly marked as separate repositories/products.

The Hub must distinguish:

- source-backed portfolio workspace,
- separate authoritative repository,
- live demo,
- local-only app,
- supplemental external demo,
- commercial product,
- acquisition-ready asset.

### 3.4 Flagship repositories

Each separate repository remains authoritative for its own product:

- `weavestudio/master`
- `buildworld-ai/main`
- `quoteforge-local/main`

The main portfolio may describe and link these products but must not imply that its copies or references supersede the separate repositories.

## 4. Naming and Status Rules

### 4.1 ProcessHarbor naming

Use **ProcessHarbor** as the public product name for `apps/opspilot-ai-operations-toolkit`.

Where historical or path clarity is necessary, use:

> ProcessHarbor (`opspilot-ai-operations-toolkit` workspace)

Do not alternate between OpsPilot, OpsPilot Pro, and ProcessHarbor on primary public surfaces.

### 4.2 BuildWorld deployment

Use the independently maintained `atomicdjt/buildworld-ai` repository and its current verified production URL as the primary BuildWorld source and demo.

The monorepo workspace may remain as portfolio evidence, but public routing should avoid presenting two competing BuildWorld authorities.

### 4.3 WeaveStudio status

Describe WeaveStudio as:

> Acquisition-ready local-first workflow product with a consolidated authoritative default branch, buyer documentation, browser and unit validation, portable exports, and consent-gated OpenAI/Gemini BYOK assistance.

Do not claim revenue, customers, active users, compliance certification, or a completed sale.

### 4.4 QuoteForge status

Describe QuoteForge as a shipped commercial product with a live demo, buyer documentation, licensing, and a Payhip sales surface. Do not claim purchases or client deployments unless independently verified.

## 5. Content Changes

### 5.1 Remove or replace stale references

- Replace the July 4 audit badge with a current verification or portfolio-status badge.
- Create a July 14, 2026 portfolio audit.
- Correct stale deployment-protection language where deployments are now publicly reachable.
- Correct obsolete branch and pull-request references after WeaveStudio consolidation.
- Replace statements that refer to a public repository as private.
- Normalize all BuildWorld demo URLs.
- Remove outdated project rankings where they conflict with the current audience-specific hierarchy.

### 5.2 Claim-safety requirements

All descriptions must:

- separate implemented functionality from roadmap work,
- distinguish deterministic logic from external AI calls,
- state local-storage and browser-security limitations where relevant,
- avoid numerical quality claims unless grounded in tests or documented evidence,
- avoid implying independent validation when verification was conducted by the owner or AI-assisted tooling,
- identify supplemental demos whose source is not present in the portfolio repository.

### 5.3 Tone

Use confident, specific, evidence-oriented language. Avoid:

- excessive self-disqualification,
- inflated seniority claims,
- generic AI terminology,
- repetitive disclaimers,
- valuation language on recruiter-facing pages.

## 6. Portfolio Hub Functional Design

### 6.1 Data model

Each project record should include explicit fields for:

- `name`
- `publicName`
- `audience`
- `status`
- `repositoryAuthority`
- `demo`
- `source`
- `caseStudy`
- `category`
- `summary`
- `evidence`
- `stack`

This prevents status and authority from being inferred from loose text.

### 6.2 Sections

1. Header and identity
2. Portfolio evidence metrics
3. Employer three-project review path
4. Products and acquisition assets
5. Full project browser
6. Verification and role-mapping links

### 6.3 Filters

The full browser should support filtering by status and audience. Status labels should be limited to:

- Live
- Local
- Commercial
- Acquisition Asset
- Supplemental

### 6.4 Error handling

- Missing optional links should render a clear status label rather than an empty action.
- External links must use safe new-tab attributes.
- Image failures must fall back to generated project initials.
- No unsupported project should be described as source-backed.

## 7. Documentation Deliverables

Update or create:

- Profile `README.md`
- Main portfolio `README.md`
- `docs/recruiter-quick-review.md`
- `docs/EMPLOYER_OVERVIEW.md`
- `docs/PROJECT_INDEX.md`
- `docs/project-ranking.md`
- `docs/deployment-and-previews.md`
- `docs/verification.md`
- `docs/public-portfolio-audit-2026-07-14.md`
- Portfolio Hub project data and layout
- WeaveStudio README and QA/status documentation
- BuildWorld README links if inconsistent
- QuoteForge README/contact/source-of-truth wording if inconsistent

Existing historical audits remain available but should be clearly identified as historical.

## 8. Testing and Verification

### Main portfolio

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run verify
npm run verify:release
```

Use the repository's actual available scripts; if a named command is unavailable, document the exact substitute rather than inventing a result.

### Portfolio Hub

Verify:

- desktop and mobile layout,
- employer and commercial sections,
- project filters,
- all primary links,
- image fallbacks,
- accessibility labels,
- GitHub Pages subpath behavior.

### Separate repositories

For each edited repository, run its documented lint, typecheck, test, and build commands. Preserve current product boundaries and do not expand application functionality during this presentation-focused pass.

## 9. Implementation Boundaries

Included:

- public-facing copy,
- project routing,
- status normalization,
- repository authority clarification,
- documentation consistency,
- Portfolio Hub information architecture and presentation,
- verification documentation,
- stale wording corrections.

Excluded:

- new product features unrelated to presentation,
- billing, authentication, cloud sync, or analytics implementation,
- fabricated screenshots, testimonials, users, customers, or revenue,
- repository renaming that would break deployment paths,
- deletion of historical evidence unless it is inaccurate or harmful.

## 10. Success Criteria

The work is complete when:

1. A recruiter can identify David's role fit and three strongest employer-relevant projects within 60 seconds.
2. A buyer can reach WeaveStudio and QuoteForge acquisition/commercial information without passing through recruiter-only material.
3. Every flagship project has one clearly stated authoritative repository and current demo URL.
4. Public project names and statuses are consistent across the profile, Hub, README, recruiter guide, and deployment map.
5. WeaveStudio's consolidated state is accurately reflected.
6. No primary page relies on the July 4 audit as current evidence.
7. All modified repositories pass their available validation commands, or any failure is explicitly documented without being hidden.
8. No claim of traction, compliance, customers, revenue, or independent certification is introduced without evidence.
