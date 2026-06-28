export type SeverityBand = 'Low' | 'Moderate' | 'High' | 'Critical'

export type DocumentType =
  | 'Identity Document'
  | 'Medical / Health Record'
  | 'Employment Document'
  | 'Resume / Portfolio Evidence'
  | 'Government / Benefits Document'
  | 'Legal / Administrative Document'
  | 'Financial Document'
  | 'Correspondence / Email'
  | 'Application Packet'
  | 'Unknown / Mixed'

export type FindingType =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'ssn'
  | 'date_of_birth'
  | 'account_number'
  | 'case_number'
  | 'medical_record_id'
  | 'insurance_member_id'
  | 'employer_client_id'
  | 'signature_indicator'
  | 'barcode_qr_indicator'
  | 'url'
  | 'ip_address'
  | 'financial_information'
  | 'government_id'

export interface DetectionFinding {
  id: string
  type: FindingType
  label: string
  match: string
  start: number
  end: number
  severity: SeverityBand
  confidence: number
  explanation: string
  suggestedRedaction: string
}

export interface ClassificationResult {
  type: DocumentType
  confidence: number
  reasoning: string
}

export interface DocumentItem {
  id: string
  title: string
  documentType: DocumentType
  source: 'pasted text' | 'txt upload' | 'demo packet' | 'manual note'
  dateAdded: string
  rawText: string
  classification: ClassificationResult
  detectedEntities: DetectionFinding[]
  riskFindings: string[]
  recommendedActions: string[]
  confidenceLevel: 'Low' | 'Medium' | 'High'
}

export interface RiskScore {
  category: string
  score: number
  band: SeverityBand
  explanation: string
  suggestions: string[]
}

export interface EvidenceItem {
  id: string
  documentId: string
  documentTitle: string
  claim: string
  supportLevel: 'Strong' | 'Partial' | 'Weak' | 'Missing'
  snippets: string[]
  missingInformation: string[]
  contradictions: string[]
}

export interface ChecklistItem {
  id: string
  group:
    | 'Redact Before Sharing'
    | 'Clarify / Add Context'
    | 'Verify Accuracy'
    | 'Organize Packet'
    | 'Export / Save'
    | 'Optional Follow-Up'
  priority: 'High' | 'Medium' | 'Low'
  explanation: string
  relatedDocument?: string
  relatedFinding?: string
  complete: boolean
}

export interface RedactionRule {
  findingId: string
  enabled: boolean
  label: string
}

export interface ReportData {
  executiveSummary: string
  documentsReviewed: DocumentItem[]
  overallScore: number
  categoryScores: RiskScore[]
  evidenceMap: EvidenceItem[]
  checklist: ChecklistItem[]
  redactionSummary: string
  limitations: string
}

export interface HriAnalysisResult {
  documents: DocumentItem[]
  allFindings: DetectionFinding[]
  categoryScores: RiskScore[]
  overallScore: number
  overallBand: SeverityBand
  evidenceMap: EvidenceItem[]
  checklist: ChecklistItem[]
  report: ReportData
}
