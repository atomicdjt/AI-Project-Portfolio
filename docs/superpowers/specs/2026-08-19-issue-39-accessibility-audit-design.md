# Issue #39 — Evidence-Backed Flagship Accessibility Audit Design

Date: 2026-08-19
Status: design approved in principle; implementation requires explicit post-spec review approval
Issue: `atomicdjt/AI-Project-Portfolio#39`

## 1. Purpose

Establish a reproducible, evidence-bounded accessibility review program for the six flagship applications in `atomicdjt/AI-Project-Portfolio` without making unsupported claims of WCAG conformance or legal compliance.

The audit is intended to do three things at once:

1. discover material accessibility defects in the current flagship workflows;
2. fix Critical and High-severity defects with regression protection where practical;
3. publish a dated, inspectable evidence record that states exactly what was and was not tested.

The permitted public claim after successful completion is narrowly scoped to wording such as:

> Accessibility-reviewed under a dated scope, with documented automated, keyboard, focus, semantic, zoom/reflow, responsive, contrast, reduced-motion, and critical-workflow evidence. Full assistive-technology validation is separately identified where not yet completed.

The audit must not imply formal WCAG conformance, certification, legal compliance, universal usability, or screen-reader validation that did not actually occur.

## 2. Scope

### In-scope flagship applications

1. Portfolio Hub — `apps/portfolio-hub`
2. ProcessHarbor — `apps/opspilot-ai-operations-toolkit`
3. RedactReady Pro — `apps/redactready-pro-hri-os`
4. LayerForge Studio — `apps/layerforge-studio`
5. ScamShield AI — `apps/scamshield-ai`
6. VariantVision Pro — `apps/variantvision-pro`

Canonical production URLs are sourced from `config/vercel-projects.json` and must be recorded in the audit output together with the tested commit/source state.

### Explicitly out of scope for this monorepo audit

- BuildWorld AI: authoritative standalone repository; may receive a linked standalone audit.
- WeaveStudio: authoritative standalone repository; may receive a linked standalone audit.
- QuoteForge Local: private authoritative repository; not part of issue #39.
- historical/legacy static artifacts and non-flagship demonstrations.

## 3. Design decision

Use a **centralized portfolio-level accessibility harness plus app-specific remediation**.

The centralized harness owns common audit mechanics and evidence formatting. Individual applications keep ownership of product-specific regressions and fixes.

This avoids six incompatible audit implementations while also avoiding a one-time external scan that provides no durable regression protection.

## 4. Audit architecture

### 4.1 Shared audit layer

Add a portfolio-level accessibility audit package under a dedicated repository path, provisionally:

- `scripts/accessibility/`
- `docs/accessibility/`

The exact implementation path may be adjusted during planning if an existing test convention is a better fit, but the responsibilities remain fixed.

The shared layer will contain:

- canonical project audit configuration;
- critical-flow definitions;
- shared Playwright audit utilities;
- automated accessibility scanning integration;
- viewport/zoom/reflow checks;
- keyboard/focus checks;
- reduced-motion checks;
- evidence serialization;
- dated summary generation or deterministic evidence templates.

### 4.2 Per-application layer

Each in-scope app may receive focused changes where the audit identifies defects. Examples include:

- semantic heading/landmark fixes;
- form labels and descriptions;
- accessible names for icon-only controls;
- dialog/menu/tab semantics and focus management;
- keyboard alternatives for pointer-only interactions;
- visible focus treatment;
- status communication not dependent on color alone;
- contrast corrections;
- reflow/overflow corrections;
- reduced-motion handling;
- text alternatives for charts, canvases, images, or other complex visual state;
- error and completion announcements where appropriate.

App-specific regression tests should live with the app when they protect product behavior rather than the audit harness itself.

## 5. Test authority and source provenance

Every recorded audit result must bind to:

- repository: `atomicdjt/AI-Project-Portfolio`;
- exact commit SHA;
- application identifier;
- canonical production URL or exact local preview URL;
- browser and browser version when available;
- operating system/runner environment;
- viewport dimensions;
- test category;
- automated tool version where applicable;
- date/time or dated run identifier.

No result may be copied forward as current evidence after a material application change without retesting.

Production and local/pre-merge evidence must be distinguished rather than conflated.

## 6. Required audit dimensions

### 6.1 Semantic structure

Verify critical surfaces for:

