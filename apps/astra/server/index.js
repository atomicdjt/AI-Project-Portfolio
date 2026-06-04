import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env.local') })
dotenv.config({ path: path.join(rootDir, '.env') })

const app = express()
const port = Number(process.env.PORT || 3002)
const startedAt = new Date()

const models = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    description: 'Fast frontier model for general chat, planning, and drafting.',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Higher-reasoning model for complex analysis and coding.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Fast general-purpose model for long-context work.',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    description: 'Small model for concise everyday tasks.',
  },
]

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(24000),
      }),
    )
    .min(1)
    .max(30),
  settings: z
    .object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(1.5).optional(),
      systemPrompt: z.string().max(4000).optional(),
    })
    .optional(),
})

const defaultSystemPrompt = [
  'You are Astra, a careful and capable AI assistant.',
  'Be direct, technically precise, and useful.',
  'Ask for missing constraints only when a reasonable assumption would be risky.',
  'For code, provide runnable solutions and call out tradeoffs briefly.',
].join(' ')

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Astra chat',
    version: '1.0.0',
    startedAt: startedAt.toISOString(),
  })
})

app.get('/api/config', (_req, res) => {
  res.json({
    provider: 'Google Gemini',
    configured: Boolean(process.env.GEMINI_API_KEY),
    models,
    defaultModel: models[0].id,
    setupUrl: 'https://aistudio.google.com/app/apikey',
  })
})

app.post('/api/chat', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: 'The chat request was not valid.',
      details: parsed.error.flatten(),
    })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'Gemini is not configured.',
      action: 'Create a Gemini API key and set GEMINI_API_KEY in .env.local.',
      setupUrl: 'https://aistudio.google.com/app/apikey',
    })
  }

  const { messages, settings } = parsed.data
  const model = models.some((item) => item.id === settings?.model) ? settings.model : models[0].id

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  const send = (event, data) => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const contents = messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }))

    const stream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: settings?.systemPrompt?.trim() || defaultSystemPrompt,
        temperature: settings?.temperature ?? 0.7,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    })

    for await (const chunk of stream) {
      const text = chunk.text
      if (text) {
        send('chunk', { text })
      }
    }

    send('done', { ok: true })
    res.end()
  } catch (error) {
    const status = error?.status || error?.code
    const message =
      status === 429
        ? 'Gemini rate limit reached. Wait a moment and try again.'
        : error?.message || 'Gemini did not return a response.'

    send('error', { error: message })
    res.end()
  }
})

app.use(express.static(path.join(rootDir, 'dist')))

app.use((_req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Astra API listening on http://127.0.0.1:${port}`)
})
