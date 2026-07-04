import {
  createManualVersion,
  generateDocument,
  markGapFixed,
  publishDocument,
  toggleTrainingItem,
  toMarkdown,
  updateBodyScore,
} from '../src/opsEngine'
import { documentUpdateSchema, intakeSchema, supportedApiRoutes, workspaceSessionSchema } from '../src/schemas'
import type { ExportBundle, IntakeState, OpsDocument, WorkspaceRole, WorkspaceSession } from '../src/types'
import { forbidden, notFound } from './errors'
import { createSeedRepository, type OpsPilotRepository } from './repository'

const writeRoles: WorkspaceRole[] = ['owner', 'admin', 'editor']
const adminRoles: WorkspaceRole[] = ['owner', 'admin']

export interface OpsPilotHealthStatus {
  ok: true
  app: 'OpsPilot Pro'
  mode: 'seeded-reference-api'
  deployment: 'netlify-functions'
  persistence: 'in-memory-seeded-reference'
  auth: 'demo-session-simulation'
  productionReady: false
  supportedRoutes: string[]
  timestamp: string
}

export class OpsPilotApi {
  readonly repository: OpsPilotRepository

  constructor(repository: OpsPilotRepository = createSeedRepository()) {
    this.repository = repository
  }

  health(): OpsPilotHealthStatus {
    return {
      ok: true,
      app: 'OpsPilot Pro',
      mode: 'seeded-reference-api',
      deployment: 'netlify-functions',
      persistence: 'in-memory-seeded-reference',
      auth: 'demo-session-simulation',
      productionReady: false,
      supportedRoutes: [...supportedApiRoutes],
      timestamp: new Date().toISOString(),
    }
  }

  listDocuments(session: WorkspaceSession): OpsDocument[] {
    const validSession = workspaceSessionSchema.parse(session)
    return this.repository.listDocuments(validSession.organizationId)
  }

  createDocument(session: WorkspaceSession, input: IntakeState): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    const validInput = intakeSchema.parse(input)
    const document = {
      ...generateDocument(validInput),
      organizationId: validSession.organizationId,
      createdBy: validSession.userId,
      updatedBy: validSession.userId,
    }
    this.repository.saveDocument(document)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'document.created',
      targetType: 'document',
      targetId: document.id,
      summary: `Created ${document.title}.`,
      metadata: { score: document.score, type: document.type },
    })
    return document
  }

  updateDocument(session: WorkspaceSession, documentId: string, update: { body: string }): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    const validUpdate = documentUpdateSchema.parse(update)
    const current = this.repository.getDocument(validSession.organizationId, documentId)
    const next = {
      ...updateBodyScore(current, validUpdate.body ?? current.body),
      updatedBy: validSession.userId,
      versions: [
        {
          id: createId('ver'),
          label: `v${current.versions.length + 1}.0`,
          author: validSession.name,
          date: today(),
          changes: ['Updated document body through validated API', 'Recalculated document quality score'],
        },
        ...current.versions,
      ],
    }
    this.repository.saveDocument(next)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'document.updated',
      targetType: 'document',
      targetId: documentId,
      summary: `Updated ${next.title}.`,
      metadata: { score: next.score, versionCount: next.versions.length },
    })
    return next
  }

  createVersion(session: WorkspaceSession, documentId: string): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    const current = this.repository.getDocument(validSession.organizationId, documentId)
    const next = { ...createManualVersion(current), updatedBy: validSession.userId }
    this.repository.saveDocument(next)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'version.created',
      targetType: 'version',
      targetId: next.versions[0]?.id ?? documentId,
      summary: `Saved a version snapshot for ${next.title}.`,
      metadata: { versionCount: next.versions.length },
    })
    return next
  }

  publishDocument(session: WorkspaceSession, documentId: string): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    const current = this.repository.getDocument(validSession.organizationId, documentId)
    const next = { ...publishDocument(current), updatedBy: validSession.userId }
    this.repository.saveDocument(next)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'document.published',
      targetType: 'document',
      targetId: documentId,
      summary: `Published ${next.title}.`,
      metadata: { status: next.status },
    })
    return next
  }

  fixGap(session: WorkspaceSession, documentId: string, gapId: string): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    documentUpdateSchema.parse({ gapId })
    const current = this.repository.getDocument(validSession.organizationId, documentId)
    if (!current.gaps.some((gap) => gap.id === gapId)) {
      throw notFound('Gap finding not found in this document.')
    }
    const next = { ...markGapFixed(current, gapId), updatedBy: validSession.userId }
    this.repository.saveDocument(next)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'gap.fixed',
      targetType: 'gap',
      targetId: gapId,
      summary: `Marked a gap fixed for ${next.title}.`,
      metadata: { openGaps: next.gaps.filter((gap) => gap.status === 'Open').length },
    })
    return next
  }

  toggleTraining(session: WorkspaceSession, documentId: string, trainingItemId: string): OpsDocument {
    const validSession = workspaceSessionSchema.parse(session)
    ensureWriteAccess(validSession)
    documentUpdateSchema.parse({ trainingItemId })
    const current = this.repository.getDocument(validSession.organizationId, documentId)
    if (!current.checklist.some((item) => item.id === trainingItemId)) {
      throw notFound('Training item not found in this document.')
    }
    const next = { ...toggleTrainingItem(current, trainingItemId), updatedBy: validSession.userId }
    this.repository.saveDocument(next)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'training.updated',
      targetType: 'training',
      targetId: trainingItemId,
      summary: `Updated training checklist for ${next.title}.`,
      metadata: { completed: next.checklist.filter((item) => item.done).length },
    })
    return next
  }

  listAuditEvents(session: WorkspaceSession) {
    const validSession = workspaceSessionSchema.parse(session)
    return this.repository.listAuditEvents(validSession.organizationId)
  }

  exportWorkspace(session: WorkspaceSession): ExportBundle & { markdown: string } {
    const validSession = workspaceSessionSchema.parse(session)
    ensureAdminAccess(validSession)
    const beforeExport = this.repository.exportWorkspace(validSession)
    this.repository.appendAudit({
      organizationId: validSession.organizationId,
      actorId: validSession.userId,
      actorName: validSession.name,
      action: 'workspace.exported',
      targetType: 'export',
      targetId: beforeExport.organization.id,
      summary: `Exported ${beforeExport.documents.length} documents and ${beforeExport.auditEvents.length + 1} audit events.`,
      metadata: { documents: beforeExport.documents.length, auditEvents: beforeExport.auditEvents.length + 1 },
    })
    const bundle = this.repository.exportWorkspace(validSession)
    const markdown = bundle.documents.map((document) => toMarkdown(document)).join('\n\n---\n\n')
    return { ...bundle, markdown }
  }
}

export const demoAdminSession: WorkspaceSession = {
  userId: 'seed-admin',
  organizationId: 'org-brightline-demo',
  name: 'Avery Morgan',
  email: 'avery@example.com',
  role: 'admin',
  authenticated: true,
}

export const demoViewerSession: WorkspaceSession = {
  ...demoAdminSession,
  userId: 'seed-viewer',
  name: 'Jordan Viewer',
  email: 'viewer@example.com',
  role: 'viewer',
}

function ensureWriteAccess(session: WorkspaceSession) {
  if (!session.authenticated || !writeRoles.includes(session.role)) {
    throw forbidden('Write access requires an authenticated owner, admin, or editor.')
  }
}

function ensureAdminAccess(session: WorkspaceSession) {
  if (!session.authenticated || !adminRoles.includes(session.role)) {
    throw forbidden('Workspace export requires an authenticated owner or admin.')
  }
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
