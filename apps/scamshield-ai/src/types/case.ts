import type { AnalysisResult, FindingCategory } from './analysis'

export type UserRole = 'target' | 'family-helper' | 'caregiver' | 'community-advocate'

export type ScamType =
  | 'bank-payment'
  | 'romance'
  | 'tech-support'
  | 'government-impersonation'
  | 'delivery'
  | 'job'
  | 'marketplace'
  | 'crypto-investment'
  | 'invoice-bec'
  | 'unknown'

export type Urgency = 'money-at-risk' | 'money-sent' | 'personal-info-shared' | 'suspicious-only'

export type ContactMethod = 'email' | 'sms' | 'phone' | 'social' | 'website' | 'payment-app' | 'mail' | 'other'

export type TimelineEventType =
  | 'Message received'
  | 'Call received'
  | 'Link clicked'
  | 'Money requested'
  | 'Money sent'
  | 'Personal info shared'
  | 'Account contacted'
  | 'Report filed'
  | 'Other'

export interface EvidenceAttachment {
  id: string
  name: string
  type: string
  size: number
  previewUrl?: string
}

export interface TimelineEntry {
  id: string
  dateTime: string
  eventType: TimelineEventType
  description: string
  amount: string
  contact: string
  reference: string
  source: 'suggested' | 'user'
}

export interface ChecklistItem {
  id: string
  label: string
  priority: 'now' | 'soon' | 'preserve'
  completed: boolean
}

export interface CaregiverDetails {
  personHelped: string
  relationship: string
  hasConsent: boolean
  notes: string
}

export interface ScamCase {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  role: UserRole
  scamType: ScamType
  urgency: Urgency
  contactMethod: ContactMethod
  evidenceText: string
  manualExtractedText: string
  suspiciousUrl: string
  paymentDestination: string
  claimedCompany: string
  contactDetails: string
  amountRequested: string
  pressureLanguage: string
  notes: string
  attachments: EvidenceAttachment[]
  timeline: TimelineEntry[]
  checklist: ChecklistItem[]
  caregiver: CaregiverDetails
  analysis: AnalysisResult | null
}

export interface SafetyChecklistInput {
  urgency: Urgency
  scamType: ScamType
  caregiverMode: boolean
  evidenceText: string
  findings: Array<{ category: FindingCategory }>
}
