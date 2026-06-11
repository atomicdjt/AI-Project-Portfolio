import type { ReactNode } from 'react'

interface SectionCardProps {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

export function SectionCard({ children, className = '', ariaLabel }: SectionCardProps) {
  return (
    <section className={`section-card ${className}`.trim()} aria-label={ariaLabel}>
      {children}
    </section>
  )
}
