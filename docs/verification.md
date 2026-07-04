# Portfolio Verification

This repository contains several self-contained runnable apps under `apps/`. Validate from the repository root when you want portfolio-level evidence, or enter an individual app folder when reviewing one project in isolation.

## Root Validation Commands

```bash
npm install
npm run lint:apps
npm run check:docs
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
npm run verify:release
```

`npm run verify` runs lint, supported standalone typechecks, supported tests, and production builds. `npm run verify:release` adds local Markdown link validation before the full app validation suite. Some apps only typecheck as part of `npm run build` because they do not expose a separate `typecheck` script.

## Runnable Apps

| App name | Local path | Local port | Build command | Lint support | Typecheck support | Test support | E2E support | Deployment status if documented | Notes / limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BuildWorld AI | `apps/buildworld-ai` | `5183` | `npm run build --workspace apps/buildworld-ai` | Yes | Yes, `typecheck` script | Yes, Vitest | Browser smoke screenshots documented | Live Netlify demo documented: `https://buildworld-ai.netlify.app/` | Browser-only educational simulation MVP; SSI is exploratory and not a certified engineering/public-health/safety model. |
| RedactReady Pro | `apps/redactready-pro-hri-os` | `5181` | `npm run build --workspace apps/redactready-pro-hri-os` | Yes | Build includes TypeScript project check | Yes, Vitest | Browser smoke screenshots documented | Live Netlify demo documented: `https://redactready-pro-hri-os.netlify.app/` | Browser-only local-first MVP; PDF/image parsing is a documented fallback/roadmap item. |
| ScamShield AI | `apps/scamshield-ai` | `5178` | `npm run build --workspace apps/scamshield-ai` | Yes | Yes, `typecheck` script | Yes, Vitest | Yes, Playwright | Live Netlify demo documented: `https://scamshield-ai-safety.netlify.app/` | Local-first static app; documented CSP blocks runtime network access. |
| RedactReady | `apps/redactready-local` | Vite default `5173` unless occupied | `npm run build --workspace apps/redactready-local` | Yes | Build includes TypeScript project check | Yes, Vitest | Yes, Playwright | Live Netlify demo documented: `https://redactready-local.netlify.app/` | OCR and face/signature detection are documented limitations. |
| Portfolio Hub | `apps/portfolio-hub` | `5180` | `npm run build --workspace apps/portfolio-hub` | Yes | JavaScript app; no separate typecheck | Not documented | Not documented | GitHub Pages deployment documented | Pages root publishes the portfolio hub. |
| LayerForge Studio | `apps/layerforge-studio` | `5176` | `npm run build --workspace apps/layerforge-studio` | Yes | Build includes TypeScript project check | Not documented | Not documented | GitHub Pages deployment documented | Pages workflow copies LayerForge under `/layerforge-studio/`. |
| OpsPilot | `apps/opspilot-ai-operations-toolkit` | `5177` | `npm run build --workspace apps/opspilot-ai-operations-toolkit` | Yes | Build includes TypeScript project check | Not documented | Not documented | Live Netlify demo documented: `https://opspilot-ai-operations-toolkit.netlify.app/` | Deterministic local drafting engine; OpenAI-backed endpoint is roadmap scope. |
| VariantVision Pro | `apps/variantvision-pro` | `5182` | `npm run build --workspace apps/variantvision-pro` | Yes | Build includes TypeScript project check | Yes, Vitest | Yes, Playwright smoke | Live Netlify demo documented: `https://variantvisionpro.netlify.app/` | Static educational research workbench; uses curated demo fixtures, not live clinical database calls. |
| Astra | `apps/astra` | UI `5174`, API `3002` | `npm run build --workspace apps/astra` | Yes | Build includes TypeScript project check | Not documented | Not documented | Local-only in current docs | Live model responses require `apps/astra/.env.local`; UI still runs without a key. |
| Nexus Play | `apps/nexus-play` | UI `5175`, API `3003` | `npm run build --workspace apps/nexus-play` | Yes | Build includes TypeScript project check | Not documented | Not documented | Local-only in current docs | Simulated checkout only; no real payments. |
| FocusForge | `apps/focusforge` | Vite default `5173` unless occupied | `npm run build --workspace apps/focusforge` | Yes | Not documented as a standalone typecheck | Yes, Vitest via `test:run` | Not documented | Live Netlify demo documented: `https://focusforge-productivity-game.netlify.app/` | JavaScript Vite app; persistent progress and analytics are roadmap items in the case study. |

