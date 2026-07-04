import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('ScamShield application shell', () => {
  it('presents the defensive purpose and primary analysis action', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'ScamShield AI' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze suspicious content/i })).toBeInTheDocument()
    expect(screen.getByText(/risk assessment, not a final determination/i)).toBeInTheDocument()
  })
})
