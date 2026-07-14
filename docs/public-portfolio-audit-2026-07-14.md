# Public Portfolio Audit — July 14, 2026

## Scope

This audit reviews the GitHub profile, employer portfolio repository, live Portfolio Hub, source-authority map, flagship project routing, commercial product presentation, deployment policy, and current repository-governance state.

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

- The former GitHub Pages workflow is a build-only **Portfolio Vercel Readiness** workflow.
- No portfolio application should be published or republished through Netlify or GitHub Pages.
- Legacy non-Vercel URLs remain historical evidence only and are not current canonical routes.
- The Portfolio Hub and seven employer applications each have an isolated Vercel project.
- GitHub remains the editable source of truth.

## Current Employer Review Path

1. **[Portfolio Hub](https://ai-project-portfolio-portfolio-hub.vercel.app/)** — fastest visual review and project routing.
2. **[BuildWorld AI](https://buildworld-ai-v01-improvements.vercel.app/)** — technical originality, systems thinking, deterministic simulation, reproducibility, and reporting.
3. **[RedactReady Pro](https://ai-project-portfolio-redactready-pr.vercel.app/)** — privacy, document intelligence, local-first workflow design, and responsible boundaries.
4. **[ProcessHarbor](https://ai-project-portfolio-opspilot-ai-op.vercel.app/)** — technical operations, SOPs, onboarding, knowledge-base workflows, gap analysis, versioning, and exports.
5. **[ScamShield AI](https://ai-project-portfolio-scamshield-ai.vercel.app/)** — public-interest safety workflow and explainable local analysis.
6. **[LayerForge Studio](https://ai-project-portfolio-layerforge-stu.vercel.app/)** — frontend and Canvas interaction depth.

## Completed Vercel Migration

The following Vite workspaces are live as isolated Vercel production projects:

| Application | Canonical route | Inspected state |
| --- | --- | --- |
| Portfolio Hub | `https://ai-project-portfolio-portfolio-hub.vercel.app/` | `READY`, HTTP 200 |
| RedactReady Pro | `https://ai-project-portfolio-redactready-pr.vercel.app/` | `READY`, HTTP 200 |
| ProcessHarbor | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | `READY`, HTTP 200 |
| ScamShield AI | `https://ai-project-portfolio-scamshield-ai.vercel.app/` | `READY`, HTTP 200 |
| RedactReady | `https://ai-project-portfolio-redactready-lo.vercel.app/` | `READY`, HTTP 200 |
| LayerForge Studio | `https://ai-project-portfolio-layerforge-stu.vercel.app/` | `READY`, HTTP 200 |
| FocusForge | `https://ai-project-portfolio-focusforge.vercel.app/` | `READY`, HTTP 200 |
| VariantVision Pro | `https://ai-project-portfolio-variantvision.vercel.app/` | `READY`, HTTP 200 |

All eight were inspected with Vite, production branch `main`, and Node.js 22.x. Their root documents matched the intended application, and no runtime-error cluster was reported during the inspection window. The initial deployment baseline was repository commit `b122456e89b0915e27666b046ae108b51486fd4f`.

### ProcessHarbor limitation

The public Vercel route is the deterministic browser workflow. The repository contains reference API contracts, optional server-side AI design, validation, audit behavior, and a database migration path, but those provider-backed endpoints are not represented as active on the static deployment.

Astra and Nexus Play remain local-only because their local API services require an explicit Vercel Functions or separate backend design.

## Current Commercial Assets

### WeaveStudio

- The acquisition hardening, OpenAI/Gemini BYOK assistance, browser coverage, buyer materials, commercial architecture guidance, and repository-governance work were consolidated into `master` on July 14, 2026.
- `master` is the single editable source of truth.
- GitHub Actions and associated Vercel checks passed after consolidation.
- Buyer materials include architecture, feature-reality, transfer, operating-plan, value-proof, outreach, and packaging documentation.
- No revenue, customer, active-user, compliance-certification, or completed-acquisition claim is made.

### QuoteForge Local

- QuoteForge is a shipped commercial package with a Vercel demo, ten calculator templates, typed quote logic, local demo lead handling, CSV export, branding, embed and WordPress paths, licensing, buyer documentation, QA scripts, and release packaging.
- The private GitHub repository is the authoritative editable source.
- Release ZIPs, Payhip delivery files, and Vercel deployments should record the source commit from which they were generated.
- CI runs application-route checks against the built Next.js server.
- No verified purchase, customer, client deployment, recurring revenue, or adoption claim is made.

## Other Canonical Vercel Projects

| Vercel project | Public route | Purpose |
| --- | --- | --- |
| `weavestudio` | `https://weavestudio-nine.vercel.app/` | Primary WeaveStudio production deployment. |
| `weavestudio-demo` | `https://weavestudio-demo.vercel.app/` | Public review and acquisition surface. |
| `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | Authoritative BuildWorld demo. |
| `quoteforge-local` | `https://quoteforge-local.vercel.app/` | QuoteForge public product demo. |

A Vercel project named `source` exists but is not assigned as a canonical portfolio surface.

## Verification Evidence

The main portfolio root configures eleven application workspaces and exposes these validation commands:

```bash
npm run check:docs
npm run check:deployment-policy
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

The primary Portfolio CI runs documentation and deployment-policy checks before lint, typecheck, tests, and builds. A separate Vercel-readiness workflow builds the Portfolio Hub and LayerForge Studio without deploying them.

WeaveStudio exposes `npm run verify:buyer`, and BuildWorld AI and QuoteForge Local maintain separate repository-native validation commands.

A passing command or ready deployment supports the recorded point-in-time claim. It does not establish independent certification, security assurance, regulated compliance, production-scale suitability, factual correctness of all output, or external adoption.

## Naming and Routing Normalization

- **ProcessHarbor** is the current public product name for the historical `opspilot-ai-operations-toolkit` workspace path.
- The separate `atomicdjt/buildworld-ai` repository is the authoritative BuildWorld product source; the monorepo copy remains portfolio-review evidence.
- WeaveStudio is presented as the most complete product and strongest acquisition-ready asset.
- BuildWorld AI is presented as the strongest technical-originality project.
- QuoteForge Local is presented as a shipped commercial package rather than proof of traction.
- Commercial products are separated from employer review so valuation or sales framing does not interfere with role evaluation.
- Primary profile, README, Hub, recruiter, index, deployment, verification, and audit surfaces use Vercel routes only.

## Portfolio Strengths

- Multiple source-backed applications rather than isolated prompt artifacts.
- Eight live Vercel employer-portfolio surfaces plus separate live commercial and technical flagships.
- Strong local-first, privacy, safety, portability, and human-review judgment.
- Unusually extensive employer, architecture, verification, buyer, and deployment documentation.
- Clear separation between deterministic logic and optional external AI.
- Strong technical range across simulation, document processing, operations workflows, Canvas tooling, research support, and commercial packaging.
- Improved source-of-truth governance across the portfolio, WeaveStudio, BuildWorld, and QuoteForge.

## Known Limitations and Remaining Gaps

- No verified external customer base, revenue history, active-user metrics, testimonials, or sustained adoption evidence is currently documented.
- Production deployment checks are point-in-time and do not guarantee future uptime, browser compatibility, or scale.
- Some applications remain static or browser-local and do not include accounts, cloud sync, durable databases, billing, or collaboration.
- ProcessHarbor's provider-backed reference endpoints are not deployed on its current static Vercel surface.
- Astra and Nexus Play need backend architecture work before Vercel production deployment.
- Repository pinning, social proof, external reviews, and real-world case studies remain major opportunities for additional credibility.

## Current Assessment

The portfolio is strongest as evidence for applied AI workflow, technical operations, product operations, documentation, knowledge operations, junior technical product analysis, frontend product implementation, and research-support roles. WeaveStudio and QuoteForge add a distinct commercial proof track without replacing the employer-first identity.

The largest previous operational gap—the employer portfolio's deployment inconsistency—has been resolved through eight isolated Vercel projects and a canonical public routing map. The largest remaining quality constraint is external validation: real users, credible testimonials, paid use, or independently documented deployments.

## Historical Reports

[Public Portfolio Audit — July 4, 2026](public-portfolio-audit-2026-07-04.md) remains available as a historical snapshot. It contains prior hosting references and must not be used as the current deployment map. This July 14 audit is the current public-status reference.
