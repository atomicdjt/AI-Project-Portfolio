import { create } from 'zustand'
import { detectSensitiveText } from '../lib/detectors'
import { detectBarcodesOnPages } from '../lib/detectors/visualDetectors'
import { loadLocalDocument } from '../lib/files/loadDocument'
import { exportRedactedImage } from '../lib/redaction/applyCanvasRedactions'
import { exportFlattenedPdf } from '../lib/redaction/exportFlattenedPdf'
import { attachPdfTextBoxes, boxesFromDetections } from '../lib/redaction/pdfTextMapping'
import { buildRedactionReport, reportToBlob } from '../lib/redaction/report'
import { exportRedactedTextBlob, redactTextContent } from '../lib/redaction/textRedaction'
import { verifyRedactedText, verifyVisualExport } from '../lib/redaction/verification'
import type {
  BoundingBox,
  DetectionResult,
  LoadedDocument,
  RedactionBox,
  RedactionCategory,
  VerificationResult,
} from '../lib/redaction/types'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ExportResult {
  blob: Blob
  fileName: string
  verification: VerificationResult
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
  loadFile: (file: File) => Promise<void>
  addCustomTerm: (term: string) => void
  toggleDetection: (id: string) => void
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

  async loadFile(file) {
    set({
      status: 'loading',
      progressMessage: 'Reading file locally...',
      error: null,
      lastVerification: null,
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
      const visualDetections = await detectBarcodesOnPages(document.pages).catch(() => [])
      const detections = [...mappedTextDetections, ...visualDetections]
      const boxes = rebuildDetectorBoxes(detections, [])

      set({
        document,
        detections,
        boxes,
        customTerms: [],
        status: 'ready',
        progressMessage: `Found ${detections.length} review item${detections.length === 1 ? '' : 's'}.`,
        error: null,
        zoom: document.kind === 'text' || document.kind === 'csv' ? 1 : 0.85,
      })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Could not load this file.',
        progressMessage: 'File could not be processed.',
      })
    }
  },

  addCustomTerm(term) {
    const document = get().document
    if (!document || term.trim().length < 2) return

    const nextTerms = [...get().customTerms, term.trim()]
    const previous = get().detections
    const visual = previous.filter((detection) => detection.source === 'visual-detector')
    const textDetections = preserveApproval(detectSensitiveText(document.text, nextTerms), previous)
    const mappedTextDetections =
      document.kind === 'pdf' ? attachPdfTextBoxes(textDetections, document.pages) : textDetections
    const detections = [...mappedTextDetections, ...visual]

    set({
      customTerms: nextTerms,
      detections,
      boxes: rebuildDetectorBoxes(detections, get().boxes),
      lastVerification: null,
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
    })
  },

  updateBox(id, bbox) {
    set({
      boxes: get().boxes.map((box) => (box.id === id ? { ...box, bbox: normalizeBox(bbox) } : box)),
      lastVerification: null,
    })
  },

  deleteBox(id) {
    set({
      boxes: get().boxes.filter((box) => box.id !== id),
      selectedBoxId: get().selectedBoxId === id ? null : get().selectedBoxId,
      lastVerification: null,
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
      progressMessage: 'Session cleared. No file is retained by the app.',
      error: null,
      lastVerification: null,
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
      blob = await exportFlattenedPdf(document.pages, get().boxes, document.name)
      verification = verifyVisualExport(document.kind, get().detections, get().boxes)
      fileName = `${document.name.replace(/\.[^.]+$/, '') || 'document'}-redacted.pdf`
    }

    set({ lastVerification: verification })
    return { blob, fileName, verification }
  },

  exportReport() {
    const document = get().document
    if (!document) {
      throw new Error('Load a document before exporting a report.')
    }
    const verification = get().lastVerification ?? computeVisualVerification(document, get().detections, get().boxes)
    const report = buildRedactionReport(document, get().detections, get().boxes, verification)
    return reportToBlob(report)
  },
}))

export function selectCurrentPage(state: RedactionState) {
  return state.document?.pages[state.selectedPageIndex] ?? null
}
