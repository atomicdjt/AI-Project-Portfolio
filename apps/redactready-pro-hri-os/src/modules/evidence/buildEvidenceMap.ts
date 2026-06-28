import type { DocumentItem, EvidenceItem } from '../../types/hri'

function extractSnippets(text: string, terms: string[]): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  return sentences
    .filter((sentence) => terms.some((term) => sentence.toLowerCase().includes(term)))
    .slice(0, 3)
}

export function buildEvidenceMap(documents: DocumentItem[]): EvidenceItem[] {
  return documents.map((document, index) => {
    const lower = document.rawText.toLowerCase()
    const snippets = extractSnippets(document.rawText, ['purpose', 'request', 'support', 'attached', 'date', 'completed', 'review'])
    const missingInformation = [
      !/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4}/i.test(document.rawText)
        ? 'No explicit important date found.'
        : '',
      !/\b(?:purpose|request|goal|reason|summary)\b/i.test(document.rawText) ? 'Purpose or sharing context is not explicit.' : '',
      document.detectedEntities.length > 0 ? 'Sensitive fields should be reviewed before this document is used as evidence.' : '',
    ].filter(Boolean)
    const contradictions = lower.includes('not applicable') && lower.includes('required') ? ['Contains both required and not applicable language.'] : []

    return {
      id: `evidence-${index + 1}`,
      documentId: document.id,
      documentTitle: document.title,
      claim: `${document.classification.type} supports the packet with ${document.detectedEntities.length} sensitive finding${
        document.detectedEntities.length === 1 ? '' : 's'
      } to review.`,
      supportLevel: snippets.length >= 2 && missingInformation.length <= 1 ? 'Strong' : snippets.length > 0 ? 'Partial' : 'Weak',
      snippets: snippets.length > 0 ? snippets : [document.rawText.slice(0, 180)],
      missingInformation,
      contradictions,
    }
  })
}
