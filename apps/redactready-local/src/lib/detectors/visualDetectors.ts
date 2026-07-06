import type { DetectionResult, DocumentPage } from '../redaction/types'
import { maskValue } from './utils'

interface BarcodeResultLike {
  rawValue?: string
  format?: string
  boundingBox?: DOMRectReadOnly
}

interface BarcodeDetectorLike {
  detect: (source: HTMLImageElement) => Promise<BarcodeResultLike[]>
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike
}

async function imageFromUrl(url: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  await image.decode()
  return image
}

function getBarcodeDetector(): BarcodeDetectorConstructor | undefined {
  const candidate = (globalThis as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
  return candidate
}

export async function detectBarcodesOnPages(pages: DocumentPage[]): Promise<DetectionResult[]> {
  const BarcodeDetector = getBarcodeDetector()
  if (!BarcodeDetector) {
    return []
  }

  const detector = new BarcodeDetector({
    formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a', 'data_matrix', 'pdf417'],
  })
  const createdAt = new Date().toISOString()
  const detections: DetectionResult[] = []

  for (const page of pages) {
    const image = await imageFromUrl(page.imageUrl)
    const results = await detector.detect(image)
    for (const result of results) {
      const box = result.boundingBox
      if (!box) continue
      const rawValue = result.rawValue || result.format || 'barcode'
      detections.push({
        id: `barcode-${page.pageIndex}-${Math.round(box.x)}-${Math.round(box.y)}`,
        category: 'barcode_qr',
        label: result.format ? `Possible ${result.format}` : 'Possible QR/barcode',
        rawValue,
        valuePreview: result.rawValue ? maskValue(result.rawValue) : 'visual code',
        confidence: result.rawValue ? 0.86 : 0.68,
        pageIndex: page.pageIndex,
        source: 'visual-detector',
        bbox: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          coordinateSpace: page.pageIndex === 0 ? 'image' : 'pdf-page',
        },
        approved: true,
        createdAt,
      })
    }
  }

  return detections
}
