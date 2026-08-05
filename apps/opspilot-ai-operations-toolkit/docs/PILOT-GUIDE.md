# ProcessHarbor Pro Pilot Guide

## Purpose and readiness boundary

This guide supports a small, approval-gated evaluation of the deterministic local workflow. It is **prepared for pilot evaluation**; it is not a production rollout, security certification, or claim of validated productivity improvement.

## Safe pilot shape

1. Name one workflow owner and one reviewer.
2. Use fictional or approved sanitized notes only; exclude personal, health, financial, credential, regulated, and customer-identifying data.
3. Define a narrow question: can the draft make ownership, escalation, completion tracking, and review cadence easier to inspect?
4. Run locally in deterministic mode. Do not enable the optional AI provider, connect production systems, or rely on browser `localStorage` as a record of authority.
5. Review every generated document and gap before any use. Export only to an approved local location and apply the team's normal retention/deletion policy.

## Suggested observation record

Record the workflow type, whether the reviewer could identify missing owners/escalation/tracking, which draft sections needed editing, and whether the export was readable. Treat these as qualitative observations, not time-saving or performance metrics unless a separately approved study defines those measures.

## Stop conditions

Stop if sensitive data is entered, a participant expects the draft to be authoritative, optional provider configuration is requested without security approval, export handling is unclear, or a decision would be made without human review.

## Exit and rollback

Delete local demo data through the browser's site-data controls after the session; remove any approved exported fictional artifacts according to the agreed retention rule. No provider, deployment, account, repository, or production-system action is required for this pilot shape.
