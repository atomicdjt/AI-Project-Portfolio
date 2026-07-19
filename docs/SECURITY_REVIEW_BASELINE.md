# Deployment Security Review Baseline

This baseline defines the minimum review expected before a public portfolio application is described as security-reviewed. It does not constitute a penetration test, certification, or guarantee of security.

## Review scope

For each maintained public deployment, record:

- application and canonical URL;
- source repository, branch, and commit;
- hosting project and deployment target;
- data stored locally, sent remotely, or exported;
- authentication and authorization model, including when none exists;
- third-party services and scripts;
- intended embedding behavior;
- verification date and reviewer;
- unresolved findings.

## HTTP and browser controls

Review applicability and behavior of:

- Content-Security-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- frame-ancestors or X-Frame-Options;
- Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy where appropriate;
- CORS;
- cache controls;
- secure cookie flags where cookies exist.

Controls must match product behavior. An iframe product must not receive a blanket anti-framing policy that disables its documented workflow.

## Application controls

Review:

- input validation and output encoding;
- dangerous HTML or Markdown rendering;
- file-size and file-type limits;
- parser failure handling;
- object-URL cleanup and memory pressure;
- formula, CSV, and spreadsheet injection on export;
- untrusted filename handling;
- path and URL construction;
- secrets and environment-variable exposure;
- dependency and supply-chain risk;
- logs and error-message leakage;
- destructive-action confirmation and recovery;
- persistence boundaries and reset behavior;
- API request consent and destination visibility;
- prompt-injection handling where AI features process external content.

## Local-first claims

A local-first claim must identify:

- what remains in the browser;
- what is stored in localStorage, IndexedDB, memory, or downloaded files;
- what leaves the device when optional services are used;
- whether clearing browser data removes persisted work;
- whether exports may contain sensitive information;
- which functions require network access.

## Verification evidence

Acceptable evidence may include:

- source review with named files and trust boundaries;
- automated tests for validation and sanitization;
- dependency audit results with date and tool version;
- browser network inspection;
- response-header capture;
- abuse-case tests;
- CSP violation checks;
- issue links and regression tests for corrected findings.

A successful build or absence of Vercel runtime errors is not sufficient security evidence.

## Finding severity

- **Critical:** likely compromise, secret exposure, destructive data loss, or severe privacy breach.
- **High:** exploitable trust-boundary failure or material sensitive-data exposure.
- **Medium:** meaningful weakness requiring correction but constrained in impact or exploitability.
- **Low:** defense-in-depth, hardening, or limited information-disclosure issue.
- **Informational:** documented design choice or improvement opportunity.

## Portfolio-specific cautions

- **BuildWorld:** preserve its restrictive header posture while confirming required assets and exports continue to function.
- **WeaveStudio:** verify provider keys remain tab-memory only, consent is action-specific, imported content cannot silently alter instructions, and exports exclude credentials.
- **QuoteForge:** scope framing policy by route because calculator embeds are intentional; protect dashboard and administrative surfaces from unintended framing where possible.
- **RedactReady family:** test that exported redactions are irreversible in the output format and that original sensitive content is not retained in hidden layers or metadata.
- **ProcessHarbor:** keep the static deterministic deployment clearly separated from documented server or provider extensions.

## Claim rule

Use “security-reviewed” only with a dated record of scope, methods, findings, and unresolved risks. Use “security-hardened” only when relevant findings have been corrected and retested. Never use “secure” as an absolute claim.