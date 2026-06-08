import { expect, test } from '@playwright/test'
import path from 'node:path'

test('uploads a text fixture and previews redacted output', async ({ page }) => {
  await page.goto('/redact')
  await page.getByTestId('file-input').setInputFiles(path.join(process.cwd(), 'samples', 'sample-sensitive.txt'))

  await expect(page.getByTestId('detection-list')).toContainText('Email address')
  await expect(page.getByTestId('detection-list')).toContainText('SSN-like identifier')
  await expect(page.getByTestId('redacted-text-preview')).toContainText('[REDACTED_EMAIL]')
  await expect(page.getByTestId('redacted-text-preview')).toContainText('[REDACTED_SSN]')
})
