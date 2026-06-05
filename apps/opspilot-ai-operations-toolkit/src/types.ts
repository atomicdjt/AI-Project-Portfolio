export type DocumentType = 'SOP' | 'Training Checklist' | 'Knowledge Base'

export type DocumentStatus = 'Draft' | 'In Review' | 'Published'

export type RiskLevel = 'Low' | 'Medium' | 'High'

export type GapSeverity = 'high' | 'medium' | 'low'

export type FeatureKey = 'sop' | 'training' | 'knowledge' | 'gaps' | 'versions'

export interface IntakeState {
  business: string
  role: string
  department: string
  documentType: DocumentType
  priority: string
  sourceNotes: string
}

export interface DocumentStep {
  id: string
  title: string
  detail: string
  owner: string
  timing: string
}

export interface TrainingItem {
  id: string
  task: string
  owner: string
  due: string
  done: boolean
}

export interface KnowledgeArticle {
  id: string
  question: string
  answer: string
  tags: string[]
}

export interface GapFinding {
  id: string
  severity: GapSeverity
  title: string
  evidence: string
  fix: string
  status: 'Open' | 'Fixed'
}

export interface VersionEntry {
  id: string
  label: string
  author: string
  date: string
  changes: string[]
}

export interface OpsDocument {
  id: string
  title: string
  type: DocumentType
  business: string
  department: string
  owner: string
  status: DocumentStatus
  priority: string
  score: number
  risk: RiskLevel
  lastRevised: string
  summary: string
  steps: DocumentStep[]
  checklist: TrainingItem[]
  articles: KnowledgeArticle[]
  gaps: GapFinding[]
  versions: VersionEntry[]
  body: string
}
