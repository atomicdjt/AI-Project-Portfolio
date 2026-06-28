# Methodology

RedactReady Pro uses deterministic local analysis to help users prepare document packets for safer sharing.

## Detection

The sensitive information engine uses pattern matching for common risky fields:

- email addresses;
- phone numbers;
- SSN-style values;
- date-of-birth labels;
- street-address-like text;
- case, claim, account, member, employer, client, medical record, and government ID-like values;
- URLs and IP addresses;
- payment-card-like numeric sequences;
- signature and QR/barcode text indicators.

Each finding includes type, matched text, character offsets, severity, confidence, explanation, and suggested redaction label.

## Classification

Document classification is heuristic. It checks for category-specific language and reports confidence plus reasoning. Categories include employment, health, benefits, legal/admin, financial, correspondence, identity, portfolio evidence, application packets, and unknown/mixed.

## HRI Score

The Human Risk Intelligence Score evaluates six categories:

- Privacy Exposure: amount and severity of sensitive data.
- Administrative Risk: unclear structure, short context, and classification uncertainty.
- Identity Risk: identifiers that may increase misuse risk.
- Context Risk: missing purpose, dates, or supporting explanation.
- Sharing Readiness: whether the packet appears safer and clearer after redaction.
- Evidence Strength: whether documents support a stated purpose with enough structure.

## Ethical Boundary

The system does not decide eligibility, diagnose health issues, provide legal strategy, verify financial status, or replace a professional. It flags, organizes, summarizes, and prepares information so the user can make safer sharing decisions.
