import type { UnitSystem } from './types'

export type DisplayDimension = 'feet' | 'inches' | 'meters' | 'centimeters'

const factors: Record<DisplayDimension, number> = {
  feet: 30.48,
  inches: 2.54,
  meters: 100,
  centimeters: 1,
}

export function displayToCentimeters(value: number, _system: UnitSystem, dimension: DisplayDimension): number {
  return value * factors[dimension]
}

export function centimetersToDisplay(value: number, _system: UnitSystem, dimension: DisplayDimension): number {
  return value / factors[dimension]
}

export function formatDistance(cm: number, system: UnitSystem, precision = 1): string {
  if (system === 'metric') {
    return cm >= 100 ? `${trim(cm / 100, precision)} m` : `${trim(cm, 0)} cm`
  }

  const inches = cm / 2.54
  return inches >= 24 ? `${trim(inches / 12, precision)} ft` : `${trim(inches, 0)} in`
}

export function formatBedDimension(cm: number, system: UnitSystem): string {
  return system === 'imperial' ? `${trim(cm / 30.48, 1)} ft` : `${trim(cm / 100, 2)} m`
}

function trim(value: number, precision: number): string {
  return Number(value.toFixed(precision)).toString()
}
