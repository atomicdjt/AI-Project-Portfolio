import { describe, expect, it } from 'vitest'
import { generateSafetyChecklist } from '../lib/safetyChecklist'

describe('safety checklist generation', () => {
  it('adds immediate financial-loss, credential, remote-access, government, and caregiver actions', () => {
    const items = generateSafetyChecklist({
      urgency: 'money-at-risk',
      scamType: 'government-impersonation',
      caregiverMode: true,
      evidenceText: 'I shared my password and installed remote access software after a Medicare call.',
      findings: [
        { category: 'Credential or personal-data request' },
        { category: 'Impersonation' },
      ],
    })
    const labels = items.map((item) => item.label).join(' ')

    expect(labels).toMatch(/contact your bank or payment provider immediately/i)
    expect(labels).toMatch(/change affected passwords/i)
    expect(labels).toMatch(/disconnect from the internet/i)
    expect(labels).toMatch(/contact the relevant agency directly/i)
    expect(labels).toMatch(/calm, non-blaming language/i)
  })
})
