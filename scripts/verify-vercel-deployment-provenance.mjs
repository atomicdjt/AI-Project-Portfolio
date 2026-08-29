import { readFileSync, writeFileSync } from 'node:fs';

const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
};

export function createDeploymentProvenanceEvidence({
  deployment,
  expectedSourceSha,
  expectedTarget,
  deploymentUrl,
  canonicalUrl,
}) {
  const expected = requiredString(expectedSourceSha, 'Expected source SHA');
  const deploymentSourceSha = deployment?.meta?.source_sha;
  const deployed = requiredString(deploymentSourceSha, 'Deployment source SHA');

  if (deployed !== expected) {
    throw new Error(`Deployment source SHA ${deployed} does not match expected source SHA ${expected}.`);
  }

  const target = deployment?.target ?? 'preview';
  const expectedDeploymentTarget = requiredString(expectedTarget, 'Expected deployment target');
  if (target !== expectedDeploymentTarget) {
    throw new Error(`Deployment target ${target} does not match expected target ${expectedDeploymentTarget}.`);
  }
  const resolvedDeploymentUrl = requiredString(deploymentUrl, 'Deployment URL');
  const readyState = requiredString(deployment?.readyState, 'Deployment ready state');

  if (readyState !== 'READY') {
    throw new Error(`Deployment ready state must be READY, received ${readyState}.`);
  }

  const smokeUrl = target === 'production'
    ? requiredString(canonicalUrl, 'Canonical production URL')
    : resolvedDeploymentUrl;

  return {
    schemaVersion: 1,
    project: requiredString(deployment?.name, 'Deployment project'),
    deploymentId: requiredString(deployment?.id, 'Deployment ID'),
    deploymentUrl: resolvedDeploymentUrl,
    target,
    expectedTarget: expectedDeploymentTarget,
    readyState,
    expectedSourceSha: expected,
    deployedSourceSha: deployed,
    smokeUrl,
  };
}

const parseArguments = (argv) => {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) continue;
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}.`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  return options;
};

if (import.meta.url === `file://${process.argv[1].replaceAll('\\', '/')}`) {
  const options = parseArguments(process.argv.slice(2));
  const deployment = JSON.parse(readFileSync(requiredString(options['deployment-file'], 'Deployment file'), 'utf8'));
  const evidence = createDeploymentProvenanceEvidence({
    deployment,
    expectedSourceSha: options['expected-source-sha'],
    expectedTarget: options['expected-target'],
    deploymentUrl: options['deployment-url'],
    canonicalUrl: options['canonical-url'],
  });
  writeFileSync(requiredString(options.output, 'Evidence output'), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence));
}
