import { flattenVisibleLayers, type ImageDocument } from '../document/DocumentModel'

export type ExportOptions = {
  format: 'png' | 'jpeg'
  quality?: number
  transparentBackground?: boolean
}

export async function exportFlattenedImage(document: ImageDocument, options: ExportOptions): Promise<Blob> {
  const canvas = flattenVisibleLayers(document, options.format === 'png' && Boolean(options.transparentBackground))
  const type = options.format === 'jpeg' ? 'image/jpeg' : 'image/png'
  const quality = options.format === 'jpeg' ? Math.max(0.1, Math.min(1, options.quality ?? 0.92)) : undefined

  return canvasToBlob(canvas, type, quality)
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('The image could not be encoded.'))
        }
      },
      type,
      quality,
    )
  })
}
