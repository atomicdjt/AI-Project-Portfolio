import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const auditCategories = ['automated-axe', 'keyboard-focus', 'reflow-narrow', 'reflow-200-percent-proxy', 'reduced-motion']
const reviewStatuses = new Set(['review', 'possible-cycle', 'no-focusable-control'])
const forbiddenClaims = [/WCAG compliant/i, /fully accessible/i, /screen-reader passed/i, /NVDA passed/i]

function uniqueProjects(bundles) {
  const byId = new Map()
  for (const bundle of bundles) for (const project of bundle.projects ?? []) if (!byId.has(project.id)) byId.set(project.id, project)
  return [...byId.values()]
}

function flattenRecords(bundles) {
  return bundles.flatMap((bundle) => bundle.records ?? [])
}

function viewportLabel(record) {
  return `${record.viewport?.width ?? '?'}x${record.viewport?.height ?? '?'}`
}

function recordNeedsTriage(record) {
  if (reviewStatuses.has(record.result?.status)) return true
  if ((record.result?.focusIndicatorReviewCount ?? 0) > 0) return true
  if ((record.result?.offscreenFocusCount ?? 0) > 0) return true
  return false
}

function matrixStatus(records) {
  if (records.length === 0) return 'Not tested'
  if (records.some((record) => record.category === 'automated-axe' && (record.result?.violations?.length ?? 0) > 0)) return 'Finding'
  if (records.some(recordNeedsTriage)) return 'Needs triage'
  return 'Observed'
}

function candidateFindings(records) {
  const candidates = []
  const counters = new Map()
  const nextId = (projectId, category) => {
    const key = `${projectId}-${category}`
    const value = (counters.get(key) ?? 0) + 1
    counters.set(key, value)
    return `${key}-${String(value).padStart(3, '0')}`
  }

  for (const record of records) {
    if (record.category === 'automated-axe') {
      for (const violation of record.result?.violations ?? []) {
        candidates.push({
          id: nextId(record.projectId, record.category),
          projectId: record.projectId,
          category: record.category,
          viewport: viewportLabel(record),
          scannerImpact: violation.impact ?? 'unknown',
          evidence: `${violation.ruleId}: ${violation.help}`,
          target: Array.isArray(violation.target) ? violation.target.join(' ') : String(violation.target ?? ''),
          status: 'Untriaged',
        })
      }
      continue
    }

    if (!recordNeedsTriage(record)) continue
    const details = []
    if (record.result?.status) details.push(`status=${record.result.status}`)
    if ((record.result?.focusIndicatorReviewCount ?? 0) > 0) details.push(`focus indicators requiring review=${record.result.focusIndicatorReviewCount}`)
    if ((record.result?.offscreenFocusCount ?? 0) > 0) details.push(`off-screen focus observations=${record.result.offscreenFocusCount}`)
    if (record.result?.interpretation) details.push(record.result.interpretation)

    candidates.push({
      id: nextId(record.projectId, record.category),
      projectId: record.projectId,
      category: record.category,
      viewport: viewportLabel(record),
      scannerImpact: 'not applicable',
      evidence: details.join('; '),
      target: 'behavioral observation',
      status: 'Untriaged',
    })
  }
  return candidates
}

function environmentLines(bundles) {
  return bundles.map((bundle) => {
    const env = bundle.environment ?? {}
    return `- Run \`${bundle.runId}\` — audit harness \`${bundle.auditHarnessSha}\`; ${env.operatingSystem ?? 'unknown OS'}; ${env.browserName ?? 'unknown browser'} ${env.browserVersion ?? ''}; Playwright project \`${env.playwrightProject ?? 'unknown'}\`; observed ${bundle.observedAt}`
  })
}

function targetLines(projects) {
  return projects.map((project) => `- **${project.name}** — deployment \`${project.productionDeploymentId}\`; production source \`${project.productionSourceSha}\`; provider target verified ${project.productionTargetVerifiedOn}; ${project.productionUrl}`)
}

function renderReadme(bundles, projects, records, findings) {
  return `# Accessibility Review Evidence

## Baseline — remediation not yet applied

This directory records the reproducible baseline for issue #39 across six flagship applications. It is an evidence package, not a certification or legal-compliance opinion.

### Scope

${projects.map((project) => `- **${project.name}** (\`${project.id}\`) — ${project.productionUrl} — primary flow: ${project.primaryFlow}`).join('\n')}

### Production target provenance

The browser audit ran against canonical production URLs. Production deployment/source provenance is recorded separately from the audit-harness revision so a harness branch is never mistaken for deployed product source.

${targetLines(projects).join('\n')}

### Evidence boundary

- Automated checks use Playwright Chromium and axe-core.
- Keyboard/focus, responsive reflow, a documented 200%-zoom-equivalent CSS viewport proxy, and reduced-motion preference are reproducible browser observations.
- Scanner impact is not copied directly into portfolio severity.
- Ambiguous browser heuristics remain marked for adjudication.
- Assistive technology status: **not yet tested with genuine screen reader**.
- Genuine NVDA execution on Windows with Chrome or Edge remains a separate manual gate.
- Baseline findings are preserved even when unfavorable; remediation is documented only after a defect is reproduced and fixed.

### Audit harness runs

${environmentLines(bundles).join('\n')}

### Baseline totals

- Audit records: **${records.length}**
- Candidate findings/observations requiring triage: **${findings.length}**
- Applications in scope: **${projects.length}**
- Audit categories: **${auditCategories.length}**

