import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import { useEditorStore } from '../state/editorStore'
import { useUiStore } from '../state/uiStore'

export function NewProjectDialog() {
  const open = useUiStore((state) => state.projectDialogOpen)
  const setOpen = useUiStore((state) => state.setProjectDialogOpen)
  const createNewDocument = useEditorStore((state) => state.createNewDocument)
  const [name, setName] = useState('Untitled Artwork')
  const [width, setWidth] = useState(1600)
  const [height, setHeight] = useState(1000)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')

  if (!open) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
        <div className="dialog-heading">
          <div>
            <ImagePlus size={18} />
            <h2 id="new-project-title">New Project</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} title="Close">
            <X size={17} />
          </button>
        </div>
        <div className="dialog-grid">
          <label>
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            <span>Width</span>
            <input type="number" min={64} max={8192} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
          </label>
          <label>
            <span>Height</span>
            <input
              type="number"
              min={64}
              max={8192}
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Background</span>
            <input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} />
          </label>
        </div>
        <div className="dialog-actions">
          <button type="button" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="primary-command"
            onClick={() => {
              createNewDocument({
                name,
                width,
                height,
                backgroundColor,
              })
              setOpen(false)
            }}
          >
            Create canvas
          </button>
        </div>
      </section>
    </div>
  )
}
