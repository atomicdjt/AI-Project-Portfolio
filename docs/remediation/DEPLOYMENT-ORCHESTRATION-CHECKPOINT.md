# Deployment Orchestration Checkpoint

**Branch:** `chore/deployment-orchestration-2026-07-17`  
**Pull request:** `#32`  
**Checkpoint state:** dry-run architecture prepared; production cutover not authorized

## What is implemented on the branch

- A declarative Vercel project manifest at `config/vercel-projects.json`.
- A deterministic affected-project selector at `scripts/detect-affected-apps.mjs`.
- An explicit-project selector for tightly controlled manual preview validation.
- Node test coverage for documentation-only, application-only, root dependency, manual legacy, deduplication, explicit project selection, unknown project rejection, and malformed-manifest cases.
- A `Vercel Affected Deployment Plan` GitHub Actions workflow.
- A guarded deployment matrix that verifies, links, builds, deploys, and smoke-checks only selected applications when explicitly activated.
- Deployment-plan artifacts and GitHub job summaries for auditability.
- A baseline and rollback record.

## Current safety controls

Automatic changed-path deployment requires all applicable conditions below:

1. at least one active project is selected;
2. repository variable `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED` equals `true`.

A manual workflow dispatch adds an additional requirement:

3. `execute_deployment` must be explicitly enabled.

A manual dispatch can select one named active project. Preserved legacy projects are not offered as deployment choices and remain `manual` in the manifest.

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

### Explicit manual selection

A `workflow_dispatch` run can choose one active project independently of changed-path selection. This exists specifically to ensure the first credentialed preview can target `layerforge-studio` only, even though the orchestration pull request changes global build inputs.

The dispatch defaults to:

- `project_id: auto`;
- `execute_deployment: false`.

Those defaults produce a plan only.

### Manual-only applications

Changes under these preserved artifacts are reported but not automatically deployed:

- Amino Acid Workbench legacy artifact;
- HearthLink legacy artifact.

## Required credential before preview validation

Create one GitHub Actions repository secret:

- `VERCEL_TOKEN`

The token must have access to the `atomicdjts-projects` Vercel scope and the existing project slugs declared in the manifest.

The workflow does not require a separate project secret for every application. It links the selected application directory to the existing Vercel project by project slug before pulling configuration.

Never paste the token into an issue, pull request, repository file, workflow input, or chat transcript. Store it only as the GitHub Actions secret.

## Activation sequence after checkpoint review

1. Confirm the selector and dry-run workflow pass in pull request `#32`.
2. Merge the guarded architecture while native Vercel Git deployment remains unchanged.
3. Add `VERCEL_TOKEN` as a GitHub Actions repository secret.
4. Set repository variable `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED` to `true` for the controlled validation.
5. Manually run `Vercel Affected Deployment Plan` with:
   - `project_id: layerforge-studio`;
   - `execute_deployment: true`.
6. Verify that the generated matrix contains only LayerForge Studio.
7. Validate the existing project link, build, preview deployment, and HTTP smoke check.
8. Return the activation variable to `false` immediately if any validation fails.
9. Add `git.deploymentEnabled: false` to the monorepo application `vercel.json` files only after the controlled preview succeeds.
10. Verify changed-path behavior with documentation-only and single-application test commits.
11. Enable the orchestration variable for normal operation only after the native Git cutover is verified.
12. Retain Vercel deployment history for rollback.

## Preview validation target

Use LayerForge Studio as the first controlled preview because:

- it is an active static Vite application;
- it has an isolated Vercel project;
- it does not require provider secrets or server endpoints;
- it provides a low-risk verification of directory linking, prebuilt deployment, and smoke testing.

The preview must confirm that running the CLI from the application directory links to the existing project and does not duplicate the configured root directory.

## Cutover files not yet changed

The following change is intentionally deferred until the controlled preview succeeds:

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
