import type { Rect } from '../engine/document/LayerModel'

export function getChangedBounds(before: ImageData, after: ImageData): Rect | null {
  if (before.width !== after.width || before.height !== after.height || before.data.length !== after.data.length) {
    return {
      x: 0,
      y: 0,
      width: after.width,
      height: after.height,
    }
  }

  let minX = after.width
  let minY = after.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < after.height; y += 1) {
    for (let x = 0; x < after.width; x += 1) {
      const index = (y * after.width + x) * 4

      if (
        before.data[index] !== after.data[index] ||
        before.data[index + 1] !== after.data[index + 1] ||
        before.data[index + 2] !== after.data[index + 2] ||
        before.data[index + 3] !== after.data[index + 3]
      ) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + 1)
        maxY = Math.max(maxY, y + 1)
      }
    }
  }

  if (minX === after.width) {
    return null
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export function extractPatch(source: ImageData, bounds: Rect): ImageData {
  const data = new Uint8ClampedArray(bounds.width * bounds.height * 4)

  for (let y = 0; y < bounds.height; y += 1) {
    const sourceStart = ((bounds.y + y) * source.width + bounds.x) * 4
    const targetStart = y * bounds.width * 4
    data.set(source.data.slice(sourceStart, sourceStart + bounds.width * 4), targetStart)
  }

  return new ImageData(data, bounds.width, bounds.height)
}

export function imageDataEquals(left: ImageData, right: ImageData): boolean {
  if (left.width !== right.width || left.height !== right.height || left.data.length !== right.data.length) {
    return false
  }

  for (let index = 0; index < left.data.length; index += 1) {
    if (left.data[index] !== right.data[index]) {
      return false
    }
  }

  return true
}
