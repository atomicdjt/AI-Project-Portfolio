# ScamShield AI Evaluation Plan

## Purpose

Evaluate whether ScamShield AI improves users' ability to recognize possible fraud signals, preserve useful evidence, choose safer next steps, and prepare a structured report without increasing panic, shame, privacy risk, or false certainty.

## Evaluation Questions

1. Does the rule engine identify the intended indicators in representative synthetic scam messages?
2. How often does the engine flag legitimate messages that contain urgency, payments, or institution names?
3. Do plain-language explanations improve comprehension and recall?
4. Can users complete an evidence packet quickly and accurately?
5. Can caregivers use the workflow without blame, coercion, or confusion about consent?
6. Is the product keyboard-accessible, readable, and usable with common assistive technologies?
7. Do users understand the privacy model and the limits of localStorage and exported PDFs?

## Primary Metrics

| Metric | Method | Initial Target |
| --- | --- | --- |
| Red-flag detection accuracy | Label 50-100 synthetic cases and compare detected categories | At least 85% recall for explicit rule-covered indicators |
| False-positive rate | Run 50-100 legitimate messages with urgency/payment language | Under 15% high-or-critical classifications |
| Comprehension improvement | Five-question pre/post scenario quiz | Mean improvement of 20 percentage points |
| Evidence packet completion time | Timed usability task | Median under 10 minutes |
| User confidence | Five-point pre/post scale | Mean improvement of at least 1 point without increased certainty claims |
| Caregiver usability | Scenario task plus interview | At least 80% task completion without facilitator intervention |
| Accessibility review | WCAG 2.2 AA checklist and assistive-technology walkthrough | No critical blockers; documented remediation for remaining issues |
| Privacy review | Data-flow and browser-storage inspection | No unintended network transfer or persistent file-preview data |

## Pilot Design

### Formative Usability Study

- Recruit 10-20 participants across older adults, disabled adults, caregivers, community advocates, and people with varied digital literacy.
- Use only synthetic cases and fictional personal data.
- Ask participants to analyze one message, explain two risk signals, add a timeline event, complete immediate actions, locate an official reporting route, and export a report.
- Capture task completion, time, errors, comprehension, confidence, and qualitative feedback.
- Provide a clear safety protocol so no participant treats a sample as a real emergency.

### Detection Evaluation

- Create 50-100 synthetic scam examples across all ten supported pattern categories.
- Create 50-100 legitimate comparison messages that contain potentially confusing language such as real deadlines, payment reminders, institution names, and security notices.
- Have at least two reviewers label expected categories and adjudicate disagreements.
- Report per-category precision, recall, false-positive rate, score distribution, and error examples.

### Expert Review

- Invite cybersecurity, consumer-protection, financial-counseling, aging-services, disability-access, and privacy professionals.
- Review safety copy, scoring transparency, reporting guidance, evidence usefulness, potential overreach, and likely misuse.
- Track each recommendation, disposition, and release decision.

### Partner Feedback

- Conduct structured sessions with nonprofit and community organizations.
- Assess fit with real intake and referral workflows without collecting active client evidence in early pilots.
- Identify training, language, accessibility, governance, and institutional-export requirements.

### Plain-Language Testing

- Compare standard and plain-language explanations with short comprehension questions.
- Measure whether users can state the concern, explain why it matters, and identify the safer next action.
- Review content with plain-language and disability-access specialists.

## Accessibility Review

- Keyboard-only workflow completion
- Screen-reader landmark, form-label, heading, live-region, and button-name review
- 200% and 400% zoom checks
- Mobile reflow and orientation checks
- Contrast and non-color status checks
- Reduced-motion behavior
- Senior-focused readability and target-size review

## Privacy and Security Review

- Confirm zero application network requests during analysis, persistence, and export.
- Confirm image object URLs are memory-only and revoked when removed or cleared.
- Inspect localStorage contents for unnecessary evidence or temporary preview data.
- Validate sensitive-data warnings and clear-data behavior.
- Review dependencies, Netlify headers, and exported-report handling.

## Analysis and Reporting

- Separate descriptive results from claims of effectiveness.
- Publish participant characteristics, task protocol, known biases, and limitations.
- Do not use real scam evidence without an approved consent, retention, redaction, and incident-response protocol.
- Use pilot results to prioritize changes before any institutional or public deployment claim.
