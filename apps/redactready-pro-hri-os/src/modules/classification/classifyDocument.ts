import type { ClassificationResult, DocumentType } from '../../types/hri'

const categorySignals: Array<{
  type: DocumentType
  terms: string[]
  reasoning: string
}> = [
  {
    type: 'Medical / Health Record',
    terms: ['patient', 'diagnosis', 'appointment', 'provider', 'clinic', 'medical', 'treatment', 'member id'],
    reasoning: 'Health-care terminology and patient context are present.',
  },
  {
    type: 'Government / Benefits Document',
    terms: ['benefits', 'eligibility', 'case number', 'agency', 'application', 'appeal', 'documentation'],
    reasoning: 'Administrative benefits language and case-processing terms are present.',
  },
  {
    type: 'Employment Document',
    terms: ['employer', 'recruiter', 'interview', 'offer', 'payroll', 'job application', 'candidate'],
    reasoning: 'Employment and recruiting terms appear in the text.',
  },
  {
    type: 'Resume / Portfolio Evidence',
    terms: ['resume', 'portfolio', 'project', 'skills', 'experience', 'github', 'case study'],
    reasoning: 'Resume, project, and portfolio evidence terms appear in the text.',
  },
  {
    type: 'Financial Document',
    terms: ['bank', 'routing', 'account', 'invoice', 'payment', 'credit card', 'balance'],
    reasoning: 'Financial account or payment terms are present.',
  },
  {
    type: 'Legal / Administrative Document',
    terms: ['court', 'legal', 'contract', 'notice', 'hearing', 'case id', 'signed'],
    reasoning: 'Legal or formal administrative terms are present.',
  },
  {
    type: 'Correspondence / Email',
    terms: ['from:', 'to:', 'subject:', 'regards', 'email', 'inbox'],
    reasoning: 'Email-style headers or correspondence markers are present.',
  },
  {
    type: 'Identity Document',
    terms: ['driver license', 'passport', 'ssn', 'date of birth', 'dob', 'government id'],
    reasoning: 'Identity-document markers or personal identifiers are present.',
  },
  {
    type: 'Application Packet',
    terms: ['packet', 'supporting documents', 'cover letter', 'application', 'attachments'],
    reasoning: 'The text references a multi-document application packet.',
  },
]

export function classifyDocument(text: string): ClassificationResult {
  const normalized = text.toLowerCase()
  const scored = categorySignals
    .map((category) => {
      const hits = category.terms.filter((term) => normalized.includes(term))
      return { ...category, hits }
    })
    .sort((a, b) => b.hits.length - a.hits.length)

  const best = scored[0]
  if (!best || best.hits.length === 0) {
    return {
      type: 'Unknown / Mixed',
      confidence: 0.34,
      reasoning: 'No dominant document category signals were detected.',
    }
  }

  const confidence = Math.min(0.92, 0.45 + best.hits.length * 0.12)
  return {
    type: best.type,
    confidence,
    reasoning: `${best.reasoning} Signals: ${best.hits.slice(0, 4).join(', ')}.`,
  }
}
