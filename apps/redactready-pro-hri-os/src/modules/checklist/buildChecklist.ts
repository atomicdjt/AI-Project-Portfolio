import type { ChecklistItem, DocumentItem, RiskScore } from '../../types/hri'

export function buildChecklist(documents: DocumentItem[], scores: RiskScore[]): ChecklistItem[] {
  const items: ChecklistItem[] = []
  const highRiskFindings = documents.flatMap((document) =>
    document.detectedEntities
      .filter((finding) => finding.severity === 'High' || finding.severity === 'Critical')
      .slice(0, 3)
      .map((finding) => ({ document, finding })),
  )

  for (const { document, finding } of highRiskFindings) {
    items.push({
      id: `redact-${items.length + 1}`,
      group: 'Redact Before Sharing',
      priority: finding.severity === 'Critical' ? 'High' : 'Medium',
      explanation: `Redact ${finding.label.toLowerCase()} before sharing this document.`,
      relatedDocument: document.title,
      relatedFinding: finding.match,
      complete: false,
    })
  }

  for (const document of documents.filter((candidate) => candidate.rawText.length < 420)) {
    items.push({
      id: `context-${items.length + 1}`,
      group: 'Clarify / Add Context',
      priority: 'Medium',
      explanation: 'Add a short purpose note or supporting context so the document can stand alone.',
      relatedDocument: document.title,
      complete: false,
    })
  }

  if (scores.some((score) => score.band === 'High' || score.band === 'Critical')) {
    items.push({
      id: `verify-${items.length + 1}`,
      group: 'Verify Accuracy',
      priority: 'High',
      explanation: 'Review high-risk categories manually; the deterministic engine can flag patterns but cannot guarantee context.',
      complete: false,
    })
  }

  items.push(
    {
      id: `organize-${items.length + 1}`,
      group: 'Organize Packet',
      priority: 'Medium',
      explanation: 'Rename documents with clear titles and group them by purpose, date, or recipient.',
      complete: false,
    },
    {
      id: `export-${items.length + 2}`,
      group: 'Export / Save',
      priority: 'Low',
      explanation: 'Generate the Human Risk Intelligence Report after redactions are reviewed.',
      complete: false,
    },
    {
      id: `followup-${items.length + 3}`,
      group: 'Optional Follow-Up',
      priority: 'Low',
      explanation: 'For official submissions, confirm recipient-specific requirements with the relevant professional or agency.',
      complete: false,
    },
  )

  return items
}
