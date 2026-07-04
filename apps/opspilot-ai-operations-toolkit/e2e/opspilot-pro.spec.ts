import { expect, test } from '@playwright/test'

test('OpsPilot Pro supports saved docs, training, gaps, audit, and export', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByLabel('Feature navigation')

  await expect(page.getByRole('heading', { name: 'OpsPilot Pro Operations Workspace' })).toBeVisible()
  await expect(page.getByText('Deterministic operations-document demo')).toBeVisible()
  await expect(page.getByText('Deterministic demo', { exact: true })).toBeVisible()
  await expect(page.getByText('Reference API', { exact: true })).toBeVisible()

  await nav.getByRole('button', { name: 'Admin Dashboard' }).click()
  await expect(page.getByRole('heading', { name: 'Admin and export dashboard' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Developer diagnostics' })).toBeVisible()
  await expect(page.getByText('Audit events', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Generate from intake' }).first().click()
  await expect(page.getByText(/Generated with deterministic fallback|Generated through optional server-side AI route/)).toBeVisible()

  await nav.getByRole('button', { name: 'SOP Builder' }).click()
  await expect(page.getByRole('heading', { name: 'SOP procedure editor' })).toBeVisible()

  await nav.getByRole('button', { name: 'Training Checklist' }).click()
  await expect(page.getByRole('heading', { name: 'Training checklist builder' })).toBeVisible()
  const firstTrainingItem = page.locator('.check-row input').first()
  await firstTrainingItem.check()
  await expect(firstTrainingItem).toBeChecked()

  await nav.getByRole('button', { name: 'Knowledge Base' }).click()
  await expect(page.getByRole('heading', { name: 'Knowledge base articles' })).toBeVisible()

  await nav.getByRole('button', { name: 'Gap Detector' }).click()
  await expect(page.getByRole('heading', { name: 'Documentation gap report' })).toBeVisible()
  const firstGapButton = page.locator('.gap-row button').first()
  await firstGapButton.click()
  await expect(firstGapButton).toBeDisabled()

  await nav.getByRole('button', { name: 'Version Tracker' }).click()
  await expect(page.getByRole('heading', { name: 'Version history' })).toBeVisible()

  await nav.getByRole('button', { name: 'Admin Dashboard' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export workspace' }).first().click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('opspilot-workspace-export.json')
  await expect(page.getByText('Exported workspace bundle')).toBeVisible()
})
