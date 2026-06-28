# Technical Depth

## React / TypeScript / Vite App Structure

The runnable apps are organized as independent workspaces under `apps/`, each with its own package scripts, Vite configuration, source tree, and README. Most apps use React and Vite, while the TypeScript apps perform project checking during production builds with `tsc -b`.

ScamShield AI and RedactReady include dedicated test infrastructure. FocusForge is a JavaScript Vite app with Vitest coverage for its focus/game logic.

## Local-First Privacy Design

The strongest privacy examples are ScamShield AI and RedactReady. They are designed around browser-local workflows, no account requirement, no backend upload path for core use, and clear warnings around sensitive input. ScamShield documents a deployed Content Security Policy with `connect-src 'none'`; RedactReady emphasizes flattened export and human review rather than cosmetic hiding.

## State Management and Local Persistence

The repo demonstrates local persistence through browser storage patterns:

- ScamShield AI uses Zustand and versioned localStorage case state.
- LayerForge Studio uses local project persistence for editor documents.
- OpsPilot stores draft/version state locally for reviewable operations documents.
- FocusForge uses local storage for focus/productivity progression.

## Express-Backed Local API Patterns

Astra and Nexus Play include local Express server layers behind React frontends. They show the pattern of a Vite UI talking to local `/api` endpoints through development proxies. Astra is the clearest AI-app example, with model configuration and streaming-oriented chat workflow. Nexus Play uses a local API shape for a game-storefront/platform demo.

## Canvas and Browser Graphics

LayerForge Studio is the deepest browser graphics project, with Canvas rendering, document models, editor tools, filters, history commands, import/export, and local persistence. RedactReady also uses Canvas for document/image review and redaction workflows.

## PDF and Report Generation

ScamShield AI generates a structured PDF evidence packet in the browser. RedactReady includes redaction reports and flattened document export paths using PDF.js and `pdf-lib`. These examples show practical browser document handling with privacy limitations documented.

## Testing and Validation Practices

Current validation evidence includes:

- Root-level lint and build scripts across runnable apps.
- Standalone ScamShield AI typechecking.
- Vitest coverage for ScamShield AI, RedactReady, and FocusForge.
- Playwright E2E support documented for ScamShield AI and RedactReady.
- GitHub Actions CI on `main`, `codex/**`, and pull requests into `main`.

The root [verification guide](verification.md) lists commands and marks unsupported or uncertain coverage clearly.

## Deployment Patterns

Deployment patterns include static Vite apps on Netlify and GitHub Pages:

- ScamShield AI: documented Netlify live deployment.
- RedactReady: documented Netlify live deployment.
- OpsPilot: documented Netlify live deployment.
- Portfolio Hub: documented GitHub Pages root deployment with a Pages-specific Vite base.
- LayerForge Studio: documented GitHub Pages subpath deployment with a Pages-specific Vite base.
- FocusForge: static-host deployment guidance is documented, but no live URL is currently documented.

## Known Technical Limitations and Future Improvements

- Several apps rely on build-time TypeScript checks rather than standalone `typecheck` scripts.
- Some runnable apps do not yet have unit or E2E test suites.
- Astra and Nexus Play are local demos, not documented production backend deployments.
- RedactReady does not include OCR, face/signature detection, or layout-preserving DOCX/XLSX redaction.
- OpsPilot currently uses a deterministic local drafting engine; an OpenAI-backed server endpoint is roadmap scope.
- LayerForge Studio would benefit from broader tests around editor actions, persistence, and import/export edge cases.
