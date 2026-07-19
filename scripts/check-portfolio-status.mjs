import { readFile } from 'node:fs/promises'

const read = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const [catalogText, projectIndex, rankings] = await Promise.all([
  read('config/vercel-projects.json'),
  read('docs/PROJECT_INDEX.md'),
  read('docs/project-ranking.md'),
])

const catalog = JSON.parse(catalogText)
const failures = []

const requireValue = (condition, message) => {
  if (!condition) failures.push(message)
}

const externalById = new Map((catalog.externalProjects ?? []).map((project) => [project.id, project]))
const internalById = new Map((catalog.projects ?? []).map((project) => [project.id, project]))

const canonical = {
  'buildworld-ai': {
    project: externalById.get('buildworld-ai'),
    branch: 'main',
    url: 'https://buildworld-ai-v01-improvements.vercel.app/',
  },
  weavestudio: {
    project: externalById.get('weavestudio'),
    branch: 'main',
    url: 'https://weavestudio-nine.vercel.app/',
  },
  'quoteforge-local': {
    project: externalById.get('quoteforge-local'),
    branch: 'main',
    url: 'https://quoteforge-local.vercel.app/',
  },
  'variantvision-pro': {
    project: internalById.get('variantvision-pro'),
    url: 'https://ai-project-portfolio-variantvision.vercel.app/',
  },
}

for (const [id, expected] of Object.entries(canonical)) {
  requireValue(expected.project, `Missing canonical catalog entry: ${id}`)
  if (!expected.project) continue

  if (expected.branch) {
    requireValue(
      expected.project.authoritativeBranch === expected.branch,
      `${id}: authoritativeBranch must be ${expected.branch}; found ${expected.project.authoritativeBranch ?? 'missing'}`,
    )
  }

  const catalogUrl = expected.project.canonicalProductionUrl ?? expected.project.productionUrl
  requireValue(catalogUrl === expected.url, `${id}: canonical URL must be ${expected.url}; found ${catalogUrl ?? 'missing'}`)
}

const publicDocs = `${projectIndex}\n${rankings}`

const requiredPhrases = [
  'VariantVision Pro',
  'Live on Vercel',
  'Separate authoritative repository, `main`',
  'Legacy preserved public deployment',
  'https://weavestudio-nine.vercel.app/',
  'https://quoteforge-local.vercel.app/',
]

for (const phrase of requiredPhrases) {
  requireValue(publicDocs.includes(phrase), `Public documentation is missing required canonical phrase: ${phrase}`)
}

const forbiddenPhrases = [
  'VariantVision Pro](../projects/variantvision-pro/CASE_STUDY.md) | Strongest source-backed research application; Vercel deployment pending',
  'Amino Acid Research Workbench | No current Vercel deployment',
  'HearthLink | No current Vercel deployment',
  'Separate authoritative repository, `master`',
  'master pending non-force migration to main',
  'github.com/atomicdjt/weavestudio/blob/master/',
]

for (const phrase of forbiddenPhrases) {
  requireValue(!publicDocs.includes(phrase), `Stale portfolio status detected in public documentation: ${phrase}`)
  requireValue(!catalogText.includes(phrase), `Stale portfolio status detected in canonical catalog: ${phrase}`)
}

const primaryOrder = catalog.primaryEmployerReviewOrder ?? []
requireValue(
  JSON.stringify(primaryOrder) === JSON.stringify(['buildworld-ai', 'processharbor', 'weavestudio']),
  `primaryEmployerReviewOrder is not canonical: ${JSON.stringify(primaryOrder)}`,
)

if (failures.length > 0) {
  console.error('Portfolio status validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Portfolio status validation passed.')
