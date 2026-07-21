# Portfolio Verification

This repository contains eleven configured application workspaces under `apps/`. Validate from the repository root for portfolio-level evidence, or enter an individual workspace when reviewing one project in isolation.

Verification demonstrates that documented commands completed successfully at a recorded point in time. It does not establish independent certification, security assurance, compliance approval, production-scale usage, or factual correctness of generated content.

## Root Validation Commands

Use Node.js 22 or later.

```bash
npm ci
npm run check:docs
npm run check:portfolio-authority
npm run check:deployment-policy
npm run test:deployment-selector
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

The root `package.json` defines:

- `check:docs` — validates repository Markdown links and documentation references.
- `check:portfolio-authority` — validates canonical project identities, branches, URLs, review order, duplicate deployment classifications, and claim-safe public wording.
- `check:deployment-policy` — prevents primary surfaces from restoring legacy deployment routes.
- `test:deployment-selector` — validates deterministic affected-project and explicit-project selection.
- `lint:apps` — runs each configured application's lint command.
- `typecheck:all` — runs workspace typechecks where present.
- `test:all` — runs supported automated test suites.
- `build:all` — creates production builds for all eleven configured workspaces.
- `verify` — deployment-selector tests, lint, typecheck, application tests, and builds.
- `verify:release` — documentation, portfolio-authority, deployment-policy, and complete verification checks.

Some workspaces perform TypeScript validation as part of `build` rather than through a separate `typecheck` script.

## Deployment Policy

All new deployments and redeployments use Vercel. The repository does not publish through Netlify or GitHub Pages.

The former Pages workflow is a build-only **Portfolio Vercel Readiness** workflow. It builds selected static outputs and uploads CI artifacts without deploying them.

The repository also contains a guarded affected-project Vercel workflow. Pull requests remain plan-only, and credentialed deployment stays disabled until secrets, activation, a single-project preview, and rollback are verified. Native Vercel Git deployment should not be disabled before that checkpoint.

## Runnable Workspace Matrix

| Public name | Local path | Local port or services | Build | Automated tests | Vercel status | Important boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Portfolio Hub | `apps/portfolio-hub` | `5180` | Yes | No dedicated suite; lint and build required | [Live](https://ai-project-portfolio-portfolio-hub.vercel.app/) | Presentation surface; source and case studies remain authoritative evidence. |
| BuildWorld AI review copy | `apps/buildworld-ai` | `5183` | Yes | Vitest | Standalone product is [live on Vercel](https://buildworld-ai-v01-improvements.vercel.app/) | Educational and exploratory simulation; SSI and suggestions are heuristics. |
| RedactReady Pro | `apps/redactready-pro-hri-os` | `5181` | Yes | Vitest | [Live](https://ai-project-portfolio-redactready-pr.vercel.app/) | Browser-local MVP; local storage and document parsing have documented limits. |
| ProcessHarbor | `apps/opspilot-ai-operations-toolkit` | `5177` | Yes | Vitest and Playwright workflow evidence | [Live static workflow](https://ai-project-portfolio-opspilot-ai-op.vercel.app/) | Optional provider endpoints are source-documented but are not represented as deployed on the static Vercel surface. |
| ScamShield AI | `apps/scamshield-ai` | `5178` | Yes | Vitest and Playwright | [Live](https://ai-project-portfolio-scamshield-ai.vercel.app/) | Explainable risk workflow, not a fraud determination or emergency service. |
| RedactReady | `apps/redactready-local` | Vite default unless occupied | Yes | Vitest and Playwright | [Live](https://ai-project-portfolio-redactready-lo.vercel.app/) | OCR, face, signature, metadata, and export verification retain documented limitations. |
| LayerForge Studio | `apps/layerforge-studio` | `5176` | Yes | No dedicated suite documented | [Live](https://ai-project-portfolio-layerforge-stu.vercel.app/) | Local browser image editor; not a cloud collaboration system. |
| FocusForge | `apps/focusforge` | Vite default unless occupied | Yes | Vitest | [Live](https://ai-project-portfolio-focusforge.vercel.app/) | Local productivity game; no medical or guaranteed productivity claim. |
| VariantVision Pro | `apps/variantvision-pro` | `5182` | Yes | Vitest and Playwright smoke evidence | [Live](https://ai-project-portfolio-variantvision.vercel.app/) | Educational research workbench; not clinical interpretation or diagnosis. |
| Astra | `apps/astra` | UI `5174`, API `3002` | Yes | No dedicated suite documented | Local-only | Requires explicit Vercel Functions or separate backend design. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Yes | No dedicated suite documented | Local-only | Simulated checkout; requires explicit Vercel backend design. |

## Deployment Verification Recorded July 14, 2026

For the Portfolio Hub and seven employer applications:

- Vercel framework: Vite
- Node.js: 22.x
- production branch: `main`
- latest inspected production state: `READY`
- production root response: HTTP 200
- deployed HTML identity: matched the intended application
- runtime-error clusters during the inspection window: none reported
- initial recorded source commit: `b122456e89b0915e27666b046ae108b51486fd4f`

This is point-in-time deployment evidence. It does not replace project-level automated tests, browser workflow testing, accessibility review, or future monitoring.

## Separate Authoritative Product Repositories

### WeaveStudio

Authoritative source: `atomicdjt/weavestudio`, branch `main`.

```bash
npm ci
npm run verify:buyer
```

Current canonical Vercel surface: `https://weavestudio-nine.vercel.app/`.

Legacy branch preview: `https://weavestudio-demo.vercel.app/` (non-canonical; retained only pending parity and public-reference checks).

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

The standalone repository is the current source for product development and release evidence. The monorepo workspace remains useful portfolio-review evidence. The production target still requires final confirmation in Vercel.

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

## Evidence Interpretation

Verification supports claims such as:

- the application builds;
- documented automated tests pass;
- a Vercel deployment reached a ready state;
- a production root route was reachable when checked;
- deployed HTML matched the intended application;
- packaging scripts produced the expected output.

Verification does not by itself support claims such as:

- secure against all attacks;
- compliant with a regulation;
- independently audited or certified;
- factually correct in all generated output;
- clinically, legally, financially, or operationally suitable;
- used or purchased by external customers.

## Historical Validation

The July 4 and July 14, 2026 audits and prior deployment logs remain historical snapshots. They may contain legacy hosting references and do not define current deployment policy.

Current source authorities, review order, Vercel routing, and evidence boundaries are defined by `config/vercel-projects.json`, [Project Index](PROJECT_INDEX.md), [Contextual Project Rankings](project-ranking.md), and [Deployment Map](deployment-and-previews.md).
