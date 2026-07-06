import { describe, expect, it } from 'vitest'
import { detectSensitiveText } from '../lib/detectors'

describe('detectors', () => {
  it('detects high-confidence structured identifiers', () => {
    const text = [
      'Name: Maria Lopez',
      'Email maria.lopez@example.com',
      'Phone (202) 555-0198',
      'SSN 123-45-6789',
      'DOB 04/22/1984',
      'Card 4111 1111 1111 1111',
      'Routing number: 021000021',
      'Case # AB-20240177',
      'api_key=sk_test_1234567890abcdef',
    ].join('\n')

    const categories = new Set(detectSensitiveText(text).map((item) => item.category))

    expect(categories.has('name')).toBe(true)
    expect(categories.has('email')).toBe(true)
    expect(categories.has('phone')).toBe(true)
    expect(categories.has('ssn')).toBe(true)
    expect(categories.has('date_of_birth')).toBe(true)
    expect(categories.has('financial')).toBe(true)
    expect(categories.has('routing_number')).toBe(true)
    expect(categories.has('case_id')).toBe(true)
    expect(categories.has('secret_token')).toBe(true)
  })

  it('detects address and medical identifier heuristics', () => {
    const text = 'Client ID: CL-442199\nMRN: MED778899\nAddress: 123 Market Street, Springfield, IL 62704'
    const categories = new Set(detectSensitiveText(text).map((item) => item.category))

    expect(categories.has('employee_client_id')).toBe(true)
    expect(categories.has('medical_identifier')).toBe(true)
    expect(categories.has('address')).toBe(true)
  })

  it('adds custom user search terms', () => {
    const detections = detectSensitiveText('Project Codename: Aurora Shelf', ['Aurora Shelf'])
    const custom = detections.find((item) => item.category === 'custom')

    expect(custom?.rawValue).toBe('Aurora Shelf')
    expect(custom?.approved).toBe(true)
  })
})