See [AUDIT_MATRIX.md](./AUDIT_MATRIX.md) for project/category coverage, [FINDINGS.md](./FINDINGS.md) for candidate/adjudication evidence, [PRODUCTION_TARGETS.json](./PRODUCTION_TARGETS.json) for provider-verified target provenance, and [NVDA_MANUAL_CHECK.md](./NVDA_MANUAL_CHECK.md) for the genuine assistive-technology boundary.
`
}

function renderMatrix(projects, records) {
  const header = ['Project', ...auditCategories, 'Assistive technology']
  const separator = header.map(() => '---')
  const rows = projects.map((project) => {
    const cells = auditCategories.map((category) => matrixStatus(records.filter((record) => record.projectId === project.id && record.category === category)))
    return [`**${project.name}**`, ...cells, project.assistiveTechnologyStatus ?? 'not yet tested with genuine screen reader']
  })
  return `# Accessibility Audit Matrix

**Baseline — remediation not yet applied.** Statuses describe recorded evidence, not final accessibility disposition.

| ${header.join(' | ')} |
| ${separator.join(' | ')} |
${rows.map((row) => `| ${row.join(' | ')} |`).join('\n')}

## Status meanings

- **Observed** — the reproducible check completed without a candidate surfaced by that check.
- **Finding** — automated evidence produced one or more candidates requiring reproduction/triage.
- **Needs triage** — browser behavior evidence contains an ambiguous or potentially material observation.
- **Not tested** — no evidence was recorded for that project/category.

Automated/browser evidence does not substitute for genuine screen-reader execution.
`
}

function renderFindings(findings) {
  const body = findings.length === 0
    ? 'No candidate findings were produced by this baseline. This does not establish universal accessibility.'
    : findings.map((finding) => `## ${finding.id}\n\n- Project: \`${finding.projectId}\`\n- Category: \`${finding.category}\`\n- Viewport: \`${finding.viewport}\`\n- Scanner impact: \`${finding.scannerImpact}\`\n- Candidate status: **${finding.status}**\n- Portfolio severity: Untriaged\n- Evidence: ${finding.evidence}\n- Target/context: \`${finding.target.replaceAll('`', '\\`')}\`\n- Reproduction disposition: **Requires human adjudication before severity or remediation**\n`).join('\n')
  return `# Accessibility Baseline Findings\n\n**Baseline — remediation not yet applied.** These are normalized candidates, not automatically validated defects. Scanner impact is supporting evidence only; portfolio severity remains **Untriaged** until reproduction against the primary workflow.\n\n${body}\n`
}

function renderNvda(projects) {
  return `# Genuine NVDA Manual Check

## Status

**Pending genuine NVDA execution.** Browser accessibility trees, ARIA inspection, axe-core, DOM snapshots, and Playwright automation are not recorded as screen-reader testing.

## Required environment record

Before each genuine run, record Windows version, NVDA version, Chrome or Edge version, exact application production URL, exact repository/source SHA represented by that deployment, date/time, and workflow exercised.

## Critical workflow checklist

${projects.map((project) => `### ${project.name}\n\nPrimary flow: ${project.primaryFlow}\n\n- [ ] Page title and major landmarks are announced coherently.\n- [ ] Primary controls have understandable names, roles, and states.\n- [ ] Reading/focus order supports the primary flow.\n- [ ] Dynamic status, validation, error, and completion information is perceivable.\n- [ ] Modal/panel interactions preserve usable focus and recovery.\n- [ ] Important visual evidence has an understandable non-visual path.\n- [ ] Serious observations are recorded verbatim enough to reproduce, then retested after correction.\n`).join('\n')}

## Result ledger

| Project | NVDA | Browser | Source SHA | Result | Serious observations | Retest |
| --- | --- | --- | --- | --- | --- | --- |
${projects.map((project) => `| ${project.name} | Pending | Pending | ${project.productionSourceSha} | Not tested | None recorded | Pending |`).join('\n')}

Do not change a row from **Not tested** until genuine NVDA execution occurred.
`
}

export function renderBaselineMarkdown(bundles) {
  if (!Array.isArray(bundles) || bundles.length === 0) throw new Error('At least one accessibility bundle is required')
  const projects = uniqueProjects(bundles)
  const records = flattenRecords(bundles)
  const findings = candidateFindings(records)
  const rendered = {
    'README.md': renderReadme(bundles, projects, records, findings),
    'AUDIT_MATRIX.md': renderMatrix(projects, records),
    'FINDINGS.md': renderFindings(findings),
    'NVDA_MANUAL_CHECK.md': renderNvda(projects),
  }
  const combined = Object.values(rendered).join('\n')
  for (const claim of forbiddenClaims) if (claim.test(combined)) throw new Error(`Unsupported accessibility claim detected: ${claim}`)
  return rendered
}

export function loadBaselineBundles(resultsDir = '.accessibility-results') {
  const names = fs.readdirSync(resultsDir).filter((name) => /^baseline-.*\.json$/.test(name)).sort()
  if (names.length === 0) throw new Error(`No baseline bundles found in ${resultsDir}`)
  return names.map((name) => JSON.parse(fs.readFileSync(path.join(resultsDir, name), 'utf8')))
}

export function writeRenderedBaseline(bundles, outputDir = 'docs/accessibility') {
  const rendered = renderBaselineMarkdown(bundles)
  fs.mkdirSync(outputDir, { recursive: true })
  for (const [name, content] of Object.entries(rendered)) fs.writeFileSync(path.join(outputDir, name), content)
  return rendered
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isDirectRun) {
  const bundles = loadBaselineBundles(process.env.A11Y_RESULTS_DIR ?? '.accessibility-results')
  const rendered = writeRenderedBaseline(bundles, process.env.A11Y_DOCS_DIR ?? 'docs/accessibility')
  console.log(`Rendered ${Object.keys(rendered).length} accessibility evidence documents from ${bundles.length} baseline bundle(s).`)
}
