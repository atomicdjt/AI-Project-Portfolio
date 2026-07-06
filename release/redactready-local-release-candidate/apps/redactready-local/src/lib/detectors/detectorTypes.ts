import type { DetectionResult, RedactionCategory, TextRange } from '../redaction/types'

export interface DetectorMatch {
  category: RedactionCategory
  label: string
  rawValue: string
  confidence: number
  range: TextRange
}

export interface SensitiveDetector {
  id: string
  label: string
  detect: (text: string) => DetectorMatch[]
}

export type DetectorFactory = () => SensitiveDetector

export type DetectionDraft = Omit<DetectionResult, 'id' | 'approved' | 'createdAt' | 'source' | 'valuePreview'> & {
  valuePreview?: string
}
