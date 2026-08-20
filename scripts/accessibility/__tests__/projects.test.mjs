import assert from 'node:assert/strict'
import test from 'node:test'
import { loadFlagshipProjects } from '../projects.mjs'

const expectedIds = [
  'portfolio-hub',
  'processharbor',
  'redactready-pro',
  'layerforge-studio',
  'scamshield-ai',
  'variantvision-pro',
]

test('flagship registry is canonical, ordered, and claim-safe', () => {
  const projects = loadFlagshipProjects()

  assert.deepEqual(
    projects.map((project) => project.id),
    expectedIds,
  )

  for (const project of projects) {
    assert.ok(project.productionUrl.startsWith('https://'), `${project.id} must use a canonical HTTPS production URL`)
    assert.equal(project.assistiveTechnologyStatus, 'not yet tested with genuine screen reader')
  }
})
