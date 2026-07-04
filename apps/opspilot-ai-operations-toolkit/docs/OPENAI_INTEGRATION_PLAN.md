# OpenAI Integration Notes

ProcessHarbor keeps the local deterministic drafting engine as the default path so the project is easy to run, review, and deploy without secrets. The app also includes an optional server-side OpenAI reference adapter at `/api/aiGenerate`.

## Implemented Shape

```text
React app
  -> POST /api/aiGenerate
      -> validates intake
      -> checks server-only AI env vars
      -> calls OpenAI Responses API only when enabled/configured
      -> validates strict JSON output with Zod
      -> falls back to deterministic generation on any disabled/error/invalid state
      -> saves the document and audit event in the seeded reference repository
```

## API Contract

Input should match the existing `IntakeState` type:

- business
- role
- department
- documentType
- priority
- sourceNotes

Output should match the existing `OpsDocument` type:

- generated document body
- SOP steps
- training checklist
- knowledge base articles
- gap findings
- quality score
- risk level
- version entry
- generation diagnostics

## Security Notes

- Never expose API keys in the browser.
- Keep model calls in a serverless function or backend API route.
- Validate and bound input length before sending to the model.
- Validate model output before saving.
- Fall back to deterministic output when output validation fails.
- Return sanitized diagnostics only; never return secrets.
- Continue storing audit logs for create, update, publish, export, training, gap, and version events.
- Keep organization data isolated by tenant.

## Environment Variables

```text
PROCESSHARBOR_AI_ENABLED=true
OPENAI_API_KEY=server-side OpenAI key
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional. Missing or false `PROCESSHARBOR_AI_ENABLED` keeps deterministic mode. Missing `OPENAI_API_KEY` also keeps deterministic fallback.

## Prompting Notes

The model is instructed to return strict JSON matching the app schema. The server validates the response before saving or returning it to the client. The prompt requires plain text, practical operations guidance, owner/timing fields, quality checks, escalation, review cadence, and no legal/medical/compliance overclaims.

## Remaining Production Work

- Replace seeded in-memory state with a durable database adapter.
- Derive workspace session and role from a real identity provider.
- Add tenant-level usage limits, logging retention, and admin model controls.
- Add eval fixtures for model quality across industries before treating AI output as production-ready.
