import { readFile } from 'node:fs/promises'

const rootFile = (path) => new URL(`../${path}`, import.meta.url)
const read = (path) => readFile(rootFile(path), 'utf8')

const [manifestText, projectIndex, rankings] = await Promise.all([
  read('config/portfolio-authority.json'),
  read('docs/PROJECT_INDEX.md'),
  read('docs/project-ranking.md'),
])

const manifest = JSON.parse(manifestText)
const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

assert(manifest.schemaVersion === 1, 'portfolio-authority.json schemaVersion must be 1')
assert(/^\d{4}-\d{2}-\d{2}$/.test(manifest.verifiedAt ?? ''), 'verifiedAt must use YYYY-MM-DD')

const projects = manifest.projects ?? []
const byId = new Map()
const canonicalUrls = new Map()
const deploymentProjects = new Map()

for (const project of projects) {
  assert(project.id && typeof project.id === 'string', 'Every project must have a string id')
  assert(!byId.has(project.id), `Duplicate project id: ${project.id}`)
  byId.set(project.id, project)

  const url = project.deployment?.canonicalUrl
  const vercelProject = project.deployment?.project
  if (url) {
    assert(!canonicalUrls.has(url), `Duplicate canonical URL: ${url}`)
    canonicalUrls.set(url, project.id)
    assert(url.startsWith('https://'), `${project.id}: canonical URL must use HTTPS`)
  }
  if (vercelProject) {
    assert(!deploymentProjects.has(vercelProject), `Duplicate canonical Vercel project: ${vercelProject}`)
    deploymentProjects.set(vercelProject, project.id)
  }

  assert(project.tractionStatus === 'not-claimed', `${project.id}: tractionStatus must remain claim-safe unless independently evidenced`)
}

const expected = {
  'buildworld-ai': ['main', 'https://buildworld-ai-v01-improvements.vercel.app/'],
  processharbor: ['main', 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/'],
  weavestudio: ['main', 'https://weavestudio-nine.vercel.app/'],
  'quoteforge-local': ['main', 'https://quoteforge-local.vercel.app/'],
  'variantvision-pro': ['main', 'https://ai-project-portfolio-variantvision.vercel.app/'],
}

for (const [id, [branch, url]] of Object.entries(expected)) {
  const project = byId.get(id)
  assert(project, `Missing canonical project: ${id}`)
  if (!project) continue
  assert(project.sourceAuthority?.branch === branch, `${id}: expected authoritative branch ${branch}`)
  assert(project.deployment?.canonicalUrl === url, `${id}: expected canonical URL ${url}`)
}

for (const id of manifest.primaryEmployerReviewOrder ?? []) {
  assert(byId.has(id), `primaryEmployerReviewOrder references unknown project: ${id}`)
}
for (const id of manifest.commercialReviewOrder ?? []) {
  assert(byId.has(id), `commercialReviewOrder references unknown project: ${id}`)
}

const nonCanonical = manifest.nonCanonicalDeployments ?? []
for (const item of nonCanonical) {
  assert(item.project, 'Each noncanonical deployment must name a project')
  assert(item.canonicalReplacement, `${item.project}: canonicalReplacement is required`)
  assert(byId.has(item.canonicalReplacement), `${item.project}: canonical replacement does not exist: ${item.canonicalReplacement}`)
  assert(!deploymentProjects.has(item.project), `${item.project}: a noncanonical deployment cannot also be canonical`)
}

const docs = `${projectIndex}\n${rankings}`
const required = [
  'Status verified: July 19, 2026',
  'VariantVision Pro',
  'Live on Vercel',
  'Separate authoritative repository, `main`',
  'Legacy preserved public deployment',
  'https://weavestudio-nine.vercel.app/',
  'https://quoteforge-local.vercel.app/',
]
for (const phrase of required) assert(docs.includes(phrase), `Public docs missing canonical phrase: ${phrase}`)

const forbidden = [
  'Vercel deployment pending',
  'Amino Acid Research Workbench | No current Vercel deployment',
  'HearthLink | No current Vercel deployment',
  'Separate authoritative repository, `master`',
  'master pending non-force migration to main',
  'github.com/atomicdjt/weavestudio/blob/master/',
]
for (const phrase of forbidden) assert(!docs.includes(phrase), `Stale public status detected: ${phrase}`)

if (failures.length) {
  console.error('Portfolio authority validation failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Portfolio authority validation passed for ${projects.length} canonical projects.`)
