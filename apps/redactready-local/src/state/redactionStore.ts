import { create } from 'zustand'
import { detectSensitiveText } from '../lib/detectors'
import { detectBarcodesOnPages, isBarcodeDetectorAvailable } from '../lib/detectors/visualDetectors'
import { loadLocalDocument } from '../lib/files/loadDocument'
import { runLocalOcr } from '../lib/ocr/runOcr'
import { exportRedactedImage } from '../lib/redaction/applyCanvasRedactions'
import { exportFlattenedPdf } from '../lib/redaction/exportFlattenedPdf'
import { metadataSummaryForKind } from '../lib/redaction/metadata'
import { attachPdfTextBoxes, boxesFromDetections } from '../lib/redaction/pdfTextMapping'
import { buildRedactionReport, reportToBlob } from '../lib/redaction/report'
import { exportRedactedTextBlob, redactTextContent } from '../lib/redaction/textRedaction'
import { verifyRedactedText, verifyVisualExport } from '../lib/redaction/verification'
import type {
  BoundingBox,
  DetectionResult,
  LoadedDocument,
  BarcodeCapabilityStatus,
  MetadataHandlingStatus,
  OcrStatus,
  RedactionBox,
  RedactionCategory,
  VerificationResult,
} from '../lib/redaction/types'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ExportResult {
  blob: Blob
  fileName: string
  verification: VerificationResult
  summary: ExportSummary
}

export interface ExportSummary {
  fileName: string
  fileType: LoadedDocument['kind']
  findingsReviewed: number
  approvedDetections: number
  rejectedOrIgnored: number
  redactedCount: number
  manualBoxes: number
  metadataHandling: MetadataHandlingStatus
  metadataNotes: string[]
  ocrStatus: OcrStatus
}

interface RedactionState {
  document: LoadedDocument | null
  detections: DetectionResult[]
  boxes: RedactionBox[]
  customTerms: string[]
  selectedPageIndex: number
  selectedBoxId: string | null
  zoom: number
  manualMode: boolean
  manualCategory: RedactionCategory
  status: LoadStatus
  progressMessage: string
  error: string | null
  lastVerification: VerificationResult | null
  lastExportSummary: ExportSummary | null
  ocrStatus: OcrStatus
  ocrProgressMessage: string
  barcodeStatus: BarcodeCapabilityStatus
  loadFile: (file: File) => Promise<void>
  runOcr: () => Promise<void>
  addCustomTerm: (term: string) => void
  toggleDetection: (id: string) => void
  markDetectionReviewed: (id: string) => void
  setCategoryApproval: (category: RedactionCategory, approved: boolean) => void
  addManualBox: (pageIndex: number, bbox: BoundingBox) => void
  updateBox: (id: string, bbox: BoundingBox) => void
  deleteBox: (id: string) => void
  setSelectedBox: (id: string | null) => void
  setSelectedPage: (pageIndex: number) => void
  setZoom: (zoom: number) => void
  setManualMode: (enabled: boolean) => void
  setManualCategory: (category: RedactionCategory) => void
  clearSession: () => void
  exportRedactedFile: () => Promise<ExportResult>
  exportReport: () => Blob
}

function preserveApproval(next: DetectionResult[], previous: DetectionResult[]): DetectionResult[] {
  const approvalById = new Map(previous.map((detection) => [detection.id, detection.approved]))
  return next.map((detection) => ({
    ...detection,
    approved: approvalById.get(detection.id) ?? detection.approved,
  }))
}

function rebuildDetectorBoxes(detections: DetectionResult[], previousBoxes: RedactionBox[]): RedactionBox[] {
  const previousById = new Map(previousBoxes.map((box) => [box.id, box]))
  const detectorBoxes = boxesFromDetections(detections).map((box) => {
    const previous = previousById.get(box.id)
    return previous ? { ...box, bbox: previous.bbox, approved: box.approved } : box
  })
  const manualBoxes = previousBoxes.filter((box) => box.createdBy === 'user')
  return [...detectorBoxes, ...manualBoxes]
}

