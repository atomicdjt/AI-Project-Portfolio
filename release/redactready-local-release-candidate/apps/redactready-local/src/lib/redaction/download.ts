export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 500)
}

export function redactedFileName(sourceName: string, extension: string): string {
  const base = sourceName.replace(/\.[^.]+$/, '')
  return `${base || 'document'}-redacted.${extension}`
}
