import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createPhoneDetector(): SensitiveDetector {
  return {
    id: 'phone',
    label: 'Phone numbers',
    detect(text) {
      return runRegex(
        text,
        /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\b\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
        'phone',
        'Possible phone number',
        0.88,
      )
    },
  }
}
