import { describe, expect, it } from 'vitest'
import { initialIntake } from '../src/data'
import { OpsPilotApi, demoAdminSession, demoViewerSession } from './api'
import { toApiError } from './errors'
import { createSeedRepository } from './repository'

function createApi() {
  return new OpsPilotApi(createSeedRepository(), { OPSPILOT_AI_ENABLED: 'false' })
}

describe('OpsPilot Pro API', () => {
  it('creates a validated document and audit event', () => {
    const api = createApi()
    const document = api.createDocument(demoAdminSession, initialIntake)
    const audits = api.listAuditEvents(demoAdminSession)

    expect(document.title).toContain('Patient Operations')
    expect(document.organizationId).toBe(demoAdminSession.organizationId)
    expect(audits.some((event) => event.action === 'document.created')).toBe(true)
  })

  it('creates through aiGenerate with deterministic fallback when AI is not enabled', async () => {
    const api = createApi()
    const result = await api.aiGenerate(demoAdminSession, initialIntake)
    const audits = api.listAuditEvents(demoAdminSession)

    expect(result.document.title).toContain('Patient Operations')
    expect(result.generation.route).toBe('/api/aiGenerate')
    expect(result.generation.fallback).toBe(true)
    expect(result.generation.fallbackReason).toBe('ai_disabled')
    expect(result.generation.sanitizedConfig.secretVisibleToClient).toBe(false)
    expect(audits.some((event) => event.action === 'document.generated_fallback')).toBe(true)
  })

  it('updates a document body and creates a version plus audit event', () => {
    const api = createApi()
    const document = api.createDocument(demoAdminSession, initialIntake)
    const updated = api.updateDocument(demoAdminSession, document.id, {
      body: `${document.body}\n\nManager review: confirm this SOP every quarter and record exceptions.`,
    })

    expect(updated.versions.length).toBe(document.versions.length + 1)
    expect(updated.updatedBy).toBe(demoAdminSession.userId)
    expect(api.listAuditEvents(demoAdminSession)[0]?.action).toBe('document.updated')
  })

  it('creates explicit version snapshots and publish events', () => {
    const api = createApi()
    const document = api.createDocument(demoAdminSession, initialIntake)
    const versioned = api.createVersion(demoAdminSession, document.id)
    const published = api.publishDocument(demoAdminSession, document.id)

    expect(versioned.versions[0]?.changes.join(' ')).toContain('Saved edited draft')
    expect(published.status).toBe('Published')
    expect(api.listAuditEvents(demoAdminSession).map((event) => event.action)).toContain('document.published')
  })

  it('exports documents and audit events for admins', () => {
    const api = createApi()
    api.createDocument(demoAdminSession, initialIntake)
    const bundle = api.exportWorkspace(demoAdminSession)

    expect(bundle.documents.length).toBeGreaterThan(0)
    expect(bundle.auditEvents.length).toBeGreaterThan(0)
    expect(bundle.auditEvents[0]?.action).toBe('workspace.exported')
    expect(bundle.markdown).toContain('#')
  })

  it('rejects invalid create input with validation details', () => {
    const api = createApi()
    let errorCode = ''

    try {
      api.createDocument(demoAdminSession, { ...initialIntake, sourceNotes: 'too short' })
    } catch (error) {
      errorCode = toApiError(error).code
    }

    expect(errorCode).toBe('validation_failed')
  })

  it('prevents viewer updates and workspace export', () => {
    const api = createApi()
    const document = api.listDocuments(demoAdminSession)[0]

    expect(() => api.updateDocument(demoViewerSession, document.id, { body: `${document.body}\nNew body text with enough detail.` })).toThrow(
      /Write access/,
    )
    expect(() => api.exportWorkspace(demoViewerSession)).toThrow(/owner or admin/)
  })

  it('prevents viewer aiGenerate requests', async () => {
    const api = createApi()

    await expect(api.aiGenerate(demoViewerSession, initialIntake)).rejects.toThrow(/Write access/)
  })

  it('updates training and gap status with audit records', () => {
    const api = createApi()
    const document = api.createDocument(demoAdminSession, initialIntake)
    const trainingId = document.checklist[0]?.id ?? ''
    const gapId = document.gaps[0]?.id ?? ''
    const trained = api.toggleTraining(demoAdminSession, document.id, trainingId)
    const fixed = api.fixGap(demoAdminSession, document.id, gapId)
    const actions = api.listAuditEvents(demoAdminSession).map((event) => event.action)

    expect(trained.checklist[0]?.done).toBe(true)
    expect(fixed.gaps[0]?.status).toBe('Fixed')
    expect(actions).toContain('training.updated')
    expect(actions).toContain('gap.fixed')
  })

  it('rejects invalid gap and training target ids', () => {
    const api = createApi()
    const document = api.createDocument(demoAdminSession, initialIntake)

    expect(() => api.toggleTraining(demoAdminSession, document.id, 'missing-training-item')).toThrow(/Training item not found/)
    expect(() => api.fixGap(demoAdminSession, document.id, 'missing-gap')).toThrow(/Gap finding not found/)
  })
})
