# OpsPilot Pro: AI Operations Toolkit for Small Businesses

OpsPilot Pro is a portfolio-grade operations documentation system for small businesses. It turns rough internal notes, policy fragments, support tickets, and FAQs into structured SOPs, onboarding checklists, knowledge base articles, documentation gap reports, audit events, version snapshots, and exportable workspace bundles.

The default product experience remains local, deterministic, and deployable without secrets. The full-stack reference layer adds typed API contracts, server-side Zod validation, role-aware authorization checks, seeded workspace data, audit logging, export endpoints, an API health check, and a SQL migration path for a production database adapter.

![OpsPilot desktop dashboard](docs/screenshots/opspilot-desktop.png)

## How to Test This in 60 Seconds

1. Open the live demo or run the app locally.
2. Click **Load sample** to populate realistic operations notes.
3. Click **Generate from intake** to create an SOP, checklist, knowledge-base content, gaps, versions, and audit activity.
4. Open **Admin Dashboard** in the sidebar.
5. Switch between **Local deterministic demo** and **Authenticated workspace simulation**.
6. Review saved documents, open gaps, demo role, and audit events.
7. Click **Export workspace** and confirm the JSON bundle downloads.
8. Visit `/api/health` on the deployed site to verify the reference backend is reachable.

## Reviewer Proof Assets

The proof workflow includes screenshots, GIF/video capture, and a sample export bundle.

- [Dashboard screenshot](docs/proof/opspilot-pro-01-dashboard.png)
- [Admin/export screenshot](docs/proof/opspilot-pro-02-admin.png)
- [Generated document screenshot](docs/proof/opspilot-pro-03-generated.png)
- [Training checklist screenshot](docs/proof/opspilot-pro-04-training.png)
- [Gap fixed screenshot](docs/proof/opspilot-pro-05-gap-fixed.png)
- [Exported workspace screenshot](docs/proof/opspilot-pro-06-exported.png)
- [Mobile screenshot](docs/proof/opspilot-pro-mobile.png)
- [Workflow GIF](docs/proof/opspilot-pro-workflow.gif)
- [Workflow video](docs/proof/opspilot-pro-workflow.webm)
- [Sample workspace export](docs/proof/downloads/opspilot-workspace-export.json)

Additional sanitized examples live under [`docs/examples/`](docs/examples/).

## What Is Implemented

- **SOP Generator**: converts rough notes into procedural steps with owners, timing, quality checks, risk score, and editable body text.
- **Training Checklist Builder**: creates onboarding tasks and tracks completion.
- **Knowledge Base Generator**: creates internal or support-facing help articles.
- **Documentation Gap Detector**: identifies missing owners, weak escalation paths, unclear tracking, and missing review cadence.
- **Version Tracker**: records generated, edited, saved, and published document snapshots.
- **Admin and Export Dashboard**: shows saved documents, published documents, open gaps, workspace mode, demo role, audit events, and workspace JSON export.
- **Reference Backend API**: Netlify Function endpoints using the same deterministic engine with server-side validation and role checks.
- **Health Check**: `/api/health` reports app, deployment, persistence, auth, production-readiness, supported routes, and timestamp metadata for portfolio reviewers.
- **SQL Migration**: Postgres-compatible schema for organizations, users, documents, versions, training items, knowledge articles, gap findings, and `audit_events`.
- **Seed Data**: demo organization, demo sessions, seeded documents, generated intake document, and initial audit event.
- **Validation and Proof**: Vitest API coverage plus Playwright workflow test, screenshots, GIF, and video capture script.

## Honest Scope

OpsPilot Pro does **not** claim production AI automation, persistent cloud storage, real identity-provider authentication, billing, or multi-tenant database isolation yet.

The live/local UI still works as a deterministic local-first demo through `localStorage`. The backend is a reference implementation with in-memory seed persistence that is ready to be wired to the included SQL schema. This keeps the app safe to deploy publicly without API keys while showing the backend contracts, validation boundaries, authorization checks, and production path.

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

`/api/health` is intentionally safe for direct browser review and returns no sensitive data.

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

At repository root, OpsPilot is included in:

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

- `opspilot-pro-01-dashboard.png`
- `opspilot-pro-02-admin.png`
- `opspilot-pro-03-generated.png`
- `opspilot-pro-04-training.png`
- `opspilot-pro-05-gap-fixed.png`
- `opspilot-pro-06-exported.png`
- `opspilot-pro-mobile.png`
- `opspilot-pro-workflow.gif`
- `opspilot-pro-workflow.webm`
- `downloads/opspilot-workspace-export.json`

## Deploy

See [Deployment Guide](docs/DEPLOYMENT.md).

Netlify app settings:

- Base directory: `apps/opspilot-ai-operations-toolkit`
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`
- Functions directory: `netlify/functions`

No environment variables are required for the deterministic demo, seeded reference API, or `/api/health`.

## Project Structure

```text
database/
  migrations/001_init.sql        SQL schema for production adapter
docs/
  examples/                      Sanitized sample exports for reviewers
  proof/                         Screenshots, GIF/video, and exported JSON proof
e2e/
  opspilot-pro.spec.ts           Playwright workflow coverage
netlify/functions/
  api.ts                         Netlify Function reference API
  health.ts                      Reviewer-safe API health endpoint
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
  styles.css                     Product design system
  types.ts                       Shared operations document types
```

## Production Roadmap

- Replace the in-memory repository with a database adapter using `OPSPILOT_DATABASE_URL`.
- Replace demo session payloads with an identity provider and signed server-side session validation.
- Add OpenAI-backed drafting behind strict JSON schemas and fallback handling.
- Add approval workflows, comments, review cadences, billing limits, and external exports.
- Add integrations for Google Drive, Slack, Notion, and help desk tools.
