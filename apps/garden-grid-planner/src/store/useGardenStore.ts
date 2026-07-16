import { create } from 'zustand'
import { exportPlansJson, importPlansJson } from '../domain/export'
import type { Bed, GardenItem, GardenPlan, PersistedGardenData, PlanningMode, Point, UnitSystem } from '../domain/types'

const STORAGE_KEY = 'garden-grid-plans-v1'
const HISTORY_LIMIT = 40

interface GardenState {
  plans: GardenPlan[]
  activePlanId: string
  selectedPlantId: string
  selectedItemId: string | null
  zoom: number
  mobilePanel: 'library' | 'bed' | 'summary'
  past: GardenPlan[]
  future: GardenPlan[]
  saveStatus: 'saved' | 'saving'
  announcement: string
  activePlan: () => GardenPlan
  setActivePlan: (id: string) => void
  createPlan: (name?: string) => string
  duplicatePlan: (id?: string) => string
  deletePlan: (id: string) => void
  renamePlan: (id: string, name: string) => void
  setNotes: (notes: string) => void
  setUnitSystem: (unitSystem: UnitSystem) => void
  setMode: (mode: PlanningMode) => void
  setBed: (bed: Bed) => void
  addPlant: (plantId: string, point: Point) => string
  addRow: (plantId: string, point: Point, lengthCm?: number, orientation?: 'horizontal' | 'vertical') => string
  movePlant: (id: string, point: Point) => void
  deleteItem: (id: string) => void
  duplicateItem: (id: string) => string | null
  rotateRow: (id: string) => void
  selectPlant: (id: string) => void
  selectItem: (id: string | null) => void
  setZoom: (zoom: number) => void
  setMobilePanel: (panel: GardenState['mobilePanel']) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  exportData: () => string
  importData: (json: string) => void
  resetForTests: () => void
}

export const useGardenStore = create<GardenState>((set, get) => {
  const initialData = loadPersistedData()

  const commitPlan = (mutator: (plan: GardenPlan) => GardenPlan, announcement: string) => {
    const current = get().activePlan()
    const updated = { ...mutator(current), updatedAt: new Date().toISOString() }
    set((state) => ({
      plans: state.plans.map((plan) => (plan.id === current.id ? updated : plan)),
      past: [...state.past, current].slice(-HISTORY_LIMIT),
      future: [],
      saveStatus: 'saving',
      announcement,
    }))
    persistSoon(get)
  }

  return {
    ...initialData,
    selectedPlantId: 'tomato',
    selectedItemId: null,
    zoom: 1,
    mobilePanel: 'bed',
    past: [],
    future: [],
    saveStatus: 'saved',
    announcement: 'Kitchen Garden loaded.',
    activePlan: () => get().plans.find((plan) => plan.id === get().activePlanId) ?? get().plans[0],
    setActivePlan: (id) => {
      if (!get().plans.some((plan) => plan.id === id)) return
      set({ activePlanId: id, selectedItemId: null, past: [], future: [], announcement: 'Plan opened.' })
      persistNow(get())
    },
    createPlan: (name = 'Untitled garden') => {
      const plan = createBlankPlan(name)
      set((state) => ({ plans: [...state.plans, plan], activePlanId: plan.id, selectedItemId: null, past: [], future: [] }))
      persistNow(get())
      return plan.id
    },
    duplicatePlan: (id = get().activePlanId) => {
      const source = get().plans.find((plan) => plan.id === id) ?? get().activePlan()
      const now = new Date().toISOString()
      const duplicate: GardenPlan = {
        ...structuredClone(source),
        id: makeId('plan'),
        name: `${source.name} copy`,
        items: source.items.map((item) => ({ ...structuredClone(item), id: makeId(item.kind) })),
        createdAt: now,
        updatedAt: now,
      }
      set((state) => ({ plans: [...state.plans, duplicate], activePlanId: duplicate.id, selectedItemId: null, past: [], future: [] }))
      persistNow(get())
      return duplicate.id
    },
    deletePlan: (id) => {
      const remaining = get().plans.filter((plan) => plan.id !== id)
      const plans = remaining.length > 0 ? remaining : [createBlankPlan('New garden')]
      set({ plans, activePlanId: plans[0].id, selectedItemId: null, past: [], future: [] })
      persistNow(get())
    },
    renamePlan: (id, name) => {
      const cleanName = name.trim() || 'Untitled garden'
      set((state) => ({ plans: state.plans.map((plan) => (plan.id === id ? { ...plan, name: cleanName } : plan)) }))
      persistNow(get())
    },
    setNotes: (notes) => commitPlan((plan) => ({ ...plan, notes }), 'Plan notes updated.'),
    setUnitSystem: (unitSystem) => commitPlan((plan) => ({ ...plan, unitSystem }), `${unitSystem} units selected.`),
    setMode: (mode) => commitPlan((plan) => ({ ...plan, mode }), `${mode === 'rows' ? 'Row' : 'Square-foot'} mode selected.`),
    setBed: (bed) => {
      if (bed.widthCm <= 0 || bed.lengthCm <= 0 || bed.widthCm > 2000 || bed.lengthCm > 5000) return
      commitPlan((plan) => ({ ...plan, bed }), 'Bed dimensions updated.')
    },
    addPlant: (plantId, point) => {
      const id = makeId('plant')
      commitPlan((plan) => ({ ...plan, items: [...plan.items, { id, kind: 'plant', plantId, ...point }] }), 'Plant added to the bed.')
      set({ selectedItemId: id })
      return id
    },
    addRow: (plantId, point, lengthCm = 90, orientation = 'horizontal') => {
      const id = makeId('row')
      commitPlan((plan) => ({
        ...plan,
        items: [...plan.items, { id, kind: 'row', plantId, start: point, lengthCm, orientation }],
      }), 'Plant row added to the bed.')
      set({ selectedItemId: id })
      return id
    },
    movePlant: (id, point) => commitPlan((plan) => ({
      ...plan,
      items: plan.items.map((item) => item.id === id && item.kind === 'plant' ? { ...item, ...point } : item),
    }), 'Plant moved.'),
    deleteItem: (id) => {
      commitPlan((plan) => ({ ...plan, items: plan.items.filter((item) => item.id !== id) }), 'Placement deleted.')
      set({ selectedItemId: null })
    },
    duplicateItem: (id) => {
      const item = get().activePlan().items.find((candidate) => candidate.id === id)
      if (!item) return null
      const duplicate = duplicateGardenItem(item)
      commitPlan((plan) => ({ ...plan, items: [...plan.items, duplicate] }), 'Placement duplicated.')
      set({ selectedItemId: duplicate.id })
      return duplicate.id
    },
    rotateRow: (id) => commitPlan((plan) => ({
      ...plan,
      items: plan.items.map((item) => item.id === id && item.kind === 'row'
        ? { ...item, orientation: item.orientation === 'horizontal' ? 'vertical' : 'horizontal' }
        : item),
    }), 'Row rotated.'),
    selectPlant: (id) => set({ selectedPlantId: id, selectedItemId: null, mobilePanel: 'bed' }),
    selectItem: (id) => set({ selectedItemId: id }),
    setZoom: (zoom) => set({ zoom: Math.min(1.5, Math.max(0.65, zoom)) }),
    setMobilePanel: (mobilePanel) => set({ mobilePanel }),
    undo: () => {
      const previous = get().past.at(-1)
      if (!previous) return
      const current = get().activePlan()
      set((state) => ({
        plans: state.plans.map((plan) => plan.id === current.id ? previous : plan),
        past: state.past.slice(0, -1),
        future: [current, ...state.future].slice(0, HISTORY_LIMIT),
        selectedItemId: null,
        announcement: 'Last edit undone.',
      }))
      persistNow(get())
    },
    redo: () => {
      const next = get().future[0]
      if (!next) return
      const current = get().activePlan()
      set((state) => ({
        plans: state.plans.map((plan) => plan.id === current.id ? next : plan),
        past: [...state.past, current].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        selectedItemId: null,
        announcement: 'Edit restored.',
      }))
      persistNow(get())
    },
    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,
    exportData: () => exportPlansJson(toPersistedData(get())),
    importData: (json) => {
      const data = importPlansJson(json)
      set({ ...data, past: [], future: [], selectedItemId: null, announcement: 'Backup imported.' })
      persistNow(get())
    },
    resetForTests: () => set({
      ...createStarterData(),
      selectedPlantId: 'tomato',
      selectedItemId: null,
      zoom: 1,
      mobilePanel: 'bed',
      past: [],
      future: [],
      saveStatus: 'saved',
      announcement: '',
    }),
  }
})

