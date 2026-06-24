# Portfolio Verification

This repository contains several self-contained runnable apps under `apps/`. Validate from the repository root when you want portfolio-level evidence, or enter an individual app folder when reviewing one project in isolation.

## Root Validation Commands

```bash
npm install
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
```

`npm run verify` runs lint, supported standalone typechecks, supported tests, and production builds. Some apps only typecheck as part of `npm run build` because they do not expose a separate `typecheck` script.

## Runnable Apps

| App name | Local path | Local port | Build command | Lint support | Typecheck support | Test support | E2E support | Deployment status if documented | Notes / limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ScamShield AI | `apps/scamshield-ai` | `5178` | `npm run build --workspace apps/scamshield-ai` | Yes | Yes, `typecheck` script | Yes, Vitest | Yes, Playwright | Live Netlify demo documented: `https://scamshield-ai-safety.netlify.app/` | Local-first static app; documented CSP blocks runtime network access. |
| RedactReady | `apps/redactready-local` | Vite default `5173` unless occupied | `npm run build --workspace apps/redactready-local` | Yes | Build includes TypeScript project check | Yes, Vitest | Yes, Playwright | Live Netlify demo documented: `https://redactready-local.netlify.app/` | OCR and face/signature detection are documented limitations. |
| LayerForge Studio | `apps/layerforge-studio` | `5176` | `npm run build --workspace apps/layerforge-studio` | Yes | Build includes TypeScript project check | Not documented | Not documented | GitHub Pages deployment documented | Pages build uses `GITHUB_PAGES=true npm run build --workspace apps/layerforge-studio`. |
| OpsPilot | `apps/opspilot-ai-operations-toolkit` | `5177` | `npm run build --workspace apps/opspilot-ai-operations-toolkit` | Yes | Build includes TypeScript project check | Not documented | Not documented | Live Netlify demo documented: `https://opspilot-ai-operations-toolkit.netlify.app/` | Deterministic local drafting engine; OpenAI-backed endpoint is roadmap scope. |
| Astra | `apps/astra` | UI `5174`, API `3002` | `npm run build --workspace apps/astra` | Yes | Build includes TypeScript project check | Not documented | Not documented | Local-only in current docs | Live model responses require `apps/astra/.env.local`; UI still runs without a key. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | `npm run build --workspace apps/nexus-play` | Yes | Build includes TypeScript project check | Not documented | Not documented | Local-only in current docs | Simulated checkout only; no real payments. |
| FocusForge | `apps/focusforge` | Vite default `5173` unless occupied | `npm run build --workspace apps/focusforge` | Yes | Not documented as a standalone typecheck | Yes, Vitest via `test:run` | Not documented | Static-host deployment guidance documented; no live URL documented | JavaScript Vite app; persistent progress and analytics are roadmap items in the case study. |

## Known Validation Issues

- `npm install` completed successfully on 2026-06-24, but npm reported 3 audit findings: 2 moderate and 1 high. Dependency remediation was not attempted in this polish pass because the request avoided dependency upgrades unless needed for existing scripts.
- `npm run build:all` and `npm run verify` completed successfully, but Vite reported a non-blocking warning about chunks larger than 500 kB after minification. Bundle splitting is a future optimization, not a current validation failure.
