import type { RiskLabel, Severity } from '../types/analysis'

export const severityWeights: Record<Severity, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
}

export function scoreFindings(findings: Array<{ severity: Severity }>): number {
  return Math.min(
    100,
    findings.reduce((score, finding) => score + severityWeights[finding.severity], 0),
  )
}

export function getRiskLabel(score: number): RiskLabel {
  if (score >= 70) return 'Severe risk'
  if (score >= 45) return 'High risk'
  if (score >= 20) return 'Concerning'
  return 'Low visible risk'
}
