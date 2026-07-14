import fs from 'node:fs';

const appPath = 'apps/portfolio-hub/src/App.jsx';
const deployments = [
  ['redactready-pro-hri-os', 'https://ai-project-portfolio-redactready-pr.vercel.app/'],
  ['opspilot-ai-operations-toolkit', 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/'],
  ['scamshield-ai', 'https://ai-project-portfolio-scamshield-ai.vercel.app/'],
  ['redactready-local', 'https://ai-project-portfolio-redactready-lo.vercel.app/'],
  ['layerforge-studio', 'https://ai-project-portfolio-layerforge-stu.vercel.app/'],
  ['focusforge', 'https://ai-project-portfolio-focusforge.vercel.app/'],
  ['variantvision-pro', 'https://ai-project-portfolio-variantvision.vercel.app/'],
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let source = fs.readFileSync(appPath, 'utf8');

for (const [name, url] of deployments) {
  const pattern = new RegExp(
    `(name: '${escapeRegex(name)}',[\\s\\S]*?status:\\s*)'Vercel Pending'([\\s\\S]*?demo:\\s*)null`,
  );

  if (!pattern.test(source)) {
    throw new Error(`Could not locate the pending deployment record for ${name}`);
  }

  source = source.replace(pattern, `$1'Live'$2'${url}'`);
}

const evidenceReplacements = [
  ['Vercel project creation remains pending.', 'Live Vercel production route verified.'],
  ['Vercel deployment remains pending.', 'Live Vercel production route verified.'],
];

for (const [from, to] of evidenceReplacements) {
  source = source.replaceAll(from, to);
}

if (source.includes("status: 'Vercel Pending'")) {
  throw new Error('One or more Vercel Pending records remain in the Portfolio Hub.');
}

fs.writeFileSync(appPath, source);
console.log(`Updated ${deployments.length} Portfolio Hub deployment records.`);
