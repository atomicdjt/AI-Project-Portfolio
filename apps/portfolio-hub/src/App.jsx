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
    name: 'BuildWorld AI',
    rank: 1,
    status: 'Live',
    category: 'Systems simulation',
    demo: 'https://buildworld-ai.netlify.app/',
    source: `${repoBase}/tree/main/apps/buildworld-ai`,
    caseStudy: `${repoBase}/blob/main/projects/buildworld-ai/CASE_STUDY.md`,
    image: imagePath('buildworld-ai-studio.png'),
    stack: ['React', 'TypeScript', 'Simulation', 'Data visualization'],
    summary: 'Visual graph-based simulation lab for complex systems, bottlenecks, cascade risk, SSI scoring, optimization suggestions, snapshots, and exportable reports.',
    why: 'Most technically ambitious flagship: deterministic simulation architecture, editable canvas, analytics dashboard, cascade experiments, local persistence, tests, docs, and live deployment.',
    review: 'Technical flagship',
  },
  {
    name: 'RedactReady Pro',
    rank: 2,
    status: 'Live',
    category: 'Privacy intelligence',
    demo: 'https://redactready-pro-hri-os.netlify.app/',
    source: `${repoBase}/tree/main/apps/redactready-pro-hri-os`,
    caseStudy: `${repoBase}/blob/main/projects/redactready-pro-hri-os/CASE_STUDY.md`,
    image: imagePath('redactready-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Vitest', 'Local-first'],
    summary: 'Reviews document packets locally, detects sensitive information, scores Human Risk Intelligence, maps evidence, redacts text, and exports reports.',
    why: 'Best flagship product signal: privacy engineering, original scoring model, local-first architecture, polished dashboard UX, tests, docs, and live deployment.',
    review: 'Flagship project',
  },
  {
    name: 'ScamShield AI',
    rank: 3,
    status: 'Live',
    category: 'Consumer safety',
    demo: 'https://scamshield-ai-safety.netlify.app/',
    source: `${repoBase}/tree/main/apps/scamshield-ai`,
    caseStudy: `${repoBase}/blob/main/projects/scamshield-ai/CASE_STUDY.md`,
    image: imagePath('scamshield-assessment.png'),
    stack: ['React', 'Vite', 'PDF export', 'Local-first'],
    summary: 'Assesses suspicious messages, organizes evidence, suggests safer next steps, and exports a report packet.',
    why: 'Shows public-interest product judgment, explainable risk scoring, privacy scope, and complete deployment.',
    review: 'Best first project',
  },
  {
    name: 'RedactReady',
    rank: 4,
    status: 'Live',
    category: 'Privacy tool',
    demo: 'https://redactready-local.netlify.app/',
    source: `${repoBase}/tree/main/apps/redactready-local`,
    caseStudy: `${repoBase}/blob/main/projects/redactready-local/CASE_STUDY.md`,
    image: imagePath('redactready-review-workspace.png'),
    stack: ['React', 'TypeScript', 'PDF.js', 'pdf-lib'],
    summary: 'Reviews sensitive files locally, highlights likely private data, applies redactions, and exports verification notes.',
    why: 'Demonstrates local-first safety boundaries, document workflows, and practical security-minded UX.',
    review: 'Privacy depth',
  },
  {
    name: 'LayerForge Studio',
    rank: 5,
    status: 'Live',
    category: 'Canvas editor',
    demo: `${githubPagesBase}/layerforge-studio/`,
    source: `${repoBase}/tree/main/apps/layerforge-studio`,
    caseStudy: `${repoBase}/blob/main/projects/layerforge-studio/CASE_STUDY.md`,
    image: imagePath('layerforge-studio-home.png'),
    stack: ['React', 'TypeScript', 'Canvas 2D', 'IndexedDB'],
    summary: 'Browser image editor with layered raster documents, painting tools, filters, undo, persistence, and exports.',
    why: 'Best frontend polish and interaction depth in the portfolio.',
    review: 'Frontend depth',
  },
  {
    name: 'OpsPilot',
    rank: 6,
    status: 'Live',
    category: 'Operations toolkit',
    demo: 'https://opspilot-ai-operations-toolkit.netlify.app/',
    source: `${repoBase}/tree/main/apps/opspilot-ai-operations-toolkit`,
    caseStudy: `${repoBase}/blob/main/projects/opspilot-ai-operations-toolkit/CASE_STUDY.md`,
    image: imagePath('opspilot-home.png'),
    stack: ['React', 'TypeScript', 'Local storage', 'Static deploy'],
    summary: 'Turns rough operational notes into SOPs, onboarding checklists, knowledge base articles, gap reports, and versions.',
    why: 'Maps directly to technical operations, enablement, documentation, and knowledge-management roles.',
    review: 'Role fit',
  },
  {
    name: 'FocusForge',
    rank: 7,
    status: 'Live',
    category: 'Productivity game',
    demo: 'https://focusforge-productivity-game.netlify.app/',
    source: `${repoBase}/tree/main/apps/focusforge`,
    caseStudy: `${repoBase}/blob/main/projects/focusforge/CASE_STUDY.md`,
    image: imagePath('focusforge-home.png'),
    stack: ['React', 'Vite', 'Vitest', 'Local storage'],
    summary: 'Turns focus sessions into civilization growth, research unlocks, streak history, and durable local progress.',
    why: 'Shows product-system thinking, stateful UX, tests, and polished static deployment.',
    review: 'Product system',
  },
  {
    name: 'VariantVision Pro',
    rank: 8,
    status: 'Live',
    category: 'Research tool',
    demo: 'https://variantvisionpro.netlify.app/',
    source: `${repoBase}/tree/main/apps/variantvision-pro`,
    caseStudy: `${repoBase}/blob/main/projects/variantvision-pro/CASE_STUDY.md`,
    image: imagePath('variantvision-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Bioinformatics', 'Evidence scoring'],
    summary: 'Live bioinformatics workbench for genetic variants, local normalization helpers, amino-acid comparison, source provenance, evidence scoring, and exportable non-diagnostic dossiers.',
    why: 'Shows complex-domain product architecture, source-transparency UX, and responsible research-tool implementation.',
    review: 'Research MVP',
  },
  {
    name: 'Amino Acid Workbench',
    rank: 9,
    status: 'Demo',
    category: 'Education tool',
    demo: 'https://aminoacidworkbench.netlify.app/',
    source: `${repoBase}/blob/main/projects/amino-acid-research-workbench/CASE_STUDY.md`,
    caseStudy: `${repoBase}/blob/main/projects/amino-acid-research-workbench/CASE_STUDY.md`,
    image: null,
    stack: ['Education', 'Bioinformatics', 'Explainable analysis'],
    summary: 'Educational workbench concept for comparing amino acid substitutions and building evidence dossiers.',
    why: 'Demonstrates explainable science tooling and responsible research-support framing.',
    review: 'Education scope',
  },
  {
    name: 'GardenGrid',
    rank: 10,
    status: 'Demo',
    category: 'Planning tool',
    demo: 'https://garden-grid-planner-demo.netlify.app/',
    source: null,
    caseStudy: null,
    image: null,
    stack: ['Static demo', 'Planning UX', 'Responsive UI'],
    summary: 'Garden layout planning demo for arranging beds, companion planting notes, and seasonal planning.',
    why: 'Shows applied planning UX outside the AI and operations-heavy projects.',
    review: 'Supplemental',
  },
  {
    name: 'HearthLink',
    rank: 11,
    status: 'Demo',
    category: 'Community concept',
    demo: 'https://hearthlink-p2p-demo.netlify.app/',
    source: null,
    caseStudy: null,
    image: null,
    stack: ['Static demo', 'P2P concept', 'No signaling backend'],
    summary: 'Peer-to-peer neighborhood hub demo framed as a front-end concept with offline/no-signaling limitations.',
    why: 'Useful supplemental demo when presented honestly as a limited static proof of concept.',
    review: 'Limited demo',
  },
];

