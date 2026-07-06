import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createSsnDetector(): SensitiveDetector {
  return {
    id: 'ssn',
    label: 'Social Security numbers',
    detect(text) {
      return runRegex(text, /\b(?!000|666|9\d{2})\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}\b/g, 'ssn', 'Possible SSN-like identifier', 0.97)
    },
  }
}
