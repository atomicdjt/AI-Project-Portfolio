import AxeBuilder from '@axe-core/playwright'
import { normalizeAxeViolation } from './evidence.mjs'

export async function scanPage(page) {
  const analysis = await new AxeBuilder({ page }).analyze()
  return analysis.violations.flatMap(normalizeAxeViolation)
}