const quickReview = projects.slice(0, 3);
const liveCount = projects.filter((project) => project.status === 'Live').length;

function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === 'All' || project.status === status;
      const searchable = `${project.name} ${project.category} ${project.summary} ${project.stack.join(' ')}`.toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, status]);

  return (
    <div className="app-shell">
      <aside className="side-rail" aria-label="Portfolio navigation">
        <a className="brand" href={githubPagesBase} aria-label="atomicdjt portfolio hub">
          <span className="brand-mark">A</span>
          <span>
            <strong>atomicdjt</strong>
            <small>AI Project Portfolio</small>
          </span>
        </a>
        <nav>
          <a href="#quick-review"><BriefcaseBusiness size={18} aria-hidden="true" /> Review path</a>
          <a href="#projects"><Layers3 size={18} aria-hidden="true" /> Projects</a>
          <a href="#technical-depth"><BookOpen size={18} aria-hidden="true" /> Technical depth</a>
          <a href={repoBase}><Code2 size={18} aria-hidden="true" /> GitHub repo</a>
        </nav>
        <div className="rail-panel">
          <span>For recruiters</span>
          <strong>3-minute path</strong>
          <p>Open the first three projects, then scan the comparison table for role fit.</p>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <h1>atomicdjt AI Project Portfolio</h1>
            <p>Applied AI, local-first tools, product prototypes, and case studies packaged for fast employer review.</p>
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
          <Stat label="Live demos" value={liveCount} icon={<Globe2 size={18} aria-hidden="true" />} />
          <Stat label="Runnable repo apps" value="11" icon={<CheckCircle2 size={18} aria-hidden="true" />} />
          <Stat label="Best review time" value="3 min" icon={<Timer size={18} aria-hidden="true" />} />
          <Stat label="Primary themes" value="AI + Ops" icon={<Sparkles size={18} aria-hidden="true" />} />
        </section>

        <section id="quick-review" className="quick-review" aria-labelledby="quick-title">
          <div className="section-title">
            <div>
              <span>Recruiter quick start</span>
              <h2 id="quick-title">Start with the strongest three projects</h2>
            </div>
            <a href={`${repoBase}/blob/main/docs/EMPLOYER_OVERVIEW.md`}>
              Employer overview <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="featured-grid">
            {quickReview.map((project) => (
              <ProjectCard key={project.name} project={project} featured />
            ))}
          </div>
        </section>

        <section id="projects" className="project-browser" aria-labelledby="projects-title">
          <div className="section-title browser-title">
            <div>
              <span>All projects</span>
              <h2 id="projects-title">Live demos, source, case studies, and status</h2>
            </div>
            <div className="filters">
              <label className="search-field">
                <Search size={16} aria-hidden="true" />
                <span className="sr-only">Search projects</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" />
              </label>
              <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
                <option>All</option>
                <option>Live</option>
                <option>Runnable</option>
                <option>Demo</option>
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>What it does and why it matters</th>
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
                        <div>
                          <strong>{project.name}</strong>
                          <span>{project.category}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Status"><StatusChip status={project.status} /></td>
                    <td data-label="What it does">
                      <p>{project.summary}</p>
                      <small><strong>Why it matters:</strong> {project.why}</small>
                    </td>
                    <td data-label="Links">
                      <div className="link-stack">
                        <ExternalLink href={project.demo}>Live demo</ExternalLink>
                        {project.caseStudy ? <ExternalLink href={project.caseStudy}>Case study</ExternalLink> : <span>Demo-only source</span>}
                      </div>
                    </td>
                    <td data-label="Tech / framing">
                      <div className="tag-list">
                        {project.stack.map((item) => <span key={item}>{item}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="technical-depth" className="technical-depth" aria-labelledby="depth-title">
          <div>
            <span>Technical depth links</span>
            <h2 id="depth-title">Recommended next stops after the demos</h2>
          </div>
          <div className="depth-grid">
            <DepthLink
              icon={<ShieldCheck size={19} aria-hidden="true" />}
              title="Verification guide"
              text="Commands, local ports, and public checks used to support portfolio claims."
              href={`${repoBase}/blob/main/docs/verification.md`}
            />
            <DepthLink
              icon={<BookOpen size={19} aria-hidden="true" />}
              title="Project index"
              text="Ranked list of runnable apps, concepts, research frameworks, and role-fit notes."
              href={`${repoBase}/blob/main/docs/PROJECT_INDEX.md`}
            />
            <DepthLink
              icon={<FileText size={19} aria-hidden="true" />}
              title="Skills matrix"
              text="How each project maps to operations, AI workflow, documentation, research, and frontend skills."
              href={`${repoBase}/blob/main/docs/SKILLS_MATRIX.md`}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="card-rank">{project.rank}</div>
      <ProjectThumb project={project} large />
      <div className="card-body">
        <div className="card-meta">
          <StatusChip status={project.status} />
          <span>{project.review}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <strong>Why it matters</strong>
        <p>{project.why}</p>
        <div className="card-actions">
          <ExternalLink href={project.demo}>Live demo</ExternalLink>
          <ExternalLink href={project.caseStudy}>Case study</ExternalLink>
        </div>
      </div>
    </article>
  );
}

function ProjectThumb({ project, large = false }) {
  if (project.image) {
    return <img className={large ? 'project-thumb large' : 'project-thumb'} src={project.image} alt={`${project.name} screenshot`} />;
  }

  return (
    <div className={large ? 'project-thumb large generated-thumb' : 'project-thumb generated-thumb'} aria-hidden="true">
      <span>{project.name.split(' ').map((word) => word[0]).join('').slice(0, 3)}</span>
      <small>{project.category}</small>
    </div>
  );
}

function StatusChip({ status }) {
  return <span className={`status-chip ${status.toLowerCase()}`}>{status}</span>;
}

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

function DepthLink({ icon, title, text, href }) {
  return (
    <a className="depth-link" href={href}>
      {icon}
      <strong>{title}</strong>
      <span>{text}</span>
    </a>
  );
}

export default App;
