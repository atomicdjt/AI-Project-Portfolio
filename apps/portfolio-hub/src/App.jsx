import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  FileText,
  Layers3,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const repoBase = 'https://github.com/atomicdjt/AI-Project-Portfolio';
const weaveStudioRepoBase = 'https://github.com/atomicdjt/weavestudio';
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
    caseStudy: 'https://github.com/atomicdjt/buildworld-ai/blob/main/docs/portfolio/BUILDWORLD-REVIEW-PACK.md',
    image: imagePath('buildworld-ai-demo.gif'),
    stack: ['React', 'TypeScript', 'Simulation', 'Vercel'],
    summary: 'Visual graph-based simulation lab for complex systems, bottlenecks, cascade risk, reproducible experiments, SSI scoring, optimization suggestions, and reports.',
    reviewerSummary: 'In a 60-second review: open a synthetic scenario, inspect its graph and assumptions, run deterministic ticks or a cascade experiment, then compare the SSI and supporting metrics before exporting a local report.',
    maturity: 'Locally verified portfolio demonstrator with deterministic simulation modules and synthetic scenarios.',
    externalValidation: 'No real-world model accuracy, adoption, outcome, or deployment/source-alignment validation is claimed.',
    limitations: 'Educational heuristics only; not certified engineering, public-health, infrastructure, ecological, financial, or safety-critical decision support. Browser visual-regression and large-graph performance coverage remain gaps.',
    evidence: 'Technical flagship: deterministic engines, editable graph models, multi-seed analysis, local persistence, tests, architecture documentation, and a configured Vercel deployment candidate. Public source alignment requires manual verification.',
    review: 'Technical flagship',
  },
  {
    name: 'redactready-pro-hri-os',
    publicName: 'RedactReady Pro',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Privacy intelligence',
    demo: 'https://ai-project-portfolio-redactready-pr.vercel.app/',
    source: `${repoBase}/tree/main/apps/redactready-pro-hri-os`,
    caseStudy: `${repoBase}/blob/main/projects/redactready-pro-hri-os/CASE_STUDY.md`,
    image: imagePath('redactready-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Vitest', 'Local-first'],
    summary: 'Reviews document packets locally, detects sensitive information, scores human-risk signals, maps evidence, supports redaction, and exports reports.',
    evidence: 'Strong privacy and document-intelligence workflow with deterministic analysis, local-first boundaries, review UX, tests, and case-study documentation. Current public rendering requires manual verification.',
    review: 'Privacy flagship',
  },
  {
    name: 'opspilot-ai-operations-toolkit',
    publicName: 'ProcessHarbor Pro',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Technical operations',
    demo: 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/',
    source: `${repoBase}/tree/main/apps/opspilot-ai-operations-toolkit`,
    caseStudy: `${repoBase}/blob/main/docs/case-studies/PROCESSHARBOR.md`,
    image: imagePath('opspilot-home.png'),
    stack: ['React', 'TypeScript', 'Zod', 'Functions', 'Vitest'],
    summary: 'Turns rough operational inputs into reviewable SOPs, onboarding checklists, knowledge-base drafts, gap reports, versions, and export bundles.',
    reviewerSummary: 'In a 60-second review: enter fictional or sanitized notes, generate a deterministic draft, inspect ownership and open gaps, make human-reviewed changes, then record versions and export a local handoff bundle.',
    maturity: 'Pilot-evaluation demonstrator; deterministic local workflow verified locally.',
    externalValidation: 'External workflow outcomes have not been independently validated.',
    limitations: 'No production AI automation, durable cloud workspace, real identity provider, adoption, or productivity outcome is claimed. The static route does not prove reference server endpoints are deployed.',
    evidence: 'Clearest role fit for technical operations, documentation, enablement, and knowledge management, with deterministic validation boundaries and a database-ready path. Current public rendering requires manual verification.',
    review: 'Best role alignment',
  },
  {
    name: 'scamshield-ai',
    publicName: 'ScamShield AI',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Consumer safety',
    demo: 'https://ai-project-portfolio-scamshield-ai.vercel.app/',
    source: `${repoBase}/tree/main/apps/scamshield-ai`,
    caseStudy: `${repoBase}/blob/main/projects/scamshield-ai/CASE_STUDY.md`,
    image: imagePath('scamshield-assessment.png'),
    stack: ['React', 'Vite', 'PDF export', 'Local-first'],
    summary: 'Assesses suspicious messages, organizes evidence, suggests safer next steps, locates official reporting channels, and exports a structured packet.',
    evidence: 'Shows public-interest product judgment, explainable deterministic scoring, privacy-conscious workflow design, accessible guidance, and automated tests. Current public rendering requires manual verification.',
    review: 'Safety workflow',
  },
  {
    name: 'redactready-local',
    publicName: 'RedactReady',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Privacy tool',
    demo: 'https://ai-project-portfolio-redactready-lo.vercel.app/',
    source: `${repoBase}/tree/main/apps/redactready-local`,
    caseStudy: `${repoBase}/blob/main/docs/case-studies/REDACTREADY.md`,
    image: imagePath('redactready-review-workspace.png'),
    stack: ['React', 'TypeScript', 'PDF.js', 'pdf-lib'],
    summary: 'Reviews sensitive files locally, highlights likely private data, supports manual redaction, and exports verification-oriented results.',
    reviewerSummary: 'In a 60-second review: load a synthetic sample, inspect masked findings, make a deliberate review decision, complete the checklist, export, and separately inspect the result before sharing.',
    maturity: 'Controlled-evaluation workflow; local text-redaction path verified locally.',
    externalValidation: 'No independent detection, security, compliance, or workflow outcome has been established.',
    limitations: 'It is assistive only: detection and redaction are not guaranteed, OCR is experimental, and every export needs manual inspection. Public rendering and network behavior require manual verification.',
    evidence: 'Demonstrates document workflows, local processing, practical threat-model boundaries, flattened redaction output, and security-minded UX. Current public rendering requires manual verification.',
    review: 'Privacy depth',
  },
  {
    name: 'layerforge-studio',
    publicName: 'LayerForge Studio',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Canvas editor',
    demo: 'https://ai-project-portfolio-layerforge-stu.vercel.app/',
    source: `${repoBase}/tree/main/apps/layerforge-studio`,
    caseStudy: `${repoBase}/blob/main/projects/layerforge-studio/CASE_STUDY.md`,
    image: imagePath('layerforge-studio-home.png'),
    stack: ['React', 'TypeScript', 'Canvas 2D', 'IndexedDB'],
    summary: 'Browser image editor with layered raster documents, painting tools, selections, filters, undo, persistence, and exports.',
    evidence: 'Strong frontend and interaction-depth evidence, including Canvas architecture, command history, local persistence, and dense product UI. Current public rendering requires manual verification.',
    review: 'Frontend depth',
  },
  {
    name: 'focusforge',
    publicName: 'FocusForge',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Productivity game',
    demo: 'https://ai-project-portfolio-focusforge.vercel.app/',
    source: `${repoBase}/tree/main/apps/focusforge`,
    caseStudy: `${repoBase}/blob/main/projects/focusforge/CASE_STUDY.md`,
    image: imagePath('focusforge-home.png'),
    stack: ['React', 'Vite', 'Vitest', 'Local storage'],
    summary: 'Turns focus sessions into civilization growth, research unlocks, streak history, and durable local progress.',
    evidence: 'Shows product-system thinking, stateful UX, persistent client data, testable game rules, and responsive design. Current public rendering requires manual verification.',
    review: 'Product system',
  },
  {
    name: 'variantvision-pro',
    publicName: 'VariantVision Pro',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Research tool',
    demo: 'https://ai-project-portfolio-variantvision.vercel.app/',
    source: `${repoBase}/tree/main/apps/variantvision-pro`,
    caseStudy: `${repoBase}/blob/main/projects/variantvision-pro/CASE_STUDY.md`,
    image: imagePath('variantvision-pro-dashboard.png'),
    stack: ['React', 'TypeScript', 'Bioinformatics', 'Evidence scoring'],
    summary: 'Educational bioinformatics workbench for genetic-variant review, source provenance, amino-acid comparison, evidence scoring, and non-diagnostic reports.',
    evidence: 'Shows complex-domain product architecture, source-transparency UX, research support, and careful non-diagnostic scope boundaries. Current public rendering requires manual verification.',
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
    demo: 'https://weavestudio-nine.vercel.app/',
    source: weaveStudioRepoBase,
    caseStudy: `${weaveStudioRepoBase}/blob/main/docs/case-studies/WEAVESTUDIO.md`,
    acquisition: 'https://weavestudio-nine.vercel.app/acquire',
    image: imagePath('weavestudio-demo.gif'),
    stack: ['React', 'TypeScript', 'React Flow', 'Playwright', 'Vercel'],
    summary: 'Local-first visual workflow canvas for turning fragmented notes, transcripts, logs, and research inputs into structured, reviewable deliverables.',
    reviewerSummary: 'In a 60-second review: start with rough source material, structure it as a visible workflow, validate it with a human checkpoint, generate a reviewable deliverable, and export locally. Optional BYOK AI assistance is consent-gated.',
    maturity: 'Transfer-ready product; technical implementation verified locally.',
    externalValidation: 'External workflow outcomes have not been independently validated.',
    limitations: 'No independent productivity, adoption, or commercial outcome is claimed. Public rendering and acquisition terms require manual verification.',
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
    image: imagePath('quoteforge-local-home.png'),
    stack: ['Next.js', 'TypeScript', 'Playwright', 'CSV export', 'Vercel'],
    summary: 'White-label quote-calculator and lead-capture package for agencies, freelancers, WordPress developers, and local-service website implementers.',
    evidence: 'Ten calculator templates, embed and WordPress paths, buyer documentation, licensing, QA scripts, sales materials, and release packaging.',
    review: 'Shipped commercial package',
  },
  {
    name: 'amino-acid-workbench',
    publicName: 'Amino Acid Workbench',
    audience: 'Supplemental',
    status: 'Live',
    repositoryAuthority: 'Legacy static artifact in this repository',
    category: 'Education tool',
    demo: 'https://ai-project-portfolio-amino-workbenc.vercel.app/',
    source: `${repoBase}/tree/main/apps/amino-acid-workbench-legacy`,
    caseStudy: `${repoBase}/blob/main/projects/amino-acid-research-workbench/CASE_STUDY.md`,
    image: null,
    stack: ['Education', 'Bioinformatics', 'Static legacy artifact', 'Vercel'],
    summary: 'Educational workbench concept for comparing amino-acid substitutions and building evidence dossiers.',
    evidence: 'A preserved legacy static build is live on Vercel; the original editable source was not available during migration.',
    review: 'Supplemental research work / legacy static build',
  },
  {
    name: 'garden-grid',
    publicName: 'GardenGrid',
    audience: 'Supplemental',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace (recovered local source)',
    category: 'Planning tool',
    demo: 'https://ai-project-portfolio-garden-grid.vercel.app/',
    source: `${repoBase}/tree/main/apps/garden-grid-planner`,
    caseStudy: null,
    image: null,
    stack: ['React', 'TypeScript', 'Vite', 'Planning UX', 'Vercel'],
    summary: 'Garden-layout planning concept for arranging beds, companion-planting notes, and seasonal planning.',
    evidence: 'Recovered local source is preserved in this repository and deployed to Vercel after type, lint, and production-build checks.',
    review: 'Supplemental planning product',
  },
  {
    name: 'hearthlink',
    publicName: 'HearthLink',
    audience: 'Supplemental',
    status: 'Live',
    repositoryAuthority: 'Legacy static artifact in this repository',
    category: 'Community concept',
    demo: 'https://ai-project-portfolio-hearthlink.vercel.app/',
    source: `${repoBase}/tree/main/apps/hearthlink-legacy`,
    caseStudy: null,
    image: null,
    stack: ['WebRTC UI', 'P2P concept', 'Static legacy artifact', 'Vercel'],
    summary: 'Peer-to-peer neighborhood-hub concept with explicit offline and signaling limitations.',
    evidence: 'A preserved legacy static demo is live on Vercel. It intentionally runs in offline/demo mode without a signaling server, so no multi-peer service is claimed.',
    review: 'Supplemental offline demo / legacy static build',
  },
];

