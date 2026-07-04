import { describe, expect, it } from 'vitest'
import { OpsPilotApi } from './api'
import { createSeedRepository } from './repository'

describe('OpsPilot Pro health API', () => {
  it('reports reviewer-friendly deployment and scope metadata', () => {
    const api = new OpsPilotApi(createSeedRepository(), { OPSPILOT_AI_ENABLED: 'false' })
    const health = api.health()

    expect(health.ok).toBe(true)
    expect(health.app).toBe('OpsPilot Pro')
    expect(health.mode).toBe('seeded-reference-api')
    expect(health.deployment).toBe('netlify-functions')
    expect(health.persistence).toBe('in-memory-seeded-reference')
    expect(health.auth).toBe('demo-session-simulation')
    expect(health.productionReady).toBe(false)
    expect(health.ai).toMatchObject({
      aiConfigured: false,
      aiEnabled: false,
      aiProvider: 'none',
      model: null,
      fallback: 'deterministic',
    })
    expect(health.supportedRoutes).toContain('health')
    expect(health.supportedRoutes).toContain('aiGenerate')
    expect(health.supportedRoutes).toContain('exportWorkspace')
    expect(() => new Date(health.timestamp).toISOString()).not.toThrow()
  })
})
