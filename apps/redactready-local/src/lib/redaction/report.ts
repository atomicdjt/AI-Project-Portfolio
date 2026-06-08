import type { DetectionResult, LoadedDocument, RedactionBox, RedactionCategory, RedactionReport, VerificationResult } from './types'

export function buildRedactionReport(
  document: LoadedDocument,
  detections: DetectionResult[],
  boxes: RedactionBox[],
  verification: VerificationResult,
): RedactionReport {
  const categories: Partial<Record<RedactionCategory, number>> = {}
  for (const detection of detections.filter((item) => item.approved)) {
    categories[detection.category] = (categories[detection.category] ?? 0) + 1
  }

  const warnings = [
    ...document.warnings,
    'This report intentionally excludes raw sensitive values.',
    'Automated detection can miss content. Human review is required before sharing.',
  ]
  const textApplied =
    document.kind === 'text' || document.kind === 'csv'
      ? detections.filter((detection) => detection.approved && detection.textRange).length
      : 0

  return {
    fileName: document.name,
    fileType: document.kind,
    processedAt: new Date().toISOString(),
    localOnly: true,
    totalDetections: detections.length,
    totalAppliedRedactions: boxes.filter((box) => box.approved).length + textApplied,
    categories,
    verification,
    warnings,
  }
}

export function reportToBlob(report: RedactionReport): Blob {
  return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
}
