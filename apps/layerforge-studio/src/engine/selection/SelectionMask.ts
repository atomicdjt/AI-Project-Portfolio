import type { Rect } from '../document/LayerModel'
import { clampRect, normalizeRect } from '../document/LayerModel'

export type SelectionMask = {
  width: number
  height: number
  alpha: Uint8ClampedArray
  bounds: Rect
}

export function createEmptySelection(width: number, height: number): SelectionMask {
  return {
    width,
    height,
    alpha: new Uint8ClampedArray(width * height),
    bounds: { x: 0, y: 0, width: 0, height: 0 },
  }
}

export function createRectangularSelection(width: number, height: number, rect: Rect): SelectionMask {
  const selection = createEmptySelection(width, height)
  const bounds = clampRect(normalizeRect(rect), width, height)

  for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) {
    for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
      selection.alpha[y * width + x] = 255
    }
  }

  return {
    ...selection,
    bounds,
  }
}

export function cloneSelection(selection: SelectionMask | null): SelectionMask | null {
  if (!selection) {
    return null
  }

  return {
    ...selection,
    bounds: { ...selection.bounds },
    alpha: new Uint8ClampedArray(selection.alpha),
  }
}

export function invertSelection(selection: SelectionMask | null, width: number, height: number): SelectionMask {
  const source = selection ?? createEmptySelection(width, height)
  const alpha = new Uint8ClampedArray(width * height)
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      const next = source.alpha[index] > 0 ? 0 : 255
      alpha[index] = next

      if (next > 0) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + 1)
        maxY = Math.max(maxY, y + 1)
      }
    }
  }

  return {
    width,
    height,
    alpha,
    bounds: {
      x: minX === width ? 0 : minX,
      y: minY === height ? 0 : minY,
      width: Math.max(0, maxX - minX),
      height: Math.max(0, maxY - minY),
    },
  }
}

export function selectionAlphaAt(selection: SelectionMask | null, x: number, y: number): number {
  if (!selection) {
    return 255
  }

  const ix = Math.floor(x)
  const iy = Math.floor(y)

  if (ix < 0 || iy < 0 || ix >= selection.width || iy >= selection.height) {
    return 0
  }

  return selection.alpha[iy * selection.width + ix]
}

export function maskImageDataToSelection(
  before: ImageData,
  after: ImageData,
  selection: SelectionMask | null,
  bounds: Rect,
): ImageData {
  if (!selection) {
    return after
  }

  const result = new ImageData(new Uint8ClampedArray(after.data), after.width, after.height)

  for (let y = 0; y < result.height; y += 1) {
    for (let x = 0; x < result.width; x += 1) {
      const documentX = bounds.x + x
      const documentY = bounds.y + y
      const alpha = selectionAlphaAt(selection, documentX, documentY) / 255
      const index = (y * result.width + x) * 4

      if (alpha <= 0) {
        result.data[index] = before.data[index]
        result.data[index + 1] = before.data[index + 1]
        result.data[index + 2] = before.data[index + 2]
        result.data[index + 3] = before.data[index + 3]
      } else if (alpha < 1) {
        result.data[index] = before.data[index] + (result.data[index] - before.data[index]) * alpha
        result.data[index + 1] = before.data[index + 1] + (result.data[index + 1] - before.data[index + 1]) * alpha
        result.data[index + 2] = before.data[index + 2] + (result.data[index + 2] - before.data[index + 2]) * alpha
        result.data[index + 3] = before.data[index + 3] + (result.data[index + 3] - before.data[index + 3]) * alpha
      }
    }
  }

  return result
}