const flagshipNames = ['ProcessHarbor Pro', 'RedactReady', 'WeaveStudio', 'QuoteForge Local', 'BuildWorld AI'];
const flagshipProjects = projects.filter((project) => flagshipNames.includes(project.publicName));
const supportingProjects = projects.filter((project) => !flagshipNames.includes(project.publicName));
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

  if (window.location.pathname.replace(/\/+$/, '') === '/review') return <ReviewPath />;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to portfolio content</a>
      <aside className="side-rail" aria-label="Portfolio navigation">
        <a className="brand" href="/" aria-label="David Turner portfolio hub">
          <span className="brand-mark">DT</span>
          <span>
            <strong>David Turner</strong>
            <small>Applied AI & Technical Operations</small>
          </span>
        </a>
        <nav>
          <a href="/review"><BriefcaseBusiness size={18} aria-hidden="true" /> Five-minute review</a>
          <a href="#employer-review"><BriefcaseBusiness size={18} aria-hidden="true" /> Hiring evidence</a>
          <a href="#commercial-assets"><Sparkles size={18} aria-hidden="true" /> Products</a>
          <a href="#projects"><Layers3 size={18} aria-hidden="true" /> All projects</a>
          <a href="#technical-depth"><BookOpen size={18} aria-hidden="true" /> Evidence</a>
          <a href={repoBase}><Code2 size={18} aria-hidden="true" /> GitHub repo</a>
        </nav>
        <div className="rail-panel">
          <span>Deployment policy</span>
          <strong>Vercel only</strong>
          <p>Only Vercel-hosted products are labeled live. Other source-backed applications remain reviewable through code and case studies until their Vercel projects are created.</p>
        </div>
      </aside>

      <main id="main-content" tabIndex={-1}>
        <header className="topbar hero">
          <div className="hero-copy">
            <h1>I turn ambiguous workflows into reviewable, local-first software.</h1>
            <p>Applied AI and technical operations work for teams that need clearer processes, human review checkpoints, and defensible handoffs.</p>
            <div className="topbar-actions" aria-label="Primary portfolio actions">
              <a className="button primary" href="/review">
                Review the work <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button secondary" href="#projects">
                <Layers3 size={17} aria-hidden="true" /> Open portfolio
              </a>
            </div>
          </div>
          <WorkflowPreview />
        </header>

        <section className="review-intro" aria-label="Portfolio review guidance">
          <p><strong>Start with the three flagships below.</strong> Each includes a live product, source authority, and a specific kind of evidence—without implying customer, revenue, or compliance claims.</p>
          <div className="topbar-actions">
            <a className="button secondary" href={repoBase}><Code2 size={17} aria-hidden="true" /> View GitHub</a>
            <a className="button primary" href={`${repoBase}/blob/main/docs/recruiter-quick-review.md`}><FileText size={17} aria-hidden="true" /> Recruiter guide</a>
          </div>
        </section>

        <section id="employer-review" className="quick-review" aria-labelledby="employer-title">
          <div className="section-title">
            <div>
              <span>Employer review</span>
              <h2 id="employer-title">Five flagship assets for a focused technical-operations review</h2>
            </div>
            <a href={`${repoBase}/blob/main/docs/EMPLOYER_OVERVIEW.md`}>
              Employer overview <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="featured-grid">
            {flagshipProjects.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </section>

        <section id="commercial-assets" className="quick-review" aria-labelledby="commercial-title">
          <div className="section-title">
            <div>
              <span>Supporting work</span>
              <h2 id="commercial-title">Supporting, experimental, and legacy work</h2>
            </div>
          </div>
          <p>Commercial status describes product packaging and availability; it does not imply revenue, customers, active users, or a completed acquisition.</p>
          <div className="featured-grid">
            {supportingProjects.slice(0, 3).map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </section>

        <section id="projects" className="project-browser" aria-labelledby="projects-title">
          <div className="section-title browser-title">
            <div>
              <span>Complete catalog</span>
              <h2 id="projects-title">Source authority, Vercel status, case studies, and evidence</h2>
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
          <p className="filter-summary" role="status" aria-live="polite">
            Showing {filteredProjects.length} of {projects.length} projects.
          </p>
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
                        {project.demo ? <ExternalLink href={project.demo}>Vercel demo</ExternalLink> : <span>No current Vercel demo</span>}
                        {project.source && project.source !== project.caseStudy ? <ExternalLink href={project.source}>Source</ExternalLink> : null}
                        {project.caseStudy ? <ExternalLink href={project.caseStudy}>{project.audience === 'Commercial' ? 'Product details' : 'Case study'}</ExternalLink> : <span>No portfolio case study</span>}
                      </div>
                    </td>
                    <td data-label="Tech / framing"><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></td>
                  </tr>
                ))}
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-results">No projects match the current filters. Try clearing a filter or using a broader search.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section id="technical-depth" className="technical-depth" aria-labelledby="depth-title">
          <div><span>Evidence and role mapping</span><h2 id="depth-title">Recommended next stops after the project review</h2></div>
          <div className="depth-grid">
            <DepthLink icon={<ShieldCheck size={19} aria-hidden="true" />} title="Verification guide" text="Commands, validation boundaries, and public checks used to support portfolio claims." href={`${repoBase}/blob/main/docs/verification.md`} />
            <DepthLink icon={<BookOpen size={19} aria-hidden="true" />} title="Project index" text="Source authority, Vercel status, best evidence, and role-fit notes for the complete catalog." href={`${repoBase}/blob/main/docs/PROJECT_INDEX.md`} />
            <DepthLink icon={<FileText size={19} aria-hidden="true" />} title="Vercel deployment plan" text="Project-by-project migration settings and the Vercel-only publication policy." href={`${repoBase}/blob/main/docs/VERCEL_DEPLOYMENT.md`} />
          </div>
        </section>
      </main>
    </div>
  );
}

