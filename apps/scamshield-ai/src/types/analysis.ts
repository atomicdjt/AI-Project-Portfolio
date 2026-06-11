export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type RiskLabel = 'Low visible risk' | 'Concerning' | 'High risk' | 'Severe risk'

export type FindingCategory =
  | 'Urgency and pressure'
  | 'Threats and fear'
  | 'Secrecy and isolation'
  | 'Payment red flags'
  | 'Credential or personal-data request'
  | 'Impersonation'
  | 'Suspicious URL'
  | 'Romance or social manipulation'
  | 'Job scam indicators'
  | 'Invoice or business compromise'

export interface RedFlagFinding {
  id: string
  category: FindingCategory
  severity: Severity
  matched: string
  explanation: string
  plainExplanation: string
  saferNextStep: string
}

export interface ExtractedEntities {
  emails: string[]
  phones: string[]
  urls: string[]
  amounts: string[]
  dates: string[]
  deadlines: string[]
  references: string[]
}

export interface SensitiveDataWarning {
  type: 'Social Security number' | 'Password' | 'Payment card number' | 'Authentication code' | 'Private key'
  message: string
}

export interface AnalysisInput {
  text: string
  url: string
  claimedCompany: string
  paymentDestination: string
  contactDetails?: string
  amountRequested?: string
  pressureLanguage?: string
}

export interface AnalysisResult {
  score: number
  label: RiskLabel
  summary: string
  findings: RedFlagFinding[]
  notFound: FindingCategory[]
  entities: ExtractedEntities
  sensitiveWarnings: SensitiveDataWarning[]
  disclaimer: string
  networkRequestsMade: 0
  analyzedAt: string
}
