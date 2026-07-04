const basicEntities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#34;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
}

export function normalizeGeneratedText(value: string): string {
  return decodeBasicEntities(value)
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/p\s*>/gi, '\n\n')
    .replace(/<\s*\/li\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '\n- ')
    .replace(/<\s*\/?(p|div|section|article|strong|em|b|i|span|ul|ol|h[1-6])[^>]*>/gi, '')
    .replace(/<[^>\n]+>/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function normalizePlainList(values: string[]): string[] {
  return values.map(normalizeGeneratedText).filter(Boolean)
}

function decodeBasicEntities(value: string): string {
  let decoded = value.replace(/&lt;\s*br\s*\/?\s*&gt;/gi, '\n')
  for (const [entity, replacement] of Object.entries(basicEntities)) {
    decoded = decoded.replaceAll(entity, replacement)
  }
  return decoded
}