function mergeDetections(existing: DetectionResult[], incoming: DetectionResult[]): DetectionResult[] {
  const byId = new Map(existing.map((detection) => [detection.id, detection]))
  for (const detection of incoming) {
    byId.set(detection.id, detection)
  }
  return [...byId.values()]
}

function clampZoom(value: number): number {
  return Math.min(2.4, Math.max(0.45, value))
}

function normalizeBox(bbox: BoundingBox): BoundingBox {
  const x = bbox.width < 0 ? bbox.x + bbox.width : bbox.x
  const y = bbox.height < 0 ? bbox.y + bbox.height : bbox.y
  return {
    ...bbox,
    x,
    y,
    width: Math.abs(bbox.width),
    height: Math.abs(bbox.height),
  }
}

function computeVisualVerification(document: LoadedDocument, detections: DetectionResult[], boxes: RedactionBox[]): VerificationResult {
  if (document.kind === 'text' || document.kind === 'csv') {
    const redactedText = redactTextContent(document.text, detections)
    return verifyRedactedText(redactedText, detections)
  }
  return verifyVisualExport(document.kind, detections, boxes)
}

function exportSummary(
  document: LoadedDocument,
  detections: DetectionResult[],
  boxes: RedactionBox[],
  fileName: string,
  ocrStatus: OcrStatus,
): ExportSummary {
  const metadata = metadataSummaryForKind(document.kind)
  const textApplied =
    document.kind === 'text' || document.kind === 'csv'
      ? detections.filter((detection) => detection.approved && detection.textRange).length
      : 0
  const approvedBoxes = boxes.filter((box) => box.approved)
  const approvedDetections = detections.filter((detection) => detection.approved).length
  return {
    fileName,
    fileType: document.kind,
    findingsReviewed: detections.length,
    approvedDetections,
    rejectedOrIgnored: detections.length - approvedDetections,
    redactedCount: approvedBoxes.length + textApplied,
    manualBoxes: approvedBoxes.filter((box) => box.createdBy === 'user').length,
    metadataHandling: metadata.status,
    metadataNotes: [...metadata.notes, ...document.metadataNotes],
    ocrStatus,
  }
}

