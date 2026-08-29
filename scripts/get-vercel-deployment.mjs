import { writeFileSync } from 'node:fs';

const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
};

export function getVercelDeploymentApiUrl({ deploymentUrl, slug }) {
  const value = requiredString(deploymentUrl, 'Deployment URL');
  const normalizedUrl = new URL(value.includes('://') ? value : `https://${value}`);
  const hostname = requiredString(normalizedUrl.hostname, 'Deployment hostname');
  const url = new URL(`https://api.vercel.com/v13/deployments/${encodeURIComponent(hostname)}`);
  url.searchParams.set('slug', requiredString(slug, 'Vercel team slug'));
  return url.toString();
}

export async function fetchVercelDeployment({ deploymentUrl, slug, token, fetchImplementation = fetch }) {
  const response = await fetchImplementation(getVercelDeploymentApiUrl({ deploymentUrl, slug }), {
    headers: { Authorization: `Bearer ${requiredString(token, 'Vercel token')}` },
  });

  if (!response.ok) throw new Error(`Vercel deployment API request failed with status ${response.status}.`);
  return response.json();
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
  const deployment = await fetchVercelDeployment({
    deploymentUrl: options['deployment-url'],
    slug: options.slug,
    token: process.env.VERCEL_TOKEN,
  });
  writeFileSync(requiredString(options.output, 'Deployment output'), `${JSON.stringify(deployment, null, 2)}\n`);
}
