const fs = require('fs');
const path = require('path');

const dir = 'release/RedactReady_Local_Founding_Source_License';

const docs = {
  'README.md': '# RedactReady Local - Offline Portable Web Package\n\nTo run: Serve this folder with any local web server, or open index.html (some features may require a local server to avoid CORS).',
  'BUYER_GUIDE.md': '# Buyer Guide\n\nRedactReady Local is an early-access, assistive privacy tool running locally in the browser.\n\n### What it does\nHelps identify sensitive text and allows manual redaction.\n\n### What it doesn\'t do\nDoes not guarantee complete sanitization or legal compliance.',
  'COMMERCIAL_LICENSE.md': '# Commercial License\n\nThis license grants you the right to use RedactReady Local internally.\n\nNo resale, no distribution. No liability assumed by the creators.',
  'SUPPORT_POLICY.md': '# Support Policy\n\nSupport is provided on a best-effort basis for the founding early-access phase. No guaranteed SLAs.',
  'ROADMAP.md': '# Roadmap\n\n1. Enhanced desktop wrappers (Tauri)\n2. Advanced local ML models for custom entity detection\n3. Better PDF flattening tools',
  'CHANGELOG.md': '# Changelog\n\n## v1.0.0-early-access\n- Initial commercial release\n- Paste workflows\n- Synthetic testing corpus\n- Local-first architecture',
  'PRODUCT_PAGE_COPY.md': '# Product Page Copy\n\n**Redact Before You Upload.**\nA local-first privacy review tool. Keep your sensitive data on your machine.',
  'OUTREACH_COPY.md': '# Outreach Copy\n\nHey [Name],\nSharing files with AI tools? Check out RedactReady Local, a tool that runs entirely in your browser to help you sanitize documents before uploading.',
  'SCREENSHOT_SHOT_LIST.md': '# Screenshot Shot List\n\n1. Landing page with synthetic samples.\n2. Paste workflow in action.\n3. Redaction workspace highlighting an email.\n4. Export Verification panel with all groups visible.',
  'LAUNCH_CHECKLIST.md': '# Launch Checklist\n\n- [ ] Update README\n- [ ] Build offline bundle\n- [ ] Take screenshots\n- [ ] Publish to Gumroad/Stripe'
};

for (const [filename, content] of Object.entries(docs)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('Docs created.');
