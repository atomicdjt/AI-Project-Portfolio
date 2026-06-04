import type { EditorTool, ToolPointerEvent, ToolRuntime } from './ToolController'

export class BrushTool implements EditorTool {
  readonly id = 'brush'
  readonly label = 'Brush'
  readonly cursor = 'crosshair'
  private readonly runtime: ToolRuntime

  constructor(runtime: ToolRuntime) {
    this.runtime = runtime
  }

  onPointerDown(event: ToolPointerEvent): void {
    this.runtime.beginStroke('paint', event.point)
  }

  onPointerMove(event: ToolPointerEvent): void {
    this.runtime.continueStroke(event.point)
  }

  onPointerUp(): void {
    this.runtime.endStroke()
  }
}
