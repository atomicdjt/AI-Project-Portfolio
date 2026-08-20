# Issue #39 Medium/Low Accessibility Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct and regression-test validated findings A11Y-06 through A11Y-14 after the five High findings are green on branch code.

**Architecture:** Extend the existing branch-code Playwright remediation harness to ProcessHarbor and LayerForge, then add one focused regression per remaining root finding. Product changes stay minimal: remove focus-outline suppression, make RedactReady's intentionally scrollable status strip keyboard-focusable and named, and adjust only the specific failing foreground/background pairs to clear normal-text contrast.

**Tech Stack:** React 19, TypeScript/JavaScript, Vite, Playwright Chromium, existing npm workspaces and GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-19-issue-39-accessibility-audit-design.md`

## Global Constraints

- Preserve the verified Plan 2A corrections for A11Y-01 through A11Y-05.
- Fix A11Y-06 through A11Y-14 without broad visual redesign or unrelated refactoring.
- Browser/ARIA/contrast evidence must not be described as genuine screen-reader testing.
- Genuine NVDA + Chrome/Edge remains a separate manual gate.
- The 683x450 check remains a documented 200%-zoom-equivalent layout proxy, not actual browser page zoom.
- No Vercel deployment orchestration or issue #38 controls may be changed.
- Findings remain production-baseline findings until corrected code is merged/deployed and canonical production surfaces are retested.

---

### Task 1: Extend branch-code remediation coverage and lock RED regressions

**Files:**
- Modify: `playwright.accessibility-remediation.config.mjs`
- Create: `tests/accessibility-remediation/remaining-findings.spec.mjs`
- Modify: `.github/workflows/accessibility-remediation.yml`

**Interfaces:**
- Consumes existing local URLs: ScamShield `5178`, Portfolio Hub `5180`, RedactReady Pro `5181`, VariantVision Pro `5182`.
- Adds ProcessHarbor `http://127.0.0.1:5177` using its fixed workspace dev port.
- Adds LayerForge `http://127.0.0.1:5176` using `npm run dev --workspace apps/layerforge-studio -- --port 5176`.
- Produces one read-only `Accessibility Remediation` workflow covering all 14 validated browser-regression behaviors.

- [ ] **Step 1: Add shared test helpers**

The remaining suite must use computed browser styles, not hard-coded assumptions. Define:

```js
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

function parseRgb(value) {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) throw new Error(`Unsupported computed color: ${value}`)
  return match.slice(1, 4).map(Number)
}

function relativeLuminance(rgb) {
  const channels = rgb.map((value) => {
    const normalized = value / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground, background) {
  const fg = relativeLuminance(parseRgb(foreground))
  const bg = relativeLuminance(parseRgb(background))
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
}

function hasVisibleIndicator(indicator) {
  const outlined = indicator.outlineStyle !== 'none' && Number.parseFloat(indicator.outlineWidth) >= 2
  return outlined || indicator.boxShadow !== 'none'
}
```

- [ ] **Step 2: Add A11Y-06 through A11Y-14 failing tests**

Use these exact assertions:

