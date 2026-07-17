# Deployment Orchestration Checkpoint

**Branch:** `chore/deployment-orchestration-2026-07-17`  
**Pull request:** `#32`  
**Checkpoint state:** dry-run architecture prepared; production cutover not authorized

## What is implemented on the branch

- A declarative Vercel project manifest at `config/vercel-projects.json`.
- A deterministic affected-project selector at `scripts/detect-affected-apps.mjs`.
- Node test coverage for documentation-only, application-only, root dependency, manual legacy, deduplication, and malformed-manifest cases.
- A `Vercel Affected Deployment Plan` GitHub Actions workflow.
- A guarded deployment matrix that verifies, links, builds, deploys, and smoke-checks only selected applications when explicitly activated.
- Deployment-plan artifacts and GitHub job summaries for auditability.
- A baseline and rollback record.

## Current safety controls

The new deployment job requires both conditions below:

1. at least one affected project is selected;
2. repository variable `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED` equals `true`.

The activation variable has not been set by this branch. Therefore the workflow is currently a dry-run planner and cannot create a Vercel deployment.

No application `vercel.json` has been changed to disable Vercel Git deployment. Existing Git integrations, production aliases, and rollback history remain intact.

## Selection behavior

### No automatic application deployment

- root README changes;
- documentation changes;
- GitHub workflow changes by themselves;
- historical audit changes;
- changes outside declared deployable project roots.

### Selected application deployment

A change under an active project root selects only that project.

### Global application deployment

Changes to the root package manifest, root lockfile, or deployment manifest select every project whose deployment mode is `affected` because those files can alter clean installation or deployment configuration.

### Manual-only applications

Changes under these preserved artifacts are reported but not automatically deployed:

- Amino Acid Workbench legacy artifact;
- HearthLink legacy artifact.

## Required credential before preview validation

Create one GitHub Actions repository secret:

- `VERCEL_TOKEN`

The token must have access to the `atomicdjts-projects` Vercel scope and the existing project slugs declared in the manifest.

The workflow does not require public project IDs or a separate secret for every application. It links the selected application directory to the existing project by project slug before pulling project configuration.

## Activation sequence after checkpoint review

1. Confirm the selector and dry-run workflow pass in pull request `#32`.
2. Add `VERCEL_TOKEN` as a GitHub Actions secret.
3. Temporarily activate the orchestration variable for one explicitly selected preview validation.
4. Validate one application project link, build, preview deployment, and smoke check.
5. Return the activation variable to disabled if any validation fails.
6. Add `git.deploymentEnabled: false` to the monorepo application `vercel.json` files only after the controlled preview succeeds.
7. Enable the orchestration variable permanently.
8. Merge the cutover configuration only after affected-project behavior and canonical aliases are verified.
9. Retain Vercel deployment history for rollback.

## Preview validation target

Use LayerForge Studio as the first controlled preview because:

- it is an active static Vite application;
- it has an isolated Vercel project;
- its latest Vercel status was the only successful monorepo deployment in the audited rate-limit incident;
- it does not require provider secrets or server endpoints.

The preview must confirm that running the CLI from the application directory links to the existing project and does not duplicate the configured root directory.

## Cutover files not yet changed

The following change is intentionally deferred until this checkpoint is accepted:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

It will be added only to deployed monorepo application configurations, not automatically to standalone BuildWorld, WeaveStudio, or QuoteForge repositories.

## Rollback

Before the cutover:

- close the draft pull request or delete the branch;
- existing Vercel Git deployments remain unchanged.

After the cutover:

- set `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED` to `false`;
- restore `git.deploymentEnabled` where necessary;
- use Vercel deployment history to restore a prior production deployment;
- keep GitHub as the editable source of truth.
