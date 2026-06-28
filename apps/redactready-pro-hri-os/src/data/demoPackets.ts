import type { DocumentInput } from '../modules/analysis/analyzePacket'

export interface DemoPacket {
  id: string
  title: string
  summary: string
  documents: DocumentInput[]
}

export const demoPackets: DemoPacket[] = [
  {
    id: 'job-application',
    title: 'Job Application Packet',
    summary: 'Resume excerpt, recruiter correspondence, and portfolio notes with contact details to redact.',
    documents: [
      {
        id: 'job-resume',
        title: 'Resume excerpt',
        source: 'demo packet',
        rawText:
          'Purpose: submit a focused job application packet. Jordan Avery, email jordan.avery@example.test, phone (312) 555-0198. Portfolio: https://portfolio.example.test. Experience includes privacy tooling, React dashboards, and document workflow automation. Employee ID from prior employer: EMP-29481.',
      },
      {
        id: 'job-email',
        title: 'Recruiter email',
        source: 'demo packet',
        rawText:
          'From: recruiter@example.test Subject: Interview schedule. Please confirm the interview on 04/18/2026 and send a clean copy of your project summary. Reference number REQ-58291. Regards, Talent Team.',
      },
    ],
  },
  {
    id: 'benefits-admin',
    title: 'Benefits / Administrative Packet',
    summary: 'Fictional appointment notes and case references that need context and identifier review.',
    documents: [
      {
        id: 'benefits-note',
        title: 'Appointment support note',
        source: 'demo packet',
        rawText:
          'Purpose: organize documents before submitting an administrative review. Appointment date 03/02/2026. Patient ID MRN A7721904. Member ID HZ-4471-0092. The packet includes appointment notes, an agency form, and a missing proof-of-address item.',
      },
      {
        id: 'benefits-list',
        title: 'Supporting documents list',
        source: 'demo packet',
        rawText:
          'Case number BEN-204911. Supporting documents: signed form, appointment note, identity copy, and follow-up letter. Required proof of address is not applicable according to the draft note, but the agency checklist says required.',
      },
    ],
  },
  {
    id: 'privacy-leak',
    title: 'Privacy Leak Audit',
    summary: 'Screenshot-like text with exposed identifiers, contact details, and machine-readable-code mentions.',
    documents: [
      {
        id: 'privacy-screenshot',
        title: 'Screenshot text capture',
        source: 'demo packet',
        rawText:
          'Screenshot export: contact alex.rivera@example.test, phone 555-244-9182, address 418 North Harbor Street, account number ACCT-77118829. QR code visible near footer. IP address 192.168.1.45. DOB: 07/14/1991. Signature line: signed by Alex Rivera.',
      },
    ],
  },
]
