import type { EditorTool } from './ToolController'

export class CropTool implements EditorTool {
  readonly id = 'crop'
  readonly label = 'Crop'
  readonly cursor = 'crosshair'

  onPointerDown(): void {}

  onPointerMove(): void {}

  onPointerUp(): void {}
}
