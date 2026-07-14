import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  FileText,
  Globe2,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const repoBase = 'https://github.com/atomicdjt/AI-Project-Portfolio';
const githubPagesBase = 'https://atomicdjt.github.io/AI-Project-Portfolio';
const imagePath = (fileName) => `images/${fileName}`;

const projects = [
  {
    name: 'buildworld-ai',
    publicName: 'BuildWorld AI',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Separate authoritative repository',
    category: 'Systems simulation',
    demo: 'https://buildworld-ai-v01-improvements.vercel.app/',
    source: 'https://github.com/atomicdjt/buildworld-ai',
    caseStudy: `${repoBase}/blob/main/projects/buildworld-ai/CASE_STUDY.md`,
    image: imagePath('buildworld-ai-studio.png'),
    stack: ['React', 'TypeScript', 'Simulation', 'Data visualization'],
    summary: 'Visual graph-based simulation lab for complex systems, bottlenecks, cascade risk, reproducible experiments, SSI scoring, optimization suggestions, and reports.',
    evidence: 'Most technically original flagship: deterministic engines, editable graph models, multi-seed analysis, local persistence, tests, architecture documentation, and a live deployment.',
    review: 'Technical flagship',
  },
  {
    name: 'redactready-pro-hri-os',
    publicName: 'RedactReady Pro',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Privacy intelligence',
    demo: 'https://redactready-pro-hri-os.netlify.app/',
    source: `${repoBase}/tree/main/apps/redactready-pro-hri-os`,
    caseStudy: `${repoBase}/blob/main/projects/redactready-pro-hri-os/CASE_STUDY.md`,
    image: imagePath('redactready-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Vitest', 'Local-first'],
    summary: 'Reviews document packets locally, detects sensitive information, scores human-risk signals, maps evidence, supports redaction, and exports reports.',
    evidence: 'Strongest privacy and document-intelligence workflow: deterministic analysis, local-first boundaries, polished review UX, tests, case-study documentation, and deployment.',
    review: 'Privacy flagship',
  },
  {
    name: 'opspilot-ai-operations-toolkit',
    publicName: 'ProcessHarbor',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Technical operations',
    demo: 'https://opspilot-ai-operations-toolkit.netlify.app/',
    source: `${repoBase}/tree/main/apps/opspilot-ai-operations-toolkit`,
    caseStudy: `${repoBase}/blob/main/projects/opspilot-ai-operations-toolkit/CASE_STUDY.md`,
    image: imagePath('opspilot-home.png'),
    stack: ['React', 'TypeScript', 'Zod', 'Netlify Functions', 'Vitest'],
    summary: 'Turns rough operational inputs into reviewable SOPs, onboarding checklists, knowledge-base drafts, gap reports, versions, and export bundles.',
    evidence: 'Clearest role fit for technical operations, documentation, enablement, and knowledge management, with validation boundaries and a database-ready path.',
    review: 'Best role alignment',
  },
  {
    name: 'scamshield-ai',
    publicName: 'ScamShield AI',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Consumer safety',
    demo: 'https://scamshield-ai-safety.netlify.app/',
    source: `${repoBase}/tree/main/apps/scamshield-ai`,
    caseStudy: `${repoBase}/blob/main/projects/scamshield-ai/CASE_STUDY.md`,
    image: imagePath('scamshield-assessment.png'),
    stack: ['React', 'Vite', 'PDF export', 'Local-first'],
    summary: 'Assesses suspicious messages, organizes evidence, suggests safer next steps, locates official reporting channels, and exports a structured packet.',
    evidence: 'Shows public-interest product judgment, explainable deterministic scoring, privacy-conscious workflow design, accessible guidance, tests, and deployment.',
    review: 'Safety workflow',
  },
  {
    name: 'redactready-local',
    publicName: 'RedactReady',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Privacy tool',
    demo: 'https://redactready-local.netlify.app/',
    source: `${repoBase}/tree/main/apps/redactready-local`,
    caseStudy: `${repoBase}/blob/main/projects/redactready-local/CASE_STUDY.md`,
    image: imagePath('redactready-review-workspace.png'),
    stack: ['React', 'TypeScript', 'PDF.js', 'pdf-lib'],
    summary: 'Reviews sensitive files locally, highlights likely private data, supports manual redaction, and exports verification-oriented results.',
    evidence: 'Demonstrates document workflows, local processing, practical threat-model boundaries, true flattened redaction output, and security-minded UX.',
    review: 'Privacy depth',
  },
  {
    name: 'layerforge-studio',
    publicName: 'LayerForge Studio',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Canvas editor',
    demo: `${githubPagesBase}/layerforge-studio/`,
    source: `${repoBase}/tree/main/apps/layerforge-studio`,
    caseStudy: `${repoBase}/blob/main/projects/layerforge-studio/CASE_STUDY.md`,
    image: imagePath('layerforge-studio-home.png'),
    stack: ['React', 'TypeScript', 'Canvas 2D', 'IndexedDB'],
    summary: 'Browser image editor with layered raster documents, painting tools, selections, filters, undo, persistence, and exports.',
    evidence: 'Strongest frontend and interaction-depth evidence in the monorepo, including Canvas architecture, command history, local persistence, and dense product UI.',
    review: 'Frontend depth',
  },
  {
    name: 'focusforge',
    publicName: 'FocusForge',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Productivity game',
    demo: 'https://focusforge-productivity-game.netlify.app/',
    source: `${repoBase}/tree/main/apps/focusforge`,
    caseStudy: `${repoBase}/blob/main/projects/focusforge/CASE_STUDY.md`,
    image: imagePath('focusforge-home.png'),
    stack: ['React', 'Vite', 'Vitest', 'Local storage'],
    summary: 'Turns focus sessions into civilization growth, research unlocks, streak history, and durable local progress.',
    evidence: 'Shows product-system thinking, stateful UX, persistent client data, testable game rules, and polished static deployment.',
    review: 'Product system',
  },
  {
    name: 'variantvision-pro',
    publicName: 'VariantVision Pro',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Research tool',
    demo: 'https://variantvisionpro.netlify.app/',
    source: `${repoBase}/tree/main/apps/variantvision-pro`,
    caseStudy: `${repoBase}/blob/main/projects/variantvision-pro/CASE_STUDY.md`,
    image: imagePath('variantvision-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Bioinformatics', 'Evidence scoring'],
    summary: 'Educational bioinformatics workbench for genetic-variant review, source provenance, amino-acid comparison, evidence scoring, and non-diagnostic reports.',
    evidence: 'Shows complex-domain product architecture, source-transparency UX, research support, and careful non-diagnostic scope boundaries.',
    review: 'Research implementation',
  },
  {
    name: 'astra',
    publicName: 'Astra',
    audience: 'Employer',
    status: 'Local',
    repositoryAuthority: 'Portfolio workspace',
    category: 'AI chat workspace',
    demo: null,
    source: `${repoBase}/tree/main/apps/astra`,
    caseStudy: `${repoBase}/blob/main/projects/astra/CASE_STUDY.md`,
    image: imagePath('astra-home.png'),
    stack: ['React', 'TypeScript', 'Express', 'AI workflow'],
    summary: 'Local AI chat workspace with a React interface, Express API layer, model configuration visibility, Markdown rendering, and transcript export.',
    evidence: 'Shows a credible provider-backed application structure beyond a thin interface, with visible configuration and missing-key states.',
    review: 'Local AI app',
  },
  {
    name: 'nexus-play',
    publicName: 'Nexus Play',
    audience: 'Employer',
    status: 'Local',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Platform demo',
    demo: null,
    source: `${repoBase}/tree/main/apps/nexus-play`,
    caseStudy: `${repoBase}/blob/main/projects/nexus-play/CASE_STUDY.md`,
    image: imagePath('nexus-play-home.png'),
    stack: ['React', 'TypeScript', 'Express', 'Product UI'],
    summary: 'Local game storefront and library prototype with catalog browsing, cart, wishlist, simulated checkout, owned-library state, and install-queue concepts.',
    evidence: 'Demonstrates product-state modeling, platform-style consumer flows, and UI architecture without representing simulated commerce as a real marketplace.',
    review: 'Platform workflow',
  },
  {
    name: 'weavestudio',
    publicName: 'WeaveStudio',
    audience: 'Commercial',
    status: 'Acquisition Asset',
    repositoryAuthority: 'Separate authoritative repository',
    category: 'Workflow product',
    demo: 'https://weavestudio-demo.vercel.app/',
    source: 'https://github.com/atomicdjt/weavestudio',
    caseStudy: 'https://weavestudio-demo.vercel.app/acquire',
    image: null,
    stack: ['React', 'TypeScript', 'React Flow', 'Playwright', 'Local-first'],
    summary: 'Local-first visual workflow canvas for turning fragmented notes, transcripts, logs, and research inputs into structured, reviewable deliverables.',
    evidence: 'Most complete product asset: consolidated default branch, browser and unit validation, portable exports, buyer transfer materials, and consent-gated OpenAI/Gemini BYOK assistance.',
    review: 'Transfer-ready product',
  },
  {
    name: 'quoteforge-local',
    publicName: 'QuoteForge Local',
    audience: 'Commercial',
    status: 'Commercial',
    repositoryAuthority: 'Separate private source repository',
    category: 'Agency quoting product',
    demo: 'https://quoteforge-local.vercel.app/',
    source: null,
    caseStudy: 'https://payhip.com/b/24De9',
    image: null,
    stack: ['Next.js', 'TypeScript', 'Playwright', 'CSV export', 'White-label'],
    summary: 'White-label quote-calculator and lead-capture package for agencies, freelancers, WordPress developers, and local-service website implementers.',
    evidence: 'Ten calculator templates, embed and WordPress paths, buyer documentation, licensing, QA scripts, sales materials, and release packaging.',
    review: 'Shipped commercial package',
  },
  {
    name: 'amino-acid-workbench',
    publicName: 'Amino Acid Workbench',
    audience: 'Supplemental',
    status: 'Supplemental',
    repositoryAuthority: 'Documentation-first case study',
    category: 'Education tool',
    demo: 'https://aminoacidworkbench.netlify.app/',
    source: `${repoBase}/blob/main/projects/amino-acid-research-workbench/CASE_STUDY.md`,
    caseStudy: `${repoBase}/blob/main/projects/amino-acid-research-workbench/CASE_STUDY.md`,
    image: null,
    stack: ['Education', 'Bioinformatics', 'Explainable analysis'],
    summary: 'Educational workbench concept for comparing amino-acid substitutions and building evidence dossiers.',
    evidence: 'Useful complex-domain and educational UX evidence; the current portfolio repository contains documentation rather than a maintained app workspace.',
    review: 'Supplemental research demo',
  },
  {
    name: 'garden-grid',
    publicName: 'GardenGrid',
    audience: 'Supplemental',
    status: 'Supplemental',
    repositoryAuthority: 'Source outside portfolio repository',
    category: 'Planning tool',
    demo: 'https://garden-grid-planner-demo.netlify.app/',
    source: null,
    caseStudy: null,
    image: null,
    stack: ['Static demo', 'Planning UX', 'External source'],
    summary: 'Garden-layout planning demo for arranging beds, companion-planting notes, and seasonal planning.',
    evidence: 'Supplemental planning-UX evidence only; source is not represented as part of the portfolio monorepo.',
    review: 'External demo',
  },
  {
    name: 'hearthlink',
    publicName: 'HearthLink',
    audience: 'Supplemental',
    status: 'Supplemental',
    repositoryAuthority: 'Source outside portfolio repository',
    category: 'Community concept',
    demo: 'https://hearthlink-p2p-demo.netlify.app/',
    source: null,
    caseStudy: null,
    image: null,
    stack: ['Static demo', 'P2P concept', 'External source'],
    summary: 'Peer-to-peer neighborhood-hub concept with explicit offline and signaling limitations.',
    evidence: 'Supplemental concept evidence only; source is not represented as part of the portfolio monorepo.',
    review: 'External concept',
  },
];

