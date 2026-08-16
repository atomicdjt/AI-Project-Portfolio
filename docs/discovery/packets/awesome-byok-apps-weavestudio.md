# Awesome BYOK Apps submission packet — WeaveStudio

Checked: 2026-08-16
Target: `yatsyk/awesome-byok-apps`
Proposed section: **Agents and workflow builders**

## Fit

WeaveStudio is live and actively maintained. Its core workflow is local-first and does not require AI. Optional AI Assist lets the user supply their own OpenAI or Gemini API key in the browser. Requests are consent-gated per action and generated output requires human review before application.

This proposal must explicitly disclose that David Turner / `atomicdjt` is the project author. Do not imply that local-first storage means provider-assisted requests remain local: when the user approves an AI Assist request, the displayed prompt/context may be sent directly to the selected provider.

## Proposed list entry

```markdown
- [WeaveStudio](https://weavestudio-nine.vercel.app/) — Local-first workflow canvas with optional BYOK OpenAI and Gemini assistance.
```

The description is factual, under 100 characters after the dash, and avoids marketing adjectives.

## PR disclosure / evidence

> Disclosure: I am the author of WeaveStudio (`atomicdjt`).
>
> Live URL: https://weavestudio-nine.vercel.app/
>
> Repository: https://github.com/atomicdjt/weavestudio
>
> How keys are supplied: the user chooses OpenAI or Gemini in the AI Assist interface and supplies their own provider key. Keys are held only in volatile tab memory and are not stored in `localStorage` or project exports.
>
> Providers: OpenAI and Google Gemini.
>
> Maintenance: the public repository and hosted application are actively maintained in 2026.
>
> Boundary: AI Assist is optional; approved requests may send the displayed prompt/context to the selected provider. The normal non-AI workflow remains browser-local.

## Submission state

**Packet ready — not submitted.** The target repository requires an upstream pull request. Current connected GitHub tooling has read-only upstream access and no fork-creation action, so do not misrecord this as submitted.
