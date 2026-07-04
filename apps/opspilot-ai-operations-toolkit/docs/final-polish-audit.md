# OpsPilot Pro Final Polish Audit

Date: 2026-07-04
Branch target: `codex/opspilot-pro-final-polish`

## Current Strengths

- The app already ships as a polished React/TypeScript workspace with saved documents, SOP drafting, training checklists, knowledge base articles, gap findings, version history, audit events, and export flows.
- The deterministic local demo is preserved through `localStorage`, seeded data, and the shared deterministic engine in `src/opsEngine.ts`.
- A reference backend exists in `server/api.ts` and Netlify Functions. It includes Zod validation, role-aware write/export authorization, seed data, audit logging, workspace export, and a reviewer-safe `/api/health` endpoint.
- The project includes a Postgres-compatible SQL migration, app README, deployment guide, portfolio case study, Playwright workflow test, Vitest API tests, and proof capture script.
- Netlify configuration already includes SPA routing, Node 22, Functions bundling, security headers, and a same-origin CSP compatible with server-side API calls.

## Gaps To Fix

- AI framing is still mostly roadmap-level. The product needs honest visible wording that separates deterministic demo mode, reference API mode, and optional server-side OpenAI generation.
- There is no optional live-AI generation route yet. `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPSPILOT_AI_ENABLED` are not read server-side, health does not report AI readiness, and generation is always client-local.
- Server JSON parsing is not guarded against malformed request bodies, and the wildcard Netlify route dispatch can be tightened now that `/api/health` has its own function.
- Generated text is not normalized against escaped HTML or pasted HTML breaks, so `<br>`, `&lt;br&gt;`, and similar markup can leak into the SOP textarea and exports.
- Deterministic SOP output is useful but still light on formal sections. It should consistently include Purpose, Trigger, Owner, Steps, Quality checks, Escalation path, Review cadence, and Audit/version note.
- Step titles are not guaranteed to be imperative, and generated KB/checklist language can be more specific to the business, role, department, and priority.
- The UI does not yet show generation mode, provider/model, validation/fallback result, timestamp, document id, sanitized config, prompt constraints, or copyable diagnostics.
- The app has no React error boundary or user-facing diagnostic copy affordance for unexpected runtime failures.
- The active tabs render different core content, but they need stronger distinct headings and Playwright coverage that clicks every tab and verifies each view.
- Metadata is minimal. Social preview, crawler metadata, source links, noscript fallback, and scoped license/IP notes need improvement.
- Proof capture currently rewrites the original `opspilot-pro-*` screenshot/GIF/video names. Final polish should add new proof assets while preserving existing artifacts.
- CI has a general portfolio workflow, but there is no OpsPilot-specific verification workflow for reviewers.

## Constraints

- Do not remove the deterministic demo.
- Do not expose OpenAI keys or require secrets for the public demo.
- Do not overclaim production AI, production auth, durable persistence, or multi-tenant database isolation.
- Do not delete existing proof artifacts.
- Do not push or merge to `main`.

## Implementation Direction

- Add a small server-side AI provider layer that calls the OpenAI Responses API only when explicitly enabled and configured, then validates structured output before returning it. Missing keys, disabled mode, request failures, invalid JSON, or schema failures must fall back to the deterministic engine.
- Add health metadata and UI status badges that make the runtime state clear: deterministic fallback, reference API, optional OpenAI provider, model, and validation status.
- Add text normalization helpers used by generation, body edits, Markdown export, and model-output conversion.
- Strengthen deterministic document generation while keeping it predictable and testable.
- Add focused tests for fallback AI generation, health AI metadata, malformed input handling, HTML normalization, SOP sections, imperative titles, tab coverage, and diagnostics.
- Update docs, proof script, metadata, and workflow coverage so the branch is reviewer-ready and deployable.
