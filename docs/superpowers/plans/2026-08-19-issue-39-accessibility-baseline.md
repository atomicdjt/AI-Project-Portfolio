# Issue #39 Accessibility Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reproducible six-application accessibility baseline harness, run it against the current canonical production surfaces, and publish normalized baseline findings without claiming remediation or genuine screen-reader validation.

**Architecture:** Add one root-level Playwright + axe harness that treats `config/vercel-projects.json` as canonical URL authority, normalizes results into a stable evidence schema, and uploads machine-readable artifacts from GitHub Actions. This plan intentionally stops after baseline triage; app-specific Critical/High remediation is a separate plan generated from observed findings so no fixes are invented before defects are reproduced.

**Tech Stack:** Node 22, npm workspaces, Playwright Chromium, `@axe-core/playwright`, Node `node:test`, GitHub Actions, Markdown + JSON evidence.

**Spec:** `docs/superpowers/specs/2026-08-19-issue-39-accessibility-audit-design.md`

## Global Constraints

- In scope: Portfolio Hub, ProcessHarbor, RedactReady Pro, LayerForge Studio, ScamShield AI, VariantVision Pro.
- Canonical production URLs come from `config/vercel-projects.json`; do not duplicate production URLs in multiple source files.
- Baseline evidence must record exact repository SHA, application id, URL, browser/runtime, viewport, audit category, and date/run identity.
- Browser/ARIA/axe evidence must never be labeled genuine screen-reader testing.
- Use `not yet tested with genuine screen reader` for the AT boundary until actual NVDA execution occurs.
- Do not claim WCAG conformance, certification, legal compliance, or universal accessibility.
- Do not change application product code in this baseline plan.
- Do not change Vercel deployment orchestration or issue #38 controls.
- Raw scanner severity is evidence only; final portfolio severity is Critical / High / Medium / Low / Informational after reproduction.
- Baseline findings must remain visible even if they are unfavorable.

---

### Task 1: Add root accessibility tooling and deterministic scripts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `scripts/accessibility/__tests__/projects.test.mjs`

**Interfaces:**
- Consumes: existing npm workspace graph and `config/vercel-projects.json`.
- Produces: root commands `a11y:test-config` and `a11y:baseline`; root Playwright/axe dependencies available to later tasks.

- [ ] **Step 1: Write the failing root-config test**

Create `scripts/accessibility/__tests__/projects.test.mjs` with a `node:test` assertion that imports `../projects.mjs` and expects exactly these ids in order:

```js
[
  'portfolio-hub',
  'processharbor',
  'redactready-pro',
  'layerforge-studio',
  'scamshield-ai',
  'variantvision-pro',
]
```

