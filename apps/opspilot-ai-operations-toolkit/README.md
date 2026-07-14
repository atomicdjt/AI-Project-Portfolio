# ProcessHarbor Pro: AI Operations Toolkit for Small Businesses

ProcessHarbor Pro is a portfolio-grade operations documentation system for small businesses. It turns rough internal notes, policy fragments, support tickets, and FAQs into structured SOPs, onboarding checklists, knowledge-base articles, documentation gap reports, audit events, version snapshots, and exportable workspace bundles.

The default product experience is local and deterministic. The reference service layer adds typed API contracts, Zod validation, role-aware authorization checks, seeded workspace data, audit logging, export endpoints, a health contract, optional server-side OpenAI generation with deterministic fallback, and a Postgres-compatible migration path.

![ProcessHarbor desktop dashboard](docs/screenshots/processharbor-desktop.png)

## Deployment Status

ProcessHarbor is configured for Vercel through `vercel.json`, but a production Vercel alias is not claimed yet.

The deterministic browser workflow is ready for a Vercel preview. The optional backend routes must be exposed as Vercel Functions and verified before server-backed functionality is described as live.

Legacy provider-specific function adapters remain in the source history for reference only. They are not an approved deployment target and must not be used for new publication.

## How to Review It

1. Run the app locally.
2. Click **Load sample** to populate realistic operations notes.
3. Click **Generate from intake** to create an SOP, checklist, knowledge-base content, gaps, versions, and audit activity.
4. Open **Admin Dashboard**.
5. Switch between **Local deterministic demo** and **Authenticated workspace simulation**.
6. Review saved documents, open gaps, demo role, and audit events.
7. Click **Export workspace** and confirm the JSON bundle downloads.
8. Open **Developer diagnostics** to inspect generation mode, validation status, provider metadata, fallback state, and route information.

## Reviewer Proof Assets

- [Dashboard screenshot](docs/proof/processharbor-pro-01-dashboard.png)
- [Admin/export screenshot](docs/proof/processharbor-pro-02-admin.png)
- [Generated document screenshot](docs/proof/processharbor-pro-03-generated.png)
- [Training checklist screenshot](docs/proof/processharbor-pro-04-training.png)
- [Gap fixed screenshot](docs/proof/processharbor-pro-05-gap-fixed.png)
- [Exported workspace screenshot](docs/proof/processharbor-pro-06-exported.png)
- [Mobile screenshot](docs/proof/processharbor-pro-mobile.png)
- [Workflow GIF](docs/proof/processharbor-pro-workflow.gif)
- [Workflow video](docs/proof/processharbor-pro-workflow.webm)
- [Sample workspace export](docs/proof/downloads/processharbor-workspace-export.json)

Additional sanitized examples live under [`docs/examples/`](docs/examples/).

## Implemented Capabilities

- **SOP Generator:** converts rough notes into procedural steps with owners, timing, quality checks, risk score, and editable body text.
- **Training Checklist Builder:** creates onboarding tasks and tracks completion.
- **Knowledge Base Generator:** creates internal or support-facing help articles.
- **Documentation Gap Detector:** identifies missing owners, weak escalation paths, unclear tracking, and missing review cadence.
- **Version Tracker:** records generated, edited, saved, and published document snapshots.
- **Admin and Export Dashboard:** shows saved documents, published documents, open gaps, workspace mode, demo role, audit events, and workspace JSON export.
- **Reference Service Layer:** typed route contracts using the same deterministic engine with server-side validation and role checks.
- **Optional AI Generation:** OpenAI Responses API adapter guarded by server-side configuration, strict structured-output validation, rate limiting, and deterministic fallback.
- **Health Contract:** reports app, deployment, persistence, auth, production-readiness, supported routes, AI configuration, provider/model, fallback mode, and timestamp metadata without exposing secrets.
- **SQL Migration:** Postgres-compatible schema for organizations, users, documents, versions, training items, knowledge articles, gap findings, and audit events.
- **Validation and Proof:** Vitest API coverage, Playwright workflow coverage, screenshots, GIF/video capture, and sample export bundles.

## Honest Scope

ProcessHarbor does **not** claim production AI automation, durable cloud storage, real identity-provider authentication, billing, or multi-tenant database isolation.

