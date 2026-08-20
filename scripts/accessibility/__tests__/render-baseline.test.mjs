import assert from 'node:assert/strict'
import test from 'node:test'
import { renderBaselineMarkdown } from '../render-baseline.mjs'

const productionSha = 'cd782588bc6b6b36bc2ca7f1efaaa7c31e78d7b2'
const harnessSha = '1234567890abcdef1234567890abcdef12345678'
const fixture = {
  schemaVersion: 2,
  auditHarnessSha: harnessSha,
  runId: 'fixture-run',
  observedAt: '2026-08-20T00:00:00.000Z',
  environment: { operatingSystem: 'linux', browserName: 'chromium', browserVersion: '1.2.3', playwrightProject: 'desktop-chromium' },
  projects: [{
    id: 'portfolio-hub',
    name: 'Portfolio Hub',
    productionUrl: 'https://example.test/',
    primaryFlow: 'entry -> project',
    productionDeploymentId: 'dpl_example123',
    productionSourceSha: productionSha,
    productionTargetVerifiedOn: '2026-08-20',
    assistiveTechnologyStatus: 'not yet tested with genuine screen reader',
  }],
  records: [
    {
      projectId: 'portfolio-hub', productionUrl: 'https://example.test/', sourceSha: productionSha, auditHarnessSha: harnessSha,
      browserName: 'chromium', browserVersion: '1.2.3', operatingSystem: 'linux', viewport: { width: 1366, height: 900 },
      category: 'automated-axe', observedAt: '2026-08-20T00:00:00.000Z', assistiveTechnology: 'not yet tested with genuine screen reader',
      result: { status: 'finding', violations: [{ ruleId: 'button-name', impact: 'critical', help: 'Buttons need names', target: ['button'], htmlExcerpt: '<button></button>', tags: [] }] },
    },
    {
      projectId: 'portfolio-hub', productionUrl: 'https://example.test/', sourceSha: productionSha, auditHarnessSha: harnessSha,
      browserName: 'chromium', browserVersion: '1.2.3', operatingSystem: 'linux', viewport: { width: 1366, height: 900 },
      category: 'keyboard-focus', observedAt: '2026-08-20T00:00:00.000Z', assistiveTechnology: 'not yet tested with genuine screen reader',
      result: { status: 'possible-cycle', focusIndicatorReviewCount: 1, offscreenFocusCount: 0 },
    },
  ],
}

test('baseline renderer is explicit about remediation, provenance, and AT boundaries', () => {
  const rendered = renderBaselineMarkdown([fixture])
  const combined = Object.values(rendered).join('\n')

  assert.match(combined, /Baseline — remediation not yet applied/)
  assert.match(combined, /not yet tested with genuine screen reader/)
  assert.match(combined, /Portfolio severity: Untriaged/)
  assert.match(combined, new RegExp(productionSha))
  assert.match(combined, new RegExp(harnessSha))
  assert.doesNotMatch(combined, /WCAG compliant/i)
  assert.doesNotMatch(combined, /screen-reader passed/i)
  assert.doesNotMatch(combined, /fully accessible/i)
})
