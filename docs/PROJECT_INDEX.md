# Project Index

This index records public names, source authority, implementation status, deployment status, and the best reason to review each project. It intentionally avoids one universal ranking because employer, technical, research, and buyer audiences evaluate different evidence.

**Status verified:** July 19, 2026. Deployment availability reflects the connected Vercel account at that time; a `READY` deployment is not a claim that every browser interaction was independently retested.

The canonical machine-readable authority record is [`config/portfolio-authority.json`](../config/portfolio-authority.json). The separate [`config/vercel-projects.json`](../config/vercel-projects.json) remains the deployment-selection configuration and must not be treated as the public-status authority.

## Status and Authority Legend

- **Live on Vercel** — a production Vercel deployment and public alias were observed.
- **Portfolio workspace** — runnable source is present under `apps/` in this repository.
- **Separate authoritative repository** — current product development and release evidence are maintained in another repository.
- **Local-only** — runnable source is present, but the architecture requires additional backend or Vercel Functions work.
- **Documentation-first** — case study or specification exists without a maintained runnable workspace in this repository.
- **Legacy preserved deployment** — a public deployment is retained, but current editable source authority is incomplete or outside this repository.
- **Commercial / acquisition asset** — packaged for sale, licensing, or transfer; this does not imply verified traction.

## Employer-Facing Applications

