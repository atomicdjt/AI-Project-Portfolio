# Genuine NVDA Manual Check

## Status

**Pending genuine NVDA execution.** Browser accessibility trees, ARIA inspection, axe-core, DOM snapshots, and Playwright automation are not recorded as screen-reader testing.

The current canonical production target for all six in-scope applications is provider-verified at source SHA `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2`. Repeat the provider/source check before the manual session if production changes first.

## Required environment record

Before each genuine run, record:

- Windows version;
- NVDA version;
- Chrome or Edge version;
- exact application production URL;
- exact repository/source SHA represented by that deployment;
- date/time;
- workflow exercised.

## Critical workflow checklist

### Portfolio Hub

Primary flow: entry -> project discovery -> technical evidence link

- [ ] Page title and major landmarks are announced coherently.
- [ ] Primary controls have understandable names, roles, and states.
- [ ] Reading/focus order supports the primary flow.
- [ ] Dynamic status, validation, error, and completion information is perceivable.
- [ ] Important visual evidence has an understandable non-visual path.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

### ProcessHarbor

Primary flow: SOP Builder -> source/intake -> generation -> reviewable document state

- [ ] Page title and major landmarks are announced coherently.
- [ ] Primary controls have understandable names, roles, and states.
- [ ] Reading/focus order supports the primary flow.
- [ ] Dynamic generation, validation, error, and completion information is perceivable.
- [ ] Generated document structure and important score/status information are understandable.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

### RedactReady Pro

Primary flow: input/sample -> sensitive-data analysis -> evidence/risk review -> report state

- [ ] Page title and major landmarks are announced coherently.
- [ ] Primary controls have understandable names, roles, and states.
- [ ] Reading/focus order supports the primary flow.
- [ ] Risk/score information is understandable without relying on visual bar width.
- [ ] Dynamic analysis, status, and completion information is perceivable.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

### LayerForge Studio

Primary flow: open editor -> meaningful layer/tool state -> inspect/export path

- [ ] Page title and major landmarks are announced coherently.
- [ ] Project, tool, layer, inspector, and export controls have understandable names, roles, and states.
- [ ] Reading/focus order supports the primary non-pointer workflow.
- [ ] Dialog/panel interactions preserve usable focus and recovery.
- [ ] Important canvas/layer state has an understandable non-visual path where supported.
- [ ] Any pointer/canvas limitation is recorded explicitly rather than hidden.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

### ScamShield AI

Primary flow: suspicious-content input -> analysis -> risk/explanation -> action/reference state

- [ ] Page title and major landmarks are announced coherently.
- [ ] Plain-language and caregiver mode controls have understandable names and states at narrow and desktop widths.
- [ ] Reading/focus order supports the primary flow.
- [ ] Risk, explanation, warning, error, and completion information is perceivable.
- [ ] Reporting/reference actions remain understandable.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

### VariantVision Pro

Primary flow: variant selection/input -> evidence interpretation -> source/status review

- [ ] Page title and major landmarks are announced coherently.
- [ ] Primary controls have understandable names, roles, and states.
- [ ] Reading/focus order supports variant selection and evidence review.
- [ ] Evidence scores are understandable without relying on visual bar width.
- [ ] Source/status, limitation, and research-boundary information is perceivable.
- [ ] Serious observations are recorded precisely enough to reproduce, then retested after correction.

## Result ledger

| Project | NVDA | Browser | Source SHA | Result | Serious observations | Retest |
| --- | --- | --- | --- | --- | --- | --- |
| Portfolio Hub | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |
| ProcessHarbor | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |
| RedactReady Pro | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |
| LayerForge Studio | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |
| ScamShield AI | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |
| VariantVision Pro | Pending | Pending | `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2` | Not tested | None recorded | Pending |

Do not change a row from **Not tested** until genuine NVDA execution occurred.
