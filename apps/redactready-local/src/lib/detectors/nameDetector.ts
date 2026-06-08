import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createNameDetector(): SensitiveDetector {
  return {
    id: 'name-lite',
    label: 'Name-like values',
    detect(text) {
      return runRegex(
        text,
        /\b(?:name|patient|employee|client|student|applicant)\s*[:#-]\s*([A-Z][a-zA-Z'-]+(?:[ \t]+[A-Z][a-zA-Z'-]+){1,3})\b/gi,
        'name',
        'Name-like value',
        0.58,
        1,
      )
    },
  }
}
