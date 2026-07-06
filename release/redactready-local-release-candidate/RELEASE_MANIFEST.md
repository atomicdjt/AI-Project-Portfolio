# RedactReady Local Release Candidate

Branch: redactready-local-full-hardening-sprint
Commit: 76a85d7fe23882e6b776a391a7bd25392ee9a883
Created: 2026-07-06 06:00:12 -04:00

Included:
- apps/redactready-local source
- app package.json and package-lock.json
- public OCR assets and synthetic samples
- README, setup, limitations, verification, feature status, architecture, case study, and manual QA docs

Excluded:
- node_modules
- dist
- .netlify
- test-results
- .env / .env.local
- preview logs and temporary files
- unrelated portfolio apps

Release caveats:
- OCR is experimental and requires manual verification.
- Metadata handling is attempted, not guaranteed.
- Browser BarcodeDetector support varies.
- Public Netlify demo may lag this branch until deployed.
