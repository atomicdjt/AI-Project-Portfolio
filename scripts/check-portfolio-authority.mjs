import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const [
  catalogText,
  rootReadme,
  projectIndex,
  rankings,
  recruiterReview,
  employerOverview,
  verificationGuide,
] = await Promise.all([
  read('config/vercel-projects.json'),
  read('README.md'),
  read('docs/PROJECT_INDEX.md'),
  read('docs/project-ranking.md'),
  read('docs/recruiter-quick-review.md'),
  read('docs/EMPLOYER_OVERVIEW.md'),
  read('docs/verification.md'),
])

const catalog = JSON.parse(catalogText)
const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

assert(catalog.schemaVersion === 1, 'config/vercel-projects.json schemaVersion must be 1')
assert(Number.isInteger(catalog.catalogVersion), 'catalogVersion must be an integer')
assert(/^\d{4}-\d{2}-\d{2}$/.test(catalog.verifiedAt ?? ''), 'verifiedAt must use YYYY-MM-DD')
assert(Array.isArray(catalog.projects) && catalog.projects.length > 0, 'projects must be a non-empty array')
assert(Array.isArray(catalog.externalProjects), 'externalProjects must be an array')
assert(Array.isArray(catalog.nonCanonicalDeployments), 'nonCanonicalDeployments must be an array')

const allProjects = [...catalog.projects, ...catalog.externalProjects]
const byId = new Map()
const canonicalUrls = new Map()
const vercelProjects = new Map()

for (const project of allProjects) {
  assert(project?.id && typeof project.id === 'string', 'Every project requires a string id')
  if (!project?.id) continue

  assert(!byId.has(project.id), `Duplicate project id: ${project.id}`)
  byId.set(project.id, project)

  const url = project.productionUrl ?? project.canonicalProductionUrl
  const vercelProject = project.vercelProject

  if (url) {
    assert(url.startsWith('https://'), `${project.id}: canonical URL must use HTTPS`)
    assert(!canonicalUrls.has(url), `${project.id}: duplicate canonical URL also used by ${canonicalUrls.get(url)}`)
    canonicalUrls.set(url, project.id)
  }

  if (vercelProject) {
    assert(!vercelProjects.has(vercelProject), `${project.id}: duplicate canonical Vercel project also used by ${vercelProjects.get(vercelProject)}`)
    vercelProjects.set(vercelProject, project.id)
  }

  if ('verifiedRevenueOrAdoption' in project) {
    assert(
      project.verifiedRevenueOrAdoption === false,
      `${project.id}: verifiedRevenueOrAdoption must remain false until independently evidenced`,
    )
  }
}

const expected = {
  'buildworld-ai': {
    branch: 'main',
    url: 'https://buildworld-ai-v01-improvements.vercel.app/',
    vercelProject: 'buildworld-ai-v01-improvements',
  },
  processharbor: {
    url: 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/',
    vercelProject: 'ai-project-portfolio-opspilot-ai-operations-toolkit',
  },
  weavestudio: {
    branch: 'main',
    url: 'https://weavestudio-nine.vercel.app/',
    vercelProject: 'weavestudio',
  },
  'redactready-pro': {
    url: 'https://ai-project-portfolio-redactready-pr.vercel.app/',
    vercelProject: 'ai-project-portfolio-redactready-pro-hri-os',
  },
  'quoteforge-local': {
    branch: 'main',
    url: 'https://quoteforge-local.vercel.app/',
    vercelProject: 'quoteforge-local',
  },
  'variantvision-pro': {
    url: 'https://ai-project-portfolio-variantvision.vercel.app/',
    vercelProject: 'ai-project-portfolio-variantvision-pro',
  },
}

for (const [id, requirement] of Object.entries(expected)) {
  const project = byId.get(id)
  assert(project, `Missing canonical project: ${id}`)
  if (!project) continue

  const url = project.productionUrl ?? project.canonicalProductionUrl
  assert(url === requirement.url, `${id}: expected canonical URL ${requirement.url}; found ${url ?? 'missing'}`)
  assert(project.vercelProject === requirement.vercelProject, `${id}: unexpected Vercel project ${project.vercelProject ?? 'missing'}`)

  if (requirement.branch) {
    assert(project.authoritativeBranch === requirement.branch, `${id}: authoritative branch must be ${requirement.branch}`)
  }
}

