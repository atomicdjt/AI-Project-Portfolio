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
    await expect(control).toBeVisible()
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

test('A11Y-15 VariantVision population table is named, keyboard-focusable, and visibly focused when horizontally scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(urls.variantvision)

  const tableWrap = page.locator('.table-wrap')
  await expect(tableWrap).toBeVisible()
  const state = await tableWrap.evaluate((element) => ({
    tabIndex: element.tabIndex,
    scrollable: element.scrollWidth > element.clientWidth + 1,
    accessibleName: element.getAttribute('aria-label'),
  }))

  expect(state.scrollable).toBe(true)
  expect(state.tabIndex).toBe(0)
  expect(state.accessibleName).toMatch(/population frequency fixture/i)

  await tableWrap.focus()
  const focus = await tableWrap.evaluate((element) => {
    const style = getComputedStyle(element)
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow }
  })
  expect(focus.outlineStyle !== 'none' || focus.boxShadow !== 'none').toBe(true)
})
