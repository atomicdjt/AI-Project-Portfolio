# Vercel Consolidation Runbook

This runbook converts the current Vercel inventory into a smaller, explicitly governed set of canonical deployments without deleting useful evidence or breaking public routes.

**Inventory reviewed:** July 19, 2026.

## Safety Rules

Before deleting, renaming, disconnecting, or changing a production branch:

1. Export or record the project configuration.
2. Record all domains and aliases.
3. Compare environment-variable names and scopes without exposing values.
4. Confirm the Git repository, branch, root directory, framework, and build settings.
5. Search GitHub, Payhip, portfolio documentation, social profiles, and outreach materials for references.
6. Verify the canonical replacement returns HTTP 200 and completes the primary workflow.
7. Preserve a rollback path for at least one review cycle.
8. Perform destructive actions only after explicit account-owner approval.

A `READY` deployment alone is not sufficient evidence that two projects are equivalent.

## Canonical Projects

| Product | Canonical Vercel project | Canonical public URL | Required state |
| --- | --- | --- | --- |
| Portfolio Hub | `ai-project-portfolio-portfolio-hub` | `https://ai-project-portfolio-portfolio-hub.vercel.app/` | Production |
| BuildWorld AI | `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | Set and verify production target |
| WeaveStudio | `weavestudio` | `https://weavestudio-nine.vercel.app/` | Production |
| QuoteForge Local | `quoteforge-local` | `https://quoteforge-local.vercel.app/` | Production |
| ProcessHarbor | `ai-project-portfolio-opspilot-ai-operations-toolkit` | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | Production |

The full project and deployment catalog is maintained in `config/vercel-projects.json`.

## Action 1 — Stop Monorepo Preview Fan-Out Safely

The repository already contains a guarded affected-project deployment controller. Its selector ignores `docs/**` and `.github/**`, and maps application changes to only the affected Vercel projects. Native Vercel Git integration still creates previews independently of that controller.

Do not disable native Git deployment until all of the following are true:

1. `VERCEL_TOKEN` is stored as a GitHub Actions secret.
2. `VERCEL_TEAM_ID` is stored as required by the workflow.
3. `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED` is set only for the controlled validation window.
4. A manual single-project preview succeeds from link through HTTP smoke check.
5. The deployment source commit, target project, and generated URL are recorded.
6. The rollback procedure has been exercised or reviewed.

After that checkpoint, disable automatic Git deployment through Vercel project configuration using `git.deploymentEnabled: false` or the equivalent project setting, then rely on the guarded controller. Do not cut over during an active rate-limit incident.

## Action 2 — Retire the Duplicate QuoteForge `source` Project

**Candidate:** `source`  
**Canonical replacement:** `quoteforge-local`

Before deletion:

- compare repository, branch, root directory, framework, Node version, install/build/output settings, and deployment protection;
- compare environment-variable names and scopes without exposing values;
- confirm no unique domain or alias is still referenced;
- search for the Vercel project name and historical `source` aliases;
- verify QuoteForge routes `/`, `/calculators`, `/calculators/pressure-washing`, `/dashboard`, `/dashboard/embed`, `/dashboard/branding`, `/docs`, `/license`, `/pricing`, and `/buy`;
- confirm Payhip and delivered documentation point only to `https://quoteforge-local.vercel.app/`.

Retirement sequence:

1. Remove or redirect public references.
2. Detach unique aliases only after replacement verification.
3. Delete `source`.
4. Re-run QuoteForge smoke tests and link checks.
5. Remove the deletion-candidate record from `config/vercel-projects.json`.
6. Record the deletion date and evidence.

## Action 3 — Retire or Archive `weavestudio-demo`

**Candidate:** `weavestudio-demo`  
**Canonical replacement:** `weavestudio`

Before retirement:

- confirm whether the preview contains behavior not present on canonical `main`;
- compare source commit and branch;
- run the canonical repository’s full verification command;
- verify landing page, guided demo, import/node editing, undo/redo, save/reopen, export/restore, `/acquire`, and provider-consent behavior;
- search public references to the preview domain and branch aliases.

Delete it when parity is verified and no public dependency remains. Retain it temporarily only when it contains unique review evidence, and label it noncanonical. After retirement, remove its record from `config/vercel-projects.json`.

## Action 4 — Correct BuildWorld’s Production Target

The public BuildWorld deployment is reachable and `READY`, but the reviewed latest deployment was not clearly marked as production.

1. Confirm the Vercel project is connected to `atomicdjt/buildworld-ai`.
2. Confirm the production branch is `main`.
3. Confirm root directory and build settings match the repository.
4. Promote or redeploy the verified `main` commit to production.
5. Verify the canonical alias resolves to that deployment.
6. Confirm GitHub’s Vercel status no longer shows an avoidable failed or non-production state.
7. Record the deployment ID and source commit.

Do not describe BuildWorld as production-verified until the target and source commit are confirmed.

## Action 5 — Reduce Alias Ambiguity

For each flagship:

- select one canonical public URL;
- retain provider-generated preview URLs only for internal review;
- remove stale documentation references;
- use redirects where an old public URL has meaningful external exposure;
- avoid presenting branch-preview or owner aliases as separate products.

A custom domain can improve presentation later, but canonical authority must not depend on purchasing one.

## Action 6 — Standardize Runtime Records

Current projects use Node 22.x and 24.x. This is acceptable when intentional, but each repository should declare its supported version and Vercel should match it.

- declare `engines.node` where appropriate;
- keep local, CI, and Vercel Node versions aligned;
- document exceptions;
- avoid upgrading all projects merely for visual consistency.

## Action 7 — Security-Header Review

Apply headers according to product behavior, not as one blind copy-paste policy. Review Content-Security-Policy, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, frame restrictions, Strict-Transport-Security, CORS, and caching.

QuoteForge requires special handling because calculator routes are intentionally embedded. Do not apply a global anti-framing policy that breaks the iframe workflow.

## Completion Evidence

Consolidation is complete only when:

- canonical URLs remain current in `config/vercel-projects.json`;
- duplicate projects are deleted or explicitly classified;
- public references use canonical URLs;
- source branch and deployment target are confirmed;
- smoke tests pass after each change;
- no secret values were exposed;
- an audit record identifies actions, dates, source commits, and remaining exceptions.