```js
test('A11Y-06 ProcessHarbor document search exposes visible focus', async ({ page }) => {
  await page.goto('http://127.0.0.1:5177')
  const search = page.locator('.search-box input').first()
  await expect(search).toBeVisible()
  expect(hasVisibleIndicator(await computedFocusIndicator(search))).toBe(true)
})

test('A11Y-07 LayerForge recent project select exposes visible focus', async ({ page }) => {
  await page.goto('http://127.0.0.1:5176')
  const select = page.locator('.recent-select select')
  await expect(select).toBeVisible()
  expect(hasVisibleIndicator(await computedFocusIndicator(select))).toBe(true)
})

test('A11Y-08 RedactReady scrollable session status is keyboard-operable and named', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5181')
  const status = page.locator('.session-status')
  await expect(status).toBeVisible()
  const state = await status.evaluate((element) => ({
    tabIndex: element.tabIndex,
    scrollable: element.scrollWidth > element.clientWidth + 1,
  }))
  expect(state.scrollable).toBe(true)
  expect(state.tabIndex).toBe(0)
  await expect(status).toHaveAccessibleName('Session status')
})

test('A11Y-09 ScamShield footer source link clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5178')
  const link = page.locator('.app-footer a')
  const footer = page.locator('.app-footer')
  const [foreground, background] = await Promise.all([
    link.evaluate((element) => getComputedStyle(element).color),
    footer.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
})

test('A11Y-10 VariantVision case search exposes visible focus', async ({ page }) => {
  await page.goto('http://127.0.0.1:5182')
  const search = page.locator('.search-box input')
  await expect(search).toBeVisible()
  expect(hasVisibleIndicator(await computedFocusIndicator(search))).toBe(true)
})

test('A11Y-11 VariantVision active-case shorthand clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5182')
  const shorthand = page.locator('.case-list button.active small')
  const activeCase = page.locator('.case-list button.active')
  await expect(shorthand).toBeVisible()
  const [foreground, background] = await Promise.all([
    shorthand.evaluate((element) => getComputedStyle(element).color),
    activeCase.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
})

test('A11Y-12 VariantVision live-fetch action clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5182')
  const action = page.locator('.live-fetch-btn').first()
  await expect(action).toBeVisible()
  const styles = await action.evaluate((element) => {
    const style = getComputedStyle(element)
    return { foreground: style.color, background: style.backgroundColor }
  })
  expect(contrastRatio(styles.foreground, styles.background)).toBeGreaterThanOrEqual(4.5)
})

test('A11Y-13 Portfolio Hub secondary card metadata clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5180')
  const metadata = page.locator('.card-meta').first()
  const card = metadata.locator('xpath=ancestor::*[contains(@class,"project-card")][1]')
  await expect(metadata).toBeVisible()
  const [foreground, background] = await Promise.all([
    metadata.evaluate((element) => getComputedStyle(element).color),
    card.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
})

test('A11Y-14 ScamShield inactive step label clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5178')
  const step = page.locator('.stepper button:not(.active):not(.complete)').first()
  const stepper = page.locator('.stepper')
  await expect(step).toBeVisible()
  const [foreground, background] = await Promise.all([
    step.evaluate((element) => getComputedStyle(element).color),
    stepper.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])
  expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
})
```

- [ ] **Step 3: Extend the Playwright web servers**

Append to `webServer`:

```js
{
  command: 'npm run dev --workspace apps/opspilot-ai-operations-toolkit',
  url: 'http://127.0.0.1:5177',
  reuseExistingServer: false,
  timeout: 120_000,
},
{
  command: 'npm run dev --workspace apps/layerforge-studio -- --port 5176',
  url: 'http://127.0.0.1:5176',
  reuseExistingServer: false,
  timeout: 120_000,
},
```

- [ ] **Step 4: Extend workflow path coverage**

Add `apps/opspilot-ai-operations-toolkit/**` and `apps/layerforge-studio/**` to `.github/workflows/accessibility-remediation.yml` path filters.

- [ ] **Step 5: Verify RED on the PR**

Expected: the nine new tests fail on the validated pre-fix behaviors while the five Plan 2A tests remain green. Preserve the run/job evidence before product remediation.

---

### Task 2: Correct Medium focus and scroll-operability findings

**Files:**
- Modify: `apps/opspilot-ai-operations-toolkit/src/styles.css`
- Modify: `apps/layerforge-studio/src/index.css`
- Modify: `apps/redactready-pro-hri-os/src/app/App.tsx`
- Modify: `apps/variantvision-pro/src/index.css`
- Test: `tests/accessibility-remediation/remaining-findings.spec.mjs`

**Interfaces:**
- Produces visible focus for ProcessHarbor library search, LayerForge recent select, and VariantVision case search.
- Produces a keyboard-focusable, accessible-name-bearing RedactReady status strip while retaining its existing narrow-layout scrolling behavior.

- [ ] **Step 1: Remove ProcessHarbor outline suppression**

Change:

```css
.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
}
```

to:

```css
.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
}

.search-box:focus-within {
  border-color: var(--teal-dark);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.16);
}
```

- [ ] **Step 2: Remove LayerForge select outline suppression**

Change:

```css
.recent-select select,
.select-control select {
  min-width: 92px;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
}
```

to the same rule without `outline: 0`. Keep the global `select:focus-visible` treatment as the canonical indicator.

- [ ] **Step 3: Make RedactReady's intentionally scrollable status strip operable**

Change:

```tsx
<div className="session-status">
```

to:

