import { expect, test } from '@playwright/test'

test('plans a bed in square-foot and row modes and persists changes', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/GardenGrid/)
  await expect(page.getByRole('heading', { name: 'Plant library' })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search plants' }).fill('cilantro')
  await page.getByRole('button', { name: 'Select Cilantro', exact: true }).click()
  await expect(page.getByText(/Click inside the bed to add Cilantro/)).toBeVisible()

  const bed = page.getByTestId('garden-bed')
  await bed.click({ position: { x: 520, y: 160 } })
  await expect(page.getByRole('button', { name: 'Select Cilantro placement' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Row mode' }).click()
  await page.getByRole('searchbox', { name: 'Search plants' }).fill('carrot')
  await page.getByRole('button', { name: 'Select Carrot', exact: true }).click()
  await bed.click({ position: { x: 350, y: 300 } })
  await expect(page.getByText(/Rows use each plant’s recommended in-row spacing/)).toBeVisible()

  await page.waitForTimeout(300)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Row mode' })).toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'Select Cilantro placement' }).first()).toBeVisible()
  expect(await page.getByRole('button', { name: 'Select Carrot placement' }).count()).toBeGreaterThan(1)

  await page.getByRole('button', { name: /Export/ }).click()
  await expect(page.getByText('Plant list CSV')).toBeVisible()
  await expect(page.getByText('JSON backup')).toBeVisible()
})
