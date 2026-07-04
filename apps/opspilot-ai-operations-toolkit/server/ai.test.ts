import { afterEach, describe, expect, it, vi } from 'vitest'
import { initialIntake } from '../src/data'
import { generateDocumentWithOptionalAi, resetAiRateLimitForTests } from './ai'
import { demoAdminSession } from './api'

describe('optional OpenAI generation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    resetAiRateLimitForTests()
  })

  it('falls back when configured model output fails schema validation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(JSON.stringify({ output_text: JSON.stringify({ title: 'Incomplete' }) }), { status: 200 })
      }),
    )

    const result = await generateDocumentWithOptionalAi(demoAdminSession, initialIntake, undefined, {
      env: {
        OPENAI_API_KEY: 'test-key',
        OPENAI_MODEL: 'test-model',
        PROCESSHARBOR_AI_ENABLED: 'true',
      },
      rateLimitKey: 'validation-test',
    })

    expect(result.generation.fallback).toBe(true)
    expect(result.generation.fallbackReason).toBe('invalid_model_output')
    expect(result.generation.validationStatus).toBe('failed')
    expect(result.document.body).toContain('Purpose')
  })
})
