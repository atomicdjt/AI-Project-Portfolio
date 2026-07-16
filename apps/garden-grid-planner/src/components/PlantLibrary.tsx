import { Search, Sprout } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { plantCategories, searchPlants } from '../domain/plants'
import type { PlantCategory } from '../domain/types'
import { formatDistance } from '../domain/units'
import { useGardenStore } from '../store/useGardenStore'

export function PlantLibrary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<PlantCategory | 'all'>('all')
  const deferredQuery = useDeferredValue(query)
  const selectedPlantId = useGardenStore((state) => state.selectedPlantId)
  const selectPlant = useGardenStore((state) => state.selectPlant)
  const unitSystem = useGardenStore((state) => state.activePlan().unitSystem)
  const results = searchPlants(deferredQuery, category)

  return (
    <aside className="plant-library panel-rail" aria-label="Plant library">
      <div className="rail-heading">
        <div>
          <span className="section-kicker">Choose what to grow</span>
          <h2>Plant library</h2>
        </div>
        <span className="result-count">{results.length}</span>
      </div>

      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search plants</span>
        <input
          type="search"
          aria-label="Search plants"
          placeholder="Search plants"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="category-row" aria-label="Plant categories">
        {plantCategories.map((item) => (
          <button
            className={category === item.id ? 'filter-button active' : 'filter-button'}
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="library-instruction">Select a plant, then click inside the bed.</p>

      <div className="plant-list">
        {results.map((plant) => (
          <button
            type="button"
            key={plant.id}
            className={selectedPlantId === plant.id ? 'plant-row selected' : 'plant-row'}
            aria-label={`Select ${plant.name}`}
            onClick={() => selectPlant(plant.id)}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/garden-plant', plant.id)}
          >
            <span className="plant-glyph" style={{ '--plant-color': plant.color } as React.CSSProperties}>
              <Sprout size={16} aria-hidden="true" />
              <strong>{plant.glyph}</strong>
            </span>
            <span className="plant-row-copy">
              <strong>{plant.name}</strong>
              <small>{formatDistance(plant.spacingCm, unitSystem)} spacing</small>
            </span>
            <span className="plant-density">{plant.squareFootDensity}/sq ft</span>
          </button>
        ))}
        {results.length === 0 ? (
          <div className="empty-library">
            <Sprout size={22} aria-hidden="true" />
            <strong>No plants found</strong>
            <span>Try a name or another category.</span>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
