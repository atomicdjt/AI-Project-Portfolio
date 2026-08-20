import assert from 'node:assert/strict'
import test from 'node:test'
import { renderBaselineMarkdown } from '../render-baseline.mjs'

const fixture = {
  schemaVersion: 1,
  sourceSha: 'abc123',
  runId: 'fixture-run',
  observedAt: '2026-08-20T00:00:00.000Z',
  environment: { operatingSystem: 'linux', browserName: 'chromium', browserVersion: '1.2.3' },
  projects: [{
    id: 'portfolio-hub',
    name: 'Portfolio Hub',
    productionUrl: 'https://example.test/',
    primaryFlow: 'entry -> project',
    assistiveTechnologyStatus: 'not yet tested with genuine screen reader',
  }],
  records: [
    {
      projectId: 'portfolio-hub',
      productionUrl: 'https://example.test/',
      sourceSha: 'abc123',
      browserName: 'chromium',
      browserVersion: '1.2.3',
      operatingSystem: 'linux',
      viewport: { width: 1366, height: 900 },
      category: 'automated-axe',
      observedAt: '2026-08-20T00:00:00.000Z',
      assistiveTechnology: 'not yet tested with genuine screen reader',
      result: {
        status: 'finding',
        violations: [{ ruleId: 'button-name', impact: 'critical', help: 'Buttons need names', target: ['button'], htmlExcerpt: '<button></button>', tags: [] }],
      },
    },
    {
      projectId: 'portfolio-hub',
      productionUrl: 'https://example.test/',
      sourceSha: 'abc123',
      browserName: 'chromium',
      browserVersion: '1.2.3',
      operatingSystem: 'linux',
      viewport: { width: 1366, height: 900 },
      category: 'keyboard-focus',
      observedAt: '2026-08-20T00:00:00.000Z',
      assistiveTechnology: 'not yet tested with genuine screen reader',
      result: { status: 'possible-cycle', focusIndicatorReviewCount: 1, offscreenFocusCount: 0 },
    },
  ],
}

test('baseline renderer is explicit about remediation and AT boundaries', () => {
  const rendered = renderBaselineMarkdown([fixture])
  const combined = Object.values(rendered).join('\n')

  assert.match(combined, /Baseline — remediation not yet applied/)
  assert.match(combined, /not yet tested with genuine screen reader/)
  assert.match(combined, /Portfolio severity: Untriaged/)
  assert.doesNotMatch(combined, /WCAG compliant/i)
  assert.doesNotMatch(combined, /screen-reader passed/i)
  assert.doesNotMatch(combined, /fully accessible/i)
})
