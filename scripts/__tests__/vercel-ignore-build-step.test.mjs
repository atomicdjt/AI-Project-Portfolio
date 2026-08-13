import test from 'node:test'
import assert from 'node:assert/strict'

import { decideIgnoredBuild, selectComparisonBase } from '../vercel-ignore-build-step.mjs'

const manifest = {
  schemaVersion: 1,
  globalAffectingPaths: ['package.json', 'package-lock.json', 'config/vercel-projects.json'],
  ignoredPaths: ['docs/**', '.github/**'],
  projects: [
    {
      id: 'scamshield-ai',
      path: 'apps/scamshield-ai',
      deploymentMode: 'affected',
      sharedPaths: ['packages/safety-copy/**'],
    },
    {
      id: 'portfolio-hub',
      path: 'apps/portfolio-hub',
      deploymentMode: 'affected',
      sharedPaths: ['packages/safety-copy/**'],
    },
    {
      id: 'focusforge',
      path: 'apps/focusforge',
      deploymentMode: 'affected',
      sharedPaths: [],
    },
  ],
}

const decide = (projectId, changedFiles) => decideIgnoredBuild({
  projectId,
  previousSha: 'base',
  currentSha: 'head',
  manifest,
  changedFiles,
})

test('production deployments always build', () => {
  const decision = decideIgnoredBuild({
    projectId: 'scamshield-ai',
    environment: 'production',
    previousSha: 'base',
    currentSha: 'head',
    manifest,
    changedFiles: ['docs/verification.md'],
  })

  assert.equal(decision.shouldBuild, true)
  assert.equal(decision.ignored, false)
  assert.equal(decision.reason, 'Production deployments always build.')
})

test('uses the current commit parent when Vercel omits the previous SHA', () => {
  assert.equal(
    selectComparisonBase({ previousSha: undefined, currentSha: 'abc123' }),
    'abc123^',
  )
  assert.equal(
    selectComparisonBase({ previousSha: 'def456', currentSha: 'abc123' }),
    'def456',
  )
})

test('an app-only change builds that app and skips unrelated apps', () => {
  assert.equal(decide('scamshield-ai', ['apps/scamshield-ai/src/App.tsx']).shouldBuild, true)
  assert.equal(decide('portfolio-hub', ['apps/scamshield-ai/src/App.tsx']).ignored, true)
})

test('Portfolio Hub changes build only Portfolio Hub', () => {
  assert.equal(decide('portfolio-hub', ['apps/portfolio-hub/src/App.jsx']).shouldBuild, true)
  assert.equal(decide('focusforge', ['apps/portfolio-hub/src/App.jsx']).ignored, true)
})

test('root dependency changes build every affected project', () => {
  for (const projectId of ['scamshield-ai', 'portfolio-hub', 'focusforge']) {
    assert.equal(decide(projectId, ['package-lock.json']).shouldBuild, true)
  }
})

test('a shared path builds only its declared consumers', () => {
  const files = ['packages/safety-copy/advice.ts']
  assert.equal(decide('scamshield-ai', files).shouldBuild, true)
  assert.equal(decide('portfolio-hub', files).shouldBuild, true)
  assert.equal(decide('focusforge', files).ignored, true)
})

test('documentation-only changes skip application previews', () => {
  assert.equal(decide('scamshield-ai', ['docs/verification.md']).ignored, true)
})

test('a workspace-scoped Dependabot update skips unrelated projects', () => {
  const files = ['apps/focusforge/package-lock.json']
  assert.equal(decide('focusforge', files).shouldBuild, true)
  assert.equal(decide('scamshield-ai', files).ignored, true)
  assert.equal(decide('portfolio-hub', files).ignored, true)
})
