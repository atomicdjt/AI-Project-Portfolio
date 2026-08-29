import assert from 'node:assert/strict';
import test from 'node:test';

import { createDeploymentProvenanceEvidence } from '../verify-vercel-deployment-provenance.mjs';

const expectedSourceSha = '0123456789abcdef0123456789abcdef01234567';

const deployment = {
  id: 'dpl_example',
  name: 'ai-project-portfolio-portfolio-hub',
  target: 'production',
  readyState: 'READY',
  url: 'portfolio.example.vercel.app',
  meta: { source_sha: expectedSourceSha },
};

test('records matching production provenance with the canonical smoke URL', () => {
  const evidence = createDeploymentProvenanceEvidence({
    deployment,
    expectedSourceSha,
    canonicalUrl: 'https://portfolio.example.com/',
    deploymentUrl: 'https://portfolio.example.vercel.app',
  });

  assert.deepEqual(evidence, {
    schemaVersion: 1,
    project: 'ai-project-portfolio-portfolio-hub',
    deploymentId: 'dpl_example',
    deploymentUrl: 'https://portfolio.example.vercel.app',
    target: 'production',
    readyState: 'READY',
    expectedSourceSha,
    deployedSourceSha: expectedSourceSha,
    smokeUrl: 'https://portfolio.example.com/',
  });
});

test('uses the unique deployment URL for preview provenance', () => {
  const evidence = createDeploymentProvenanceEvidence({
    deployment: { ...deployment, target: 'preview' },
    expectedSourceSha,
    deploymentUrl: 'https://portfolio.example.vercel.app',
  });

  assert.equal(evidence.smokeUrl, 'https://portfolio.example.vercel.app');
});

test('rejects a missing deployment source SHA', () => {
  assert.throws(
    () => createDeploymentProvenanceEvidence({
      deployment: { ...deployment, meta: {} },
      expectedSourceSha,
      deploymentUrl: 'https://portfolio.example.vercel.app',
    }),
    /source SHA/i,
  );
});

test('rejects a deployment source SHA mismatch', () => {
  assert.throws(
    () => createDeploymentProvenanceEvidence({
      deployment: { ...deployment, meta: { source_sha: 'fedcba9876543210fedcba9876543210fedcba98' } },
      expectedSourceSha,
      deploymentUrl: 'https://portfolio.example.vercel.app',
    }),
    /does not match/i,
  );
});

test('rejects a deployment that is not ready', () => {
  assert.throws(
    () => createDeploymentProvenanceEvidence({
      deployment: { ...deployment, readyState: 'ERROR' },
      expectedSourceSha,
      canonicalUrl: 'https://portfolio.example.com/',
      deploymentUrl: 'https://portfolio.example.vercel.app',
    }),
    /must be READY/i,
  );
});
