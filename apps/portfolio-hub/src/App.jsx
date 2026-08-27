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
import { trackCtaClicked, trackDemoStarted, trackGithubClicked, trackProjectViewed } from './analytics.js';

const repoBase = 'https://github.com/atomicdjt/AI-Project-Portfolio';
const imagePath = (fileName) => `/images/${fileName}`;

const projects = [
  {
    name: 'validation-ledger',
    publicName: 'Validation Ledger',
    audience: 'Technical',
    status: 'Live',
    repositoryAuthority: 'Separate authoritative repository',
    category: 'Evidence-to-decision workflow',
    demo: 'https://validation-ledger.vercel.app/',
    source: 'https://github.com/atomicdjt/validation-ledger',
    caseStudy: '/projects/validation-ledger',
    image: imagePath('validation-ledger-dashboard.jpg'),
    stack: ['React', 'TypeScript', 'Dexie', 'IndexedDB', 'Vercel'],
    summary: 'Local-first workspace for tracing source evidence through explicit hypotheses and decisions while keeping counterevidence and decision history inspectable.',
    evidence: 'A production Vercel application and public source demonstrate the evidence model, local-first boundary, explainable scoring, and regression-oriented verification. Practitioner adoption remains under evaluation.',
    review: 'Evidence and ResearchOps workflow',
  },
  {
    name: 'agent-session-bridge',
    publicName: 'Agent Session Bridge',
    audience: 'Technical',
    status: 'Published',
    repositoryAuthority: 'Separate authoritative repository',
    category: 'Agent trace interoperability',
    demo: 'https://pypi.org/project/atomicdjt-agent-session-bridge/',
    source: 'https://github.com/atomicdjt/agent-session-bridge',
    caseStudy: '/projects/agent-session-bridge',
    image: imagePath('agent-session-bridge-pypi.png'),
    stack: ['Python', 'ATIF v1.7', 'OpenTelemetry', 'OpenInference'],
    summary: 'Provider-neutral Python reference implementation for normalizing coding-agent session records with explicit fidelity, privacy, and historical-projection boundaries.',
    evidence: 'Published package and public source document ATIF normalization, best-effort secret redaction, fidelity accounting, and the limits of historical observability. It does not claim native session rehydration or original runtime telemetry.',
    review: 'Interoperability and provenance',
  },
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
    image: imagePath('buildworld-ai-demo.gif'),
    stack: ['React', 'TypeScript', 'Simulation', 'Vercel'],
    summary: 'Visual graph-based simulation lab for complex systems, bottlenecks, cascade risk, reproducible experiments, SSI scoring, optimization suggestions, and reports.',
    evidence: 'Most technically original flagship: deterministic engines, editable graph models, multi-seed analysis, local persistence, tests, architecture documentation, and a Vercel deployment.',
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
    evidence: 'Strongest privacy and document-intelligence workflow: deterministic analysis, local-first boundaries, polished review UX, tests, and case-study documentation. Live Vercel production route verified.',
    review: 'Privacy flagship',
  },
  {
    name: 'opspilot-ai-operations-toolkit',
    publicName: 'ProcessHarbor',
    audience: 'Employer',
    status: 'Live',
    repositoryAuthority: 'Portfolio workspace',
    category: 'Technical operations',
    demo: 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/',
    source: `${repoBase}/tree/main/apps/opspilot-ai-operations-toolkit`,
    caseStudy: `${repoBase}/blob/main/projects/opspilot-ai-operations-toolkit/CASE_STUDY.md`,
    image: imagePath('opspilot-home.png'),
    stack: ['React', 'TypeScript', 'Zod', 'Functions', 'Vitest'],
    summary: 'Turns rough operational inputs into reviewable SOPs, onboarding checklists, knowledge-base drafts, gap reports, versions, and export bundles.',
    evidence: 'Clearest role fit for technical operations, documentation, enablement, and knowledge management, with validation boundaries and a database-ready path. Live Vercel production route verified.',
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
    evidence: 'Shows public-interest product judgment, explainable deterministic scoring, privacy-conscious workflow design, accessible guidance, and automated tests. Live Vercel production route verified.',
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
    caseStudy: `${repoBase}/blob/main/projects/redactready-local/CASE_STUDY.md`,
    image: imagePath('redactready-review-workspace.png'),
    stack: ['React', 'TypeScript', 'PDF.js', 'pdf-lib'],
    summary: 'Reviews sensitive files locally, highlights likely private data, supports manual redaction, and exports verification-oriented results.',
    evidence: 'Demonstrates document workflows, local processing, practical threat-model boundaries, true flattened redaction output, and security-minded UX. Live Vercel production route verified.',
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
    evidence: 'Strong frontend and interaction-depth evidence, including Canvas architecture, command history, local persistence, and dense product UI. Live Vercel production route verified.',
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
    evidence: 'Shows product-system thinking, stateful UX, persistent client data, testable game rules, and responsive design. Live Vercel production route verified.',
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
    evidence: 'Shows complex-domain product architecture, source-transparency UX, research support, and careful non-diagnostic scope boundaries. Live Vercel production route verified.',
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
    source: 'https://github.com/atomicdjt/weavestudio',
    caseStudy: 'https://weavestudio-nine.vercel.app/acquire',
    image: imagePath('weavestudio-demo.gif'),
    stack: ['React', 'TypeScript', 'React Flow', 'Playwright', 'Vercel'],
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

const technicalFlagships = projects.filter((project) =>
  ['Validation Ledger', 'Agent Session Bridge', 'BuildWorld AI', 'WeaveStudio'].includes(project.publicName),
);
const archiveProjects = projects.filter((project) => !technicalFlagships.includes(project));

const externalProof = [
  {
    eyebrow: 'Merged upstream contributions',
    title: 'Grid Dynamics Rosetta',
    text: 'Scoped security, correctness, performance, and regression-coverage contributions were independently reviewed and merged upstream in PRs #299, #319, #320, and #322.',
    links: [
      ['Rosetta PR #299', 'https://github.com/griddynamics/rosetta/pull/299'],
      ['Rosetta PR #319', 'https://github.com/griddynamics/rosetta/pull/319'],
      ['Rosetta PR #320', 'https://github.com/griddynamics/rosetta/pull/320'],
      ['Rosetta PR #322', 'https://github.com/griddynamics/rosetta/pull/322'],
    ],
  },
  {
    eyebrow: 'Merged upstream contribution',
    title: 'super-productivity',
    text: 'PR #9619 was merged upstream with a section-ordering fix that keeps visible task order aligned with existing move actions, with regression coverage across project and tag contexts.',
    links: [['Read PR #9619', 'https://github.com/super-productivity/super-productivity/pull/9619']],
  },
  {
    eyebrow: 'Published interoperability work',
    title: 'Agent Session Bridge',
    text: 'A published Python package and technical article document ATIF normalization, fidelity accounting, redaction boundaries, and the distinction between portable history and native session resumption.',
    links: [
      ['Open package', 'https://pypi.org/project/atomicdjt-agent-session-bridge/'],
      ['Read technical article', 'https://github.com/atomicdjt/atomicdjt/blob/main/writing/from-claude-code-jsonl-to-atif-v1-7.md'],
    ],
  },
];

function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [audience, setAudience] = useState('All');

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return archiveProjects.filter((project) => {
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
          <a href="/review"><BriefcaseBusiness size={18} aria-hidden="true" /> Technical review</a>
          <a href="#flagships"><BriefcaseBusiness size={18} aria-hidden="true" /> Flagship work</a>
          <a href="#external-proof"><Sparkles size={18} aria-hidden="true" /> External proof</a>
          <a href="#capabilities"><BookOpen size={18} aria-hidden="true" /> How I work</a>
          <a href="#projects"><Layers3 size={18} aria-hidden="true" /> More projects</a>
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
              <a className="button primary" href="/review" onClick={() => trackCtaClicked({ cta_name: 'review_work', destination_type: 'technical_review', surface: 'home' })}>
                Review the work <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button secondary" href="#projects" onClick={() => trackCtaClicked({ cta_name: 'open_portfolio', destination_type: 'project_archive', surface: 'home' })}>
                <Layers3 size={17} aria-hidden="true" /> Open portfolio
              </a>
            </div>
          </div>
          <WorkflowPreview />
        </header>

        <section className="review-intro" aria-label="Portfolio review guidance">
          <p><strong>Start with the four core technical flagships below.</strong> Employer, buyer, and research paths remain separate because they answer different questions; none implies customer, revenue, or compliance claims.</p>
          <div className="topbar-actions">
            <a className="button secondary" href={repoBase} onClick={() => trackGithubClicked({ destination_type: 'portfolio_repository', surface: 'home' })}><Code2 size={17} aria-hidden="true" /> View GitHub</a>
            <a className="button primary" href={`${repoBase}/blob/main/docs/recruiter-quick-review.md`}><FileText size={17} aria-hidden="true" /> Recruiter guide</a>
          </div>
        </section>

        <section id="flagships" className="quick-review flagship-section" aria-labelledby="technical-title">
          <div className="section-title">
            <div>
              <span>Core technical flagships</span>
              <h2 id="technical-title">Four projects for evidence, interoperability, systems reasoning, and workflow delivery</h2>
            </div>
            <a href="/review">
              Technical review path <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <p>These are the primary technical projects. Their ordering is a review sequence, not a claim that one project is universally stronger or more validated than another.</p>
          <div className="featured-grid flagship-grid">
            {technicalFlagships.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </section>

        <section id="external-proof" className="external-proof" aria-labelledby="proof-title">
          <div className="section-title">
            <div>
              <span>External / open-source proof</span>
              <h2 id="proof-title">Work that has been read, challenged, and accepted outside this portfolio</h2>
            </div>
            <a href={`${repoBase}/blob/main/docs/discovery/external-corroboration.md`}>Evidence record <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <p className="section-lede">The strongest external signals here are narrow and specific: merged upstream contributions and a published interoperability implementation. They do not imply customers, revenue, broad adoption, or endorsement beyond the linked evidence.</p>
          <div className="proof-grid">
            {externalProof.map((item) => <ProofCard key={item.title} item={item} />)}
          </div>
        </section>

        <section id="capabilities" className="technical-depth" aria-labelledby="capabilities-title">
          <div className="section-title">
            <div>
              <span>Working method</span>
              <h2 id="capabilities-title">Useful software begins with explicit boundaries.</h2>
            </div>
          </div>
          <div className="depth-grid">
            <DepthLink icon={<ShieldCheck size={19} aria-hidden="true" />} title="Make evidence inspectable" text="Trace source material, transformations, counterevidence, and decisions so a reviewer can challenge the result." href={`${repoBase}/blob/main/docs/verification.md`} />
            <DepthLink icon={<Network size={19} aria-hidden="true" />} title="Keep humans in the loop" text="Use local-first storage, explicit review checkpoints, and conservative claims where automation or AI assistance is involved." href={`${repoBase}/blob/main/docs/EMPLOYER_OVERVIEW.md`} />
            <DepthLink icon={<Code2 size={19} aria-hidden="true" />} title="Ship the proof with the product" text="Pair implementation with tests, source authority, deployment checks, technical writing, and a clear handoff path." href={`${repoBase}/blob/main/docs/PROJECT_INDEX.md`} />
          </div>
        </section>

        <section id="projects" className="project-browser archive-section" aria-labelledby="projects-title">
          <div className="section-title browser-title">
            <div>
              <span>More projects</span>
              <h2 id="projects-title">The complete catalog, kept available without competing with the flagships</h2>
            </div>
            <p className="archive-count">{archiveProjects.length} supporting projects</p>
          </div>
          <div className="filters archive-controls">
            <label className="search-field">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search projects</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" />
            </label>
            <select value={audience} onChange={(event) => setAudience(event.target.value)} aria-label="Filter by audience">
              <option>All</option><option>Employer</option><option>Technical</option><option>Commercial</option><option>Supplemental</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              <option>All</option><option>Live</option><option>Published</option><option>Local</option><option>Commercial</option><option>Acquisition Asset</option>
            </select>
          </div>
          <details className="archive-details">
            <summary>Open the searchable project archive</summary>
            <p className="filter-summary" role="status" aria-live="polite">Showing {filteredProjects.length} of {archiveProjects.length} projects.</p>
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
          </details>
        </section>

        <SiteFooter />
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
        <h1>A five-minute technical proof review.</h1>
        <p>Four core technical projects show evidence-to-decision workflows, agent-trace interoperability, systems reasoning, and reviewable delivery. Review each in order, then inspect the source and validation evidence that matters to you.</p>
      </header>
      <ol className="review-steps">
        {technicalFlagships.map((project, index) => (
          <li key={project.name}>
            <span className="review-number">0{index + 1}</span>
            <div>
              <p className="review-label">{project.review}</p>
              <h2>{project.publicName}</h2>
              <p>{project.evidence}</p>
              <div className="card-actions">
                {project.demo ? <ExternalLink href={project.demo}>Open live demo</ExternalLink> : null}
                {project.source ? <ExternalLink href={project.source}>Inspect source</ExternalLink> : null}
                {project.caseStudy ? <ExternalLink href={project.caseStudy}>Read case study</ExternalLink> : null}
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
          {project.demo ? <ExternalLink href={project.demo} onClick={() => { trackProjectViewed({ project_slug: project.name, project_name: project.publicName, surface: 'flagship_card' }); trackDemoStarted({ project_slug: project.name, project_name: project.publicName, surface: 'flagship_card' }); }}>Vercel demo</ExternalLink> : null}
          {project.source ? <ExternalLink href={project.source} onClick={() => trackProjectViewed({ project_slug: project.name, project_name: project.publicName, surface: 'flagship_card' })}>Source</ExternalLink> : null}
          {project.caseStudy ? <ExternalLink href={project.caseStudy} onClick={() => trackProjectViewed({ project_slug: project.name, project_name: project.publicName, surface: 'flagship_card' })}>{project.audience === 'Commercial' ? 'Product details' : project.audience === 'Technical' ? 'Canonical page' : 'Case study'}</ExternalLink> : null}
        </div>
      </div>
    </article>
  );
}

function ProjectThumb({ project, large = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (project.image && !imageFailed) return <img className={large ? 'project-thumb large' : 'project-thumb'} src={project.image} alt={`${project.publicName} screenshot`} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />;
  return <div className={large ? 'project-thumb large generated-thumb' : 'project-thumb generated-thumb'} aria-hidden="true"><span>{project.publicName.split(' ').map((word) => word[0]).join('').slice(0, 3)}</span><small>{project.category}</small></div>;
}

function ProofCard({ item }) {
  return <article className="proof-card"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.text}</p><div className="card-actions">{item.links.map(([label, href]) => <ExternalLink key={href} href={href}>{label}</ExternalLink>)}</div></article>;
}

function SiteFooter() {
  return <footer className="site-footer"><div><span className="footer-eyebrow">Canonical project navigation</span><h2>Keep exploring the work</h2><p>Start with a flagship page for technical context, then inspect the executable product and authoritative source linked from that page.</p></div><nav aria-label="Canonical flagship projects"><a href="/projects/validation-ledger">Validation Ledger</a><a href="/projects/agent-session-bridge">Agent Session Bridge</a><a href="/projects/buildworld-ai">BuildWorld AI</a><a href="/projects/weavestudio">WeaveStudio</a></nav><small>Built by David Turner. Claims are limited to documented implementation, testing, publication, deployment, and linked external evidence.</small></footer>;
}

function StatusChip({ status }) {
  const className = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-chip ${className}`}>{status}</span>;
}

function ExternalLink({ href, children, onClick }) {
  const handleClick = () => {
    onClick?.();
    if (href.startsWith('https://github.com/')) trackGithubClicked({ destination_type: 'github', surface: 'external_link' });
  };
  return <a href={href} target="_blank" rel="noreferrer" onClick={handleClick}>{children} <ArrowUpRight size={14} aria-hidden="true" /></a>;
}

function DepthLink({ icon, title, text, href }) {
  return <a className="depth-link" href={href}>{icon}<strong>{title}</strong><span>{text}</span></a>;
}

export default App;
