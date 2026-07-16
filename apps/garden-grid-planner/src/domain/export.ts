import { z } from 'zod'
import { getPlant } from './plants'
import type { GardenPlan, PersistedGardenData } from './types'
import { resolveItemPoints } from './validation'

const pointSchema = z.object({ x: z.number(), y: z.number() })
const placementSchema = z.discriminatedUnion('kind', [
  z.object({ id: z.string(), plantId: z.string(), kind: z.literal('plant'), x: z.number(), y: z.number() }),
  z.object({
    id: z.string(),
    plantId: z.string(),
    kind: z.literal('row'),
    start: pointSchema,
    lengthCm: z.number().positive(),
    orientation: z.enum(['horizontal', 'vertical']),
  }),
])
const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string(),
  unitSystem: z.enum(['imperial', 'metric']),
  mode: z.enum(['square-foot', 'rows']),
  bed: z.object({ widthCm: z.number().positive().max(2000), lengthCm: z.number().positive().max(5000) }),
  items: z.array(placementSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})
const persistedSchema = z.object({ version: z.literal(1), activePlanId: z.string(), plans: z.array(planSchema).min(1) })

export function exportPlanCsv(plan: GardenPlan): string {
  const rows = [['Plant', 'Quantity', 'Type', 'Spacing (cm)', 'X / start (cm)', 'Y / start (cm)', 'Orientation', 'Notes']]

  for (const item of plan.items) {
    const plant = getPlant(item.plantId)
    if (!plant) continue
    const start = item.kind === 'plant' ? item : item.start
    rows.push([
      plant.name,
      String(resolveItemPoints(item).length),
      item.kind === 'plant' ? 'Plant' : 'Row',
      String(plant.spacingCm),
      String(Math.round(start.x * 10) / 10),
      String(Math.round(start.y * 10) / 10),
      item.kind === 'row' ? item.orientation : '',
      plant.note,
    ])
  }

  return rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')
}

export function exportPlansJson(data: PersistedGardenData): string {
  return JSON.stringify(data, null, 2)
}

export function importPlansJson(json: string): PersistedGardenData {
  try {
    return persistedSchema.parse(JSON.parse(json)) as PersistedGardenData
  } catch {
    throw new Error('Invalid GardenGrid backup')
  }
}

function csvEscape(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}
