import assert from 'node:assert/strict'
import test from 'node:test'
import { createAuditRecord, normalizeAxeViolation } from '../evidence.mjs'

const baseInput = {
  projectId: 'portfolio-hub',
  productionUrl: 'https://example.test/',
  sourceSha: 'abc123',
  browserName: 'chromium',
  browserVersion: '1.2.3',
  operatingSystem: 'linux',
  viewport: { width: 1366, height: 900 },
  category: 'automated-axe',
  observedAt: '2026-08-20T00:00:00.000Z',
  result: { status: 'observed' },
}

test('audit record requires reproducibility fields and defaults AT boundary', () => {
  const record = createAuditRecord(baseInput)
  assert.equal(record.assistiveTechnology, 'not yet tested with genuine screen reader')

  for (const key of Object.keys(baseInput)) {
    const candidate = { ...baseInput }
    delete candidate[key]
    assert.throws(() => createAuditRecord(candidate), new RegExp(key))
  }
})

test('screen-reader success claims require genuine assistive-technology evidence', () => {
  for (const claim of ['NVDA tested', 'screen-reader passed', 'Screen reader passed']) {
    assert.throws(
      () => createAuditRecord({ ...baseInput, assistiveTechnology: claim }),
      /genuine assistive-technology evidence/i,
    )
  }

  const genuine = createAuditRecord({
    ...baseInput,
    assistiveTechnology: 'NVDA tested with Chrome',
    genuineAssistiveTechnology: true,
  })
  assert.equal(genuine.genuineAssistiveTechnology, true)
})

test('axe violations are normalized and HTML excerpts are bounded', () => {
  const normalized = normalizeAxeViolation({
    id: 'button-name',
    impact: 'critical',
    help: 'Buttons must have discernible text',
    tags: ['wcag2a'],
    nodes: [{ target: ['button.icon-only'], html: `<button>${'x'.repeat(400)}</button>` }],
  })

  assert.equal(normalized.length, 1)
  assert.equal(normalized[0].ruleId, 'button-name')
  assert.deepEqual(normalized[0].target, ['button.icon-only'])
  assert.ok(normalized[0].htmlExcerpt.length <= 240)
})
