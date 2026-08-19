# ProcessHarbor Formative Usability Pilot

**Status:** Participant-ready; external sessions not yet completed.

**Canonical test surface:** https://ai-project-portfolio-opspilot-ai-op.vercel.app/

**Study tracker:** #37

**Authoritative protocol:** [`atomicdjt/atomicdjt` — External Validation Kit](https://github.com/atomicdjt/atomicdjt/blob/main/docs/EXTERNAL_VALIDATION_KIT.md)

## Purpose

Run a five-participant, task-based formative usability study of ProcessHarbor, correct the highest-value findings in a separate implementation change, then retest with two or three new participants. The study is designed to identify usability problems and calibrate product claims; it is not market validation and is not statistically representative.

## Evidence model

### Private records — do not commit to this public repository

Keep the following outside the public repo in a controlled private location:

- participant names and contact information;
- signed or written consent records;
- raw recordings;
- any incidental personally identifying information;
- correspondence used to approve a quotation.

Map each participant to a neutral identifier such as `P01`, `P02`, etc. The private consent ledger should record the identifier, session date, consent decisions, and where the private source record is retained.

### Public/de-identified records

This repository may contain:

- participant ID and broad relevant-experience category;
- tested commit and canonical URL;
- task completion/assistance/time outcomes;
- de-identified hesitation and wrong-turn notes;
- finding severity and evidence;
- approved quotations only after exact-wording approval;
- correction/retest outcomes;
- aggregate metrics and a claim-safe conclusion.

Do not publish employer names, customer information, contact details, raw recordings, or details that make a participant readily identifiable.

## Study freeze

Before the first session, record one tested source commit and use that same version for all five first-round participants unless a Critical finding requires an emergency correction. If the tested build changes, record the transition explicitly instead of combining results as if every participant saw the same product.

Record:

```text
Round-1 source commit:
Canonical URL: https://ai-project-portfolio-opspilot-ai-op.vercel.app/
First session date:
Last session date:
Facilitator:
```

## Participant target

Recruit five people with relevant but varied experience in operations, documentation, administration, support, retail leadership, training, or small-business work. Avoid a sample composed entirely of people who already know ProcessHarbor or its design rationale.

Capture only broad, claim-relevant characteristics, for example:

```text
P01 — retail operations / training experience; moderate AI familiarity
P02 — administrative / documentation experience; low AI familiarity
```

## Standard session

Use the exact fictional returns-policy notes and six-task protocol in the External Validation Kit. Do not substitute confidential workplace material.

Recommended order:

1. Read consent script and record private consent decisions.
2. Orientation task — no coaching for the first 60 seconds.
3. Generate structured documentation from the standardized fictional notes.
4. Evaluate the SOP and identify what requires human confirmation.
5. Locate supporting outputs, versions/audit information, and gaps.
6. Export and explain what the participant believes the export contains.
7. Ask trust/boundary questions.
8. Complete the 1–5 post-session questionnaire and open questions.
9. Record finding severity without suppressing negative or contradictory evidence.

Use [`SESSION_RECORD_TEMPLATE.md`](./SESSION_RECORD_TEMPLATE.md) for de-identified notes.

## Round-1 completion gate

Round one is complete only when all five participant records contain:

- explicit private participation-consent evidence;
- tested source commit/URL;
- every task outcome;
- assistance, timing, hesitation, and wrong-turn data;
- verbatim/de-identified reactions where safe;
- questionnaire responses;
- finding severity;
- unresolved risks.

## Correction gate

After five sessions:

1. Aggregate recurring findings without deleting contradictory evidence.
2. Rank findings by observed severity and participant count.
3. Open a separate implementation change for Critical/High findings and the highest-value repeated Medium findings.
4. Preserve the original observations unchanged.
5. Record correction commits/PRs in the results summary.

## Independent retest

Use two or three new participants who did not participate in round one. Reuse the same core tasks and report whether assistance rate, task time, and recurring failures improved, regressed, or remained unresolved.

## Publication boundary

The public report may state only what the collected evidence supports. A suitable conclusion is:

> Five participants completed a structured formative usability study of ProcessHarbor. The results identify usability patterns in this sample; they do not establish market demand, production suitability, or population-wide usability.

Do not claim product-market fit, universal intuitiveness, production validation, or representative user preference from this study.

## Files

- [`SESSION_RECORD_TEMPLATE.md`](./SESSION_RECORD_TEMPLATE.md) — one de-identified working copy per participant.
- [`RESULTS_SUMMARY.md`](./RESULTS_SUMMARY.md) — aggregate outcomes, findings, corrections, retest, and claim-safe conclusion.
