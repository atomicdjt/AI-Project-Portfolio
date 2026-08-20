# Accessibility Review Evidence

## Baseline — remediation not yet applied

This directory records the reproducible baseline for issue #39 across six flagship applications. It is an evidence package, not a certification. No WCAG conformance, legal-compliance, universal-usability, or assistive-technology claim is inferred from automated browser results.

### Scope

- **Portfolio Hub** (`portfolio-hub`) — https://ai-project-portfolio-portfolio-hub.vercel.app/ — primary flow: entry -> project discovery -> technical evidence link
- **ProcessHarbor** (`processharbor`) — https://ai-project-portfolio-opspilot-ai-op.vercel.app/ — primary flow: SOP Builder -> source/intake -> generation -> reviewable document state
- **RedactReady Pro** (`redactready-pro`) — https://ai-project-portfolio-redactready-pr.vercel.app/ — primary flow: input/sample -> sensitive-data analysis -> evidence/risk review -> report state
- **LayerForge Studio** (`layerforge-studio`) — https://ai-project-portfolio-layerforge-stu.vercel.app/ — primary flow: open editor -> meaningful layer/tool state -> inspect/export path
- **ScamShield AI** (`scamshield-ai`) — https://ai-project-portfolio-scamshield-ai.vercel.app/ — primary flow: suspicious-content input -> analysis -> risk/explanation -> action/reference state
- **VariantVision Pro** (`variantvision-pro`) — https://ai-project-portfolio-variantvision.vercel.app/ — primary flow: variant selection/input -> evidence interpretation -> source/status review

### Evidence boundary

- Automated checks use Playwright Chromium and axe-core.
- Keyboard/focus, responsive reflow, a documented 200%-zoom-equivalent CSS viewport proxy, and reduced-motion preference are reproducible browser observations.
- Scanner impact is not copied directly into portfolio severity.
- Ambiguous browser heuristics remain marked for human triage.
- Assistive technology status: **not yet tested with genuine screen reader**.
- Genuine NVDA execution on Windows with Chrome or Edge remains a separate manual gate.
- Baseline findings are preserved even when unfavorable; remediation is documented only after a defect is reproduced and fixed.

### Recorded runs

- Run `32333101312` — source `fb73a0aa82cc756bf52f99ba10e86a2bfb6f33d4`; linux; chromium 148.0.7778.96; Playwright project `desktop-chromium`; observed 2026-08-20T04:47:18.863Z
- Run `32333101312` — source `fb73a0aa82cc756bf52f99ba10e86a2bfb6f33d4`; linux; chromium 148.0.7778.96; Playwright project `narrow-chromium`; observed 2026-08-20T04:47:39.251Z

### Baseline totals

- Audit records: **60**
- Candidate findings/observations requiring triage: **55**
- Applications in scope: **6**
- Audit categories: **5**

See [AUDIT_MATRIX.md](./AUDIT_MATRIX.md) for project/category coverage and [FINDINGS.md](./FINDINGS.md) for normalized candidates. [NVDA_MANUAL_CHECK.md](./NVDA_MANUAL_CHECK.md) defines the genuine assistive-technology boundary.
