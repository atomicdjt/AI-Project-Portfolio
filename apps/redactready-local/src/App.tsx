import { useEffect, useState } from 'react'
import { AboutPage } from './pages/AboutPage'
import { LandingPage } from './pages/LandingPage'
import { RedactPage } from './pages/RedactPage'

export type Navigate = (path: string) => void

function currentPath(): string {
  return window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '')
}

export default function App() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPopState = () => setPath(currentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate: Navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(currentPath())
  }

  if (path === '/about') return <AboutPage navigate={navigate} />
  if (path === '/redact') return <RedactPage navigate={navigate} />
  return <LandingPage navigate={navigate} />
}
