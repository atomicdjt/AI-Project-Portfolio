export type ReportingCategory = 'Federal' | 'Identity' | 'Financial' | 'State and local' | 'Mail'

export interface ReportingResource {
  id: string
  name: string
  category: ReportingCategory
  url: string
  displayUrl: string
  guidance: string
  bestFor: string
  official: true
}

export const reportingResources: ReportingResource[] = [
  {
    id: 'ftc-reportfraud',
    name: 'FTC ReportFraud',
    category: 'Federal',
    url: 'https://reportfraud.ftc.gov/',
    displayUrl: 'reportfraud.ftc.gov',
    guidance: 'Report fraud, scams, and deceptive business practices to the Federal Trade Commission.',
    bestFor: 'Most consumer scams and suspicious business practices',
    official: true,
  },
  {
    id: 'fbi-ic3',
    name: 'FBI Internet Crime Complaint Center (IC3)',
    category: 'Federal',
    url: 'https://complaint.ic3.gov/',
    displayUrl: 'complaint.ic3.gov',
    guidance: 'File a complaint about cyber-enabled fraud or internet crime. Preserve transaction and communication details first.',
    bestFor: 'Online fraud, account compromise, crypto, business email compromise',
    official: true,
  },
  {
    id: 'identity-theft',
    name: 'IdentityTheft.gov',
    category: 'Identity',
    url: 'https://www.identitytheft.gov/',
    displayUrl: 'identitytheft.gov',
    guidance: 'Create a personalized recovery plan if identity information or accounts may have been misused.',
    bestFor: 'Shared Social Security numbers, account takeover, or identity misuse',
    official: true,
  },
  {
    id: 'credit-freeze',
    name: 'Credit freeze and fraud alert guidance',
    category: 'Identity',
    url: 'https://www.usa.gov/credit-freeze',
    displayUrl: 'usa.gov/credit-freeze',
    guidance: 'Use the federal directory to reach Equifax, Experian, and TransUnion and manage a free security freeze.',
    bestFor: 'Personal information exposure or risk of new-account fraud',
    official: true,
  },
  {
    id: 'equifax-freeze',
    name: 'Equifax security freeze',
    category: 'Identity',
    url: 'https://www.equifax.com/personal/credit-report-services/credit-freeze/',
    displayUrl: 'equifax.com/personal/credit-report-services/credit-freeze',
    guidance: 'Manage an Equifax security freeze through the bureau\'s official page.',
    bestFor: 'One part of a three-bureau credit freeze',
    official: true,
  },
  {
    id: 'experian-freeze',
    name: 'Experian credit freeze',
    category: 'Identity',
    url: 'https://www.experian.com/help/credit-freeze/',
    displayUrl: 'experian.com/help/credit-freeze',
    guidance: 'Manage an Experian credit freeze through the bureau\'s official page.',
    bestFor: 'One part of a three-bureau credit freeze',
    official: true,
  },
  {
    id: 'transunion-freeze',
    name: 'TransUnion credit freeze',
    category: 'Identity',
    url: 'https://www.transunion.com/credit-freeze',
    displayUrl: 'transunion.com/credit-freeze',
    guidance: 'Manage a TransUnion credit freeze through the bureau\'s official page.',
    bestFor: 'One part of a three-bureau credit freeze',
    official: true,
  },
  {
    id: 'state-consumer',
    name: 'State consumer protection office',
    category: 'State and local',
    url: 'https://www.usa.gov/state-consumer',
    displayUrl: 'usa.gov/state-consumer',
    guidance: 'Find the consumer protection office for your state or territory.',
    bestFor: 'State-level complaints, local business issues, and consumer assistance',
    official: true,
  },
  {
    id: 'state-ag',
    name: 'State attorney general directory',
    category: 'State and local',
    url: 'https://www.usa.gov/state-attorney-general',
    displayUrl: 'usa.gov/state-attorney-general',
    guidance: 'Find your state or territory attorney general through the federal directory.',
    bestFor: 'State consumer-protection and fraud reporting options',
    official: true,
  },
  {
    id: 'local-government',
    name: 'Local police non-emergency guidance',
    category: 'State and local',
    url: 'https://www.usa.gov/local-governments',
    displayUrl: 'usa.gov/local-governments',
    guidance: 'Use your local government website to find the verified non-emergency police or sheriff contact. Call emergency services only for immediate danger.',
    bestFor: 'Local incident records, threats, or situations requiring a local report',
    official: true,
  },
  {
    id: 'uspis',
    name: 'United States Postal Inspection Service',
    category: 'Mail',
    url: 'https://www.uspis.gov/report',
    displayUrl: 'uspis.gov/report',
    guidance: 'Report suspected mail fraud, mail theft, or other mail-related crimes through USPIS.',
    bestFor: 'Checks, letters, packages, or fraud involving the U.S. Mail',
    official: true,
  },
  {
    id: 'bank-provider',
    name: 'Bank or payment provider',
    category: 'Financial',
    url: 'https://www.consumerfinance.gov/consumer-tools/fraud/',
    displayUrl: 'consumerfinance.gov/consumer-tools/fraud',
    guidance: 'Contact the institution immediately using the number on your card, official app, statement, or independently typed website.',
    bestFor: 'Money currently at risk, unauthorized transactions, or payment disputes',
    official: true,
  },
]
