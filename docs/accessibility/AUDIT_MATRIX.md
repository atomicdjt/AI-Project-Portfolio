# Accessibility Audit Matrix

Baseline source: canonical production deployments from `cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2`, audited by GitHub Actions run `32334523191` with harness `9d7459254a69d19015566ab2c79ff18d21fae1ae`.

**Remediation not yet applied.** `Finding` means a validated defect is associated with that category; `Observed` means the reproducible baseline did not validate a defect in that category. Genuine screen-reader execution remains pending for every project.

| Project | Automated semantics / axe | Keyboard & focus | Narrow reflow 390px | 200%-proxy 683px | Reduced motion | Contrast evidence | Genuine AT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Portfolio Hub** | Finding — metadata contrast | Finding — project search + filters lose visible focus | Observed | Observed | Observed | Finding — card metadata ~4.45:1 | Pending |
| **ProcessHarbor** | Observed | Finding — library search loses visible focus | Observed | Observed | Observed | No scanner contrast finding in baseline | Pending |
| **RedactReady Pro** | Finding — invalid score-meter value semantics; mobile status-scroll region | Observed in general tab sequence | Observed at document level | Observed at document level | Observed | No scanner contrast finding in baseline | Pending |
| **LayerForge Studio** | Observed | Finding — Recent/shared selects lose visible focus | Observed | Observed | Observed | No scanner contrast finding in baseline | Pending |
| **ScamShield AI** | Finding — mobile toggle labels; contrast | Observed after smooth-scroll harness correction | Observed | Observed | Observed | Finding — footer ~2.12:1; inactive step ~4.40:1 | Pending |
| **VariantVision Pro** | Finding — invalid score-meter value semantics; contrast | Finding — case search loses visible focus | Finding — 690px document / 390px client | Finding — 690px document / 683px client | Observed | Finding — active shorthand ~1.78:1; live-fetch ~2.48:1 | Pending |

## Severity summary

| Severity | Count | Finding IDs |
| --- | ---: | --- |
| Critical | 0 | None validated |
| High | 5 | A11Y-01 through A11Y-05 |
| Medium | 7 | A11Y-06 through A11Y-12 |
| Low | 2 | A11Y-13 through A11Y-14 |

## Environment and evidence notes

- Browser: Chromium `148.0.7778.96` on Linux.
- Desktop viewport: `1366x900`.
- Narrow viewport: `390x844`.
- Reproducible layout proxy: `683x450`, representing the CSS layout width expected from halving the 1366px desktop width; it is not actual browser page zoom.
- Raw audit output: 60 records across 6 applications × 5 categories × 2 Playwright projects.
- Automated axe output: 41 candidate nodes before duplicate/root-cause consolidation.
- Smooth-scrolling geometry noise in the original keyboard probe was corrected before the frozen run; the frozen run recorded zero off-screen-focus observations.
- The validated defects and source-level reproduction notes are in [FINDINGS.md](./FINDINGS.md).
- Actual browser 200% zoom and genuine NVDA interaction remain explicit final/manual evidence boundaries unless trustworthy browser-level automation is added.
