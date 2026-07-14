# Vercel-Only Deployment Plan

## Policy

All new portfolio deployments, redeployments, and production aliases must use Vercel. Do not publish or republish this portfolio through Netlify or GitHub Pages.

Legacy hosting references may remain in historical audits or archived evidence, but they are not canonical deployment targets and must not be updated.

## Current Vercel Inventory — July 14, 2026

The authenticated Vercel team `atomicdjts-projects` currently contains these relevant projects:

| Vercel project | Purpose | Current public route |
| --- | --- | --- |
| `weavestudio` | Primary WeaveStudio production project | `https://weavestudio-nine.vercel.app/` |
| `weavestudio-demo` | WeaveStudio public review and acquisition demo | `https://weavestudio-demo.vercel.app/` |
| `buildworld-ai-v01-improvements` | Authoritative BuildWorld AI public demo | `https://buildworld-ai-v01-improvements.vercel.app/` |
| `quoteforge-local` | QuoteForge Local product demo | `https://quoteforge-local.vercel.app/` |

A separate project named `source` exists in the account but is not assigned as the canonical deployment for any portfolio surface in this document.

## Portfolio Projects to Create in Vercel

Create one Vercel project per application so deployments, aliases, logs, and rollback history remain isolated.

| Recommended Vercel project | GitHub repository | Root Directory | Framework | Build Command | Output Directory | Production branch |
| --- | --- | --- | --- | --- | --- | --- |
| `david-turner-portfolio` | `atomicdjt/AI-Project-Portfolio` | `apps/portfolio-hub` | Vite | `npm run build` | `dist` | `main` |
| `redactready-pro` | `atomicdjt/AI-Project-Portfolio` | `apps/redactready-pro-hri-os` | Vite | `npm run build` | `dist` | `main` |
| `processharbor` | `atomicdjt/AI-Project-Portfolio` | `apps/opspilot-ai-operations-toolkit` | Vite | `npm run build` | `dist` | `main` |
| `scamshield-ai` | `atomicdjt/AI-Project-Portfolio` | `apps/scamshield-ai` | Vite | `npm run build` | `dist` | `main` |
| `redactready-local` | `atomicdjt/AI-Project-Portfolio` | `apps/redactready-local` | Vite | `npm run build` | `dist` | `main` |
| `layerforge-studio` | `atomicdjt/AI-Project-Portfolio` | `apps/layerforge-studio` | Vite | `npm run build` | `dist` | `main` |
| `focusforge` | `atomicdjt/AI-Project-Portfolio` | `apps/focusforge` | Vite | `npm run build` | `dist` | `main` |
| `variantvision-pro` | `atomicdjt/AI-Project-Portfolio` | `apps/variantvision-pro` | Vite | `npm run build` | `dist` | `main` |

Use Node.js 22 for these projects unless a project-specific validation result establishes a newer requirement.

## Monorepo Connection Procedure

For each project:

1. Import `atomicdjt/AI-Project-Portfolio` into Vercel.
2. Select the project-specific Root Directory from the table above.
3. Confirm Framework Preset `Vite`.
4. Confirm Build Command `npm run build`.
5. Confirm Output Directory `dist`.
6. Set the Production Branch to `main`.
7. Enable preview deployments for pull requests.
8. Deploy the current branch as a preview first.
9. Verify the core workflow, direct-route refresh, browser console, and asset loading.
10. Promote only a successful deployment to production.
11. Record the production URL and deployment commit in `docs/deployment-and-previews.md`.

The repository includes a `vercel.json` file in each migration-ready Vite workspace to support SPA deep links.

## Migration Order

1. Portfolio Hub
2. RedactReady Pro
3. ProcessHarbor
4. ScamShield AI
5. RedactReady
6. LayerForge Studio
7. FocusForge
8. VariantVision Pro

This order prioritizes the public navigation surface, employer-role evidence, and flagship products.

## Project-Specific Notes

### Portfolio Hub

The former GitHub Pages deployment workflow has been converted into a build-only Vercel-readiness check. It no longer uploads or deploys a Pages artifact.

After the first production Vercel deployment:

- update the GitHub profile's Portfolio Hub link,
- update README and recruiter-guide links,
- add the Vercel production URL to the current audit,
- verify all cards and filters at mobile and desktop widths.

### ProcessHarbor

The deterministic browser workflow can be reviewed independently of optional provider-backed services. Before enabling any server-side AI or API feature on Vercel:

- port provider endpoints to supported Vercel Functions under `/api`,
- keep provider keys server-side,
- preserve strict schema validation and deterministic fallback behavior,
- verify rate limiting, error handling, and health metadata on a preview deployment.

Do not advertise optional server functionality as deployed until those checks pass on Vercel.

### Astra and Nexus Play

These workspaces include local API services and are not in the initial static migration list. They require an explicit Vercel Functions or separate backend design before production deployment. Continue to describe them as local-only until that work is completed and verified.

## Verification Standard

A project becomes `Live` only after all of the following are true:

- repository validation passes,
- Vercel reports the deployment as `READY`,
- the production alias resolves,
- core browser workflow succeeds,
- direct routes refresh without a 404,
- browser console shows no unresolved application errors,
- source commit and production URL are recorded.

Until then, use the status `Vercel Pending` rather than linking to a legacy host.

## Rollback and Source Authority

Vercel deployments are outputs of the authoritative GitHub branch. GitHub remains the editable source of truth.

If a deployment fails:

- do not replace source authority with a downloaded deployment artifact,
- inspect Vercel build logs,
- fix the repository branch,
- validate through a new preview deployment,
- promote or alias only the corrected Vercel deployment.
