# RedactReady Pro / Human Risk Intelligence OS

RedactReady Pro is a privacy-first, local-first document intelligence MVP for reviewing messy document packets before sharing. It detects sensitive information, classifies document risk, generates a Human Risk Intelligence Score, builds an evidence map, creates an action checklist, and produces a professional report without requiring a backend or paid AI API.

## Deployment Status

The application is source-backed and configured for Vercel through `vercel.json`. A production Vercel alias is not claimed until the project is created, Vercel reports a ready deployment, and the core workflow is verified.

## Key Features

- Dashboard with HRI Score, category breakdowns, sensitive findings, evidence preview, and checklist status.
- Intake Center for pasted text, `.txt` uploads, manual notes, and fictional demo packets.
- Deterministic local detection for emails, phones, SSN-style values, DOB labels, addresses, case IDs, account/member IDs, medical record markers, URLs, IPs, government ID-like values, signatures, and QR/barcode mentions.
- Redaction Studio with per-finding toggles, maximum privacy mode, copy, and `.txt` download.
- Evidence Map that connects documents to support level, snippets, missing information, and possible contradictions.
- Report Builder for a Human Risk Intelligence Report with copy, Markdown download, and browser print-to-PDF.
- Methodology page explaining privacy posture, scoring model, limitations, and ethical boundaries.

## Screenshots

QA screenshots are included for portfolio review:

- `docs/screenshots/redactready-pro-dashboard.png`
- `docs/screenshots/redactready-pro-mobile.png`

## Local Setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. The app is browser-only and stores the current packet in memory for the session.

The default local port is `http://127.0.0.1:5181/`.

## Build And Test

```bash
npm run test
npm run build
```

## Vercel Deployment

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with Root Directory `apps/redactready-pro-hri-os`, Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`, and Production Branch `main`.

Use a preview deployment first. Verify source intake, demo packets, findings, redaction toggles, report export, direct-route refresh, static assets, and browser console before assigning a production alias.

## Demo Mode

Use the Demo page to load fictional sample packets:

- Job Application Packet
- Benefits / Administrative Packet
- Privacy Leak Audit

All demo content is fictional and intended only to show product behavior.

## Privacy Note

The MVP performs deterministic analysis in the browser. It does not send document content to a server, does not require a paid external API, and does not persist sensitive documents unless future storage features are explicitly added.

Users should still manually verify redactions before sharing any document.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS runtime import plus custom CSS
- Lucide icons
- Vitest for pure logic tests
- Vercel SPA configuration

## Limitations

RedactReady Pro does not provide legal, medical, financial, government-benefits, accounting, or official agency advice. It organizes, detects, summarizes, flags, redacts, and prepares documents, but it does not make official determinations.

PDF and image uploads currently create explicit fallback records. For full analysis of those files, users should paste extracted text or OCR output. OCR, richer PDF parsing, and image-based QR/signature detection are roadmap items.

## Portfolio Positioning

This project is designed as a flagship applied privacy/product-engineering case study: a polished local-first workflow, an original HRI scoring model, deterministic privacy safeguards, exportable reporting, and Vercel-ready static architecture.

See [CASE_STUDY.md](./CASE_STUDY.md), [METHODOLOGY.md](./METHODOLOGY.md), [PRIVACY.md](./PRIVACY.md), and [ROADMAP.md](./ROADMAP.md).