Also assert every project has a non-empty `productionUrl` beginning with `https://` and `assistiveTechnologyStatus === 'not yet tested with genuine screen reader'`.

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
node --test scripts/accessibility/__tests__/projects.test.mjs
```

Expected: FAIL because `scripts/accessibility/projects.mjs` does not exist.

- [ ] **Step 3: Add root tooling declarations**

Update `package.json` to add:

```json
"scripts": {
  "a11y:test-config": "node --test scripts/accessibility/__tests__/*.test.mjs",
  "a11y:baseline": "playwright test --config=playwright.accessibility.config.mjs"
},
"devDependencies": {
  "@axe-core/playwright": "^4.10.2",
  "@playwright/test": "^1.57.0"
}
```

Preserve all existing scripts and workspace entries.

Generate the matching lockfile with:

```bash
npm install --package-lock-only
```

Append these audit outputs to `.gitignore`:

```text
.accessibility-results
accessibility-playwright-report
```

- [ ] **Step 4: Commit dependency/config preparation**

```bash
git add package.json package-lock.json .gitignore scripts/accessibility/__tests__/projects.test.mjs
git commit -m "test(a11y): define flagship audit configuration contract"
```

---

### Task 2: Implement canonical flagship project registry

**Files:**
- Create: `scripts/accessibility/projects.mjs`
- Test: `scripts/accessibility/__tests__/projects.test.mjs`

**Interfaces:**
- Consumes: `config/vercel-projects.json`.
- Produces: `loadFlagshipProjects()` returning normalized project objects with `{ id, name, productionUrl, workspacePath, primaryFlow, assistiveTechnologyStatus }`.

- [ ] **Step 1: Implement the minimum registry**

`projects.mjs` must read `config/vercel-projects.json`, select the six ids, and map them to these primary-flow descriptions:

```js
const flowById = {
  'portfolio-hub': 'entry -> project discovery -> technical evidence link',
  processharbor: 'SOP Builder -> source/intake -> generation -> reviewable document state',
  'redactready-pro': 'input/sample -> sensitive-data analysis -> evidence/risk review -> report state',
  'layerforge-studio': 'open editor -> meaningful layer/tool state -> inspect/export path',
  'scamshield-ai': 'suspicious-content input -> analysis -> risk/explanation -> action/reference state',
  'variantvision-pro': 'variant selection/input -> evidence interpretation -> source/status review',
}
```

Set `assistiveTechnologyStatus` exactly to `not yet tested with genuine screen reader` for every entry.

Throw if any configured id is missing, inactive, or lacks a canonical production URL.

- [ ] **Step 2: Run the config test to verify GREEN**

```bash
npm run a11y:test-config
```

Expected: PASS.

- [ ] **Step 3: Commit registry implementation**

```bash
git add scripts/accessibility/projects.mjs scripts/accessibility/__tests__/projects.test.mjs
git commit -m "feat(a11y): derive flagship audit registry from canonical config"
```

---

### Task 3: Define normalized evidence schema and serializer

**Files:**
- Create: `scripts/accessibility/evidence.mjs`
- Create: `scripts/accessibility/__tests__/evidence.test.mjs`

**Interfaces:**
- Consumes: project registry objects and raw axe/behavior observations.
- Produces: `createAuditRecord(input)` and `writeAuditBundle(records, metadata)`.

- [ ] **Step 1: Write RED tests for evidence boundaries**

Test that `createAuditRecord()` requires:

```js
{
  projectId,
  productionUrl,
  sourceSha,
  browserName,
  browserVersion,
  operatingSystem,
  viewport,
  category,
  observedAt,
  result,
}
```

Assert it rejects a record whose `assistiveTechnology` value contains `NVDA tested`, `screen-reader passed`, or equivalent text unless `genuineAssistiveTechnology === true`.

Assert default AT output is exactly:

```text
not yet tested with genuine screen reader
```

- [ ] **Step 2: Verify RED**

```bash
npm run a11y:test-config
```

Expected: FAIL because `evidence.mjs` does not exist.

- [ ] **Step 3: Implement evidence helpers**

Use plain JSON-compatible objects. Normalize axe nodes to only:

```js
{
  ruleId,
  impact,
  help,
  target,
  htmlExcerpt,
  tags,
}
```

Limit `htmlExcerpt` to 240 characters to avoid noisy raw dumps.

`writeAuditBundle()` writes:

```text
.accessibility-results/baseline.json
```

with top-level fields `schemaVersion`, `sourceSha`, `runId`, `observedAt`, `environment`, `projects`, and `records`.

- [ ] **Step 4: Verify GREEN and commit**

```bash
npm run a11y:test-config
git add scripts/accessibility/evidence.mjs scripts/accessibility/__tests__/evidence.test.mjs
git commit -m "feat(a11y): normalize reproducible audit evidence"
```

---

### Task 4: Add Playwright + axe baseline scanner

**Files:**
- Create: `playwright.accessibility.config.mjs`
- Create: `tests/accessibility/flagship-baseline.spec.mjs`
- Create: `scripts/accessibility/axe.mjs`

**Interfaces:**
- Consumes: `loadFlagshipProjects()` and `createAuditRecord()`.
- Produces: one initial-state axe record plus environment metadata for each flagship app at desktop and narrow viewport.

- [ ] **Step 1: Create Playwright configuration**

Use:

```js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/accessibility',
  fullyParallel: false,
  reporter: [['list'], ['html', { outputFolder: 'accessibility-playwright-report', open: 'never' }]],
  outputDir: '.accessibility-results/test-results',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } },
    { name: 'narrow-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
})
```

- [ ] **Step 2: Implement axe helper**

`axe.mjs` exports `scanPage(page)` using `AxeBuilder({ page }).analyze()` and returns normalized violations only; do not convert scanner impact directly into portfolio severity.

- [ ] **Step 3: Add one test per project**

For each registry entry:

1. `page.goto(project.productionUrl, { waitUntil: 'networkidle' })`;
2. verify a non-empty document title and visible `body`;
3. run `scanPage(page)`;
4. record page URL, browser version, viewport, source SHA from `AUDIT_SOURCE_SHA`, OS from `process.platform`, and axe violations;
5. do **not** fail the baseline test merely because violations exist; fail only on harness/navigation/evidence corruption.

- [ ] **Step 4: Run the baseline scanner**

```bash
AUDIT_SOURCE_SHA=$(git rev-parse HEAD) npm run a11y:baseline -- --project=desktop-chromium
```

Expected: six project visits complete and evidence is written even when accessibility findings exist.

- [ ] **Step 5: Commit scanner**

```bash
git add playwright.accessibility.config.mjs tests/accessibility/flagship-baseline.spec.mjs scripts/accessibility/axe.mjs
git commit -m "feat(a11y): add six-app Playwright axe baseline scanner"
```

---

### Task 5: Add reproducible keyboard, focus, reflow, and motion observations

**Files:**
- Create: `scripts/accessibility/behavior.mjs`
- Create: `scripts/accessibility/__tests__/behavior.test.mjs`
- Modify: `tests/accessibility/flagship-baseline.spec.mjs`

**Interfaces:**
- Consumes: Playwright `page`.
- Produces: observations for focusability, visible focus, keyboard traps, horizontal overflow, 200%-zoom-equivalent viewport behavior, and reduced-motion preference.

- [ ] **Step 1: Write RED unit tests for pure helpers**

Test `classifyHorizontalOverflow({ scrollWidth, clientWidth })` returns `pass` when difference is <= 2 px and `review` otherwise.

Test `summarizeFocusSequence(sequence)` flags `no-focusable-control` for an empty sequence and `possible-cycle` only when the same short focus subsequence repeats without an intervening state change.

- [ ] **Step 2: Verify RED**

```bash
npm run a11y:test-config
```

Expected: FAIL because `behavior.mjs` does not exist.

- [ ] **Step 3: Implement behavior helpers and browser observations**

Add browser functions that:

- press `Tab` up to 30 times and record tag/role/name for each focused element;
- check that focused elements have a visible focus indicator by comparing computed outline/box-shadow/border state against the unfocused baseline where practical;
- record any element that receives focus but is outside the viewport;
- record document `scrollWidth` vs `clientWidth` at 1366x900, 390x844, and 683x450 as the documented 200%-zoom-equivalent proxy;
- emulate `prefers-reduced-motion: reduce` and record whether the page remains operable/rendered;
- label these as reproducible browser observations, not manual AT results.

- [ ] **Step 4: Extend each project baseline test**

Append categories:

```text
keyboard-focus
reflow-narrow
reflow-200-percent-proxy
reduced-motion
```

Do not auto-classify every overflow or focus-style heuristic as a defect; mark ambiguous output `requires human triage`.

- [ ] **Step 5: Run desktop + narrow baseline**

```bash
AUDIT_SOURCE_SHA=$(git rev-parse HEAD) npm run a11y:baseline
```

Expected: both Playwright projects complete and evidence includes all six apps.

- [ ] **Step 6: Commit behavior observations**

```bash
git add scripts/accessibility/behavior.mjs scripts/accessibility/__tests__/behavior.test.mjs tests/accessibility/flagship-baseline.spec.mjs
git commit -m "feat(a11y): capture keyboard focus reflow and motion evidence"
```

---

### Task 6: Add baseline evidence renderer and claim-safe documentation

**Files:**
- Create: `scripts/accessibility/render-baseline.mjs`
- Create: `docs/accessibility/README.md`
- Create: `docs/accessibility/AUDIT_MATRIX.md`
- Create: `docs/accessibility/FINDINGS.md`
- Create: `docs/accessibility/NVDA_MANUAL_CHECK.md`
- Create: `scripts/accessibility/__tests__/render-baseline.test.mjs`

**Interfaces:**
- Consumes: `.accessibility-results/baseline.json`.
- Produces: deterministic Markdown baseline evidence with no unsupported pass claim.

- [ ] **Step 1: Write RED renderer test**

Use a tiny fixture in memory containing one axe violation and one `requires human triage` keyboard observation. Assert rendered Markdown contains:

```text
Baseline — remediation not yet applied
not yet tested with genuine screen reader
```

and does not contain:

```text
WCAG compliant
screen-reader passed
fully accessible
```

- [ ] **Step 2: Verify RED**

```bash
npm run a11y:test-config
```

- [ ] **Step 3: Implement renderer**

`render-baseline.mjs` must generate:

- `AUDIT_MATRIX.md`: six rows × audit categories, with `Observed`, `Finding`, `Needs triage`, or `Not tested`;
- `FINDINGS.md`: one normalized candidate finding per axe/behavior item, stable finding id `<project>-<category>-<index>`, scanner impact, evidence, and `Portfolio severity: Untriaged`;
- `NVDA_MANUAL_CHECK.md`: exact Windows/NVDA/Chrome-or-Edge checklist and an empty result ledger whose status is `Pending genuine NVDA execution`;
- `README.md`: methodology, environment/source rules, and claim boundary.

- [ ] **Step 4: Verify renderer tests and commit**

```bash
npm run a11y:test-config
git add scripts/accessibility/render-baseline.mjs scripts/accessibility/__tests__/render-baseline.test.mjs docs/accessibility
git commit -m "docs(a11y): add claim-safe baseline evidence format"
```

---

### Task 7: Add non-blocking baseline audit workflow with artifacts

**Files:**
- Create: `.github/workflows/accessibility-baseline.yml`

**Interfaces:**
- Consumes: root audit scripts.
- Produces: GitHub Actions artifact `accessibility-baseline` containing JSON, Playwright report, screenshots/traces on failure, and rendered Markdown.

- [ ] **Step 1: Add workflow**

Trigger on `workflow_dispatch` and pull requests that touch:

```text
scripts/accessibility/**
tests/accessibility/**
playwright.accessibility.config.mjs
package.json
package-lock.json
docs/accessibility/**
.github/workflows/accessibility-baseline.yml
```

Use Node 22, `npm ci`, `npx playwright install --with-deps chromium`, then:

```bash
npm run a11y:test-config
AUDIT_SOURCE_SHA="$GITHUB_SHA" npm run a11y:baseline
node scripts/accessibility/render-baseline.mjs
```

Upload `.accessibility-results`, `accessibility-playwright-report`, and `docs/accessibility` with `if: always()`.

The workflow should fail for harness/runtime/test corruption but **not** because baseline accessibility findings exist.

- [ ] **Step 2: Commit workflow**

```bash
git add .github/workflows/accessibility-baseline.yml
git commit -m "ci(a11y): publish reproducible flagship baseline artifacts"
```

---

### Task 8: Run baseline, adjudicate candidate findings, and freeze remediation input

**Files:**
- Modify: `docs/accessibility/AUDIT_MATRIX.md`
- Modify: `docs/accessibility/FINDINGS.md`
- Modify: `docs/accessibility/README.md`
- Modify: `docs/accessibility/NVDA_MANUAL_CHECK.md`
- Modify: issue `#39` comment/status only; do not close.

**Interfaces:**
- Consumes: fresh GitHub Actions baseline artifact from the exact branch head.
- Produces: a frozen, reproducible candidate-finding set for the remediation plan.

- [ ] **Step 1: Run the workflow on the exact baseline head**

Record workflow run id, commit SHA, Chromium version, runner OS, and observed timestamp.

- [ ] **Step 2: Inspect every Critical/Serious axe candidate and every keyboard/reflow candidate**

For each candidate, mark exactly one:

```text
Validated defect
False positive
Informational boundary
Requires manual reproduction before severity
```

Do not assign portfolio severity solely from axe impact.

- [ ] **Step 3: Assign portfolio severity to reproduced defects**

Use only the spec model: Critical / High / Medium / Low / Informational.

Each Critical or High entry must include a concrete reproduction state and affected primary workflow before Plan 2 is written.

- [ ] **Step 4: Publish baseline evidence**

Update the Markdown files with the exact run metadata and adjudicated candidate status. Preserve all unresolved Medium/Low findings and the NVDA pending boundary.

- [ ] **Step 5: Verify documentation claims**

Run:

```bash
npm run check:docs
npm run a11y:test-config
```

Search the committed accessibility docs for forbidden unsupported wording:

```bash
grep -RniE 'WCAG compliant|fully accessible|screen-reader passed|NVDA passed' docs/accessibility && exit 1 || true
```

- [ ] **Step 6: Commit baseline evidence**

```bash
git add docs/accessibility
git commit -m "docs(a11y): publish six-app accessibility baseline"
```

- [ ] **Step 7: Update issue #39 without closing it**

Post the exact baseline commit/run, count of validated Critical/High/Medium/Low findings, and state explicitly that remediation and genuine NVDA execution remain separate gates.

---

## Plan 1 Completion Gate

Plan 1 is complete only when all of the following are true:

- the six-app registry is derived from canonical config;
- the root test suite proves the evidence/claim boundaries;
- the Playwright + axe baseline runs successfully against all six canonical production URLs;
- keyboard/focus, narrow reflow, 200%-zoom-equivalent proxy, and reduced-motion evidence are captured;
- baseline evidence is published with exact run/source metadata;
- candidate findings are human-adjudicated rather than copied directly from scanner severity;
- every validated Critical/High finding has a reproducible state;
- issue #39 remains open;
- the NVDA status remains explicitly pending unless genuine NVDA testing actually occurred.

After this gate, create **Plan 2 — Critical/High Remediation** using only the validated findings from `docs/accessibility/FINDINGS.md`. Do not pre-write fixes for findings that the baseline did not reproduce.