# Issue #39 High-Severity Accessibility Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct and regression-test all five validated High accessibility findings from the six-app baseline without redesigning the products.

**Architecture:** Add a branch-code Playwright regression suite that starts the four affected Vite applications locally and verifies the exact accessibility behaviors that failed in production. Keep product changes minimal: restore focus indication in Portfolio Hub, add valid meter semantics in RedactReady Pro and VariantVision, preserve mobile checkbox names in ScamShield, and contain VariantVision intrinsic-width propagation so document-level reflow succeeds while wide tables remain locally scrollable.

**Tech Stack:** React 19, TypeScript/JavaScript, Vite, Playwright Chromium, existing root npm workspaces and GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-19-issue-39-accessibility-audit-design.md`

## Global Constraints

- Fix validated High findings A11Y-01 through A11Y-05 before any positive accessibility claim.
- Preserve existing visual/product behavior except where an accessibility correction requires a visible focus or reflow change.
- Browser/ARIA/axe evidence must not be described as genuine screen-reader testing.
- Genuine NVDA + Chrome/Edge remains a separate manual gate.
- The 683x450 check remains a documented 200%-zoom-equivalent layout proxy, not actual browser page zoom.
- No Vercel deployment orchestration or issue #38 controls may be changed.
- A finding is not marked remediated until its branch regression and later production retest are green.

---

### Task 1: Add branch-code High-finding regression harness

**Files:**
- Create: `playwright.accessibility-remediation.config.mjs`
- Create: `tests/accessibility-remediation/high-findings.spec.mjs`
- Create: `.github/workflows/accessibility-remediation.yml`
- Modify: `package.json`

**Interfaces:**
- Consumes: fixed Vite development ports already declared by the four workspaces: ScamShield `5178`, Portfolio Hub `5180`, RedactReady Pro `5181`, VariantVision `5182`.
- Produces: root command `npm run a11y:remediation`, which starts the four apps through Playwright `webServer` entries and executes Chromium regression tests against branch code.

- [ ] **Step 1: Add the failing browser tests before product fixes**

The suite must contain these exact behavior checks:

```js
import { expect, test } from '@playwright/test'

const urls = {
  portfolio: 'http://127.0.0.1:5180',
  redactready: 'http://127.0.0.1:5181',
  scamshield: 'http://127.0.0.1:5178',
  variantvision: 'http://127.0.0.1:5182',
}

async function computedFocusIndicator(locator) {
  await locator.focus()
  await locator.page().keyboard.press('Shift+Tab')
  await locator.page().keyboard.press('Tab')
  return locator.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    }
  })
}

test('A11Y-01 Portfolio Hub project-browser controls expose a visible focus indicator', async ({ page }) => {
  await page.goto(urls.portfolio)
  const controls = [
    page.locator('.search-field input'),
    page.locator('.filters select').nth(0),
    page.locator('.filters select').nth(1),
  ]

  for (const control of controls) {
    const indicator = await computedFocusIndicator(control)
    const outlined = indicator.outlineStyle !== 'none' && Number.parseFloat(indicator.outlineWidth) >= 2
    const shadowed = indicator.boxShadow !== 'none'
    expect(outlined || shadowed).toBe(true)
  }
})

test('A11Y-02 RedactReady score bars expose valid meter values', async ({ page }) => {
  await page.goto(urls.redactready)
  const meters = page.getByRole('meter')
  expect(await meters.count()).toBeGreaterThan(0)
  for (let index = 0; index < await meters.count(); index += 1) {
    const meter = meters.nth(index)
    expect(await meter.getAttribute('aria-valuemin')).toBe('0')
    expect(await meter.getAttribute('aria-valuemax')).toBe('100')
    const value = Number(await meter.getAttribute('aria-valuenow'))
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(100)
    await expect(meter).toHaveAccessibleName(/score/i)
  }
})

test('A11Y-03 ScamShield mobile mode toggles retain accessible names', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(urls.scamshield)
  await expect(page.getByRole('checkbox', { name: 'Plain-language mode' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: 'Caregiver mode' })).toBeVisible()
})

test('A11Y-04 VariantVision evidence bars expose valid meter values', async ({ page }) => {
  await page.goto(urls.variantvision)
  const meters = page.getByRole('meter')
  expect(await meters.count()).toBeGreaterThan(0)
  for (let index = 0; index < await meters.count(); index += 1) {
    const meter = meters.nth(index)
    expect(await meter.getAttribute('aria-valuemin')).toBe('0')
    expect(await meter.getAttribute('aria-valuemax')).toBe('100')
    const value = Number(await meter.getAttribute('aria-valuenow'))
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(100)
    await expect(meter).toHaveAccessibleName(/score/i)
  }
})

