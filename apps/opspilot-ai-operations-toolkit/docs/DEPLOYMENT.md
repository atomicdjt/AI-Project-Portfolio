# OpsPilot Pro Deployment Guide

This guide documents the deployable state of OpsPilot Pro without overstating maturity. The frontend, seeded reference API, and reviewer-safe health endpoint can run on Netlify today. Durable production workspaces require replacing the in-memory repository with a database adapter against the included SQL schema.

## Netlify Frontend and Function

Use these Netlify settings:

```text
Base directory: apps/opspilot-ai-operations-toolkit
Build command: npm run build
Publish directory: dist
Node version: 22
Functions directory: netlify/functions
```

The app-level `netlify.toml` already defines:

- Vite build command and `dist` publish directory.
- Node 22 build environment.
- Netlify Functions directory and esbuild bundler.
- SPA fallback for the React app.
- Security and cache headers for static assets.

## API Routes

The wildcard Netlify function uses the modern `Request`/`Response` handler shape and is configured at:

```text
/api/:route
```

A separate exact health function is configured at:

```text
/api/health
```

Supported routes:

```text
health
listDocuments
createDocument
updateDocument
createVersion
publishDocument
fixGap
toggleTraining
listAuditEvents
exportWorkspace
```

`/api/health` is safe to open directly in a browser. It returns:

```json
{
  "ok": true,
  "app": "OpsPilot Pro",
  "mode": "seeded-reference-api",
  "deployment": "netlify-functions",
  "persistence": "in-memory-seeded-reference",
  "auth": "demo-session-simulation",
  "productionReady": false,
  "supportedRoutes": ["health", "listDocuments", "createDocument"],
  "timestamp": "2026-07-04T00:00:00.000Z"
}
```

Example POST body for the reference API:

```json
{
  "session": {
    "userId": "seed-admin",
    "organizationId": "org-brightline-demo",
    "name": "Avery Morgan",
    "email": "avery@example.com",
    "role": "admin",
    "authenticated": true
  },
  "documentId": "seed-client-intake"
}
```

The API validates session, intake, and update payloads with Zod. Write actions require `owner`, `admin`, or `editor`. Workspace export requires `owner` or `admin`.

## Database Setup

The production schema lives at:

```text
database/migrations/001_init.sql
```

Apply it to a Postgres-compatible database such as Neon, Supabase, or managed Postgres:

```bash
psql "$OPSPILOT_DATABASE_URL" -f database/migrations/001_init.sql
```

The current repository ships the schema and service contract, but the checked-in API still uses a seeded in-memory repository for public demo safety. A production deploy should add a repository adapter that reads/writes these tables:

- `organizations`
- `workspace_users`
- `documents`
- `document_versions`
- `training_items`
- `knowledge_articles`
- `gap_findings`
- `audit_events`

## Environment Variables

No environment variables are required for the deterministic demo, seeded reference API, or `/api/health`.

Recommended variables when adding the production adapter:

```text
OPSPILOT_DATABASE_URL=postgres connection string
OPSPILOT_AUTH_JWT_SECRET=server-side auth token verification secret
VITE_OPSPILOT_API_URL=/api
```

Keep secrets in Netlify environment settings, not in `netlify.toml`.

## Authentication Setup

The current optional authenticated workspace mode is a demo role/session simulation. For production:

1. Add an identity provider such as Netlify Identity, Supabase Auth, Clerk, Auth0, or WorkOS.
2. Validate the signed token in the Netlify Function.
3. Map the identity to `workspace_users`.
4. Derive `WorkspaceSession` server-side instead of trusting a client-supplied session.
5. Keep the existing role checks in `server/api.ts`.

## Reviewer Smoke Test

After deployment, test:

```text
https://opspilot-ai-operations-toolkit.netlify.app/api/health
```

Then open the app and run the 60-second workflow:

1. Load sample.
2. Generate from intake.
3. Open Admin Dashboard.
4. Switch workspace mode.
5. Review audit events.
6. Export workspace JSON.

## Validation Before Deploy

Run from repository root:

```bash
npm install
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
```

Run from the app directory for proof assets:

```bash
npm run proof
```

Proof assets are written to:

```text
docs/proof/
```

## Deployment Risk Notes

- In-memory function state is not durable and can reset between cold starts.
- Client-side localStorage mode is the supported no-secret public demo path.
- Real auth must derive role and organization on the server.
- Real AI drafting should validate structured model output before saving documents.
