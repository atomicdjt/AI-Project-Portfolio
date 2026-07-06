import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createEmailDetector(): SensitiveDetector {
  return {
    id: 'email',
    label: 'Email addresses',
    detect(text) {
      return runRegex(
        text,
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        'email',
        'Possible email address',
        0.98,
      )
    },
  }
}
