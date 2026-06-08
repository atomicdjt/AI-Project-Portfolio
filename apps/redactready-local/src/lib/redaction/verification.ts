import type { DetectionResult, DocumentKind, RedactionBox, VerificationResult } from './types'

export function verifyRedactedText(redactedText: string, detections: DetectionResult[]): VerificationResult {
  const approved = detections.filter((detection) => detection.approved && detection.rawValue.trim())
  const leaked = approved.filter((detection) => redactedText.includes(detection.rawValue))
  const checkedAt = new Date().toISOString()

  if (leaked.length > 0) {
    return {
      status: 'fail',
      title: 'Potential sensitive text remains',
      checkedAt,
      checkedValues: approved.length,
      leakedValues: leaked.length,
      messages: [
        'One or more approved sensitive values still appears in the exported text.',
        'Do not share this file until the matches are corrected.',
      ],
    }
  }

  return {
    status: 'pass',
    title: 'No approved sensitive values found',
    checkedAt,
    checkedValues: approved.length,
    leakedValues: 0,
    messages: ['Approved text detections were replaced before export.'],
  }
}

export function verifyVisualExport(kind: DocumentKind, detections: DetectionResult[], boxes: RedactionBox[]): VerificationResult {
  const approvedDetections = detections.filter((detection) => detection.approved)
  const approvedTextWithoutBox = approvedDetections.filter((detection) => detection.textRange && !detection.bbox)
  const approvedBoxes = boxes.filter((box) => box.approved)
  const checkedAt = new Date().toISOString()

  if (approvedTextWithoutBox.length > 0) {
    return {
      status: 'warning',
      title: 'Some text detections need manual boxes',
      checkedAt,
      checkedValues: approvedDetections.length,
      leakedValues: approvedTextWithoutBox.length,
      messages: [
        'The export was flattened, but at least one approved text detection did not have a reliable visual box.',
        'Add manual redaction boxes over those regions before sharing.',
      ],
    }
  }

  if (kind === 'pdf') {
    return {
      status: 'pass',
      title: 'Flattened PDF export created',
      checkedAt,
      checkedValues: approvedDetections.length,
      leakedValues: 0,
      messages: [
        'PDF pages were rasterized to canvas and exported as a new flattened PDF.',
        'The original PDF text layer is not intentionally preserved in the export.',
      ],
    }
  }

  return {
    status: approvedBoxes.length > 0 ? 'pass' : 'warning',
    title: approvedBoxes.length > 0 ? 'Image pixels overwritten' : 'No redaction boxes applied',
    checkedAt,
    checkedValues: approvedBoxes.length,
    leakedValues: 0,
    messages:
      approvedBoxes.length > 0
        ? ['Approved redaction boxes were painted directly into the exported image pixels.']
        : ['No approved image boxes were applied. Review the image manually before sharing.'],
  }
}
