# Portfolio Verification

This repository contains eleven configured application workspaces under `apps/`. Validate from the repository root for portfolio-level evidence, or enter an individual workspace when reviewing one project in isolation.

Verification demonstrates that documented commands completed successfully at a recorded point in time. It does not establish independent certification, security assurance, compliance approval, production-scale usage, or factual correctness of generated content.

## Root Validation Commands

Use Node.js 22 or later.

```bash
npm ci
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

The root `package.json` defines:

- `check:docs` — validates repository Markdown links and documentation references.
- `lint:apps` — runs each configured application's lint command.
- `typecheck:all` — runs workspace typechecks where present.
- `test:all` — runs supported automated test suites.
- `build:all` — creates production builds for all eleven configured workspaces.
- `verify` — lint, typecheck, tests, and builds.
- `verify:release` — documentation checks followed by the complete verification suite.

Some workspaces perform TypeScript validation as part of `build` rather than through a separate `typecheck` script.

## Deployment Policy

All new deployments and redeployments use Vercel. The repository does not publish through Netlify or GitHub Pages.

The former Pages workflow is now a build-only **Portfolio Vercel Readiness** workflow. It builds the Portfolio Hub and LayerForge Studio, confirms their static output, and uploads CI artifacts without deploying them.

Migration-ready Vite workspaces contain `vercel.json` with the documented SPA rewrite to `index.html`.

## Runnable Workspace Matrix

| Public name | Local path | Local port or services | Build | Automated tests | Vercel status | Important boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Portfolio Hub | `apps/portfolio-hub` | `5180` | Yes | No dedicated suite; lint and build required | Vercel Pending | Presentation surface; public URL should be added only after verified Vercel deployment. |
| BuildWorld AI review copy | `apps/buildworld-ai` | `5183` | Yes | Vitest | Standalone product is [live on Vercel](https://buildworld-ai-v01-improvements.vercel.app/) | Educational and exploratory simulation; SSI and suggestions are heuristics. |
| RedactReady Pro | `apps/redactready-pro-hri-os` | `5181` | Yes | Vitest | Vercel Pending | Browser-local MVP; local storage and document parsing have documented limits. |
| ProcessHarbor | `apps/opspilot-ai-operations-toolkit` | `5177` | Yes | Vitest and Playwright workflow evidence | Vercel Pending | Static deterministic workflow is migration-ready; optional provider endpoints require Vercel Functions verification. |
| ScamShield AI | `apps/scamshield-ai` | `5178` | Yes | Vitest and Playwright | Vercel Pending | Explainable risk workflow, not a fraud determination or emergency service. |
| RedactReady | `apps/redactready-local` | Vite default unless occupied | Yes | Vitest and Playwright | Vercel Pending | OCR, face, and signature detection retain documented limitations. |
| LayerForge Studio | `apps/layerforge-studio` | `5176` | Yes | No dedicated suite documented | Vercel Pending | Local browser image editor; not a cloud collaboration system. |
| FocusForge | `apps/focusforge` | Vite default unless occupied | Yes | Vitest | Vercel Pending | Local productivity game; no medical or guaranteed productivity claim. |
| VariantVision Pro | `apps/variantvision-pro` | `5182` | Yes | Vitest and Playwright smoke evidence | Vercel Pending | Educational research workbench; not clinical interpretation or diagnosis. |
| Astra | `apps/astra` | UI `5174`, API `3002` | Yes | No dedicated suite documented | Local-only | Requires explicit Vercel Functions or separate backend design. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Yes | No dedicated suite documented | Local-only | Simulated checkout; requires explicit Vercel backend design. |

## Separate Authoritative Product Repositories

### WeaveStudio

Authoritative source: `atomicdjt/weavestudio`, branch `master`.

```bash
npm ci
npm run verify:buyer
```

Current Vercel surfaces:

- `https://weavestudio-nine.vercel.app/`
- `https://weavestudio-demo.vercel.app/`

The buyer gate includes unit tests, lint, type checking, production build, browser tests, and acquisition-package generation. External provider requests are mocked during browser tests. Passing tests do not imply independent certification or production adoption.

### BuildWorld AI

Authoritative source: `atomicdjt/buildworld-ai`, branch `main`.

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Current Vercel surface: `https://buildworld-ai-v01-improvements.vercel.app/`.

The standalone repository is the current source for product development and release evidence. The monorepo workspace remains useful portfolio-review evidence.

### QuoteForge Local

Authoritative source: private `atomicdjt/quoteforge-local`, branch `main`.

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run check:links:ci
npm run test:e2e
npm run package:founding-release
```

Current Vercel surface: `https://quoteforge-local.vercel.app/`.

A release ZIP, Payhip delivery package, and Vercel deployment should record the source commit from which they were generated. A passing package check does not establish customer adoption, legal sufficiency, or production-ready lead storage.

## Vercel Verification

A public project becomes `Live` only after:

1. repository validation passes,
2. Vercel reports the deployment as `READY`,
3. the production alias resolves,
4. core workflow smoke testing succeeds,
5. direct routes refresh correctly,
6. static assets load,
7. browser console has no unresolved application errors,
8. source commit and deployment URL are recorded.

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) and [deployment-and-previews.md](deployment-and-previews.md) for project settings and the current source-authority map.

## Evidence Interpretation

Verification supports claims such as:

- the application builds,
- documented automated tests pass,
- a Vercel deployment reached a ready state,
- a route was reachable when checked,
- a workflow behaved as described in the recorded test,
- packaging scripts produced the expected output.

Verification does not by itself support claims such as:

- secure against all attacks,
- compliant with a regulation,
- independently audited or certified,
- factually correct in all generated output,
- clinically, legally, financially, or operationally suitable,
- used or purchased by external customers.

## Historical Validation

The July 4, 2026 public audit and prior deployment logs remain historical snapshots. They may contain legacy hosting references and do not define the current deployment policy.

The current portfolio state, Vercel policy, source authorities, names, and deployment routing are summarized in [public-portfolio-audit-2026-07-14.md](public-portfolio-audit-2026-07-14.md).