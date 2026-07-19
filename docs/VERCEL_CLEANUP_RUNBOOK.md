# Vercel Consolidation Runbook

This runbook converts the current Vercel inventory into a smaller, explicitly governed set of canonical deployments without deleting useful evidence or breaking public routes.

**Inventory reviewed:** July 19, 2026.

## Safety rules

Before deleting, renaming, disconnecting, or changing a production branch:

1. Export or record the project configuration.
2. Record all domains and aliases.
3. Compare environment-variable names and scopes without exposing values.
4. Confirm the Git repository, branch, root directory, framework, and build settings.
5. Search GitHub, Payhip, portfolio documentation, social profiles, and outreach materials for references to the project or domain.
6. Verify the canonical replacement returns HTTP 200 and completes the primary workflow.
7. Preserve a rollback path for at least one review cycle.
8. Perform destructive actions only after explicit account-owner approval.

A `READY` deployment alone is not sufficient evidence that two projects are equivalent.

## Canonical projects

| Product | Canonical Vercel project | Canonical public URL | Required state |
| --- | --- | --- | --- |
| Portfolio Hub | `ai-project-portfolio-portfolio-hub` | `https://ai-project-portfolio-portfolio-hub.vercel.app/` | Production |
| BuildWorld AI | `buildworld-ai-v01-improvements` | `https://buildworld-ai-v01-improvements.vercel.app/` | Set and verify production target |
| WeaveStudio | `weavestudio` | `https://weavestudio-nine.vercel.app/` | Production |
| QuoteForge Local | `quoteforge-local` | `https://quoteforge-local.vercel.app/` | Production |
| ProcessHarbor | `ai-project-portfolio-opspilot-ai-operations-toolkit` | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | Production |

The full canonical inventory is maintained in `config/portfolio-authority.json`.

## Action 1 — Retire the duplicate QuoteForge `source` project

**Candidate:** `source`

**Canonical replacement:** `quoteforge-local`

### Pre-deletion checks

- Compare repository, production branch, root directory, framework, Node version, install/build/output settings, and deployment-protection settings.
- Compare environment-variable **names and scopes**. Do not copy or expose secret values in issue comments or documentation.
- Confirm no unique domains remain attached to `source` that are referenced publicly.
- Search for:
  - `source-nu-sand.vercel.app`
  - `source-atomicdjts-projects.vercel.app`
  - `source-git-main-atomicdjts-projects.vercel.app`
  - the Vercel project name `source`
- Confirm QuoteForge’s canonical routes work:
  - `/`
  - `/calculators`
  - `/calculators/pressure-washing`
  - `/dashboard`
  - `/dashboard/embed`
  - `/dashboard/branding`
  - `/docs`
  - `/license`
  - `/pricing`
  - `/buy`
- Confirm the Payhip listing and delivered documentation point only to `https://quoteforge-local.vercel.app/`.

### Retirement

1. Remove or redirect any public references.
2. Detach unique aliases only after replacement verification.
3. Delete the `source` Vercel project.
4. Re-run QuoteForge smoke tests and link checks.
5. Update `config/portfolio-authority.json` to remove the deletion candidate.
6. Record the deletion date and verification evidence in an audit note.

## Action 2 — Retire or archive `weavestudio-demo`

**Candidate:** `weavestudio-demo`

**Canonical replacement:** `weavestudio`

### Pre-retirement checks

- Confirm whether the preview contains any behavior not present on canonical `main`.
- Compare deployment source commit and branch.
- Run the canonical repository’s full verification command:

```bash
npm run verify
```

- Verify:
  - landing page;
  - guided demo;
  - import and node editing;
  - undo/redo;
  - save/reopen;
  - export and restore;
  - `/acquire`;
  - optional provider consent behavior without persisting API keys.
- Search public references to `weavestudio-demo.vercel.app` and historical branch-preview aliases.

### Retirement choice

- **Delete** when canonical parity is verified and no public dependency remains.
- **Retain temporarily** only when it contains unique review evidence, and label it clearly as a noncanonical preview.

After retirement, remove it from `nonCanonicalDeployments` in `config/portfolio-authority.json`.

## Action 3 — Correct BuildWorld’s production target

The public BuildWorld deployment is reachable and `READY`, but the reviewed latest deployment was not clearly marked as a production target.

### Required checks

1. Confirm the Vercel project is connected to `atomicdjt/buildworld-ai`.
2. Confirm the production branch is `main`.
3. Confirm the root directory and build settings match the repository.
4. Promote or redeploy the current verified `main` commit to production.
5. Verify the canonical alias resolves to that deployment.
6. Confirm GitHub’s Vercel status no longer shows an avoidable failed or non-production state.
7. Record the production deployment ID and source commit in the deployment audit.

Do not describe BuildWorld as production-verified until the target and source commit are confirmed.

## Action 4 — Reduce alias ambiguity

For each flagship:

- select one canonical public URL;
- retain provider-generated preview URLs only for internal review;
- remove stale documentation references;
- use redirects where an old public URL has meaningful external exposure;
- avoid presenting branch-preview or project-owner aliases as separate products.

A custom domain can improve presentation later, but canonical authority must not depend on purchasing one.

## Action 5 — Standardize runtime and framework records

Current projects use Node 22.x and 24.x. This is acceptable when intentional, but each repository should declare its supported version and Vercel should match it.

For every maintained flagship:

- declare `engines.node` where appropriate;
- keep local, CI, and Vercel Node versions aligned;
- document exceptions;
- avoid upgrading all projects merely for visual consistency.

## Action 6 — Security-header review

Apply headers according to product behavior, not as one blind copy-paste policy.

Review:

- Content-Security-Policy;
- Referrer-Policy;
- Permissions-Policy;
- X-Content-Type-Options;
- frame restrictions;
- Strict-Transport-Security;
- CORS behavior;
- caching of sensitive or user-specific routes.

QuoteForge requires special handling because calculator routes are intentionally embedded on client sites. Do not apply a global `frame-ancestors 'none'` or `X-Frame-Options: DENY` policy that breaks the product’s iframe workflow.

## Completion evidence

The consolidation is complete only when:

- canonical URLs are recorded in `config/portfolio-authority.json`;
- duplicate projects have been deleted or explicitly classified;
- public references use canonical URLs;
- source branch and deployment target are confirmed;
- smoke tests pass after each change;
- no secret values were exposed;
- an audit record identifies the actions, dates, source commits, and remaining exceptions.