# External Validation Protocol

The portfolio contains substantial internal evidence—source, tests, builds, documentation, and public deployments—but limited independent usage evidence. This protocol defines a small, ethical, reproducible pilot that can close that gap without exaggerating results.

## Objective

Collect direct evidence about whether a target user can understand and complete the core workflow of one flagship product, where they struggle, what defects occur, and which changes improve the experience.

Recommended pilot order:

1. ProcessHarbor for employer-facing technical-operations proof;
2. WeaveStudio for product usability and buyer-transfer proof;
3. QuoteForge Local for commercial-buyer evaluation.

## Participants

Recruit five participants who reasonably resemble the intended audience. Record:

- role or relevant experience;
- prior familiarity with the product category;
- whether the participant previously saw the application;
- accessibility needs relevant to the session;
- any personal relationship to the researcher.

Friends or family may participate, but the report must disclose the relationship. Do not present convenience participants as representative market research.

## Ethics and Consent

Before recording or quoting a participant:

- explain what is being tested;
- state what data will be collected;
- obtain separate consent for screen, audio, and quotation use;
- allow withdrawal before publication;
- remove personal or sensitive information from published evidence;
- do not offer compensation conditional on positive feedback.

Store raw recordings privately. Publish only approved excerpts or de-identified findings.

## Session Structure

### 1. Pre-session questions

- What would you expect this product to do from its landing page?
- Have you used a similar tool?
- What would make this workflow useful or untrustworthy?

### 2. Unassisted task

Give the participant the product URL and one outcome-based task without teaching the interface first.

- **ProcessHarbor:** Turn messy process notes into a usable SOP, identify documentation gaps, and export the result.
- **WeaveStudio:** Import source material, organize it into a reviewable workflow, create a deliverable, and reopen saved work.
- **QuoteForge:** Choose a service template, produce a sample estimate, review the lead, and find the embed guidance.

### 3. Observation

Record:

- task completion;
- time to first meaningful action;
- total task time;
- navigation reversals;
- errors or dead ends;
- requests for clarification;
- accessibility or readability problems;
- statements indicating trust or distrust;
- defects that prevent completion;
- every facilitator intervention.

### 4. Post-session questions

- What did you believe the product was doing?
- Which step was least clear?
- Which output was most useful?
- What made you hesitate or distrust the result?
- What would need to change before you used or recommended it?
- On a scale of 1–10, how confident are you that you could repeat the workflow without help? Why?

## Core Metrics

Report raw counts and ranges rather than implying statistical significance.

| Metric | Definition |
| --- | --- |
| Unassisted completion | Participants completing the defined task without intervention |
| Assisted completion | Participants completing after one or more interventions |
| Median completion time | Middle observed completion time among completed sessions |
| Critical failures | Defects that prevent completion or corrupt expected output |
| Major confusion points | Steps where at least two participants stop, reverse, or ask for help |
| Repeatability confidence | Participant-reported confidence with reasons retained |
| Recommendation intent | Qualitative explanation, not a market-demand claim |

## Defect Handling and Retest

Create one issue per material defect with anonymized evidence, reproduction steps, expected and actual behavior, severity, affected version, proposed correction, and verification after correction.

Do not silently exclude failed sessions. Disclose exclusions caused by connectivity, recording failure, or facilitator error.

After correcting the three highest-impact findings:

1. run automated regression checks;
2. repeat the affected tasks with at least two participants who did not see the original version;
3. compare completion and confusion evidence;
4. report improvements and regressions honestly.

## Testimonial Standard

Publish a testimonial only when the participant approved the exact wording, relevant relationships are disclosed, the quote reflects actual experience, no benefit was contingent on praise, and editing does not inflate or reverse the meaning.

Testimonials are qualitative evidence, not proof of broad demand.

## Pilot Report

Create `docs/validation/<project>-pilot-YYYY-MM-DD.md` containing:

1. product, version, and tested URL;
2. research question;
3. participant characteristics;
4. task and materials;
5. consent and data-handling method;
6. results table;
7. critical defects and confusion points;
8. positive evidence;
9. changes implemented;
10. retest results;
11. limitations;
12. approved quotations;
13. relevant issues, commits, and verification runs.

## Claim Rules

Acceptable:

- “Five participants completed a structured usability pilot; four completed the core task without assistance.”
- “The pilot identified three major navigation problems, which were corrected and retested.”

Not acceptable:

- “Users love the product.”
- “Market validated.”
- “Proven to increase productivity.”
- “Production tested.”

A small pilot provides useful external evidence, but it does not establish market size, commercial demand, security, or enterprise readiness.
