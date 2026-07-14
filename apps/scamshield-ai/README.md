# ScamShield AI

ScamShield AI is a local-first public-interest cybersecurity and consumer-protection web app. It helps people identify possible scam risk signals, preserve suspicious messages and file references, organize an evidence timeline, choose safer next steps, find official reporting channels, and export a professional PDF evidence packet. The MVP runs entirely in the browser with deterministic TypeScript rules and requires no account, backend, API key, or database.

## Deployment Status

ScamShield AI is source-backed and configured for Vercel through `vercel.json`. A production Vercel alias is not claimed until a preview and production deployment are verified.

## Problem Statement

People targeted by fraud often receive urgent, frightening, or emotionally manipulative requests when they have the least time and context to evaluate them. Evidence becomes scattered across texts, emails, screenshots, payment records, and notes. Existing advice is frequently fragmented, technically dense, or difficult for a caregiver to apply. ScamShield AI provides a calm, structured workflow that emphasizes pausing, preserving evidence, verifying independently, and reporting through official channels.

## Target Users

- Seniors and people with low technical literacy
- Disabled adults and people who benefit from plain-language guidance
- Low-income users facing high-impact fraud attempts
- Family members, caregivers, and trusted advocates
- Community nonprofits and consumer-protection organizations
- Financial counselors and digital-literacy educators

## Key Features

- Five-step case workflow: start, evidence, assessment, timeline/actions, reporting/export
- Rule-based detection for urgency, fear, secrecy, risky payments, credential requests, impersonation, suspicious URL text, romance manipulation, job scams, and invoice compromise
- Transparent `0-100` scoring using published severity weights
- Plain-language mode and caregiver mode
- Local screenshot/image preview and PDF filename capture without server upload
- Sensitive-data warnings for possible SSNs, payment cards, passwords, authentication codes, and private keys
- Lightweight extraction of emails, phone numbers, URLs, money amounts, dates, deadlines, and reference labels
- Editable suggested evidence timeline
- Situation-aware safe-action checklist with print layout
- Maintained official reporting-resource configuration
- Professional multi-page PDF evidence packet generated in the browser
- Five clearly synthetic demo cases
- Versioned localStorage persistence and one-action clearing
- Responsive, keyboard-accessible, high-contrast interface

## Safety Boundaries

ScamShield AI is defensive and educational only.

- It reports possible indicators and never claims that a person, message, company, or website is definitively fraudulent.
- It does not provide legal, financial, investigative, or law-enforcement advice.
- It does not crawl, open, submit to, or interact with suspicious websites.
- It does not help users confront, trace, dox, bait, hack, expose, or retaliate against anyone.
- It does not request passwords, authentication codes, private keys, full account numbers, or full Social Security numbers.
- It directs users to independently verified official websites, known phone numbers, cards, statements, or trusted contacts.
- If money may be at risk, it prioritizes immediate contact with the bank or payment provider using official contact information.

## Privacy Model

- Evidence analysis runs in the browser.
- No application backend, database, analytics service, or telemetry is included.
- The application does not require runtime network requests for its standard workflow.
- Case state is stored in browser localStorage so work can survive a refresh.
- Temporary image preview URLs are not written to localStorage.
- Uploaded files are not embedded in the exported report; filenames and entered evidence text are included.
- Users should clear the case before leaving a shared device and store exported reports carefully.
- A production deployment should preserve a restrictive Content Security Policy and verify it on Vercel before promotion.

## Tech Stack

- React 19 and TypeScript
- Vite
- Zustand
- Lucide React
- jsPDF
- Vitest and Testing Library
- Playwright
- ESLint
- Vercel SPA configuration

## Run Locally

Requirements: Node.js 22 or newer and npm.

```powershell
cd apps/scamshield-ai
npm install
npm run dev
```

Open `http://127.0.0.1:5178/`.

## Quality Commands

```powershell
npm run lint
npm run typecheck
npm run test -- --run
npm run build
npm run e2e
```

The production output is written to `dist/`.

## Deploy to Vercel

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

```text
Project name: scamshield-ai
Root Directory: apps/scamshield-ai
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Branch: main
Node.js: 22
```

No environment variables are required.

Use a preview deployment first. Verify:

1. the landing page and all five workflow steps,
2. each synthetic demo case,
3. assessment scoring and explanation,
4. timeline and action editing,
5. PDF export,
6. refresh persistence and clear-data behavior,
7. direct-route refresh and static assets,
8. browser console and accessibility basics,
9. production security headers and CSP.

Promote only after Vercel reports the deployment as `READY` and the browser smoke workflow succeeds.

## Demo Cases

1. Bank account locked phishing text
2. Romance emergency request
3. Fake job equipment check
4. Tech support remote-access scam
5. Invoice payment change scam

All samples are synthetic and clearly marked as demonstration data.

## Limitations

- Rule-based analysis can miss context, novel wording, images without manually entered text, and multilingual content.
- A low score does not prove that a request is legitimate.
- URL checks analyze text only and do not perform reputation, DNS, WHOIS, certificate, or live-site checks.
- Image OCR and PDF text extraction are not included in this MVP; users can manually enter visible text.
- LocalStorage is device- and browser-specific and is not encrypted by the app.
- Reporting resources are U.S.-oriented and must be maintained as agencies update their public sites.
- Exported PDFs can contain sensitive information and are not encrypted.

## Future Roadmap

See [ROADMAP.md](./ROADMAP.md) for phased OCR, multilingual, institutional, privacy-preserving AI, extension, mobile, and verified-resource integration work.

## Grant and Funding Positioning

> ScamShield AI is a public-interest cybersecurity and consumer-protection tool designed to help vulnerable users safely identify, document, and report suspected fraud. The MVP emphasizes privacy-preserving local analysis, plain-language digital literacy, caregiver support, and structured evidence packets that can be shared with trusted institutions. The project is designed for future evaluation with seniors, disability advocates, community nonprofits, financial counselors, and consumer-protection organizations.

The project is suitable for pilots focused on digital literacy, aging and disability services, consumer financial protection, community cybersecurity, and accessible civic technology.

## Evaluation Plan

The full grant-ready plan is in [EVALUATION.md](./EVALUATION.md). It covers synthetic detection accuracy, false positives, comprehension, packet-creation time, confidence, caregiver usability, accessibility, privacy, expert review, and partner feedback.

## Screenshots

![ScamShield AI landing page](./docs/screenshots/scamshield-desktop-chromium-landing.png)

![ScamShield AI risk assessment](./docs/screenshots/scamshield-desktop-chromium-assessment.png)

Verified desktop and mobile captures are stored under `docs/screenshots/` for portfolio and grant materials.

## Security

Read [SECURITY.md](./SECURITY.md) for policy and [docs/SECURITY_REVIEW.md](./docs/SECURITY_REVIEW.md) for the release review evidence and residual risks.

## Disclaimer

ScamShield AI provides educational risk signals and organizational tools. It does not make a final fraud determination and does not replace advice from a bank, payment provider, attorney, financial professional, law-enforcement agency, government agency, or qualified support organization.