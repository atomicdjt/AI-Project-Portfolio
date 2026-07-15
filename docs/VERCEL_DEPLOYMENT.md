# Vercel-Only Deployment Record

## Policy

All new portfolio deployments, redeployments, and production aliases use Vercel. Do not publish or republish this portfolio through Netlify or GitHub Pages.

Legacy hosting references may remain in historical audits or archived evidence, but they are not canonical deployment targets and must not be updated.

## Completed Employer Portfolio Migration — July 14, 2026

Eight isolated Vercel projects were created from `atomicdjt/AI-Project-Portfolio`. Each uses its own Root Directory, Vite framework detection, production branch `main`, Node.js 22.x, and an isolated production alias.

| Vercel project | Root Directory | Production route | Inspected state |
| --- | --- | --- | --- |
| `ai-project-portfolio-portfolio-hub` | `apps/portfolio-hub` | `https://ai-project-portfolio-portfolio-hub.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-redactready-pro-hri-os` | `apps/redactready-pro-hri-os` | `https://ai-project-portfolio-redactready-pr.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-opspilot-ai-operations-toolkit` | `apps/opspilot-ai-operations-toolkit` | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-scamshield-ai` | `apps/scamshield-ai` | `https://ai-project-portfolio-scamshield-ai.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-redactready-local` | `apps/redactready-local` | `https://ai-project-portfolio-redactready-lo.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-layerforge-studio` | `apps/layerforge-studio` | `https://ai-project-portfolio-layerforge-stu.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-focusforge` | `apps/focusforge` | `https://ai-project-portfolio-focusforge.vercel.app/` | `READY`, HTTP 200 |
| `ai-project-portfolio-variantvision-pro` | `apps/variantvision-pro` | `https://ai-project-portfolio-variantvision.vercel.app/` | `READY`, HTTP 200 |

The initial inspected deployments were derived from `AI-Project-Portfolio/main` commit `b122456e89b0915e27666b046ae108b51486fd4f`. A production verification on July 15, 2026 confirmed all eight projects `READY` from commit `61b12a058b6d6467d15b95303fd1dea4219159cc`. Subsequent repository changes may create newer deployments; Vercel remains the deployment-history record while GitHub remains the editable source of truth.

## Standard Project Configuration

| Setting | Value |
| --- | --- |
| GitHub repository | `atomicdjt/AI-Project-Portfolio` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production branch | `main` |
| Node.js | `22.x` |
| Root Directory | Project-specific path from the table above |
| Files outside Root Directory | Included in build step |
| Skip unaffected deployments | Enabled |

The repository includes a `vercel.json` file in each deployed Vite workspace to support SPA routing.

## Post-Deployment Inspection

The migration inspection confirmed:

- all eight production deployments reported `READY`,
- all eight canonical root routes returned HTTP 200,
- the served document title and description matched the intended application,
- no runtime-error cluster was reported during the inspection window,
- all eight Vercel projects were configured with Node.js 22.x,
- the Portfolio Hub and public documentation were updated to use Vercel routes.

These checks are point-in-time deployment evidence. They do not imply independent security assurance, regulated compliance, production-scale load validation, or external adoption.

## Project-Specific Notes

### Portfolio Hub

The former GitHub Pages deployment workflow is a build-only Vercel-readiness check. It no longer uploads or deploys a Pages artifact. The canonical Hub route is:

`https://ai-project-portfolio-portfolio-hub.vercel.app/`

### ProcessHarbor

The public Vercel deployment exposes the deterministic browser workflow. The repository also contains reference API contracts, optional server-side AI design, schema validation, audit behavior, and a database migration path.

Do not describe `/api/*` provider-backed routes as deployed until they are implemented as Vercel Functions and verified with server-side secrets, authorization, validation, rate limiting, error normalization, and deterministic fallback.

### Astra and Nexus Play

These workspaces include local API services and are outside this completed static migration. They require an explicit Vercel Functions or separate backend design before production deployment. Continue to describe them as local-only until that work is implemented and verified.

## Other Canonical Vercel Projects

| Project | Route | Authority |
| --- | --- | --- |
| WeaveStudio production | `https://weavestudio-nine.vercel.app/` | `atomicdjt/weavestudio/master` |
| WeaveStudio demo | `https://weavestudio-demo.vercel.app/` | `atomicdjt/weavestudio/master` |
| BuildWorld AI | `https://buildworld-ai-v01-improvements.vercel.app/` | `atomicdjt/buildworld-ai/main` |
| QuoteForge Local | `https://quoteforge-local.vercel.app/` | private `atomicdjt/quoteforge-local/main` |

A separate Vercel project named `source` is not assigned as a canonical portfolio deployment.

## Verification and Rollback

Before promoting future changes:

1. Run repository validation.
2. Review the Vercel preview deployment where applicable.
3. Confirm the intended application is served.
4. Check important routes, assets, browser behavior, and runtime errors.
5. Merge only after required checks pass.
6. Keep GitHub as the source of truth.
7. Use Vercel deployment history for rollback rather than restoring a legacy host.

See [deployment-and-previews.md](deployment-and-previews.md) for the current source-authority map and [verification.md](verification.md) for evidence boundaries.
