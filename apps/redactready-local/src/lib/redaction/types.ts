export type RedactionCategory =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'ssn'
  | 'date_of_birth'
  | 'financial'
  | 'routing_number'
  | 'medical_identifier'
  | 'signature'
  | 'face'
  | 'barcode_qr'
  | 'case_id'
  | 'employee_client_id'
  | 'secret_token'
  | 'custom'

export type DocumentKind = 'pdf' | 'image' | 'text' | 'csv'

export type DetectionSource = 'text-layer' | 'ocr' | 'regex' | 'manual' | 'visual-detector'

export type DetectionPlacement = 'exact-text' | 'approximate-visual' | 'manual-required'

export type DetectionReviewStatus = 'unverified' | 'reviewed' | 'manually-adjusted'

export type OcrStatus = 'idle' | 'running' | 'completed' | 'failed' | 'unsupported'

export type BarcodeCapabilityStatus = 'available' | 'unavailable' | 'failed' | 'not-applicable'

export type MetadataHandlingStatus = 'attempted' | 'not applicable' | 'not supported'

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  coordinateSpace: 'canvas' | 'pdf-page' | 'image'
}

export interface TextRange {
  start: number
  end: number
}

export interface DetectionResult {
  id: string
  category: RedactionCategory
  label: string
  valuePreview: string
  rawValue: string
  confidence: number
  pageIndex?: number
  source: DetectionSource
  placement: DetectionPlacement
  reviewStatus: DetectionReviewStatus
  bbox?: BoundingBox
  textRange?: TextRange
  approved: boolean
  createdAt: string
}

export interface RedactionBox {
  id: string
  detectionId?: string
  category: RedactionCategory
  pageIndex: number
  bbox: BoundingBox
  approved: boolean
  createdBy: 'detector' | 'user'
  note?: string
}

export interface VerificationResult {
  status: 'pass' | 'warning' | 'fail'
  title: string
  checkedAt: string
  checkedValues: number
  leakedValues: number
  messages: string[]
}

export interface RedactionReport {
  fileName: string
  fileType: string
  processedAt: string
  localOnly: boolean
  totalDetections: number
  totalAppliedRedactions: number
  totalRejectedOrIgnored: number
  manualBoxes: number
  ocrStatus: OcrStatus
  barcodeStatus: BarcodeCapabilityStatus
  metadataHandling: MetadataHandlingStatus
  manualVerificationCompleted: boolean
  metadataNotes: string[]
  categories: Partial<Record<RedactionCategory, number>>
  verification: VerificationResult
  warnings: string[]
}

export interface PdfTextItem {
  value: string
  range: TextRange
  bbox: BoundingBox
  pageIndex: number
}

export interface DocumentPage {
  pageIndex: number
  width: number
  height: number
  imageUrl: string
  textItems: PdfTextItem[]
  text: string
}

export interface LoadedDocument {
  id: string
  name: string
  kind: DocumentKind
  mimeType: string
  size: number
  text: string
  pages: DocumentPage[]
  createdAt: string
  warnings: string[]
  metadataNotes: string[]
}

export const CATEGORY_LABELS: Record<RedactionCategory, string> = {
  name: 'Possible name',
  email: 'Possible email',
  phone: 'Possible phone',
  address: 'Possible address',
  ssn: 'Possible SSN',
  date_of_birth: 'Possible date of birth',
  financial: 'Possible financial',
  routing_number: 'Possible routing number',
  medical_identifier: 'Possible medical ID',
  signature: 'Possible signature',
  face: 'Possible face',
  barcode_qr: 'Possible QR/barcode',
  case_id: 'Possible case/reference',
  employee_client_id: 'Possible employee/client ID',
  secret_token: 'Possible secret token',
  custom: 'Custom',
}

export const CATEGORY_ORDER: RedactionCategory[] = [
  'ssn',
  'email',
  'phone',
  'financial',
  'routing_number',
  'date_of_birth',
  'address',
  'name',
  'case_id',
  'employee_client_id',
  'medical_identifier',
  'secret_token',
  'barcode_qr',
  'face',
  'signature',
  'custom',
]
