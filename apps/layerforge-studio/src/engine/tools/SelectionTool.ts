import type { EditorTool, ToolPointerEvent, ToolRuntime } from './ToolController'

export class SelectionTool implements EditorTool {
  readonly id = 'selection'
  readonly label = 'Rectangle Select'
  readonly cursor = 'crosshair'
  private readonly runtime: ToolRuntime

  constructor(runtime: ToolRuntime) {
    this.runtime = runtime
  }

  onPointerDown(event: ToolPointerEvent): void {
    this.runtime.beginSelection(event.point)
  }

  onPointerMove(event: ToolPointerEvent): void {
    this.runtime.updateSelection(event.point)
  }

  onPointerUp(): void {
    this.runtime.commitSelection()
  }
}
