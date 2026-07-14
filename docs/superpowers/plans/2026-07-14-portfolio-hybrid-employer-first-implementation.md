# Hybrid Employer-First Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize David Turner's GitHub profile, public Portfolio Hub, portfolio documentation, and flagship repository presentation into one consistent employer-first system with a separate commercial/acquisition path.

**Architecture:** Keep `atomicdjt/AI-Project-Portfolio` authoritative for employer-facing portfolio navigation and source-backed monorepo apps. Keep `atomicdjt/weavestudio`, `atomicdjt/buildworld-ai`, and `atomicdjt/quoteforge-local` authoritative for their separate products. Normalize public names, demo URLs, status labels, and claims through explicit project metadata rather than repeated free-form copy.

**Tech Stack:** Markdown, React 19, JavaScript, Vite 8, GitHub Pages, GitHub Actions, Node.js 22+, repository-native lint/typecheck/test/build scripts.

## Global Constraints

- The primary public structure is **hybrid employer-first**.
- Recruiter-facing surfaces prioritize BuildWorld AI, RedactReady Pro, and ProcessHarbor.
- Commercial surfaces prioritize WeaveStudio and QuoteForge Local.
- Use **ProcessHarbor** as the public name for `apps/opspilot-ai-operations-toolkit`.
- `weavestudio/master`, `buildworld-ai/main`, and `quoteforge-local/main` remain authoritative for their own products.
- Do not claim customers, revenue, active users, purchases, compliance certification, independent certification, or completed acquisition.
- Separate implemented functionality from roadmap functionality.
- Do not expose valuation language on recruiter-facing pages.
- Preserve all responsible-use and local-storage boundaries.
- Historical audits remain available but must be labeled historical.
- Do not rename repositories or change deployment paths during this pass.

---

## File Map

### `atomicdjt/atomicdjt`
- Modify `README.md`: first-impression profile routing and flagship summary.

### `atomicdjt/AI-Project-Portfolio`
- Modify `README.md`: employer-first catalog and separate commercial section.
- Modify `apps/portfolio-hub/src/App.jsx`: explicit project authority/audience metadata and two-path layout.
- Modify `apps/portfolio-hub/src/index.css`: commercial section and status styling.
- Modify `docs/recruiter-quick-review.md`: current review sequence and names.
- Modify `docs/EMPLOYER_OVERVIEW.md`: audience-specific hierarchy and role evidence.
- Modify `docs/PROJECT_INDEX.md`: authority, status, and current ordering.
- Modify `docs/project-ranking.md`: contextual rankings rather than one universal list.
- Modify `docs/deployment-and-previews.md`: current canonical demo URLs and repository authorities.
- Modify `docs/verification.md`: current validation scope and commands.
- Create `docs/public-portfolio-audit-2026-07-14.md`: current audit replacing July 4 as the primary status reference.
- Modify `docs/github-profile/README.md`: mirror current profile source copy.

### `atomicdjt/weavestudio`
- Modify `README.md`: public-repository license wording, consolidated default-branch status, and current release language.
- Modify `docs/QA-SUMMARY.md`: replace acquisition-branch wording with consolidated release evidence.
- Modify `CHANGELOG.md`: add the consolidated acquisition-ready release entry.

### `atomicdjt/buildworld-ai`
- Modify `README.md` only if the canonical source/demo links differ from the portfolio routing.

### `atomicdjt/quoteforge-local`
- Modify `README.md`: remove the demo support-address placeholder from the primary public README and clarify the authoritative source/release boundary.

---

### Task 1: Establish Current Canonical Project Metadata

**Files:**
- Modify: `apps/portfolio-hub/src/App.jsx`
- Test: repository link checker through `npm run check:docs`

**Interfaces:**
- Produces: project records with `publicName`, `audience`, `status`, `repositoryAuthority`, `demo`, `source`, `caseStudy`, `category`, `summary`, `evidence`, and `stack`.
- Consumed by: employer quick-review cards, commercial asset cards, project browser, status filters, and public metrics.

- [ ] **Step 1: Replace implicit project metadata with explicit fields**

Use this record shape for every project:

