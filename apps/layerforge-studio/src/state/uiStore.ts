import { create } from 'zustand'

export type InspectorTab = 'properties' | 'layers' | 'history' | 'export'

type UiState = {
  inspectorTab: InspectorTab
  projectDialogOpen: boolean
  setInspectorTab(tab: InspectorTab): void
  setProjectDialogOpen(open: boolean): void
}

export const useUiStore = create<UiState>((set) => ({
  inspectorTab: 'properties',
  projectDialogOpen: false,
  setInspectorTab(tab) {
    set({ inspectorTab: tab })
  },
  setProjectDialogOpen(open) {
    set({ projectDialogOpen: open })
  },
}))
