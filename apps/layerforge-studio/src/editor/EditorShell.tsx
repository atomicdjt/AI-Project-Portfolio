import clsx from 'clsx'
import {
  Download,
  FileDown,
  FilePlus2,
  FolderOpen,
  ImageDown,
  Layers3,
  PanelRight,
  Redo2,
  Save,
  SlidersHorizontal,
  Undo2,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NewProjectDialog } from '../components/NewProjectDialog'
import { StartScreen } from '../components/StartScreen'
import { useEditorStore } from '../state/editorStore'
import { useUiStore } from '../state/uiStore'
import { CanvasViewport } from './CanvasViewport'
import { ColorPanel } from './ColorPanel'
import { HistoryPanel } from './HistoryPanel'
import { LayersPanel } from './LayersPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { ToolBar } from './ToolBar'

export function EditorShell() {
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const document = useEditorStore((state) => state.document)
  const saveStatus = useEditorStore((state) => state.saveStatus)
  const error = useEditorStore((state) => state.error)
  const recentProjects = useEditorStore((state) => state.recentProjects)
  const importImage = useEditorStore((state) => state.importImage)
  const saveCurrentProject = useEditorStore((state) => state.saveCurrentProject)
  const loadProject = useEditorStore((state) => state.loadProject)
  const refreshRecentProjects = useEditorStore((state) => state.refreshRecentProjects)
  const exportCurrentImage = useEditorStore((state) => state.exportCurrentImage)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const history = useEditorStore((state) => state.history)
  const dismissError = useEditorStore((state) => state.dismissError)
  const inspectorTab = useUiStore((state) => state.inspectorTab)
  const setInspectorTab = useUiStore((state) => state.setInspectorTab)
  const setProjectDialogOpen = useUiStore((state) => state.setProjectDialogOpen)

  useEffect(() => {
    void refreshRecentProjects()
  }, [refreshRecentProjects])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.matches('input, textarea, select')) {
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        void saveCurrentProject()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [redo, saveCurrentProject, undo])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (useEditorStore.getState().document && useEditorStore.getState().saveStatus === 'unsaved') {
        void useEditorStore.getState().saveCurrentProject()
      }
    }, 30000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="layerforge-shell">
      <header className="project-bar">
        <div className="project-identity">
          <div className="brand-tile" aria-hidden="true">
            LF
          </div>
          <div>
            <strong>LayerForge Studio</strong>
            <span>{document ? `${document.name} - ${document.width} x ${document.height}` : 'Local-first image editor'}</span>
          </div>
        </div>

        <div className="project-actions">
          <button type="button" onClick={() => setProjectDialogOpen(true)} title="New project">
            <FilePlus2 size={17} />
            New
          </button>
          <button type="button" onClick={() => importInputRef.current?.click()} title="Import image">
            <ImageDown size={17} />
            Import
          </button>
          <button type="button" onClick={() => void saveCurrentProject()} disabled={!document || saveStatus === 'saving'} title="Save local project">
            <Save size={17} />
            Save
          </button>
          <label className="recent-select" title="Load recent project">
            <FolderOpen size={17} />
            <select
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  void loadProject(event.target.value)
                }
              }}
            >
              <option value="">Recent</option>
              {recentProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void exportCurrentImage({ format: 'png', transparentBackground: true })} disabled={!document}>
            <FileDown size={17} />
            PNG
          </button>
          <button type="button" onClick={() => void exportCurrentImage({ format: 'jpeg', quality: 0.92 })} disabled={!document}>
            <Download size={17} />
            JPEG
          </button>
        </div>

        <div className="edit-actions">
          <button type="button" onClick={undo} disabled={history.undoStack.length === 0} title="Undo Ctrl+Z">
            <Undo2 size={17} />
          </button>
          <button type="button" onClick={redo} disabled={history.redoStack.length === 0} title="Redo Ctrl+Shift+Z">
            <Redo2 size={17} />
          </button>
          <span className={clsx('save-pill', saveStatus)}>{statusLabel(saveStatus)}</span>
        </div>
      </header>

      {error && (
        <div className="error-toast" role="alert">
          <span>{error}</span>
          <button type="button" onClick={dismissError}>
            Dismiss
          </button>
        </div>
      )}

      <section className="editor-grid">
        <ToolBar />
        <section className="workspace-column">{document ? <CanvasViewport /> : <StartScreen />}</section>
        <aside className="inspector" aria-label="Inspector">
          <div className="inspector-tabs">
            <button
              type="button"
              className={clsx(inspectorTab === 'properties' && 'active')}
              onClick={() => setInspectorTab('properties')}
            >
              <SlidersHorizontal size={16} />
              Properties
            </button>
            <button type="button" className={clsx(inspectorTab === 'layers' && 'active')} onClick={() => setInspectorTab('layers')}>
              <Layers3 size={16} />
              Layers
            </button>
            <button type="button" className={clsx(inspectorTab === 'export' && 'active')} onClick={() => setInspectorTab('export')}>
              <PanelRight size={16} />
              Output
            </button>
          </div>
          {inspectorTab === 'properties' && (
            <>
              <PropertiesPanel />
              <ColorPanel />
            </>
          )}
          {inspectorTab === 'layers' && <LayersPanel />}
          {inspectorTab === 'export' && (
            <section className="panel-block">
              <div className="panel-heading">
                <FileDown size={16} />
                <h2>Export</h2>
              </div>
              <button
                type="button"
                className="wide-button"
                disabled={!document}
                onClick={() => void exportCurrentImage({ format: 'png', transparentBackground: true })}
              >
                Export transparent PNG
              </button>
              <button
                type="button"
                className="wide-button"
                disabled={!document}
                onClick={() => void exportCurrentImage({ format: 'png', transparentBackground: false })}
              >
                Export PNG with background
              </button>
              <button
                type="button"
                className="wide-button"
                disabled={!document}
                onClick={() => void exportCurrentImage({ format: 'jpeg', quality: 0.92 })}
              >
                Export JPEG
              </button>
            </section>
          )}
        </aside>
      </section>

      {document && <HistoryPanel />}
      <NewProjectDialog />
      <input
        ref={importInputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) {
            void importImage(file)
          }
          event.currentTarget.value = ''
        }}
      />
    </main>
  )
}

function statusLabel(status: string): string {
  if (status === 'saving') {
    return 'Saving'
  }

  if (status === 'unsaved') {
    return 'Unsaved'
  }

  if (status === 'failed') {
    return 'Save failed'
  }

  return 'Saved'
}
