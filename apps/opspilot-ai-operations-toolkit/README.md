# ProcessHarbor Pro: AI Operations Toolkit for Small Businesses

ProcessHarbor Pro is a portfolio-grade operations documentation system for small businesses. It turns rough internal notes, policy fragments, support tickets, and FAQs into structured SOPs, onboarding checklists, knowledge base articles, documentation gap reports, audit events, version snapshots, and exportable workspace bundles.

The default product experience remains local, deterministic, and deployable without secrets. The full-stack reference layer adds typed API contracts, server-side Zod validation, role-aware authorization checks, seeded workspace data, audit logging, export endpoints, an API health check, optional server-side OpenAI generation with deterministic fallback, and a SQL migration path for a production database adapter.

![ProcessHarbor desktop dashboard](docs/screenshots/processharbor-desktop.png)

## How to Test This in 60 Seconds

1. Open the live demo or run the app locally.
2. Click **Load sample** to populate realistic operations notes.
3. Click **Generate from intake** to create an SOP, checklist, knowledge-base content, gaps, versions, and audit activity.
4. Open **Admin Dashboard** in the sidebar.
5. Switch between **Local deterministic demo** and **Authenticated workspace simulation**.
6. Review saved documents, open gaps, demo role, and audit events.
7. Click **Export workspace** and confirm the JSON bundle downloads.
8. Open **Developer diagnostics** to inspect generation mode, provider/model, sanitized config, validation status, and route metadata.
9. Visit `/api/health` on the deployed site to verify the reference backend and AI-readiness metadata.

## Reviewer Proof Assets

The proof workflow includes screenshots, GIF/video capture, and a sample export bundle.

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

Final-polish proof assets are generated with `processharbor-final-polish-*` names so earlier proof files remain intact.

Additional sanitized examples live under [`docs/examples/`](docs/examples/).

## What Is Implemented

- **SOP Generator**: converts rough notes into procedural steps with owners, timing, quality checks, risk score, and editable body text.
- **Training Checklist Builder**: creates onboarding tasks and tracks completion.
- **Knowledge Base Generator**: creates internal or support-facing help articles.
- **Documentation Gap Detector**: identifies missing owners, weak escalation paths, unclear tracking, and missing review cadence.
- **Version Tracker**: records generated, edited, saved, and published document snapshots.
- **Admin and Export Dashboard**: shows saved documents, published documents, open gaps, workspace mode, demo role, audit events, and workspace JSON export.
- **Reference Backend API**: Netlify Function endpoints using the same deterministic engine with server-side validation and role checks.
- **Optional AI Generation Route**: `/api/aiGenerate` calls the OpenAI Responses API only when server-side env vars are configured, validates structured output, and falls back to deterministic generation on disabled/missing/error/invalid states.
- **Health Check**: `/api/health` reports app, deployment, persistence, auth, production-readiness, supported routes, AI configuration status, provider/model, fallback mode, and timestamp metadata for portfolio reviewers.
- **SQL Migration**: Postgres-compatible schema for organizations, users, documents, versions, training items, knowledge articles, gap findings, and `audit_events`.
- **Seed Data**: demo organization, demo sessions, seeded documents, generated intake document, and initial audit event.
- **Validation and Proof**: Vitest API coverage plus Playwright workflow test, screenshots, GIF, and video capture script.

## Honest Scope

ProcessHarbor Pro does **not** claim production AI automation, persistent cloud storage, real identity-provider authentication, billing, or multi-tenant database isolation yet.

The live/local UI still works as a deterministic local-first demo through `localStorage`. The backend is a reference implementation with in-memory seed persistence that is ready to be wired to the included SQL schema. Optional OpenAI generation is server-only and disabled unless explicitly configured. This keeps the app safe to deploy publicly without API keys while showing the backend contracts, validation boundaries, authorization checks, fallback behavior, and production path.

## License

ProcessHarbor Pro is public for portfolio review only. The app-local `LICENSE` is all rights reserved: no reuse, redistribution, sublicensing, resale, fork-for-resale, or production deployment is granted without prior written permission.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zod
- Vitest
- Playwright
- Netlify Functions
- Postgres-compatible SQL migration
- Lucide React icons
- Plain CSS design system

## Run Locally

```bash
cd apps/opspilot-ai-operations-toolkit
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5177/
```

## Backend API

The wildcard reference API is implemented at:

```text
netlify/functions/api.ts
```

The reviewer health endpoint is implemented at:

```text
netlify/functions/health.ts
```

Routes are exposed as:

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

Most write routes accept a JSON payload with a `session` object and route-specific fields such as `intake`, `documentId`, `update`, `gapId`, or `trainingItemId`. If no session is passed, the reference function uses the seeded admin session for portfolio review.

`/api/health` is intentionally safe for direct browser review and returns no sensitive data. It reports whether AI is configured/enabled, but never returns `OPENAI_API_KEY`.

