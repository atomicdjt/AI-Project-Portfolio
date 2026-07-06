import type { DetectorMatch, SensitiveDetector } from './detectorTypes'
import { luhnCheck, runRegex } from './utils'

export function createFinancialDetector(): SensitiveDetector {
  return {
    id: 'financial',
    label: 'Financial/account identifiers',
    detect(text) {
      const cardMatches: DetectorMatch[] = []
      const cardExpression = /\b(?:\d[ -]*?){13,19}\b/g
      for (const match of text.matchAll(cardExpression)) {
        if (match.index === undefined) continue
        if (!luhnCheck(match[0])) continue
        cardMatches.push({
          category: 'financial',
          label: 'Possible payment card-like number',
          rawValue: match[0],
          confidence: 0.94,
          range: { start: match.index, end: match.index + match[0].length },
        })
      }

      const accountMatches = runRegex(
        text,
        /\b(?:account|acct|member|policy)\s*(?:no\.?|number|#)?\s*[:#-]?\s*([A-Z0-9][A-Z0-9 -]{6,24})\b/gi,
        'financial',
        'Possible account-like number',
        0.76,
        1,
      ).filter((match) => /\d/.test(match.rawValue))

      const routingMatches = runRegex(
        text,
        /\b(?:routing|aba)\s*(?:no\.?|number|#)?\s*[:#-]?\s*(\d{9})\b/gi,
        'routing_number',
        'Possible routing number-like value',
        0.88,
        1,
      )

      return [...cardMatches, ...accountMatches, ...routingMatches]
    },
  }
}
