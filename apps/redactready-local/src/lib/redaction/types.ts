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
}

export const CATEGORY_LABELS: Record<RedactionCategory, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  ssn: 'SSN',
  date_of_birth: 'Date of birth',
  financial: 'Financial',
  routing_number: 'Routing number',
  medical_identifier: 'Medical ID',
  signature: 'Signature',
  face: 'Face',
  barcode_qr: 'QR/barcode',
  case_id: 'Case/reference',
  employee_client_id: 'Employee/client ID',
  secret_token: 'Secret token',
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
