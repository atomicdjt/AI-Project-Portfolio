import type { DocumentKind, OcrStatus } from './types'

export function exportChecklistForKind(kind: DocumentKind | 'unknown', ocrStatus: OcrStatus): string[] {
  const base = ['I understand RedactReady is assistive and does not guarantee detection or redaction.']
  const ocrIncomplete =
    ocrStatus !== 'completed'
      ? 'OCR is experimental and incomplete unless I ran it successfully; scanned/image text may still require manual boxes.'
      : 'OCR results are experimental and require manual verification; handwriting, low contrast, rotated text, and poor scans may be missed.'

  if (kind === 'pdf') {
    return [
      'I visually inspected every PDF page and confirmed each redaction box placement.',
      'I understand PDF text-to-box mapping can be approximate and may need manual adjustment.',
      ocrIncomplete,
      'I understand the flattened PDF export loses selectable text/accessibility semantics and still needs final inspection.',
      'I checked filename, document title, metadata notes, comments/annotations risk, and surrounding context.',
      ...base,
    ]
  }

  if (kind === 'image') {
    return [
      'I visually inspected the full image and drew manual boxes for anything sensitive.',
      ocrIncomplete,
      'I understand image export paints approved boxes into PNG pixels but does not guarantee every visible item was found.',
      'I checked filename, visible identifiers, faces, signatures, barcodes, QR codes, and surrounding context.',
      ...base,
    ]
  }

  if (kind === 'text') {
    return [
      'I reviewed all pattern-based text findings and any custom search terms.',
      'I manually checked for context-sensitive data the detectors may miss.',
      'I verified replacements in the redacted text preview before export.',
      'I checked filename and surrounding context before sharing.',
      ...base,
    ]
  }

  if (kind === 'csv') {
    return [
      'I reviewed all pattern-based CSV findings and any custom search terms.',
      'I verified replacements do not break columns, quoting, formulas, or downstream imports.',
      'I manually checked for context-sensitive data the detectors may miss.',
      'I checked filename and surrounding context before sharing.',
      ...base,
    ]
  }

  return [
    'I manually reviewed the file because this document mode has limited automated support.',
    'I understand there is no guaranteed detection, redaction, compliance, legal, medical, or security outcome.',
    'I checked output content, filename, metadata where applicable, and surrounding context before sharing.',
  ]
}
