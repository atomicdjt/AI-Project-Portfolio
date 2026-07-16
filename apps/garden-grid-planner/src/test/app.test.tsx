import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useGardenStore } from '../store/useGardenStore'

describe('GardenGrid application', () => {
  beforeEach(() => {
    localStorage.clear()
    useGardenStore.getState().resetForTests()
  })

  it('filters and selects plants from the library', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: /search plants/i }), 'basil')
    expect(screen.getByRole('button', { name: /^select basil$/i })).toBeVisible()
    expect(screen.queryByRole('button', { name: /^select tomato$/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^select basil$/i }))
    expect(screen.getByText(/click inside the bed to add basil/i)).toBeVisible()
  })

  it('places the selected plant on the bed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^select basil$/i }))
    const bed = screen.getByTestId('garden-bed')
    Object.defineProperty(bed, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 800, height: 400, right: 800, bottom: 400, x: 0, y: 0, toJSON: () => {} }),
    })
    fireEvent.click(bed, { clientX: 400, clientY: 200 })
    expect(useGardenStore.getState().activePlan().items.at(-1)?.plantId).toBe('basil')
  })

  it('switches to row mode and applies a bed preset', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /row mode/i }))
    expect(useGardenStore.getState().activePlan().mode).toBe('rows')
    await user.selectOptions(screen.getByLabelText(/bed preset/i), '4x4')
    expect(useGardenStore.getState().activePlan().bed.lengthCm).toBeCloseTo(121.92)
  })

  it('deletes a selected placement from the inspector', async () => {
    const user = userEvent.setup()
    render(<App />)
    const placement = screen.getAllByRole('button', { name: /select tomato placement/i })[0]
    await user.click(placement)
    const inspector = screen.getByLabelText(/placement inspector/i)
    await user.click(within(inspector).getByRole('button', { name: /delete placement/i }))
    expect(useGardenStore.getState().activePlan().items).toHaveLength(7)
  })
})
