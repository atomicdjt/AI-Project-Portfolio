import type {
  DocumentStep,
  GapFinding,
  IntakeState,
  KnowledgeArticle,
  OpsDocument,
  RiskLevel,
  TrainingItem,
  VersionEntry,
} from './types'
import { normalizeGeneratedText } from './textNormalization'

const ownerSignals = ['owner', 'manager', 'lead', 'coordinator', 'dispatcher', 'associate']
const complianceSignals = ['hipaa', 'consent', 'billing', 'warranty', 'payroll', 'approval', 'compliance']
const escalationSignals = ['escalate', 'route', 'follow-up', 'manager', 'lead', 'emergency']

export function generateDocument(intake: IntakeState, previous?: OpsDocument): OpsDocument {
  const cleanIntake = normalizeIntake(intake)
  const sentences = splitNotes(cleanIntake.sourceNotes)
  const steps = buildSteps(cleanIntake, sentences)
  const checklist = buildTrainingChecklist(cleanIntake, steps)
  const articles = buildKnowledgeArticles(cleanIntake, sentences, steps)
  const gaps = detectGaps(cleanIntake, steps)
  const score = scoreDocument(cleanIntake, steps, gaps)
  const risk = riskFromScore(score, gaps)
  const title = buildTitle(cleanIntake)
  const body = buildBody(cleanIntake, steps, gaps)
  const version = buildVersion(previous)

  return {
    id: previous?.id ?? createId('doc'),
    title,
    type: cleanIntake.documentType,
    business: cleanIntake.business.trim() || 'Small Business',
    department: cleanIntake.department.trim() || 'Operations',
    owner: cleanIntake.role.trim() || 'Operations Owner',
    status: previous?.status ?? 'Draft',
    priority: cleanIntake.priority,
    score,
    risk,
    lastRevised: today(),
    summary: buildSummary(cleanIntake, sentences),
    steps,
    checklist,
    articles,
    gaps,
    versions: [version, ...(previous?.versions ?? [])],
    body,
  }
}

export function updateBodyScore(document: OpsDocument, body: string): OpsDocument {
  const normalizedBody = normalizeGeneratedText(body)
  const bodyScore = Math.min(100, Math.max(40, Math.round(normalizedBody.length / 18)))
  const missingOwner = normalizedBody.toLowerCase().includes('owner') || normalizedBody.toLowerCase().includes('manager') ? 0 : 8
  const missingEscalation = normalizedBody.toLowerCase().includes('escalat') || normalizedBody.toLowerCase().includes('route') ? 0 : 8
  const score = Math.max(45, Math.min(98, Math.round((document.score + bodyScore) / 2) - missingOwner - missingEscalation))

  return {
    ...document,
    body: normalizedBody,
    score,
    risk: score >= 86 ? 'Low' : score >= 70 ? 'Medium' : 'High',
    lastRevised: today(),
  }
}

export function markGapFixed(document: OpsDocument, gapId: string): OpsDocument {
  const gaps = document.gaps.map((gap) => (gap.id === gapId ? { ...gap, status: 'Fixed' as const } : gap))
  const openHigh = gaps.some((gap) => gap.status === 'Open' && gap.severity === 'high')
  const fixedBoost = document.gaps.filter((gap) => gap.status === 'Open').length - gaps.filter((gap) => gap.status === 'Open').length
  const score = Math.min(98, document.score + fixedBoost * 4)

  return {
    ...document,
    gaps,
    score,
    risk: openHigh ? 'High' : score >= 86 ? 'Low' : score >= 70 ? 'Medium' : 'High',
  }
}

export function toggleTrainingItem(document: OpsDocument, itemId: string): OpsDocument {
  return {
    ...document,
    checklist: document.checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)),
  }
}

export function publishDocument(document: OpsDocument): OpsDocument {
  return {
    ...document,
    status: 'Published',
    lastRevised: today(),
    versions: [
      {
        id: createId('ver'),
        label: `v${document.versions.length + 1}.0`,
        author: 'Operations Manager',
        date: today(),
        changes: ['Published to team workspace', 'Locked current checklist state', 'Recorded document quality score'],
      },
      ...document.versions,
    ],
  }
}

export function createManualVersion(document: OpsDocument): OpsDocument {
  return {
    ...document,
    versions: [
      {
        id: createId('ver'),
        label: `v${document.versions.length + 1}.0`,
        author: 'Operations Manager',
        date: today(),
        changes: ['Saved edited draft', `Quality score recorded at ${document.score}`, `${document.gaps.filter((gap) => gap.status === 'Open').length} open gaps tracked`],
      },
      ...document.versions,
    ],
  }
}

