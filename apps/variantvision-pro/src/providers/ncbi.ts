/**
 * Shared NCBI E-utilities client.
 * Enforces global rate limits across all NCBI requests (ClinVar, PubMed).
 */

const NCBI_EMAIL = 'variantvision@example.com'
const NCBI_TOOL = 'variantvision-pro'
const THROTTLE_MS = 350

let lastNcbiRequest = 0

async function throttleNcbi() {
  const now = Date.now()
  const elapsed = now - lastNcbiRequest
  if (elapsed < THROTTLE_MS) {
    await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS - elapsed))
  }
  lastNcbiRequest = Date.now()
}

export async function fetchNcbi(url: string, options?: RequestInit): Promise<Response> {
  await throttleNcbi()
  
  const urlObj = new URL(url)
  urlObj.searchParams.set('tool', NCBI_TOOL)
  urlObj.searchParams.set('email', NCBI_EMAIL)

  return fetch(urlObj.toString(), options)
}
