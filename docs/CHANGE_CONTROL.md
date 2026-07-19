# Portfolio Change Control

## Purpose

Prevent public-status drift, ambiguous source authority, unsupported capability claims, and accidental deployment sprawl.

## Changes requiring authority-manifest updates

Update `config/portfolio-authority.json` when any of the following changes:

- canonical project name;
- source repository, branch, or path;
- public visibility;
- canonical deployment project or URL;
- implementation classification;
- review tier or audience;
- traction evidence;
- legacy or experimental status;
- noncanonical deployment classification.

## Required companion updates

Depending on the change, update:

- `docs/PROJECT_INDEX.md`;
- `docs/project-ranking.md`;
- `docs/VERCEL_DEPLOYMENT.md`;
- `docs/deployment-and-previews.md`;
- relevant README and case study;
- buyer or recruiter materials containing the old URL or status.

## Evidence before status upgrades

- **Live:** reachable canonical deployment and recorded target.
- **Maintained:** authoritative source and recent verification evidence.
- **Browser-verified:** named browser workflow exercised successfully.
- **Production-verified:** intended production configuration and critical workflow verified.
- **Commercially packaged:** inspectable package, license boundaries, and delivery materials.
- **Validated with users:** real participant protocol, consent, raw results, limitations, and dated report.
- **Revenue/customer claim:** independently supportable transaction or relationship evidence with privacy respected.

Do not infer a stronger status from a weaker one.

## Pull-request checklist

- [ ] Authority manifest updated where required.
- [ ] Canonical URLs and branches are consistent.
- [ ] Public claims match evidence.
- [ ] No secret values or personal participant data are exposed.
- [ ] Automated authority validation passes.
- [ ] Relevant tests/builds pass.
- [ ] Deployment effects are understood.
- [ ] Destructive account actions are separated from repository changes.
- [ ] Rollback or recovery is documented for consequential changes.

## Historical records

Dated audit baselines should remain immutable unless correcting a factual transcription error. Current status belongs in the authority manifest and current documentation, not by rewriting historical observations.