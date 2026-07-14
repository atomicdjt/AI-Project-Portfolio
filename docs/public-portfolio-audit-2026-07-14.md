# Public Portfolio Audit — July 14, 2026

## Scope

This audit reviews the GitHub profile, employer portfolio repository, Portfolio Hub source, source-authority map, flagship project routing, commercial product presentation, deployment policy, and current repository-governance state.

It is a first-party portfolio audit supported by repository metadata, documented scripts, pull-request history, Vercel project inventory, deployment status checks, and public product surfaces. It is not an independent certification, security audit, legal review, valuation report, or claim of customer adoption.

## Current Authoritative Repositories

| Surface | Authoritative repository | Branch |
| --- | --- | --- |
| GitHub profile | `atomicdjt/atomicdjt` | `main` |
| Employer portfolio and monorepo applications | `atomicdjt/AI-Project-Portfolio` | `main` |
| WeaveStudio | `atomicdjt/weavestudio` | `master` |
| BuildWorld AI standalone product | `atomicdjt/buildworld-ai` | `main` |
| QuoteForge Local | private `atomicdjt/quoteforge-local` | `main` |

Vercel deployments, generated release ZIPs, Payhip files, and screenshots are derivative outputs. They do not supersede the recorded repository source.

## Deployment Policy

All new deployments, redeployments, preview deployments, and production aliases use Vercel.

- The former GitHub Pages workflow has been converted into a build-only **Portfolio Vercel Readiness** workflow.
- No portfolio application should be published or republished through Netlify or GitHub Pages.
- Legacy non-Vercel URLs remain historical evidence only and are not current canonical routes.
- A project is labeled `Live` only after Vercel reports a ready deployment and its core workflow is verified.
- Until then, source-backed applications use the status `Vercel Pending`.

## Current Employer Review Path

1. **BuildWorld AI** — technical originality, systems thinking, deterministic simulation, reproducibility, and reporting; live on Vercel.
2. **RedactReady Pro** — privacy, document intelligence, local-first workflow design, and responsible boundaries; Vercel Pending.
3. **ProcessHarbor** — technical operations, SOPs, onboarding, knowledge-base workflows, gap analysis, versioning, and exports; Vercel Pending.
4. **ScamShield AI** — public-interest safety workflow and explainable local analysis; Vercel Pending.
5. **LayerForge Studio** — frontend and Canvas interaction depth; Vercel Pending.

The Portfolio Hub source and recruiter documentation route reviewers through this sequence. A public Hub URL will be added only after its Vercel project is created and verified.

## Current Commercial Assets

### WeaveStudio

- The acquisition hardening, OpenAI/Gemini BYOK assistance, browser coverage, buyer materials, commercial architecture guidance, and repository-governance work were consolidated into `master` on July 14, 2026.
- The overlapping draft pull request was closed as superseded.
- `master` is the single editable source of truth.
- GitHub Actions passed after consolidation.
- Both associated Vercel deployment status checks reported success after consolidation.
- Buyer materials include architecture, feature-reality, transfer, operating-plan, value-proof, outreach, and packaging documentation.
- No revenue, customer, active-user, compliance-certification, or completed-acquisition claim is made.

### QuoteForge Local

- QuoteForge is a shipped commercial package with a Vercel demo, ten calculator templates, typed quote logic, local demo lead handling, CSV export, branding, embed and WordPress paths, licensing, buyer documentation, QA scripts, and release packaging.
- The private GitHub repository is the authoritative editable source.
- Release ZIPs, Payhip delivery files, and Vercel deployments should record the source commit from which they were generated.
- CI was improved so application-route checks run against the built Next.js server rather than failing without a running server.
- No verified purchase, customer, client deployment, recurring revenue, or adoption claim is made.

## Current Vercel Inventory

The authenticated Vercel team contains these relevant canonical projects:

| Vercel project | Public route | Purpose |
| --- | --- | --- |
| `weavestudio` | `https://weavestudio-nine.vercel.app/` | Primary WeaveStudio production deployment. |
| `weavestudio-demo` | `https://weavestudio-demo.vercel.app/` | Public review and acquisition surface. |
| `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | Authoritative BuildWorld demo. |
| `quoteforge-local` | `https://quoteforge-local.vercel.app/` | QuoteForge public product demo. |

