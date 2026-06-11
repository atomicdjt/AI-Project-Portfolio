import { beforeEach, describe, expect, it } from 'vitest'
import { clearStoredState, loadStoredState, saveStoredState, STORAGE_KEY } from '../lib/storage'
import type { ScamCase } from '../types/case'

const sampleCase: ScamCase = {
  id: 'case-1',
  name: 'Storage test',
  createdAt: '2026-06-11T00:00:00.000Z',
  updatedAt: '2026-06-11T00:00:00.000Z',
  role: 'target',
  scamType: 'unknown',
  urgency: 'suspicious-only',
  contactMethod: 'email',
  evidenceText: 'Sample evidence',
  manualExtractedText: '',
  suspiciousUrl: '',
  paymentDestination: '',
  claimedCompany: '',
  contactDetails: '',
  amountRequested: '',
  pressureLanguage: '',
  notes: '',
  attachments: [{ id: 'file-1', name: 'evidence.png', type: 'image/png', size: 12, previewUrl: 'data:image/png;base64,private' }],
  timeline: [],
  checklist: [],
  caregiver: { personHelped: '', relationship: '', hasConsent: false, notes: '' },
  analysis: null,
}

describe('local case storage', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips versioned state without persisting temporary image preview data', () => {
    saveStoredState({ caseData: sampleCase, currentStep: 2, plainLanguage: true, caregiverMode: false })
    const raw = localStorage.getItem(STORAGE_KEY) ?? ''
    const loaded = loadStoredState()

    expect(raw).not.toContain('base64,private')
    expect(loaded?.caseData.name).toBe('Storage test')
    expect(loaded?.currentStep).toBe(2)
    expect(loaded?.plainLanguage).toBe(true)
  })

  it('rejects corrupt data and clears case data on request', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(loadStoredState()).toBeNull()

    saveStoredState({ caseData: sampleCase, currentStep: 1, plainLanguage: false, caregiverMode: false })
    clearStoredState()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
