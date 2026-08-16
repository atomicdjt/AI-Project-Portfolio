# Discoverability and GitHub Optimization Design

Date: 2026-08-16
Owner: David Turner (`atomicdjt`)
Status: Design for review

## Objective

Increase the probability that recruiters, founders, collaborators, technical reviewers, prospective customers, and search/AI discovery systems find David Turner's work, correctly understand its positioning, and have a low-friction path to contact or evaluate him.

The work should improve three surfaces together:

1. **Search and discoverability** — make public portfolio/project pages easier for search engines and external discovery systems to crawl, distinguish, and understand.
2. **High-quality external listings/backlinks** — create legitimate third-party discovery paths without spam, purchased links, fake engagement, or low-quality directory flooding.
3. **GitHub profile/repository conversion** — make search or referral visitors immediately understand the strongest projects, evidence, and contact paths.

## Constraints

- All GitHub/portfolio implementation changes use reviewable branches and pull requests. No direct commits to `main`.
- Preserve current source-authority and canonical-deployment rules.
- Do not weaken claim discipline, responsible-use language, licensing boundaries, or privacy boundaries for marketing purposes.
- Do not fabricate users, revenue, testimonials, reviews, stars, forks, traffic, press coverage, or external validation.
- Do not create accounts, bypass CAPTCHAs, or submit third-party listings under David's identity without an authorized account/action surface.
- Prefer a small number of high-quality, relevant backlinks/listings over broad low-quality directory submission.
- QuoteForge Local remains source-private unless David separately changes that policy.

## Baseline findings

### Strong existing foundations

The portfolio already has several pieces that are normally missing from early-stage personal portfolios:

- Canonical URL declarations, meta descriptions, Open Graph/Twitter metadata, structured data, `robots.txt`, and a sitemap on the Portfolio Hub.
- Search/social metadata plus crawler discovery work already landed recently for BuildWorld AI, WeaveStudio, Validation Ledger, and ProcessHarbor.
- Strong GitHub repository descriptions and relevant topic sets on flagship public repositories.
- A builder-first GitHub profile README with direct demo, repository, evidence, LinkedIn, and email paths.
- Explicit evidence/limitations language that makes the portfolio more reviewable and trustworthy.

### Remaining discovery gap

A current public-web search audit does not consistently surface David's portfolio for obvious identity/project queries. Exact and branded searches are still vulnerable to stronger pre-existing name collisions:

- `BuildWorld AI` is heavily competed by unrelated construction companies/products using the same or near-identical name.
- `WeaveStudio` is heavily competed by unrelated simulation, design, and studio properties.
- `David Turner` is a very high-collision personal name.
- Exact portfolio/project URL searches did not reliably produce first-page indexed results in the audit.

This means the main problem is no longer "missing meta tags." It is **entity differentiation, crawl/index acquisition, external corroboration, and high-quality distribution**.

## Approaches considered

### A. Metadata-only hardening

Continue adding keywords, schema, descriptions, and tags to existing pages.

**Pros:** low risk, easy to review, technically clean.

**Cons:** diminishing returns because most foundational metadata already exists. It does little to solve name collisions or lack of external authority.

### B. Aggressive rebrand/domain migration

Rename collision-prone projects and move the portfolio to a custom domain immediately.

**Pros:** strongest long-term identity differentiation and cleaner branded search footprint.

**Cons:** higher disruption, potential broken links, deployment/branding churn, and unnecessary scope for the first optimization pass. A custom domain may be valuable later, but should not block distribution work now.

### C. Layered entity + distribution optimization — recommended

Keep the current products and canonical deployments, but strengthen entity signals, project-specific search semantics, internal linking, public repository conversion, and third-party corroboration. Use differentiated descriptors such as "BuildWorld AI systems simulation" and "WeaveStudio local-first workflow canvas" consistently where appropriate.

**Pros:** addresses the actual observed gap without destabilizing working products; creates more paths for search engines and humans to associate David, `atomicdjt`, the portfolio, and the flagship projects.

**Cons:** indexing and backlink effects are not instantaneous; some high-value external listings require manual account ownership or community participation.

**Decision:** Use Approach C. Revisit a custom domain and selective naming changes only if measurement shows collisions remain a major constraint after distribution/indexing improvements.

## Design

### Workstream 1 — Portfolio entity and crawl strengthening

Target repository: `atomicdjt/AI-Project-Portfolio`

Planned changes:

- Audit Portfolio Hub route inventory and ensure all meaningful public review routes that should be indexed appear in the sitemap.
- Keep non-value/duplicate routes out of the index when appropriate rather than maximizing URL count.
- Strengthen `ProfilePage`/`Person` structured data with stable creator identifiers and explicit project relationships while avoiding unsupported claims.
- Add machine-readable project/entity context where it materially improves understanding.
- Ensure page titles/descriptions distinguish David's projects from collision-prone names by including product category/context.
- Verify canonical, Open Graph, social image, robots, sitemap, and route fallback behavior after changes.
- Add an explicit portfolio-level discovery/contact path if the current UI does not make it sufficiently visible on every high-intent review route.

### Workstream 2 — GitHub profile conversion

Target repository: `atomicdjt/atomicdjt`

Planned changes:

- Preserve the current builder-first profile structure.
- Tighten the first-screen identity statement around a repeatable entity phrase: David Turner / `atomicdjt` / practical reviewable local-first AI and technical-operations products.
- Reduce redundant prose where it competes with flagship project discovery.
- Add clearer project descriptors to collision-prone names.
- Preserve direct portfolio, five-minute review, LinkedIn, and email paths.
- Make third-party validation/discovery references additive only when they are genuine and public.

### Workstream 3 — Flagship repository discoverability

