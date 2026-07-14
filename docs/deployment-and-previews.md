# Deployment and Source-Authority Map

Last updated: July 14, 2026.

This document distinguishes the authoritative editable source from public deployments and supplemental demos. A deployment is an output of a repository; it does not replace the repository as the source of truth.

## Authoritative Repositories

| Product or portfolio | Authoritative repository | Branch | Public surface |
| --- | --- | --- | --- |
| Employer portfolio and monorepo apps | `atomicdjt/AI-Project-Portfolio` | `main` | https://atomicdjt.github.io/AI-Project-Portfolio/ |
| WeaveStudio | `atomicdjt/weavestudio` | `master` | https://weavestudio-demo.vercel.app/ |
| BuildWorld AI standalone product | `atomicdjt/buildworld-ai` | `main` | https://buildworld-ai-v01-improvements.vercel.app/ |
| QuoteForge Local | private `atomicdjt/quoteforge-local` | `main` | https://quoteforge-local.vercel.app/ |
| GitHub profile | `atomicdjt/atomicdjt` | `main` | https://github.com/atomicdjt |

The monorepo contains a BuildWorld review workspace, but current standalone product development and release evidence are maintained in `atomicdjt/buildworld-ai`.

## GitHub Pages

| Surface | URL | Source | Deployment trigger |
| --- | --- | --- | --- |
| Portfolio Hub | `https://atomicdjt.github.io/AI-Project-Portfolio/` | `apps/portfolio-hub` | GitHub Pages workflow after merge to `main` |
| LayerForge Studio | `https://atomicdjt.github.io/AI-Project-Portfolio/layerforge-studio/` | `apps/layerforge-studio` | Copied into the Pages artifact by the repository Pages workflow |

GitHub Pages production publication should happen only after a reviewed pull request is merged into `main` and required checks pass.

## Employer-Facing App Deployments

| Public name | URL | Source authority | Hosting interpretation |
| --- | --- | --- | --- |
| BuildWorld AI | `https://buildworld-ai-v01-improvements.vercel.app/` | Separate `atomicdjt/buildworld-ai` repository | Primary standalone product demo. A prior Netlify deployment may remain available as historical or secondary hosting. |
| RedactReady Pro | `https://redactready-pro-hri-os.netlify.app/` | `apps/redactready-pro-hri-os` | Source-backed monorepo application. |
| ProcessHarbor | `https://opspilot-ai-operations-toolkit.netlify.app/` | `apps/opspilot-ai-operations-toolkit` | Public product name differs from the historical workspace path. |
| ScamShield AI | `https://scamshield-ai-safety.netlify.app/` | `apps/scamshield-ai` | Source-backed monorepo application. |
| RedactReady | `https://redactready-local.netlify.app/` | `apps/redactready-local` | Source-backed monorepo application. |
| FocusForge | `https://focusforge-productivity-game.netlify.app/` | `apps/focusforge` | Source-backed monorepo application. |
| VariantVision Pro | `https://variantvisionpro.netlify.app/` | `apps/variantvision-pro` | Source-backed monorepo application. |

## Commercial and Acquisition Deployments

| Product | URL | Source authority | Boundary |
| --- | --- | --- | --- |
| WeaveStudio public demo | `https://weavestudio-demo.vercel.app/` | `atomicdjt/weavestudio/master` | Public review and acquisition surface. |
| WeaveStudio production | `https://weavestudio-nine.vercel.app/` | `atomicdjt/weavestudio/master` | Primary production deployment documented by the product repository. |
| QuoteForge Local | `https://quoteforge-local.vercel.app/` | private `atomicdjt/quoteforge-local/main` | Public product demo; release packages and Payhip files must remain traceable to a recorded source commit. |
| QuoteForge Payhip page | `https://payhip.com/b/24De9` | Commercial listing, not source | Checkout and delivery surface only. |

Commercial availability does not imply verified purchases, customers, revenue, or completed acquisition activity.

## Local-Only Workspaces

| Project | Source | Local services | Boundary |
| --- | --- | --- | --- |
| Astra | `apps/astra` | UI `5174`, API `3002` | Live model responses require local provider configuration. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Checkout is simulated; no real payment processing. |

## Supplemental External Demos

These public demos are useful supporting evidence, but their source is not represented as a current runnable workspace in this repository unless stated.

| Project | Public URL | Repository status |
| --- | --- | --- |
| Amino Acid Research Workbench | `https://aminoacidworkbench.netlify.app/` | Documentation-first case study in `projects/amino-acid-research-workbench`; no local `apps/` workspace. |
| GardenGrid | `https://garden-grid-planner-demo.netlify.app/` | Source not present in this repository. |
| HearthLink | `https://hearthlink-p2p-demo.netlify.app/` | Source not present in this repository. |

## Pull Request and Preview Policy

1. Create a focused feature branch.
2. Run the repository's documented validation commands.
3. Open a pull request into the authoritative default branch.
4. Review the diff, public claims, link targets, and deployment impact.
5. Use provider preview deployments when available.
6. Merge only after required checks succeed or any known exception is explicitly documented.
7. Record the merged commit used for production deployment or a commercial release package.

## Production Verification

After merge and deployment:

- Confirm the default branch contains the merged commit.
- Confirm the hosting provider reports a successful deployment.
- Open the public route and exercise the core workflow.
- Check direct-route refresh behavior for single-page applications.
- Recheck primary source, case-study, product, and checkout links.
- Update this map when the canonical source or deployment changes.

Historical deployment notes remain useful audit evidence, but they should not be treated as the current canonical map when this document records a newer source or URL.