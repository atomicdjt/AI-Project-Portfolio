# Accessibility Baseline Findings

## Baseline disposition

This ledger consolidates duplicate scanner nodes and viewport repeats into root-cause findings. It records the current canonical production surfaces, whose provider-verified source is `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2`. Scanner impact is supporting evidence only; portfolio severity follows the issue #39 severity model.

**Remediation has not yet been applied.** Genuine assistive-technology status remains **not yet tested with genuine screen reader**.

Validated root findings: **14** — Critical **0**, High **5**, Medium **7**, Low **2**.

## Validated findings

### A11Y-01 — Portfolio Hub project-browser controls suppress visible keyboard focus

- Project: `portfolio-hub`
- Portfolio severity: **High**
- Evidence sources: keyboard-focus baseline; source inspection
- Affected primary flow: project discovery and filtering
- Reproduction: keyboard-focus the project search input, audience filter, or status filter. Later CSS rules set `outline: 0` on `.search-field input` and `.filters select`, overriding the global `:focus-visible` treatment.
- Impact: keyboard users can operate the controls but lose a reliable visible indication of which major project-browser control has focus.
- Remediation requirement: restore a clearly visible focus indicator for all three controls and add regression coverage.
- Status: **Validated defect — remediation required**

### A11Y-02 — RedactReady Pro risk score bars lack valid programmatic value semantics

- Project: `redactready-pro`
- Portfolio severity: **High**
- Evidence sources: axe `aria-prohibited-attr`; focused Chromium diagnostic; source inspection
- Affected primary flow: evidence/risk review
- Reproduction: each `.score-meter` is a generic `div` with an `aria-label`, no semantic value role, no `aria-valuenow`, and no textual numeric value. Examples include Privacy Exposure 100 and Administrative Risk 48.
- Impact: the numeric risk value is encoded visually through bar width while the attempted ARIA label is invalid on the roleless generic element.
- Remediation requirement: expose the value with valid native/ARIA semantics or an equivalent textual representation; preserve the visual bar as presentation.
- Status: **Validated defect — remediation required**

### A11Y-03 — ScamShield mobile mode toggles lose their accessible names

- Project: `scamshield-ai`
- Portfolio severity: **High**
- Evidence sources: axe `label` with critical scanner impact; focused Chromium diagnostic; source inspection
- Affected primary flow: global accessibility/caregiver mode controls
- Reproduction at 390px: `.mode-toggle span` becomes `display: none`. Both checkbox inputs have no `aria-label` or `aria-labelledby`; the remaining icon and switch decoration are hidden from assistive technology.
- Controls affected: `Plain-language mode`, `Caregiver mode`.
- Impact: users relying on programmatic control names cannot identify what either checkbox changes on the mobile layout.
- Remediation requirement: preserve a programmatic accessible name independent of responsive visual-label hiding and test both mobile controls.
- Status: **Validated defect — remediation required**

### A11Y-04 — VariantVision evidence score bars lack valid programmatic value semantics

- Project: `variantvision-pro`
- Portfolio severity: **High**
- Evidence sources: axe `aria-prohibited-attr`; focused Chromium diagnostic; source inspection
- Affected primary flow: evidence interpretation/status review
- Reproduction: each `.score-meter` is a generic `div` with an `aria-label`, no semantic value role, no `aria-valuenow`, and no textual numeric value. Current examples include Normalization 94, Population frequency 100, Curated database review 55, Protein/structure context 100, and Literature handoff 88.
- Impact: evidence scores are visually encoded by bar width without a valid programmatic value representation.
- Remediation requirement: use valid value semantics or equivalent text, with regression coverage for the full score set.
- Status: **Validated defect — remediation required**

### A11Y-05 — VariantVision primary workbench has document-wide narrow-screen overflow