```js
{
  name: 'opspilot-ai-operations-toolkit',
  publicName: 'ProcessHarbor',
  audience: 'Employer',
  status: 'Live',
  repositoryAuthority: 'Portfolio workspace',
  demo: 'https://opspilot-ai-operations-toolkit.netlify.app/',
  source: `${repoBase}/tree/main/apps/opspilot-ai-operations-toolkit`,
  caseStudy: `${repoBase}/blob/main/projects/opspilot-ai-operations-toolkit/CASE_STUDY.md`,
  category: 'Technical operations',
  summary: 'Turns rough operational inputs into reviewable SOPs, onboarding checklists, knowledge-base drafts, gap reports, versions, and export bundles.',
  evidence: 'Role-aligned workflow design, deterministic drafting, validation boundaries, versioning concepts, and deployable documentation tooling.',
  stack: ['React', 'TypeScript', 'Zod', 'Netlify Functions', 'Vitest'],
}
```

Add separate records for WeaveStudio and QuoteForge Local:

```js
{
  name: 'weavestudio',
  publicName: 'WeaveStudio',
  audience: 'Commercial',
  status: 'Acquisition Asset',
  repositoryAuthority: 'Separate repository',
  demo: 'https://weavestudio-demo.vercel.app/',
  source: 'https://github.com/atomicdjt/weavestudio',
  caseStudy: 'https://weavestudio-demo.vercel.app/acquire',
  category: 'Workflow product',
  summary: 'Local-first visual workflow canvas for turning fragmented inputs into structured, reviewable deliverables.',
  evidence: 'Consolidated default branch, browser and unit validation, portable exports, buyer documentation, and consent-gated OpenAI/Gemini BYOK assistance.',
  stack: ['React', 'TypeScript', 'React Flow', 'Playwright', 'Local-first'],
}
```

```js
{
  name: 'quoteforge-local',
  publicName: 'QuoteForge Local',
  audience: 'Commercial',
  status: 'Commercial',
  repositoryAuthority: 'Separate private repository',
  demo: 'https://quoteforge-local.vercel.app/',
  source: null,
  caseStudy: 'https://payhip.com/b/24De9',
  category: 'Agency quoting product',
  summary: 'White-label quote-calculator and lead-capture package for agencies and local-service website implementers.',
  evidence: 'Ten calculator templates, embed and WordPress paths, buyer documentation, licensing, QA scripts, and release packaging.',
  stack: ['Next.js', 'TypeScript', 'Playwright', 'CSV export', 'White-label'],
}
```

- [ ] **Step 2: Define audience-specific collections**

```js
const employerQuickReview = projects.filter((project) =>
  ['BuildWorld AI', 'RedactReady Pro', 'ProcessHarbor'].includes(project.publicName),
);

const commercialAssets = projects.filter((project) => project.audience === 'Commercial');
```

- [ ] **Step 3: Add audience and status filtering**

Use `audience` and `status` state variables. The filter condition must require both selected values when they are not `All`.

- [ ] **Step 4: Run lint and build**

Run:

```bash
npm run lint --workspace apps/portfolio-hub
npm run build --workspace apps/portfolio-hub
```

Expected: both commands exit `0`.

- [ ] **Step 5: Commit**

```bash
git add apps/portfolio-hub/src/App.jsx
git commit -m "refactor: normalize portfolio project metadata"
```

### Task 2: Redesign the Portfolio Hub into Employer and Commercial Paths

**Files:**
- Modify: `apps/portfolio-hub/src/App.jsx`
- Modify: `apps/portfolio-hub/src/index.css`
- Test: `npm run lint --workspace apps/portfolio-hub`; `npm run build --workspace apps/portfolio-hub`

**Interfaces:**
- Consumes: `employerQuickReview`, `commercialAssets`, and normalized project records from Task 1.
- Produces: distinct `#employer-review`, `#commercial-assets`, `#projects`, and `#technical-depth` sections.

- [ ] **Step 1: Change the page identity copy**

Use:

```jsx
<h1>David Turner — Applied AI & Technical Operations Portfolio</h1>
<p>Local-first products, workflow systems, deployed applications, and evidence-oriented documentation for employer and commercial review.</p>
```

