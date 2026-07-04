# OpsPilot Pro Deployment Guide

This guide documents the deployable state of OpsPilot Pro without overstating maturity. The frontend, seeded reference API, optional server-side AI route, and reviewer-safe health endpoint can run on Netlify today. Durable production workspaces require replacing the in-memory repository with a database adapter against the included SQL schema.

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

A separate exact health function is configured at:

```text
/api/health
```

Supported routes:

```text
health
listDocuments
aiGenerate
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
  "ai": {
    "aiConfigured": false,
    "aiEnabled": false,
    "aiProvider": "none",
    "model": null,
    "fallback": "deterministic"
  },
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

## Optional OpenAI Setup

The public demo does not require OpenAI. To enable server-side AI generation on Netlify, add these environment variables in Netlify site settings:

```text
OPSPILOT_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional. The function defaults to `gpt-4o-mini` when not set. The browser never receives `OPENAI_API_KEY`; it only calls the same-origin `/api/aiGenerate` function.

Fallback behavior is intentional:

- `OPSPILOT_AI_ENABLED` missing or false: deterministic generation.
- `OPENAI_API_KEY` missing: deterministic generation.
- OpenAI request failure: deterministic generation.
- Invalid or non-JSON model output: deterministic generation.
- Basic demo rate limit reached: deterministic generation.

The returned `generation` object reports provider, model, route, validation status, fallback reason, sanitized config, timestamp, and document id for developer review.

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

No environment variables are required for the deterministic demo, seeded reference API, `/api/health`, or deterministic fallback.

Recommended variables when adding the production adapter:

```text
OPSPILOT_DATABASE_URL=postgres connection string
OPSPILOT_AUTH_JWT_SECRET=server-side auth token verification secret
VITE_OPSPILOT_API_URL=/api
```

Optional AI variables:

```text
OPSPILOT_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

Keep secrets in Netlify environment settings, not in `netlify.toml`, committed docs, or `VITE_` variables.

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
4. Review Developer diagnostics for route, provider/model, validation, and fallback state.
5. Switch workspace mode.
6. Review audit events.
7. Export workspace JSON.

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
- The optional AI route validates structured model output before saving documents, but production use still needs tenant-level usage limits, audit retention, and a durable database adapter.
