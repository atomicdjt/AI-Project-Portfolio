import { Clock3, FilePlus2, FolderOpen, ImageDown } from 'lucide-react'
import { useRef } from 'react'
import { useEditorStore } from '../state/editorStore'
import { useUiStore } from '../state/uiStore'

export function StartScreen() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const recentProjects = useEditorStore((state) => state.recentProjects)
  const importImage = useEditorStore((state) => state.importImage)
  const loadProject = useEditorStore((state) => state.loadProject)
  const setProjectDialogOpen = useUiStore((state) => state.setProjectDialogOpen)

  return (
    <section className="start-screen">
      <div className="start-copy">
        <div className="brand-inline">
          <span>LF</span>
          <strong>LayerForge Studio</strong>
        </div>
        <h1>Layered raster editing in the browser.</h1>
        <p>
          Create a canvas, import images as layers, paint, select, filter, save locally, and export finished
          compositions.
        </p>
      </div>

      <div className="start-actions">
        <button type="button" className="start-card" onClick={() => setProjectDialogOpen(true)}>
          <FilePlus2 size={22} />
          <strong>New canvas</strong>
          <span>Choose size and background</span>
        </button>
        <button type="button" className="start-card" onClick={() => inputRef.current?.click()}>
          <ImageDown size={22} />
          <strong>Import image</strong>
          <span>PNG, JPEG, or WebP</span>
        </button>
      </div>

      <section className="recent-panel">
        <div className="panel-heading">
          <Clock3 size={16} />
          <h2>Recent Projects</h2>
        </div>
        {recentProjects.length === 0 ? (
          <p className="panel-note">Saved projects appear here after the first local save.</p>
        ) : (
          <div className="recent-list">
            {recentProjects.slice(0, 5).map((project) => (
              <button key={project.id} type="button" onClick={() => void loadProject(project.id)}>
                <FolderOpen size={16} />
                <span>
                  <strong>{project.name}</strong>
                  {project.width} x {project.height} px, {project.layerCount} layers
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            void importImage(file)
          }
          event.currentTarget.value = ''
        }}
      />
    </section>
  )
}
