import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const requiredFields = [
  'projectId',
  'productionUrl',
  'sourceSha',
  'auditHarnessSha',
  'browserName',
  'browserVersion',
  'operatingSystem',
  'viewport',
  'category',
  'observedAt',
  'result',
]

const defaultAssistiveTechnology = 'not yet tested with genuine screen reader'
const unsupportedSuccessPattern = /\b(nvda\s+tested|screen[- ]?reader\s+passed|screen\s+reader\s+passed)\b/i

export function createAuditRecord(input) {
  for (const field of requiredFields) {
    if (input[field] === undefined || input[field] === null || input[field] === '') throw new Error(`Audit record requires ${field}`)
  }

  const assistiveTechnology = input.assistiveTechnology ?? defaultAssistiveTechnology
  const genuineAssistiveTechnology = input.genuineAssistiveTechnology === true

  if (!genuineAssistiveTechnology && unsupportedSuccessPattern.test(assistiveTechnology)) {
    throw new Error('Screen-reader success language requires genuine assistive-technology evidence')
  }

  return {
    projectId: input.projectId,
    productionUrl: input.productionUrl,
    sourceSha: input.sourceSha,
    auditHarnessSha: input.auditHarnessSha,
    productionDeploymentId: input.productionDeploymentId ?? null,
    browserName: input.browserName,
    browserVersion: input.browserVersion,
    operatingSystem: input.operatingSystem,
    viewport: input.viewport,
    category: input.category,
    observedAt: input.observedAt,
    result: input.result,
    assistiveTechnology,
    genuineAssistiveTechnology,
  }
}

export function normalizeAxeViolation(violation) {
  return (violation.nodes ?? []).map((node) => ({
    ruleId: violation.id,
    impact: violation.impact ?? 'unknown',
    help: violation.help ?? '',
    target: node.target ?? [],
    htmlExcerpt: String(node.html ?? '').slice(0, 240),
    tags: violation.tags ?? [],
  }))
}

export function writeAuditBundle(records, metadata, outputPath = '.accessibility-results/baseline.json') {
  if (!metadata.auditHarnessSha) throw new Error('Audit bundle requires auditHarnessSha')
  const bundle = {
    schemaVersion: 2,
    auditHarnessSha: metadata.auditHarnessSha,
    runId: metadata.runId,
    observedAt: metadata.observedAt,
    environment: metadata.environment,
    projects: metadata.projects,
    records,
  }

  const absolutePath = resolve(outputPath)
  mkdirSync(resolve(absolutePath, '..'), { recursive: true })
  writeFileSync(absolutePath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8')
  return bundle
}
