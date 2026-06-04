import type { EditorTool, ToolPointerEvent, ToolRuntime } from './ToolController'

export class EraserTool implements EditorTool {
  readonly id = 'eraser'
  readonly label = 'Eraser'
  readonly cursor = 'cell'
  private readonly runtime: ToolRuntime

  constructor(runtime: ToolRuntime) {
    this.runtime = runtime
  }

  onPointerDown(event: ToolPointerEvent): void {
    this.runtime.beginStroke('erase', event.point)
  }

  onPointerMove(event: ToolPointerEvent): void {
    this.runtime.continueStroke(event.point)
  }

  onPointerUp(): void {
    this.runtime.endStroke()
  }
}
