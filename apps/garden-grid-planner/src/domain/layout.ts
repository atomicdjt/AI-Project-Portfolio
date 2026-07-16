import type { Point } from './types'

const FOOT_CM = 30.48

export function snapCoordinate(value: number, interval: number): number {
  if (interval <= 0) return value
  return Math.round(value / interval) * interval
}

export function getSquareFootOffsets(density: 1 | 2 | 4 | 8 | 9 | 16): Point[] {
  const layouts: Record<number, [number, number]> = {
    1: [1, 1],
    2: [2, 1],
    4: [2, 2],
    8: [4, 2],
    9: [3, 3],
    16: [4, 4],
  }
  const [columns, rows] = layouts[density]
  const cellWidth = FOOT_CM / columns
  const cellHeight = FOOT_CM / rows
  const result: Point[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      result.push({
        x: Number((cellWidth * (column + 0.5)).toFixed(2)),
        y: Number((cellHeight * (row + 0.5)).toFixed(2)),
      })
    }
  }

  return result.slice(0, density)
}

export function nearestSquareFootPosition(point: Point, density: 1 | 2 | 4 | 8 | 9 | 16): Point {
  const squareX = Math.floor(point.x / FOOT_CM) * FOOT_CM
  const squareY = Math.floor(point.y / FOOT_CM) * FOOT_CM
  const offsets = getSquareFootOffsets(density)
  let nearest = offsets[0]
  let distance = Number.POSITIVE_INFINITY

  for (const offset of offsets) {
    const candidate = { x: squareX + offset.x, y: squareY + offset.y }
    const currentDistance = Math.hypot(point.x - candidate.x, point.y - candidate.y)
    if (currentDistance < distance) {
      distance = currentDistance
      nearest = candidate
    }
  }

  return nearest
}

export function generateRowPositions(
  start: Point,
  lengthCm: number,
  spacingCm: number,
  orientation: 'horizontal' | 'vertical',
): Point[] {
  if (lengthCm < 0 || spacingCm <= 0) return []
  const count = Math.floor(lengthCm / spacingCm) + 1
  return Array.from({ length: count }, (_, index) => ({
    x: start.x + (orientation === 'horizontal' ? spacingCm * index : 0),
    y: start.y + (orientation === 'vertical' ? spacingCm * index : 0),
  }))
}