- document title and page identity;
- logical heading hierarchy;
- landmark use;
- button/link/input semantics;
- form labels and instructions;
- accessible names and descriptions;
- list/table semantics where applicable;
- stateful control attributes where applicable (`aria-expanded`, `aria-selected`, etc.).

ARIA must not be used to repair behavior that native HTML already provides more safely.

### 6.2 Keyboard-only operation

For each primary workflow, verify that a keyboard user can reach and operate the critical path without pointer input.

Record at minimum:

- logical focus order;
- absence of keyboard traps;
- visible focus indication;
- activation of primary controls;
- dialog/panel open and close behavior;
- return or preservation of useful focus after modal interactions;
- non-pointer alternative for any material drag/canvas interaction where such an alternative is required for the workflow.

The audit does not require every free-form image-editing gesture in LayerForge to be fully keyboard-equivalent if the application clearly exposes a meaningful keyboard-operable alternative workflow and the remaining limitation is documented. Material primary actions may not silently remain pointer-only.

### 6.3 Zoom and reflow

Exercise critical surfaces at:

- standard desktop viewport;
- narrow/mobile viewport;
- a reproducible 200%-zoom-equivalent CSS viewport or actual browser zoom where the runner supports it reliably.

Check for:

- content clipping;
- horizontal scroll caused by avoidable layout defects;
- obscured controls;
- overlapping text;
- inaccessible off-screen dialogs/menus;
- loss of function when text/layout scales.

Where actual browser zoom is not technically reproducible in CI, the report must label the viewport proxy honestly and preserve any manual actual-zoom requirement separately.

### 6.4 Contrast and non-color communication

Record evidence for text and meaningful controls/statuses.

Automated contrast detection may identify candidates but does not replace manual review of custom rendering, gradients, canvases, disabled states, overlays, or context-dependent contrast.

Status, severity, validation, risk, selection, or success/failure meaning must not rely on color alone where the distinction is material.

### 6.5 Motion

Where animation, transitions, canvas movement, or attention-drawing motion is present:

- inspect `prefers-reduced-motion` behavior;
- ensure motion can be reduced without losing critical information;
- avoid essential workflow dependence on animation timing.

Apps with no material motion should record that fact rather than manufacture a reduced-motion test case.

### 6.6 Critical visual alternatives

Complex visual information must have an accessible non-visual path to the relevant meaning.

This is especially important for:

- LayerForge canvas/layer state;
- RedactReady Pro visual risk/evidence state;
- VariantVision Pro visual evidence/status displays;
- any chart, score, indicator, diagram, or visual-only state in the six apps.

The alternative may be direct labels, structured text, data tables, inspector content, summaries, or another semantically equivalent representation.

The audit should verify equivalence of the important claim/state, not merely the existence of generic alt text.

### 6.7 Forms, errors, loading, and completion

For primary workflows verify that:

- required fields and constraints are understandable;
- validation failures are associated with the relevant control or otherwise clearly exposed;
- status/loading changes do not disappear visually without semantic communication where the change matters;
- completion state is understandable without color or transient toast-only feedback.

### 6.8 Screen-reader / assistive-technology boundary

Automated accessibility trees, ARIA inspection, DOM snapshots, and browser accessibility APIs are useful evidence but **must not be described as genuine screen-reader testing**.

If no real assistive-technology runtime is available during implementation, issue #39 remains explicit that genuine AT testing is pending.

Preferred final manual validation on the user's Windows environment:

- NVDA;
- current Chrome or Edge;
- critical workflow for each flagship app or a documented risk-based subset if issue scope is later narrowed explicitly.

The manual record should include NVDA version, browser version, Windows version, workflow, observations, failures, and retest status.

Lack of NVDA evidence does not invalidate other completed audit dimensions, but it prevents claiming screen-reader validation and may prevent final issue closure if the acceptance criteria remain unchanged.

## 7. Automated tooling

The implementation plan should choose a maintained accessibility engine compatible with Playwright, preferably axe-core through an established Playwright integration or direct injection.

Automated scanning is a supplement to manual/behavioral review and must not become a single pass/fail score.

Automated output should preserve enough detail to reproduce a finding while avoiding noisy raw dumps in the public repository where a concise normalized record is sufficient.

At minimum retain:

- rule identifier;
- impact/severity reported by the scanner;
- affected target/selector or stable description;
- application/route/state;
- remediation status.

Scanner severity is input evidence, not the final portfolio severity classification.

## 8. Portfolio severity model

Use a consistent human-reviewed severity model:

### Critical

Blocks a primary workflow for a major accessibility mode or creates a severe loss of information/control with no reasonable alternative.