let saveTimer: ReturnType<typeof setTimeout> | undefined

function persistSoon(get: () => GardenState): void {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    persistNow(get())
    useGardenStore.setState({ saveStatus: 'saved' })
  }, 180)
}

function persistNow(state: GardenState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersistedData(state)))
  } catch {
    // The in-memory plan remains usable if browser storage is unavailable.
  }
}

function toPersistedData(state: Pick<GardenState, 'plans' | 'activePlanId'>): PersistedGardenData {
  return { version: 1, plans: state.plans, activePlanId: state.activePlanId }
}

function loadPersistedData(): PersistedGardenData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? importPlansJson(raw) : createStarterData()
  } catch {
    return createStarterData()
  }
}

function createStarterData(): PersistedGardenData {
  const plan = createBlankPlan('Kitchen Garden')
  plan.items = [
    { id: 'sample-tomato-1', kind: 'plant', plantId: 'tomato', x: 45.72, y: 45.72 },
    { id: 'sample-tomato-2', kind: 'plant', plantId: 'tomato', x: 106.68, y: 45.72 },
    { id: 'sample-lettuce-1', kind: 'plant', plantId: 'lettuce', x: 160.02, y: 22.86 },
    { id: 'sample-lettuce-2', kind: 'plant', plantId: 'lettuce', x: 175.26, y: 22.86 },
    { id: 'sample-carrot-1', kind: 'plant', plantId: 'carrot', x: 205.74, y: 15.24 },
    { id: 'sample-basil-1', kind: 'plant', plantId: 'basil', x: 45.72, y: 91.44 },
    { id: 'sample-kale-1', kind: 'plant', plantId: 'kale', x: 106.68, y: 91.44 },
    { id: 'sample-radish-row', kind: 'row', plantId: 'radish', start: { x: 145, y: 91.44 }, lengthCm: 75, orientation: 'horizontal' },
  ]
  return { version: 1, activePlanId: plan.id, plans: [plan] }
}

function createBlankPlan(name: string): GardenPlan {
  const now = new Date().toISOString()
  return {
    id: makeId('plan'),
    name,
    notes: '',
    unitSystem: 'imperial',
    mode: 'square-foot',
    bed: { widthCm: 121.92, lengthCm: 243.84 },
    items: [],
    createdAt: now,
    updatedAt: now,
  }
}

function duplicateGardenItem(item: GardenItem): GardenItem {
  if (item.kind === 'plant') return { ...item, id: makeId('plant'), x: item.x + 8, y: item.y + 8 }
  return { ...item, id: makeId('row'), start: { x: item.start.x + 8, y: item.start.y + 8 } }
}

function makeId(prefix: string): string {
  const value = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}-${value}`
}
