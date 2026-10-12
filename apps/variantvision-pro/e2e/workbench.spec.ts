import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => { await page.goto('/') })

test('teaching frequencies and build switching describe the same allele', async ({ page }) => {
  await expect(page.locator('.metric-card').nth(2)).toContainText('4.375%')
  await expect(page.locator('.metric-card').nth(2)).toContainText('AFR exome')
  await page.getByRole('combobox', { name: 'Build', exact: true }).selectOption('GRCh37')
  await expect(page.getByLabel('gnomAD-style ID')).toHaveValue('11-5248232-T-A')
  await expect(page.getByLabel('Genomic HGVS')).toHaveValue('NC_000011.9:g.5248232T>A')
  await expect(page.getByRole('link', { name: 'Open in gnomAD' })).toHaveAttribute('href', /11-5248232-T-A\?dataset=gnomad_r2_1/)
})

test('custom input detaches case evidence and clears coordinates on a build change', async ({ page }) => {
  await page.getByLabel('Protein change').fill('R12H')
  await expect(page.locator('.table-wrap')).not.toContainText('1,821')
  await expect(page.getByText('No curated protein or transcript is mapped', { exact: false })).toBeVisible()
  await expect(page.locator('.metric-card').nth(2)).toContainText('Unavailable')
  await page.getByRole('combobox', { name: 'Build', exact: true }).selectOption('GRCh37')
  await expect(page.getByLabel('gnomAD-style ID')).toHaveValue('')
  await expect(page.getByLabel('Genomic HGVS')).toHaveValue('')
  await page.getByRole('tab', { name: 'Report', exact: true }).click()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON' }).click()
  const download = await downloadEvent
  const bundle = JSON.parse(await readFile((await download.path())!, 'utf8'))
  expect(bundle.case).toBeNull()
  expect(bundle.dossier.populationRecords).toEqual([])
  expect(bundle.dossier.input).not.toHaveProperty('population')
  expect(bundle.dossier.input.condition).toBe('')
})

test('tabs support arrow, Home and End navigation with linked panels', async ({ page }) => {
  await page.getByRole('tab', { name: 'Dossier' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Sources', exact: true })).toBeFocused()
  await expect(page.getByRole('tabpanel', { name: 'Sources', exact: true })).toBeVisible()
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'Method', exact: true })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(page.getByRole('tab', { name: 'Dossier' })).toHaveAttribute('tabindex', '0')
  await expect(page.getByRole('tab', { name: 'Report', exact: true })).toHaveAttribute('tabindex', '-1')
})

test('Markdown download and clipboard retain source provenance', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('tab', { name: 'Report', exact: true }).click()
  await page.getByRole('button', { name: 'Copy Markdown' }).click()
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('https://gnomad.broadinstitute.org/')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download .md', exact: true }).click()
  const download = await downloadEvent
  const markdown = await readFile((await download.path())!, 'utf8')
  expect(markdown).toContain('Highest row frequency: 4.375%')
  expect(markdown).toContain('No live retrieval has been performed')
  expect(markdown).toContain('five dimensions contribute equally')
})

test('all tabs pass automated accessibility checks', async ({ page }) => {
  for (const name of ['Dossier', 'Sources', 'Report', 'Method']) {
    await page.getByRole('tab', { name, exact: true }).click()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  }
})

test('layout contains wide content at supported viewport widths', async ({ page }) => {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const name of ['Dossier', 'Sources', 'Report', 'Method']) {
      await page.getByRole('tab', { name, exact: true }).click()
      const geometry = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1)
    }
  }
})

