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
- `test:all` — runs the supported automated test suites.
- `build:all` — creates production builds for all eleven configured workspaces.
- `verify` — lint, typecheck, tests, and builds.
- `verify:release` — documentation checks followed by the complete verification suite.

Some workspaces perform TypeScript validation as part of `build` rather than through a separate `typecheck` script.

## Runnable Workspace Matrix

| Public name | Local path | Local port or services | Build | Automated tests | Public status | Important boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Portfolio Hub | `apps/portfolio-hub` | `5180` | Yes | No dedicated suite; lint and build required | GitHub Pages | Routing and presentation surface, not a product backend. |
| BuildWorld AI review copy | `apps/buildworld-ai` | `5183` | Yes | Vitest | Standalone product is maintained in `atomicdjt/buildworld-ai` | Educational and exploratory simulation; SSI and suggestions are heuristics. |
| RedactReady Pro | `apps/redactready-pro-hri-os` | `5181` | Yes | Vitest | Live Netlify demo | Browser-local MVP; local storage and document parsing have documented limits. |
| ProcessHarbor | `apps/opspilot-ai-operations-toolkit` | `5177` | Yes | Vitest and Playwright workflow evidence | Live Netlify demo | Public name differs from historical workspace path; optional server AI requires configured environment. |
| ScamShield AI | `apps/scamshield-ai` | `5178` | Yes | Vitest and Playwright | Live Netlify demo | Explainable risk workflow, not a fraud determination or emergency service. |
| RedactReady | `apps/redactready-local` | Vite default unless occupied | Yes | Vitest and Playwright | Live Netlify demo | OCR, face, and signature detection retain documented limitations. |
| LayerForge Studio | `apps/layerforge-studio` | `5176` | Yes | No dedicated suite documented | GitHub Pages subpath | Local browser image editor; not a cloud collaboration system. |
| FocusForge | `apps/focusforge` | Vite default unless occupied | Yes | Vitest | Live Netlify demo | Local productivity game; no medical or guaranteed productivity claim. |
| VariantVision Pro | `apps/variantvision-pro` | `5182` | Yes | Vitest and Playwright smoke evidence | Live Netlify demo | Educational research workbench; not clinical interpretation or diagnosis. |
| Astra | `apps/astra` | UI `5174`, API `3002` | Yes | No dedicated suite documented | Local-only | Live provider responses require local configuration; interface still exposes missing-key states. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | Yes | No dedicated suite documented | Local-only | Checkout and installation workflows are simulated. |

## Separate Authoritative Product Repositories

These products must be verified in their own repositories rather than through the portfolio monorepo alone.

### WeaveStudio

Authoritative source: `atomicdjt/weavestudio`, branch `master`.

```bash
npm ci
npm run verify:buyer
```

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

The standalone repository is the current source for product development and release evidence. The monorepo workspace remains useful portfolio-review evidence.

### QuoteForge Local

Authoritative source: private `atomicdjt/quoteforge-local`, branch `main`.

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run check:links
npm run package:founding-release
```

A release ZIP, Payhip delivery package, and deployment should record the source commit from which they were generated. A passing package check does not establish customer adoption, legal sufficiency, or production-ready lead storage.

## Public Link Verification

The canonical public map is maintained in [deployment-and-previews.md](deployment-and-previews.md). Current primary routes include:

- Portfolio Hub: `https://atomicdjt.github.io/AI-Project-Portfolio/`
- BuildWorld AI: `https://buildworld-ai-v01-improvements.vercel.app/`
- RedactReady Pro: `https://redactready-pro-hri-os.netlify.app/`
- ProcessHarbor: `https://opspilot-ai-operations-toolkit.netlify.app/`
- ScamShield AI: `https://scamshield-ai-safety.netlify.app/`
- RedactReady: `https://redactready-local.netlify.app/`
- LayerForge Studio: `https://atomicdjt.github.io/AI-Project-Portfolio/layerforge-studio/`
- FocusForge: `https://focusforge-productivity-game.netlify.app/`
- VariantVision Pro: `https://variantvisionpro.netlify.app/`
- WeaveStudio: `https://weavestudio-demo.vercel.app/`
- QuoteForge Local: `https://quoteforge-local.vercel.app/`

A public route should be described as currently verified only after a contemporary status or browser check. Historical HTTP 200 sweeps remain evidence for their recorded dates but do not guarantee present availability.

## Evidence Interpretation

Verification supports claims such as:

- the application builds,
- documented automated tests pass,
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

The July 4, 2026 public audit and prior command logs remain available as historical snapshots. The current portfolio state, source authorities, names, and deployment routing are summarized in [public-portfolio-audit-2026-07-14.md](public-portfolio-audit-2026-07-14.md).