Initial targets:

- `atomicdjt/buildworld-ai`
- `atomicdjt/weavestudio`
- `atomicdjt/validation-ledger`
- relevant flagship subprojects in `atomicdjt/AI-Project-Portfolio`

Planned changes:

- Audit titles, README opening copy, social metadata, structured data, canonical URLs, project descriptors, and internal links for consistency.
- Prefer precise, intent-rich descriptors over keyword stuffing.
- Ensure each flagship has a direct creator/portfolio backlink and that the portfolio links back to the canonical project.
- Strengthen topic/category semantics where the current set is incomplete, but avoid broad generic tags that dilute relevance.
- Keep licensing and evidence boundaries visible.

### Workstream 4 — External listings and backlinks

Create a ranked distribution backlog using the following filters:

- public/indexable page;
- relevant technical/product audience;
- legitimate profile/project ownership;
- ability to link to the canonical portfolio or project;
- low spam risk;
- reasonable maintenance cost;
- alignment with the project's actual maturity and access model.

Priority candidate classes:

1. **Developer identity/project profiles** — e.g. Peerlist-style indexed project pages.
2. **Product discovery** — Product Hunt for products that are live, useful, and ready for public discussion.
3. **Technical community launch posts** — Show HN only for non-trivial projects people can actually try without a forced signup barrier and where David can participate in discussion.
4. **Technical writing/community profiles** — selected DEV/Hashnode-style case studies when there is substantive implementation or validation material to share, not thin promotional posts.
5. **Relevant curated lists/directories** — only where the project genuinely fits the list's scope and contribution rules.

The implementation phase will produce ready-to-submit listing packets (title, short description, long description, tags/categories, canonical URL, screenshots/social assets, maker note, and first-comment/launch context where relevant). Actual third-party submission will be automated only where an authorized connected action is available; otherwise it remains a clearly identified manual final step.

### Workstream 5 — Measurement and feedback loop

Create a lightweight discovery ledger that records:

- target query/entity;
- current observed search presence;
- canonical landing page;
- external listing/backlink source;
- submission/publication date;
- status;
- evidence URL;
- observed inbound outreach or referral notes when known.

Do not treat rankings as deterministic. Search results vary by engine, location, personalization, crawl timing, and index state.

## Data flow / entity model

The intended public entity graph is:

`David Turner` ↔ `atomicdjt` ↔ `AI Project Portfolio` ↔ `flagship project` ↔ `canonical live demo`

External high-quality profiles/listings should link into this graph rather than create isolated copies. The portfolio and GitHub profile serve as the main identity hubs; individual project pages remain the best task-specific landing surfaces.

## Failure modes and mitigations

- **Name collision:** use consistent qualified descriptors and creator attribution; do not rely on bare product names.
- **Duplicate/canonical confusion:** maintain one declared canonical public URL per surface and avoid promoting legacy previews.
- **Thin duplicate content:** do not clone the same marketing copy across every directory; tailor listings to the audience while keeping facts consistent.
- **Index bloat:** include only useful public routes in sitemaps and indexing surfaces.
- **Spam/backlink penalty risk:** reject low-quality directory farms, reciprocal-link schemes, paid-link packages, automated comment spam, and bulk submissions.
- **Claim inflation:** retain explicit limitations and do not convert packaging/readiness into claims of customers, revenue, adoption, or validation.
- **Community backlash:** for HN/Product Hunt/community launches, participate authentically and do not coordinate artificial votes/comments.

## Validation plan

For each GitHub implementation PR:

- inspect the exact diff;
- run repository-native lint/typecheck/test/build checks where code or deployable assets change;
- run existing public-link and deployment-policy checks for the portfolio where applicable;
- verify canonical URLs, metadata, structured data, `robots.txt`, and sitemap syntax;
- verify newly added internal/external links resolve;
- confirm no unrelated files changed;
- confirm no source-authority, license, or privacy boundary changed unintentionally.

For external listings:

- confirm the target is legitimate and current before submission;
- confirm its rules allow the proposed project/content;
- preserve evidence of the published URL after submission;
- do not count a prepared draft as a backlink until it is actually public and crawlable.

## Success criteria

Near-term success is not a guaranteed ranking position. It is:

- a coherent and consistent public entity graph across GitHub and deployed projects;
- no obvious canonical/crawl/metadata regressions;
- collision-prone projects described with differentiated intent-rich language;
- high-quality public project/profile pages linking back to canonical assets;
- at least several legitimate external discovery opportunities prepared to publication-ready quality;
- measurable growth in genuine external discovery signals over time: backlinks, referral visits, project mentions, profile views where available, recruiter/founder/contact outreach, or community feedback.

## Scope boundaries for the first implementation plan

In scope:

- Portfolio Hub SEO/entity/crawl improvements.
- GitHub profile README optimization.
- Flagship public repository README/discovery consistency.
- A ranked external-listing/backlink backlog.
- Publication-ready submission packets for the strongest eligible projects.
- Verification of all changed GitHub artifacts via PRs.

Out of scope unless separately approved:

- purchasing a custom domain;
- renaming flagship products;
- making QuoteForge Local source public;
- paid advertising;
- mass cold email;
- automated social posting;
- fabricated engagement or link-building;
- destructive repository restructuring.

## Rollout

1. Portfolio Hub entity/crawl PR.
2. GitHub profile conversion PR.
3. Flagship repository consistency PRs, kept separate per repository.
4. External distribution/backlink packet and tracker PR/documentation.
5. Publish externally where an authorized action exists; otherwise hand off only the final account-bound submission step.
6. Re-audit search presence after crawl/index time has elapsed and use evidence to decide whether a custom domain or product renaming is warranted.
