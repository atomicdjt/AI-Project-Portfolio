# Public link verification

Run `npm run verify:public-links` to check the flagship public review path.

The command verifies each canonical URL returns a successful response and the expected HTML title. It is deliberately an operator-run check rather than CI: public hosts, CDNs, and third-party storefront availability can be transient and should not make source validation flaky.

This is an availability and page-identity check only. It does not prove browser interaction, buyer delivery, analytics, account ownership, revenue, or customer use.
