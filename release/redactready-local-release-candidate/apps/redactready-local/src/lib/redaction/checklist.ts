import type { DocumentKind, OcrStatus } from './types'

export interface ChecklistItem {
  id: string
  group: 'Required Verification' | 'File-Specific Limitations' | 'Export & Report Notes'
  text: string
}

export function exportChecklistForKind(kind: DocumentKind | 'unknown', ocrStatus: OcrStatus): ChecklistItem[] {
  const base: ChecklistItem[] = [
    {
      id: 'base-assistive',
      group: 'Export & Report Notes',
      text: 'I understand RedactReady is assistive and does not guarantee detection or redaction.',
    }
  ]
  const ocrIncompleteText =
    ocrStatus !== 'completed'
      ? 'OCR is experimental and incomplete unless successfully run; scanned text may still require manual boxes.'
      : 'OCR results are experimental and require manual verification; handwriting, low contrast, or rotated text may be missed.'

  if (kind === 'pdf') {
    return [
      { id: 'pdf-verify', group: 'Required Verification', text: 'I visually inspected every PDF page and confirmed each redaction box placement.' },
      { id: 'pdf-context', group: 'Required Verification', text: 'I checked filename, document title, metadata notes, comments/annotations risk, and surrounding context.' },
      { id: 'pdf-approx', group: 'File-Specific Limitations', text: 'I understand PDF text-to-box mapping can be approximate and may need manual adjustment.' },
      { id: 'pdf-ocr', group: 'File-Specific Limitations', text: ocrIncompleteText },
      { id: 'pdf-flatten', group: 'Export & Report Notes', text: 'I understand the flattened PDF export loses selectable text and still needs final inspection.' },
      ...base,
    ]
  }

  if (kind === 'image') {
    return [
      { id: 'img-verify', group: 'Required Verification', text: 'I visually inspected the full image and drew manual boxes for anything sensitive.' },
      { id: 'img-context', group: 'Required Verification', text: 'I checked filename, visible identifiers, faces, signatures, barcodes, QR codes, and surrounding context.' },
      { id: 'img-ocr', group: 'File-Specific Limitations', text: ocrIncompleteText },
      { id: 'img-pixels', group: 'Export & Report Notes', text: 'I understand image export paints approved boxes into PNG pixels but does not guarantee every visible item was found.' },
      ...base,
    ]
  }

  if (kind === 'text') {
    return [
      { id: 'text-verify', group: 'Required Verification', text: 'I reviewed all pattern-based text findings and any custom search terms.' },
      { id: 'text-context', group: 'Required Verification', text: 'I manually checked for context-sensitive data the detectors may miss.' },
      { id: 'text-check', group: 'Required Verification', text: 'I checked filename and surrounding context before sharing.' },
      { id: 'text-replace', group: 'Export & Report Notes', text: 'I verified replacements in the redacted text preview before export.' },
      ...base,
    ]
  }

  if (kind === 'csv') {
    return [
      { id: 'csv-verify', group: 'Required Verification', text: 'I reviewed all pattern-based CSV findings and any custom search terms.' },
      { id: 'csv-context', group: 'Required Verification', text: 'I manually checked for context-sensitive data the detectors may miss.' },
      { id: 'csv-check', group: 'Required Verification', text: 'I checked filename and surrounding context before sharing.' },
      { id: 'csv-break', group: 'Export & Report Notes', text: 'I verified replacements do not break columns, quoting, formulas, or downstream imports.' },
      ...base,
    ]
  }

  return [
    { id: 'unk-verify', group: 'Required Verification', text: 'I manually reviewed the file because this document mode has limited automated support.' },
    { id: 'unk-context', group: 'Required Verification', text: 'I checked output content, filename, metadata where applicable, and surrounding context before sharing.' },
    { id: 'unk-limits', group: 'File-Specific Limitations', text: 'I understand there is no guaranteed detection, redaction, compliance, legal, medical, or security outcome.' },
  ]
}
