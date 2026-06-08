import type { DocumentKind, LoadedDocument } from '../redaction/types'

export async function loadTextDocument(file: File, kind: Extract<DocumentKind, 'text' | 'csv'>): Promise<LoadedDocument> {
  const text = await file.text()
  return {
    id: crypto.randomUUID(),
    name: file.name,
    kind,
    mimeType: file.type || (kind === 'csv' ? 'text/csv' : 'text/plain'),
    size: file.size,
    text,
    pages: [],
    createdAt: new Date().toISOString(),
    warnings: kind === 'csv' ? ['CSV export preserves delimiter structure by replacing matched values in-place.'] : [],
  }
}
