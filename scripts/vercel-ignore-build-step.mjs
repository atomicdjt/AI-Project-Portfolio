import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import {
  selectAffectedProjects,
  selectRequestedProjects,
  validateManifest,
} from './detect-affected-apps.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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

export const decideIgnoredBuild = ({
  projectId,
  environment = 'preview',
  previousSha,
  currentSha = 'HEAD',
  manifest,
  changedFiles,
}) => {
  validateManifest(manifest)
  selectRequestedProjects({ requestedProjectIds: [projectId], manifest })

  if (environment === 'production') {
    return {
      projectId,
      environment,
      previousSha,
      currentSha,
      shouldBuild: true,
      ignored: false,
      reason: 'Production deployments always build.',
      changedFiles: changedFiles ?? [],
      affectedProjects: [projectId],
      manualProjects: [],
    }
  }

  const result = selectAffectedProjects({ changedFiles, manifest })
  const shouldBuild = result.deploy.includes(projectId)

  return {
    projectId,
    environment,
    previousSha,
    currentSha,
    shouldBuild,
    ignored: !shouldBuild,
    reason: result.reason,
    changedFiles: result.changedFiles,
    affectedProjects: result.deploy,
    manualProjects: result.manual,
  }
}

const readChangedFiles = ({ previousSha, currentSha }) => {
  if (!previousSha) throw new Error('VERCEL_GIT_PREVIOUS_SHA is unavailable')

  const output = execFileSync(
    'git',
    ['diff', '--name-only', previousSha, currentSha],
    { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )

  return output.split(/\r?\n/).filter(Boolean)
}

const runCli = () => {
  const options = parseArguments(process.argv.slice(2))
  if (!options.project) throw new Error('--project is required')

  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'config/vercel-projects.json'), 'utf8'),
  )
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA
  const currentSha = process.env.VERCEL_GIT_COMMIT_SHA || 'HEAD'
  const changedFiles = readChangedFiles({ previousSha, currentSha })
  const decision = decideIgnoredBuild({
    projectId: options.project,
    environment: process.env.VERCEL_ENV || 'preview',
    previousSha,
    currentSha,
    manifest,
    changedFiles,
  })

  process.stdout.write(`${JSON.stringify(decision, null, 2)}\n`)
  process.exitCode = decision.shouldBuild ? 1 : 0
}

const isDirectExecution = process.argv[1]
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])

if (isDirectExecution) {
  try {
    runCli()
  } catch (error) {
    console.error(`Conservative build fallback: ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}