const employerQuickReview = projects.filter((project) =>
  ['BuildWorld AI', 'RedactReady Pro', 'ProcessHarbor'].includes(project.publicName),
);
const commercialAssets = projects.filter((project) => project.audience === 'Commercial');
const liveCount = projects.filter((project) => ['Live', 'Commercial', 'Acquisition Asset'].includes(project.status)).length;
const sourceBackedCount = projects.filter((project) => project.source).length;

function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [audience, setAudience] = useState('All');

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === 'All' || project.status === status;
      const matchesAudience = audience === 'All' || project.audience === audience;
      const searchable = `${project.publicName} ${project.category} ${project.summary} ${project.evidence} ${project.stack.join(' ')}`.toLowerCase();
      return matchesStatus && matchesAudience && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [audience, query, status]);

  return (
    <div className="app-shell">
      <aside className="side-rail" aria-label="Portfolio navigation">
        <a className="brand" href={githubPagesBase} aria-label="David Turner portfolio hub">
          <span className="brand-mark">DT</span>
          <span>
            <strong>David Turner</strong>
            <small>Applied AI & Technical Operations</small>
          </span>
        </a>
        <nav>
          <a href="#employer-review"><BriefcaseBusiness size={18} aria-hidden="true" /> Hiring review</a>
          <a href="#commercial-assets"><Sparkles size={18} aria-hidden="true" /> Products</a>
          <a href="#projects"><Layers3 size={18} aria-hidden="true" /> All projects</a>
          <a href="#technical-depth"><BookOpen size={18} aria-hidden="true" /> Evidence</a>
          <a href={repoBase}><Code2 size={18} aria-hidden="true" /> GitHub repo</a>
        </nav>
        <div className="rail-panel">
          <span>Recommended path</span>
          <strong>Employer-first, buyer-ready</strong>
          <p>Start with three role-aligned projects. Commercial products have a separate review path and make no unsupported traction claims.</p>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <h1>David Turner — Applied AI & Technical Operations Portfolio</h1>
            <p>Local-first products, workflow systems, deployed applications, and evidence-oriented documentation organized for employer and commercial review.</p>
          </div>
          <div className="topbar-actions" aria-label="Primary portfolio actions">
            <a className="button secondary" href={repoBase}>
              <Code2 size={17} aria-hidden="true" /> View GitHub
            </a>
            <a className="button primary" href={`${repoBase}/blob/main/docs/recruiter-quick-review.md`}>
              <FileText size={17} aria-hidden="true" /> Recruiter guide
            </a>
          </div>
        </header>

        <section className="metrics-strip" aria-label="Portfolio snapshot">
          <Stat label="Live or product demos" value={liveCount} icon={<Globe2 size={18} aria-hidden="true" />} />
          <Stat label="Source-linked entries" value={sourceBackedCount} icon={<CheckCircle2 size={18} aria-hidden="true" />} />
          <Stat label="Employer review" value="3 projects" icon={<Timer size={18} aria-hidden="true" />} />
          <Stat label="Review paths" value="Hiring + Products" icon={<Sparkles size={18} aria-hidden="true" />} />
        </section>

        <section id="employer-review" className="quick-review" aria-labelledby="employer-title">
          <div className="section-title">
            <div>
              <span>Employer review</span>
              <h2 id="employer-title">Three projects that show role fit in under five minutes</h2>
            </div>
            <a href={`${repoBase}/blob/main/docs/EMPLOYER_OVERVIEW.md`}>
              Employer overview <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="featured-grid">
            {employerQuickReview.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </section>

        <section id="commercial-assets" className="quick-review" aria-labelledby="commercial-title">
          <div className="section-title">
            <div>
              <span>Products and acquisition assets</span>
              <h2 id="commercial-title">Separate products with clear source authority and buyer-facing documentation</h2>
            </div>
          </div>
          <p>Commercial status describes product packaging and availability; it does not imply revenue, customers, active users, or a completed acquisition.</p>
          <div className="featured-grid">
            {commercialAssets.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </section>

        <section id="projects" className="project-browser" aria-labelledby="projects-title">
          <div className="section-title browser-title">
            <div>
              <span>Complete catalog</span>
              <h2 id="projects-title">Demos, source authority, case studies, status, and evidence</h2>
            </div>
            <div className="filters">
              <label className="search-field">
                <Search size={16} aria-hidden="true" />
                <span className="sr-only">Search projects</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" />
              </label>
              <select value={audience} onChange={(event) => setAudience(event.target.value)} aria-label="Filter by audience">
                <option>All</option>
                <option>Employer</option>
                <option>Commercial</option>
                <option>Supplemental</option>
              </select>
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
                <option>All</option>
                <option>Live</option>
                <option>Local</option>
                <option>Commercial</option>
                <option>Acquisition Asset</option>
                <option>Supplemental</option>
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status and authority</th>
                  <th>What it does and evidence</th>
                  <th>Links</th>
                  <th>Tech / framing</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.name}>
                    <td data-label="Project">
                      <div className="project-cell">
                        <ProjectThumb project={project} />
                        <div><strong>{project.publicName}</strong><span>{project.category}</span></div>
                      </div>
                    </td>
                    <td data-label="Status and authority">
                      <StatusChip status={project.status} />
                      <small>{project.repositoryAuthority}</small>
                    </td>
                    <td data-label="What it does">
                      <p>{project.summary}</p>
                      <small><strong>Evidence:</strong> {project.evidence}</small>
                    </td>
                    <td data-label="Links">
                      <div className="link-stack">
                        {project.demo ? <ExternalLink href={project.demo}>Live demo</ExternalLink> : <span>Local-only app</span>}
                        {project.source && project.source !== project.caseStudy ? <ExternalLink href={project.source}>Source</ExternalLink> : null}
                        {project.caseStudy ? <ExternalLink href={project.caseStudy}>{project.audience === 'Commercial' ? 'Product details' : 'Case study'}</ExternalLink> : <span>No portfolio case study</span>}
                      </div>
                    </td>
                    <td data-label="Tech / framing"><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="technical-depth" className="technical-depth" aria-labelledby="depth-title">
          <div><span>Evidence and role mapping</span><h2 id="depth-title">Recommended next stops after the demos</h2></div>
          <div className="depth-grid">
            <DepthLink icon={<ShieldCheck size={19} aria-hidden="true" />} title="Verification guide" text="Commands, validation boundaries, and public checks used to support portfolio claims." href={`${repoBase}/blob/main/docs/verification.md`} />
            <DepthLink icon={<BookOpen size={19} aria-hidden="true" />} title="Project index" text="Source authority, status, best evidence, and role-fit notes for the complete catalog." href={`${repoBase}/blob/main/docs/PROJECT_INDEX.md`} />
            <DepthLink icon={<FileText size={19} aria-hidden="true" />} title="Skills matrix" text="How the projects map to operations, AI workflow, documentation, research, and frontend skills." href={`${repoBase}/blob/main/docs/SKILLS_MATRIX.md`} />
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return <div className="stat">{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <ProjectThumb project={project} large />
      <div className="card-body">
        <div className="card-meta"><StatusChip status={project.status} /><span>{project.review}</span></div>
        <h3>{project.publicName}</h3>
        <p>{project.summary}</p>
        <strong>Why review it</strong>
        <p>{project.evidence}</p>
        <small>{project.repositoryAuthority}</small>
        <div className="card-actions">
          {project.demo ? <ExternalLink href={project.demo}>Live demo</ExternalLink> : null}
          {project.source ? <ExternalLink href={project.source}>Source</ExternalLink> : null}
          {project.caseStudy ? <ExternalLink href={project.caseStudy}>{project.audience === 'Commercial' ? 'Product details' : 'Case study'}</ExternalLink> : null}
        </div>
      </div>
    </article>
  );
}

function ProjectThumb({ project, large = false }) {
  if (project.image) return <img className={large ? 'project-thumb large' : 'project-thumb'} src={project.image} alt={`${project.publicName} screenshot`} />;
  return <div className={large ? 'project-thumb large generated-thumb' : 'project-thumb generated-thumb'} aria-hidden="true"><span>{project.publicName.split(' ').map((word) => word[0]).join('').slice(0, 3)}</span><small>{project.category}</small></div>;
}

function StatusChip({ status }) {
  const className = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-chip ${className}`}>{status}</span>;
}

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer">{children} <ArrowUpRight size={14} aria-hidden="true" /></a>;
}

function DepthLink({ icon, title, text, href }) {
  return <a className="depth-link" href={href}>{icon}<strong>{title}</strong><span>{text}</span></a>;
}

export default App;