| Public name | Deployment status | Repository authority | Best evidence |
| --- | --- | --- | --- |
| [Portfolio Hub](https://ai-project-portfolio-portfolio-hub.vercel.app/) | Live on Vercel | `apps/portfolio-hub` | Employer-first navigation, project filtering, evidence routes, demos, and case studies. |
| [BuildWorld AI](https://buildworld-ai-v01-improvements.vercel.app/) | Public Vercel deployment; production-target governance requires final Vercel confirmation | [Separate authoritative repository, `main`](https://github.com/atomicdjt/buildworld-ai) | Graph simulation, deterministic engines, cascade analysis, multi-seed reproducibility, SSI scoring, variants, local persistence, reports, tests, and architecture documentation. |
| [RedactReady Pro](https://ai-project-portfolio-redactready-pr.vercel.app/) | Live on Vercel | `apps/redactready-pro-hri-os` | Local-first document intelligence, sensitive-information detection, HRI scoring, evidence mapping, redaction, reports, tests, and responsible-use boundaries. |
| [ProcessHarbor](https://ai-project-portfolio-opspilot-ai-op.vercel.app/) | Live on Vercel — deterministic static workflow | `apps/opspilot-ai-operations-toolkit` | SOP, onboarding, knowledge-base, gap-report, versioning, validation, export, and technical-operations workflow evidence. Reference server endpoints remain documented extension work. |
| [ScamShield AI](https://ai-project-portfolio-scamshield-ai.vercel.app/) | Live on Vercel | `apps/scamshield-ai` | Explainable local risk review, evidence organization, safer next steps, official reporting resources, accessibility, tests, and PDF export. |
| [RedactReady](https://ai-project-portfolio-redactready-lo.vercel.app/) | Live on Vercel | `apps/redactready-local` | PDF/image/text/CSV review, detector confirmation, manual redaction, flattened output, and verification-oriented workflow design. |
| [LayerForge Studio](https://ai-project-portfolio-layerforge-stu.vercel.app/) | Live on Vercel | `apps/layerforge-studio` | Canvas rendering, layered raster state, tools, filters, history commands, IndexedDB persistence, and export. |
| [FocusForge](https://ai-project-portfolio-focusforge.vercel.app/) | Live on Vercel | `apps/focusforge` | Stateful product loop, local persistence, game-rule testing, responsive UI, and static Vercel deployment. |
| [VariantVision Pro](https://ai-project-portfolio-variantvision.vercel.app/) | Live on Vercel | `apps/variantvision-pro` | Educational bioinformatics evidence review, source provenance, comparison tools, scoring, and non-diagnostic reporting. |
| [Astra](../projects/astra/CASE_STUDY.md) | Local-only | `apps/astra` | React/Express AI workspace, model configuration, visible key states, Markdown rendering, streaming workflow, and transcript export. Requires an explicit Vercel Functions or backend design. |
| [Nexus Play](../projects/nexus-play/CASE_STUDY.md) | Local-only | `apps/nexus-play` | Storefront, cart, wishlist, simulated checkout, owned-library state, install-queue concepts, and product-state modeling. Requires an explicit Vercel backend design. |

## Products and Acquisition Assets

| Product | Status | Repository authority | Vercel surface | Best evidence |
| --- | --- | --- | --- | --- |
| [WeaveStudio](https://github.com/atomicdjt/weavestudio) | Acquisition-ready asset | Separate authoritative repository, `main` | [Canonical demo](https://weavestudio-nine.vercel.app/) · [Acquisition overview](https://weavestudio-nine.vercel.app/acquire) | Consolidated default branch, local-first visual workflow canvas, undo/redo, data portability, exports, browser and unit validation, buyer transfer materials, and consent-gated OpenAI/Gemini assistance. |
| QuoteForge Local | Shipped commercial package | Private separate repository, `main` | [Canonical demo](https://quoteforge-local.vercel.app/) · [Product page](https://payhip.com/b/24De9) | Ten templates, typed quote engine, local demo leads, CSV export, branding, embed/WordPress paths, licensing, buyer docs, QA, and release packaging. |

No customer, revenue, active-user, purchase, or completed-acquisition claim is implied by these status labels.

## Documentation-First and Research Projects

| Project | Status | Category | Best evidence |
| --- | --- | --- | --- |
| [AI Knowledge Operations Toolkit](../projects/ai-knowledge-operations-toolkit/CASE_STUDY.md) | Concept / product specification | Operations AI | Strong employer relevance for support operations, documentation, enablement, training, and knowledge management. |
| [Amino Acid Research Workbench](../projects/amino-acid-research-workbench/CASE_STUDY.md) | Documentation-first with a preserved public Vercel deployment | Bioinformatics education | Explainable scientific workflow and responsible educational framing; editable source authority is not maintained as a current `apps/` workspace. |
| [Ecology of Consciousness](../projects/ecology-of-consciousness/CASE_STUDY.md) | Research framework | Digital cognitive environments | Original interdisciplinary model, structured audit concepts, and research-synthesis evidence. |
| [IHOS](../projects/ihos-integrated-human-operating-system/CASE_STUDY.md) | Research and self-governance framework | Non-clinical personal systems | Systems thinking, practical structure, ethics boundaries, and workbook/facilitation potential. |
| [FrameEcho](../projects/frameecho/CASE_STUDY.md) | Technical product concept | Duplicate-video discovery | Clear utility, algorithmic framing, file-system workflow design, and product requirements. |

## Supplemental and Preserved Work

| Project | Current status | Repository interpretation |
| --- | --- | --- |
| [GardenGrid](https://ai-project-portfolio-garden-grid.vercel.app/) | Public Vercel deployment | Source-backed in this repository; controlled manual deployment while Vercel Git attachment remains an operational follow-up. |
| [Amino Acid Research Workbench](https://ai-project-portfolio-amino-workbenc.vercel.app/) | Legacy preserved public deployment | Case study exists; no current `apps/` workspace is claimed. |
| [HearthLink](https://ai-project-portfolio-hearthlink.vercel.app/) | Legacy preserved public deployment | Source authority is incomplete in this repository; the deployment should be treated as a preserved demonstration, not a flagship maintained product. |
| [Mnemosyne](https://mnemosyne-vercel-preview.vercel.app/) | Experimental public deployment | Source attachment and formal portfolio positioning remain unverified; excluded from flagship review paths. |

Legacy non-Vercel URLs are not used as current portfolio routes.

## Recommended Review by Audience

- **Employer:** Portfolio Hub → BuildWorld AI → ProcessHarbor → WeaveStudio → RedactReady Pro → verification documentation.
- **Buyer or commercial partner:** WeaveStudio → QuoteForge Local → source-authority and transfer documentation.
- **Technical reviewer:** BuildWorld AI → RedactReady family → LayerForge Studio → VariantVision Pro.
- **Research reviewer:** VariantVision Pro → Amino Acid Workbench → Ecology of Consciousness → IHOS.
- **Deployment reviewer:** [Vercel Deployment Record](VERCEL_DEPLOYMENT.md) → [Deployment and Source-Authority Map](deployment-and-previews.md).

See [Contextual Project Rankings](project-ranking.md) for the reasoning behind the audience-specific review paths.