import { describe, expect, it } from 'vitest'
import { exportPlanCsv, exportPlansJson, importPlansJson } from '../domain/export'
import { summarizePlan } from '../domain/summary'
import type { GardenPlan } from '../domain/types'
import { validatePlan } from '../domain/validation'

const plan: GardenPlan = {
  id: 'plan-1',
  name: 'Test bed',
  notes: 'Near the patio',
  unitSystem: 'imperial',
  mode: 'rows',
  bed: { widthCm: 121.92, lengthCm: 243.84 },
  createdAt: '2026-06-10T00:00:00.000Z',
  updatedAt: '2026-06-10T00:00:00.000Z',
  items: [
    { id: 'tomato-1', kind: 'plant', plantId: 'tomato', x: 30, y: 30 },
    { id: 'tomato-2', kind: 'plant', plantId: 'tomato', x: 45, y: 30 },
    {
      id: 'carrot-row',
      kind: 'row',
      plantId: 'carrot',
      start: { x: 10, y: 90 },
      lengthCm: 50,
      orientation: 'horizontal',
    },
  ],
}

describe('validation', () => {
  it('reports minimum-spacing overlaps', () => {
    const issues = validatePlan(plan)
    expect(issues.some((issue) => issue.type === 'overlap')).toBe(true)
  })

  it('reports items whose spacing footprint crosses the bed boundary', () => {
    const outsidePlan = {
      ...plan,
      items: [{ id: 'edge', kind: 'plant' as const, plantId: 'tomato', x: 2, y: 2 }],
    }
    expect(validatePlan(outsidePlan).some((issue) => issue.type === 'boundary')).toBe(true)
  })
})

describe('plan summary', () => {
  it('counts generated row plants and varieties', () => {
    const summary = summarizePlan(plan)
    expect(summary.totalPlants).toBe(13)
    expect(summary.varieties).toBe(2)
    expect(summary.usedAreaCm2).toBeGreaterThan(0)
  })
})

describe('portable exports', () => {
  it('writes a CSV with item quantities and coordinates', () => {
    const csv = exportPlanCsv(plan)
    expect(csv).toContain('Plant,Quantity,Type')
    expect(csv).toContain('Carrot,11,Row')
    expect(csv).toContain('Tomato,1,Plant')
  })

  it('validates a JSON backup before importing it', () => {
    const json = exportPlansJson({ version: 1, activePlanId: plan.id, plans: [plan] })
    const restored = importPlansJson(json)
    expect(restored.plans[0].name).toBe('Test bed')
    expect(() => importPlansJson('{"version":2}')).toThrow('Invalid GardenGrid backup')
  })
})
