import { create } from 'zustand'
import { demoCases } from '../data/demoCases'
import { analyzeScam } from '../lib/analyzeScam'
import { generateSafetyChecklist } from '../lib/safetyChecklist'
import { clearStoredState, loadStoredState, saveStoredState } from '../lib/storage'
import { suggestTimelineEntries } from '../lib/timelineSuggestions'
import type { CaregiverDetails, EvidenceAttachment, ScamCase, TimelineEntry } from '../types/case'

interface CaseStoreState {
  caseData: ScamCase
  currentStep: number
  plainLanguage: boolean
  caregiverMode: boolean
  exportConsent: boolean
  setStep: (step: number) => void
  updateCase: (patch: Partial<ScamCase>) => void
  updateCaregiver: (patch: Partial<CaregiverDetails>) => void
  setPlainLanguage: (enabled: boolean) => void
  setCaregiverMode: (enabled: boolean) => void
  setExportConsent: (enabled: boolean) => void
  loadDemo: (demoId: string) => void
  analyzeCurrentCase: () => void
  addAttachment: (attachment: EvidenceAttachment) => void
  removeAttachment: (id: string) => void
  addTimelineEntry: (entry: TimelineEntry) => void
  updateTimelineEntry: (id: string, patch: Partial<TimelineEntry>) => void
  removeTimelineEntry: (id: string) => void
  toggleChecklistItem: (id: string) => void
  clearAll: () => void
}

function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `case-${Date.now()}`
}

export function createEmptyCase(): ScamCase {
  const now = new Date().toISOString()
  return {
    id: makeId(),
    name: '',
    createdAt: now,
    updatedAt: now,
    role: 'target',
    scamType: 'unknown',
    urgency: 'suspicious-only',
    contactMethod: 'email',
    evidenceText: '',
    manualExtractedText: '',
    suspiciousUrl: '',
    paymentDestination: '',
    claimedCompany: '',
    contactDetails: '',
    amountRequested: '',
    pressureLanguage: '',
    notes: '',
    attachments: [],
    timeline: [],
    checklist: [],
    caregiver: { personHelped: '', relationship: '', hasConsent: false, notes: '' },
    analysis: null,
  }
}

const stored = typeof window === 'undefined' ? null : loadStoredState()

function persist(state: CaseStoreState): void {
  saveStoredState({
    caseData: state.caseData,
    currentStep: state.currentStep,
    plainLanguage: state.plainLanguage,
    caregiverMode: state.caregiverMode,
  })
}

export const useCaseStore = create<CaseStoreState>((set, get) => ({
  caseData: stored?.caseData ?? createEmptyCase(),
  currentStep: stored?.currentStep ?? 0,
  plainLanguage: stored?.plainLanguage ?? false,
  caregiverMode: stored?.caregiverMode ?? false,
  exportConsent: false,
  setStep: (step) => {
    set({ currentStep: Math.max(0, Math.min(4, step)) })
    persist(get())
  },
  updateCase: (patch) => {
    set((state) => ({ caseData: { ...state.caseData, ...patch, updatedAt: new Date().toISOString() } }))
    persist(get())
  },
  updateCaregiver: (patch) => {
    set((state) => ({
      caseData: {
        ...state.caseData,
        updatedAt: new Date().toISOString(),
        caregiver: { ...state.caseData.caregiver, ...patch },
      },
    }))
    persist(get())
  },
  setPlainLanguage: (plainLanguage) => {
    set({ plainLanguage })
    persist(get())
  },
  setCaregiverMode: (caregiverMode) => {
    set({ caregiverMode })
    persist(get())
  },
  setExportConsent: (exportConsent) => set({ exportConsent }),
  loadDemo: (demoId) => {
    const demo = demoCases.find((item) => item.id === demoId)
    if (!demo) return
    const caseData = structuredClone(demo.case)
    set({ caseData, currentStep: 1, caregiverMode: false, exportConsent: false })
    persist(get())
  },
  analyzeCurrentCase: () => {
    const state = get()
    const caseData = state.caseData
    const evidenceText = [caseData.evidenceText, caseData.manualExtractedText].filter(Boolean).join('\n')
    const analysis = analyzeScam({
      text: evidenceText,
      url: caseData.suspiciousUrl,
      claimedCompany: caseData.claimedCompany,
      paymentDestination: caseData.paymentDestination,
      contactDetails: caseData.contactDetails,
      amountRequested: caseData.amountRequested,
      pressureLanguage: caseData.pressureLanguage,
    })
    const checklist = generateSafetyChecklist({
      urgency: caseData.urgency,
      scamType: caseData.scamType,
      caregiverMode: state.caregiverMode,
      evidenceText,
      findings: analysis.findings,
    })
    const suggested = suggestTimelineEntries({ text: evidenceText, sourceLabel: 'Submitted evidence' })
    set({
      caseData: {
        ...caseData,
        analysis,
        checklist,
        timeline: caseData.timeline.length > 0 ? caseData.timeline : suggested,
        updatedAt: new Date().toISOString(),
      },
      currentStep: 2,
      exportConsent: false,
    })
    persist(get())
  },
  addAttachment: (attachment) => {
    set((state) => ({ caseData: { ...state.caseData, attachments: [...state.caseData.attachments, attachment] } }))
    persist(get())
  },
  removeAttachment: (id) => {
    const attachment = get().caseData.attachments.find((item) => item.id === id)
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    set((state) => ({ caseData: { ...state.caseData, attachments: state.caseData.attachments.filter((item) => item.id !== id) } }))
    persist(get())
  },
  addTimelineEntry: (entry) => {
    set((state) => ({ caseData: { ...state.caseData, timeline: [...state.caseData.timeline, entry] } }))
    persist(get())
  },
  updateTimelineEntry: (id, patch) => {
    set((state) => ({
      caseData: {
        ...state.caseData,
        timeline: state.caseData.timeline.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
      },
    }))
    persist(get())
  },
  removeTimelineEntry: (id) => {
    set((state) => ({ caseData: { ...state.caseData, timeline: state.caseData.timeline.filter((entry) => entry.id !== id) } }))
    persist(get())
  },
  toggleChecklistItem: (id) => {
    set((state) => ({
      caseData: {
        ...state.caseData,
        checklist: state.caseData.checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
      },
    }))
    persist(get())
  },
  clearAll: () => {
    get().caseData.attachments.forEach((attachment) => {
      if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    })
    clearStoredState()
    set({
      caseData: createEmptyCase(),
      currentStep: 0,
      plainLanguage: false,
      caregiverMode: false,
      exportConsent: false,
    })
  },
}))
