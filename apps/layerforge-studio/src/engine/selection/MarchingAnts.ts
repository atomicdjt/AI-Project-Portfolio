import type { Rect } from '../document/LayerModel'

export function drawMarchingAnts(ctx: CanvasRenderingContext2D, rect: Rect, phase: number, color = '#f6f1e8'): void {
  if (rect.width <= 0 || rect.height <= 0) {
    return
  }

  ctx.save()
  ctx.lineWidth = 1
  ctx.setLineDash([6, 4])
  ctx.lineDashOffset = -phase
  ctx.strokeStyle = '#111317'
  ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height)
  ctx.lineDashOffset = 6 - phase
  ctx.strokeStyle = color
  ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width, rect.height)
  ctx.restore()
}
