import type { Context } from '@netlify/functions'
import { describe, expect, it } from 'vitest'
import handler from '../netlify/functions/api'

describe('OpsPilot Netlify API function', () => {
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
})