export function toMarkdown(document: OpsDocument): string {
  const gapLines = document.gaps
    .map((gap) => `- [${gap.status === 'Fixed' ? 'x' : ' '}] ${normalizeGeneratedText(gap.title)}: ${normalizeGeneratedText(gap.fix)}`)
    .join('\n')
  const trainingLines = document.checklist
    .map(
      (item) =>
        `- [${item.done ? 'x' : ' '}] ${normalizeGeneratedText(item.task)} (${normalizeGeneratedText(item.owner)}, ${normalizeGeneratedText(item.due)})`,
    )
    .join('\n')
  const articleLines = document.articles
    .map(
      (article) =>
        `### ${normalizeGeneratedText(article.question)}\n${normalizeGeneratedText(article.answer)}\nTags: ${article.tags
          .map(normalizeGeneratedText)
          .join(', ')}`,
    )
    .join('\n\n')

  return `# ${normalizeGeneratedText(document.title)}

Business: ${normalizeGeneratedText(document.business)}
Department: ${normalizeGeneratedText(document.department)}
Owner: ${normalizeGeneratedText(document.owner)}
Status: ${document.status}
Score: ${document.score}
Risk: ${document.risk}
Last revised: ${document.lastRevised}

## Summary
${normalizeGeneratedText(document.summary)}

## Document
${normalizeGeneratedText(document.body)}

## Training Checklist
${trainingLines}

## Knowledge Base Articles
${articleLines}

## Open Gaps
${gapLines}
`
}

function normalizeIntake(intake: IntakeState): IntakeState {
  return {
    ...intake,
    business: normalizeGeneratedText(intake.business),
    role: normalizeGeneratedText(intake.role),
    department: normalizeGeneratedText(intake.department),
    priority: normalizeGeneratedText(intake.priority),
    sourceNotes: normalizeGeneratedText(intake.sourceNotes),
  }
}

