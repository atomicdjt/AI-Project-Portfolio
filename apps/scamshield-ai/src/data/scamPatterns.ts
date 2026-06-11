import type { FindingCategory, Severity } from '../types/analysis'

export interface ScamPattern {
  category: FindingCategory
  severity: Severity
  expression: RegExp
  explanation: string
  plainExplanation: string
  saferNextStep: string
}

export const ALL_FINDING_CATEGORIES: FindingCategory[] = [
  'Urgency and pressure',
  'Threats and fear',
  'Secrecy and isolation',
  'Payment red flags',
  'Credential or personal-data request',
  'Impersonation',
  'Suspicious URL',
  'Romance or social manipulation',
  'Job scam indicators',
  'Invoice or business compromise',
]

export const scamPatterns: ScamPattern[] = [
  {
    category: 'Urgency and pressure',
    severity: 'medium',
    expression: /\b(act now|immediately|last chance|within 24 hours?|account locked|final notice|urgent|today only|time[- ]sensitive)\b/i,
    explanation: 'The message uses urgency to reduce the time available for independent verification.',
    plainExplanation: 'The message is trying to make you act before you have time to check it.',
    saferNextStep: 'Pause and verify the request through an official website, statement, card, or known phone number.',
  },
  {
    category: 'Threats and fear',
    severity: 'high',
    expression: /\b(arrest|lawsuit|account closure|benefits? (?:will be )?suspended|police|warrant|tax penalty|legal action|prosecution)\b/i,
    explanation: 'Threats or fear-based language can be used to force a rushed decision.',
    plainExplanation: 'The message may be using fear to pressure you.',
    saferNextStep: 'Do not respond to the threat. Contact the named institution through independently verified contact information.',
  },
  {
    category: 'Secrecy and isolation',
    severity: 'high',
    expression: /\b(do not tell anyone|keep this confidential|do not contact your bank|do not speak to (?:your )?family|keep this between us|tell no one)\b/i,
    explanation: 'Isolation requests prevent trusted people or institutions from checking the story.',
    plainExplanation: 'Someone is asking you to keep the request secret from people who could help.',
    saferNextStep: 'Talk to a trusted person or your bank before taking any action.',
  },
  {
    category: 'Payment red flags',
    severity: 'critical',
    expression: /\b(gift cards?|crypto(?:currency)?|wire transfer|zelle|cash ?app|venmo|prepaid cards?|apple gift card|google play card|bitcoin|western union|moneygram)\b/i,
    explanation: 'The requested payment method can be difficult to reverse and is commonly abused in scams.',
    plainExplanation: 'This payment method can be hard to get back after money is sent.',
    saferNextStep: 'Do not send payment. Contact your bank or payment provider using its official app, website, or card number.',
  },
  {
    category: 'Credential or personal-data request',
    severity: 'critical',
    expression: /\b(password|verification code|one[- ]time code|social security number|bank login|\bpin\b|security question|remote access|authentication code|private key|seed phrase)\b/i,
    explanation: 'The request seeks information or access that could let another person control an account or device.',
    plainExplanation: 'This message may be trying to steal your login information or control your device.',
    saferNextStep: 'Do not share the information. Use a trusted device to contact the institution and change affected credentials.',
  },
  {
    category: 'Impersonation',
    severity: 'medium',
    expression: /\b(irs|social security|medicare|your bank|police|sheriff|court|amazon|microsoft|apple|paypal|usps|fedex|ups|government agency)\b/i,
    explanation: 'The message invokes a trusted company or government institution, which should be independently verified.',
    plainExplanation: 'The sender claims to be a trusted company or agency. That claim needs to be checked.',
    saferNextStep: 'Type the official website yourself or use a known number from a card, statement, or prior record.',
  },
  {
    category: 'Romance or social manipulation',
    severity: 'high',
    expression: /\b(cannot video call|oil rig|deployed (?:overseas|abroad)|military overseas|medical emergency|travel emergency|my love|soulmate|emergency funds|prove your love)\b/i,
    explanation: 'The story combines emotional trust with an excuse, emergency, or request for money.',
    plainExplanation: 'The person may be using an emotional relationship to ask for money.',
    saferNextStep: 'Pause payment and discuss the situation with someone you trust who is outside the relationship.',
  },
  {
    category: 'Job scam indicators',
    severity: 'high',
    expression: /\b(equipment check|pay before (?:you )?work|interview (?:only )?(?:through|via) chat|unusually high pay|bank information (?:before|to start)|fake check|deposit the check|purchase equipment)\b/i,
    explanation: 'The hiring process or payment arrangement matches patterns used in fake job and fake-check schemes.',
    plainExplanation: 'This job offer asks for money or banking steps that real employers usually do not require.',
    saferNextStep: 'Verify the employer through its independently found website and do not deposit or forward funds.',
  },
  {
    category: 'Invoice or business compromise',
    severity: 'high',
    expression: /\b(changed payment instructions|new bank account|urgent wire|vendor email mismatch|executive pressure|confidential payment|updated remittance|new routing number)\b/i,
    explanation: 'Unexpected payment changes or executive pressure can indicate invoice fraud or business email compromise.',
    plainExplanation: 'The payment instructions changed in a way that should be checked with a known contact.',
    saferNextStep: 'Confirm payment instructions using a previously known phone number or in-person contact.',
  },
]