test('A11Y-05 VariantVision contains wide content locally at narrow and zoom-proxy widths', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 683, height: 450 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto(urls.variantvision)
    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      localWideRegion: [...document.querySelectorAll('.table-wrap')].some(
        (element) => element.scrollWidth > element.clientWidth + 1,
      ),
    }))
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1)
    expect(geometry.localWideRegion).toBe(true)
  }
})
```

- [ ] **Step 2: Add the Playwright configuration**

Use one Chromium project, one worker, and four `webServer` entries:

```js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/accessibility-remediation',
  timeout: 45_000,
  workers: 1,
  use: { browserName: 'chromium', headless: true },
  webServer: [
    { command: 'npm run dev --workspace apps/scamshield-ai', url: 'http://127.0.0.1:5178', reuseExistingServer: false, timeout: 120_000 },
    { command: 'npm run dev --workspace apps/portfolio-hub', url: 'http://127.0.0.1:5180', reuseExistingServer: false, timeout: 120_000 },
    { command: 'npm run dev --workspace apps/redactready-pro-hri-os', url: 'http://127.0.0.1:5181', reuseExistingServer: false, timeout: 120_000 },
    { command: 'npm run dev --workspace apps/variantvision-pro', url: 'http://127.0.0.1:5182', reuseExistingServer: false, timeout: 120_000 },
  ],
})
```

- [ ] **Step 3: Add the root command and CI workflow**

Add `"a11y:remediation": "playwright test --config=playwright.accessibility-remediation.config.mjs"` to root scripts. The workflow must run on pull requests touching the four apps, remediation tests/config, root package files, or itself; install with `npm ci`; install Chromium; run `npm run a11y:remediation`; upload the Playwright report on failure.

- [ ] **Step 4: Verify RED**

Open/update the remediation PR so GitHub Actions executes the new workflow before product fixes. Expected: the High-finding regression workflow fails because A11Y-01 through A11Y-05 are still represented by current branch code. Record the failing job/run before implementation.

- [ ] **Step 5: Commit**

Commit message: `test(a11y): lock high-severity regressions`

---

### Task 2: Fix A11Y-01 Portfolio Hub focus visibility

**Files:**
- Modify: `apps/portfolio-hub/src/styles.css`
- Test: `tests/accessibility-remediation/high-findings.spec.mjs`

**Interfaces:**
- Consumes: existing global `:focus-visible` palette `#075e56`.
- Produces: visible focus for `.search-field input` and both `.filters select` controls.

- [ ] **Step 1: Remove the later outline suppression**

Change:

```css
.search-field input,
.filters select {
  border: 0;
  outline: 0;
  background: transparent;
}
```

to:

```css
.search-field input,
.filters select {
  border: 0;
  background: transparent;
}
```

Keep the select's later visible border rule unchanged. Add a container-level search treatment so the entire search affordance is obvious:

```css
.search-field:focus-within {
  border-color: #075e56;
  box-shadow: 0 0 0 3px rgba(7, 94, 86, 0.18);
}
```

- [ ] **Step 2: Run the focused browser regression**

Run: `npm run a11y:remediation -- --grep A11Y-01`
Expected: PASS.

- [ ] **Step 3: Commit**

Commit message: `fix(a11y): restore portfolio filter focus`

---

### Task 3: Fix A11Y-02 and A11Y-04 score semantics

**Files:**
- Modify: `apps/redactready-pro-hri-os/src/app/App.tsx`
- Modify: `apps/variantvision-pro/src/app/App.tsx`
- Test: `tests/accessibility-remediation/high-findings.spec.mjs`