## README Live URL Check - July 4, 2026

The root `README.md` was scanned for every unique HTTP(S) URL. `curl.exe -L -s -o NUL -w "%{http_code} %{url_effective}" <url>` returned HTTP 200 for every URL below.

| Status | URL |
| --- | --- |
| 200 | `https://aminoacidworkbench.netlify.app/` |
| 200 | `https://atomicdjt.github.io/AI-Project-Portfolio/` |
| 200 | `https://atomicdjt.github.io/AI-Project-Portfolio/layerforge-studio/` |
| 200 | `https://buildworld-ai.netlify.app/` |
| 200 | `https://focusforge-productivity-game.netlify.app/` |
| 200 | `https://garden-grid-planner-demo.netlify.app/` |
| 200 | `https://github.com/atomicdjt/AI-Project-Portfolio/actions/workflows/ci.yml` |
| 200 | `https://github.com/atomicdjt/AI-Project-Portfolio/actions/workflows/ci.yml/badge.svg` |
| 200 | `https://hearthlink-p2p-demo.netlify.app/` |
| 200 | `https://img.shields.io/badge/Canvas_2D-Editor-0f766e` |
| 200 | `https://img.shields.io/badge/Consumer_Safety-Scam_Prevention-b45309` |
| 200 | `https://img.shields.io/badge/Express-5-111?logo=express&logoColor=fff` |
| 200 | `https://img.shields.io/badge/Micro--SaaS-Operations-14b8a6` |
| 200 | `https://img.shields.io/badge/Privacy-Local--First-0f766e` |
| 200 | `https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=111` |
| 200 | `https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=fff` |
| 200 | `https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=fff` |
| 200 | `https://opspilot-ai-operations-toolkit.netlify.app/` |
| 200 | `https://payhip.com/b/24De9` |
| 200 | `https://quoteforge-local.vercel.app/` |
| 200 | `https://redactready-local.netlify.app/` |
| 200 | `https://redactready-pro-hri-os.netlify.app/` |
| 200 | `https://scamshield-ai-safety.netlify.app/` |
| 200 | `https://variantvisionpro.netlify.app/` |

## Validation Log

