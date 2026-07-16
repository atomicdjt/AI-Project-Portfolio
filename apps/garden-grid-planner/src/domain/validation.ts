import { generateRowPositions } from './layout'
import { getPlant } from './plants'
import type { GardenItem, GardenPlan, Placement, Point, ValidationIssue } from './types'

interface ResolvedPlantPoint extends Point {
  sourceItem: GardenItem
  spacingCm: number
  plantName: string
}

export function resolveItemPoints(item: GardenItem): ResolvedPlantPoint[] {
  const plant = getPlant(item.plantId)
  if (!plant) return []
  const points = item.kind === 'plant'
    ? [{ x: item.x, y: item.y }]
    : generateRowPositions(item.start, item.lengthCm, plant.spacingCm, item.orientation)

  return points.map((point) => ({
    ...point,
    sourceItem: item,
    spacingCm: plant.spacingCm,
    plantName: plant.name,
  }))
}

export function validatePlan(plan: GardenPlan): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const points = plan.items.flatMap(resolveItemPoints)

  for (const point of points) {
    const radius = point.spacingCm / 2
    if (point.x - radius < 0 || point.y - radius < 0 || point.x + radius > plan.bed.lengthCm || point.y + radius > plan.bed.widthCm) {
      issues.push({
        id: `boundary-${point.sourceItem.id}`,
        type: 'boundary',
        severity: 'error',
        itemIds: [point.sourceItem.id],
        message: `${point.plantName} extends beyond the bed edge.`,
        suggestion: 'Move it inward or choose a plant with a smaller spacing footprint.',
      })
    }
  }

  for (let firstIndex = 0; firstIndex < points.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < points.length; secondIndex += 1) {
      const first = points[firstIndex]
      const second = points[secondIndex]
      if (first.sourceItem.id === second.sourceItem.id && first.sourceItem.kind === 'row') continue
      const requiredDistance = Math.max(first.spacingCm, second.spacingCm) / 2
      const actualDistance = Math.hypot(first.x - second.x, first.y - second.y)
      if (actualDistance < requiredDistance) {
        const ids = [first.sourceItem.id, second.sourceItem.id]
        issues.push({
          id: `overlap-${ids.sort().join('-')}`,
          type: 'overlap',
          severity: 'warning',
          itemIds: ids,
          message: `${first.plantName} and ${second.plantName} are closer than recommended.`,
          suggestion: `Separate their centers by at least ${Math.round(Math.max(first.spacingCm, second.spacingCm))} cm.`,
        })
      }
    }
  }

  return uniqueIssues(issues)
}

function uniqueIssues(issues: ValidationIssue[]): ValidationIssue[] {
  return Array.from(new Map(issues.map((issue) => [issue.id, issue])).values())
}

export function isPlacement(item: GardenItem): item is Placement {
  return item.kind === 'plant'
}
