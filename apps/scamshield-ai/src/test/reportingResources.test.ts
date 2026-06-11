import { describe, expect, it } from 'vitest'
import { reportingResources } from '../data/reportingResources'

describe('reporting resources', () => {
  it('uses maintained HTTPS destinations for the required official channels', () => {
    const names = reportingResources.map((resource) => resource.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'FTC ReportFraud',
        'FBI Internet Crime Complaint Center (IC3)',
        'IdentityTheft.gov',
        'Credit freeze and fraud alert guidance',
        'State consumer protection office',
        'United States Postal Inspection Service',
      ]),
    )
    expect(reportingResources.every((resource) => resource.url.startsWith('https://'))).toBe(true)
    expect(reportingResources.every((resource) => resource.official === true)).toBe(true)
  })
})
