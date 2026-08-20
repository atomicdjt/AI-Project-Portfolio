# Accessibility Review Evidence

## Baseline — remediation not yet applied

This directory records the dated, reproducible baseline for issue #39 across six flagship applications. It is an evidence package, not a certification or legal-compliance opinion.

## Scope

- **Portfolio Hub** (`portfolio-hub`) — entry -> project discovery -> technical evidence link
- **ProcessHarbor** (`processharbor`) — SOP Builder -> source/intake -> generation -> reviewable document state
- **RedactReady Pro** (`redactready-pro`) — input/sample -> sensitive-data analysis -> evidence/risk review -> report state
- **LayerForge Studio** (`layerforge-studio`) — open editor -> meaningful layer/tool state -> inspect/export path
- **ScamShield AI** (`scamshield-ai`) — suspicious-content input -> analysis -> risk/explanation -> action/reference state
- **VariantVision Pro** (`variantvision-pro`) — variant selection/input -> evidence interpretation -> source/status review

Canonical URLs and provider-verified deployment identities are recorded in [PRODUCTION_TARGETS.json](./PRODUCTION_TARGETS.json).

## Frozen baseline run

- GitHub Actions run: `32334523191` (`Accessibility Baseline` run #16)
- Audit-harness SHA: `9d7459254a69d19015566ab2c79ff18d21fae1ae`
- Tested production source SHA: `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2`
- Production state: all six canonical aliases resolved to provider-verified `READY` production deployments on 2026-08-20
- Runner OS: Linux
- Browser: Chromium `148.0.7778.96`
- Playwright projects: desktop Chromium and narrow Chromium
- Desktop viewport: `1366x900`
- Narrow viewport: `390x844`
- 200%-zoom-equivalent layout proxy: `683x450`
- Audit records: **60**
- Raw axe candidate nodes: **41**
- Validated root findings after deduplication/reproduction: **14**
- Severity distribution: **0 Critical, 5 High, 7 Medium, 2 Low**

The artifact for run `32334523191` preserves the raw schema-v2 JSON bundles, Playwright report, and rendered audit documents. Each raw record separately identifies the production source SHA and the audit-harness SHA.

## Reproducible observations

- All six applications completed automated axe scanning in desktop and narrow Chromium.
- All six completed deterministic keyboard/focus probing after smooth scrolling was disabled for geometry sampling.
- Corrected keyboard runs recorded **zero off-screen-focus observations** across every app/viewport pass.
- Visible-focus review remained reproducible for Portfolio Hub, ProcessHarbor, LayerForge Studio, and VariantVision Pro and was adjudicated against source CSS.
- Narrow document-level reflow passed for five applications. VariantVision Pro measured `scrollWidth=690` against `clientWidth=390`.
- The documented 683px layout proxy passed for five applications. VariantVision Pro remained 690px wide against a 683px client width.
- Reduced-motion preference emulation rendered operably for all six applications in both Playwright projects.

## Evidence boundary

- Automated checks supplement rather than replace behavioral/manual review.
- Scanner impact is not copied directly into portfolio severity.
- Duplicate desktop/mobile scanner nodes are consolidated into root-cause remediation units in [FINDINGS.md](./FINDINGS.md).
- Browser accessibility APIs, DOM semantics, axe, and Playwright are not described as genuine screen-reader testing.
- Assistive-technology status remains **not yet tested with genuine screen reader**.
- Genuine NVDA + Chrome/Edge validation remains a separate manual gate documented in [NVDA_MANUAL_CHECK.md](./NVDA_MANUAL_CHECK.md).
- The `683x450` check is a reproducible 200%-zoom-equivalent **layout proxy**, not actual browser page zoom. Actual 200% browser-zoom evidence remains a separate final/manual criterion unless a trustworthy browser-level automation path is added.
- Baseline findings remain visible even when unfavorable; remediation and retest will be recorded separately.

## Current result

Plan 1 established a reproducible baseline and adjudicated the scanner/behavior output into 14 validated product findings. No Critical portfolio-level defect was validated. Five High findings must be corrected and retested before any positive accessibility-review claim is appropriate; the authorized remediation pass will also correct the Medium/Low scanner-serious defects where practical.

See:

- [AUDIT_MATRIX.md](./AUDIT_MATRIX.md) — project/category result matrix
- [FINDINGS.md](./FINDINGS.md) — consolidated root findings, evidence, and severities
- [PRODUCTION_TARGETS.json](./PRODUCTION_TARGETS.json) — provider-verified production provenance
- [NVDA_MANUAL_CHECK.md](./NVDA_MANUAL_CHECK.md) — genuine assistive-technology checklist and pending boundary
