import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e', timeout: 30_000, workers: 1, reporter: 'list',
  outputDir: './test-results',
  use: { baseURL: 'http://127.0.0.1:5182', headless: true, viewport: { width: 1440, height: 900 }, trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:5182', reuseExistingServer: !process.env.CI, timeout: 60_000 },
})
