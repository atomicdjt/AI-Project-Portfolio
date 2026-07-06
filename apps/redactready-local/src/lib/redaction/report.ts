import type { DetectionResult, LoadedDocument, RedactionBox, RedactionCategory, RedactionReport, VerificationResult } from './types'
import type { OcrStatus } from './types'
import { metadataSummaryForKind } from './metadata'

export function buildRedactionReport(
  document: LoadedDocument,
  detections: DetectionResult[],
  boxes: RedactionBox[],
  verification: VerificationResult,
  ocrStatus: OcrStatus = 'idle',
): RedactionReport {
  const categories: Partial<Record<RedactionCategory, number>> = {}
  for (const detection of detections.filter((item) => item.approved)) {
    categories[detection.category] = (categories[detection.category] ?? 0) + 1
  }

  const warnings = [
    ...document.warnings,
    'This report intentionally excludes raw sensitive values.',
    'Automated detection can miss content. Human review is required before sharing.',
    'This report is not proof of complete sanitization.',
  ]
  const textApplied =
    document.kind === 'text' || document.kind === 'csv'
      ? detections.filter((detection) => detection.approved && detection.textRange).length
      : 0
  const approvedDetections = detections.filter((detection) => detection.approved).length
  const metadata = metadataSummaryForKind(document.kind)
  const barcodeStatus: import('./types').BarcodeCapabilityStatus = 'BarcodeDetector' in globalThis ? 'available' : 'unavailable'

  return {
    fileName: document.name,
    fileType: document.kind,
    processedAt: new Date().toISOString(),
    localOnly: true,
    totalDetections: detections.length,
    totalAppliedRedactions: boxes.filter((box) => box.approved).length + textApplied,
    totalRejectedOrIgnored: detections.length - approvedDetections,
    manualBoxes: boxes.filter((box) => box.approved && box.createdBy === 'user').length,
    ocrStatus,
    barcodeStatus,
    metadataHandling: metadata.status,
    manualVerificationCompleted: true, // If they exported this report, they passed the checklist gating
    metadataNotes: [...metadata.notes, ...document.metadataNotes],
    categories,
    verification,
    warnings,
  }
}

export function reportToBlob(report: RedactionReport): Blob {
  return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
}
