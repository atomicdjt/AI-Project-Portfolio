# ScamShield AI

## Overview

ScamShield AI is a local-first public-interest cybersecurity and consumer-protection application. It helps a person or trusted caregiver review a suspicious message, document evidence, understand possible risk signals, build an incident timeline, choose safer next steps, find official reporting channels, and export a professional PDF evidence packet.

- [Live demo](https://scamshield-ai-safety.netlify.app/)
- [Application source](../../apps/scamshield-ai)

## Problem

Fraud attempts are designed to create urgency, fear, secrecy, confusion, or emotional pressure. People targeted by scams often need to make decisions while evidence is scattered across messages, screenshots, payment records, phone calls, and notes. Generic advice can be difficult to apply, especially for seniors, disabled adults, caregivers, and people with limited technical confidence.

ScamShield AI turns that stressful situation into a calm, structured workflow. The product does not declare that a person or message is fraudulent. It identifies possible indicators, explains why they matter, and directs the user toward independent verification and official support.

## Product Workflow

1. Start a case or load one of five clearly synthetic demonstrations.
2. Enter suspicious text and optional contextual details or local file references.
3. Review a transparent `0-100` risk assessment and plain-language red flags.
4. Organize an editable evidence timeline and situation-aware safety checklist.
5. Review official reporting resources and export a multi-page PDF evidence packet.

Plain-language mode reduces technical terminology. Caregiver mode reframes actions for a trusted person helping someone else. Case state persists in versioned browser localStorage and can be cleared in one action.

## Technical Implementation

- React 19, TypeScript, and Vite
- Zustand for structured case state
- Deterministic TypeScript pattern analysis with published severity weights
- Local entity extraction for emails, phone numbers, URLs, money amounts, dates, deadlines, and references
- jsPDF evidence-packet generation in the browser
- Vitest, Testing Library, and Playwright validation
- Netlify static deployment with strict security headers and no runtime network access

The application has no backend, account system, API key, analytics service, telemetry, or database. Netlify's Content Security Policy uses `connect-src 'none'`, so the deployed app cannot make runtime network requests.

## Safety and Privacy Decisions

- Analysis is educational and explicitly avoids definitive fraud claims.
- Suspicious links are treated as text; the app never opens, crawls, submits to, or interacts with them.
- The interface warns against entering passwords, authentication codes, private keys, complete payment-card numbers, or full Social Security numbers.
- Uploaded images remain local previews. Files are not uploaded or embedded in reports.
- Official reporting links are maintained as configuration and users are told to verify destinations independently.
- If money may be at risk, the workflow prioritizes contacting a bank or payment provider through known official contact information.

## Quality Evidence

The release was validated with:

- ESLint
- TypeScript project checking
- 18 automated unit and workflow tests across 12 test files
- Production Vite build
- Two Playwright end-to-end projects covering desktop and mobile workflows
- Real browser PDF download verification
- Dependency audit with zero known vulnerabilities at release time
- Desktop and mobile screenshot captures
- Public Netlify deployment verification

## Screenshots

![ScamShield AI landing page](../../docs/images/scamshield-landing.png)

![ScamShield AI assessment workspace](../../docs/images/scamshield-assessment.png)

## Portfolio Value

ScamShield AI demonstrates end-to-end product execution across problem definition, accessibility, consumer safety, explainable rule-based analysis, privacy architecture, structured state, report generation, testing, security review, documentation, and production deployment. It is designed as a credible public-interest MVP with clear limitations rather than an automated authority on fraud.