The browser UI works as a deterministic local-first demo through `localStorage`. The server layer is a reference implementation with seeded in-memory persistence and an included SQL schema. Optional OpenAI generation remains disabled unless explicitly configured server-side.

Do not describe `/api/health` or other server routes as deployed until a Vercel preview confirms the functions, validation, fallback behavior, and security boundaries.

## License

ProcessHarbor Pro is public for portfolio review only. The app-local `LICENSE` is all rights reserved: no reuse, redistribution, sublicensing, resale, fork-for-resale, or production deployment is granted without prior written permission.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zod
- Vitest
- Playwright
- Vercel SPA configuration
- Reference server contracts and optional provider adapter
- Postgres-compatible SQL migration
- Lucide React icons
- Plain CSS design system

## Run Locally

```bash
cd apps/opspilot-ai-operations-toolkit
npm install
npm run dev
```

Open `http://127.0.0.1:5177/`.

## Reference API Contracts

The service implementation is maintained under `server/` and supports these route contracts:

```text
/api/health
/api/listDocuments
/api/aiGenerate
/api/createDocument
/api/updateDocument
/api/createVersion
/api/publishDocument
/api/fixGap
/api/toggleTraining
/api/listAuditEvents
/api/exportWorkspace
```

Most write routes accept a JSON payload with a `session` object and route-specific fields such as `intake`, `documentId`, `update`, `gapId`, or `trainingItemId`. The seeded admin session exists for portfolio review only.

The health response is designed to be safe for direct review and must never expose `OPENAI_API_KEY`.

When `PROCESSHARBOR_AI_ENABLED=true` and `OPENAI_API_KEY` is set server-side, the optional provider adapter uses a strict JSON schema and validates the result before saving. Provider errors, invalid JSON, rate limiting, missing keys, or disabled mode return deterministic fallback output.

## Vercel Deployment

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

- Root Directory: `apps/opspilot-ai-operations-toolkit`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production Branch: `main`
- Node.js: `22`

The initial preview may expose only the deterministic static workflow. Before enabling server-backed mode:

1. Create Vercel Functions under `api/` that call the existing `server/` contracts.
2. Keep `OPENAI_API_KEY` server-side and never prefix secrets with `VITE_`.
3. Preserve strict Zod validation, role checks, rate limiting, error normalization, and deterministic fallback.
4. Verify `/api/health` and every enabled route on a preview deployment.
5. Confirm the browser UI remains functional when provider configuration is absent.
6. Promote only after Vercel reports `READY` and Playwright smoke tests pass against the preview.

Optional server-side environment variables:

```text
PROCESSHARBOR_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

## Database Migration

Apply the reference schema from:

```text
database/migrations/001_init.sql
```

It creates organizations, workspace users, documents, document versions, training items, knowledge articles, gap findings, and audit events.

## Validation

```bash
npm run lint
npm run typecheck
npm run test:run
npm run e2e
npm run build
npm run proof
```

At repository root, ProcessHarbor is included in:

```bash
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
```

## Key Project Paths

```text
database/migrations/001_init.sql   Postgres-compatible production schema
docs/examples/                     Sanitized sample exports
docs/proof/                        Screenshots, video, and exported proof
e2e/processharbor-pro.spec.ts      Playwright workflow coverage
server/api.ts                      Validated service layer and role checks
server/repository.ts               Seeded in-memory repository
src/App.tsx                        Product UI and local workspace mode
src/opsEngine.ts                   Deterministic drafting and scoring
src/schemas.ts                     Zod validation contracts
vercel.json                        Vercel build and SPA routing configuration
```

## Production Roadmap

- Add Vercel Functions that expose the existing server contracts.
- Replace the in-memory repository with a database adapter using `PROCESSHARBOR_DATABASE_URL`.
- Replace demo session payloads with an identity provider and signed server-side session validation.
- Add tenant-level rate limits, trace storage, and admin model configuration.
- Add approval workflows, comments, review cadences, billing limits, and external exports.
- Add integrations for Google Drive, Slack, Notion, and help desk tools.

Additional documentation:

- [Deployment Guide](docs/DEPLOYMENT.md)
- [OpenAI Integration Notes](docs/OPENAI_INTEGRATION_PLAN.md)
- [License and IP Note](docs/LICENSE-NOTE.md)
- [Naming and Search Positioning](docs/NAMING_AND_POSITIONING.md)
- [Final Polish Audit](docs/final-polish-audit.md)
