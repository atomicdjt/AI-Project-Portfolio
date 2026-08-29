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

test('accepts an authoritative deployment API response with matching production metadata', () => {
  const evidence = createDeploymentProvenanceEvidence({
    deployment,
    expectedSourceSha,
    expectedTarget: 'production',
    canonicalUrl: 'https://portfolio.example.com/',
    deploymentUrl: 'https://portfolio.example.vercel.app',
  });

  assert.deepEqual(evidence, {
    schemaVersion: 1,
    project: 'ai-project-portfolio-portfolio-hub',
    deploymentId: 'dpl_example',
    deploymentUrl: 'https://portfolio.example.vercel.app',
    target: 'production',
    expectedTarget: 'production',
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
    expectedTarget: 'preview',
    deploymentUrl: 'https://portfolio.example.vercel.app',
  });

  assert.equal(evidence.smokeUrl, 'https://portfolio.example.vercel.app');
});

test('does not treat a vercel inspect-like response without metadata as authoritative provenance evidence', () => {
  assert.throws(
    () => createDeploymentProvenanceEvidence({
      deployment: { id: 'dpl_example', name: deployment.name, target: 'production', readyState: 'READY' },
      expectedSourceSha,
      expectedTarget: 'production',
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
      expectedTarget: 'production',
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
      expectedTarget: 'production',
      canonicalUrl: 'https://portfolio.example.com/',
      deploymentUrl: 'https://portfolio.example.vercel.app',
    }),
    /must be READY/i,
  );
});

test('rejects a deployment for an unexpected target', () => {
  assert.throws(
    () => createDeploymentProvenanceEvidence({
      deployment: { ...deployment, target: 'preview' },
      expectedSourceSha,
      expectedTarget: 'production',
      canonicalUrl: 'https://portfolio.example.com/',
      deploymentUrl: 'https://portfolio.example.vercel.app',
    }),
    /target/i,
  );
});
