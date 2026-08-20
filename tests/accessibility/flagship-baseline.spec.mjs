import { expect, test } from '@playwright/test'
import { scanPage } from '../../scripts/accessibility/axe.mjs'
import {
  collectKeyboardFocusObservation,
  collectReducedMotionObservation,
  collectReflowAtViewport,
} from '../../scripts/accessibility/behavior.mjs'
import { createAuditRecord, writeAuditBundle } from '../../scripts/accessibility/evidence.mjs'
import { loadFlagshipProjects } from '../../scripts/accessibility/projects.mjs'

const auditHarnessSha = process.env.AUDIT_HARNESS_SHA
if (!auditHarnessSha) throw new Error('AUDIT_HARNESS_SHA is required for reproducible accessibility evidence')

const projects = loadFlagshipProjects()
const records = []
const suiteObservedAt = new Date().toISOString()

test.describe.configure({ mode: 'serial' })

for (const project of projects) {
  test(`${project.id}: production accessibility baseline`, async ({ page, browser }, testInfo) => {
    await page.goto(project.productionUrl, { waitUntil: 'networkidle', timeout: 45_000 })
    await expect(page.locator('body')).toBeVisible()
    expect((await page.title()).trim()).not.toBe('')

    const startingViewport = page.viewportSize()
    if (!startingViewport) throw new Error(`Missing viewport for ${project.id}`)

    const addRecord = (category, result, viewport = startingViewport) => {
      records.push(
        createAuditRecord({
          projectId: project.id,
          productionUrl: page.url(),
          sourceSha: project.productionSourceSha,
          auditHarnessSha,
          productionDeploymentId: project.productionDeploymentId,
          browserName: 'chromium',
          browserVersion: browser.version(),
          operatingSystem: process.platform,
          viewport,
          category,
          observedAt: new Date().toISOString(),
          result,
        }),
      )
    }

    const violations = await scanPage(page)
    addRecord('automated-axe', { status: violations.length > 0 ? 'finding' : 'observed', violations })

    const keyboardFocus = await collectKeyboardFocusObservation(page)
    addRecord('keyboard-focus', keyboardFocus)

    const narrowReflow = await collectReflowAtViewport(page, { width: 390, height: 844 })
    addRecord('reflow-narrow', narrowReflow, narrowReflow.viewport)

    const zoomProxy = await collectReflowAtViewport(page, { width: 683, height: 450 })
    addRecord('reflow-200-percent-proxy', {
      ...zoomProxy,
      proxyDefinition: '1366x900 CSS viewport reduced to 683x450 as a reproducible 200%-zoom-equivalent layout proxy; not actual browser zoom',
    }, zoomProxy.viewport)

    const reducedMotion = await collectReducedMotionObservation(page)
    addRecord('reduced-motion', reducedMotion)

    await testInfo.attach(`${project.id}-baseline-summary`, {
      body: JSON.stringify({
        projectId: project.id,
        productionDeploymentId: project.productionDeploymentId,
        productionSourceSha: project.productionSourceSha,
        auditHarnessSha,
        axeViolationCount: violations.length,
        keyboardStatus: keyboardFocus.status,
        narrowReflowStatus: narrowReflow.status,
        zoomProxyStatus: zoomProxy.status,
        reducedMotionStatus: reducedMotion.status,
      }, null, 2),
      contentType: 'application/json',
    })
  })
}

test.afterAll(async ({ browser }, testInfo) => {
  writeAuditBundle(
    records,
    {
      auditHarnessSha,
      runId: process.env.GITHUB_RUN_ID ?? `local-${auditHarnessSha.slice(0, 12)}`,
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
