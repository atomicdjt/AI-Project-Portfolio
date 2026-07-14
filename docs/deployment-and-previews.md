# Vercel Deployment and Source-Authority Map

Last updated: July 14, 2026.

All new portfolio deployments, redeployments, preview deployments, and production aliases must use Vercel. Legacy non-Vercel hosts are historical evidence only and are not canonical routes.

A Vercel deployment is an output of a GitHub repository. It does not replace the repository as the editable source of truth.

## Authoritative Repositories

| Product or portfolio | Authoritative repository | Branch | Current deployment state |
| --- | --- | --- | --- |
| Employer portfolio and monorepo apps | `atomicdjt/AI-Project-Portfolio` | `main` | Portfolio Hub Vercel project pending |
| WeaveStudio | `atomicdjt/weavestudio` | `master` | Live on Vercel |
| BuildWorld AI standalone product | `atomicdjt/buildworld-ai` | `main` | Live on Vercel |
| QuoteForge Local | private `atomicdjt/quoteforge-local` | `main` | Live on Vercel |
| GitHub profile | `atomicdjt/atomicdjt` | `main` | GitHub profile surface; product links route only to Vercel or source |

The monorepo contains a BuildWorld review workspace, but current standalone product development and release evidence are maintained in `atomicdjt/buildworld-ai`.

## Current Verified Vercel Projects

| Vercel project | Public URL | Source authority | Purpose |
| --- | --- | --- | --- |
| `weavestudio` | `https://weavestudio-nine.vercel.app/` | `atomicdjt/weavestudio/master` | Primary WeaveStudio production deployment. |
| `weavestudio-demo` | `https://weavestudio-demo.vercel.app/` | `atomicdjt/weavestudio/master` | Public review and acquisition surface. |
| `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | `atomicdjt/buildworld-ai/main` | Authoritative BuildWorld public demo. |
| `quoteforge-local` | `https://quoteforge-local.vercel.app/` | private `atomicdjt/quoteforge-local/main` | QuoteForge Local public product demo. |

A project named `source` exists in the Vercel team but is not assigned as a canonical portfolio deployment in this map.

## Vercel-Pending Employer Applications

| Public name | Source | Recommended Vercel project | Root Directory | Current status |
| --- | --- | --- | --- | --- |
| Portfolio Hub | `apps/portfolio-hub` | `david-turner-portfolio` | `apps/portfolio-hub` | Vercel project pending; prior GitHub Pages deployment workflow disabled. |
| RedactReady Pro | `apps/redactready-pro-hri-os` | `redactready-pro` | `apps/redactready-pro-hri-os` | `vercel.json` added; production deployment pending. |
| ProcessHarbor | `apps/opspilot-ai-operations-toolkit` | `processharbor` | `apps/opspilot-ai-operations-toolkit` | `vercel.json` added; static workflow deployment pending; optional server endpoints require Vercel Functions verification. |
| ScamShield AI | `apps/scamshield-ai` | `scamshield-ai` | `apps/scamshield-ai` | `vercel.json` added; production deployment pending. |
| RedactReady | `apps/redactready-local` | `redactready-local` | `apps/redactready-local` | `vercel.json` added; production deployment pending. |
| LayerForge Studio | `apps/layerforge-studio` | `layerforge-studio` | `apps/layerforge-studio` | `vercel.json` added; production deployment pending. |
| FocusForge | `apps/focusforge` | `focusforge` | `apps/focusforge` | `vercel.json` added; production deployment pending. |
| VariantVision Pro | `apps/variantvision-pro` | `variantvision-pro` | `apps/variantvision-pro` | `vercel.json` added; production deployment pending. |

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for exact project settings, migration order, and verification requirements.

## Local-Only Workspaces

| Project | Source | Local services | Reason not yet deployed |
| --- | --- | --- | --- |
| Astra | `apps/astra` | UI `5174`, API `3002` | Requires an explicit Vercel Functions or separate backend design before production deployment. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Requires an explicit Vercel backend design; checkout remains simulated. |

## Preview and Production Policy

1. Create a focused Git branch and pull request.
2. Run repository validation.
3. Use a Vercel preview deployment connected to the pull-request branch.
4. Verify the core workflow, direct-route refresh, static assets, browser console, and mobile layout.
5. Correct the source branch when validation or deployment fails.
6. Merge only after required checks pass.
7. Promote or alias only a ready Vercel deployment built from the authoritative branch.
8. Record the source commit, Vercel project, deployment URL, and production alias.

Do not use GitHub Actions to deploy the Portfolio Hub. The former Pages workflow is now a build-only **Portfolio Vercel Readiness** check.

## Production Verification Standard

A project becomes `Live` only when:

- repository validation passes,
- Vercel reports `READY`,
- the production alias resolves,
- the primary browser workflow succeeds,
- direct route refreshes do not return 404,
- static assets load correctly,
- browser console has no unresolved application errors,
- the source commit and production URL are recorded.

Until then, use `Vercel Pending` and route reviewers to source and case studies.

## Rollback

If a Vercel deployment fails or regresses:

- keep GitHub as the source of truth,
- inspect Vercel build or runtime logs,
- fix the repository branch,
- create a new preview deployment,
- promote the corrected deployment or roll the alias back to the last verified deployment,
- document the final source commit.

Do not restore a legacy non-Vercel host as the canonical deployment.