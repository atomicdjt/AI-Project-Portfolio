import { initialIntake, seedDocuments } from '../src/data'
import { generateDocument } from '../src/opsEngine'
import type { AuditEvent, ExportBundle, OpsDocument, Organization, WorkspaceSession } from '../src/types'
import { notFound } from './errors'

export interface OpsPilotRepository {
  organization: Organization
  documents: Map<string, OpsDocument>
  auditEvents: AuditEvent[]
  listDocuments(organizationId: string): OpsDocument[]
  getDocument(organizationId: string, documentId: string): OpsDocument
  saveDocument(document: OpsDocument): OpsDocument
  appendAudit(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent
  listAuditEvents(organizationId: string): AuditEvent[]
  exportWorkspace(session: WorkspaceSession): ExportBundle
}

export class InMemoryOpsPilotRepository implements OpsPilotRepository {
  readonly organization: Organization
  readonly documents = new Map<string, OpsDocument>()
  readonly auditEvents: AuditEvent[] = []

  constructor(organization: Organization, documents: OpsDocument[]) {
    this.organization = organization
    documents.forEach((document) => {
      this.documents.set(document.id, {
        ...document,
        organizationId: organization.id,
        createdBy: document.createdBy ?? 'seed-admin',
        updatedBy: document.updatedBy ?? 'seed-admin',
      })
    })
  }

  listDocuments(organizationId: string): OpsDocument[] {
    return Array.from(this.documents.values()).filter((document) => document.organizationId === organizationId)
  }

  getDocument(organizationId: string, documentId: string): OpsDocument {
    const document = this.documents.get(documentId)
    if (!document || document.organizationId !== organizationId) {
      throw notFound('Document not found in this workspace.')
    }
    return document
  }

  saveDocument(document: OpsDocument): OpsDocument {
    this.documents.set(document.id, document)
    return document
  }

  appendAudit(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
    const auditEvent: AuditEvent = {
      ...event,
      id: createId('audit'),
      createdAt: new Date().toISOString(),
    }
    this.auditEvents.unshift(auditEvent)
    return auditEvent
  }

  listAuditEvents(organizationId: string): AuditEvent[] {
    return this.auditEvents.filter((event) => event.organizationId === organizationId)
  }

  exportWorkspace(session: WorkspaceSession): ExportBundle {
    return {
      organization: this.organization,
      exportedAt: new Date().toISOString(),
      exportedBy: {
        userId: session.userId,
        name: session.name,
        role: session.role,
      },
      documents: this.listDocuments(session.organizationId),
      auditEvents: this.listAuditEvents(session.organizationId),
    }
  }
}

export function createSeedRepository(): InMemoryOpsPilotRepository {
  const organization: Organization = {
    id: 'org-brightline-demo',
    name: 'Brightline Demo Operations',
    plan: 'pro',
    createdAt: '2026-06-05T00:00:00.000Z',
  }
  const generated = generateDocument(initialIntake)
  const documents = [
    ...seedDocuments,
    {
      ...generated,
      id: 'doc-generated-intake',
      organizationId: organization.id,
      createdBy: 'seed-admin',
      updatedBy: 'seed-admin',
    },
  ]

  const repository = new InMemoryOpsPilotRepository(organization, documents)
  repository.appendAudit({
    organizationId: organization.id,
    actorId: 'seed-admin',
    actorName: 'OpsPilot Seed',
    action: 'workspace.seeded',
    targetType: 'workspace',
    targetId: organization.id,
    summary: 'Seeded demo organization, documents, versions, training items, articles, gaps, and audit log.',
    metadata: { documents: documents.length },
  })
  return repository
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}
