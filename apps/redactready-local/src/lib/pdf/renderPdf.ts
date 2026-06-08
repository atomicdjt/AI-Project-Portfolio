import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import type { BoundingBox, DocumentPage, LoadedDocument, PdfTextItem } from '../redaction/types'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

interface PdfTextItemLike {
  str?: string
  width?: number
  height?: number
  transform?: number[]
}

interface PdfViewportLike {
  width: number
  height: number
  convertToViewportRectangle: (rect: [number, number, number, number]) => number[]
}

function isPdfTextItemLike(item: unknown): item is PdfTextItemLike {
  return typeof item === 'object' && item !== null && 'str' in item
}

function itemToBox(item: PdfTextItemLike, viewport: PdfViewportLike): BoundingBox | undefined {
  const transform = item.transform
  if (!transform || transform.length < 6) {
    return undefined
  }

  const x = transform[4]
  const y = transform[5]
  const width = item.width ?? 0
  const height = item.height ?? Math.abs(transform[3] ?? 12)
  if (!Number.isFinite(x) || !Number.isFinite(y) || width <= 0 || height <= 0) {
    return undefined
  }

  const rect = viewport.convertToViewportRectangle([x, y, x + width, y + height])
  const left = Math.min(rect[0] ?? 0, rect[2] ?? 0)
  const top = Math.min(rect[1] ?? 0, rect[3] ?? 0)
  const right = Math.max(rect[0] ?? 0, rect[2] ?? 0)
  const bottom = Math.max(rect[1] ?? 0, rect[3] ?? 0)
  return {
    x: left,
    y: top,
    width: Math.max(2, right - left),
    height: Math.max(8, bottom - top),
    coordinateSpace: 'pdf-page',
  }
}

export async function renderPdfDocument(file: File): Promise<LoadedDocument> {
  const buffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: buffer })
  const pdf = await loadingTask.promise
  const pages: DocumentPage[] = []
  const warnings: string[] = []
  let aggregateText = ''

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1.6 })
    const viewportForText = viewport as unknown as PdfViewportLike
    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error(`Could not create a PDF canvas for page ${pageNumber}.`)
    }

    await page.render({ canvas, canvasContext: context, viewport }).promise

    const textContent = await page.getTextContent()
    const pageTextItems: PdfTextItem[] = []
    let pageText = ''

    for (const rawItem of textContent.items) {
      if (!isPdfTextItemLike(rawItem)) continue
      const value = rawItem.str?.trim()
      if (!value) continue

      const start = aggregateText.length + pageText.length
      const end = start + value.length
      const bbox = itemToBox(rawItem, viewportForText)
      if (bbox) {
        pageTextItems.push({
          value,
          range: { start, end },
          bbox,
          pageIndex: pageNumber - 1,
        })
      }
      pageText += `${value} `
    }

    aggregateText += `${pageText}\n`
    pages.push({
      pageIndex: pageNumber - 1,
      width: canvas.width,
      height: canvas.height,
      imageUrl: canvas.toDataURL('image/png'),
      textItems: pageTextItems,
      text: pageText,
    })
  }

  if (!aggregateText.trim()) {
    warnings.push('No selectable PDF text layer was found. Use manual redaction boxes or OCR in a later build.')
  }

  return {
    id: crypto.randomUUID(),
    name: file.name,
    kind: 'pdf',
    mimeType: file.type || 'application/pdf',
    size: file.size,
    text: aggregateText,
    pages,
    createdAt: new Date().toISOString(),
    warnings,
  }
}