function WorkflowPreview() {
  const steps = ['Intake', 'Structure', 'Validate', 'Review', 'Export'];
  return (
    <div className="workflow-preview" aria-label="A reviewable workflow moves from intake through structure, validation, review, and export.">
      <Network size={22} aria-hidden="true" />
      <div className="workflow-nodes">
        {steps.map((step, index) => <span key={step} className={index === 3 ? 'workflow-node active' : 'workflow-node'}>{step}</span>)}
      </div>
      <small>Human review remains explicit before output is used.</small>
    </div>
  );
}

function ReviewPath() {
  return (
    <main className="review-page">
      <a className="review-back" href="/">← Portfolio hub</a>
      <header className="review-hero">
        <h1>A focused review of applied AI and technical-operations work.</h1>
        <p>Five focused assets demonstrate product reasoning, operational workflow design, privacy boundaries, and end-to-end delivery. Review each in order, then inspect the source and validation evidence that matters to you.</p>
      </header>
      <ol className="review-steps">
        {flagshipProjects.map((project, index) => (
          <li key={project.name}>
            <span className="review-number">0{index + 1}</span>
            <div>
              <p className="review-label">{project.review}</p>
              <h2>{project.publicName}</h2>
              <p>{project.evidence}</p>
              {project.reviewerSummary ? <p className="review-case-study-summary"><strong>Case-study snapshot:</strong> {project.reviewerSummary}</p> : null}
              {project.maturity ? <p className="review-case-study-meta"><strong>Maturity:</strong> {project.maturity} <strong>External status:</strong> {project.externalValidation} <strong>Limitations:</strong> {project.limitations}</p> : null}
              <div className="card-actions">
                {project.demo ? <ExternalLink href={project.demo}>Open live demo</ExternalLink> : null}
                {project.source ? <ExternalLink href={project.source}>Inspect source</ExternalLink> : null}
                {project.caseStudy ? <ExternalLink href={project.caseStudy}>Read case study</ExternalLink> : null}
                {project.acquisition ? <ExternalLink href={project.acquisition}>Acquisition information</ExternalLink> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <section className="review-boundary">
        <h2>Evidence boundary</h2>
        <p>These products demonstrate documented implementation, testing, and public review paths. They do not claim verified revenue, active users, completed acquisitions, professional certification, or compliance status unless separately evidenced.</p>
      </section>
    </main>
  );
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
          {project.demo ? <ExternalLink href={project.demo}>Vercel demo</ExternalLink> : null}
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
