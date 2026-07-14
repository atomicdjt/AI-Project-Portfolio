# ProcessHarbor Pro Vercel Deployment Guide

This guide documents the Vercel deployment path without overstating product maturity.

The deterministic frontend can be deployed as a static Vite application. The service contracts, health response, optional OpenAI adapter, validation, authorization checks, and seeded repository are implemented in source, but the server routes must be exposed as Vercel Functions and verified before they are described as deployed.

## Current Status

- Vercel SPA configuration is present in `vercel.json`.
- Static deterministic mode requires no secrets.
- A production Vercel alias is not currently claimed.
- Optional server routes remain a migration task.
- Legacy hosting adapters are retained only as reference code and are not an approved deployment target.

## Vercel Project Settings

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

```text
Project name: processharbor
Root Directory: apps/opspilot-ai-operations-toolkit
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Branch: main
Node.js: 22
```

Enable preview deployments for pull requests. Deploy the branch as a preview before assigning any production alias.

## Static Preview Scope

The first Vercel preview may expose only the deterministic browser workflow:

- sample intake,
- SOP generation,
- training checklist generation,
- knowledge-base generation,
- gap detection,
- version history,
- local audit activity,
- workspace export,
- developer diagnostics for local/fallback mode.

This mode is useful portfolio evidence and does not require `OPENAI_API_KEY`, a database, or authentication provider.

## Vercel Functions Migration

The service contracts live under `server/` and support:

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

Before enabling server-backed mode:

1. Add Vercel Functions under the app-level `api/` directory.
2. Route each function to the existing `ProcessHarborApi` service methods.
3. Parse and validate all request bodies with the existing Zod schemas.
4. Preserve owner/admin/editor authorization rules.
5. Derive rate-limit keys from trusted request metadata and authenticated identity where available.
6. Normalize errors through the existing error helpers.
7. Return deterministic fallback when AI is disabled, missing, rate-limited, invalid, or unavailable.
8. Verify every enabled endpoint on a Vercel preview deployment.

Do not expose provider keys in browser variables or responses.

## Health Response

`/api/health` should remain safe for direct browser review and should report:

- application name,
- deployment mode,
- persistence mode,
- authentication mode,
- production-readiness state,
- supported routes,
- sanitized AI configuration,
- provider/model metadata,
- deterministic fallback state,
- timestamp.

It must never return `OPENAI_API_KEY`, database credentials, auth secrets, or raw internal errors.

## Optional OpenAI Setup

The public deterministic preview does not require OpenAI.

To enable optional server-side AI after Vercel Functions are implemented, configure these Vercel environment variables:

```text
PROCESSHARBOR_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional. Do not use a `VITE_` prefix for secrets.

Fallback behavior must remain intentional:

- AI disabled: deterministic generation.
- Missing provider key: deterministic generation.
- Provider request failure: deterministic generation.
- Invalid or non-JSON output: deterministic generation.
- Rate limit reached: deterministic generation.

The returned generation metadata should report provider, model, route, validation status, fallback state, sanitized configuration, timestamp, and document identifier.

## Database Setup

The production schema lives at:

```text
database/migrations/001_init.sql
```

Apply it to a Postgres-compatible database:

```bash
psql "$PROCESSHARBOR_DATABASE_URL" -f database/migrations/001_init.sql
```

The schema includes organizations, workspace users, documents, document versions, training items, knowledge articles, gap findings, and audit events.

The current service layer uses a seeded in-memory repository. Production use requires a database adapter with organization-level isolation and durable audit history.

Recommended future environment variables:

```text
PROCESSHARBOR_DATABASE_URL=server-side Postgres connection string
PROCESSHARBOR_AUTH_JWT_SECRET=server-side token verification secret
PROCESSHARBOR_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

Keep all secrets in Vercel environment settings.

## Authentication Setup

The current authenticated workspace mode is a demo role/session simulation. For production:

1. Add an identity provider compatible with the chosen Vercel architecture.
2. Validate signed identity server-side.
3. Map the identity to `workspace_users`.
4. Derive `WorkspaceSession` on the server rather than trusting client-supplied roles.
5. Preserve the existing role checks in `server/api.ts`.
6. Test cross-organization access denial before production promotion.

## Preview Smoke Test

After a Vercel preview is ready:

1. Open the preview root.
2. Load sample intake.
3. Generate the workspace documents.
4. Review the Admin Dashboard.
5. Inspect developer diagnostics.
6. Review audit events.
7. Export workspace JSON.
8. Refresh the direct route and confirm SPA recovery.
9. Check static assets and browser console.
10. If functions are enabled, open `/api/health` and exercise every enabled route.

## Validation Before Promotion

From repository root:

```bash
npm ci
npm run check:docs
npm run lint:apps
npm run typecheck:all
npm run test:all
npm run build:all
npm run verify
```

From the app directory:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run e2e
npm run build
npm run proof
```

Promote only when repository checks pass and Vercel reports the deployment as `READY`.

## Deployment Risk Notes

- In-memory function state is not durable and may reset between invocations.
- Client-side `localStorage` remains the supported no-secret demo path.
- Real authentication must derive role and organization on the server.
- Optional AI output requires validation and deterministic fallback.
- Production use needs tenant-level limits, durable audit retention, and a database adapter.
- A successful static deployment does not prove the optional API routes are live.

Record the source commit, preview URL, production deployment ID, and production alias after verification.