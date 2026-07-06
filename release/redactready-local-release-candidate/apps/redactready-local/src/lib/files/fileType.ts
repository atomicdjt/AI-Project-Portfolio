import type { DocumentKind } from '../redaction/types'

const extensionToKind: Record<string, DocumentKind> = {
  pdf: 'pdf',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  txt: 'text',
  csv: 'csv',
}

export const SUPPORTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.csv']

export function detectDocumentKind(file: File): DocumentKind | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (extensionToKind[extension]) {
    return extensionToKind[extension]
  }

  if (file.type === 'application/pdf') return 'pdf'
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('text/')) return 'text'
  return null
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
