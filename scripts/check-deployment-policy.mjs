import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const primaryFiles = [
  'README.md',
  'docs/github-profile/README.md',
  'docs/recruiter-quick-review.md',
  'docs/EMPLOYER_OVERVIEW.md',
  'docs/PROJECT_INDEX.md',
  'docs/project-ranking.md',
  'docs/deployment-and-previews.md',
  'docs/verification.md',
  'docs/public-portfolio-audit-2026-07-14.md',
  'docs/VERCEL_DEPLOYMENT.md',
  'apps/portfolio-hub/src/App.jsx',
  'apps/buildworld-ai/README.md',
  'apps/buildworld-ai/DEPLOYMENT.md',
  'apps/redactready-pro-hri-os/README.md',
  'apps/opspilot-ai-operations-toolkit/README.md',
  'apps/opspilot-ai-operations-toolkit/docs/DEPLOYMENT.md',
  'apps/scamshield-ai/README.md',
  'apps/redactready-local/README.md',
  'apps/layerforge-studio/README.md',
  'apps/focusforge/README.md',
  'apps/variantvision-pro/README.md',
  'projects/buildworld-ai/CASE_STUDY.md',
  'projects/redactready-pro-hri-os/CASE_STUDY.md',
  'projects/opspilot-ai-operations-toolkit/CASE_STUDY.md',
  'projects/scamshield-ai/CASE_STUDY.md',
  'projects/redactready-local/CASE_STUDY.md',
  'projects/layerforge-studio/CASE_STUDY.md',
  'projects/focusforge/CASE_STUDY.md',
  'projects/variantvision-pro/CASE_STUDY.md',
];

const prohibited = [
  { label: 'Netlify production URL', pattern: /https?:\/\/[^\s)\]}>]*\.netlify\.app\/?/gi },
  { label: 'Netlify CLI deployment command', pattern: /\bnetlify\s+deploy\b/gi },
  { label: 'active Netlify deployment heading', pattern: /#{1,6}\s+deploy(?:ment)?\s+(?:to\s+)?netlify\b/gi },
  { label: 'GitHub Pages production URL', pattern: /https?:\/\/atomicdjt\.github\.io\/AI-Project-Portfolio[^\s)\]}>]*/gi },
  { label: 'GitHub Pages deployment action', pattern: /actions\/(?:deploy-pages|upload-pages-artifact|configure-pages)@/gi },
  { label: 'GitHub Pages publish branch', pattern: /\bgh-pages\b/gi },
];

const problems = [];

for (const relativePath of primaryFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    problems.push(`${relativePath}: required primary file is missing`);
    continue;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const { label, pattern } of prohibited) {
    pattern.lastIndex = 0;
    const matches = [...content.matchAll(pattern)];
    for (const match of matches) {
      const line = content.slice(0, match.index).split('\n').length;
      problems.push(`${relativePath}:${line}: ${label}: ${match[0]}`);
    }
  }
}

if (problems.length > 0) {
  console.error('Vercel-only deployment policy violations found:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Checked Vercel-only deployment policy in ${primaryFiles.length} primary files.`);
