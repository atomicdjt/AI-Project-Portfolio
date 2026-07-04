import { expect, test } from '@playwright/test'

test('OpsPilot Pro supports saved docs, training, gaps, audit, and export', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'OpsPilot Pro Operations Workspace' })).toBeVisible()
  await expect(page.getByText('Saved documents, version history, training checklists')).toBeVisible()

  await page.getByRole('button', { name: 'Admin Dashboard' }).click()
  await expect(page.getByRole('heading', { name: 'Admin and export dashboard' })).toBeVisible()
  await expect(page.getByText('Audit events', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Generate from intake' }).first().click()
  await expect(page.getByText('Generated document, checklist, knowledge base, gaps, and version snapshot')).toBeVisible()

  await page.getByRole('button', { name: 'Training Checklist' }).click()
  const firstTrainingItem = page.locator('.check-row input').first()
  await firstTrainingItem.check()
  await expect(firstTrainingItem).toBeChecked()

  await page.getByRole('button', { name: 'Gap Detector' }).click()
  const firstGapButton = page.locator('.gap-row button').first()
  await firstGapButton.click()
  await expect(firstGapButton).toBeDisabled()

  await page.getByRole('button', { name: 'Admin Dashboard' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export workspace' }).first().click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('opspilot-workspace-export.json')
  await expect(page.getByText('Exported workspace bundle')).toBeVisible()
})
