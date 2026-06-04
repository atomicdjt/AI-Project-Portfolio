import type { EditorTool } from './ToolController'

export class GradientTool implements EditorTool {
  readonly id = 'gradient'
  readonly label = 'Gradient'
  readonly cursor = 'crosshair'

  onPointerDown(): void {}

  onPointerMove(): void {}

  onPointerUp(): void {}
}
