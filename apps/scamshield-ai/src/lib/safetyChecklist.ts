import type { ChecklistItem, SafetyChecklistInput } from '../types/case'

type DraftItem = Omit<ChecklistItem, 'id' | 'completed'>

const baseItems: DraftItem[] = [
  { label: 'Do not reply to the suspicious message.', priority: 'now' },
  { label: 'Do not click links or call phone numbers from the suspicious message.', priority: 'now' },
  { label: 'Save screenshots, messages, file names, and transaction details.', priority: 'preserve' },
  { label: 'Verify the request through an official website, known phone number, statement, or card.', priority: 'soon' },
  { label: 'Talk to a trusted person before sending money or sharing information.', priority: 'soon' },
  { label: 'Report the incident through the official channels that fit your situation.', priority: 'soon' },
]

export function generateSafetyChecklist(input: SafetyChecklistInput): ChecklistItem[] {
  const items: DraftItem[] = [...baseItems]
  const text = input.evidenceText.toLowerCase()
  const categories = new Set(input.findings.map((finding) => finding.category))

  if (input.urgency === 'money-at-risk' || input.urgency === 'money-sent') {
    items.push(
      { label: 'Contact your bank or payment provider immediately using the official number on your card or account website.', priority: 'now' },
      { label: 'Ask whether the transaction can be frozen, recalled, disputed, or reversed.', priority: 'now' },
    )
  }

  if (input.urgency === 'personal-info-shared' || categories.has('Credential or personal-data request') || /password|login|code|pin/.test(text)) {
    items.push(
      { label: 'Use a trusted device to change affected passwords and do not reuse the old password.', priority: 'now' },
      { label: 'Enable multi-factor authentication and monitor affected accounts.', priority: 'soon' },
      { label: 'Consider a fraud alert or credit freeze if identity information was shared.', priority: 'soon' },
    )
  }

  if (/remote access|anydesk|teamviewer|screenconnect|installed/.test(text)) {
    items.push(
      { label: 'Disconnect from the internet if someone may still have remote control.', priority: 'now' },
      { label: 'Use a trusted device to change passwords and contact a reputable local technician or official support channel.', priority: 'now' },
    )
  }

  if (input.scamType === 'government-impersonation') {
    items.push({ label: 'Contact the relevant agency directly through its official .gov website or a previously known number.', priority: 'soon' })
  }

  if (input.caregiverMode) {
    items.push(
      { label: 'Use calm, non-blaming language and confirm the person is physically and financially safe.', priority: 'now' },
      { label: 'Ask whether money, passwords, codes, or personal information were shared.', priority: 'now' },
      { label: 'Help preserve evidence and contact official institutions with the person\'s permission.', priority: 'preserve' },
    )
  }

  return [...new Map(items.map((item) => [item.label, item])).values()].map((item, index) => ({
    ...item,
    id: `action-${index + 1}`,
    completed: false,
  }))
}
