import { generateDocument } from '../src/opsEngine'
import { aiDraftSchema, intakeSchema } from '../src/schemas'
import { normalizeGeneratedText, normalizePlainList } from '../src/textNormalization'
import type { AiGenerateResult, AiRuntimeStatus, GapSeverity, IntakeState, OpsDocument, WorkspaceSession } from '../src/types'

const defaultModel = 'gpt-4o-mini'
const route = '/api/aiGenerate'
const promptConstraints = [
  'Return strict JSON matching the OpsPilot document draft schema.',
  'Use plain text only; do not return HTML, Markdown tables, scripts, links, or escaped markup.',
  'Keep the result practical for a small-business operations manager.',
  'Include owners, timing, quality checks, escalation, review cadence, and audit/version guidance.',
  'Do not claim legal, medical, compliance, or HR authority.',
]

const rateLimitWindowMs = 60_000
const rateLimitMax = 8
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export interface AiEnvironment {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  OPSPILOT_AI_ENABLED?: string
}

interface AiGenerateOptions {
  env?: AiEnvironment
  rateLimitKey?: string
}

interface AiDraft {
  title: string
  summary: string
  body: string
  steps: Array<{ title: string; detail: string; owner: string; timing: string }>
  checklist: Array<{ task: string; owner: string; due: string }>
  articles: Array<{ question: string; answer: string; tags: string[] }>
  gaps: Array<{ severity: GapSeverity; title: string; evidence: string; fix: string }>
}

export function getAiRuntimeStatus(env: AiEnvironment = readAiEnvironment()): AiRuntimeStatus {
  const aiConfigured = Boolean(env.OPENAI_API_KEY?.trim())
  const aiEnabled = isEnabled(env.OPSPILOT_AI_ENABLED)

  return {
    aiConfigured,
    aiEnabled,
    aiProvider: aiConfigured && aiEnabled ? 'openai' : 'none',
    model: aiConfigured && aiEnabled ? env.OPENAI_MODEL?.trim() || defaultModel : null,
    fallback: 'deterministic',
  }
}

