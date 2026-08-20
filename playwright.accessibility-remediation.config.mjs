import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/accessibility-remediation',
  timeout: 45_000,
  workers: 1,
  use: {
    browserName: 'chromium',
    headless: true,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'accessibility-remediation-report', open: 'never' }],
  ],
  webServer: [
    {
      command: 'npm run dev --workspace apps/layerforge-studio -- --port 5176',
      url: 'http://127.0.0.1:5176',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace apps/opspilot-ai-operations-toolkit',
      url: 'http://127.0.0.1:5177',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace apps/scamshield-ai',
      url: 'http://127.0.0.1:5178',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace apps/portfolio-hub',
      url: 'http://127.0.0.1:5180',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace apps/redactready-pro-hri-os',
      url: 'http://127.0.0.1:5181',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace apps/variantvision-pro',
      url: 'http://127.0.0.1:5182',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
