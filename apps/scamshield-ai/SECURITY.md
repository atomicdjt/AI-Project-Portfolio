# Security Policy

## Defensive Purpose

ScamShield AI is a defensive education and evidence-organization tool. It identifies possible risk signals in user-provided text and metadata and recommends verification through trusted official channels.

## Explicitly Unsupported Uses

- Scam, phishing, impersonation, or fraud automation
- Retaliation, confrontation, harassment, or baiting workflows
- Hacking, tracing, doxxing, deanonymization, or exposure of suspected actors
- Active scanning, crawling, form submission, credential testing, or interaction with suspicious websites
- Credential, authentication-code, private-key, full account-number, or full Social Security number collection
- Final determinations that a person, message, company, website, or payment request is fraudulent

## Local-First Data Handling

- The MVP has no backend, account system, database, analytics, or telemetry.
- Analysis and PDF generation run in the browser.
- Case state may be stored in localStorage on the current device.
- Temporary image preview object URLs are kept in memory and are not intentionally persisted.
- Uploaded file contents are not embedded into localStorage or the evidence packet.
- The Netlify Content Security Policy uses `connect-src 'none'` to block application network connections.

## Sensitive Data

The interface warns users to remove passwords, authentication codes, private keys, full payment-card/account numbers, and Social Security numbers. Pattern-based warnings are a safety aid and cannot identify every sensitive value. Users remain responsible for minimizing evidence and protecting exported reports.

## Suspicious Links

ScamShield parses URL text only. It does not fetch, preview, resolve, redirect through, submit to, or otherwise interact with the entered destination. Official reporting resources are maintained separately in `src/data/reportingResources.ts`.

## Dependency and Build Review

Before release:

```powershell
npm audit
npm run lint
npm run typecheck
npm run test -- --run
npm run build
npm run e2e
```

Review production dependencies, generated `dist/` contents, Netlify headers, and browser network activity.

## Responsible Disclosure

Do not include sensitive evidence in a vulnerability report. Until a dedicated security address is established, open a private repository security advisory or contact the project maintainer through a verified repository profile. This placeholder does not imply continuous monitoring or a guaranteed response time.

## Reporting a Real Scam

Do not use the project security channel to report a personal scam incident. Use the official resources presented in the application and contact affected financial or government institutions through independently verified contact information.
