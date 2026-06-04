import type { ImageDocument } from '../document/DocumentModel'
import type { BlendMode, Layer, Rect } from '../document/LayerModel'

export type ViewportState = {
  zoom: number
  rotation: number
  panX: number
  panY: number
  devicePixelRatio: number
  showGrid: boolean
  showRulers: boolean
  showGuides: boolean
}

export type RenderContext = {
  ctx: CanvasRenderingContext2D
  viewport: ViewportState
  document: ImageDocument
}

export interface Renderer {
  render(document: ImageDocument, viewport: ViewportState, canvas: HTMLCanvasElement, draftSelection?: Rect | null): void
  renderLayer(layer: Layer, context: RenderContext): void
  compositeLayer(source: CanvasImageSource, blendMode: BlendMode, opacity: number): void
  invalidateRegion(bounds: Rect): void
}
