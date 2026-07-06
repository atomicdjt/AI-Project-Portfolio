import { useMemo, useState } from 'react'
import { Check, Filter, Search, X } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/redaction/types'
import { useRedactionStore } from '../state/redactionStore'
import type { DetectionResult, RedactionCategory } from '../lib/redaction/types'

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'High'
  if (confidence >= 0.7) return 'Medium'
  return 'Review'
}

export function DetectionSidebar() {
  const {
    detections,
    toggleDetection,
    setCategoryApproval,
    addCustomTerm,
    setSelectedBox,
    setSelectedPage,
    boxes,
  } = useRedactionStore()
  const [categoryFilter, setCategoryFilter] = useState<RedactionCategory | 'all'>('all')
  const [customTerm, setCustomTerm] = useState('')

  const counts = useMemo(() => {
    const next = new Map<RedactionCategory, number>()
    for (const detection of detections) {
      next.set(detection.category, (next.get(detection.category) ?? 0) + 1)
    }
    return next
  }, [detections])

  const filtered = categoryFilter === 'all' ? detections : detections.filter((item) => item.category === categoryFilter)

  const focusDetection = (detection: DetectionResult) => {
    if (detection.pageIndex !== undefined) {
      setSelectedPage(detection.pageIndex)
    }
    const box = boxes.find((candidate) => candidate.detectionId === detection.id)
    if (box) {
      setSelectedBox(box.id)
    }
  }

  return (
    <aside className="review-sidebar">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">
            <Filter size={14} aria-hidden="true" />
            Detected items
          </span>
          <h2>Review suggested findings</h2>
        </div>
        <strong>{detections.filter((item) => item.approved).length}/{detections.length}</strong>
      </div>
      <p className="sidebar-disclaimer">These suggestions may be incomplete or incorrect. Confirm every item before exporting.</p>

      <form
        className="custom-search"
        onSubmit={(event) => {
          event.preventDefault()
          addCustomTerm(customTerm)
          setCustomTerm('')
        }}
      >
        <label>
          <Search size={15} aria-hidden="true" />
          <input
            value={customTerm}
            onChange={(event) => setCustomTerm(event.target.value)}
            placeholder="Find a name, client, ID..."
          />
        </label>
        <button type="submit" disabled={customTerm.trim().length < 2}>
          Add
        </button>
      </form>

      <div className="category-filter" aria-label="Category filters">
        <button className={categoryFilter === 'all' ? 'active' : ''} onClick={() => setCategoryFilter('all')} type="button">
          All <span>{detections.length}</span>
        </button>
        {CATEGORY_ORDER.filter((category) => counts.has(category)).map((category) => (
          <button
            key={category}
            className={categoryFilter === category ? 'active' : ''}
            onClick={() => setCategoryFilter(category)}
            type="button"
          >
            {CATEGORY_LABELS[category]} <span>{counts.get(category)}</span>
          </button>
        ))}
      </div>

      {categoryFilter !== 'all' ? (
        <div className="bulk-actions">
          <button onClick={() => setCategoryApproval(categoryFilter, true)} type="button">
            <Check size={15} aria-hidden="true" />
            Approve category
          </button>
          <button onClick={() => setCategoryApproval(categoryFilter, false)} type="button">
            <X size={15} aria-hidden="true" />
            Reject category
          </button>
        </div>
      ) : null}

      <div className="detection-list" data-testid="detection-list">
        {filtered.length === 0 ? (
          <div className="empty-list">
            <strong>No obvious findings in this pass.</strong>
            <span>This does not mean the document is safe to share. Manually review the file, metadata, images, filenames, and any hidden or OCR text before sharing.</span>
          </div>
        ) : (
          filtered.map((detection) => (
            <article key={detection.id} className={`detection-card ${detection.approved ? '' : 'rejected'}`}>
              <button className="card-main" type="button" onClick={() => focusDetection(detection)}>
                <span className="category-chip">{CATEGORY_LABELS[detection.category]}</span>
                <strong>{detection.label}</strong>
                <code>{detection.valuePreview}</code>
                <span className="detection-meta">
                  {confidenceLabel(detection.confidence)} confidence · {Math.round(detection.confidence * 100)}% · {detection.source}
                  {detection.pageIndex !== undefined ? ` · page ${detection.pageIndex + 1}` : ''}
                </span>
                <span className="confidence-track">
                  <i style={{ width: `${Math.round(detection.confidence * 100)}%` }} />
                </span>
              </button>
              <button className="approve-toggle" onClick={() => toggleDetection(detection.id)} type="button">
                {detection.approved ? (
                  <>
                    <Check size={15} aria-hidden="true" />
                    Approved
                  </>
                ) : (
                  <>
                    <X size={15} aria-hidden="true" />
                    Rejected
                  </>
                )}
              </button>
            </article>
          ))
        )}
      </div>
    </aside>
  )
}
