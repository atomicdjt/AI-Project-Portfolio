export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'color-dodge'
  | 'color-burn'
  | 'darken'
  | 'lighten'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export const supportedBlendModes = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'difference',
] as const satisfies readonly BlendMode[]

export type Transform2D = {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  skewX: number
  skewY: number
}

export type LayerKind = 'raster' | 'group' | 'adjustment' | 'text' | 'shape'

export type BaseLayer = {
  id: string
  type: LayerKind
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  clippingMask?: boolean
  transform: Transform2D
}

export type RasterLayer = BaseLayer & {
  type: 'raster'
  canvas: HTMLCanvasElement
}

export type GroupLayer = BaseLayer & {
  type: 'group'
  children: Layer[]
}

export type AdjustmentLayer = BaseLayer & {
  type: 'adjustment'
  adjustment: unknown
}

export type TextLayer = BaseLayer & {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  color: string
  alignment: 'left' | 'center' | 'right'
}

export type ShapeLayer = BaseLayer & {
  type: 'shape'
  shape: unknown
  fill: string
  stroke?: string
  strokeWidth?: number
}

export type Layer = RasterLayer | GroupLayer | AdjustmentLayer | TextLayer | ShapeLayer

export function createTransform(overrides: Partial<Transform2D> = {}): Transform2D {
  return {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    skewX: 0,
    skewY: 0,
    ...overrides,
  }
}

export function createCanvas(width: number, height: number, fill?: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))

  if (fill) {
    const ctx = getCanvasContext(canvas)
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return canvas
}

export function isRasterLayer(layer: Layer | null | undefined): layer is RasterLayer {
  return layer?.type === 'raster'
}

export function cloneRasterCanvas(layer: RasterLayer): HTMLCanvasElement {
  const canvas = createCanvas(layer.canvas.width, layer.canvas.height)
  getCanvasContext(canvas).drawImage(layer.canvas, 0, 0)
  return canvas
}

export function cloneLayer(layer: Layer): Layer {
  if (layer.type === 'raster') {
    return {
      ...layer,
      canvas: cloneRasterCanvas(layer),
    }
  }

  if (layer.type === 'group') {
    return {
      ...layer,
      children: layer.children.map(cloneLayer),
    }
  }

  return { ...layer }
}

export function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d', { willReadFrequently: true })

  if (!context) {
    throw new Error('Canvas 2D is not available in this browser.')
  }

  return context
}

export function normalizeRect(rect: Rect): Rect {
  const x = rect.width < 0 ? rect.x + rect.width : rect.x
  const y = rect.height < 0 ? rect.y + rect.height : rect.y

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(Math.abs(rect.width)),
    height: Math.round(Math.abs(rect.height)),
  }
}

export function clampRect(rect: Rect, width: number, height: number): Rect {
  const normalized = normalizeRect(rect)
  const x = Math.max(0, Math.min(width, normalized.x))
  const y = Math.max(0, Math.min(height, normalized.y))
  const right = Math.max(x, Math.min(width, normalized.x + normalized.width))
  const bottom = Math.max(y, Math.min(height, normalized.y + normalized.height))

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  }
}

export function rectFromPoints(start: { x: number; y: number }, end: { x: number; y: number }): Rect {
  return normalizeRect({
    x: start.x,
    y: start.y,
    width: end.x - start.x,
    height: end.y - start.y,
  })
}
