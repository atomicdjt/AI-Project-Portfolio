# ProcessHarbor Pro Reviewer Walkthrough

## 90-second path

1. Open the local app and identify the deterministic-demo indicator.
2. Load the fictional sample or enter sanitized notes, then select **Generate from intake**.
3. Read the SOP and show that owners, escalation, quality checks, and review cadence remain editable.
4. Open **Training Checklist**, **Knowledge Base**, and **Gap Detector**; mark nothing fixed until a reviewer has checked it.
5. Open **Version Tracker** and **Admin Dashboard** to show audit records and the local/simulated workspace boundary.
6. Export the workspace JSON and say that the download is a local handoff artifact, not a cloud synchronization claim.

## Shot list

| Shot | Evidence | Guardrail |
| --- | --- | --- |
| Intake | Fictional notes and role fields | No real personal, health, customer, or credential data |
| SOP | Owner, timing, escalation, and quality checks | State it is a draft requiring review |
| Gaps | Missing owner/escalation/tracking signals | Do not describe the heuristic as compliance validation |
| Admin | Demo mode, audit events, export action | Do not imply real authentication or durable backend storage |
| Export | Local JSON download confirmation | Do not display sensitive content or claim external ingestion |
| Responsive view | Same workflow at compact width | Note that keyboard/screen-reader review remains manual |

## Presenter boundary

Use the exact language: “Technical implementation verified; external workflow outcome not yet validated.” Do not claim a pilot, user, customer, time saving, productivity improvement, compliance result, or production AI deployment unless separately evidenced.
