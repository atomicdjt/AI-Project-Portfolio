/**
 * Shared NCBI E-utilities client.
 * Enforces global rate limits across all NCBI requests (ClinVar, PubMed).
 */

import { createRequestScheduler } from './requestScheduler'

const NCBI_EMAIL = import.meta.env.VITE_NCBI_EMAIL
const NCBI_TOOL = 'variantvision-pro'
const THROTTLE_MS = 350

const throttleNcbi = createRequestScheduler(THROTTLE_MS)

export async function fetchNcbi(url: string, options?: RequestInit): Promise<Response> {
  await throttleNcbi(options?.signal)
  
  const urlObj = new URL(url, typeof location === 'undefined' ? 'http://localhost' : location.origin)
  if (urlObj.hostname === 'eutils.ncbi.nlm.nih.gov') {
    urlObj.searchParams.set('tool', NCBI_TOOL)
    if (NCBI_EMAIL) urlObj.searchParams.set('email', NCBI_EMAIL)
  }

  return fetch(urlObj.toString(), options)
}
