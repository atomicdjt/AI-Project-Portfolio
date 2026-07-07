import type { DocumentKind, OcrStatus } from './types'

export interface ChecklistItem {
  id: string
  group: '1. Human Review' | '2. System Limits' | '3. Metadata & Sharing'
  text: string
}

export function exportChecklistForKind(kind: DocumentKind | 'unknown', ocrStatus: OcrStatus): ChecklistItem[] {
  const ocrIncompleteText =
    ocrStatus !== 'completed'
      ? 'I understand automated detection/OCR is experimental and may miss sensitive data.'
      : 'I understand automated detection/OCR may miss sensitive data (e.g., handwriting, low contrast).'

  const base: ChecklistItem[] = [
    { id: 'base-review', group: '1. Human Review', text: 'I manually reviewed all visible content.' },
    { id: 'base-placement', group: '1. Human Review', text: 'I verified redaction placement before export.' },
    { id: 'base-limits', group: '2. System Limits', text: ocrIncompleteText },
    { id: 'base-metadata', group: '3. Metadata & Sharing', text: 'I understand metadata/hidden content handling is limited/best-effort.' },
    { id: 'base-inspect', group: '3. Metadata & Sharing', text: 'I will inspect the exported file before sharing.' },
  ]

  if (kind === 'pdf') {
    return [
      ...base,
      { id: 'pdf-approx', group: '2. System Limits', text: 'I understand PDF text-to-box mapping can be approximate.' },
      { id: 'pdf-flatten', group: '3. Metadata & Sharing', text: 'I understand the flattened PDF export loses selectable text/searchability.' },
    ]
  }

  if (kind === 'image') {
    return [
      ...base,
      { id: 'img-pixels', group: '2. System Limits', text: 'I understand image export paints approved boxes into PNG pixels but may not find every item.' },
    ]
  }

  if (kind === 'csv') {
    return [
      ...base,
      { id: 'csv-break', group: '3. Metadata & Sharing', text: 'I verified replacements do not break columns, quoting, or formulas.' },
    ]
  }

  return base
}
