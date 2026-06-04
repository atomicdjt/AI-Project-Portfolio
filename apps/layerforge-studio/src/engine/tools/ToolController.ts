import type { BrushPreset, StrokePoint } from '../brush/BrushPreset'
import { normalizePressure } from '../brush/PressureCurve'
import type { Rect } from '../document/LayerModel'

export type ToolId = 'move' | 'brush' | 'eraser' | 'selection' | 'crop' | 'gradient' | 'text' | 'hand' | 'zoom'

export type ToolPointerEvent = {
  point: StrokePoint
  originalEvent: PointerEvent
}

export interface EditorTool {
  id: ToolId
  label: string
  cursor: string
  onPointerDown(event: ToolPointerEvent): void
  onPointerMove(event: ToolPointerEvent): void
  onPointerUp(event: ToolPointerEvent): void
  onKeyDown?(event: KeyboardEvent): void
  renderOverlay?(ctx: CanvasRenderingContext2D): void
}

export type ToolRuntime = {
  brushPreset: BrushPreset
  color: string
  beginStroke(mode: 'paint' | 'erase', point: StrokePoint): void
  continueStroke(point: StrokePoint): void
  endStroke(): void
  beginSelection(point: StrokePoint): void
  updateSelection(point: StrokePoint): void
  commitSelection(): void
  panBy(dx: number, dy: number): void
  setZoomAt(point: { x: number; y: number }, direction: 1 | -1): void
}

export class ToolController {
  private readonly tools = new Map<ToolId, EditorTool>()

  register(tool: EditorTool): void {
    this.tools.set(tool.id, tool)
  }

  getTool(id: ToolId): EditorTool | null {
    return this.tools.get(id) ?? null
  }
}

export function createToolPointerEvent(originalEvent: PointerEvent, point: { x: number; y: number }): ToolPointerEvent {
  return {
    point: {
      x: point.x,
      y: point.y,
      pressure: normalizePressure(originalEvent.pressure),
      time: performance.now(),
    },
    originalEvent,
  }
}

export function pointRect(start: StrokePoint, end: StrokePoint): Rect {
  return {
    x: start.x,
    y: start.y,
    width: end.x - start.x,
    height: end.y - start.y,
  }
}
