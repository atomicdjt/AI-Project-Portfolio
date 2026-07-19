# External Validation Protocol

The portfolio currently contains substantial internal evidence—source, tests, builds, documentation, and public deployments—but limited independent usage evidence. This protocol defines a small, ethical, reproducible pilot that can close that gap without exaggerating results.

## Objective

Collect direct evidence about whether a target user can understand and complete the core workflow of a flagship product, where they struggle, what defects occur, and which changes improve the experience.

The first pilot should evaluate **one product only**. Recommended order:

1. ProcessHarbor for employer-facing technical-operations proof;
2. WeaveStudio for product usability and buyer-transfer proof;
3. QuoteForge Local for commercial buyer evaluation.

## Participants

Recruit 5 participants who reasonably resemble the intended audience. Record:

- role or relevant experience;
- prior familiarity with the product category;
- whether the participant has previously seen the application;
- accessibility needs relevant to the session.

Friends or family may participate, but the report must disclose the relationship. Do not present convenience participants as representative market research.

## Ethics and consent

Before recording or quoting a participant:

- explain what is being tested;
- state what data will be collected;
- obtain explicit consent for screen, audio, and quotation use separately;
- allow withdrawal before publication;
- remove personal or sensitive information from published evidence;
- do not offer compensation conditional on positive feedback.

Store raw recordings privately. Publish only approved excerpts or de-identified findings.

## Session structure

### 1. Pre-session questions

- What would you expect this product to do from its landing page?
- Have you used a similar tool?
- What would make this workflow useful or untrustworthy?

### 2. Unassisted task

Give the participant the product URL and one outcome-based task. Do not teach the interface first.

Examples:

- **ProcessHarbor:** “Turn these messy process notes into a usable SOP, identify documentation gaps, and export the result.”
- **WeaveStudio:** “Import this source material, organize it into a reviewable workflow, create a deliverable, and reopen your saved work.”
- **QuoteForge:** “Choose a service template, produce a sample estimate, review the lead, and find how the calculator would be embedded on a client site.”

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
- defects that prevent completion.

Do not help unless the participant is blocked. Record every intervention.

### 4. Post-session questions

- What did you believe the product was doing?
- Which step was least clear?
- Which output was most useful?
- What made you hesitate or distrust the result?
- What would need to change before you used or recommended it?
- On a scale of 1–10, how confident are you that you could repeat the workflow without help? Why?

## Core metrics

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

## Defect handling

Create one issue per material defect with:

- anonymized evidence;
- reproduction steps;
- expected and actual behavior;
- severity;
- affected project and version;
- proposed fix;
- verification after correction.

Do not silently exclude failed sessions. If a session is invalid because of connectivity, recording failure, or facilitator error, disclose the exclusion and reason.

## Before-and-after validation

After fixing the three highest-impact findings:

1. run automated regression checks;
2. repeat the affected tasks with at least 2 participants who did not see the original version;
3. compare task completion and confusion evidence;
4. report improvements and regressions honestly.

## Testimonial standard

A testimonial may be published only when:

- the participant approved the exact wording;
- the relationship and relevant role are disclosed where material;
- the quotation reflects actual experience;
- no payment or benefit was contingent on praise;
- the quote is not edited to reverse or inflate meaning.

Testimonials are qualitative evidence, not proof of broad demand.

## Pilot report template

Create `docs/validation/<project>-pilot-YYYY-MM-DD.md` containing:

1. Product/version and tested URL
2. Research question
3. Participant characteristics
4. Task and materials
5. Consent and data-handling method
6. Results table
7. Critical defects
8. Major confusion points
9. Positive evidence
10. Changes implemented
11. Retest results
12. Limitations
13. Approved quotations
14. Links to relevant issues, commits, and verification runs

## Claim rules after the pilot

Acceptable:

- “Five participants completed a structured usability pilot; four completed the core task without assistance.”
- “The pilot identified three major navigation problems, which were corrected and retested.”

Not acceptable:

- “Users love the product.”
- “Market validated.”
- “Proven to increase productivity.”
- “Production tested.”

A small pilot provides valuable external evidence, but it does not establish market size, commercial demand, security, or enterprise readiness.