- Project: `variantvision-pro`
- Portfolio severity: **High**
- Evidence sources: narrow reflow baseline; 200%-zoom-equivalent proxy; focused Chromium geometry diagnostic
- Affected primary flow: entire evidence workbench
- Reproduction at 390x844: document `clientWidth=390`, `scrollWidth=690`. The main workspace/page stack and multiple panels render about 674px wide, with inner content around 640px. The same 690px document width also exceeds the 683px 200%-zoom-equivalent proxy.
- Impact: primary workbench content extends materially outside the viewport rather than reflowing or containing wide content locally.
- Remediation requirement: remove unintended min-content/grid width propagation while retaining intentional local scrolling for truly tabular content; retest at 390px and the documented 683px proxy.
- Status: **Validated defect — remediation required**

### A11Y-06 — ProcessHarbor document-library search suppresses visible keyboard focus

- Project: `processharbor`
- Portfolio severity: **Medium**
- Evidence sources: keyboard-focus baseline; source inspection
- Affected workflow: document discovery within the operations library
- Reproduction: `.search-box input` uses a later `outline: 0` rule that overrides the global input `:focus-visible` outline.
- Impact: keyboard users can search but receive inadequate visible focus feedback on the library search field.
- Remediation requirement: restore an explicit focus-visible treatment on the input or its focus-within container.
- Status: **Validated defect — remediation required**

### A11Y-07 — LayerForge Recent-project select suppresses visible keyboard focus

- Project: `layerforge-studio`
- Portfolio severity: **Medium**
- Evidence sources: keyboard-focus baseline; source inspection
- Affected workflow: project/recent selection
- Reproduction: `.recent-select select, .select-control select` set `outline: 0` after the global `select:focus-visible` rule.
- Impact: a meaningful project-selection control can be keyboard-focused without the intended visible focus ring.
- Remediation requirement: restore visible focus for the Recent select and the shared select-control pattern.
- Status: **Validated defect — remediation required**

### A11Y-08 — RedactReady Pro session-status strip is horizontally scrollable but not keyboard-scrollable

- Project: `redactready-pro`
- Portfolio severity: **Medium**
- Evidence sources: axe `scrollable-region-focusable`; focused Chromium diagnostic
- Reproduction at 390px: `.session-status` has `clientWidth=241`, `scrollWidth=443`, `overflow-x:auto`, and `tabIndex=-1`.
- Content affected: `Local session`, `No external API`, `In-memory review`.
- Impact: status/trust information extends into a scrollable region that cannot itself receive keyboard focus for horizontal scrolling.
- Remediation requirement: preferably reflow/wrap the short status labels at narrow widths; if scrolling remains necessary, make the region keyboard-operable and meaningfully labeled.
- Status: **Validated defect — remediation required**

### A11Y-09 — ScamShield footer source link has insufficient contrast on the dark footer

- Project: `scamshield-ai`
- Portfolio severity: **Medium**
- Evidence sources: axe `color-contrast`; rendered-color diagnostic
- Rendered colors: link `#1d5f8a` on footer `#082c3f`
- Measured contrast: approximately **2.12:1**
- Affected content: `Source: github.com/atomicdjt`
- Impact: supporting source/evidence navigation is difficult to read against the footer background.
- Remediation requirement: use a lighter link color that clears normal-text contrast while preserving the visual hierarchy.
- Status: **Validated defect — remediation required**

### A11Y-10 — VariantVision case-search input suppresses visible keyboard focus

- Project: `variantvision-pro`
- Portfolio severity: **Medium**
- Evidence sources: keyboard-focus baseline; source inspection
- Affected workflow: case discovery/selection
- Reproduction: `.search-box input` sets `outline: 0` after the global input `:focus-visible` rule.
- Impact: keyboard users can search cases but do not receive the intended visible focus indication.
- Remediation requirement: restore a visible focus treatment for case search.
- Status: **Validated defect — remediation required**

### A11Y-11 — VariantVision selected-case shorthand has very low contrast

