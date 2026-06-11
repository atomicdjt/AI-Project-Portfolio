import { expect, test } from '@playwright/test'

test('completes the local scam evidence workflow without external requests', async ({ page }, testInfo) => {
  const externalRequests: string[] = []
  const consoleErrors: string[] = []

  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url())
  })
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'ScamShield AI' })).toBeVisible()
  await page.screenshot({ path: `docs/screenshots/scamshield-${testInfo.project.name}-landing.png`, fullPage: false })

  await page.getByRole('button', { name: /use bank account locked phishing text demo/i }).click()
  await expect(page.getByLabel(/case name/i)).toHaveValue(/demo: bank account locked alert/i)
  await page.getByRole('button', { name: /run local risk assessment/i }).click()
  await expect(page.getByRole('heading', { name: /risk assessment/i })).toBeVisible()
  await expect(page.getByText('Severe risk', { exact: true })).toBeVisible()
  await page.screenshot({ path: `docs/screenshots/scamshield-${testInfo.project.name}-assessment.png`, fullPage: false })

  await page.getByRole('button', { name: /timeline and actions/i }).click()
  await expect(page.getByRole('heading', { name: /evidence timeline/i })).toBeVisible()
  await page.getByRole('button', { name: /report and export/i }).click()
  await expect(page.getByRole('heading', { name: /safe reporting guidance/i })).toBeVisible()

  const exportPanel = page.getByRole('region', { name: /evidence packet export/i })
  const exportButton = exportPanel.getByRole('button', { name: /download evidence packet pdf/i })
  await expect(exportButton).toBeDisabled()
  await exportPanel.getByRole('checkbox', { name: /report may contain sensitive information/i }).check()

  const downloadPromise = page.waitForEvent('download')
  await exportButton.click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^scamshield-evidence-.*\.pdf$/)

  expect(externalRequests).toEqual([])
  expect(consoleErrors).toEqual([])
})