function splitNotes(notes: string): string[] {
  return normalizeGeneratedText(notes)
    .split(/[.\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 8)
}

function buildSteps(intake: IntakeState, sentences: string[]): DocumentStep[] {
  const base = sentences.length > 0 ? sentences : ['Collect the source information', 'Confirm ownership', 'Record completion']
  const selected = base.slice(0, 6)

  return selected.map((sentence, index) => ({
    id: createId(`step-${index + 1}`),
    title: stepTitle(sentence, index),
    detail: normalizeGeneratedText(sentence.endsWith('.') ? sentence : `${sentence}.`),
    owner: inferOwner(sentence, intake),
    timing: index === 0 ? 'Start of workflow' : index === selected.length - 1 ? 'Before completion is approved' : 'During active handling',
  }))
}

function buildTrainingChecklist(intake: IntakeState, steps: DocumentStep[]): TrainingItem[] {
  const role = intake.role.trim() || 'Team Member'
  const starter: TrainingItem[] = [
    {
      id: createId('train-read'),
      task: `Review the ${intake.documentType.toLowerCase()} for ${intake.business} and explain the success criteria`,
      owner: role,
      due: 'Day 1',
      done: false,
    },
    {
      id: createId('train-shadow'),
      task: `Shadow one complete ${intake.department || 'operations'} workflow and record the handoff points`,
      owner: role,
      due: 'Day 2',
      done: false,
    },
  ]

  const stepItems = steps.slice(0, 4).map((step, index) => ({
    id: createId(`train-${index}`),
    task: `Demonstrate ${step.title.toLowerCase()} without manager prompts`,
    owner: step.owner,
    due: `Day ${index + 3}`,
    done: false,
  }))

  return [...starter, ...stepItems]
}

function buildKnowledgeArticles(intake: IntakeState, sentences: string[], steps: DocumentStep[]): KnowledgeArticle[] {
  const topic = intake.department || 'operations'
  const business = intake.business || 'the business'
  const questions = [
    `What does ${intake.role || 'the team'} need before starting the ${topic} workflow?`,
    `Who owns exceptions in ${topic}?`,
    `How does ${business} confirm completion?`,
  ]

  return questions.map((question, index) => ({
    id: createId(`article-${index}`),
    question,
    answer:
      index === 0
        ? `Start with ${steps[0]?.detail ?? sentences[0] ?? 'the current source notes'} Confirm required inputs and the expected output before the workflow moves forward.`
        : index === 1
          ? `Exceptions should be routed to ${steps.find((step) => step.owner.toLowerCase().includes('manager'))?.owner ?? 'the accountable manager'} with context, urgency, customer impact, and the next required action.`
          : `${business} should confirm completion by checking every required step, recording the owner, and saving final status in the team system of record.`,
    tags: [topic.toLowerCase().replace(/\s+/g, '-'), intake.documentType.toLowerCase().replace(/\s+/g, '-')],
  }))
}

function detectGaps(intake: IntakeState, steps: DocumentStep[]): GapFinding[] {
  const notes = intake.sourceNotes.toLowerCase()
  const gaps: GapFinding[] = []

  if (!ownerSignals.some((signal) => notes.includes(signal))) {
    gaps.push({
      id: createId('gap-owner'),
      severity: 'high',
      title: 'Missing owner',
      evidence: 'Source notes do not clearly identify who is accountable for the workflow.',
      fix: 'Assign one accountable role and one backup role.',
      status: 'Open',
    })
  }

  if (!escalationSignals.some((signal) => notes.includes(signal))) {
    gaps.push({
      id: createId('gap-escalation'),
      severity: 'medium',
      title: 'Escalation path is weak',
      evidence: 'The draft does not explain where exceptions or urgent cases go.',
      fix: 'Add escalation criteria, owner, expected response time, and handoff notes.',
      status: 'Open',
    })
  }

  if (!notes.includes('track') && !notes.includes('record') && !notes.includes('log')) {
    gaps.push({
      id: createId('gap-tracking'),
      severity: 'medium',
      title: 'Completion tracking is unclear',
      evidence: 'The workflow needs a system of record for completion, exceptions, and review state.',
      fix: 'Add where staff record completion and who audits the record.',
      status: 'Open',
    })
  }

  if (complianceSignals.some((signal) => notes.includes(signal)) && !notes.includes('review')) {
    gaps.push({
      id: createId('gap-review'),
      severity: 'low',
      title: 'Review cadence missing',
      evidence: 'Compliance-sensitive notes need a revision cadence and reviewer.',
      fix: 'Schedule quarterly review and name the approving manager.',
      status: 'Open',
    })
  }

  if (steps.length < 4) {
    gaps.push({
      id: createId('gap-detail'),
      severity: 'low',
      title: 'Procedure needs more detail',
      evidence: 'Fewer than four procedural steps were detected from the notes.',
      fix: 'Add inputs, outputs, exception handling, and quality checks.',
      status: 'Open',
    })
  }

  return gaps
}

function scoreDocument(intake: IntakeState, steps: DocumentStep[], gaps: GapFinding[]): number {
  const notes = intake.sourceNotes.toLowerCase()
  let score = 58

  score += Math.min(16, steps.length * 3)
  if (ownerSignals.some((signal) => notes.includes(signal))) score += 10
  if (escalationSignals.some((signal) => notes.includes(signal))) score += 8
  if (notes.includes('track') || notes.includes('record') || notes.includes('log')) score += 7
  if (complianceSignals.some((signal) => notes.includes(signal))) score += 4

  const penalty = gaps.reduce((sum, gap) => sum + (gap.severity === 'high' ? 13 : gap.severity === 'medium' ? 8 : 4), 0)
  return Math.max(42, Math.min(98, score - penalty))
}

function riskFromScore(score: number, gaps: GapFinding[]): RiskLevel {
  if (gaps.some((gap) => gap.severity === 'high')) return 'High'
  if (score >= 86) return 'Low'
  if (score >= 70) return 'Medium'
  return 'High'
}

function buildBody(intake: IntakeState, steps: DocumentStep[], gaps: GapFinding[]): string {
  const procedure = steps
    .map((step, index) => `${index + 1}. ${step.title}: ${step.detail} Owner: ${step.owner}. Timing: ${step.timing}.`)
    .join('\n')
  const owner = intake.role || 'Operations Owner'
  const department = intake.department || 'Operations'
  const business = intake.business || 'the business'
  const gapFocus = gaps[0]?.fix ?? 'confirm ownership, tracking, and escalation before publishing'
  const trigger = triggerFor(intake)
  const cadence = complianceSignals.some((signal) => intake.sourceNotes.toLowerCase().includes(signal))
    ? 'Review this document quarterly and after any policy, billing, compliance, or customer-impacting workflow change.'
    : 'Review this document monthly for the first two cycles, then every quarter after the workflow is stable.'

  return `Purpose
Convert ${department} knowledge into a repeatable ${intake.documentType.toLowerCase()} for ${business} so staff can complete work consistently, record ownership, and escalate exceptions without relying on informal memory.

Trigger
Use this procedure when ${trigger}

Owner
Primary owner: ${owner}. Backup reviewer: Operations Manager. The owner keeps the procedure current, verifies training completion, and confirms open gaps are reviewed before publishing.

Steps
${procedure}

Quality checks
- Required inputs are collected before work is marked complete.
- The accountable owner is recorded in the system of record.
- Exceptions include context, urgency, customer impact, and next action.
- Completion notes are clear enough for a manager to audit later.

Escalation path
Escalate blocked, urgent, compliance-sensitive, billing, safety, or customer-impacting exceptions to the Operations Manager the same business day. Include the document title, affected customer or work item, current owner, and requested decision.

Review cadence
${cadence}

Audit/version note
Save a new version after each material edit, publish only after open high-risk gaps are reviewed, and track this gap focus before handoff: ${gapFocus}.`
}

function buildSummary(intake: IntakeState, sentences: string[]): string {
  const first = sentences[0] ?? 'The team needs a documented workflow from rough internal knowledge.'
  return `${first.replace(/\.$/, '')}. ProcessHarbor structured it into a ${intake.documentType.toLowerCase()} with owners, training tasks, knowledge base answers, and gap findings.`
}

function buildTitle(intake: IntakeState): string {
  const department = intake.department.trim() || 'Operations'
  const suffix =
    intake.documentType === 'SOP'
      ? 'SOP'
      : intake.documentType === 'Training Checklist'
        ? 'Onboarding Checklist'
        : 'Knowledge Base'
  return `${department} ${suffix}`
}

function stepTitle(sentence: string, index: number): string {
  const cleaned = normalizeGeneratedText(sentence)
    .replace(/^(staff|team|customers|customer|new|if|dispatchers|coordinators|associates|managers)\s+/i, '')
    .replace(/^(need|needs|should|must|can)\s+to\s+/i, '')
    .replace(/^(need|needs|should|must|can)\s+/i, '')
    .replace(/[,;:].*$/, '')
    .trim()
  const fallback =
    ['Capture required inputs', 'Verify owner and handoff rules', 'Escalate exceptions', 'Record completion status', 'Review quality checks'][index] ??
    'Record completion'
  const signalTitle = titleFromSignal(cleaned, index)
  const title = signalTitle ?? (startsWithImperativeVerb(cleaned) ? cleaned : fallback)
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function inferOwner(sentence: string, intake: IntakeState): string {
  const lower = normalizeGeneratedText(sentence).toLowerCase()
  if (lower.includes('manager')) return 'Operations Manager'
  if (lower.includes('lead')) return 'Team Lead'
  if (lower.includes('tech')) return 'Field Technician'
  if (lower.includes('account')) return 'Account Lead'
  return intake.role.trim() || 'Operations Owner'
}

function triggerFor(intake: IntakeState): string {
  const type = intake.documentType.toLowerCase()
  if (intake.priority.toLowerCase().includes('compliance')) return `a ${type} touches compliance-sensitive records, approvals, consent, billing, or customer data.`
  if (intake.priority.toLowerCase().includes('revenue')) return `a ${type} affects scheduling, customer commitments, billing, or revenue-critical handoffs.`
  if (intake.priority.toLowerCase().includes('customer')) return `a ${type} is visible to customers or changes the support experience.`
  return `a ${type} needs repeatable handling across ${intake.department || 'operations'}.`
}

function titleFromSignal(sentence: string, index: number): string | undefined {
  const lower = sentence.toLowerCase()
  if (lower.includes('insurance') || lower.includes('consent') || lower.includes('forms')) return 'Collect required documents'
  if (lower.includes('hipaa') || lower.includes('acknowledgement')) return 'Verify compliance acknowledgement'
  if (lower.includes('appointment') || lower.includes('reminder')) return 'Confirm appointment reminders'
  if (lower.includes('billing') || lower.includes('question')) return 'Escalate billing questions'
  if (lower.includes('portal') || lower.includes('link')) return 'Send secure follow-up link'
  if (lower.includes('track') || lower.includes('record') || lower.includes('log')) return 'Record completion status'
  if (lower.includes('triage')) return 'Triage incoming requests'
  if (lower.includes('address')) return 'Confirm service details'
  if (lower.includes('customer')) return 'Update the customer'
  if (lower.includes('parts')) return 'Create follow-up task'
  if (lower.includes('approve')) return 'Confirm approval owner'
  if (index === 0 && lower.includes('inconsistent')) return 'Standardize intake requirements'
  return undefined
}

function startsWithImperativeVerb(sentence: string): boolean {
  return [
    'add',
    'assign',
    'call',
    'capture',
    'check',
    'collect',
    'complete',
    'confirm',
    'create',
    'document',
    'escalate',
    'explain',
    'log',
    'notify',
    'record',
    'request',
    'review',
    'route',
    'save',
    'send',
    'standardize',
    'track',
    'triage',
    'update',
    'verify',
  ].some((verb) => sentence.toLowerCase().startsWith(`${verb} `))
}

function buildVersion(previous?: OpsDocument): VersionEntry {
  return {
    id: createId('ver'),
    label: previous ? `v${previous.versions.length + 1}.0` : 'v1.0',
    author: 'ProcessHarbor',
    date: today(),
    changes: previous
      ? ['Regenerated document from updated intake', 'Refreshed gap detector', 'Rebuilt training and knowledge base outputs']
      : ['Generated first operations document', 'Created checklist and knowledge base draft', 'Scored documentation gaps'],
  }
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
