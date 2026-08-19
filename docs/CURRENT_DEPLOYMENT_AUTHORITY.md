# Current Deployment and Source Authority

**Verified:** 2026-08-19  
**Scope:** current source-of-truth and deployment-authority rules for maintained portfolio applications. Historical audit files remain evidence of their own dates; deployment instances are derivative evidence, not source authority.

## Authority rules

1. **Source authority lives in Git.** The authoritative repository and branch listed below determine editable source of truth.
2. **Vercel deployments are outputs, not source.** A deployment ID or URL can prove what was deployed, but it does not supersede the authoritative Git source.
3. **The eight canonical Vercel apps in `atomicdjt/AI-Project-Portfolio` no longer use native Vercel Git deployment fan-out.** PR #81 added `git.deploymentEnabled: false` to each canonical app's `vercel.json`; each existing `ignoreCommand` remains as defense in depth.
4. **Monorepo deployment authority is the guarded GitHub Actions controller** at `.github/workflows/vercel-affected-plan.yml`, using `config/vercel-projects.json` for affected-project selection and canonical Vercel identity.
5. **The controller fails closed.** Pull requests are plan-only and never receive Vercel deployment credentials. Deployment requires `VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED=true`; manual dispatch additionally requires `execute_deployment=true`. The owner returned the activation variable to `false` after the pre-merge proof.
6. **Environment follows trigger context.** A controller deployment from a `push` to `main` uses Vercel production configuration and `--prod`; an owner-authorized `workflow_dispatch` is a preview deployment.
7. **Every controller deployment verifies the selected application before deployment,** then performs token check, Vercel link, configuration pull, prebuilt build/deploy, HTTP smoke check, and publishes source-SHA/deployment evidence.

## Controller-managed canonical monorepo apps

All rows below use `atomicdjt/AI-Project-Portfolio` / `main` as source authority.

| Product | Canonical Vercel project | Canonical public URL | Deployment authority |
| --- | --- | --- | --- |
| Portfolio Hub | `ai-project-portfolio-portfolio-hub` | https://ai-project-portfolio-portfolio-hub.vercel.app/ | affected-project controller |
| RedactReady Pro | `ai-project-portfolio-redactready-pro-hri-os` | https://ai-project-portfolio-redactready-pr.vercel.app/ | affected-project controller |
| ProcessHarbor | `ai-project-portfolio-opspilot-ai-operations-toolkit` | https://ai-project-portfolio-opspilot-ai-op.vercel.app/ | affected-project controller |
| ScamShield AI | `ai-project-portfolio-scamshield-ai` | https://ai-project-portfolio-scamshield-ai.vercel.app/ | affected-project controller |
| RedactReady | `ai-project-portfolio-redactready-local` | https://ai-project-portfolio-redactready-lo.vercel.app/ | affected-project controller |
| LayerForge Studio | `ai-project-portfolio-layerforge-studio` | https://ai-project-portfolio-layerforge-stu.vercel.app/ | affected-project controller |
| FocusForge | `ai-project-portfolio-focusforge` | https://ai-project-portfolio-focusforge.vercel.app/ | affected-project controller |
| VariantVision Pro | `ai-project-portfolio-variantvision-pro` | https://ai-project-portfolio-variantvision.vercel.app/ | affected-project controller |

`GardenGrid` remains a supporting recovered-source demo in the project catalog. It was not part of PR #81's eight-project native-Git cutover and should not be described as having the same verified cutover boundary without a separate validation pass.

## External flagship source authority

These projects have their own repositories and are not governed by the monorepo controller above.

| Product | Authoritative repository / branch | Canonical Vercel project | Canonical public URL |
| --- | --- | --- | --- |
| BuildWorld AI | `atomicdjt/buildworld-ai` / `main` | `buildworld-ai-v01-improvements` | https://buildworld-ai-v01-improvements.vercel.app/ |
| WeaveStudio | `atomicdjt/weavestudio` / `main` | `weavestudio` | https://weavestudio-nine.vercel.app/ |
| Validation Ledger | `atomicdjt/validation-ledger` / `main` | `validation-ledger` | https://validation-ledger.vercel.app/ |
| QuoteForge Local | private `atomicdjt/quoteforge-local` / `main` | `quoteforge-local` | https://quoteforge-local.vercel.app/ |

## PR #81 deployment-controller acceptance evidence

- PR #81 merged to protected `main` as `1055ab0cccbab834bca6319219217fbf7a58b277` on 2026-08-19.
- Before merge, owner-authorized **Vercel Affected Deployment Plan #122** ran on source SHA `6a8c18191a9cee2b56a18db5f69d007aa1ee07df` with `project_id=layerforge-studio` and `execute_deployment=true`.
- The LayerForge proof completed application verification, Vercel token verification, project link, configuration pull, prebuilt build, prebuilt deploy, and HTTP smoke check successfully.
- The resulting preview deployment was `dpl_4fFSNeu25R7ZLZ2GEZNse3Se1TWg`, reached `READY`, was created through the CLI controller path, and retained the tested source SHA in Vercel metadata.
- After merge, all eight canonical projects were queried for deployments created after the merge timestamp. Result: **0/8 native Git Deployment objects**. A delayed second pass produced the same 0/8 result.
- The activation variable was returned to `false` after the proof; no always-on deployment authorization is intended.

## Security reconciliation state

PR #75 (`fix: reconcile patched dependency lockfiles`) merged to `main` as `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` before PR #81. Its scope was the five active lockfiles and its exact-head validation recorded clean installs, audits, release verification, application tests/builds, and ProcessHarbor E2E. This authority record does not make a stronger claim about the current Dependabot dashboard than the merged remediation evidence supports.

## Legacy / duplicate-project boundary

| Product | Vercel project | Current authority status |
| --- | --- | --- |
| WeaveStudio | `weavestudio-demo` | Retained non-canonical project. Prior owner-dashboard verification on 2026-08-15 recorded its Git integration disconnected. Canonical authority is `weavestudio` / `atomicdjt/weavestudio` `main`. |
| QuoteForge Local | `source` | Retained non-canonical project. Prior owner-dashboard verification on 2026-08-15 recorded its Git integration disconnected. Canonical authority is `quoteforge-local` / private `atomicdjt/quoteforge-local` `main`. |

Retention does not authorize deletion, alias removal, or reuse. Historical deployments remain evidence only.

## Governance boundary

- This file does not expose secret values, environment values, deploy hooks, or credentials.
- Changing this document does not itself authorize deployment. The controller's runtime gates remain authoritative.
- If repository, project, canonical URL, deployment mode, or controller policy changes, update this record with fresh evidence rather than rewriting dated historical audits.