const weavestudio = byId.get('weavestudio')
assert(
  weavestudio?.architecture?.includes('/blob/main/'),
  'weavestudio: architecture link must use the authoritative main branch',
)

const reviewGroups = [
  ['primaryEmployerReviewOrder', catalog.primaryEmployerReviewOrder],
  ['supportingSpecialization', catalog.supportingSpecialization],
  ['commercialExecution', catalog.commercialExecution],
]

for (const [name, values] of reviewGroups) {
  assert(Array.isArray(values), `${name} must be an array`)
  for (const id of values ?? []) {
    assert(byId.has(id), `${name} references unknown project: ${id}`)
  }
}

assert(
  JSON.stringify(catalog.primaryEmployerReviewOrder) === JSON.stringify(['buildworld-ai', 'processharbor', 'weavestudio']),
  'primaryEmployerReviewOrder must be BuildWorld AI, ProcessHarbor, WeaveStudio',
)
assert(
  JSON.stringify(catalog.supportingSpecialization) === JSON.stringify(['redactready-pro']),
  'supportingSpecialization must contain RedactReady Pro',
)
assert(
  JSON.stringify(catalog.commercialExecution) === JSON.stringify(['quoteforge-local']),
  'commercialExecution must contain QuoteForge Local',
)

const duplicateCandidates = new Map((catalog.nonCanonicalDeployments ?? []).map((entry) => [entry.vercelProject, entry]))
for (const project of ['source', 'weavestudio-demo']) {
  const entry = duplicateCandidates.get(project)
  assert(entry, `Missing noncanonical deployment record: ${project}`)
  assert(entry?.requiresExplicitDeletionApproval === true, `${project}: destructive removal must require explicit approval`)
  assert(entry?.replacement?.startsWith('https://'), `${project}: canonical replacement URL is required`)
}

const publicDocs = [rootReadme, projectIndex, rankings, recruiterReview, employerOverview, verificationGuide]
const combinedDocs = publicDocs.join('\n')

const requiredPhrases = [
  'https://buildworld-ai-v01-improvements.vercel.app/',
  'https://ai-project-portfolio-opspilot-ai-op.vercel.app/',
  'https://weavestudio-nine.vercel.app/',
  'https://ai-project-portfolio-redactready-pr.vercel.app/',
  'https://quoteforge-local.vercel.app/',
  'VariantVision Pro',
  'Legacy preserved public deployment',
  'authoritative `main` branch',
]

for (const phrase of requiredPhrases) {
  assert(combinedDocs.includes(phrase), `Public documentation is missing required canonical phrase: ${phrase}`)
}

const forbiddenPhrases = [
  'Vercel deployment pending',
  'Amino Acid Research Workbench | No current Vercel deployment',
  'HearthLink | No current Vercel deployment',
  'Separate authoritative repository, `master`',
  'master pending non-force migration to main',
  'github.com/atomicdjt/weavestudio/blob/master/',
  'config/portfolio-authority.json',
]

for (const phrase of forbiddenPhrases) {
  assert(!combinedDocs.includes(phrase), `Stale or duplicate authority language detected: ${phrase}`)
  assert(!catalogText.includes(phrase), `Stale or duplicate authority language detected in catalog: ${phrase}`)
}

const assertOrdered = (documentName, document, phrases) => {
  let previous = -1
  for (const phrase of phrases) {
    const position = document.indexOf(phrase)
    assert(position >= 0, `${documentName}: missing review-path item ${phrase}`)
    assert(position > previous, `${documentName}: review-path order is inconsistent near ${phrase}`)
    previous = position
  }
}

const reviewOrder = [
  'BuildWorld AI',
  'ProcessHarbor',
  'WeaveStudio',
  'RedactReady Pro',
]

assertOrdered('README.md', rootReadme.slice(rootReadme.indexOf('## Recommended Employer Review Path')), reviewOrder)
assertOrdered('docs/recruiter-quick-review.md', recruiterReview.slice(recruiterReview.indexOf('## 60-Second Review Path')), reviewOrder)
assertOrdered('docs/EMPLOYER_OVERVIEW.md', employerOverview.slice(employerOverview.indexOf('## Best Employer Review Path')), reviewOrder)
assertOrdered('docs/project-ranking.md', rankings.slice(rankings.indexOf('## Employer Review')), reviewOrder)

if (failures.length > 0) {
  console.error('Portfolio authority validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Portfolio authority validation passed for ${allProjects.length} canonical project records.`)
