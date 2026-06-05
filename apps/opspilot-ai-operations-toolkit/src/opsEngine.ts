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

const ownerSignals = ['owner', 'manager', 'lead', 'coordinator', 'dispatcher', 'associate']
const complianceSignals = ['hipaa', 'consent', 'billing', 'warranty', 'payroll', 'approval', 'compliance']
const escalationSignals = ['escalate', 'route', 'follow-up', 'manager', 'lead', 'emergency']

export function generateDocument(intake: IntakeState, previous?: OpsDocument): OpsDocument {
  const sentences = splitNotes(intake.sourceNotes)
  const steps = buildSteps(intake, sentences)
  const checklist = buildTrainingChecklist(intake, steps)
  const articles = buildKnowledgeArticles(intake, sentences, steps)
  const gaps = detectGaps(intake, steps)
  const score = scoreDocument(intake, steps, gaps)
  const risk = riskFromScore(score, gaps)
  const title = buildTitle(intake)
  const body = buildBody(intake, steps, gaps)
  const version = buildVersion(previous)

  return {
    id: previous?.id ?? createId('doc'),
    title,
    type: intake.documentType,
    business: intake.business.trim() || 'Small Business',
    department: intake.department.trim() || 'Operations',
    owner: intake.role.trim() || 'Operations Owner',
    status: previous?.status ?? 'Draft',
    priority: intake.priority,
    score,
    risk,
    lastRevised: today(),
    summary: buildSummary(intake, sentences),
    steps,
    checklist,
    articles,
    gaps,
    versions: [version, ...(previous?.versions ?? [])],
    body,
  }
}

export function updateBodyScore(document: OpsDocument, body: string): OpsDocument {
  const bodyScore = Math.min(100, Math.max(40, Math.round(body.length / 18)))
  const missingOwner = body.toLowerCase().includes('owner') || body.toLowerCase().includes('manager') ? 0 : 8
  const missingEscalation = body.toLowerCase().includes('escalat') || body.toLowerCase().includes('route') ? 0 : 8
  const score = Math.max(45, Math.min(98, Math.round((document.score + bodyScore) / 2) - missingOwner - missingEscalation))

  return {
    ...document,
    body,
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
    .map((gap) => `- [${gap.status === 'Fixed' ? 'x' : ' '}] ${gap.title}: ${gap.fix}`)
    .join('\n')
  const trainingLines = document.checklist
    .map((item) => `- [${item.done ? 'x' : ' '}] ${item.task} (${item.owner}, ${item.due})`)
    .join('\n')
  const articleLines = document.articles
    .map((article) => `### ${article.question}\n${article.answer}\nTags: ${article.tags.join(', ')}`)
    .join('\n\n')

  return `# ${document.title}

Business: ${document.business}
Department: ${document.department}
Owner: ${document.owner}
Status: ${document.status}
Score: ${document.score}
Risk: ${document.risk}
Last revised: ${document.lastRevised}

## Summary
${document.summary}

## Document
${document.body}

## Training Checklist
${trainingLines}

## Knowledge Base Articles
${articleLines}

## Open Gaps
${gapLines}
`
}

function splitNotes(notes: string): string[] {
  return notes
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
    detail: sentence.endsWith('.') ? sentence : `${sentence}.`,
    owner: inferOwner(sentence, intake),
    timing: index === 0 ? 'Start of workflow' : index === selected.length - 1 ? 'Before completion is approved' : 'During active handling',
  }))
}

function buildTrainingChecklist(intake: IntakeState, steps: DocumentStep[]): TrainingItem[] {
  const role = intake.role.trim() || 'Team Member'
  const starter: TrainingItem[] = [
    {
      id: createId('train-read'),
      task: `Review the ${intake.documentType.toLowerCase()} and explain the success criteria`,
      owner: role,
      due: 'Day 1',
      done: false,
    },
    {
      id: createId('train-shadow'),
      task: `Shadow one complete ${intake.department || 'operations'} workflow`,
      owner: role,
      due: 'Day 2',
      done: false,
    },
  ]

  const stepItems = steps.slice(0, 4).map((step, index) => ({
    id: createId(`train-${index}`),
    task: `Demonstrate: ${step.title}`,
    owner: step.owner,
    due: `Day ${index + 3}`,
    done: false,
  }))

  return [...starter, ...stepItems]
}

function buildKnowledgeArticles(intake: IntakeState, sentences: string[], steps: DocumentStep[]): KnowledgeArticle[] {
  const topic = intake.department || 'operations'
  const questions = [
    `What does ${intake.role || 'the team'} need before starting this workflow?`,
    `Who owns exceptions in ${topic}?`,
    `How is completion tracked?`,
  ]

  return questions.map((question, index) => ({
    id: createId(`article-${index}`),
    question,
    answer:
      index === 0
        ? `Start with ${steps[0]?.detail ?? sentences[0] ?? 'the current source notes'} Confirm required inputs before the workflow moves forward.`
        : index === 1
          ? `Exceptions should be routed to ${steps.find((step) => step.owner.toLowerCase().includes('manager'))?.owner ?? 'the accountable manager'} with context, urgency, and customer impact.`
          : `Completion is tracked by confirming each required step, recording the owner, and saving the final status in the team system of record.`,
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
  const controls =
    gaps.length === 0
      ? 'Controls: Review this document monthly and archive each published version.'
      : `Controls: Review open gaps before publishing. Current gap focus: ${gaps[0]?.fix ?? 'confirm ownership'}.`

  return `Purpose: Convert ${intake.department || 'operations'} knowledge into a repeatable ${intake.documentType.toLowerCase()} for ${intake.business || 'the business'}.

Scope: ${intake.role || 'Team members'} and managers responsible for execution, training, review, and escalation.

Procedure:
${procedure}

Quality standard: Work is complete when required inputs are collected, the owner is recorded, exceptions are escalated, and the system of record is updated.

${controls}`
}

function buildSummary(intake: IntakeState, sentences: string[]): string {
  const first = sentences[0] ?? 'The team needs a documented workflow from rough internal knowledge.'
  return `${first.replace(/\.$/, '')}. OpsPilot structured it into a ${intake.documentType.toLowerCase()} with owners, training tasks, knowledge base answers, and gap findings.`
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
  const cleaned = sentence
    .replace(/^(staff|team|customers|customer|new|if)\s+/i, '')
    .replace(/[,;:].*$/, '')
    .trim()
  const fallback = ['Capture required inputs', 'Confirm the workflow owner', 'Complete the customer handoff'][index] ?? 'Record completion'
  const title = cleaned.length > 5 ? cleaned : fallback
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function inferOwner(sentence: string, intake: IntakeState): string {
  const lower = sentence.toLowerCase()
  if (lower.includes('manager')) return 'Operations Manager'
  if (lower.includes('lead')) return 'Team Lead'
  if (lower.includes('tech')) return 'Field Technician'
  if (lower.includes('account')) return 'Account Lead'
  return intake.role.trim() || 'Operations Owner'
}

function buildVersion(previous?: OpsDocument): VersionEntry {
  return {
    id: createId('ver'),
    label: previous ? `v${previous.versions.length + 1}.0` : 'v1.0',
    author: 'OpsPilot',
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