Examples: keyboard trap in a required workflow; critical action impossible without pointer and no alternative; modal state inaccessible and blocks recovery.

### High

Materially impairs a primary workflow, critical understanding, or safe completion for affected users, but a limited workaround may exist.

Examples: unlabeled primary controls; invisible focus through a major workflow; important errors unavailable programmatically; critical status encoded only by color.

### Medium

Meaningful accessibility defect outside the most critical path, or one that causes friction/confusion without blocking task completion.

### Low

Localized usability/accessibility polish with limited functional impact.

### Informational

Observation, enhancement opportunity, or documented boundary that does not represent a current defect.

Automated tool impact labels must be mapped through this model rather than copied mechanically.

## 9. Remediation policy

Before issue #39 can support a positive accessibility-review claim:

- all validated Critical findings must be corrected and retested;
- all validated High findings must be corrected and retested;
- Medium/Low findings may remain only if explicitly documented with rationale and known limitation;
- Informational findings may remain as documented context.

Each correction should be narrowly scoped and should add regression coverage when the behavior is stable and testable.

Do not perform unrelated visual redesign under the accessibility audit umbrella.

## 10. Evidence artifacts

The repository should contain a durable, dated audit package, provisionally:

- `docs/accessibility/README.md` — methodology and claim boundary;
- `docs/accessibility/AUDIT_MATRIX.md` — project/criterion/status matrix;
- `docs/accessibility/FINDINGS.md` — normalized findings and severities;
- `docs/accessibility/RETEST.md` — correction/retest ledger;
- `docs/accessibility/NVDA_MANUAL_CHECK.md` — genuine AT checklist/result boundary;
- machine-readable output under a generated/evidence subdirectory only where it adds reproducibility value.

Exact file names may be adjusted during implementation planning, but the information categories must remain distinct.

Public repository artifacts must not contain secrets, private browser data, user PII, or unrelated local environment data.

## 11. CI strategy

Accessibility regression checks should be split by purpose.

### Required durable CI

Add deterministic checks that catch regressions with acceptable runtime and stability, such as:

- automated axe scan of stable critical states/routes;
- critical accessible-name/role invariants;
- keyboard/focus behavior with stable interaction paths;
- reduced-motion invariants where relevant;
- targeted responsive/reflow assertions where they can be made deterministic.

### Audit-only/manual evidence

Do not force inherently visual/manual or unstable checks into a brittle blocking CI gate merely to satisfy a checkbox.

Examples that may remain audit evidence rather than permanent CI:

- manual contrast judgment for custom canvas rendering;
- genuine NVDA interaction;
- broad exploratory keyboard review;
- screenshot-only subjective assessment.

CI should protect known invariants, not pretend to automate human accessibility judgment.

## 12. Critical-flow selection

Implementation planning must define one primary critical workflow per application before tests are written.

The flow selection should favor the core employer-facing/product promise rather than incidental navigation.

Provisional examples:

- Portfolio Hub: entry -> project discovery -> open technical evidence/project detail.
- ProcessHarbor: input/source -> generate/transform -> review output -> export or completion state.
- RedactReady Pro: load sample/input -> inspect detection/evidence -> review redaction/risk -> report/export state.
- LayerForge Studio: create/open project -> manipulate meaningful layer/tool state -> inspect/export result, with explicit accessible alternative assessment for canvas-only behavior.
- ScamShield AI: provide/select suspicious-content input -> analyze -> inspect risk/explanation -> completion/export/reference state.
- VariantVision Pro: enter/select variant evidence -> inspect interpretation/evidence -> review source/status details.

These are design-level candidates. The implementation plan must validate each against current application behavior before codifying tests.

## 13. Execution phases

### Phase A — Baseline and harness

1. Freeze exact starting commit.
2. Define critical flow for each app from current behavior.
3. Add shared audit harness and audit configuration.
4. Add baseline automated scans and behavioral checks.
5. Record all findings before remediation.

### Phase B — Triage

1. Deduplicate overlapping scanner/manual findings.
2. Reproduce each candidate finding.
3. Assign portfolio severity.
4. Separate real defects from false positives, unsupported scanner assumptions, and informational boundaries.

### Phase C — Critical/High remediation

1. Write or strengthen regression coverage first where practical.
2. Apply smallest safe fix per finding or coherent finding cluster.
3. Run app-level verification.
4. Rerun shared audit checks.
5. Preserve before/after evidence in the findings/retest ledger.

