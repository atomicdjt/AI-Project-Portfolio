import type { Rect } from './LayerModel'

export type LayerMask = {
  id: string
  width: number
  height: number
  alpha: Uint8ClampedArray
  enabled: boolean
  linked: boolean
}

export function createLayerMask(width: number, height: number, fill = 255): LayerMask {
  const alpha = new Uint8ClampedArray(width * height)
  alpha.fill(fill)

  return {
    id: crypto.randomUUID(),
    width,
    height,
    alpha,
    enabled: true,
    linked: true,
  }
}

export function cloneLayerMask(mask: LayerMask): LayerMask {
  return {
    ...mask,
    alpha: new Uint8ClampedArray(mask.alpha),
  }
}

export function getMaskBounds(mask: LayerMask): Rect {
  let minX = mask.width
  let minY = mask.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      if (mask.alpha[y * mask.width + x] > 0) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + 1)
        maxY = Math.max(maxY, y + 1)
      }
    }
  }

  return {
    x: minX === mask.width ? 0 : minX,
    y: minY === mask.height ? 0 : minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  }
}
