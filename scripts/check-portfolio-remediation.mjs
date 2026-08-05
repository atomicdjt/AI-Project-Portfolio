import { readFile } from 'node:fs/promises';

const profile = JSON.parse(await readFile(new URL('../portfolio/professional-profile.json', import.meta.url), 'utf8'));
const app = await readFile(new URL('../apps/portfolio-hub/src/App.jsx', import.meta.url), 'utf8');
const expectedIds = ['processharbor', 'redactready', 'weavestudio', 'quoteforge-local', 'buildworld-ai'];

if (JSON.stringify(profile.flagshipProjectIds) !== JSON.stringify(expectedIds)) {
  throw new Error('Professional profile flagshipProjectIds must contain the approved five-flagship hierarchy in order.');
}

if (!app.includes("const flagshipNames = ['ProcessHarbor', 'RedactReady', 'WeaveStudio', 'QuoteForge Local', 'BuildWorld AI'];")) {
  throw new Error('Portfolio Hub flagship list does not match the approved five-flagship hierarchy.');
}

if (!app.includes("caseStudy: 'https://weavestudio-nine.vercel.app/acquire'")) {
  throw new Error('Portfolio Hub must use the canonical WeaveStudio acquisition URL.');
}

if (app.includes("caseStudy: 'https://weavestudio-demo.vercel.app/acquire'")) {
  throw new Error('Portfolio Hub still uses the legacy WeaveStudio acquisition URL.');
}

console.log('Portfolio remediation consistency checks passed.');
