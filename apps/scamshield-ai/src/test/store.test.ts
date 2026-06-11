import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../lib/storage'
import { useCaseStore } from '../store/useCaseStore'

describe('case workflow store', () => {
  beforeEach(() => {
    localStorage.clear()
    useCaseStore.getState().clearAll()
  })

  it('loads a demo, analyzes it, and prepares checklist and timeline data', () => {
    useCaseStore.getState().loadDemo('bank-phishing')
    useCaseStore.getState().analyzeCurrentCase()

    const state = useCaseStore.getState()
    expect(state.caseData.name).toMatch(/demo/i)
    expect(state.caseData.analysis?.findings.length).toBeGreaterThan(0)
    expect(state.caseData.checklist.length).toBeGreaterThan(6)
    expect(state.caseData.timeline.length).toBeGreaterThan(0)
    expect(state.currentStep).toBe(2)
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Bank account locked')
  })

  it('updates caregiver state and completely clears persisted evidence', () => {
    useCaseStore.getState().updateCase({ name: 'Private case' })
    useCaseStore.getState().setCaregiverMode(true)
    useCaseStore.getState().updateCaregiver({ personHelped: 'Family member', hasConsent: true })

    expect(useCaseStore.getState().caregiverMode).toBe(true)
    expect(useCaseStore.getState().caseData.caregiver.hasConsent).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Private case')

    useCaseStore.getState().clearAll()
    expect(useCaseStore.getState().caseData.name).toBe('')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
