# Privacy

RedactReady Pro is designed as a local-first MVP.

## What Stays Local

- Pasted text is analyzed in the browser.
- `.txt` uploads are read by the browser.
- Demo packets are fictional and bundled with the app.
- No document content is sent to an external API by the MVP.
- No paid AI provider is required.

## Storage

The current implementation uses in-memory React state. Refreshing the page clears the active packet unless a future storage feature is added.

If encrypted local storage is added later, it should be opt-in, clearly labeled, and include an obvious delete/reset control.

## User Responsibility

Users should manually verify every redaction and report conclusion before sharing documents. Pattern matching can miss context, overmatch harmless text, or fail to detect sensitive information that appears in unusual formats.

## Not Professional Advice

This product is not a substitute for a lawyer, doctor, benefits specialist, accountant, financial advisor, or official agency. It helps prepare and organize information; it does not make official decisions.
