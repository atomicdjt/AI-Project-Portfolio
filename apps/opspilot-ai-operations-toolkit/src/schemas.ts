import { z } from 'zod'

export const documentTypeSchema = z.enum(['SOP', 'Training Checklist', 'Knowledge Base'])
export const documentStatusSchema = z.enum(['Draft', 'In Review', 'Published'])
export const workspaceRoleSchema = z.enum(['owner', 'admin', 'editor', 'viewer'])

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
  'listDocuments',
  'createDocument',
  'updateDocument',
  'createVersion',
  'publishDocument',
  'fixGap',
  'toggleTraining',
  'listAuditEvents',
  'exportWorkspace',
])
