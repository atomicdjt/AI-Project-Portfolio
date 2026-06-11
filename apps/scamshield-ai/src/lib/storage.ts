import type { ScamCase } from '../types/case'

export const STORAGE_KEY = 'scamshield-ai-case-v1'
const STORAGE_VERSION = 1

export interface StoredAppState {
  caseData: ScamCase
  currentStep: number
  plainLanguage: boolean
  caregiverMode: boolean
}

interface StorageEnvelope extends StoredAppState {
  version: number
}

function withoutPreviewData(caseData: ScamCase): ScamCase {
  return {
    ...caseData,
    attachments: caseData.attachments.map(({ id, name, type, size }) => ({ id, name, type, size })),
  }
}

export function saveStoredState(state: StoredAppState): void {
  const envelope: StorageEnvelope = {
    version: STORAGE_VERSION,
    ...state,
    caseData: withoutPreviewData(state.caseData),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
}

export function loadStoredState(): StoredAppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StorageEnvelope>
    if (parsed.version !== STORAGE_VERSION || !parsed.caseData || typeof parsed.currentStep !== 'number') return null
    return {
      caseData: parsed.caseData,
      currentStep: parsed.currentStep,
      plainLanguage: Boolean(parsed.plainLanguage),
      caregiverMode: Boolean(parsed.caregiverMode),
    }
  } catch {
    return null
  }
}

export function clearStoredState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
