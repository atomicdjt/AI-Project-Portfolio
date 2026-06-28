import type { DetectionFinding, FindingType, SeverityBand } from '../../types/hri'

interface PatternDefinition {
  type: FindingType
  label: string
  regex: RegExp
  severity: SeverityBand
  confidence: number
  explanation: string
  redaction: string
}

const patterns: PatternDefinition[] = [
  {
    type: 'email',
    label: 'Email address',
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    severity: 'High',
    confidence: 0.98,
    explanation: 'Email addresses can identify a person and should usually be redacted before public sharing.',
    redaction: '[REDACTED EMAIL]',
  },
  {
    type: 'phone',
    label: 'Phone number',
    regex: /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
    severity: 'High',
    confidence: 0.9,
    explanation: 'Phone numbers are direct contact information.',
    redaction: '[REDACTED PHONE]',
  },
  {
    type: 'ssn',
    label: 'Social Security number pattern',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: 'Critical',
    confidence: 0.96,
    explanation: 'This matches a common Social Security number format.',
    redaction: '[REDACTED SSN]',
  },
  {
    type: 'date_of_birth',
    label: 'Date of birth',
    regex: /\b(?:DOB|Date of Birth|Birth Date)\s*[:#-]?\s*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Z][a-z]+ \d{1,2}, \d{4})\b/g,
    severity: 'High',
    confidence: 0.88,
    explanation: 'Birth dates are sensitive identity attributes.',
    redaction: '[REDACTED DOB]',
  },
  {
    type: 'address',
    label: 'Street address',
    regex: /\b\d{2,6}\s+[A-Z][A-Za-z0-9.'-]*(?:\s+[A-Z][A-Za-z0-9.'-]*){0,4}\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Way|Place|Pl)\b/gi,
    severity: 'High',
    confidence: 0.78,
    explanation: 'Street addresses can expose residence or workplace locations.',
    redaction: '[REDACTED ADDRESS]',
  },
  {
    type: 'case_number',
    label: 'Case number',
    regex: /\b(?:case|claim|ticket|reference)\s*(?:number|no\.?|#|id)?\s*[:#-]?\s*[A-Z]{1,5}[-\s]?\d{3,}[-A-Z0-9]*\b/gi,
    severity: 'Moderate',
    confidence: 0.82,
    explanation: 'Administrative case identifiers can expose private workflows or records.',
    redaction: '[REDACTED CASE ID]',
  },
  {
    type: 'medical_record_id',
    label: 'Medical record identifier',
    regex: /\b(?:MRN|medical record(?: number)?|patient id)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/gi,
    severity: 'Critical',
    confidence: 0.88,
    explanation: 'Medical record identifiers can connect a person to protected health information.',
    redaction: '[REDACTED MEDICAL ID]',
  },
  {
    type: 'insurance_member_id',
    label: 'Insurance or member ID',
    regex: /\b(?:member id|insurance id|policy id)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/gi,
    severity: 'High',
    confidence: 0.86,
    explanation: 'Insurance and member IDs are sensitive administrative identifiers.',
    redaction: '[REDACTED MEMBER ID]',
  },
  {
    type: 'account_number',
    label: 'Account number',
    regex: /\b(?:account|acct)\s*(?:number|no\.?|#)?\s*[:#-]?\s*[A-Z0-9-]{6,}\b/gi,
    severity: 'High',
    confidence: 0.84,
    explanation: 'Account numbers can expose private financial or service records.',
    redaction: '[REDACTED ACCOUNT]',
  },
  {
    type: 'financial_information',
    label: 'Payment card pattern',
    regex: /\b(?:\d[ -]*?){13,16}\b/g,
    severity: 'Critical',
    confidence: 0.72,
    explanation: 'Long digit sequences may be payment cards or other financial identifiers.',
    redaction: '[REDACTED FINANCIAL ID]',
  },
  {
    type: 'government_id',
    label: 'Government ID-like value',
    regex: /\b(?:passport|driver(?:'s)? license|license no\.?|government id)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/gi,
    severity: 'Critical',
    confidence: 0.84,
    explanation: 'Government ID-like values can increase identity misuse risk.',
    redaction: '[REDACTED GOVERNMENT ID]',
  },
  {
    type: 'employer_client_id',
    label: 'Employer or client ID',
    regex: /\b(?:employee id|employer id|client id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi,
    severity: 'Moderate',
    confidence: 0.8,
    explanation: 'Employer or client IDs can expose internal systems or administrative records.',
    redaction: '[REDACTED CLIENT ID]',
  },
  {
    type: 'url',
    label: 'URL',
    regex: /\bhttps?:\/\/[^\s)]+/gi,
    severity: 'Moderate',
    confidence: 0.96,
    explanation: 'URLs can expose private portals, files, or tracking identifiers.',
    redaction: '[REDACTED URL]',
  },
  {
    type: 'ip_address',
    label: 'IP address',
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    severity: 'Moderate',
    confidence: 0.86,
    explanation: 'IP addresses can expose network or location-adjacent information.',
    redaction: '[REDACTED IP]',
  },
  {
    type: 'signature_indicator',
    label: 'Signature indicator',
    regex: /\b(?:signed by|signature|e-signature|wet signature)(?:\s*(?:line|field|block))?(?:\s*[:#-]?\s*[A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+){0,3})?/gi,
    severity: 'Moderate',
    confidence: 0.7,
    explanation: 'Signature references may indicate visible signatures or authorization marks.',
    redaction: '[REDACTED SIGNATURE]',
  },
  {
    type: 'barcode_qr_indicator',
    label: 'Barcode or QR indicator',
    regex: /\b(?:barcode|qr code|scan code)(?:\s+(?:visible|present|detected|near|on|in|at|footer|header|page|form|image|document)){0,8}/gi,
    severity: 'Moderate',
    confidence: 0.68,
    explanation: 'Barcode or QR references may point to machine-readable identifiers.',
    redaction: '[REDACTED CODE]',
  },
]

export function detectSensitiveInfo(text: string, documentId = 'doc'): DetectionFinding[] {
  const findings: DetectionFinding[] = []
  const seen = new Set<string>()

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern.regex)) {
      if (match.index === undefined) {
        continue
      }
      const raw = match[0].trim()
      const key = `${pattern.type}:${match.index}:${raw}`
      if (!raw || seen.has(key)) {
        continue
      }
      seen.add(key)
      findings.push({
        id: `${documentId}-${findings.length + 1}`,
        type: pattern.type,
        label: pattern.label,
        match: raw,
        start: match.index,
        end: match.index + raw.length,
        severity: pattern.severity,
        confidence: pattern.confidence,
        explanation: pattern.explanation,
        suggestedRedaction: pattern.redaction,
      })
    }
  }

  return findings.sort((a, b) => a.start - b.start)
}