- [ ] **Step 2: Update navigation**

Use these links:

```jsx
<a href="#employer-review">Hiring review</a>
<a href="#commercial-assets">Products</a>
<a href="#projects">All projects</a>
<a href="#technical-depth">Evidence</a>
```

- [ ] **Step 3: Render employer quick review**

Heading:

```jsx
<span>Employer review</span>
<h2>Three projects that show role fit in under five minutes</h2>
```

Render `employerQuickReview` rather than `projects.slice(0, 3)`.

- [ ] **Step 4: Render commercial assets separately**

Create a section with `id="commercial-assets"` and this introduction:

```jsx
<p>
  Separate products with their own authoritative repositories, live demos, and buyer-facing documentation. Commercial status describes packaging and availability; it does not imply revenue or customers.
</p>
```

Render WeaveStudio and QuoteForge Local as cards with repository-authority labels.

- [ ] **Step 5: Add audience filter options**

Options: `All`, `Employer`, `Commercial`, `Supplemental`.

- [ ] **Step 6: Add CSS for the commercial section and authority labels**

Add focused styles using the existing color variables and spacing system. Do not introduce a new CSS framework or dependency.

- [ ] **Step 7: Verify responsive behavior**

Run the local hub and inspect widths near 390px, 768px, and 1440px. Ensure cards do not overflow and table rows remain readable.

- [ ] **Step 8: Run validation and commit**

```bash
npm run lint --workspace apps/portfolio-hub
npm run build --workspace apps/portfolio-hub
git add apps/portfolio-hub/src/App.jsx apps/portfolio-hub/src/index.css
git commit -m "feat: separate employer and commercial portfolio paths"
```

### Task 3: Rewrite the GitHub Profile as a Routing Surface

**Files:**
- Modify: `atomicdjt/atomicdjt:README.md`
- Modify: `AI-Project-Portfolio:docs/github-profile/README.md`
- Test: manually verify every Markdown link; run `npm run check:docs` in the portfolio repository after mirroring.

**Interfaces:**
- Produces: concise public identity and two entry paths.

- [ ] **Step 1: Replace the profile opening**

Use:

```md
# David Turner

**Applied AI workflow and technical-operations builder creating local-first tools, structured product workflows, documented validation, and transferable software assets.**

I turn ambiguous operational, privacy, research, and documentation problems into reviewable software: deployed demos, typed source, tests, validation notes, case studies, and clear handoff materials.
```

- [ ] **Step 2: Add two primary paths**

```md
## Choose a Review Path

### Hiring and Technical Review
- [Portfolio Hub](https://atomicdjt.github.io/AI-Project-Portfolio/)
- [Recruiter Quick Review](https://github.com/atomicdjt/AI-Project-Portfolio/blob/main/docs/recruiter-quick-review.md)
- [Verification Guide](https://github.com/atomicdjt/AI-Project-Portfolio/blob/main/docs/verification.md)

### Products and Acquisition Assets
- [WeaveStudio](https://github.com/atomicdjt/weavestudio) — acquisition-ready local-first workflow product
- [WeaveStudio acquisition overview](https://weavestudio-demo.vercel.app/acquire)
- [QuoteForge Local](https://quoteforge-local.vercel.app/) — shipped white-label quoting product
```

- [ ] **Step 3: Limit the flagship table to six entries**

Use WeaveStudio, BuildWorld AI, RedactReady Pro, ProcessHarbor, ScamShield AI, and QuoteForge Local. Label the reason each should be reviewed rather than assigning universal numerical ranks.

- [ ] **Step 4: Replace the July 4 badge**

Point the status badge to `docs/public-portfolio-audit-2026-07-14.md` with label `Portfolio Status Jul 14 2026`.

- [ ] **Step 5: Mirror the same canonical copy**

Update `docs/github-profile/README.md` to match the public profile README exactly, except repository-relative links may remain relative where necessary.

- [ ] **Step 6: Commit profile and mirror separately**

Profile repo:

```bash
git add README.md
git commit -m "docs: sharpen employer-first GitHub profile"
```

