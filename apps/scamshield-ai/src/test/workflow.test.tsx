import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useCaseStore } from '../store/useCaseStore'

describe('ScamShield workflow', () => {
  beforeEach(() => {
    localStorage.clear()
    useCaseStore.getState().clearAll()
  })

  it('supports caregiver intake and local image evidence preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /analyze suspicious content/i }))
    expect(screen.getByRole('heading', { name: /create a clear case record/i })).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /caregiver mode/i }))
    expect(screen.getByLabelText(/person being helped/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/permission or consent/i)).toBeInTheDocument()

    const file = new File(['fake image'], 'suspicious-message.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/upload screenshots or documents/i), file)
    expect(screen.getByText('suspicious-message.png')).toBeInTheDocument()
    expect(screen.getByText(/file stays in this browser/i)).toBeInTheDocument()
  })

  it('loads a synthetic demo, analyzes it, and exposes timeline, actions, reporting, and export consent', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /use bank account locked phishing text demo/i }))
    expect(screen.getByDisplayValue(/demo: bank account locked alert/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /run local risk assessment/i }))
    expect(screen.getByRole('heading', { name: /risk assessment/i })).toBeInTheDocument()
    expect(screen.getByText('Severe risk')).toBeInTheDocument()
    expect(screen.getAllByText(/risk assessment, not a final determination/i).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /timeline and actions/i }))
    expect(screen.getByRole('heading', { name: /evidence timeline/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /safe action checklist/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /report and export/i }))
    expect(screen.getByRole('heading', { name: /safe reporting guidance/i })).toBeInTheDocument()
    const exportPanel = screen.getByRole('region', { name: /evidence packet export/i })
    expect(within(exportPanel).getByRole('button', { name: /download evidence packet pdf/i })).toBeDisabled()
    await user.click(within(exportPanel).getByRole('checkbox', { name: /report may contain sensitive information/i }))
    expect(within(exportPanel).getByRole('button', { name: /download evidence packet pdf/i })).toBeEnabled()
  })
})
