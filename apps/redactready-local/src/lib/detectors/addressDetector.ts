import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createAddressDetector(): SensitiveDetector {
  return {
    id: 'address-lite',
    label: 'Address-like values',
    detect(text) {
      return runRegex(
        text,
        /\b\d{1,6}\s+[A-Z][A-Za-z0-9.'-]*(?:\s+[A-Z][A-Za-z0-9.'-]*){0,5}\s+(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?|Court|Ct\.?|Way|Place|Pl\.?)\b(?:,\s*[A-Z][A-Za-z .'-]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)?/g,
        'address',
        'Possible address-like text',
        0.62,
      )
    },
  }
}
