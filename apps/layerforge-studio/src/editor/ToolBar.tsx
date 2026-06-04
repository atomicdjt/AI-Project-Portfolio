import clsx from 'clsx'
import {
  Brush,
  Eraser,
  Hand,
  MousePointer2,
  Pipette,
  Shapes,
  SquareDashedMousePointer,
  Type,
} from 'lucide-react'
import type { ToolId } from '../engine/tools/ToolController'
import { useEditorStore } from '../state/editorStore'

const tools = [
  { id: 'brush', label: 'Brush', icon: Brush },
  { id: 'eraser', label: 'Eraser', icon: Eraser },
  { id: 'selection', label: 'Rectangular selection', icon: SquareDashedMousePointer },
  { id: 'move', label: 'Pan workspace', icon: Hand },
  { id: 'crop', label: 'Crop placeholder', icon: MousePointer2 },
  { id: 'gradient', label: 'Gradient placeholder', icon: Shapes },
  { id: 'text', label: 'Text placeholder', icon: Type },
  { id: 'hand', label: 'Eyedropper placeholder', icon: Pipette },
] satisfies Array<{ id: ToolId; label: string; icon: typeof Brush }>

export function ToolBar() {
  const activeTool = useEditorStore((state) => state.activeTool)
  const setActiveTool = useEditorStore((state) => state.setActiveTool)

  return (
    <aside className="tool-rail" aria-label="Tools">
      <div className="forge-mark" aria-hidden="true">
        LF
      </div>
      <div className="tool-stack">
        {tools.map((tool) => {
          const Icon = tool.icon

          return (
            <button
              key={tool.id}
              type="button"
              className={clsx(activeTool === tool.id && 'active')}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={activeTool === tool.id}
            >
              <Icon size={20} strokeWidth={1.8} />
            </button>
          )
        })}
      </div>
    </aside>
  )
}
