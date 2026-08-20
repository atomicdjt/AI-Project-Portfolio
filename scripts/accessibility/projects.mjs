import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const flagshipIds = [
  'portfolio-hub',
  'processharbor',
  'redactready-pro',
  'layerforge-studio',
  'scamshield-ai',
  'variantvision-pro',
]

const flowById = {
  'portfolio-hub': 'entry -> project discovery -> technical evidence link',
  processharbor: 'SOP Builder -> source/intake -> generation -> reviewable document state',
  'redactready-pro': 'input/sample -> sensitive-data analysis -> evidence/risk review -> report state',
  'layerforge-studio': 'open editor -> meaningful layer/tool state -> inspect/export path',
  'scamshield-ai': 'suspicious-content input -> analysis -> risk/explanation -> action/reference state',
  'variantvision-pro': 'variant selection/input -> evidence interpretation -> source/status review',
}

const configPath = fileURLToPath(new URL('../../config/vercel-projects.json', import.meta.url))
const targetsPath = fileURLToPath(new URL('../../docs/accessibility/PRODUCTION_TARGETS.json', import.meta.url))

export function loadFlagshipProjects() {
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const targets = JSON.parse(readFileSync(targetsPath, 'utf8'))
  const projectById = new Map(config.projects.map((project) => [project.id, project]))

  return flagshipIds.map((id) => {
    const project = projectById.get(id)
    const target = targets.projects?.[id]
    if (!project) throw new Error(`Missing canonical project configuration for ${id}`)
    if (!String(project.currentStatus ?? '').startsWith('active')) throw new Error(`Flagship project ${id} is not active`)
    if (!project.productionUrl || !project.productionUrl.startsWith('https://')) throw new Error(`Flagship project ${id} lacks a canonical HTTPS production URL`)
    if (!target) throw new Error(`Missing provider-verified production target for ${id}`)
    if (target.productionUrl !== project.productionUrl) throw new Error(`Production URL provenance mismatch for ${id}`)
    if (!/^dpl_[A-Za-z0-9]+$/.test(target.deploymentId ?? '')) throw new Error(`Invalid production deployment id for ${id}`)
    if (!/^[0-9a-f]{40}$/.test(target.sourceSha ?? '')) throw new Error(`Invalid production source SHA for ${id}`)
    if (target.state !== 'READY' || target.target !== 'production') throw new Error(`Production target for ${id} is not verified READY production`)

    return {
      id,
      name: project.publicName,
      productionUrl: project.productionUrl,
      workspacePath: project.path,
      primaryFlow: flowById[id],
      productionDeploymentId: target.deploymentId,
      productionSourceSha: target.sourceSha,
      productionTargetVerifiedOn: targets.verifiedOn,
      assistiveTechnologyStatus: 'not yet tested with genuine screen reader',
    }
  })
}