export async function generateDocumentWithOptionalAi(
  session: WorkspaceSession,
  input: IntakeState,
  previous?: OpsDocument,
  options: AiGenerateOptions = {},
): Promise<AiGenerateResult> {
  const started = Date.now()
  const validInput = intakeSchema.parse(input)
  const deterministic = generateDocument(validInput, previous)
  const env = options.env ?? readAiEnvironment()
  const status = getAiRuntimeStatus(env)
  const sanitizedConfig = createSanitizedConfig(status)
  const rateLimitKey = options.rateLimitKey ?? `${session.organizationId}:${session.userId}`

  if (!status.aiEnabled) {
    return withDiagnostics(deterministic, started, {
      ...status,
      sanitizedConfig,
      fallbackReason: 'ai_disabled',
      validationStatus: 'not_required',
      validationMessage: 'OPSPILOT_AI_ENABLED is not true, so deterministic generation handled the request.',
    })
  }

  if (!status.aiConfigured || !env.OPENAI_API_KEY) {
    return withDiagnostics(deterministic, started, {
      ...status,
      sanitizedConfig,
      fallbackReason: 'missing_api_key',
      validationStatus: 'not_required',
      validationMessage: 'OPENAI_API_KEY is not configured server-side, so deterministic generation handled the request.',
    })
  }

  if (!allowRequest(rateLimitKey)) {
    return withDiagnostics(deterministic, started, {
      ...status,
      sanitizedConfig,
      fallbackReason: 'rate_limited',
      validationStatus: 'not_required',
      validationMessage: 'The basic demo rate limit was reached, so deterministic generation handled the request.',
    })
  }

  try {
    const draft = await callOpenAi(validInput, env.OPENAI_API_KEY, status.model ?? defaultModel)
    const parsed = aiDraftSchema.safeParse(draft)

    if (!parsed.success) {
      return withDiagnostics(deterministic, started, {
        ...status,
        sanitizedConfig,
        fallbackReason: 'invalid_model_output',
        validationStatus: 'failed',
        validationMessage: parsed.error.issues.map((issue) => issue.message).join('; '),
      })
    }

    const document = mergeAiDraft(deterministic, parsed.data)
    return withDiagnostics(document, started, {
      ...status,
      sanitizedConfig,
      fallbackReason: undefined,
      validationStatus: 'passed',
      validationMessage: 'OpenAI structured output validated against the OpsPilot draft schema.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown OpenAI generation error.'
    return withDiagnostics(deterministic, started, {
      ...status,
      sanitizedConfig,
      fallbackReason: 'provider_error',
      validationStatus: 'failed',
      validationMessage: message,
    })
  }
}

export function resetAiRateLimitForTests() {
  rateLimitStore.clear()
}

function withDiagnostics(
  document: OpsDocument,
  started: number,
  context: AiRuntimeStatus & {
    sanitizedConfig: Record<string, string | number | boolean | null>
    fallbackReason?: string
    validationStatus: 'not_required' | 'passed' | 'failed'
    validationMessage?: string
  },
): AiGenerateResult {
  const fallback = Boolean(context.fallbackReason)

  return {
    document,
    generation: {
      mode: fallback ? 'fallback' : 'openai',
      route,
      provider: fallback ? 'deterministic' : 'openai',
      model: fallback ? null : context.model,
      aiConfigured: context.aiConfigured,
      aiEnabled: context.aiEnabled,
      fallback,
      fallbackReason: context.fallbackReason,
      validationStatus: context.validationStatus,
      validationMessage: context.validationMessage,
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      documentId: document.id,
      promptConstraints,
      sanitizedConfig: context.sanitizedConfig,
    },
  }
}

async function callOpenAi(input: IntakeState, apiKey: string, model: string): Promise<unknown> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: `You are OpsPilot Pro, an operations-documentation assistant. ${promptConstraints.join(' ')}`,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                business: input.business,
                role: input.role,
                department: input.department,
                documentType: input.documentType,
                priority: input.priority,
                sourceNotes: normalizeGeneratedText(input.sourceNotes),
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'opspilot_document_draft',
          strict: true,
          schema: aiDraftJsonSchema,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}.`)
  }

  const payload = (await response.json()) as Record<string, unknown>
  const outputText = extractOutputText(payload)
  return JSON.parse(outputText)
}

function extractOutputText(payload: Record<string, unknown>): string {
  if (typeof payload.output_text === 'string') return payload.output_text

  const output = Array.isArray(payload.output) ? payload.output : []
  for (const item of output) {
    if (!item || typeof item !== 'object') continue
    const content = Array.isArray((item as { content?: unknown }).content) ? (item as { content: unknown[] }).content : []
    for (const contentItem of content) {
      if (!contentItem || typeof contentItem !== 'object') continue
      const text = (contentItem as { text?: unknown }).text
      if (typeof text === 'string') return text
    }
  }

  throw new Error('OpenAI response did not include output text.')
}

function mergeAiDraft(base: OpsDocument, draft: AiDraft): OpsDocument {
  const gaps = draft.gaps.map((gap, index) => ({
    id: `ai-gap-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
    severity: gap.severity,
    title: normalizeGeneratedText(gap.title),
    evidence: normalizeGeneratedText(gap.evidence),
    fix: normalizeGeneratedText(gap.fix),
    status: 'Open' as const,
  }))
  const hasHighRiskGap = gaps.some((gap) => gap.severity === 'high')

  return {
    ...base,
    title: normalizeGeneratedText(draft.title),
    summary: normalizeGeneratedText(draft.summary),
    body: normalizeGeneratedText(draft.body),
    steps: draft.steps.map((step, index) => ({
      id: `ai-step-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      title: normalizeGeneratedText(step.title),
      detail: normalizeGeneratedText(step.detail),
      owner: normalizeGeneratedText(step.owner),
      timing: normalizeGeneratedText(step.timing),
    })),
    checklist: draft.checklist.map((item, index) => ({
      id: `ai-train-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      task: normalizeGeneratedText(item.task),
      owner: normalizeGeneratedText(item.owner),
      due: normalizeGeneratedText(item.due),
      done: false,
    })),
    articles: draft.articles.map((article, index) => ({
      id: `ai-article-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
      question: normalizeGeneratedText(article.question),
      answer: normalizeGeneratedText(article.answer),
      tags: normalizePlainList(article.tags),
    })),
    gaps: gaps.length > 0 ? gaps : base.gaps,
    risk: hasHighRiskGap ? 'High' : base.risk,
    versions: [
      {
        id: `ai-ver-${Math.random().toString(36).slice(2, 9)}`,
        label: `v${base.versions.length + 1}.0`,
        author: 'OpsPilot optional AI',
        date: new Date().toISOString().slice(0, 10),
        changes: ['Generated through optional server-side OpenAI route', 'Validated structured output before saving', 'Preserved deterministic fallback path'],
      },
      ...base.versions,
    ],
  }
}

function allowRequest(key: string): boolean {
  const now = Date.now()
  const current = rateLimitStore.get(key)
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs })
    return true
  }

  if (current.count >= rateLimitMax) return false
  current.count += 1
  return true
}

function createSanitizedConfig(status: AiRuntimeStatus): Record<string, string | number | boolean | null> {
  return {
    provider: status.aiProvider,
    model: status.model,
    aiConfigured: status.aiConfigured,
    aiEnabled: status.aiEnabled,
    fallback: status.fallback,
    secretVisibleToClient: false,
  }
}

function isEnabled(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes((value ?? '').trim().toLowerCase())
}

function readAiEnvironment(): AiEnvironment {
  return {
    OPENAI_API_KEY: readEnv('OPENAI_API_KEY'),
    OPENAI_MODEL: readEnv('OPENAI_MODEL'),
    OPSPILOT_AI_ENABLED: readEnv('OPSPILOT_AI_ENABLED'),
  }
}

function readEnv(name: keyof AiEnvironment): string | undefined {
  const netlifyValue = readNetlifyEnv(name)
  if (netlifyValue) return netlifyValue
  return process.env[name]
}

function readNetlifyEnv(name: keyof AiEnvironment): string | undefined {
  const candidate = globalThis as typeof globalThis & {
    Netlify?: { env?: { get?: (key: string) => string | undefined } }
  }
  try {
    return candidate.Netlify?.env?.get?.(name)
  } catch {
    return undefined
  }
}

const aiDraftJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'summary', 'body', 'steps', 'checklist', 'articles', 'gaps'],
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    body: { type: 'string' },
    steps: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'detail', 'owner', 'timing'],
        properties: {
          title: { type: 'string' },
          detail: { type: 'string' },
          owner: { type: 'string' },
          timing: { type: 'string' },
        },
      },
    },
    checklist: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['task', 'owner', 'due'],
        properties: {
          task: { type: 'string' },
          owner: { type: 'string' },
          due: { type: 'string' },
        },
      },
    },
    articles: {
      type: 'array',
      minItems: 2,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['question', 'answer', 'tags'],
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          tags: { type: 'array', minItems: 1, maxItems: 6, items: { type: 'string' } },
        },
      },
    },
    gaps: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'title', 'evidence', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          title: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
  },
}
