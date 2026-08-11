import type { DetectionFinding, RedactionRule } from '../../types/hri'

export function buildDefaultRules(findings: DetectionFinding[], enabled = true): RedactionRule[] {
  return findings.map((finding) => ({
    findingId: finding.id,
    enabled,
    label: finding.suggestedRedaction,
  }))
}

export function redactText(text: string, findings: DetectionFinding[], rules: RedactionRule[]): string {
  const activeRules = new Map(rules.filter((rule) => rule.enabled).map((rule) => [rule.findingId, rule.label]))
  const candidates = findings
    .filter((finding) => activeRules.has(finding.id))
    .filter(
      (finding) =>
        Number.isInteger(finding.start) &&
        Number.isInteger(finding.end) &&
        finding.start >= 0 &&
        finding.end > finding.start &&
        finding.end <= text.length &&
        text.slice(finding.start, finding.end) === finding.match,
    )
    .sort((a, b) => a.start - b.start || b.end - a.end || a.id.localeCompare(b.id))

  const activeFindings: DetectionFinding[] = []
  for (const finding of candidates) {
    const previous = activeFindings.at(-1)
    if (!previous || finding.start >= previous.end) activeFindings.push(finding)
  }

  return activeFindings.reverse().reduce((output, finding) => {
    const label = activeRules.get(finding.id) ?? finding.suggestedRedaction
    return `${output.slice(0, finding.start)}${label}${output.slice(finding.end)}`
  }, text)
}