`/api/aiGenerate` accepts the same `intake` payload as `createDocument`. It returns:

```json
{
  "data": {
    "document": {},
    "generation": {
      "mode": "fallback",
      "route": "/api/aiGenerate",
      "provider": "deterministic",
      "model": null,
      "aiConfigured": false,
      "aiEnabled": false,
      "fallback": true,
      "validationStatus": "not_required"
    }
  }
}
```

When `PROCESSHARBOR_AI_ENABLED=true` and `OPENAI_API_KEY` is set server-side, the function uses the OpenAI Responses API with a strict JSON schema and validates the result before saving. Provider errors, invalid model JSON, rate limiting, missing keys, or disabled mode all return deterministic fallback output.

## Database Migration

Apply the reference schema from:

```text
database/migrations/001_init.sql
```

The migration creates:

- `organizations`
- `workspace_users`
- `documents`
- `document_versions`
- `training_items`
- `knowledge_articles`
- `gap_findings`
- `audit_events`

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

## Proof Artifacts

The proof script writes review assets to:

```text
docs/proof/
```

Expected outputs:

- `processharbor-pro-01-dashboard.png`
- `processharbor-pro-02-admin.png`
- `processharbor-pro-03-generated.png`
- `processharbor-pro-04-training.png`
- `processharbor-pro-05-gap-fixed.png`
- `processharbor-pro-06-exported.png`
- `processharbor-pro-mobile.png`
- `processharbor-pro-workflow.gif`
- `processharbor-pro-workflow.webm`
- `downloads/processharbor-workspace-export.json`

Final polish proof outputs:

- `processharbor-final-polish-01-dashboard.png`
- `processharbor-final-polish-02-admin-diagnostics.png`
- `processharbor-final-polish-03-generated-sop.png`
- `processharbor-final-polish-04-training.png`
- `processharbor-final-polish-05-knowledge.png`
- `processharbor-final-polish-06-gap-fixed.png`
- `processharbor-final-polish-07-exported.png`
- `processharbor-final-polish-mobile-390x844.png`
- `processharbor-final-polish-mobile-430x932.png`
- `processharbor-final-polish-tablet-768x1024.png`
- `processharbor-final-polish-desktop-1440x1000.png`
- `processharbor-final-polish-workflow.gif`
- `processharbor-final-polish-workflow.webm`
- `downloads/processharbor-final-polish-workspace-export.json`

## Deploy

See [Deployment Guide](docs/DEPLOYMENT.md).

Additional reviewer notes:

- [OpenAI Integration Notes](docs/OPENAI_INTEGRATION_PLAN.md)
- [License and IP Note](docs/LICENSE-NOTE.md)
- [Naming and Search Positioning](docs/NAMING_AND_POSITIONING.md)
- [Final Polish Audit](docs/final-polish-audit.md)

Netlify app settings:

- Base directory: `apps/opspilot-ai-operations-toolkit`
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`
- Functions directory: `netlify/functions`

No environment variables are required for the deterministic demo, seeded reference API, `/api/health`, or deterministic fallback.

Optional server-side AI variables:

```text
PROCESSHARBOR_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`. Do not use `VITE_` for secrets.

## Project Structure

```text
database/
  migrations/001_init.sql        SQL schema for production adapter
docs/
  examples/                      Sanitized sample exports for reviewers
  proof/                         Screenshots, GIF/video, and exported JSON proof
  LICENSE-NOTE.md                Scoped license and IP note
  NAMING_AND_POSITIONING.md      Search and product-positioning note
e2e/
  processharbor-pro.spec.ts      Playwright workflow coverage
netlify/functions/
  api.ts                         Netlify Function reference API
  health.ts                      Reviewer-safe API health endpoint
  ai.ts                          Optional OpenAI Responses API adapter and fallback diagnostics
scripts/
  capture-proof.mjs              Screenshots, GIF, video, export proof
server/
  api.ts                         Validated service layer, health contract, and role checks
  api.test.ts                    API tests
  health.test.ts                 Health contract tests
  errors.ts                      Error helpers
  repository.ts                  Seeded in-memory repository
src/
  App.tsx                        Product UI and local workspace mode
  data.ts                        Seed notes and example documents
  opsEngine.ts                   Deterministic drafting, gaps, scoring, versions
  schemas.ts                     Zod validation contracts
  textNormalization.ts           Plain-text normalization for generated docs and exports
  styles.css                     Product design system
  types.ts                       Shared operations document types
```

## Production Roadmap

- Replace the in-memory repository with a database adapter using `PROCESSHARBOR_DATABASE_URL`.
- Replace demo session payloads with an identity provider and signed server-side session validation.
- Replace the optional OpenAI reference adapter with production usage controls, tenant-level rate limits, trace storage, and admin model configuration.
- Add approval workflows, comments, review cadences, billing limits, and external exports.
- Add integrations for Google Drive, Slack, Notion, and help desk tools.