- `npm install` completed successfully on 2026-06-25, but npm reported 3 audit findings: 2 moderate and 1 high. Dependency remediation was not attempted in this polish pass because the request avoided dependency upgrades unless needed for existing scripts.
- `npm run lint:apps`, `npm run typecheck:all`, `npm run test:all`, `npm run build:all`, and `npm run verify` completed successfully on 2026-06-25 after the GitHub profile and repository cleanup pass.
- `npm install`, `npm run lint:apps`, `npm run typecheck:all`, `npm run test:all`, `npm run build:all`, `npm run verify`, stale-reference searches, and Markdown relative-link checks completed successfully on 2026-06-25 after the repository rename-preparation updates.
- Portfolio Hub and LayerForge Studio use relative GitHub Pages asset bases so the current Pages site remains usable before the repository rename and continues to work after the rename.
- `npm run build:all` and `npm run verify` completed successfully, but Vite reported a non-blocking warning about chunks larger than 500 kB after minification. Bundle splitting is a future optimization, not a current validation failure.
- RedactReady Pro standalone validation passed on 2026-06-28 with `npm run lint`, `npm run test`, `npm run build`, and Playwright browser smoke screenshots before portfolio integration.
- VariantVision Pro was converted from concept to runnable MVP on 2026-06-28. `npm run lint --workspace apps/variantvision-pro`, `npm run test --workspace apps/variantvision-pro`, `npm run build --workspace apps/variantvision-pro`, Playwright browser smoke, and portfolio-level `npm run verify` passed.
- VariantVision Pro production deployment passed on 2026-06-28. Netlify deploy `6a40ffc096311b37468815bb` reached `ready`, `curl.exe -I -L https://variantvisionpro.netlify.app/` returned HTTP 200, and live Playwright smoke verified case switching, source filtering, report preview, and mobile analysis content.
- BuildWorld AI standalone validation passed on 2026-06-29 with `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and Playwright browser smoke before portfolio integration.
- BuildWorld AI production deployment passed on 2026-06-29. Netlify deploy `6a41e8c31e62ade78938946f` reached `ready`, `curl.exe -I -L https://buildworld-ai.netlify.app/` returned HTTP 200, built JS/CSS assets returned HTTP 200, SPA fallback returned HTTP 200, and live Playwright smoke verified Studio, cascade test, snapshots, and report preview.
- On 2026-07-04, `curl.exe -L -s -o NUL -w "%{http_code} %{url_effective}"` returned HTTP 200 for the GitHub profile, profile README repo, portfolio repo, Portfolio Hub, LayerForge Studio GitHub Pages subpath, BuildWorld AI, RedactReady Pro, ScamShield AI, RedactReady, OpsPilot, FocusForge, VariantVision Pro, Amino Acid Workbench, GardenGrid, and HearthLink public URLs.
- On 2026-07-04, Netlify CLI authentication was available, but the repository root was not linked to a Netlify project. Confirmed app-level Netlify projects are documented in `docs/deployment-and-previews.md`.
- On 2026-07-04, public audit fixes from PR #15 were merged and published. GitHub Pages returned HTTP 200 for the Portfolio Hub, the previously missing Portfolio Hub image URLs returned HTTP 200, and Playwright reported zero console errors. FocusForge was redeployed to Netlify deploy `6a4892ebd547c851d7c876f9`; `https://focusforge-productivity-game.netlify.app/` returned HTTP 200, had no external Google Fonts references in the deployed HTML, and Playwright reported zero console errors.
- On 2026-07-04, account-level polish was completed for public GitHub and Netlify presentation. GitHub profile metadata, profile README content, public repository topics/homepages, and Netlify project descriptions were updated and rechecked.
- On 2026-07-04, `npm audit --audit-level=moderate --workspaces` and each app/root audit returned zero vulnerabilities after package-lock dependency remediation.
- On 2026-07-04, bundle splitting removed the previous Vite `Some chunks are larger than 500 kB after minification` warning from `npm run build:all` and `npm run verify`. RedactReady still emits the PDF.js worker as a large static asset, but no built JavaScript chunk exceeds the Vite warning threshold.
- On 2026-07-04, `npm run check:docs`, root README app/project inventory checks, and `npm run verify` passed after ranking, commercial-product, and GitHub-profile documentation updates.
- On 2026-07-04, every HTTP(S) URL extracted from the root `README.md` returned HTTP 200; see the README live URL table above.
- On 2026-07-04, production Netlify deploys completed for the app code changed during the audit upgrade: ScamShield AI deploy `6a48aa430a5c26c12184ce8c` and RedactReady deploy `6a48aa432ab2c1da5b4bba1d`. Both production URLs and both unique deploy URLs returned HTTP 200 after deployment.
- On 2026-07-04, live GitHub account verification passed. `gh api /users/atomicdjt` returned bio: "Applied AI workflow and technical-ops builder shipping deployed local-first tools with documented CI, tests, and case studies." The bio does not contain the outdated "Aspiring AI prompt engineer and researcher" framing. `gh repo view atomicdjt/atomicdjt` confirmed the profile README repository exists on `main`, and `gh api repos/atomicdjt/atomicdjt/contents/README.md` returned the current profile README content with the same positioning.
