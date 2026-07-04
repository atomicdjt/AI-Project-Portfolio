import { z } from 'zod'

export const documentTypeSchema = z.enum(['SOP', 'Training Checklist', 'Knowledge Base'])
export const documentStatusSchema = z.enum(['Draft', 'In Review', 'Published'])
export const workspaceRoleSchema = z.enum(['owner', 'admin', 'editor', 'viewer'])
export const gapSeveritySchema = z.enum(['high', 'medium', 'low'])

export const intakeSchema = z.object({
  business: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(120),
  documentType: documentTypeSchema,
  priority: z.string().trim().min(2).max(120),
  sourceNotes: z.string().trim().min(20).max(10000),
})

export const documentUpdateSchema = z
  .object({
    body: z.string().trim().min(20).max(30000).optional(),
    status: documentStatusSchema.optional(),
    gapId: z.string().trim().min(3).optional(),
    trainingItemId: z.string().trim().min(3).optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'At least one document update field is required.',
  })

export const workspaceSessionSchema = z.object({
  userId: z.string().trim().min(2),
  organizationId: z.string().trim().min(2),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  role: workspaceRoleSchema,
  authenticated: z.boolean(),
})

export const apiRouteSchema = z.enum([
  'health',
  'listDocuments',
  'aiGenerate',
  'createDocument',
  'updateDocument',
  'createVersion',
  'publishDocument',
  'fixGap',
  'toggleTraining',
  'listAuditEvents',
  'exportWorkspace',
])

export const supportedApiRoutes = apiRouteSchema.options

export const aiDraftSchema = z.object({
  title: z.string().trim().min(4).max(160),
  summary: z.string().trim().min(20).max(600),
  body: z.string().trim().min(200).max(30000),
  steps: z
    .array(
      z.object({
        title: z.string().trim().min(3).max(120),
        detail: z.string().trim().min(12).max(500),
        owner: z.string().trim().min(2).max(120),
        timing: z.string().trim().min(2).max(160),
      }),
    )
    .min(3)
    .max(8),
  checklist: z
    .array(
      z.object({
        task: z.string().trim().min(8).max(220),
        owner: z.string().trim().min(2).max(120),
        due: z.string().trim().min(2).max(80),
      }),
    )
    .min(3)
    .max(8),
  articles: z
    .array(
      z.object({
        question: z.string().trim().min(8).max(220),
        answer: z.string().trim().min(20).max(1200),
        tags: z.array(z.string().trim().min(2).max(40)).min(1).max(6),
      }),
    )
    .min(2)
    .max(6),
  gaps: z
    .array(
      z.object({
        severity: gapSeveritySchema,
        title: z.string().trim().min(4).max(160),
        evidence: z.string().trim().min(12).max(400),
        fix: z.string().trim().min(12).max(400),
      }),
    )
    .max(8),
})
