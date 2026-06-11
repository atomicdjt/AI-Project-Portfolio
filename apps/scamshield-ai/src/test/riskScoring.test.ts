import { describe, expect, it } from 'vitest'
import { getRiskLabel, scoreFindings } from '../lib/riskScoring'

describe('risk scoring', () => {
  it('uses the published severity weights and caps the score at 100', () => {
    expect(
      scoreFindings([
        { severity: 'critical' },
        { severity: 'high' },
        { severity: 'medium' },
        { severity: 'low' },
      ]),
    ).toBe(51)

    expect(scoreFindings(Array.from({ length: 5 }, () => ({ severity: 'critical' })))).toBe(100)
  })

  it('maps every score boundary to the transparent risk labels', () => {
    expect(getRiskLabel(0)).toBe('Low visible risk')
    expect(getRiskLabel(19)).toBe('Low visible risk')
    expect(getRiskLabel(20)).toBe('Concerning')
    expect(getRiskLabel(44)).toBe('Concerning')
    expect(getRiskLabel(45)).toBe('High risk')
    expect(getRiskLabel(69)).toBe('High risk')
    expect(getRiskLabel(70)).toBe('Severe risk')
    expect(getRiskLabel(100)).toBe('Severe risk')
  })
})
