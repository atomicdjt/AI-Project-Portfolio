import type { ExtractedEntities, SensitiveDataWarning } from '../types/analysis'

function unique(matches: string[] | null): string[] {
  return [...new Set((matches ?? []).map((value) => value.trim()))]
}

export function extractEntities(text: string): ExtractedEntities {
  return {
    emails: unique(text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)),
    phones: unique(text.match(/(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]\d{3}[-.\s]\d{4}\b/g)),
    urls: unique(text.match(/https?:\/\/[^\s<>)\]}]+/gi)?.map((url) => url.replace(/[.,;!?]+$/, '')) ?? []),
    amounts: unique(text.match(/(?:\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:\.\d{2})?\s?(?:USD|dollars?)\b)/gi)),
    dates: unique(
      text.match(
        /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/gi,
      ),
    ),
    deadlines: unique(text.match(/\b(?:within\s+\d+\s+(?:minutes?|hours?|days?)|by\s+(?:today|tomorrow|midnight)|before\s+\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/gi)),
    references: unique(text.match(/\b(?:case|claim|invoice|account|reference|ref)\s*(?:number|no\.?|#|:)\s*[A-Z0-9-]{4,}\b/gi)),
  }
}

const sensitiveChecks: Array<{ type: SensitiveDataWarning['type']; expression: RegExp; message: string }> = [
  {
    type: 'Social Security number',
    expression: /\b\d{3}-\d{2}-\d{4}\b/,
    message: 'A possible Social Security number was detected. Remove or cover it before saving or exporting evidence.',
  },
  {
    type: 'Payment card number',
    expression: /\b(?:\d[ -]*?){13,19}\b/,
    message: 'A possible payment card number was detected. Keep only the last four digits if a reference is necessary.',
  },
  {
    type: 'Password',
    expression: /\b(?:password|passcode)\s*(?:is|:|=)\s*\S+/i,
    message: 'A possible password was detected. Delete it from the case and change it through the official service.',
  },
  {
    type: 'Authentication code',
    expression: /\b(?:code|otp|verification code|one[- ]time code)\s*(?:is|:|=)?\s*\d{4,8}\b/i,
    message: 'A possible authentication code was detected. Remove it and never share a new code with another person.',
  },
  {
    type: 'Private key',
    expression: /\b(?:private key|seed phrase|recovery phrase)\s*(?:is|:|=)/i,
    message: 'Possible private-key or recovery information was detected. Remove it immediately and secure the account or wallet.',
  },
]

export function findSensitiveDataWarnings(text: string): SensitiveDataWarning[] {
  return sensitiveChecks
    .filter((check) => check.expression.test(text))
    .map(({ type, message }) => ({ type, message }))
}
