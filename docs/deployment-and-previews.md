# Vercel Deployment and Source-Authority Map

Last updated: July 14, 2026.

All new portfolio deployments, redeployments, preview deployments, and production aliases use Vercel. Legacy non-Vercel hosts are historical evidence only and are not canonical routes. GitHub remains the editable source of truth; Vercel deployments are derivative outputs.

## Authoritative Repositories

| Product or portfolio | Authoritative repository | Branch | Current deployment state |
| --- | --- | --- | --- |
| Employer portfolio and monorepo apps | `atomicdjt/AI-Project-Portfolio` | `main` | Portfolio Hub and seven employer applications live on Vercel |
| WeaveStudio | `atomicdjt/weavestudio` | `master` | Live on Vercel |
| BuildWorld AI standalone product | `atomicdjt/buildworld-ai` | `main` | Live on Vercel |
| QuoteForge Local | private `atomicdjt/quoteforge-local` | `main` | Live on Vercel |
| GitHub profile | `atomicdjt/atomicdjt` | `main` | GitHub profile surface; product links route only to Vercel or source |

The monorepo contains a BuildWorld review workspace, but current standalone product development and release evidence are maintained in `atomicdjt/buildworld-ai`.

## Employer Portfolio Vercel Projects

The eight monorepo projects below were created from `atomicdjt/AI-Project-Portfolio`, production branch `main`, with Vite and Node.js 22.x. Their initial verified production deployments were derived from commit `b122456e89b0915e27666b046ae108b51486fd4f`; later repository changes may create newer deployment commits and should remain traceable in Vercel.

| Public name | Vercel project | Root Directory | Canonical production route | State |
| --- | --- | --- | --- | --- |
| Portfolio Hub | `ai-project-portfolio-portfolio-hub` | `apps/portfolio-hub` | `https://ai-project-portfolio-portfolio-hub.vercel.app/` | `READY`, HTTP 200 |
| RedactReady Pro | `ai-project-portfolio-redactready-pro-hri-os` | `apps/redactready-pro-hri-os` | `https://ai-project-portfolio-redactready-pr.vercel.app/` | `READY`, HTTP 200 |
| ProcessHarbor | `ai-project-portfolio-opspilot-ai-operations-toolkit` | `apps/opspilot-ai-operations-toolkit` | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | `READY`, HTTP 200; static deterministic workflow |
| ScamShield AI | `ai-project-portfolio-scamshield-ai` | `apps/scamshield-ai` | `https://ai-project-portfolio-scamshield-ai.vercel.app/` | `READY`, HTTP 200 |
| RedactReady | `ai-project-portfolio-redactready-local` | `apps/redactready-local` | `https://ai-project-portfolio-redactready-lo.vercel.app/` | `READY`, HTTP 200 |
| LayerForge Studio | `ai-project-portfolio-layerforge-studio` | `apps/layerforge-studio` | `https://ai-project-portfolio-layerforge-stu.vercel.app/` | `READY`, HTTP 200 |
| FocusForge | `ai-project-portfolio-focusforge` | `apps/focusforge` | `https://ai-project-portfolio-focusforge.vercel.app/` | `READY`, HTTP 200 |
| VariantVision Pro | `ai-project-portfolio-variantvision-pro` | `apps/variantvision-pro` | `https://ai-project-portfolio-variantvision.vercel.app/` | `READY`, HTTP 200 |
| GardenGrid | `ai-project-portfolio-garden-grid` | `apps/garden-grid-planner` | `https://ai-project-portfolio-garden-grid.vercel.app/` | `READY`, HTTP 200; recovered source |
| Amino Acid Workbench | `ai-project-portfolio-amino-workbench` | `apps/amino-acid-workbench-legacy` | `https://ai-project-portfolio-amino-workbenc.vercel.app/` | `READY`, HTTP 200; legacy static artifact |
| HearthLink | `ai-project-portfolio-hearthlink` | `apps/hearthlink-legacy` | `https://ai-project-portfolio-hearthlink.vercel.app/` | `READY`, HTTP 200; offline/demo static artifact |

No runtime-error clusters were reported for these projects during the post-creation inspection window.

GardenGrid is source-backed in this repository. Amino Acid Workbench and HearthLink are static legacy artifacts preserved from their Netlify deployments because no original editable source was available locally. HearthLink intentionally runs in offline/demo mode without a signaling server; do not describe it as an operating multi-peer service.

### ProcessHarbor boundary

The public Vercel deployment is the deterministic browser workflow. The repository also contains reference API contracts, validation, an optional server-side AI design, and a database migration path. Those provider-backed endpoints are not represented as deployed on the current static Vercel surface.

## Other Canonical Vercel Projects

| Vercel project | Public URL | Source authority | Purpose |
| --- | --- | --- | --- |
| `weavestudio` | `https://weavestudio-nine.vercel.app/` | `atomicdjt/weavestudio/master` | Primary WeaveStudio production deployment. |
| `weavestudio-demo` | `https://weavestudio-demo.vercel.app/` | `atomicdjt/weavestudio/master` | Public review and acquisition surface. |
| `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | `atomicdjt/buildworld-ai/main` | Authoritative BuildWorld public demo. |
| `quoteforge-local` | `https://quoteforge-local.vercel.app/` | private `atomicdjt/quoteforge-local/main` | QuoteForge Local public product demo. |

A project named `source` exists in the Vercel team but is not assigned as a canonical portfolio deployment.

## Local-Only Workspaces

| Project | Source | Local services | Reason not deployed |
| --- | --- | --- | --- |
| Astra | `apps/astra` | UI `5174`, API `3002` | Requires an explicit Vercel Functions or separate backend design before production deployment. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Requires an explicit Vercel backend design; checkout remains simulated. |

## Production Verification Standard

A project is labeled `Live` when:

- repository validation passes,
- Vercel reports `READY`,
- the production alias resolves,
- the root document and static assets respond successfully,
- the deployed application identity matches the intended workspace,
- runtime inspection reports no unresolved application-error cluster,
- important product limitations remain explicit,
- source authority and production URL are recorded.

Interactive workflow testing and future uptime remain point-in-time concerns; a successful deployment does not imply independent security certification, compliance, external adoption, or production-scale suitability.

## Preview and Rollback Policy

1. Create a focused Git branch and pull request.
2. Run repository validation.
3. Use the connected Vercel preview deployment where appropriate.
4. Correct source when validation, metadata, routing, or runtime checks fail.
5. Merge only after required checks pass.
6. Keep GitHub as the source of truth.
7. Promote or retain only a `READY` deployment from the authoritative branch.
8. Use Vercel rollback history rather than restoring a legacy host.

The former GitHub Pages workflow is a build-only **Portfolio Vercel Readiness** check and does not deploy the Hub.
