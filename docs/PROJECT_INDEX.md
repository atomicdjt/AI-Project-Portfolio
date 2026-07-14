# Project Index

This index records public names, source authority, implementation status, Vercel deployment status, and the best reason to review each project. It avoids applying one universal ranking across employer, technical, research, and buyer audiences.

## Status and Authority Legend

- **Live on Vercel** — Vercel reports a production deployment and the core route has been verified.
- **Vercel Pending** — source and migration configuration are present, but no verified production Vercel alias is claimed.
- **Portfolio workspace** — runnable source is present under `apps/` in this repository.
- **Separate authoritative repository** — current product development and release evidence are maintained in another repository.
- **Local-only** — runnable source is present, but the architecture requires additional backend or Vercel Functions work.
- **Documentation-first** — case study or specification exists without a maintained runnable workspace.
- **Commercial / Acquisition asset** — packaged for sale, licensing, or transfer; does not imply verified traction.

## Employer-Facing Applications

| Public name | Deployment status | Repository authority | Best evidence |
| --- | --- | --- | --- |
| [BuildWorld AI](https://github.com/atomicdjt/buildworld-ai) | [Live on Vercel](https://buildworld-ai-v01-improvements.vercel.app/) | Separate authoritative repository, `main` | Graph simulation, deterministic engines, cascade analysis, multi-seed reproducibility, SSI scoring, variants, local persistence, reports, tests, and architecture documentation. |
| [RedactReady Pro](../projects/redactready-pro-hri-os/CASE_STUDY.md) | Vercel Pending | `apps/redactready-pro-hri-os` | Local-first document intelligence, sensitive-information detection, HRI scoring, evidence mapping, redaction, reports, tests, and responsible-use boundaries. |
| [ProcessHarbor](../projects/opspilot-ai-operations-toolkit/CASE_STUDY.md) | Vercel Pending | `apps/opspilot-ai-operations-toolkit` | SOP, onboarding, knowledge-base, gap-report, versioning, validation, export, and technical-operations workflow evidence. |
| [ScamShield AI](../projects/scamshield-ai/CASE_STUDY.md) | Vercel Pending | `apps/scamshield-ai` | Explainable local risk review, evidence organization, safer next steps, official reporting resources, accessibility, tests, and PDF export. |
| [RedactReady](../projects/redactready-local/CASE_STUDY.md) | Vercel Pending | `apps/redactready-local` | PDF/image/text/CSV review, detector confirmation, manual redaction, flattened output, and verification-oriented workflow design. |
| [LayerForge Studio](../projects/layerforge-studio/CASE_STUDY.md) | Vercel Pending | `apps/layerforge-studio` | Canvas rendering, layered raster state, tools, filters, history commands, IndexedDB persistence, and export. |
| [FocusForge](../projects/focusforge/CASE_STUDY.md) | Vercel Pending | `apps/focusforge` | Stateful product loop, local persistence, game-rule testing, responsive UI, and Vercel-ready static build. |
| [VariantVision Pro](../projects/variantvision-pro/CASE_STUDY.md) | Vercel Pending | `apps/variantvision-pro` | Educational bioinformatics evidence review, source provenance, comparison tools, scoring, and non-diagnostic reporting. |
| [Astra](../projects/astra/CASE_STUDY.md) | Local-only | `apps/astra` | React/Express AI workspace, model configuration, visible key states, Markdown rendering, streaming workflow, and transcript export. Requires an explicit Vercel Functions or backend design. |
| [Nexus Play](../projects/nexus-play/CASE_STUDY.md) | Local-only | `apps/nexus-play` | Storefront, cart, wishlist, simulated checkout, owned-library state, install-queue concepts, and product-state modeling. Requires an explicit Vercel backend design. |

## Products and Acquisition Assets

| Product | Status | Repository authority | Vercel surface | Best evidence |
| --- | --- | --- | --- | --- |
| [WeaveStudio](https://github.com/atomicdjt/weavestudio) | Acquisition-ready asset | Separate authoritative repository, `master` | [Demo](https://weavestudio-demo.vercel.app/) · [Acquisition overview](https://weavestudio-demo.vercel.app/acquire) | Consolidated default branch, local-first visual workflow canvas, undo/redo, data portability, exports, browser and unit validation, buyer transfer materials, and consent-gated OpenAI/Gemini assistance. |
| QuoteForge Local | Shipped commercial package | Private separate repository, `main` | [Demo](https://quoteforge-local.vercel.app/) · [Product page](https://payhip.com/b/24De9) | Ten templates, typed quote engine, local demo leads, CSV export, branding, embed and WordPress paths, licensing, buyer docs, QA, and release packaging. |

No customer, revenue, active-user, purchase, or completed-acquisition claim is implied by these status labels.

## Documentation-First and Research Projects

| Project | Status | Category | Best evidence |
| --- | --- | --- | --- |
| [AI Knowledge Operations Toolkit](../projects/ai-knowledge-operations-toolkit/CASE_STUDY.md) | Concept / product specification | Operations AI | Strong employer relevance for support operations, documentation, enablement, training, and knowledge management. |
| [Amino Acid Research Workbench](../projects/amino-acid-research-workbench/CASE_STUDY.md) | Documentation-first | Bioinformatics education | Explainable scientific workflow and responsible educational framing; no current Vercel deployment is claimed. |
| [Ecology of Consciousness](../projects/ecology-of-consciousness/CASE_STUDY.md) | Research framework | Digital cognitive environments | Original interdisciplinary model, structured audit concepts, and research-synthesis evidence. |
| [IHOS](../projects/ihos-integrated-human-operating-system/CASE_STUDY.md) | Research and self-governance framework | Non-clinical personal systems | Systems thinking, practical structure, ethics boundaries, and workbook/facilitation potential. |
| [FrameEcho](../projects/frameecho/CASE_STUDY.md) | Technical product concept | Duplicate-video discovery | Clear utility, algorithmic framing, file-system workflow design, and product requirements. |

## Supplemental Concepts

| Project | Current status | Repository interpretation |
| --- | --- | --- |
| Amino Acid Research Workbench | No current Vercel deployment | Case study exists; no local `apps/` workspace. |
| GardenGrid | No current Vercel deployment | Source is not present in this repository. |
| HearthLink | No current Vercel deployment | Source is not present in this repository. |

Legacy non-Vercel URLs are not used as current portfolio routes.

## Recommended Review by Audience

- **Employer:** BuildWorld AI → RedactReady Pro → ProcessHarbor → verification documentation.
- **Buyer or commercial partner:** WeaveStudio → QuoteForge Local → source-authority and transfer documentation.
- **Technical reviewer:** BuildWorld AI → RedactReady family → LayerForge Studio → VariantVision Pro.
- **Research reviewer:** VariantVision Pro → Amino Acid Workbench → Ecology of Consciousness → IHOS.
- **Deployment reviewer:** [Vercel Deployment Plan](VERCEL_DEPLOYMENT.md) → [Deployment and Source-Authority Map](deployment-and-previews.md).

See [Contextual Project Rankings](project-ranking.md) for the reasoning behind the audience-specific review paths.