- Project: `variantvision-pro`
- Portfolio severity: **Medium**
- Evidence sources: axe `color-contrast`; rendered-color diagnostic
- Rendered colors: shorthand text `#e1b85f` on active-case background `#f4fbf8`
- Measured contrast: approximately **1.78:1**
- Current text size/weight: 12px / 900
- Impact: the selected case's compact variant identifier is difficult to read even though it is meaningful context for the active case.
- Remediation requirement: choose an active-state shorthand color with adequate contrast while preserving selected-state distinction.
- Status: **Validated defect — remediation required**

### A11Y-12 — VariantVision live-fetch action has insufficient text contrast

- Project: `variantvision-pro`
- Portfolio severity: **Medium**
- Evidence sources: axe `color-contrast`; rendered-color diagnostic
- Rendered colors: white text `#ffffff` on `#19b8aa`
- Measured contrast: approximately **2.48:1**
- Current text size/weight: 12.8px / 700
- Impact: the supplemental live-source fetch action is difficult to read.
- Remediation requirement: darken the button background or use an appropriately contrasting text/background pair and preserve hover contrast.
- Status: **Validated defect — remediation required**

### A11Y-13 — Portfolio Hub secondary card metadata narrowly misses normal-text contrast

- Project: `portfolio-hub`
- Portfolio severity: **Low**
- Evidence sources: axe `color-contrast`; rendered-color diagnostic
- Rendered colors: `#6b7a80` on white
- Measured contrast: approximately **4.45:1**
- Current text size/weight: 12.48px / 400
- Repeated content includes `Technical flagship`, `Best role alignment`, `Transfer-ready product`, and `Shipped commercial package`.
- Impact: localized secondary metadata is slightly below the normal-text threshold.
- Remediation requirement: minimally darken the metadata color and retest both desktop and narrow layouts.
- Status: **Validated defect — remediation required**

### A11Y-14 — ScamShield inactive step label narrowly misses normal-text contrast

- Project: `scamshield-ai`
- Portfolio severity: **Low**
- Evidence sources: axe `color-contrast`; rendered-color diagnostic
- Rendered colors: `#6a7b82` on white
- Measured contrast: approximately **4.40:1**
- Current text size/weight: 13px / 700
- Example affected state: inactive `2 Evidence` step.
- Impact: inactive workflow-step text is slightly below the normal-text threshold.
- Remediation requirement: minimally darken the inactive-step foreground while preserving active/complete state hierarchy.
- Status: **Validated defect — remediation required**

## Duplicate-candidate consolidation

The original generated baseline contained 55 candidate sections because the same underlying DOM defects were often emitted for multiple nodes and both desktop/narrow Playwright projects. The 14 findings above are the root-cause remediation units; duplicated viewport/node observations remain available in the immutable GitHub Actions artifacts.

## Harness finding resolved before freeze

The first keyboard probe reported numerous `off-screen focus` observations in Portfolio Hub and ScamShield. Source review showed both applications use smooth scrolling, while the probe sampled element geometry immediately after `Tab`. The harness was corrected to disable smooth scrolling during deterministic focus geometry and to allow a brief focus-settle interval. Those old off-screen counts are therefore **not treated as product defects**. The final baseline artifact must use the corrected probe before this ledger is frozen.

## Remaining manual boundaries

- Genuine NVDA + Chrome/Edge execution has not occurred and remains a separate manual gate.
- The 683x450 check is explicitly a reproducible **200%-zoom-equivalent layout proxy**, not actual browser zoom.
- Broad exploratory keyboard walkthroughs and genuine assistive-technology behavior remain distinct from automated focus/ARIA evidence.

## Remediation gate

Plan 2 must correct and retest every validated **High** finding. Because the user authorized fixing all serious issues found, Plan 2 should also correct the validated Medium/Low scanner-serious contrast and focus findings above rather than leaving avoidable defects in place. No finding may be marked remediated until the relevant regression/retest evidence is green.
