import assert from 'node:assert/strict';
import test from 'node:test';

import { fetchVercelDeployment, getVercelDeploymentApiUrl } from '../get-vercel-deployment.mjs';

test('normalizes a deployment URL to a scoped Vercel deployment API request', () => {
  assert.equal(
    getVercelDeploymentApiUrl({
      deploymentUrl: 'https://portfolio-example.vercel.app/path?ignored=true',
      teamSlug: 'atomicdjts-projects',
    }),
    'https://api.vercel.com/v13/deployments/portfolio-example.vercel.app?teamSlug=atomicdjts-projects',
  );
});

test('returns an authenticated deployment API response with metadata', async () => {
  const deployment = { id: 'dpl_example', meta: { source_sha: '0123456789abcdef0123456789abcdef01234567' } };
  let request;
  const result = await fetchVercelDeployment({
    deploymentUrl: 'portfolio-example.vercel.app',
    teamSlug: 'atomicdjts-projects',
    token: 'test-token',
    fetchImplementation: async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => deployment };
    },
  });

  assert.deepEqual(result, deployment);
  assert.equal(request.url, 'https://api.vercel.com/v13/deployments/portfolio-example.vercel.app?teamSlug=atomicdjts-projects');
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
});

test('fails closed when the authoritative deployment API request fails', async () => {
  await assert.rejects(
    () => fetchVercelDeployment({
      deploymentUrl: 'portfolio-example.vercel.app',
      teamSlug: 'atomicdjts-projects',
      token: 'test-token',
      fetchImplementation: async () => ({ ok: false, status: 403 }),
    }),
    /403/,
  );
});
