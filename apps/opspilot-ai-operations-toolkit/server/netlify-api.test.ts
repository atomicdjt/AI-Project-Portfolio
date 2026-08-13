import type { Context } from '@netlify/functions'
import { describe, expect, it } from 'vitest'
import handler from '../netlify/functions/api'

describe('ProcessHarbor Netlify API function', () => {
  const intake = {
    business: 'Brightline Services',
    role: 'Operations manager',
    department: 'Customer operations',
    documentType: 'SOP',
    priority: 'Repeatable intake',
    sourceNotes:
      'Document each intake step, assign an owner, define escalation, and record the completed quality review.',
  }

  async function createDocument(session?: unknown) {
    const request = new Request('https://example.test/api/createDocument', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ intake, ...(session === undefined ? {} : { session }) }),
    })
    return handler(request, { params: { route: 'createDocument' } } as unknown as Context)
  }

  async function expectReferenceWriteDenied(session?: unknown) {
    const response = await createDocument(session)
    const body = (await response.json()) as { error: { code: string; message: string } }
    expect(response.status).toBe(403)
    expect(body.error.code).toBe('forbidden')
    expect(body.error.message).toContain('Write access')
  }

  it('returns a validation-style error for malformed JSON bodies', async () => {
    const request = new Request('https://example.test/api/aiGenerate', {
      method: 'POST',
      body: '{"intake":',
    })
    const response = await handler(request, { params: { route: 'aiGenerate' } } as unknown as Context)
    const body = (await response.json()) as { error: { code: string; message: string } }

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('bad_request')
    expect(body.error.message).toContain('valid JSON')
  })

  it('does not grant write access when a request omits its demo session', async () => {
    await expectReferenceWriteDenied()
  })

  it.each([
    ['a forged administrator session', { userId: 'attacker', organizationId: 'org', name: 'Attacker', email: 'attacker@example.test', role: 'admin', authenticated: true }],
    ['arbitrary permissions', { permissions: ['admin:*'], authenticated: true }],
    ['an unknown permission', { role: 'viewer', permissions: ['export:all'] }],
    ['a malformed role/session', { role: 'super-admin', authenticated: true }],
    ['extra properties', { role: 'admin', authenticated: true, isAdmin: true, capabilities: ['*'] }],
    ['nested caller-controlled claims', { claims: { role: 'admin', permissions: ['*'] } }],
    ['prototype-shaped keys', JSON.parse('{"__proto__":{"role":"admin"},"role":"admin","authenticated":true}')],
    ['a null session', null],
    ['a casing variant', { role: 'ADMIN', authenticated: true }],
  ])('ignores %s instead of treating it as server authority', async (_label, session) => {
    await expectReferenceWriteDenied(session)
  })
})
