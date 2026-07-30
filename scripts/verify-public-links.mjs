const targets = [
  ['Portfolio Hub', 'https://ai-project-portfolio-portfolio-hub.vercel.app/', 'David Turner | Applied AI & Technical Operations'],
  ['BuildWorld AI', 'https://buildworld-ai-v01-improvements.vercel.app/', 'BuildWorld AI | Visual Systems Simulation Lab'],
  ['ProcessHarbor', 'https://ai-project-portfolio-opspilot-ai-op.vercel.app/', 'ProcessHarbor Pro | Operations Documentation Toolkit'],
  ['WeaveStudio', 'https://weavestudio-nine.vercel.app/', 'WeaveStudio | Local-First Workflow Canvas'],
  ['QuoteForge Local', 'https://quoteforge-local.vercel.app/', 'White-Label Quote Calculators for Agencies'],
];
const titlePattern = /<title[^>]*>([^<]*)<\/title>/i;
let failed = false;
for (const [name, url, expectedTitle] of targets) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15_000) });
    const title = (await response.text()).match(titlePattern)?.[1]?.trim();
    const valid = response.ok && title === expectedTitle;
    console.log(`${valid ? 'PASS' : 'FAIL'} ${name}: ${response.status} — ${title ?? 'missing title'}`);
    if (!valid) failed = true;
  } catch (error) { failed = true; console.error(`FAIL ${name}: ${error.message}`); }
}
if (failed) process.exitCode = 1;
