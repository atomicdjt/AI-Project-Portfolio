import type { ImageDocument } from '../document/DocumentModel'
import type { BlendMode, Layer, Rect, RasterLayer } from '../document/LayerModel'
import { getCanvasContext, isRasterLayer } from '../document/LayerModel'
import { drawMarchingAnts } from '../selection/MarchingAnts'
import { toCanvasCompositeOperation } from './CompositeEngine'
import type { RenderContext, Renderer, ViewportState } from './Renderer'
import { TileCache } from './TileCache'

export class Canvas2DRenderer implements Renderer {
  private readonly tileCache = new TileCache()
  private targetContext: CanvasRenderingContext2D | null = null
  private phase = 0

  render(document: ImageDocument, viewport: ViewportState, canvas: HTMLCanvasElement, draftSelection: Rect | null = null): void {
    const ctx = getCanvasContext(canvas)
    this.targetContext = ctx

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.max(1, viewport.devicePixelRatio || window.devicePixelRatio || 1)
    const nextWidth = Math.max(1, Math.round(rect.width * dpr))
    const nextHeight = Math.max(1, Math.round(rect.height * dpr))

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth
      canvas.height = nextHeight
    }

    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    this.drawWorkspace(ctx, rect.width, rect.height)

    ctx.translate(viewport.panX, viewport.panY)
    ctx.rotate(viewport.rotation)
    ctx.scale(viewport.zoom, viewport.zoom)

    this.drawDocumentBoundary(ctx, document)

    for (const layer of document.layers) {
      this.renderLayer(layer, { ctx, viewport, document })
    }

    if (viewport.showGrid && viewport.zoom >= 8) {
      this.drawPixelGrid(ctx, document)
    }

    if (document.selection) {
      drawMarchingAnts(ctx, document.selection.bounds, this.phase)
    }

    if (draftSelection) {
      drawMarchingAnts(ctx, draftSelection, this.phase, '#65d6ff')
    }

    ctx.restore()
    this.phase = (this.phase + 0.8) % 10
  }

  renderLayer(layer: Layer, context: RenderContext): void {
    if (!isRasterLayer(layer) || !layer.visible || layer.opacity <= 0) {
      return
    }

    this.drawRasterLayer(layer, context.ctx)
  }

  compositeLayer(source: CanvasImageSource, blendMode: BlendMode, opacity: number): void {
    if (!this.targetContext) {
      return
    }

    this.targetContext.save()
    this.targetContext.globalAlpha = opacity
    this.targetContext.globalCompositeOperation = toCanvasCompositeOperation(blendMode)
    this.targetContext.drawImage(source, 0, 0)
    this.targetContext.restore()
  }

  invalidateRegion(bounds: Rect): void {
    this.tileCache.markDirty(bounds)
  }

  private drawRasterLayer(layer: RasterLayer, ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity))
    ctx.globalCompositeOperation = toCanvasCompositeOperation(layer.blendMode)
    ctx.translate(layer.transform.x, layer.transform.y)
    ctx.rotate(layer.transform.rotation)
    ctx.transform(1, Math.tan(layer.transform.skewY), Math.tan(layer.transform.skewX), 1, 0, 0)
    ctx.scale(layer.transform.scaleX, layer.transform.scaleY)
    ctx.drawImage(layer.canvas, 0, 0)
    ctx.restore()
  }

  private drawWorkspace(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#090b0f'
    ctx.fillRect(0, 0, width, height)

    const size = 16
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        ctx.fillStyle = (x / size + y / size) % 2 === 0 ? '#11151c' : '#151b24'
        ctx.fillRect(x, y, size, size)
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.018)'
    for (let x = 0; x < width; x += 48) {
      ctx.fillRect(x, 0, 1, height)
    }
    for (let y = 0; y < height; y += 48) {
      ctx.fillRect(0, y, width, 1)
    }
  }

  private drawDocumentBoundary(ctx: CanvasRenderingContext2D, document: ImageDocument): void {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 14
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.fillRect(0, 0, document.width, document.height)
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, document.width, document.height)
    ctx.restore()
  }

  private drawPixelGrid(ctx: CanvasRenderingContext2D, document: ImageDocument): void {
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1 / 10

    for (let x = 0; x <= document.width; x += 1) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, document.height)
      ctx.stroke()
    }

    for (let y = 0; y <= document.height; y += 1) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(document.width, y)
      ctx.stroke()
    }

    ctx.restore()
  }
}
