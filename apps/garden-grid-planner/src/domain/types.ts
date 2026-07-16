export type UnitSystem = 'imperial' | 'metric'
export type PlanningMode = 'square-foot' | 'rows'
export type PlantCategory = 'fruits' | 'leafy' | 'roots' | 'brassicas' | 'legumes' | 'alliums' | 'herbs'
export type SunRequirement = 'Full sun' | 'Sun / part shade' | 'Part shade'

export interface Plant {
  id: string
  name: string
  category: PlantCategory
  glyph: string
  color: string
  spacingCm: number
  rowSpacingCm: number
  squareFootDensity: 1 | 2 | 4 | 8 | 9 | 16
  depthCm: number
  heightCm: number
  sun: SunRequirement
  note: string
  companions?: string[]
  conflicts?: string[]
}

export interface Point {
  x: number
  y: number
}

export interface Bed {
  widthCm: number
  lengthCm: number
}

export interface Placement extends Point {
  id: string
  plantId: string
  kind: 'plant'
}

export interface RowPlacement {
  id: string
  plantId: string
  kind: 'row'
  start: Point
  lengthCm: number
  orientation: 'horizontal' | 'vertical'
}

export type GardenItem = Placement | RowPlacement

export interface GardenPlan {
  id: string
  name: string
  notes: string
  unitSystem: UnitSystem
  mode: PlanningMode
  bed: Bed
  items: GardenItem[]
  createdAt: string
  updatedAt: string
}

export interface ValidationIssue {
  id: string
  type: 'boundary' | 'overlap' | 'row-spacing'
  severity: 'warning' | 'error'
  itemIds: string[]
  message: string
  suggestion: string
}

export interface PersistedGardenData {
  version: 1
  activePlanId: string
  plans: GardenPlan[]
}
