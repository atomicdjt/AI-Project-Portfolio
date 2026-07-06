import { detectDocumentKind } from './fileType'
import { loadImageDocument } from './loadImageDocument'
import { loadTextDocument } from './loadTextDocument'
import type { LoadedDocument } from '../redaction/types'

const LARGE_FILE_WARNING_SIZE = 12 * 1024 * 1024
const MAX_LOCAL_FILE_SIZE = 50 * 1024 * 1024

function withSizeWarning(document: LoadedDocument, file: File): LoadedDocument {
  if (file.size <= LARGE_FILE_WARNING_SIZE) return document
  return {
    ...document,
    warnings: [
      ...document.warnings,
      'Large or complex files may process slowly or fail in the browser. Consider splitting the document and verify exports carefully.',
    ],
  }
}

export async function loadLocalDocument(file: File): Promise<LoadedDocument> {
  const kind = detectDocumentKind(file)
  if (!kind) {
    throw new Error('Unsupported file type. Use PDF, PNG, JPG, JPEG, TXT, or CSV.')
  }

  if (file.size > MAX_LOCAL_FILE_SIZE) {
    throw new Error('This MVP limits local files to 50 MB to avoid browser memory pressure.')
  }

  let document: LoadedDocument
  if (kind === 'pdf') {
    const { renderPdfDocument } = await import('../pdf/renderPdf')
    document = await renderPdfDocument(file)
  } else if (kind === 'image') {
    document = await loadImageDocument(file)
  } else {
    document = await loadTextDocument(file, kind)
  }

  return withSizeWarning(document, file)
}