### Phase D — Full retest and publication

1. Rerun all six app audits at exact final head.
2. Run repository lint/typecheck/tests/builds required by affected projects.
3. Verify canonical production deployment/source provenance after merge where deployment evidence is part of the final claim.
4. Publish dated audit matrix, findings, fixes, known limitations, and remaining AT boundary.

### Phase E — NVDA manual boundary

If genuine NVDA execution was unavailable in the automated environment:

1. leave the NVDA criterion explicitly pending;
2. provide exact manual walkthrough instructions;
3. record actual NVDA results only after genuine execution;
4. reopen/fix/retest any serious AT-specific defects discovered;
5. close #39 only when the issue's final acceptance criteria are truthfully satisfied or explicitly re-scoped by the owner.

## 14. TDD and verification discipline

For product code changes:

- reproduce the defect with the strongest practical automated regression before changing behavior when the finding is automatable;
- verify the regression fails for the intended reason;
- implement the minimal fix;
- verify the targeted regression and the relevant app test suite pass;
- run the shared audit again.

For findings that cannot be honestly automated, preserve a reproducible manual test case instead of adding a weak test that does not actually prove the behavior.

No fix is considered complete solely because an automated scanner becomes green.

## 15. Browser strategy

The current ChatGPT session does not expose the dedicated Browser plugin described by the frontend-testing workflow. The implementation should therefore use repository-native Playwright/GitHub Actions where available and a shared Playwright harness where needed.

This limitation must be recorded in the dated audit environment. It does not justify calling DOM-only evidence a complete rendered/manual audit.

Where screenshots or rendered evidence are needed, they should be captured through Playwright in a reproducible environment and kept only where they materially support a finding or retest record.

## 16. Pull request strategy

Keep the work reviewable rather than landing one giant opaque accessibility rewrite.

Recommended structure:

1. audit harness + baseline evidence PR;
2. one or more focused remediation PRs grouped by app or coherent finding cluster;
3. final audit/retest evidence PR.

If the baseline reveals only a small number of closely related findings, phases may be combined, but the evidence chronology must still distinguish baseline from remediation and retest.

## 17. Issue #39 acceptance mapping

The implementation and evidence package must map directly to the issue acceptance criteria:

- tested browser / OS / viewport / AT / commit / URL -> audit environment records;
- automated checks -> shared harness output;
- keyboard-only walkthroughs -> per-app critical-flow records;
- 200% zoom and narrow reflow -> per-app responsive evidence;
- contrast -> normalized finding/evidence records;
- severity -> portfolio severity model;
- Critical/High correction -> remediation and retest ledger;
- regression coverage -> app/shared tests;
- unresolved findings -> published limitations;
- claim wording -> methodology/README boundary.

The AT field must say `not yet tested with genuine screen reader` rather than being omitted or inferred from browser accessibility-tree inspection when NVDA has not actually run.

## 18. Success criteria

The automated/reproducible portion of #39 is successful when:

- all six scoped applications have dated baseline evidence;
- every candidate Critical/High issue is reproduced and adjudicated;
- every validated Critical/High issue is corrected and retested;
- durable regression checks protect the important automatable invariants;
- the final repository evidence states all remaining Medium/Low limitations;
- no unsupported WCAG/legal/screen-reader claim is introduced;
- the final head passes applicable repository quality gates;
- production evidence is source-SHA traceable where final public claims reference production behavior.

The entire issue is complete only when all unchanged issue acceptance criteria, including genuine assistive-technology evidence if still required, have been satisfied or explicitly re-scoped by the repository owner.

## 19. Non-goals

- formal WCAG certification;
- legal accessibility compliance opinion;
- adding accessibility libraries without demonstrated need;
- broad visual redesign unrelated to findings;
- manufacturing manual observations;
- treating axe/Lighthouse/ARIA inspection as screen-reader testing;
- forcing every exploratory/manual check into flaky CI;
- hiding unresolved Medium/Low limitations to produce a cleaner score.

## 20. Implementation guardrails

- Preserve application functionality and existing local-first/privacy boundaries.
- Prefer native HTML semantics over ARIA workarounds.
- Do not weaken security or data-validation controls for accessibility convenience.
- Do not alter deployment orchestration or bypass issue #38's guarded deployment authority.
- Do not spend Vercel quota merely for intermediate evidence when local/CI evidence is sufficient; production verification should be intentional and source-traceable.
- Do not merge baseline evidence that falsely implies remediation is already complete.
