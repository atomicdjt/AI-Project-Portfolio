import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, Copy } from 'lucide-react'

interface ErrorBoundaryState {
  error?: Error
  info?: ErrorInfo
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {}

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info })
  }

  render() {
    if (!this.state.error) return this.props.children

    const diagnostic = JSON.stringify(
      {
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.info?.componentStack,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    )

    return (
      <main className="error-boundary" role="alert">
        <AlertTriangle size={28} aria-hidden="true" />
        <h1>OpsPilot hit an unexpected UI error</h1>
        <p>The deterministic demo and reference API are still safe to reload. Copy this diagnostic if you need to review the failure.</p>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(diagnostic)}>
          <Copy size={16} aria-hidden="true" />
          Copy diagnostic data
        </button>
        <pre>{diagnostic}</pre>
      </main>
    )
  }
}
