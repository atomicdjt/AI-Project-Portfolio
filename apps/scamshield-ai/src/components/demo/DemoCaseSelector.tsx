import { ArrowRight, BadgeCheck } from 'lucide-react'
import { demoCases } from '../../data/demoCases'
import { useCaseStore } from '../../store/useCaseStore'

export function DemoCaseSelector() {
  const loadDemo = useCaseStore((state) => state.loadDemo)

  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Safe demo mode</p>
          <h2 id="demo-title">Explore with fictional evidence</h2>
          <p>Each sample is synthetic and contains no real personal information.</p>
        </div>
        <span className="verified-note"><BadgeCheck size={18} aria-hidden="true" /> Clearly marked fake data</span>
      </div>
      <div className="demo-grid">
        {demoCases.map((demo, index) => (
          <article className="demo-card" key={demo.id}>
            <span className="demo-number">0{index + 1}</span>
            <h3>{demo.title}</h3>
            <p>{demo.description}</p>
            <button type="button" className="text-button" onClick={() => loadDemo(demo.id)} aria-label={`Use ${demo.title} demo`}>
              Use this demo <ArrowRight size={16} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
