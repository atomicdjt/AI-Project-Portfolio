import { History, Redo2, Undo2 } from 'lucide-react'
import { useEditorStore } from '../state/editorStore'

export function HistoryPanel() {
  const history = useEditorStore((state) => state.history)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)

  return (
    <footer className="history-strip" aria-label="History">
      <div className="history-title">
        <History size={16} />
        <span>History</span>
      </div>
      <div className="history-actions">
        <button type="button" onClick={undo} disabled={history.undoStack.length === 0} title="Undo Ctrl+Z">
          <Undo2 size={16} />
          Undo
        </button>
        <button type="button" onClick={redo} disabled={history.redoStack.length === 0} title="Redo Ctrl+Shift+Z">
          <Redo2 size={16} />
          Redo
        </button>
      </div>
      <ol className="history-list">
        {[...history.undoStack].reverse().slice(0, 8).map((command) => (
          <li key={command.id}>
            <span>{command.label}</span>
          </li>
        ))}
        {history.undoStack.length === 0 && <li className="empty-history">No edits yet</li>}
      </ol>
    </footer>
  )
}