Portfolio repo:

```bash
git add docs/github-profile/README.md
git commit -m "docs: sync current GitHub profile source"
```

### Task 4: Simplify the Main Portfolio README and Normalize Public Naming

**Files:**
- Modify: `README.md`
- Test: `npm run check:docs`

**Interfaces:**
- Produces: authoritative employer-facing catalog with a separate commercial section.

- [ ] **Step 1: Replace the opening paragraph**

Use:

```md
A source-backed portfolio of deployed applications, workflow systems, and product prototypes demonstrating applied AI judgment, technical operations thinking, local-first architecture, frontend implementation, documentation discipline, and responsible scope control.
```

- [ ] **Step 2: Replace the review sequence**

The employer sequence must be:

1. Portfolio Hub.
2. BuildWorld AI for technical originality.
3. RedactReady Pro for privacy and document intelligence.
4. ProcessHarbor for technical-operations role fit.
5. ScamShield AI for public-interest safety design.
6. Verification and employer documentation.

- [ ] **Step 3: Add a separate acquisition-assets section above the full catalog**

Include WeaveStudio and QuoteForge Local with explicit `Separate authoritative repository` or `Separate private source repository` status.

- [ ] **Step 4: Normalize names**

Replace public occurrences of `OpsPilot` and `OpsPilot Pro` with `ProcessHarbor`, except filesystem paths and historical references that require the old workspace identifier.

- [ ] **Step 5: Normalize BuildWorld links**

Use `https://github.com/atomicdjt/buildworld-ai` as the primary source and the current verified standalone deployment as the primary demo. Identify the monorepo copy as portfolio evidence, not product authority.

- [ ] **Step 6: Preserve responsible framing**

Keep the statement that the portfolio is evidence of practical execution and product judgment rather than a claim of senior tenure. Remove repetitive disclaimers that appear elsewhere.

- [ ] **Step 7: Run documentation validation and commit**

```bash
npm run check:docs
git add README.md
git commit -m "docs: reorganize portfolio for employer and buyer review"
```

### Task 5: Update Recruiter, Employer, Index, Ranking, Deployment, and Verification Documents

**Files:**
- Modify: `docs/recruiter-quick-review.md`
- Modify: `docs/EMPLOYER_OVERVIEW.md`
- Modify: `docs/PROJECT_INDEX.md`
- Modify: `docs/project-ranking.md`
- Modify: `docs/deployment-and-previews.md`
- Modify: `docs/verification.md`
- Test: `npm run check:docs`

**Interfaces:**
- Produces: one consistent set of names, authorities, and review routes.

- [ ] **Step 1: Update recruiter quick review**

Set the 60-second path to Portfolio Hub → BuildWorld → RedactReady Pro → ProcessHarbor → verification. Add one short `Commercial proof` subsection linking WeaveStudio and QuoteForge without valuation or sales language.

- [ ] **Step 2: Update employer overview**

Map roles to evidence:

- Technical Operations → ProcessHarbor, verification docs, workflow decomposition.
- AI Workflow Specialist → WeaveStudio, ScamShield, ProcessHarbor, Astra.
- Product Operations → WeaveStudio packaging, QuoteForge release discipline, case studies.
- Documentation/Knowledge Operations → ProcessHarbor, structured docs, transfer materials.
- Junior Technical Product Analyst → BuildWorld, product boundaries, evidence matrices.

- [ ] **Step 3: Update project index**

For every flagship entry, state `Public name`, `Repository authority`, `Demo`, `Source availability`, and `Best evidence`.

- [ ] **Step 4: Replace universal ranking with contextual rankings**

Use three lists:

- Employer review: BuildWorld, RedactReady Pro, ProcessHarbor.
- Commercial readiness: WeaveStudio, QuoteForge Local.
- Technical originality: BuildWorld, RedactReady family, LayerForge.

- [ ] **Step 5: Update deployment map**

Record one canonical URL per flagship plus any known secondary deployment. Mark the authoritative repository. Do not call a deployment verified unless a current check supports it.

- [ ] **Step 6: Update verification guide**

