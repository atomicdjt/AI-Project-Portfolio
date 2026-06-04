# AI Project Portfolio

A curated portfolio of AI-assisted software projects, prompt workflows, and research artifacts. This repository is organized to show complete, runnable applications alongside documentation-heavy AI work.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=fff)
![Express](https://img.shields.io/badge/Express-5-111?logo=express&logoColor=fff)
![Canvas](https://img.shields.io/badge/Canvas_2D-Editor-0f766e)

## Featured Applications

| Project | Type | Highlights | Default Local Port |
| --- | --- | --- | --- |
| [Astra](apps/astra) | AI chat app | React chat workspace, Express streaming API, Gemini configuration, Markdown rendering, transcript export, settings panel | `http://127.0.0.1:5174/` |
| [Nexus Play](apps/nexus-play) | Digital game distribution platform | Polished storefront, catalog API, cart, checkout simulation, wishlist, game library, install queue | `http://127.0.0.1:5175/` |
| [LayerForge Studio](apps/layerforge-studio) | Browser image editor | Layered raster documents, Canvas 2D painting, selections, filters, IndexedDB saves, PNG/JPEG export | `http://127.0.0.1:5176/` |

LayerForge Studio is also configured for GitHub Pages deployment at `https://atomicdjt.github.io/AI-Project-Portfolio-/`.

## Screenshots

| Astra | Nexus Play | LayerForge Studio |
| --- | --- | --- |
| ![Astra AI chat workspace](docs/images/astra-home.png) | ![Nexus Play game storefront](docs/images/nexus-play-home.png) | ![LayerForge Studio image editor](docs/images/layerforge-studio-home.png) |

## Repository Layout

```text
apps/
  astra/                 Local AI chat application
  nexus-play/            Game storefront and distribution platform demo
  layerforge-studio/     Local-first layered raster image editor

dairy_autoimmunity_*.md  AI-assisted systematic review artifacts
entry-level-*.md         Job search guide and process notes
focusforge-*.md          Product concept and prompt workflow notes
```

Each application is self-contained with its own `package.json`, README, source code, and lockfile.

## Quick Start

Install and run a specific app:

```bash
cd apps/astra
npm install
npm run dev
```

Use the same pattern for `apps/nexus-play` and `apps/layerforge-studio`.

## Root Convenience Scripts

From the repository root:

```bash
npm run install:all
npm run build:all
npm run lint:apps
npm run dev:astra
npm run dev:nexus
npm run dev:layerforge
```

## Evaluation

Use these commands from the repository root to validate the portfolio apps before publishing or reviewing:

```bash
npm install
npm run lint:apps
npm run build:all
```

LayerForge's GitHub Pages build uses the same app code with a Pages-only Vite base path:

```bash
GITHUB_PAGES=true npm run build --workspace apps/layerforge-studio
```

## Portfolio Focus

These projects demonstrate:

- End-to-end product development from idea to runnable local app.
- React, TypeScript, Vite, Express, and modern frontend architecture.
- Local API design, validation, streaming responses, and stateful demo workflows.
- Portfolio-quality UX polish, responsive layouts, and documentation.
- AI-assisted research and prompt workflow documentation.

## Notes

- Astra requires a Gemini API key in `apps/astra/.env.local` for live model responses. The UI still runs and clearly reports configuration status without a key.
- Nexus Play uses a local in-memory demo account and simulated checkout. It does not process real payments.
- LayerForge stores projects locally in browser IndexedDB.
