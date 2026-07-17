import test from 'node:test'
import assert from 'node:assert/strict'

import { selectAffectedProjects, validateManifest } from '../detect-affected-apps.mjs'

const manifest = {
  schemaVersion: 1,
  globalAffectingPaths: [
    'package.json',
    'package-lock.json',
    'config/vercel-projects.json',
  ],
  ignoredPaths: [
    'docs/**',
    '.github/**',
  ],
  projects: [
    {
      id: 'portfolio-hub',
      path: 'apps/portfolio-hub',
      deploymentMode: 'affected',
      sharedPaths: ['apps/portfolio-hub/**'],
    },
    {
      id: 'layerforge-studio',
      path: 'apps/layerforge-studio',
      deploymentMode: 'affected',
      sharedPaths: [],
    },
    {
      id: 'garden-grid',
      path: 'apps/garden-grid-planner',
      deploymentMode: 'affected',
      sharedPaths: [],
    },
    {
      id: 'amino-workbench-legacy',
      path: 'apps/amino-acid-workbench-legacy',
      deploymentMode: 'manual',
      sharedPaths: [],
    },
  ],
}

test('documentation-only changes do not select application deployments', () => {
  const result = selectAffectedProjects({
    changedFiles: ['README.md', 'docs/verification.md'],
    manifest,
  })

  assert.deepEqual(result.deploy, [])
  assert.deepEqual(result.manual, [])
  assert.equal(result.reason, 'no-deployable-projects-affected')
})

test('an application-only change selects exactly that application', () => {
  const result = selectAffectedProjects({
    changedFiles: ['apps/layerforge-studio/src/engine/history.ts'],
    manifest,
  })

  assert.deepEqual(result.deploy, ['layerforge-studio'])
  assert.deepEqual(result.manual, [])
})

test('a shared root dependency change selects every affected-mode project', () => {
  const result = selectAffectedProjects({
    changedFiles: ['package-lock.json'],
    manifest,
  })

  assert.deepEqual(result.deploy, [
    'garden-grid',
    'layerforge-studio',
    'portfolio-hub',
  ])
  assert.deepEqual(result.manual, [])
  assert.equal(result.reason, 'global-build-input-changed')
})

test('manual legacy artifacts are reported but never automatically deployed', () => {
  const result = selectAffectedProjects({
    changedFiles: ['apps/amino-acid-workbench-legacy/index.html'],
    manifest,
  })

  assert.deepEqual(result.deploy, [])
  assert.deepEqual(result.manual, ['amino-workbench-legacy'])
  assert.equal(result.reason, 'manual-projects-require-dispatch')
})

test('shared project paths can select a project without matching its root directory', () => {
  const result = selectAffectedProjects({
    changedFiles: ['apps/portfolio-hub/content/projects.json'],
    manifest,
  })

  assert.deepEqual(result.deploy, ['portfolio-hub'])
})

test('duplicate changed paths do not duplicate selected projects', () => {
  const result = selectAffectedProjects({
    changedFiles: [
      'apps/layerforge-studio/src/App.tsx',
      'apps/layerforge-studio/src/App.tsx',
      'apps/layerforge-studio/src/engine/render.ts',
    ],
    manifest,
  })

  assert.deepEqual(result.deploy, ['layerforge-studio'])
})

test('manifest validation rejects duplicate project identifiers', () => {
  assert.throws(
    () => validateManifest({
      ...manifest,
      projects: [manifest.projects[0], manifest.projects[0]],
    }),
    /duplicate project id/i,
  )
})

test('manifest validation rejects unsupported deployment modes', () => {
  assert.throws(
    () => validateManifest({
      ...manifest,
      projects: [{
        ...manifest.projects[0],
        deploymentMode: 'always',
      }],
    }),
    /unsupported deployment mode/i,
  )
})