A Vercel project named `source` exists but is not assigned as a canonical portfolio surface in the current source-authority map.

## Vercel-Pending Applications

The following workspaces now contain Vercel SPA configuration and a documented project plan, but no production Vercel alias is claimed yet:

- Portfolio Hub
- RedactReady Pro
- ProcessHarbor
- ScamShield AI
- RedactReady
- LayerForge Studio
- FocusForge
- VariantVision Pro

Astra and Nexus Play remain local-only because their local API services require an explicit Vercel Functions or separate backend design.

## Verification Evidence

The main portfolio root configures eleven application workspaces and exposes these validation commands:

```bash
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

The primary Portfolio CI now runs documentation checks before lint, typecheck, tests, and builds. A separate Vercel-readiness workflow builds the Portfolio Hub and LayerForge Studio without deploying them.

WeaveStudio exposes `npm run verify:buyer`, which combines documented unit, lint, typecheck, production-build, browser, and acquisition-package checks.

BuildWorld AI and QuoteForge Local maintain separate repository-native validation commands documented in their own READMEs.

A passing command supports the recorded build or test claim. It does not establish independent certification, security assurance, regulated compliance, production-scale suitability, or factual correctness of all output.

## Naming and Routing Normalization

- **ProcessHarbor** is the current public product name for the historical `opspilot-ai-operations-toolkit` workspace path.
- The separate `atomicdjt/buildworld-ai` repository is the authoritative BuildWorld product source; the monorepo copy remains portfolio-review evidence.
- WeaveStudio is presented as the most complete product and strongest acquisition-ready asset.
- BuildWorld AI is presented as the strongest technical-originality project.
- QuoteForge Local is presented as a shipped commercial package rather than proof of traction.
- Commercial products are separated from employer review so valuation or sales framing does not interfere with role evaluation.
- Legacy non-Vercel demo links were removed from primary profile, README, Hub, recruiter, index, deployment, verification, and audit surfaces.

## Current Canonical Public Surfaces

- BuildWorld AI: `https://buildworld-ai-v01-improvements.vercel.app/`
- WeaveStudio demo: `https://weavestudio-demo.vercel.app/`
- WeaveStudio production: `https://weavestudio-nine.vercel.app/`
- QuoteForge Local: `https://quoteforge-local.vercel.app/`
- QuoteForge Payhip page: `https://payhip.com/b/24De9`

Other applications are routed to source and case studies until verified Vercel production aliases exist.

## Portfolio Strengths

- Multiple source-backed applications rather than isolated prompt artifacts.
- Strong local-first, privacy, safety, portability, and human-review judgment.
- Unusually extensive employer, architecture, verification, buyer, and migration documentation.
- Clear separation between deterministic logic and optional external AI.
- Strong technical range across simulation, document processing, operations workflows, Canvas tooling, research support, and commercial packaging.
- Improved source-of-truth governance across the portfolio, WeaveStudio, BuildWorld, and QuoteForge.
- Vercel-only deployment consistency with explicit live-versus-pending status.

## Known Limitations and Remaining Gaps

- No verified external customer base, revenue history, active-user metrics, testimonials, or sustained adoption evidence is currently documented.
- Most employer-facing monorepo applications are Vercel Pending rather than currently deployed.
- Some applications remain static or browser-local and do not include accounts, cloud sync, durable databases, billing, or collaboration.
- Astra and Nexus Play need backend architecture work before Vercel production deployment.
- Historical deployment and test logs show point-in-time results and do not guarantee current uptime or future reliability.
- Repository pinning, social proof, external reviews, and real-world case studies remain major opportunities for additional credibility.

## Current Assessment

The portfolio is strongest as evidence for applied AI workflow, technical operations, product operations, documentation, knowledge operations, junior technical product analysis, and research-support roles. WeaveStudio and QuoteForge add a distinct commercial proof track without replacing the employer-first identity.

The largest immediate operational task is completing the Vercel migration for the Portfolio Hub and employer-facing flagships. The largest long-term quality constraint remains external validation: real users, credible testimonials, paid use, or independently documented deployments.

## Historical Reports

[Public Portfolio Audit — July 4, 2026](public-portfolio-audit-2026-07-04.md) remains available as a historical snapshot. It contains prior hosting references and must not be used as the current deployment map. This July 14 audit is the newer public-status reference.