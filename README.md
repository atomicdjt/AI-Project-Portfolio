# AI Project Portfolio

A curated portfolio of AI-assisted software projects, product prototypes, workflow systems, and research artifacts. This repository is organized to show complete runnable applications alongside employer-facing documentation, case studies, and structured concept work.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=fff)
![Express](https://img.shields.io/badge/Express-5-111?logo=express&logoColor=fff)
![Canvas](https://img.shields.io/badge/Canvas_2D-Editor-0f766e)
![Micro SaaS](https://img.shields.io/badge/Micro--SaaS-Operations-14b8a6)
![Privacy](https://img.shields.io/badge/Privacy-Local--First-0f766e)

## Portfolio Snapshot

This portfolio is strongest when read as evidence of:

- AI-assisted product prototyping and workflow design.
- Frontend application development with React, TypeScript, Vite, Express, Canvas 2D, and local persistence.
- Privacy-first product design, local-only processing, and responsible safety limitations.
- Technical operations thinking across support triage, documentation systems, knowledge management, and process improvement.
- Research synthesis and structured analysis across bioinformatics, cognitive frameworks, and educational tools.
- Employer-facing documentation, scope control, and responsible-use framing.

## Featured Applications

| Project | Type | Highlights | Public Demo | Default Local Port |
| --- | --- | --- | --- | --- |
| [RedactReady](apps/redactready-local) | Runnable privacy/security MVP | Local-first PDF/image/TXT/CSV redaction, detector review queue, manual boxes, flattened exports, verification report | [Live Netlify demo](https://redactready-local.netlify.app/) | `http://127.0.0.1:5173/` |
| [OpsPilot](apps/opspilot-ai-operations-toolkit) | Runnable AI operations toolkit | SOP generation, training checklists, knowledge base output, gap detection, version tracking, Netlify-ready static deployment | Not published in this repo | `http://127.0.0.1:5177/` |
| [Astra](apps/astra) | Runnable AI chat app | React chat workspace, Express streaming API, Gemini configuration, Markdown rendering, transcript export, settings panel | Local demo | `http://127.0.0.1:5174/` |
| [Nexus Play](apps/nexus-play) | Runnable digital game platform demo | Polished storefront, catalog API, cart, checkout simulation, wishlist, game library, install queue | Local demo | `http://127.0.0.1:5175/` |
| [LayerForge Studio](apps/layerforge-studio) | Runnable browser image editor | Layered raster documents, Canvas 2D painting, selections, filters, IndexedDB saves, PNG/JPEG export | [GitHub Pages demo](https://atomicdjt.github.io/AI-Project-Portfolio-/) | `http://127.0.0.1:5176/` |

LayerForge Studio is also configured for GitHub Pages deployment at `https://atomicdjt.github.io/AI-Project-Portfolio-/`.

## Employer-Facing Project Guides

This repository also includes employer-facing case studies for the strongest projects in the portfolio:

- [Employer Overview](EMPLOYER_OVERVIEW.md)
- [Project Index](PROJECT_INDEX.md)
- [Skills Matrix](SKILLS_MATRIX.md)
- [Hiring Summary](docs/hiring-summary.md)
- [Project Ranking](docs/project-ranking.md)
- [Portfolio Positioning](docs/portfolio-positioning.md)

### Strongest Case Studies

| Project | Status | Why Review It |
| --- | --- | --- |
| [RedactReady](projects/redactready-local/CASE_STUDY.md) | Runnable MVP + live demo | Strongest privacy/security product; shows local-first architecture, document processing, true redaction, safety-focused UX, and public deployment readiness. |
| [LayerForge Studio](projects/layerforge-studio/CASE_STUDY.md) | Runnable MVP | Strongest runnable app and best evidence of product polish. |
| [OpsPilot](projects/opspilot-ai-operations-toolkit/CASE_STUDY.md) | Runnable MVP | Strongest business-focused micro-SaaS; directly maps to operations, documentation, onboarding, and knowledge-management roles. |
| [AI Knowledge Operations Toolkit](projects/ai-knowledge-operations-toolkit/CASE_STUDY.md) | Concept / product specification | Best direct match for operations, documentation, support, and knowledge-management roles. |
| [VariantVision Pro](projects/variantvision-pro/CASE_STUDY.md) | Research-tool concept | Most advanced research-tool concept with responsible scientific scope. |
| [Amino Acid Research Workbench](projects/amino-acid-research-workbench/CASE_STUDY.md) | Educational tool concept | Strong educational bioinformatics tool with explainable analysis workflows. |
| [Ecology of Consciousness](projects/ecology-of-consciousness/CASE_STUDY.md) | Research framework | Strongest original research/framework project. |

## Project Status

| Project | Current Form | Code in Repo? | Demo Type | Case Study? |
| --- | --- | --- | --- | --- |
| RedactReady | Runnable MVP | Yes | [Live Netlify demo](https://redactready-local.netlify.app/) / local | Yes |
| OpsPilot | Runnable MVP | Yes | Local / Netlify-ready | Yes |
| LayerForge Studio | Runnable MVP | Yes | GitHub Pages / local | Yes |
| Astra | Runnable MVP | Yes | Local | Yes |
| Nexus Play | Runnable MVP | Yes | Local | Yes |
| AI Knowledge Operations Toolkit | Product concept / workflow system | Documentation-first | Planned / spec | Yes |
| VariantVision Pro | Research-tool concept | Documentation-first | Planned / spec | Yes |
| Amino Acid Research Workbench | Educational bioinformatics concept | Documentation-first | Planned / spec | Yes |
| Ecology of Consciousness | Research framework | Documentation-first | Framework docs | Yes |
| IHOS | Structured self-governance framework | Documentation-first | Framework docs | Yes |
| FrameEcho | Technical product concept | Documentation-first | Planned / spec | Yes |
| FocusForge | Product concept | Documentation-first | Planned / spec | Yes |

## Screenshots

| RedactReady | OpsPilot | Astra | LayerForge Studio |
| --- | --- | --- | --- |
| ![RedactReady review workspace](docs/images/redactready-review-workspace.png) | ![OpsPilot operations dashboard](docs/images/opspilot-home.png) | ![Astra AI chat workspace](docs/images/astra-home.png) | ![LayerForge Studio image editor](docs/images/layerforge-studio-home.png) |

## LayerForge Studio Demo

![LayerForge Studio demo](docs/images/layerforge-demo.gif)

## Repository Layout

```text
apps/
  redactready-local/       Runnable local-first privacy redaction engine
  opspilot-ai-operations-toolkit/  Runnable AI operations documentation toolkit
  astra/                 Runnable local AI chat application
  nexus-play/            Runnable game storefront and platform demo
  layerforge-studio/     Runnable local-first layered raster image editor

projects/
  redactready-local/                         Privacy/security redaction case study
  opspilot-ai-operations-toolkit/             Employer-facing case study
  layerforge-studio/                         Employer-facing case study
  ai-knowledge-operations-toolkit/           Operations AI workflow case study
  variantvision-pro/                         Bioinformatics research-tool case study
  amino-acid-research-workbench/             Educational bioinformatics case study
  ecology-of-consciousness/                  Research framework case study
  ihos-integrated-human-operating-system/    Structured self-governance case study
  astra/                                     AI chat workspace case study
  nexus-play/                                Game platform case study
  frameecho/                                 Duplicate video finder concept
  focusforge/                                Focus/productivity concept

docs/
  hiring-summary.md
  project-ranking.md
  portfolio-positioning.md

EMPLOYER_OVERVIEW.md
PROJECT_INDEX.md
SKILLS_MATRIX.md
```

Each runnable application is self-contained with its own `package.json`, README, source code, and lockfile.

## Quick Start

Install and run a specific app:

```bash
cd apps/astra
npm install
npm run dev
```

Use the same pattern for `apps/redactready-local`, `apps/nexus-play`, `apps/layerforge-studio`, and `apps/opspilot-ai-operations-toolkit`.

## Root Convenience Scripts

From the repository root:

```bash
npm run install:all
npm run build:all
npm run lint:apps
npm run dev:astra
npm run dev:nexus
npm run dev:layerforge
npm run dev:opspilot
npm run dev:redactready
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
- Business-focused AI operations tooling for SOPs, onboarding, documentation, and knowledge management.
- Portfolio-quality UX polish, responsive layouts, and documentation.
- Privacy-first document processing, threat modeling, and verification-minded UX.
- AI-assisted research and prompt workflow documentation.
- Technical operations thinking, knowledge management, and structured workflow design.

## Notes

- Astra requires a Gemini API key in `apps/astra/.env.local` for live model responses. The UI still runs and clearly reports configuration status without a key.
- RedactReady is live at `https://redactready-local.netlify.app/`, is local-first, and does not require an API key or backend upload service for core redaction.
- Nexus Play uses a local in-memory demo account and simulated checkout. It does not process real payments.
- LayerForge stores projects locally in browser IndexedDB.
- Documentation-first projects are intentionally labeled as concepts, frameworks, or specifications when they are not implemented as runnable apps in this repository.
