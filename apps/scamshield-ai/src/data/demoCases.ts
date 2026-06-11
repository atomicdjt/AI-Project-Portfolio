import type { FindingCategory } from '../types/analysis'
import type { ScamCase, TimelineEntry } from '../types/case'

export interface DemoCase {
  id: string
  title: string
  description: string
  isSynthetic: true
  case: ScamCase
  expectedCategories: FindingCategory[]
}

function timeline(id: string, eventType: TimelineEntry['eventType'], description: string, amount = ''): TimelineEntry {
  return {
    id,
    dateTime: '2026-05-14T10:30',
    eventType,
    description,
    amount,
    contact: 'Synthetic demo contact',
    reference: 'Demo evidence',
    source: 'suggested',
  }
}

function demoCase({ id, name, evidenceText, ...overrides }: Partial<ScamCase> & Pick<ScamCase, 'id' | 'name' | 'evidenceText'>): ScamCase {
  return {
    id,
    name,
    createdAt: '2026-05-14T10:30:00.000Z',
    updatedAt: '2026-05-14T10:30:00.000Z',
    role: 'target',
    scamType: 'unknown',
    urgency: 'suspicious-only',
    contactMethod: 'email',
    evidenceText,
    manualExtractedText: '',
    suspiciousUrl: '',
    paymentDestination: '',
    claimedCompany: '',
    contactDetails: '',
    amountRequested: '',
    pressureLanguage: '',
    notes: 'Synthetic example for demonstration only. No real person or account is represented.',
    attachments: [],
    timeline: [],
    checklist: [],
    caregiver: { personHelped: '', relationship: '', hasConsent: false, notes: '' },
    analysis: null,
    ...overrides,
  }
}

export const demoCases: DemoCase[] = [
  {
    id: 'bank-phishing',
    title: 'Bank account locked phishing text',
    description: 'A fake bank alert pushes an urgent login link and asks for a verification code.',
    isSynthetic: true,
    case: demoCase({
      id: 'demo-bank-phishing',
      name: 'Demo: Bank account locked alert',
      scamType: 'bank-payment',
      urgency: 'personal-info-shared',
      contactMethod: 'sms',
      claimedCompany: 'Example Community Bank',
      suspiciousUrl: 'http://example-bank-secure.top/urgent-login',
      pressureLanguage: 'Within 24 hours',
      evidenceText: 'URGENT: Your bank account is locked. Verify your login within 24 hours and reply with the one-time verification code. Do not contact your bank.',
      timeline: [timeline('bank-1', 'Message received', 'Synthetic account-locked text received.')],
    }),
    expectedCategories: ['Urgency and pressure', 'Secrecy and isolation', 'Credential or personal-data request', 'Suspicious URL'],
  },
  {
    id: 'romance-emergency',
    title: 'Romance emergency request',
    description: 'A fictional overseas partner claims an emergency and requests a hard-to-reverse payment.',
    isSynthetic: true,
    case: demoCase({
      id: 'demo-romance',
      name: 'Demo: Romance emergency request',
      scamType: 'romance',
      urgency: 'money-at-risk',
      contactMethod: 'social',
      paymentDestination: 'Gift cards',
      amountRequested: '$2,400',
      evidenceText: 'My love, I cannot video call from the oil rig. I have a sudden medical emergency. Do not tell anyone. Please buy gift cards today to prove your love.',
      timeline: [timeline('romance-1', 'Money requested', 'Synthetic emergency payment request received.', '$2,400')],
    }),
    expectedCategories: ['Romance or social manipulation', 'Payment red flags', 'Secrecy and isolation'],
  },
  {
    id: 'job-equipment-check',
    title: 'Fake job equipment check',
    description: 'A fictional employer conducts a chat-only interview and sends an equipment-check story.',
    isSynthetic: true,
    case: demoCase({
      id: 'demo-job',
      name: 'Demo: Job equipment check',
      scamType: 'job',
      urgency: 'money-at-risk',
      contactMethod: 'email',
      amountRequested: '$3,800',
      evidenceText: 'Your interview is only through chat. We will email an equipment check for $3,800. Deposit the check immediately, purchase equipment, and send the remaining money by wire transfer.',
      timeline: [timeline('job-1', 'Money requested', 'Synthetic equipment-check instructions received.', '$3,800')],
    }),
    expectedCategories: ['Job scam indicators', 'Payment red flags', 'Urgency and pressure'],
  },
  {
    id: 'tech-support',
    title: 'Tech support remote-access scam',
    description: 'A fake support agent requests remote control, a password, and gift-card payment.',
    isSynthetic: true,
    case: demoCase({
      id: 'demo-tech-support',
      name: 'Demo: Remote-access support call',
      scamType: 'tech-support',
      urgency: 'personal-info-shared',
      contactMethod: 'phone',
      claimedCompany: 'Microsoft',
      paymentDestination: 'Google Play card',
      evidenceText: 'Microsoft security called about an urgent infection. Install remote access immediately, share your password, and pay for support with a Google Play card.',
      timeline: [timeline('tech-1', 'Call received', 'Synthetic support call received.')],
    }),
    expectedCategories: ['Impersonation', 'Credential or personal-data request', 'Payment red flags'],
  },
  {
    id: 'invoice-change',
    title: 'Invoice payment change scam',
    description: 'A fictional vendor requests confidential payment to a new bank account.',
    isSynthetic: true,
    case: demoCase({
      id: 'demo-invoice',
      name: 'Demo: Invoice payment change',
      scamType: 'invoice-bec',
      urgency: 'money-at-risk',
      contactMethod: 'email',
      amountRequested: '$18,750',
      evidenceText: 'Final notice: our payment instructions changed. Send an urgent wire for $18,750 to the new bank account today. This is a confidential payment requested by the executive team.',
      timeline: [timeline('invoice-1', 'Money requested', 'Synthetic changed-payment invoice received.', '$18,750')],
    }),
    expectedCategories: ['Invoice or business compromise', 'Urgency and pressure'],
  },
]
