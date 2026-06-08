import type { DetectionResult, DetectionSource, RedactionCategory, TextRange } from '../redaction/types'
import type { DetectorMatch } from './detectorTypes'

export function maskValue(value: string): string {
  const normalized = value.trim()
  if (normalized.length <= 4) {
    return '*'.repeat(normalized.length)
  }

  if (normalized.includes('@')) {
    const [user = '', domain = ''] = normalized.split('@')
    const domainParts = domain.split('.')
    const visibleDomain = domainParts.length > 1 ? domainParts.slice(-2).join('.') : domain
    return `${user.slice(0, 2)}***@${visibleDomain}`
  }

  const visibleStart = normalized.slice(0, 2)
  const visibleEnd = normalized.slice(-4)
  return `${visibleStart}${'*'.repeat(Math.min(8, normalized.length - 4))}${visibleEnd}`
}

export function makeDetectionId(category: RedactionCategory, range: TextRange, value: string): string {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return `${category}-${range.start}-${range.end}-${hash.toString(36)}`
}

export function matchesToDetections(
  matches: DetectorMatch[],
  source: DetectionSource = 'regex',
  pageIndex?: number,
): DetectionResult[] {
  const createdAt = new Date().toISOString()
  return matches.map((match) => ({
    id: makeDetectionId(match.category, match.range, match.rawValue),
    category: match.category,
    label: match.label,
    valuePreview: maskValue(match.rawValue),
    rawValue: match.rawValue,
    confidence: match.confidence,
    source,
    pageIndex,
    textRange: match.range,
    approved: true,
    createdAt,
  }))
}

export function runRegex(
  text: string,
  expression: RegExp,
  category: RedactionCategory,
  label: string,
  confidence: number,
  valueGroup = 0,
): DetectorMatch[] {
  const matches: DetectorMatch[] = []
  for (const match of text.matchAll(expression)) {
    const rawValue = match[valueGroup]
    if (!rawValue || match.index === undefined) {
      continue
    }

    const prefixLength = valueGroup === 0 ? 0 : match[0].indexOf(rawValue)
    const start = match.index + Math.max(prefixLength, 0)
    matches.push({
      category,
      label,
      rawValue,
      confidence,
      range: { start, end: start + rawValue.length },
    })
  }
  return matches
}

export function dedupeDetections(detections: DetectionResult[]): DetectionResult[] {
  const sorted = [...detections].sort((a, b) => {
    const startA = a.textRange?.start ?? 0
    const startB = b.textRange?.start ?? 0
    if (startA !== startB) return startA - startB
    return b.confidence - a.confidence
  })

  const accepted: DetectionResult[] = []
  for (const detection of sorted) {
    const range = detection.textRange
    const overlaps = range
      ? accepted.some((current) => {
          const currentRange = current.textRange
          return Boolean(currentRange && range.start < currentRange.end && range.end > currentRange.start)
        })
      : accepted.some((current) => current.id === detection.id)

    if (!overlaps) {
      accepted.push(detection)
    }
  }
  return accepted
}

export function hasDateOfBirthContext(text: string, start: number): boolean {
  const context = text.slice(Math.max(0, start - 28), start).toLowerCase()
  return /\b(dob|birth|born|date of birth)\b/.test(context)
}

export function luhnCheck(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}
