import type { DetectorMatch } from './detectorTypes'

export function detectCustomTerms(text: string, terms: string[]): DetectorMatch[] {
  const matches: DetectorMatch[] = []
  const cleanTerms = terms.map((term) => term.trim()).filter((term) => term.length >= 2)

  for (const term of cleanTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const expression = new RegExp(escaped, 'gi')
    for (const match of text.matchAll(expression)) {
      if (match.index === undefined) continue
      matches.push({
        category: 'custom',
        label: 'Custom search term',
        rawValue: match[0],
        confidence: 0.99,
        range: { start: match.index, end: match.index + match[0].length },
      })
    }
  }

  return matches
}