**Interfaces:**
- Consumes: existing numeric score values in the `0..100` range.
- Produces: role `meter` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=<score>`, and a stable accessible name ending in `score`; existing visual `<i>` fill remains presentation-only.

- [ ] **Step 1: Replace invalid roleless ARIA in RedactReady**

Use:

```tsx
<div
  className="score-meter"
  role="meter"
  aria-label={`${score.category} score`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={score.score}
  aria-valuetext={`${score.score} out of 100`}
>
  <i aria-hidden="true" style={{ width: `${score.score}%` }} />
</div>
```

- [ ] **Step 2: Replace invalid roleless ARIA in VariantVision**

Use:

```tsx
<div
  className="score-meter"
  role="meter"
  aria-label={`${metric.label} score`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={metric.score}
  aria-valuetext={`${metric.score} out of 100`}
>
  <i aria-hidden="true" style={{ width: `${metric.score}%` }} />
</div>
```

- [ ] **Step 3: Run focused browser regressions**

Run: `npm run a11y:remediation -- --grep 'A11Y-02|A11Y-04'`
Expected: PASS.

- [ ] **Step 4: Commit**

Commit message: `fix(a11y): expose score meter semantics`

---

### Task 4: Fix A11Y-03 ScamShield mobile control names

**Files:**
- Modify: `apps/scamshield-ai/src/components/layout/Header.tsx`
- Modify: `apps/scamshield-ai/src/test/app.test.tsx`
- Test: `tests/accessibility-remediation/high-findings.spec.mjs`

**Interfaces:**
- Consumes: existing checkbox state/actions.
- Produces: names `Plain-language mode` and `Caregiver mode` independent of whether responsive CSS hides the visible text span.

- [ ] **Step 1: Add a failing component regression**

Extend `app.test.tsx` with assertions that both checkboxes can be found by role and stable name.

- [ ] **Step 2: Add explicit checkbox names**

Use:

```tsx
<input aria-label="Plain-language mode" type="checkbox" checked={plainLanguage} onChange={(event) => setPlainLanguage(event.target.checked)} />
```

and:

```tsx
<input aria-label="Caregiver mode" type="checkbox" checked={caregiverMode} onChange={(event) => setCaregiverMode(event.target.checked)} />
```

- [ ] **Step 3: Run component and browser regressions**

Run: `npm test --workspace apps/scamshield-ai -- --run src/test/app.test.tsx`
Expected: PASS.

Run: `npm run a11y:remediation -- --grep A11Y-03`
Expected: PASS.

- [ ] **Step 4: Commit**

Commit message: `fix(a11y): preserve mobile mode names`

---

### Task 5: Fix A11Y-05 VariantVision document-wide overflow

**Files:**
- Modify: `apps/variantvision-pro/src/index.css`
- Test: `tests/accessibility-remediation/high-findings.spec.mjs`

**Interfaces:**
- Consumes: existing `.table-wrap { overflow-x: auto }` and `table { min-width: 640px }` local wide-content strategy.
- Produces: document width no greater than viewport at 390px and 683px while at least one table wrapper retains local horizontal scrolling.

- [ ] **Step 1: Break intrinsic-width propagation at grid/panel boundaries**

Add `min-width: 0` to the nested workbench containers that currently inherit the table's 640px min-content width:

```css
.workspace-primary,
.page-stack,
.inspector,
.panel,
.table-wrap {
  min-width: 0;
}
```

Keep `table { min-width: 640px }` and `.table-wrap { overflow-x: auto }` unchanged so tabular content scrolls locally rather than forcing the whole document wide.

- [ ] **Step 2: Run the focused reflow regression**

Run: `npm run a11y:remediation -- --grep A11Y-05`
Expected: PASS at both 390x844 and 683x450, with local table overflow still present.

- [ ] **Step 3: Commit**

Commit message: `fix(a11y): contain variant workbench overflow`

---

### Task 6: Verify Plan 2A and prepare remediation PR checkpoint

**Files:**
- No new product files.
- Review: all Plan 2A changed files.

**Interfaces:**
- Consumes: Tasks 1-5.
- Produces: exact-head evidence that all five High findings pass branch regressions and normal repository validation.

- [ ] **Step 1: Run all High regressions**

Run: `npm run a11y:remediation`
Expected: all five tests PASS.

- [ ] **Step 2: Run affected workspace tests/builds**

Run:

```bash
npm run build --workspace apps/portfolio-hub
npm test --workspace apps/redactready-pro-hri-os
npm run build --workspace apps/redactready-pro-hri-os
npm test --workspace apps/scamshield-ai -- --run
npm run build --workspace apps/scamshield-ai
npm test --workspace apps/variantvision-pro
npm run build --workspace apps/variantvision-pro
```

Expected: all PASS.

- [ ] **Step 3: Run repository verification**

Run: `npm run verify`
Expected: PASS.

- [ ] **Step 4: Verify exact-head GitHub checks**

Require successful `Accessibility Remediation`, `Portfolio CI`, `Vercel Affected Deployment Plan`, and other triggered required workflows on the exact remediation head.

- [ ] **Step 5: Do not mark production findings remediated yet**

The branch tests prove the corrections in branch code. `docs/accessibility/FINDINGS.md` remains historical baseline until the corrected apps are deployed and the production accessibility baseline is rerun against the new source SHA.
