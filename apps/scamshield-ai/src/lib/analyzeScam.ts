import { ALL_FINDING_CATEGORIES, scamPatterns } from '../data/scamPatterns'
import type { AnalysisInput, AnalysisResult, RedFlagFinding } from '../types/analysis'
import { extractEntities, findSensitiveDataWarnings } from './extractEntities'
import { getRiskLabel, scoreFindings } from './riskScoring'

const shortenerHosts = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly'])
const unusualTlds = new Set(['top', 'xyz', 'click', 'work', 'support', 'zip', 'mov', 'country'])
const commonBrands = ['amazon', 'microsoft', 'apple', 'paypal', 'usps', 'fedex', 'ups', 'irs', 'medicare']

function findingId(category: string, matched: string): string {
  return `${category}-${matched}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function analyzeUrl(urlText: string, claimedCompany: string): RedFlagFinding[] {
  const value = urlText.trim()
  if (!value) return []

  const findings: RedFlagFinding[] = []
  const add = (severity: RedFlagFinding['severity'], matched: string, explanation: string, plainExplanation: string) => {
    findings.push({
      id: findingId('Suspicious URL', matched),
      category: 'Suspicious URL',
      severity,
      matched,
      explanation,
      plainExplanation,
      saferNextStep: 'Do not open this link. Type the official website yourself or use a trusted bookmark.',
    })
  }

  let parsed: URL
  try {
    parsed = new URL(value.includes('://') ? value : `https://${value}`)
  } catch {
    add('medium', 'Malformed URL text', 'The entered address is not a standard web address.', 'This link text is unusual and may be misleading.')
    return findings
  }

  const host = parsed.hostname.toLowerCase()
  const labels = host.split('.').filter(Boolean)
  const tld = labels.at(-1) ?? ''

  if (parsed.protocol !== 'https:') {
    add('medium', 'Non-HTTPS address', 'The address does not use HTTPS. Encryption alone does not prove legitimacy, but its absence adds risk.', 'This link does not use the usual secure web connection.')
  }
  if (shortenerHosts.has(host)) {
    add('high', 'Shortened URL', 'A URL shortener hides the final destination.', 'This short link hides where it really goes.')
  }
  if (labels.length > 4) {
    add('medium', 'Many subdomains', 'The address uses an unusually deep chain of subdomains that can obscure the registrable domain.', 'The important part of this web address is hard to see.')
  }
  if (host.includes('xn--')) {
    add('high', 'Punycode-style hostname', 'Punycode can represent international characters and may be used for look-alike domains.', 'This address may use look-alike letters.')
  }
  if (unusualTlds.has(tld)) {
    add('medium', `Unusual .${tld} domain`, 'The top-level domain is often used for low-cost or short-lived sites and deserves extra verification.', 'This web ending is unusual for the claimed organization.')
  }
  if (/amaz0n|paypa[l1]-|micr0soft|app1e|fed-?exx|upss|g00gle/.test(host)) {
    add('high', 'Possible misspelled brand', 'The hostname contains characters or spelling that resemble a known brand.', 'The web address may be copying a trusted company name.')
  }

  const claimed = claimedCompany.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normalizedHost = host.replace(/[^a-z0-9]/g, '')
  if (claimed.length >= 3 && commonBrands.some((brand) => claimed.includes(brand)) && !normalizedHost.includes(claimed)) {
    add('high', 'Claimed company and domain do not match', 'The claimed organization name is not present in the hostname.', 'The link does not appear to match the company named in the message.')
  }

  if (/login|verify|secure|account|urgent/.test(host + parsed.pathname) && findings.length > 0) {
    add('medium', 'Urgent login wording in link', 'The link combines account or verification wording with other URL concerns.', 'The link is trying to look like an urgent sign-in page.')
  }

  return findings
}

export function analyzeScam(input: AnalysisInput): AnalysisResult {
  const combinedText = [
    input.text,
    input.paymentDestination,
    input.claimedCompany,
    input.contactDetails,
    input.amountRequested,
    input.pressureLanguage,
  ]
    .filter(Boolean)
    .join('\n')

  const patternFindings = scamPatterns.flatMap((pattern) => {
    const match = combinedText.match(pattern.expression)
    if (!match) return []
    return [
      {
        id: findingId(pattern.category, match[0]),
        category: pattern.category,
        severity: pattern.severity,
        matched: match[0],
        explanation: pattern.explanation,
        plainExplanation: pattern.plainExplanation,
        saferNextStep: pattern.saferNextStep,
      } satisfies RedFlagFinding,
    ]
  })

  const findings = [...patternFindings, ...analyzeUrl(input.url, input.claimedCompany)]
  const score = scoreFindings(findings)
  const label = getRiskLabel(score)
  const foundCategories = new Set(findings.map((finding) => finding.category))
  const entities = extractEntities([combinedText, input.url].filter(Boolean).join('\n'))
  const sensitiveWarnings = findSensitiveDataWarnings(combinedText)

  const summaries: Record<typeof label, string> = {
    'Low visible risk': 'No strong scam indicators were found in the information entered. Continue to verify unexpected requests independently.',
    Concerning: 'Some risk signals were found. Pause before replying, clicking, sharing information, or sending money.',
    'High risk': 'Several significant risk signals were found. Preserve the evidence and verify through official channels before taking action.',
    'Severe risk': 'The information contains severe risk signals. Do not send money or codes, and contact affected institutions through official channels now.',
  }

  return {
    score,
    label,
    summary: summaries[label],
    findings,
    notFound: ALL_FINDING_CATEGORIES.filter((category) => !foundCategories.has(category)),
    entities,
    sensitiveWarnings,
    disclaimer: 'This is a risk assessment, not a final determination.',
    networkRequestsMade: 0,
    analyzedAt: new Date().toISOString(),
  }
}