async function mockProviders(page: Page, pubmedStatus = 200, delayMs = 0) {
  await page.route('https://eutils.ncbi.nlm.nih.gov/**', async (route) => {
    const url = new URL(route.request().url())
    const single = { obj_type: 'single nucleotide variant', title: 'HBB single-variant test record', genes: [{ symbol: 'HBB' }],
      variation_set: [{ variant_type: 'single nucleotide variant', canonical_spdi: 'NC_000011.10:5227001:T:A', variation_loc: [{ assembly_name: 'GRCh38', chr: '11', start: '5227002', stop: '5227002' }] }],
      germline_classification: { description: 'Synthetic assertion', review_status: 'criteria provided, single submitter' } }
    const body = url.pathname.endsWith('esearch.fcgi')
      ? { esearchresult: { count: '2', idlist: url.searchParams.get('db') === 'clinvar' ? ['446748', '15333'] : ['20303803'] } }
      : { result: { '446748': { ...single, obj_type: 'Haplotype' }, '15333': single } }
    await route.fulfill({ json: body })
  })
  await page.route('https://rest.uniprot.org/**', (route) => route.fulfill({ json: {
    entryType: 'UniProtKB reviewed (Swiss-Prot)', genes: [{ geneName: { value: 'HBB' } }], organism: { scientificName: 'Homo sapiens' },
    proteinDescription: { recommendedName: { fullName: { value: 'Synthetic hemoglobin record' } } },
  } }))
  await page.route('**/api/pubmed?**', async (route) => {
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
    await route.fulfill({ status: pubmedStatus, json: { result: { '20303803': { title: 'Synthetic literature lead', source: 'Test journal', pubdate: '2026' } } } })
  })
}

test('live evidence binds the exact ClinVar record and logs source provenance', async ({ page }) => {
  await mockProviders(page)
  await page.getByRole('button', { name: 'Fetch Live Evidence' }).click()
  await expect(page.locator('.provider-status-bar.active')).toContainText('pubmed')
  await page.getByRole('tab', { name: 'Sources', exact: true }).click()
  await expect(page.locator('a[href="https://www.ncbi.nlm.nih.gov/clinvar/variation/15333/"]')).toBeVisible()
  await expect(page.locator('a[href="https://www.ncbi.nlm.nih.gov/clinvar/variation/446748/"]')).toHaveCount(0)
  await expect(page.getByText('Synthetic literature lead', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Report', exact: true }).click()
  await expect(page.locator('.report-preview')).toContainText('NCBI ESummary via VariantVision metadata endpoint')
  await expect(page.locator('.report-preview')).toContainText('compound records and alternate alleles were excluded')
})

test('provider failures stay visible and are preserved in the report', async ({ page }) => {
  await mockProviders(page, 502)
  await page.getByRole('button', { name: 'Fetch Live Evidence' }).click()
  await expect(page.locator('.provider-status-bar.active')).toContainText('error')
  await page.getByText('Retrieval details and warnings').click()
  await expect(page.locator('.provider-details')).toContainText('PubMed metadata endpoint returned HTTP 502')
  await page.getByRole('tab', { name: 'Report', exact: true }).click()
  await expect(page.locator('.report-preview')).toContainText('PubMed metadata endpoint returned HTTP 502')
  await expect(page.locator('.report-preview')).toContainText('Any retained teaching fixtures are not a successful live retrieval')
})

test('editing an identity during retrieval discards late provider results', async ({ page }) => {
  await mockProviders(page, 200, 500)
  const completed = page.waitForResponse((response) => response.url().includes('/api/pubmed?'))
  await page.getByRole('button', { name: 'Fetch Live Evidence' }).click()
  await page.getByLabel('Protein change').fill('R12H')
  await completed
  await expect(page.locator('.provider-status-bar')).toContainText('teaching fixtures are detached')
  await expect(page.locator('.provider-status-bar.active')).toHaveCount(0)
  await expect(page.locator('.metric-card').nth(2)).toContainText('Unavailable')
})

test('same-origin metadata route rejects invalid IDs instead of serving the SPA', async ({ request }) => {
  const response = await request.get('/api/pubmed?ids=invalid')
  expect(response.status()).toBe(400)
  expect(await response.json()).toEqual({ error: 'Provide one to five unique numeric PubMed IDs.' })
})
