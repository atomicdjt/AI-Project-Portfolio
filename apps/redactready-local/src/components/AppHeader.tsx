import { FileLock2, ShieldCheck } from 'lucide-react'
import type { Navigate } from '../App'

interface AppHeaderProps {
  navigate: Navigate
  current?: 'home' | 'redact' | 'about'
}

export function AppHeader({ navigate, current = 'home' }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="brand-button" onClick={() => navigate('/')} type="button" aria-label="Go to RedactReady home">
        <span className="brand-mark">
          <FileLock2 size={20} aria-hidden="true" />
        </span>
        <span>
          <strong>RedactReady</strong>
          <small>Local-only redaction</small>
        </span>
      </button>
      <nav className="header-nav" aria-label="Primary">
        <button className={current === 'home' ? 'active' : ''} onClick={() => navigate('/')} type="button">
          Overview
        </button>
        <button className={current === 'redact' ? 'active' : ''} onClick={() => navigate('/redact')} type="button">
          Redact
        </button>
        <button className={current === 'about' ? 'active' : ''} onClick={() => navigate('/about')} type="button">
          Privacy
        </button>
      </nav>
      <div className="local-pill" title="Core processing runs in your browser.">
        <ShieldCheck size={16} aria-hidden="true" />
        No cloud upload
      </div>
    </header>
  )
}
