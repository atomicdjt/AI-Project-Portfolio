import type { IntakeState, OpsDocument } from './types'

export const initialIntake: IntakeState = {
  business: 'Brightline Dental',
  role: 'Front Desk Coordinator',
  department: 'Patient Operations',
  documentType: 'SOP',
  priority: 'Compliance sensitive',
  sourceNotes:
    'New patient intake is inconsistent. Staff ask for insurance card, consent forms, medication list, and preferred pharmacy, but order changes by person. Need a script for confirming appointment reminders. Escalate billing questions to office manager. Confirm HIPAA acknowledgement before collecting clinical history. If forms are missing, send secure portal link and call the patient 24 hours before visit. Track completion in the schedule notes.',
}

export const sampleIntakes: IntakeState[] = [
  initialIntake,
  {
    business: 'Harbor HVAC',
    role: 'Service Dispatcher',
    department: 'Field Service',
    documentType: 'Training Checklist',
    priority: 'Revenue critical',
    sourceNotes:
      'Dispatchers need to triage calls, confirm address, equipment type, warranty status, preferred appointment window, and urgency. Emergency calls: no heat below 40 degrees, no cooling for medical needs, active leak, electrical smell. Techs need job notes before route starts. Customer gets text when tech is assigned. If parts are unavailable, update customer and create follow-up task.',
  },
  {
    business: 'Northstar Bookkeeping',
    role: 'Client Success Associate',
    department: 'Support',
    documentType: 'Knowledge Base',
    priority: 'Customer visible',
    sourceNotes:
      'Customers often ask how to upload statements, what happens when a receipt is missing, when monthly reports are ready, how to change payroll dates, and who approves bank rules. Current answers are in emails. Need short articles with steps, owner, expected turnaround, and escalation path to the account lead.',
  },
]

export const seedDocuments: OpsDocument[] = [
  {
    id: 'seed-client-intake',
    title: 'New Patient Intake SOP',
    type: 'SOP',
    business: 'Brightline Dental',
    department: 'Patient Operations',
    owner: 'Front Desk Coordinator',
    status: 'In Review',
    priority: 'Compliance sensitive',
    score: 82,
    risk: 'Medium',
    lastRevised: '2026-06-05',
    summary:
      'Standardizes patient intake, insurance collection, consent confirmation, reminder scripts, and escalation for billing questions.',
    steps: [
      {
        id: 's1',
        title: 'Confirm patient identity and appointment details',
        detail:
          'Verify full name, date of birth, appointment time, visit reason, preferred contact method, and whether the patient needs accommodations.',
        owner: 'Front Desk Coordinator',
        timing: 'At scheduling and again 24 hours before visit',
      },
      {
        id: 's2',
        title: 'Collect required documents',
        detail:
          'Request insurance card, consent forms, medication list, preferred pharmacy, and HIPAA acknowledgement before clinical history is collected.',
        owner: 'Front Desk Coordinator',
        timing: 'Before check-in is marked complete',
      },
      {
        id: 's3',
        title: 'Escalate billing exceptions',
        detail:
          'Route coverage disputes, balance questions, and payment-plan requests to the office manager with a note in the scheduling record.',
        owner: 'Office Manager',
        timing: 'Same business day',
      },
    ],
    checklist: [
      {
        id: 'c1',
        task: 'Observe two intake calls and score against the script',
        owner: 'Office Manager',
        due: 'Day 2',
        done: true,
      },
      {
        id: 'c2',
        task: 'Complete a supervised portal-link follow-up',
        owner: 'Front Desk Lead',
        due: 'Day 4',
        done: false,
      },
      {
        id: 'c3',
        task: 'Explain escalation rules for billing questions',
        owner: 'Office Manager',
        due: 'Day 5',
        done: false,
      },
    ],
    articles: [
      {
        id: 'a1',
        question: 'What documents does a new patient need before the first visit?',
        answer:
          'A complete intake requires insurance card, consent forms, medication list, preferred pharmacy, HIPAA acknowledgement, and schedule notes showing completion status.',
        tags: ['intake', 'forms', 'HIPAA'],
      },
      {
        id: 'a2',
        question: 'Who handles billing questions during intake?',
        answer:
          'Front desk staff acknowledge the question, capture the context, and route the issue to the office manager for same-day follow-up.',
        tags: ['billing', 'escalation'],
      },
    ],
    gaps: [
      {
        id: 'g1',
        severity: 'medium',
        title: 'Missing fallback for portal failures',
        evidence: 'The SOP mentions secure portal links but not what to do if the patient cannot access the portal.',
        fix: 'Add phone verification and in-office completion fallback.',
        status: 'Open',
      },
      {
        id: 'g2',
        severity: 'low',
        title: 'Training sign-off is informal',
        evidence: 'Checklist has tasks but no final approval record.',
        fix: 'Add a manager sign-off task with date and reviewer.',
        status: 'Open',
      },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1.0',
        author: 'ProcessHarbor',
        date: '2026-06-05',
        changes: ['Generated intake workflow', 'Added compliance-sensitive gap scan', 'Created onboarding checklist'],
      },
    ],
    body:
      'Purpose: Standardize new patient intake so required documentation, reminders, and billing escalations happen consistently.\n\nScope: Front desk coordinators, office manager, and any backup staff covering patient operations.\n\nProcedure:\n1. Confirm patient identity, appointment details, visit reason, and preferred contact method.\n2. Request insurance card, consent forms, medication list, preferred pharmacy, and HIPAA acknowledgement.\n3. Send a secure portal link if documents are missing.\n4. Call the patient 24 hours before visit when required forms remain incomplete.\n5. Escalate billing questions to the office manager and log the handoff in schedule notes.\n\nQuality check: Intake is complete only when required documents, acknowledgement, and schedule notes are recorded.',
  },
]
