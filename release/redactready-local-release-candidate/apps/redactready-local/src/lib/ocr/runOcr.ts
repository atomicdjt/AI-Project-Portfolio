import { detectSensitiveText } from '../detectors'
import type { BoundingBox, DetectionResult, DocumentKind, DocumentPage } from '../redaction/types'

interface TesseractBbox {
  x0: number
  y0: number
  x1: number
  y1: number
}

interface TesseractWord {
  text: string
  confidence: number
  bbox: TesseractBbox
}

interface TesseractLine {
  words: TesseractWord[]
}

interface TesseractParagraph {
  lines: TesseractLine[]
}

interface TesseractBlock {
  paragraphs: TesseractParagraph[]
}

interface TesseractPage {
  text: string
  blocks: TesseractBlock[] | null
}

interface TesseractWorker {
  recognize(
    image: string,
    options?: Record<string, unknown>,
    output?: { text?: boolean; blocks?: boolean },
  ): Promise<{ data: TesseractPage }>
  terminate(): Promise<unknown>
}

interface TesseractModule {
  createWorker(
    language?: string,
    oem?: number,
    options?: {
      workerPath?: string
      corePath?: string
      langPath?: string
      gzip?: boolean
      cacheMethod?: string
    },
  ): Promise<TesseractWorker>
}

interface OcrWordRange {
  text: string
  range: { start: number; end: number }
  bbox: BoundingBox
  confidence: number
}

export interface OcrProgress {
  pageIndex: number
  pageCount: number
  message: string
}

export interface OcrRunResult {
  detections: DetectionResult[]
  textLength: number
  warnings: string[]
}

function wordsFromBlocks(blocks: TesseractBlock[] | null, kind: DocumentKind): OcrWordRange[] {
  if (!blocks) return []
  const words = blocks.flatMap((block) => block.paragraphs.flatMap((paragraph) => paragraph.lines.flatMap((line) => line.words)))
  return words
    .filter((word) => word.text.trim().length > 0)
    .map((word) => ({
      text: word.text.trim(),
      range: { start: 0, end: 0 },
      bbox: {
        x: Math.max(0, word.bbox.x0),
        y: Math.max(0, word.bbox.y0),
        width: Math.max(1, word.bbox.x1 - word.bbox.x0),
        height: Math.max(1, word.bbox.y1 - word.bbox.y0),
        coordinateSpace: kind === 'pdf' ? 'pdf-page' : 'image',
      },
      confidence: Math.max(0, Math.min(1, word.confidence / 100)),
    }))
}

function attachWordRanges(text: string, words: OcrWordRange[]): OcrWordRange[] {
  let cursor = 0
  return words.map((word) => {
    const start = text.indexOf(word.text, cursor)
    if (start === -1) {
      return { ...word, range: { start: cursor, end: cursor } }
    }
    cursor = start + word.text.length
    return { ...word, range: { start, end: start + word.text.length } }
  })
}

function unionWordBoxes(words: OcrWordRange[]): BoundingBox | undefined {
  if (words.length === 0) return undefined
  const left = Math.min(...words.map((word) => word.bbox.x))
  const top = Math.min(...words.map((word) => word.bbox.y))
  const right = Math.max(...words.map((word) => word.bbox.x + word.bbox.width))
  const bottom = Math.max(...words.map((word) => word.bbox.y + word.bbox.height))
  return {
    x: Math.max(0, left - 2),
    y: Math.max(0, top - 2),
    width: right - left + 4,
    height: bottom - top + 4,
    coordinateSpace: words[0]?.bbox.coordinateSpace ?? 'image',
  }
}

function mapOcrDetections(page: DocumentPage, text: string, words: OcrWordRange[], customTerms: string[]): DetectionResult[] {
  const detections = detectSensitiveText(text, customTerms, 'ocr')
  return detections.map((detection) => {
    const range = detection.textRange
    const overlappingWords = range ? words.filter((word) => range.start < word.range.end && range.end > word.range.start) : []
    const bbox = unionWordBoxes(overlappingWords)
    return {
      ...detection,
      id: `ocr-${page.pageIndex}-${detection.id}`,
      pageIndex: page.pageIndex,
      bbox,
      placement: bbox ? 'approximate-visual' : 'manual-required',
      confidence: Math.min(detection.confidence, overlappingWords.length > 0 ? Math.max(...overlappingWords.map((word) => word.confidence)) : 0.62),
    }
  })
}

export async function runLocalOcr(
  pages: DocumentPage[],
  kind: DocumentKind,
  customTerms: string[],
  onProgress: (progress: OcrProgress) => void,
): Promise<OcrRunResult> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return {
      detections: [],
      textLength: 0,
      warnings: ['OCR is unsupported in this runtime because browser workers are unavailable.'],
    }
  }

  if (pages.length === 0) {
    return {
      detections: [],
      textLength: 0,
      warnings: ['OCR requires a rendered PDF page or image preview.'],
    }
  }

  const tesseract = (await import('tesseract.js')) as unknown as TesseractModule
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const ocrAssetPath = `${basePath}/ocr`
  const worker = await tesseract.createWorker('eng', 1, {
    workerPath: `${ocrAssetPath}/worker.min.js`,
    corePath: ocrAssetPath,
    langPath: `${ocrAssetPath}/lang`,
    gzip: true,
    cacheMethod: 'write',
  })
  const detections: DetectionResult[] = []
  const warnings = [
    'OCR is experimental and may miss text.',
    'OCR results require manual verification.',
    'Handwriting, poor scans, low contrast, and rotated text may be missed.',
  ]
  let textLength = 0

  try {
    for (const page of pages) {
      onProgress({ pageIndex: page.pageIndex, pageCount: pages.length, message: `Running experimental OCR on page ${page.pageIndex + 1} of ${pages.length}...` })
      const result = await worker.recognize(page.imageUrl, {}, { text: true, blocks: true })
      const text = result.data.text.trim()
      textLength += text.length
      const words = attachWordRanges(text, wordsFromBlocks(result.data.blocks, kind))
      detections.push(...mapOcrDetections(page, text, words, customTerms))
    }
  } finally {
    await worker.terminate()
  }

  return { detections, textLength, warnings }
}
