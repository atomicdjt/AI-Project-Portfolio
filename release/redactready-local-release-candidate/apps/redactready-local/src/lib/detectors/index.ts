import type { DetectionResult, DetectionSource } from '../redaction/types'
import { createAddressDetector } from './addressDetector'
import { createDateDetector } from './dateDetector'
import { detectCustomTerms } from './customDetector'
import { createEmailDetector } from './emailDetector'
import { createFinancialDetector } from './financialDetector'
import { createIdDetector } from './idDetector'
import { createNameDetector } from './nameDetector'
import { createPhoneDetector } from './phoneDetector'
import { createSecretDetector } from './secretDetector'
import { createSsnDetector } from './ssnDetector'
import { dedupeDetections, matchesToDetections } from './utils'

export const defaultDetectors = [
  createEmailDetector(),
  createPhoneDetector(),
  createSsnDetector(),
  createFinancialDetector(),
  createDateDetector(),
  createAddressDetector(),
  createIdDetector(),
  createSecretDetector(),
  createNameDetector(),
]

export function detectSensitiveText(text: string, customTerms: string[] = [], source: DetectionSource = 'regex'): DetectionResult[] {
  const matches = defaultDetectors.flatMap((detector) => detector.detect(text))
  const customMatches = detectCustomTerms(text, customTerms)
  return dedupeDetections(matchesToDetections([...matches, ...customMatches], source))
}
