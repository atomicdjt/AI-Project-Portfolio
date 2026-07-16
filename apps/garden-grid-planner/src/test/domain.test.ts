import { describe, expect, it } from 'vitest'
import { getPlant, plants, searchPlants } from '../domain/plants'
import { generateRowPositions, getSquareFootOffsets, snapCoordinate } from '../domain/layout'
import { centimetersToDisplay, displayToCentimeters } from '../domain/units'

describe('unit conversion', () => {
  it('round trips imperial feet through centimeters', () => {
    const centimeters = displayToCentimeters(4, 'imperial', 'feet')
    expect(centimeters).toBeCloseTo(121.92)
    expect(centimetersToDisplay(centimeters, 'imperial', 'feet')).toBeCloseTo(4)
  })

  it('round trips metric meters through centimeters', () => {
    expect(displayToCentimeters(1.2, 'metric', 'meters')).toBe(120)
    expect(centimetersToDisplay(120, 'metric', 'meters')).toBe(1.2)
  })
})

describe('plant library', () => {
  it('contains at least forty curated plants', () => {
    expect(plants.length).toBeGreaterThanOrEqual(40)
    expect(getPlant('tomato')?.spacingCm).toBeGreaterThan(40)
  })

  it('searches names and categories without case sensitivity', () => {
    expect(searchPlants('BASIL').map((plant) => plant.id)).toContain('basil')
    expect(searchPlants('leafy').length).toBeGreaterThan(3)
  })
})

describe('layout calculations', () => {
  it('returns sixteen centered offsets for dense square-foot planting', () => {
    const offsets = getSquareFootOffsets(16)
    expect(offsets).toHaveLength(16)
    expect(offsets[0]).toEqual({ x: 3.81, y: 3.81 })
  })

  it('generates a row without extending past its requested length', () => {
    const positions = generateRowPositions({ x: 10, y: 20 }, 100, 25, 'horizontal')
    expect(positions).toEqual([
      { x: 10, y: 20 },
      { x: 35, y: 20 },
      { x: 60, y: 20 },
      { x: 85, y: 20 },
      { x: 110, y: 20 },
    ])
  })

  it('snaps coordinates to the nearest interval', () => {
    expect(snapCoordinate(27, 5)).toBe(25)
    expect(snapCoordinate(28, 5)).toBe(30)
  })
})