export const useRedactionStore = create<RedactionState>((set, get) => ({
  document: null,
  detections: [],
  boxes: [],
  customTerms: [],
  selectedPageIndex: 0,
  selectedBoxId: null,
  zoom: 0.85,
  manualMode: false,
  manualCategory: 'custom',
  status: 'idle',
  progressMessage: 'Waiting for a local file.',
  error: null,
  lastVerification: null,
  lastExportSummary: null,
  ocrStatus: 'idle',
  ocrProgressMessage: 'OCR has not been run.',
  barcodeStatus: 'not-applicable',

  async loadFile(file) {
    set({
      status: 'loading',
      progressMessage: 'Reading file locally...',
      error: null,
      lastVerification: null,
      lastExportSummary: null,
      ocrStatus: 'idle',
      ocrProgressMessage: 'OCR has not been run.',
      barcodeStatus: 'not-applicable',
      selectedPageIndex: 0,
      selectedBoxId: null,
    })

    try {
      const document = await loadLocalDocument(file)
      set({ progressMessage: 'Running local detectors...' })

      const textDetections = detectSensitiveText(document.text)
      const mappedTextDetections =
        document.kind === 'pdf' ? attachPdfTextBoxes(textDetections, document.pages) : textDetections

      set({ progressMessage: 'Checking browser visual detectors where available...' })
      const barcodeAvailable = document.pages.length > 0 && isBarcodeDetectorAvailable()
      const visualDetections = barcodeAvailable ? await detectBarcodesOnPages(document.pages).catch(() => []) : []
      const detections = [...mappedTextDetections, ...visualDetections]
      const boxes = rebuildDetectorBoxes(detections, [])
      const barcodeStatus: BarcodeCapabilityStatus =
        document.pages.length === 0 ? 'not-applicable' : barcodeAvailable ? 'available' : 'unavailable'

      set({
        document,
        detections,
        boxes,
        customTerms: [],
        status: 'ready',
        progressMessage: `Found ${detections.length} review item${detections.length === 1 ? '' : 's'}.`,
        error: null,
        zoom: document.kind === 'text' || document.kind === 'csv' ? 1 : 0.85,
        barcodeStatus,
      })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Could not load this file.',
        progressMessage: 'File could not be processed.',
      })
    }
  },

  async runOcr() {
    const document = get().document
    if (!document || document.pages.length === 0) {
      set({
        ocrStatus: 'unsupported',
        ocrProgressMessage: 'OCR requires a rendered PDF page or image.',
        progressMessage: 'OCR is unavailable for this file type.',
      })
      return
    }

    set({
      ocrStatus: 'running',
      ocrProgressMessage: 'Starting experimental OCR...',
      progressMessage: 'Starting experimental OCR...',
      error: null,
      lastVerification: null,
      lastExportSummary: null,
    })

    try {
      const result = await runLocalOcr(document.pages, document.kind, get().customTerms, (progress) => {
        set({
          ocrProgressMessage: progress.message,
          progressMessage: progress.message,
        })
      })
      const detections = mergeDetections(
        get().detections.filter((detection) => detection.source !== 'ocr'),
        result.detections,
      )
      const boxes = rebuildDetectorBoxes(detections, get().boxes)
      set({
        detections,
        boxes,
        ocrStatus: 'completed',
        ocrProgressMessage:
          result.detections.length > 0
            ? `OCR completed. Found ${result.detections.length} possible OCR-derived item${result.detections.length === 1 ? '' : 's'}.`
            : 'OCR completed. No pattern matches were found in OCR text.',
        progressMessage: `OCR completed with ${result.textLength} recognized character${result.textLength === 1 ? '' : 's'}.`,
        document: {
          ...document,
          warnings: [...document.warnings, ...result.warnings],
        },
      })
    } catch (error) {
      set({
        ocrStatus: 'failed',
        ocrProgressMessage: error instanceof Error ? error.message : 'OCR failed in this browser session.',
        progressMessage: 'OCR failed. Continue with manual review boxes.',
      })
    }
  },

  addCustomTerm(term) {
    const document = get().document
    if (!document || term.trim().length < 2) return

    const nextTerms = [...get().customTerms, term.trim()]
    const previous = get().detections
    const nonRegex = previous.filter((detection) => detection.source === 'visual-detector' || detection.source === 'ocr')
    const textDetections = preserveApproval(detectSensitiveText(document.text, nextTerms), previous)
    const mappedTextDetections =
      document.kind === 'pdf' ? attachPdfTextBoxes(textDetections, document.pages) : textDetections
    const detections = [...mappedTextDetections, ...nonRegex]

    set({
      customTerms: nextTerms,
      detections,
      boxes: rebuildDetectorBoxes(detections, get().boxes),
      lastVerification: null,
      lastExportSummary: null,
      progressMessage: `Added custom search term "${term.trim()}".`,
    })
  },

  toggleDetection(id) {
    const detections = get().detections.map((detection) =>
      detection.id === id ? { ...detection, approved: !detection.approved } : detection,
    )
    set({
      detections,
      boxes: get().boxes.map((box) =>
        box.detectionId === id
          ? { ...box, approved: detections.find((detection) => detection.id === id)?.approved ?? box.approved }
          : box,
      ),
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  markDetectionReviewed(id) {
    set({
      detections: get().detections.map((detection) =>
        detection.id === id ? { ...detection, reviewStatus: 'reviewed' } : detection,
      ),
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  setCategoryApproval(category, approved) {
    const detections = get().detections.map((detection) =>
      detection.category === category ? { ...detection, approved } : detection,
    )
    const approvedIds = new Set(detections.filter((detection) => detection.approved).map((detection) => detection.id))
    set({
      detections,
      boxes: get().boxes.map((box) =>
        box.category === category ? { ...box, approved: box.detectionId ? approvedIds.has(box.detectionId) : approved } : box,
      ),
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  addManualBox(pageIndex, bbox) {
    const normalized = normalizeBox(bbox)
    if (normalized.width < 6 || normalized.height < 6) return
    const box: RedactionBox = {
      id: `manual-${crypto.randomUUID()}`,
      category: get().manualCategory,
      pageIndex,
      bbox: normalized,
      approved: true,
      createdBy: 'user',
      note: 'Manual redaction box',
    }
    set({
      boxes: [...get().boxes, box],
      selectedBoxId: box.id,
      manualMode: false,
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  updateBox(id, bbox) {
    const updatedBox = get().boxes.find((box) => box.id === id)
    set({
      boxes: get().boxes.map((box) => (box.id === id ? { ...box, bbox: normalizeBox(bbox) } : box)),
      detections: updatedBox?.detectionId
        ? get().detections.map((detection) =>
            detection.id === updatedBox.detectionId ? { ...detection, reviewStatus: 'manually-adjusted' } : detection,
          )
        : get().detections,
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  deleteBox(id) {
    set({
      boxes: get().boxes.filter((box) => box.id !== id),
      selectedBoxId: get().selectedBoxId === id ? null : get().selectedBoxId,
      lastVerification: null,
      lastExportSummary: null,
    })
  },

  setSelectedBox(id) {
    set({ selectedBoxId: id })
  },

  setSelectedPage(pageIndex) {
    set({ selectedPageIndex: Math.max(0, pageIndex), selectedBoxId: null })
  },

  setZoom(zoom) {
    set({ zoom: clampZoom(zoom) })
  },

  setManualMode(enabled) {
    set({ manualMode: enabled })
  },

  setManualCategory(category) {
    set({ manualCategory: category })
  },

  clearSession() {
    const doc = get().document
    if (doc) {
      for (const page of doc.pages) {
        if (page.imageUrl && page.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(page.imageUrl)
        }
      }
    }

    set({
      document: null,
      detections: [],
      boxes: [],
      customTerms: [],
      selectedPageIndex: 0,
      selectedBoxId: null,
      zoom: 0.85,
      manualMode: false,
      manualCategory: 'custom',
      status: 'idle',
      progressMessage: 'Start Over clears the current in-app workspace state. It does not clear your browser downloads folder or system clipboard.',
      error: null,
      lastVerification: null,
      lastExportSummary: null,
      ocrStatus: 'idle',
      ocrProgressMessage: 'OCR has not been run.',
      barcodeStatus: 'not-applicable',
    })
  },

  async exportRedactedFile() {
    const document = get().document
    if (!document) {
      throw new Error('Load a document before exporting.')
    }

    let blob: Blob
    let fileName: string
    let verification: VerificationResult

    if (document.kind === 'text' || document.kind === 'csv') {
      const mimeType = document.kind === 'csv' ? 'text/csv' : 'text/plain'
      blob = exportRedactedTextBlob(document.text, get().detections, mimeType)
      const redactedText = redactTextContent(document.text, get().detections)
      verification = verifyRedactedText(redactedText, get().detections)
      fileName = `${document.name.replace(/\.[^.]+$/, '') || 'document'}-redacted.${document.kind === 'csv' ? 'csv' : 'txt'}`
    } else if (document.kind === 'image') {
      const page = document.pages[0]
      if (!page) throw new Error('No image page is available.')
      blob = await exportRedactedImage(page, get().boxes)
      verification = verifyVisualExport(document.kind, get().detections, get().boxes)
      fileName = `${document.name.replace(/\.[^.]+$/, '') || 'image'}-redacted.png`
    } else {
      blob = await exportFlattenedPdf(document.pages, get().boxes)
      verification = verifyVisualExport(document.kind, get().detections, get().boxes)
      fileName = `${document.name.replace(/\.[^.]+$/, '') || 'document'}-redacted.pdf`
    }

    const summary = exportSummary(document, get().detections, get().boxes, fileName, get().ocrStatus)
    set({ lastVerification: verification, lastExportSummary: summary })
    return { blob, fileName, verification, summary }
  },

  exportReport() {
    const document = get().document
    if (!document) {
      throw new Error('Load a document before exporting a report.')
    }
    const verification = get().lastVerification ?? computeVisualVerification(document, get().detections, get().boxes)
    const report = buildRedactionReport(document, get().detections, get().boxes, verification, get().ocrStatus)
    return reportToBlob(report)
  },
}))

export function selectCurrentPage(state: RedactionState) {
  return state.document?.pages[state.selectedPageIndex] ?? null
}
