# Portfolio Change Control

## Purpose

Prevent public-status drift, ambiguous source authority, unsupported capability claims, and accidental deployment sprawl.

## Changes Requiring Catalog Updates

Update `config/vercel-projects.json` when any of the following changes:

- canonical project name;
- source repository, branch, or path;
- public visibility;
- canonical Vercel project or URL;
- deployment mode or project classification;
- review priority or audience;
- traction evidence;
- legacy or experimental status;
- noncanonical deployment classification.

## Required Companion Updates

Depending on the change, update:

- `README.md`;
- `docs/PROJECT_INDEX.md`;
- `docs/project-ranking.md`;
- `docs/recruiter-quick-review.md`;
- `docs/EMPLOYER_OVERVIEW.md`;
- `docs/VERCEL_DEPLOYMENT.md`;
- `docs/deployment-and-previews.md`;
- the relevant project README or case study;
- buyer materials containing an old URL or status.

## Evidence Before Status Upgrades

- **Live:** reachable canonical deployment and recorded target.
- **Maintained:** authoritative source and recent verification evidence.
- **Browser-verified:** named browser workflow exercised successfully.
- **Production-verified:** intended production configuration and critical workflow verified.
- **Commercially packaged:** inspectable package, license boundaries, and delivery materials.
- **Validated with users:** real participant protocol, consent, raw results, limitations, and dated report.
- **Revenue or customer claim:** independently supportable transaction or relationship evidence with privacy respected.

Do not infer a stronger status from a weaker one.

## Pull-Request Checklist

- [ ] Catalog updated where required.
- [ ] Canonical URLs and branches are consistent.
- [ ] Public claims match evidence.
- [ ] No secret values or participant data are exposed.
- [ ] Documentation and authority checks pass.
- [ ] Relevant tests and builds pass.
- [ ] Deployment effects are understood.
- [ ] Destructive account actions are separated from repository changes.
- [ ] Rollback or recovery is documented for consequential changes.

## Deployment Discipline

- Prepare related file changes locally and publish them as one coherent commit when practical.
- Avoid repeated branch pushes while native Vercel Git integration is active.
- Confirm plan capacity before a portfolio-wide or global-input change.
- Use the guarded affected-project workflow only after its secrets, activation variable, single-project preview, and rollback path are verified.
- Do not merge while required CI checks or Vercel deployment checks are failing for unresolved reasons.

## Historical Records

Dated audit baselines should remain immutable unless correcting a factual transcription error. Current status belongs in the catalog and current documentation, not in rewritten historical observations.
