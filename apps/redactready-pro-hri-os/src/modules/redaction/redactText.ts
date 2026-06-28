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
  const activeFindings = findings
    .filter((finding) => activeRules.has(finding.id))
    .sort((a, b) => b.start - a.start)

  return activeFindings.reduce((output, finding) => {
    const label = activeRules.get(finding.id) ?? finding.suggestedRedaction
    return `${output.slice(0, finding.start)}${label}${output.slice(finding.end)}`
  }, text)
}
