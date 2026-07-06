import { lazy, Suspense, useEffect, useState } from 'react'

export type Navigate = (path: string) => void

const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })))
const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })))
const RedactPage = lazy(() => import('./pages/RedactPage').then((module) => ({ default: module.RedactPage })))

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

  return (
    <Suspense fallback={<main className="app-loading" aria-live="polite">Loading workspace...</main>}>
      {path === '/about' ? <AboutPage navigate={navigate} /> : path === '/redact' ? <RedactPage navigate={navigate} /> : <LandingPage navigate={navigate} />}
    </Suspense>
  )
}
