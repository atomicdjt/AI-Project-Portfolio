# Portfolio remediation plan — 2026-07-18

This plan follows the dated [baseline](portfolio-baseline-2026-07-18.md). It separates reversible repository work from external changes that can affect live URLs or product authority.

## Safe local and repository changes

- Expand `config/vercel-projects.json` as the authoritative machine-readable project/deployment record; do not introduce a second manifest.
- Keep the employer review path consistent: BuildWorld AI, ProcessHarbor, then WeaveStudio. RedactReady Pro is supporting specialization; QuoteForge Local is commercial execution.
- Simplify the GitHub profile to this review hierarchy and move deployment detail into the portfolio repository.
- Add dated audit/plan records and point duplicated documentation toward the manifest.
- Correct QuoteForge's test contract so `npm test` executes behavior tests rather than type checking; retain explicit typecheck and end-to-end commands.
- Prepare a history-preserving WeaveStudio `main` migration PR and validate its tree, CI, and browser suite before changing its default/production branch.

## Authorized non-destructive external changes

- Create focused pull requests and merge only after their stated checks pass.
- Update repository descriptions, topics, and homepage only where the live product name and canonical URL are verified.
- Update WeaveStudio's default and Vercel production branch only after the non-force migration is merged and its production deployment is `READY`.
- Create an honest BuildWorld `v0.1.0` release only after the isolated repository validation and release-note review complete.

## Explicit approval required

- Deleting or archiving a Vercel project, removing a domain/alias that may receive traffic, or severing a Git integration.
- Force-updating or deleting WeaveStudio `master` or its divergent historical `main` reference.
- Buying or attaching a custom domain.
- Changing payment, marketplace, or commercial-product terms.

## Deferred until source/traffic evidence is available

| Candidate | Reason to defer | Required evidence before action |
| --- | --- | --- |
| `source` Vercel project | It appears to duplicate QuoteForge Local but may have unique variables, aliases, or external references. | Environment-key comparison, alias/domain inventory, external-reference check, and rollback deployment record. |
| Vercel project renames | Generated `.vercel.app` names are public routes; a rename can change or invalidate those identities. | Verified alias-retention behavior and all source/link updates. |
| ProcessHarbor / RedactReady Pro extraction | Both are coherent workspace applications, but extraction would create duplicate maintenance authority today. | Independent release cadence, standalone ownership boundary, and migration plan that removes duplicate authority. |
| Mnemosyne Git attachment | The deployment is manual/unlinked. | Verified editable source and intended public lifecycle. |

## Verification gates

1. `npm ci`, lint, typecheck, tests, build, and repository-specific verify commands.
2. Local Markdown/deployment-policy checks for the portfolio repository.
3. HTTP and rendered-title checks on canonical public routes, including direct routes where the app supports them.
4. GitHub workflow and Vercel `READY` status checks after merges/deployments.
5. Focused tracked-secret and dependency-audit scans, with findings distinguished from false positives and manual follow-up.
