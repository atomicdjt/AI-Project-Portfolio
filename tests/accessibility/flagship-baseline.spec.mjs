import { expect, test } from '@playwright/test'
import { scanPage } from '../../scripts/accessibility/axe.mjs'
import { createAuditRecord, writeAuditBundle } from '../../scripts/accessibility/evidence.mjs'
import { loadFlagshipProjects } from '../../scripts/accessibility/projects.mjs'

const sourceSha = process.env.AUDIT_SOURCE_SHA
if (!sourceSha) throw new Error('AUDIT_SOURCE_SHA is required for reproducible accessibility evidence')

const projects = loadFlagshipProjects()
const records = []
const suiteObservedAt = new Date().toISOString()

test.describe.configure({ mode: 'serial' })

for (const project of projects) {
  test(`${project.id}: initial production axe baseline`, async ({ page, browser }, testInfo) => {
    await page.goto(project.productionUrl, { waitUntil: 'networkidle', timeout: 45_000 })
    await expect(page.locator('body')).toBeVisible()
    expect((await page.title()).trim()).not.toBe('')

    const violations = await scanPage(page)
    const viewport = page.viewportSize()
    if (!viewport) throw new Error(`Missing viewport for ${project.id}`)

    records.push(
      createAuditRecord({
        projectId: project.id,
        productionUrl: page.url(),
        sourceSha,
        browserName: 'chromium',
        browserVersion: browser.version(),
        operatingSystem: process.platform,
        viewport,
        category: 'automated-axe',
        observedAt: new Date().toISOString(),
        result: {
          status: violations.length > 0 ? 'finding' : 'observed',
          violations,
        },
      }),
    )

    await testInfo.attach(`${project.id}-axe-summary`, {
      body: JSON.stringify({ projectId: project.id, violationCount: violations.length }, null, 2),
      contentType: 'application/json',
    })
  })
}

test.afterAll(async ({ browser }, testInfo) => {
  writeAuditBundle(
    records,
    {
      sourceSha,
      runId: process.env.GITHUB_RUN_ID ?? `local-${sourceSha.slice(0, 12)}`,
      observedAt: suiteObservedAt,
      environment: {
        operatingSystem: process.platform,
        browserName: 'chromium',
        browserVersion: browser.version(),
        playwrightProject: testInfo.project.name,
      },
      projects,
    },
    `.accessibility-results/baseline-${testInfo.project.name}.json`,
  )
})