```tsx
<div className="session-status" tabIndex={0} aria-label="Session status">
```

Do not convert the strip to wrapping in this pass; the fixed topbar layout intentionally uses compact status pills, so the allowed issue remedy is a focusable, named scroll region.

- [ ] **Step 4: Remove VariantVision case-search outline suppression**

Remove only `outline: 0` from `.search-box input`, preserving the existing global `input:focus-visible` rule.

- [ ] **Step 5: Verify focused regressions**

Run the remediation suite filtered to A11Y-06, A11Y-07, A11Y-08, and A11Y-10. Expected: PASS.

---

### Task 3: Correct contrast findings with scoped color changes

**Files:**
- Modify: `apps/scamshield-ai/src/styles.css`
- Modify: `apps/variantvision-pro/src/index.css`
- Modify: `apps/portfolio-hub/src/styles.css`
- Test: `tests/accessibility-remediation/remaining-findings.spec.mjs`

**Interfaces:**
- Produces measured computed-style contrast >= 4.5:1 for each affected normal-text target.
- Does not alter unrelated brand/accent uses of the same base colors.

- [ ] **Step 1: Correct ScamShield footer source contrast**

Add a footer-specific link color rather than changing global `--blue-700`:

```css
.app-footer a {
  color: #7fd3ff;
}
```

This preserves global link styling and provides strong contrast on `#082c3f`.

- [ ] **Step 2: Correct ScamShield inactive step text**

Change only the inactive step button foreground from `#6a7b82` to `#637177`:

```css
.stepper button { color: #637177; }
```

Active/complete state overrides remain unchanged.

- [ ] **Step 3: Correct VariantVision active-case shorthand**

Keep the existing gold shorthand on dark inactive cards and add only an active-state override:

```css
.case-list button.active small {
  color: #735400;
}
```

- [ ] **Step 4: Correct VariantVision live-fetch action**

Change only `.live-fetch-btn` background from `#19b8aa` to `#0f766e`. Keep white text. Preserve the existing darker hover state unless the computed hover retest identifies a regression.

- [ ] **Step 5: Correct Portfolio Hub card metadata**

Change `.card-meta` from `#6b7a80` to `#637177`.

- [ ] **Step 6: Verify contrast regressions**

Run A11Y-09, A11Y-11, A11Y-12, A11Y-13, and A11Y-14. Expected: each computed contrast ratio >= 4.5.

---

### Task 4: Verify Plan 2B on clean branch code

**Files:**
- No new product files.
- Review all Plan 2B changed files and permanent regression infrastructure.

**Interfaces:**
- Consumes Tasks 1-3.
- Produces exact-head evidence that all 14 validated branch-code regressions are green before production retest.

- [ ] **Step 1: Run the complete remediation suite**

Run: `npm run a11y:remediation`
Expected: all 14 tests PASS.

- [ ] **Step 2: Run affected workspace verification**

Run:

```bash
npm run test:run --workspace apps/opspilot-ai-operations-toolkit
npm run build --workspace apps/opspilot-ai-operations-toolkit
npm run build --workspace apps/layerforge-studio
npm test --workspace apps/redactready-pro-hri-os
npm run build --workspace apps/redactready-pro-hri-os
npm test --workspace apps/scamshield-ai -- --run
npm run build --workspace apps/scamshield-ai
npm test --workspace apps/variantvision-pro
npm run build --workspace apps/variantvision-pro
npm run build --workspace apps/portfolio-hub
```

Expected: all PASS.

- [ ] **Step 3: Run repository verification**

Run: `npm run verify`
Expected: PASS.

- [ ] **Step 4: Remove any temporary execution machinery before the final checkpoint**

Permanent PR surface must contain only product fixes, read-only regression infrastructure, plans/status evidence, and normal project files.

- [ ] **Step 5: Verify exact-head GitHub checks**

Require successful Accessibility Remediation, Portfolio CI, Accessibility Baseline, ProcessHarbor Pro Verify, Portfolio Vercel Readiness, and Vercel Affected Deployment Plan on the exact clean remediation head.

- [ ] **Step 6: Preserve production boundary**

Do not mark A11Y-06 through A11Y-14 production-remediated until PR #88 is integrated, corrected canonical deployments are verified, and the production accessibility baseline/retest is run against the deployed source SHA.
