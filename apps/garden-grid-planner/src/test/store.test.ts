import { beforeEach, describe, expect, it } from 'vitest'
import { useGardenStore } from '../store/useGardenStore'

describe('garden store', () => {
  beforeEach(() => {
    localStorage.clear()
    useGardenStore.getState().resetForTests()
  })

  it('starts with a useful sample plan', () => {
    const state = useGardenStore.getState()
    expect(state.plans).toHaveLength(1)
    expect(state.activePlan().name).toBe('Kitchen Garden')
    expect(state.activePlan().items.length).toBeGreaterThan(5)
  })

  it('adds, moves, deletes, undoes, and redoes a plant', () => {
    const store = useGardenStore.getState()
    const id = store.addPlant('basil', { x: 50, y: 50 })
    expect(useGardenStore.getState().activePlan().items.some((item) => item.id === id)).toBe(true)

    useGardenStore.getState().movePlant(id, { x: 70, y: 60 })
    const moved = useGardenStore.getState().activePlan().items.find((item) => item.id === id)
    expect(moved).toMatchObject({ x: 70, y: 60 })

    useGardenStore.getState().deleteItem(id)
    expect(useGardenStore.getState().activePlan().items.some((item) => item.id === id)).toBe(false)
    useGardenStore.getState().undo()
    expect(useGardenStore.getState().activePlan().items.some((item) => item.id === id)).toBe(true)
    useGardenStore.getState().redo()
    expect(useGardenStore.getState().activePlan().items.some((item) => item.id === id)).toBe(false)
  })

  it('updates units, modes, and dimensions', () => {
    useGardenStore.getState().setUnitSystem('metric')
    useGardenStore.getState().setMode('rows')
    useGardenStore.getState().setBed({ widthCm: 100, lengthCm: 200 })
    expect(useGardenStore.getState().activePlan()).toMatchObject({
      unitSystem: 'metric',
      mode: 'rows',
      bed: { widthCm: 100, lengthCm: 200 },
    })
  })

  it('creates, duplicates, renames, and deletes plans', () => {
    const createdId = useGardenStore.getState().createPlan('Herb bed')
    useGardenStore.getState().renamePlan(createdId, 'Patio herbs')
    const duplicateId = useGardenStore.getState().duplicatePlan(createdId)
    expect(useGardenStore.getState().plans.find((plan) => plan.id === duplicateId)?.name).toContain('copy')
    useGardenStore.getState().deletePlan(createdId)
    expect(useGardenStore.getState().plans.some((plan) => plan.id === createdId)).toBe(false)
  })
})
