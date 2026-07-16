import { getPlant } from './plants'
import type { GardenPlan } from './types'
import { resolveItemPoints, validatePlan } from './validation'

export interface PlanSummary {
  totalPlants: number
  varieties: number
  usedAreaCm2: number
  bedAreaCm2: number
  usedPercent: number
  remainingAreaCm2: number
  issueCount: number
  counts: Array<{ plantId: string; name: string; quantity: number; color: string }>
}

export function summarizePlan(plan: GardenPlan): PlanSummary {
  const countMap = new Map<string, number>()
  let totalPlants = 0
  let rawArea = 0

  for (const item of plan.items) {
    const plant = getPlant(item.plantId)
    if (!plant) continue
    const quantity = resolveItemPoints(item).length
    totalPlants += quantity
    countMap.set(plant.id, (countMap.get(plant.id) ?? 0) + quantity)
    rawArea += quantity * Math.PI * (plant.spacingCm / 2) ** 2
  }

  const bedAreaCm2 = plan.bed.widthCm * plan.bed.lengthCm
  const usedAreaCm2 = Math.min(rawArea, bedAreaCm2)

  return {
    totalPlants,
    varieties: countMap.size,
    usedAreaCm2,
    bedAreaCm2,
    usedPercent: bedAreaCm2 > 0 ? Math.round((usedAreaCm2 / bedAreaCm2) * 100) : 0,
    remainingAreaCm2: Math.max(0, bedAreaCm2 - usedAreaCm2),
    issueCount: validatePlan(plan).length,
    counts: Array.from(countMap, ([plantId, quantity]) => {
      const plant = getPlant(plantId)!
      return { plantId, name: plant.name, quantity, color: plant.color }
    }).sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name)),
  }
}
