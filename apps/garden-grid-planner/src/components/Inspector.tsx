import { AlertTriangle, Copy, Leaf, RotateCw, Sun, Trash2 } from 'lucide-react'
import { getPlant } from '../domain/plants'
import { summarizePlan } from '../domain/summary'
import { formatDistance } from '../domain/units'
import { validatePlan } from '../domain/validation'
import { useGardenStore } from '../store/useGardenStore'

export function Inspector() {
  const plan = useGardenStore((state) => state.activePlan())
  const selectedItemId = useGardenStore((state) => state.selectedItemId)
  const selectItem = useGardenStore((state) => state.selectItem)
  const deleteItem = useGardenStore((state) => state.deleteItem)
  const duplicateItem = useGardenStore((state) => state.duplicateItem)
  const rotateRow = useGardenStore((state) => state.rotateRow)
  const setNotes = useGardenStore((state) => state.setNotes)
  const selectedItem = plan.items.find((item) => item.id === selectedItemId)
  const selectedPlant = selectedItem ? getPlant(selectedItem.plantId) : undefined
  const summary = summarizePlan(plan)
  const issues = validatePlan(plan)

  return (
    <aside className="inspector panel-rail" aria-label="Placement inspector">
      {selectedItem && selectedPlant ? (
        <section className="selected-panel">
          <div className="rail-heading">
            <div>
              <span className="section-kicker">Selected placement</span>
              <h2>{selectedPlant.name}</h2>
            </div>
            <button type="button" className="text-button" onClick={() => selectItem(null)}>Clear</button>
          </div>
          <div className="selected-plant-mark" style={{ '--plant-color': selectedPlant.color } as React.CSSProperties}>
            <Leaf size={22} />
            <span>{selectedPlant.glyph}</span>
          </div>
          <dl className="plant-facts">
            <div><dt>Spacing</dt><dd>{formatDistance(selectedPlant.spacingCm, plan.unitSystem)}</dd></div>
            <div><dt>Sun</dt><dd><Sun size={14} /> {selectedPlant.sun}</dd></div>
            <div><dt>Depth</dt><dd>{formatDistance(selectedPlant.depthCm, plan.unitSystem)}</dd></div>
            <div><dt>Placement</dt><dd>{selectedItem.kind === 'row' ? `${selectedItem.orientation} row` : plan.mode}</dd></div>
          </dl>
          <p className="plant-note">{selectedPlant.note}</p>
          <div className="selected-actions">
            <button type="button" className="secondary-button" aria-label="Duplicate placement" onClick={() => duplicateItem(selectedItem.id)}><Copy size={16} /> Duplicate</button>
            {selectedItem.kind === 'row' ? <button type="button" className="secondary-button" aria-label="Rotate row" onClick={() => rotateRow(selectedItem.id)}><RotateCw size={16} /> Rotate</button> : null}
            <button type="button" className="danger-button" aria-label="Delete placement" onClick={() => deleteItem(selectedItem.id)}><Trash2 size={16} /> Delete</button>
          </div>
        </section>
      ) : (
        <section className="inspector-empty">
          <span className="empty-mark"><Leaf size={22} /></span>
          <h2>Plan at a glance</h2>
          <p>Select a placement to see its spacing, sun, and planting details.</p>
        </section>
      )}

      <section className="summary-panel">
        <div className="rail-heading compact"><h2>Plan summary</h2></div>
        <div className="summary-grid">
          <div><strong>{summary.totalPlants}</strong><span>Plants</span></div>
          <div><strong>{summary.varieties}</strong><span>Varieties</span></div>
          <div><strong>{summary.usedPercent}%</strong><span>Bed used</span></div>
          <div className={summary.issueCount ? 'warning-stat' : ''}><strong>{summary.issueCount}</strong><span>Issues</span></div>
        </div>
        {summary.counts.length > 0 ? (
          <div className="plant-totals">
            {summary.counts.slice(0, 5).map((item) => (
              <div key={item.plantId}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><strong>{item.quantity}</strong></div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="issues-panel">
        <div className="rail-heading compact"><h2>Issues</h2><span className="result-count warning">{issues.length}</span></div>
        {issues.length ? issues.slice(0, 4).map((issue) => (
          <button type="button" className="issue-row" key={issue.id} onClick={() => selectItem(issue.itemIds[0])}>
            <AlertTriangle size={17} />
            <span><strong>{issue.message}</strong><small>{issue.suggestion}</small></span>
          </button>
        )) : <p className="all-clear"><Leaf size={16} /> No spacing issues detected.</p>}
      </section>

      <section className="notes-panel">
        <label htmlFor="plan-notes">Plan notes</label>
        <textarea id="plan-notes" value={plan.notes} placeholder="Add irrigation, succession, or harvest notes…" onChange={(event) => setNotes(event.target.value)} />
      </section>
    </aside>
  )
}
