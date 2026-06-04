import type { EditorTool } from './ToolController'

export class TextTool implements EditorTool {
  readonly id = 'text'
  readonly label = 'Text'
  readonly cursor = 'text'

  onPointerDown(): void {}

  onPointerMove(): void {}

  onPointerUp(): void {}
}
