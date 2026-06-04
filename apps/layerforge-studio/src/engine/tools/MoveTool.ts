import type { EditorTool, ToolPointerEvent, ToolRuntime } from './ToolController'

export class MoveTool implements EditorTool {
  readonly id = 'move'
  readonly label = 'Move View'
  readonly cursor = 'grab'
  private readonly runtime: ToolRuntime
  private previous: ToolPointerEvent | null = null

  constructor(runtime: ToolRuntime) {
    this.runtime = runtime
  }

  onPointerDown(event: ToolPointerEvent): void {
    this.previous = event
  }

  onPointerMove(event: ToolPointerEvent): void {
    if (!this.previous) {
      return
    }

    this.runtime.panBy(
      event.originalEvent.movementX || event.point.x - this.previous.point.x,
      event.originalEvent.movementY || event.point.y - this.previous.point.y,
    )
    this.previous = event
  }

  onPointerUp(): void {
    this.previous = null
  }
}
