import { describe, expect, it } from 'vitest'
import { extractEntities, findSensitiveDataWarnings } from '../lib/extractEntities'

describe('entity extraction', () => {
  it('extracts and deduplicates contact, URL, amount, date, and deadline evidence', () => {
    const entities = extractEntities(
      'Email case-team@example.test or call (202) 555-0142. Pay $1,250.00 by June 20, 2026 at https://secure.example.test/pay. Final deadline is within 24 hours.',
    )

    expect(entities.emails).toContain('case-team@example.test')
    expect(entities.phones).toContain('(202) 555-0142')
    expect(entities.urls).toContain('https://secure.example.test/pay')
    expect(entities.amounts).toContain('$1,250.00')
    expect(entities.dates).toContain('June 20, 2026')
    expect(entities.deadlines).toContain('within 24 hours')
  })

  it('warns about highly sensitive information without retaining the matched value', () => {
    const warnings = findSensitiveDataWarnings(
      'My SSN is 123-45-6789, password is samplePass, card 4111 1111 1111 1111, and code 654321.',
    )

    expect(warnings.map((warning) => warning.type)).toEqual(
      expect.arrayContaining(['Social Security number', 'Password', 'Payment card number', 'Authentication code']),
    )
    expect(JSON.stringify(warnings)).not.toContain('123-45-6789')
    expect(JSON.stringify(warnings)).not.toContain('4111 1111 1111 1111')
  })
})
