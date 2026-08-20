import { expect, test } from '@playwright/test'

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

test('A11Y-08 RedactReady scrollable session status is keyboard-operable, named, and visibly focused', async ({ page }) => {
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
  expect(hasVisibleIndicator(await computedFocusIndicator(status))).toBe(true)
})

test('A11Y-09 ScamShield footer source link clears normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5178')
  const link = page.locator('.app-footer a')
  const footer = page.locator('.app-footer')
  await expect(link).toBeVisible()
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

test('A11Y-12 VariantVision live-fetch action clears normal-text contrast at rest and hover', async ({ page }) => {
  await page.goto('http://127.0.0.1:5182')
  const action = page.locator('.live-fetch-btn').first()
  await expect(action).toBeVisible()

  const readContrast = async () => action.evaluate((element) => {
    const style = getComputedStyle(element)
    return { foreground: style.color, background: style.backgroundColor }
  })

  let styles = await readContrast()
  expect(contrastRatio(styles.foreground, styles.background)).toBeGreaterThanOrEqual(4.5)

  await action.hover()
  await page.waitForTimeout(180)
  styles = await readContrast()
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

test('A11Y-14 ScamShield inactive step label and number clear normal-text contrast', async ({ page }) => {
  await page.goto('http://127.0.0.1:5178')
  const step = page.locator('.stepper button:not(.active):not(.complete)').first()
  const number = step.locator('span')
  const stepper = page.locator('.stepper')
  await expect(step).toBeVisible()
  await expect(number).toBeVisible()

  const [stepForeground, stepBackground, numberForeground, numberBackground] = await Promise.all([
    step.evaluate((element) => getComputedStyle(element).color),
    stepper.evaluate((element) => getComputedStyle(element).backgroundColor),
    number.evaluate((element) => getComputedStyle(element).color),
    number.evaluate((element) => getComputedStyle(element).backgroundColor),
  ])

  expect(contrastRatio(stepForeground, stepBackground)).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio(numberForeground, numberBackground)).toBeGreaterThanOrEqual(4.5)
})
