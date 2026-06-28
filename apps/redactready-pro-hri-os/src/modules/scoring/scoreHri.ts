import type { DetectionFinding, DocumentItem, RiskScore, SeverityBand } from '../../types/hri'

const severityWeight: Record<SeverityBand, number> = {
  Low: 8,
  Moderate: 16,
  High: 26,
  Critical: 38,
}

export function bandForScore(score: number): SeverityBand {
  if (score >= 76) return 'Critical'
  if (score >= 55) return 'High'
  if (score >= 30) return 'Moderate'
  return 'Low'
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function findingScore(findings: DetectionFinding[], filter?: (finding: DetectionFinding) => boolean): number {
  const scoped = filter ? findings.filter(filter) : findings
  return clampScore(scoped.reduce((total, finding) => total + severityWeight[finding.severity] * finding.confidence, 0))
}

export function scoreHri(documents: DocumentItem[]): { categoryScores: RiskScore[]; overallScore: number; overallBand: SeverityBand } {
  const allFindings = documents.flatMap((document) => document.detectedEntities)
  const criticalCount = allFindings.filter((finding) => finding.severity === 'Critical').length
  const missingContextCount = documents.filter((document) => document.rawText.length < 420).length
  const mixedConfidenceCount = documents.filter((document) => document.confidenceLevel !== 'High').length
  const hasDates = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4}/i.test(
    documents.map((document) => document.rawText).join('\n'),
  )
  const hasPurpose = /\b(?:purpose|goal|request|seeking|applying|review|share|submit)\b/i.test(
    documents.map((document) => document.rawText).join('\n'),
  )

  const categoryScores: RiskScore[] = [
    {
      category: 'Privacy Exposure',
      score: findingScore(allFindings),
      band: 'Low',
      explanation: 'Measures the amount and severity of personal or sensitive information present in the packet.',
      suggestions: ['Redact direct contact fields and identifiers before sharing.', 'Review low-confidence matches manually.'],
    },
    {
      category: 'Administrative Risk',
      score: clampScore(missingContextCount * 18 + mixedConfidenceCount * 12 + (documents.length === 1 ? 12 : 0)),
      band: 'Low',
      explanation: 'Flags unclear packet structure, short documents, and classification uncertainty that may cause processing friction.',
      suggestions: ['Add a cover note that explains document purpose.', 'Use clear document titles and dates.'],
    },
    {
      category: 'Identity Risk',
      score: findingScore(allFindings, (finding) =>
        ['ssn', 'date_of_birth', 'government_id', 'financial_information', 'medical_record_id', 'insurance_member_id'].includes(
          finding.type,
        ),
      ),
      band: 'Low',
      explanation: 'Focuses on identifiers that can increase identity misuse risk if shared too broadly.',
      suggestions: ['Use maximum privacy mode for public copies.', 'Keep full identifiers only in secure official submissions.'],
    },
    {
      category: 'Context Risk',
      score: clampScore((hasPurpose ? 8 : 34) + (hasDates ? 8 : 22) + missingContextCount * 10),
      band: 'Low',
      explanation: 'Assesses whether the packet gives enough purpose, dates, and supporting explanation to be understandable.',
      suggestions: ['Add a short summary of the packet purpose.', 'Clarify important dates and unresolved gaps.'],
    },
    {
      category: 'Sharing Readiness',
      score: clampScore(100 - findingScore(allFindings) * 0.72 - missingContextCount * 8),
      band: 'Low',
      explanation: 'Estimates whether the packet appears safe and coherent enough to share after redaction.',
      suggestions: ['Generate a redacted version and compare it with the original.', 'Export the report after completing high-priority actions.'],
    },
    {
      category: 'Evidence Strength',
      score: clampScore((documents.length >= 3 ? 78 : 48) + (hasDates ? 10 : -8) + (hasPurpose ? 8 : -10) - criticalCount * 3),
      band: 'Low',
      explanation: 'Estimates whether the documents support a stated purpose with enough structure and references.',
      suggestions: ['Group evidence by claim or timeline.', 'Mark missing documents before sharing the packet.'],
    },
  ].map((score) => ({ ...score, band: bandForScore(score.score) }))

  const exposureRisk = categoryScores.find((score) => score.category === 'Privacy Exposure')?.score ?? 0
  const adminRisk = categoryScores.find((score) => score.category === 'Administrative Risk')?.score ?? 0
  const contextRisk = categoryScores.find((score) => score.category === 'Context Risk')?.score ?? 0
  const readiness = categoryScores.find((score) => score.category === 'Sharing Readiness')?.score ?? 0
  const evidence = categoryScores.find((score) => score.category === 'Evidence Strength')?.score ?? 0
  const overallScore = clampScore(exposureRisk * 0.3 + adminRisk * 0.18 + contextRisk * 0.18 + (100 - readiness) * 0.18 + (100 - evidence) * 0.16)

  return {
    categoryScores,
    overallScore,
    overallBand: bandForScore(overallScore),
  }
}