Document the exact root scripts from `package.json`:

```bash
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

- [ ] **Step 7: Run docs validation and commit**

```bash
npm run check:docs
git add docs/recruiter-quick-review.md docs/EMPLOYER_OVERVIEW.md docs/PROJECT_INDEX.md docs/project-ranking.md docs/deployment-and-previews.md docs/verification.md
git commit -m "docs: normalize portfolio evidence and project authority"
```

### Task 6: Publish the July 14 Portfolio Audit

**Files:**
- Create: `docs/public-portfolio-audit-2026-07-14.md`
- Modify: `README.md`
- Modify: `docs/github-profile/README.md`
- Test: `npm run check:docs`

**Interfaces:**
- Produces: current status artifact for badges and review links.

- [ ] **Step 1: Create the audit with explicit evidence classes**

Required sections:

```md
# Public Portfolio Audit — July 14, 2026

## Scope
## Current authoritative repositories
## Current employer review path
## Current commercial assets
## Verification evidence
## Known limitations
## Naming and deployment normalization
## Remaining gaps
```

- [ ] **Step 2: Record only supported statements**

Include:

- WeaveStudio PR consolidation is complete and `master` is authoritative.
- Both WeaveStudio Vercel status checks were green after consolidation.
- The main portfolio has 11 configured workspaces and root verification scripts.
- BuildWorld's standalone repository is authoritative for the current standalone product.
- QuoteForge is commercially packaged but no purchase or customer claim is made.
- External adoption and testimonials remain the largest portfolio-wide gap.

- [ ] **Step 3: Mark July 4 as historical**

Do not delete the July 4 audit. Add a note in the new audit that earlier reports remain historical snapshots.

- [ ] **Step 4: Update current audit links and commit**

```bash
npm run check:docs
git add docs/public-portfolio-audit-2026-07-14.md README.md docs/github-profile/README.md
git commit -m "docs: publish current public portfolio audit"
```

### Task 7: Polish WeaveStudio's Consolidated Release Presentation

**Files:**
- Modify: `atomicdjt/weavestudio:README.md`
- Modify: `atomicdjt/weavestudio:docs/QA-SUMMARY.md`
- Modify: `atomicdjt/weavestudio:CHANGELOG.md`
- Test: `npm run verify:buyer`

**Interfaces:**
- Produces: current default-branch and acquisition evidence without obsolete branch language.

- [ ] **Step 1: Correct license wording**

Replace:

```md
Access to this private repository does not grant a license...
```

with:

```md
Public visibility is provided for evaluation and portfolio review only. It does not grant a license to copy, redistribute, commercialize, or reuse the source or associated intellectual property.
```

- [ ] **Step 2: Update release status**

Use:

```md
**Release status:** v1.1.0 — acquisition-ready consolidated release
```

Only change `package.json` version if the changelog and release packaging are updated in the same commit and validation passes.

- [ ] **Step 3: Rewrite QA title and evidence language**

Use `# WeaveStudio Consolidated Release QA Summary`. State that the evidence applies to the authoritative default branch. Remove obsolete deployment-protection claims where the public demo is now reachable.

- [ ] **Step 4: Add a changelog entry**

Record consolidation, OpenAI/Gemini BYOK assistance, undo/redo, data portability, browser coverage, buyer transfer materials, and commercial architecture guidance.

- [ ] **Step 5: Validate and commit**

```bash
npm ci
npm run verify:buyer
git add README.md docs/QA-SUMMARY.md CHANGELOG.md package.json package-lock.json
git commit -m "docs: finalize consolidated WeaveStudio release presentation"
```

If the version remains `1.0.0`, omit `package.json` and `package-lock.json` from the commit.

### Task 8: Normalize BuildWorld and QuoteForge Authority and Contact Language

**Files:**
- Modify if needed: `atomicdjt/buildworld-ai:README.md`
- Modify: `atomicdjt/quoteforge-local:README.md`
- Test: BuildWorld `npm run lint && npm run typecheck && npm run test && npm run build`; QuoteForge `npm run lint && npm run typecheck && npm run build && npm run check:links`

