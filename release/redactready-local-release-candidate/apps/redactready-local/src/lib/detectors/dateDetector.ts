import type { DetectorMatch, SensitiveDetector } from './detectorTypes'
import { hasDateOfBirthContext } from './utils'

const dateExpressions = [
  /\b(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/g,
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(?:0?[1-9]|[12]\d|3[01]),?\s+(?:19|20)\d{2}\b/gi,
]

export function createDateDetector(): SensitiveDetector {
  return {
    id: 'date-of-birth',
    label: 'Dates of birth',
    detect(text) {
      const matches: DetectorMatch[] = []
      for (const expression of dateExpressions) {
        for (const match of text.matchAll(expression)) {
          if (match.index === undefined) continue
          const contextBoost = hasDateOfBirthContext(text, match.index)
          matches.push({
            category: 'date_of_birth',
            label: contextBoost ? 'Possible date of birth' : 'Possible date-like value',
            rawValue: match[0],
            confidence: contextBoost ? 0.86 : 0.64,
            range: { start: match.index, end: match.index + match[0].length },
          })
        }
      }
      return matches
    },
  }
}
