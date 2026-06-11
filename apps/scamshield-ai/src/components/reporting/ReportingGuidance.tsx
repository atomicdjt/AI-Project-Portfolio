import { Building2, ExternalLink, Landmark, MailWarning, ShieldCheck, WalletCards } from 'lucide-react'
import { reportingResources, type ReportingCategory } from '../../data/reportingResources'

const categoryIcons: Record<ReportingCategory, typeof Landmark> = {
  Federal: Landmark,
  Identity: ShieldCheck,
  Financial: WalletCards,
  'State and local': Building2,
  Mail: MailWarning,
}

export function ReportingGuidance() {
  const categories = [...new Set(reportingResources.map((resource) => resource.category))]
  return (
    <section className="reporting-guidance">
      <div className="official-channel-warning" role="note"><ShieldCheck size={21} /><p><strong>Use official channels only.</strong> Type the address yourself, use a trusted bookmark, or search from a trusted source. Do not use contact details from the suspicious message.</p></div>
      {categories.map((category) => {
        const Icon = categoryIcons[category]
        return (
          <div className="reporting-category" key={category}>
            <div className="reporting-category-title"><Icon size={20} aria-hidden="true" /><h3>{category}</h3></div>
            <div className="reporting-grid">
              {reportingResources.filter((resource) => resource.category === category).map((resource) => (
                <article className="resource-card" key={resource.id}>
                  <div><span className="official-pill">Official resource</span><h4>{resource.name}</h4></div>
                  <p>{resource.guidance}</p>
                  <dl><dt>Best for</dt><dd>{resource.bestFor}</dd></dl>
                  <a href={resource.url} target="_blank" rel="noreferrer noopener">{resource.displayUrl} <ExternalLink size={14} aria-hidden="true" /><span className="visually-hidden"> opens official website in a new tab</span></a>
                </article>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