**Interfaces:**
- Produces: consistent portfolio routing and no public placeholder support address.

- [ ] **Step 1: Confirm BuildWorld canonical links**

The standalone README must link to the canonical live deployment used by the profile, Hub, deployment map, and recruiter guide. If already correct, make no code change.

- [ ] **Step 2: Add BuildWorld authority statement if absent**

```md
This repository is the authoritative source for the current standalone BuildWorld AI product. The portfolio monorepo may contain a review copy, but product development and release evidence are maintained here.
```

- [ ] **Step 3: Remove QuoteForge placeholder contact from public README**

Replace the final placeholder sentence with:

```md
Before a commercial transfer or customer-facing launch, configure a seller-controlled support address in the buyer documentation and deployed contact surfaces. No support-response commitment is included unless separately agreed.
```

- [ ] **Step 4: Add QuoteForge source-of-truth statement**

```md
This private repository is the authoritative editable source for QuoteForge Local. Release ZIPs, Payhip delivery files, and deployments must be traceable to a tagged or recorded commit from `main`.
```

- [ ] **Step 5: Validate and commit separately**

BuildWorld:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
git add README.md
git commit -m "docs: clarify BuildWorld source authority"
```

QuoteForge:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run check:links
git add README.md
git commit -m "docs: clarify QuoteForge authority and support boundary"
```

### Task 9: Run Portfolio-Wide Verification and Reconcile Failures

**Files:**
- Modify only files required to fix validation defects introduced by Tasks 1–8.
- Test: all repository-native validation commands.

**Interfaces:**
- Produces: final evidence record and merge-ready branches.

- [ ] **Step 1: Validate the main portfolio**

```bash
npm ci
npm run check:docs
npm run verify:release
```

Expected: exit `0`. If a pre-existing unrelated failure remains, record the exact command, failing step, and evidence that the failure predates this work.

- [ ] **Step 2: Validate WeaveStudio**

```bash
npm ci
npm run verify:buyer
```

Expected: exit `0`.

- [ ] **Step 3: Validate BuildWorld**

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: exit `0`.

- [ ] **Step 4: Validate QuoteForge**

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run check:links
```

Expected: exit `0`. Do not hide a link-check failure; correct the invalid repository link or document the exact external exception.

- [ ] **Step 5: Verify public links**

Check the Portfolio Hub, BuildWorld, RedactReady Pro, ProcessHarbor, ScamShield, WeaveStudio demo/acquisition page, QuoteForge demo, and Payhip page. Record access date `2026-07-14` in the current audit.

- [ ] **Step 6: Review final diffs for claim safety**

Search changed text for: `revenue`, `customers`, `users`, `compliant`, `certified`, `senior`, `independently validated`, `guaranteed`, and `$`. Confirm each occurrence is either removed, explicitly bounded, or supported.

- [ ] **Step 7: Merge through repository-specific pull requests**

Use squash merge. PR descriptions must list changed public surfaces, validation commands actually run, known limitations, and authoritative branches.

### Task 10: Post-Merge Verification and Final Audit Update

**Files:**
- Modify if required: `docs/public-portfolio-audit-2026-07-14.md`

**Interfaces:**
- Produces: deployed final state and accurate audit trail.

- [ ] **Step 1: Confirm default branches contain the merged commits**

- `atomicdjt/atomicdjt/main`
- `atomicdjt/AI-Project-Portfolio/main`
- `atomicdjt/weavestudio/master`
- `atomicdjt/buildworld-ai/main`
- `atomicdjt/quoteforge-local/main`

- [ ] **Step 2: Confirm deployment status checks**

Wait only for synchronous status retrieval; do not claim success until the provider reports success.

- [ ] **Step 3: Recheck all primary public routes**

Verify that the profile points to the July 14 audit, the Hub shows both audience paths, and all canonical project links resolve.

- [ ] **Step 4: Correct the audit if deployment reality differs**

Commit factual corrections only. Do not reinterpret a failed deployment as successful.

- [ ] **Step 5: Record completion**

Final report must list commits/PRs, validation results, any remaining manual GitHub settings such as pinning, and the resulting portfolio score changes.