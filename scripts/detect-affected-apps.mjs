import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const supportedDeploymentModes = new Set(['affected', 'manual'])

const normalizePath = (value) => String(value ?? '')
  .replaceAll('\\', '/')
  .replace(/^\.\//, '')
  .replace(/\/{2,}/g, '/')
  .replace(/\/$/, '')

const matchesPattern = (filePath, pattern) => {
  const file = normalizePath(filePath)
  const candidate = normalizePath(pattern)

  if (!candidate) return false
  if (candidate.endsWith('/**')) {
    const prefix = candidate.slice(0, -3)
    return file === prefix || file.startsWith(`${prefix}/`)
  }

  return file === candidate
}

export const validateManifest = (manifest) => {
  if (!manifest || typeof manifest !== 'object') {
    throw new TypeError('Deployment manifest must be an object')
  }
  if (manifest.schemaVersion !== 1) {
    throw new Error('Deployment manifest schemaVersion must be 1')
  }
  if (!Array.isArray(manifest.projects) || manifest.projects.length === 0) {
    throw new Error('Deployment manifest must contain projects')
  }
  if (!Array.isArray(manifest.globalAffectingPaths)) {
    throw new Error('Deployment manifest globalAffectingPaths must be an array')
  }
  if (!Array.isArray(manifest.ignoredPaths)) {
    throw new Error('Deployment manifest ignoredPaths must be an array')
  }

  const ids = new Set()
  const roots = new Set()

  for (const project of manifest.projects) {
    if (!project || typeof project !== 'object') {
      throw new Error('Every deployment project must be an object')
    }

    const id = normalizePath(project.id)
    const projectPath = normalizePath(project.path)

    if (!id) throw new Error('Every deployment project requires an id')
    if (ids.has(id)) throw new Error(`Duplicate project id: ${id}`)
    ids.add(id)

    if (!projectPath) throw new Error(`Deployment project ${id} requires a path`)
    if (roots.has(projectPath)) throw new Error(`Duplicate project path: ${projectPath}`)
    roots.add(projectPath)

    if (!supportedDeploymentModes.has(project.deploymentMode)) {
      throw new Error(`Unsupported deployment mode for ${id}: ${project.deploymentMode}`)
    }

    if (!Array.isArray(project.sharedPaths)) {
      throw new Error(`Deployment project ${id} sharedPaths must be an array`)
    }
  }

  return manifest
}

export const selectAffectedProjects = ({ changedFiles, manifest }) => {
  validateManifest(manifest)

  if (!Array.isArray(changedFiles)) {
    throw new TypeError('changedFiles must be an array')
  }

  const files = [...new Set(changedFiles.map(normalizePath).filter(Boolean))]
  const hasGlobalChange = files.some((file) =>
    manifest.globalAffectingPaths.some((pattern) => matchesPattern(file, pattern)),
  )

  if (hasGlobalChange) {
    return {
      deploy: manifest.projects
        .filter((project) => project.deploymentMode === 'affected')
        .map((project) => project.id)
        .sort(),
      manual: [],
      reason: 'global-build-input-changed',
      changedFiles: files,
    }
  }

  const deploy = new Set()
  const manual = new Set()

  for (const file of files) {
    if (manifest.ignoredPaths.some((pattern) => matchesPattern(file, pattern))) {
      continue
    }

    for (const project of manifest.projects) {
      const patterns = [`${normalizePath(project.path)}/**`, ...project.sharedPaths]
      if (!patterns.some((pattern) => matchesPattern(file, pattern))) continue

      if (project.deploymentMode === 'manual') manual.add(project.id)
      else deploy.add(project.id)
    }
  }

  const deployList = [...deploy].sort()
  const manualList = [...manual].sort()

  let reason = 'no-deployable-projects-affected'
  if (deployList.length > 0) reason = 'projects-affected'
  else if (manualList.length > 0) reason = 'manual-projects-require-dispatch'

  return {
    deploy: deployList,
    manual: manualList,
    reason,
    changedFiles: files,
  }
}

export const selectRequestedProjects = ({ requestedProjectIds, manifest }) => {
  validateManifest(manifest)

  if (!Array.isArray(requestedProjectIds)) {
    throw new TypeError('requestedProjectIds must be an array')
  }

  const requested = [...new Set(requestedProjectIds.map(normalizePath).filter(Boolean))]
  const projectsById = new Map(manifest.projects.map((project) => [project.id, project]))
  const deploy = []
  const manual = []

  for (const projectId of requested) {
    const project = projectsById.get(projectId)
    if (!project) throw new Error(`Unknown deployment project: ${projectId}`)
    if (project.deploymentMode === 'manual') manual.push(projectId)
    else deploy.push(projectId)
  }

  const deployList = deploy.sort()
  const manualList = manual.sort()

  let reason = 'no-deployable-projects-affected'
  if (deployList.length > 0) reason = 'explicit-project-request'
  else if (manualList.length > 0) reason = 'manual-projects-require-dispatch'

  return {
    deploy: deployList,
    manual: manualList,
    reason,
    changedFiles: [],
  }
}

const parseArguments = (argv) => {
  const options = {}
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (!argument.startsWith('--')) continue
    const key = argument.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`)
    options[key] = value
    index += 1
  }
  return options
}

const writeGithubOutput = (outputPath, key, value) => {
  if (!outputPath) return
  fs.appendFileSync(outputPath, `${key}=${JSON.stringify(value)}\n`, 'utf8')
}

const runCli = () => {
  const options = parseArguments(process.argv.slice(2))
  if (!options.manifest) throw new Error('--manifest is required')

  const manifestPath = path.resolve(options.manifest)
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

  let result
  if (options.project) {
    result = selectRequestedProjects({
      requestedProjectIds: options.project.split(','),
      manifest,
    })
  } else {
    if (!options['files-from']) throw new Error('--files-from is required when --project is not provided')
    const filesPath = path.resolve(options['files-from'])
    const changedFiles = fs.readFileSync(filesPath, 'utf8').split(/\r?\n/)
    result = selectAffectedProjects({ changedFiles, manifest })
  }

  const selectedProjects = manifest.projects.filter((project) => result.deploy.includes(project.id))

  const output = {
    ...result,
    matrix: {
      include: selectedProjects,
    },
  }

  const githubOutput = options['github-output'] || process.env.GITHUB_OUTPUT
  writeGithubOutput(githubOutput, 'deploy', output.deploy)
  writeGithubOutput(githubOutput, 'manual', output.manual)
  writeGithubOutput(githubOutput, 'reason', output.reason)
  writeGithubOutput(githubOutput, 'matrix', output.matrix)
  writeGithubOutput(githubOutput, 'has-deployments', output.deploy.length > 0)

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`)
}

const isDirectExecution = process.argv[1]
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])

if (isDirectExecution) {
  try {
    runCli()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
