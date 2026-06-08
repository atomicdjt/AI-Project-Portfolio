import { detectDocumentKind } from './fileType'
import { loadImageDocument } from './loadImageDocument'
import { loadTextDocument } from './loadTextDocument'
import { renderPdfDocument } from '../pdf/renderPdf'
import type { LoadedDocument } from '../redaction/types'

export async function loadLocalDocument(file: File): Promise<LoadedDocument> {
  const kind = detectDocumentKind(file)
  if (!kind) {
    throw new Error('Unsupported file type. Use PDF, PNG, JPG, JPEG, TXT, or CSV.')
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error('This MVP limits local files to 50 MB to avoid browser memory pressure.')
  }

  if (kind === 'pdf') return renderPdfDocument(file)
  if (kind === 'image') return loadImageDocument(file)
  return loadTextDocument(file, kind)
}
