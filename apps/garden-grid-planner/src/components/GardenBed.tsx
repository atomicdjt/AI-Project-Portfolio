import { AlertTriangle, Leaf } from 'lucide-react'
import type { MouseEvent } from 'react'
import { generateRowPositions, nearestSquareFootPosition, snapCoordinate } from '../domain/layout'
import { getPlant } from '../domain/plants'
import type { GardenItem, Point } from '../domain/types'
import { formatBedDimension } from '../domain/units'
import { validatePlan } from '../domain/validation'
import { useGardenStore } from '../store/useGardenStore'

export function GardenBed() {
  const plan = useGardenStore((state) => state.activePlan())
  const selectedPlantId = useGardenStore((state) => state.selectedPlantId)
  const selectedItemId = useGardenStore((state) => state.selectedItemId)
  const zoom = useGardenStore((state) => state.zoom)
  const addPlant = useGardenStore((state) => state.addPlant)
  const addRow = useGardenStore((state) => state.addRow)
  const selectItem = useGardenStore((state) => state.selectItem)
  const issues = validatePlan(plan)
  const issueIds = new Set(issues.flatMap((issue) => issue.itemIds))
  const selectedPlant = getPlant(selectedPlantId)
  const columns = Math.max(1, Math.round(plan.bed.lengthCm / 30.48))
  const rows = Math.max(1, Math.round(plan.bed.widthCm / 30.48))

  function pointFromEvent(event: MouseEvent<HTMLElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * plan.bed.lengthCm,
      y: ((event.clientY - rect.top) / rect.height) * plan.bed.widthCm,
    }
  }

  function placeAt(point: Point, plantId = selectedPlantId) {
    const plant = getPlant(plantId)
    if (!plant) return
    if (plan.mode === 'square-foot') {
      addPlant(plant.id, nearestSquareFootPosition(point, plant.squareFootDensity))
    } else {
      const snapped = { x: snapCoordinate(point.x, 5), y: snapCoordinate(point.y, 5) }
      const available = Math.max(20, plan.bed.lengthCm - snapped.x - plant.spacingCm / 2)
      addRow(plant.id, snapped, Math.min(90, available), 'horizontal')
    }
  }

  function handleBedClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('[data-placement]')) return
    placeAt(pointFromEvent(event))
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault()
    const plantId = event.dataTransfer.getData('text/garden-plant')
    if (plantId) useGardenStore.getState().selectPlant(plantId)
    const rect = event.currentTarget.getBoundingClientRect()
    placeAt({
      x: ((event.clientX - rect.left) / rect.width) * plan.bed.lengthCm,
      y: ((event.clientY - rect.top) / rect.height) * plan.bed.widthCm,
    }, plantId || selectedPlantId)
  }

  return (
    <section className="planner-workspace" aria-label="Garden bed planner">
      <div className="bed-rulers" aria-hidden="true">
        <span>0</span>
        <span>{formatBedDimension(plan.bed.lengthCm / 2, plan.unitSystem)}</span>
        <span>{formatBedDimension(plan.bed.lengthCm, plan.unitSystem)}</span>
      </div>
      <div className="bed-scroll-area">
        <div
          className={`garden-bed ${plan.mode}`}
          data-testid="garden-bed"
          role="application"
          aria-label={`${formatBedDimension(plan.bed.widthCm, plan.unitSystem)} by ${formatBedDimension(plan.bed.lengthCm, plan.unitSystem)} garden bed. Click to place ${selectedPlant?.name ?? 'a plant'}.`}
          style={{
            aspectRatio: `${plan.bed.lengthCm} / ${plan.bed.widthCm}`,
            width: `${zoom * 100}%`,
            '--grid-columns': columns,
            '--grid-rows': rows,
          } as React.CSSProperties}
          onClick={handleBedClick}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              placeAt({ x: plan.bed.lengthCm / 2, y: plan.bed.widthCm / 2 })
            }
            if (event.key === 'Escape') selectItem(null)
          }}
          tabIndex={0}
        >
          <div className="soil-texture" aria-hidden="true" />
          <div className="bed-grid" aria-hidden="true" />
          {plan.items.map((item) => (
            <PlacementView
              key={item.id}
              item={item}
              bedLength={plan.bed.lengthCm}
              bedWidth={plan.bed.widthCm}
              selected={item.id === selectedItemId}
              hasIssue={issueIds.has(item.id)}
              onSelect={() => selectItem(item.id)}
            />
          ))}
        </div>
      </div>
      <div className="bed-caption">
        <span><Leaf size={15} /> {plan.mode === 'square-foot' ? 'Grid squares represent one square foot' : 'Rows use each plant’s recommended in-row spacing'}</span>
        <span className={issues.length ? 'issue-caption active' : 'issue-caption'}><AlertTriangle size={15} /> {issues.length} {issues.length === 1 ? 'issue' : 'issues'}</span>
      </div>
    </section>
  )
}

interface PlacementViewProps {
  item: GardenItem
  bedLength: number
  bedWidth: number
  selected: boolean
  hasIssue: boolean
  onSelect: () => void
}

function PlacementView({ item, bedLength, bedWidth, selected, hasIssue, onSelect }: PlacementViewProps) {
  const plant = getPlant(item.plantId)
  if (!plant) return null
  const points = item.kind === 'plant'
    ? [{ x: item.x, y: item.y }]
    : generateRowPositions(item.start, item.lengthCm, plant.spacingCm, item.orientation)

  return (
    <div className="placement-group" data-placement="true">
      {points.map((point, index) => (
        <button
          type="button"
          key={`${item.id}-${index}`}
          className={`plant-placement${selected ? ' selected' : ''}${hasIssue ? ' has-issue' : ''}`}
          aria-label={`Select ${plant.name} placement`}
          onClick={(event) => { event.stopPropagation(); onSelect() }}
          style={{
            left: `${(point.x / bedLength) * 100}%`,
            top: `${(point.y / bedWidth) * 100}%`,
            width: `${(plant.spacingCm / bedLength) * 100}%`,
            aspectRatio: '1',
            '--plant-color': plant.color,
          } as React.CSSProperties}
        >
          <span className="placement-core"><Leaf size={15} /><b>{plant.glyph}</b></span>
          {index === 0 ? <span className="placement-label">{plant.name}</span> : null}
          {hasIssue && index === 0 ? <AlertTriangle className="placement-warning" size={15} /> : null}
        </button>
      ))}
    </div>
  )
}
