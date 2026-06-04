import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import clsx from 'clsx'
import {
  AlertTriangle,
  Bot,
  Check,
  Copy,
  Download,
  KeyRound,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  SendHorizontal,
  Settings2,
  Square,
  Trash2,
  User,
} from 'lucide-react'
import './App.css'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: Role
  content: string
  createdAt: number
}

type ModelOption = {
  id: string
  name: string
  description: string
}

type ProviderConfig = {
  provider: string
  configured: boolean
  models: ModelOption[]
  defaultModel: string
  setupUrl: string
}

type ChatSettings = {
  model: string
  temperature: number
  systemPrompt: string
}

type StoredState = {
  messages: ChatMessage[]
  settings: ChatSettings
}

const stateKey = 'astra-chat-state-v1'
const defaultModel = 'gemini-3-flash-preview'
const defaultSystemPrompt =
  'You are Astra, a careful and capable AI assistant. Be direct, technically precise, and useful. Ask for missing constraints only when a reasonable assumption would be risky.'

const starterPrompts = [
  'Turn this rough idea into an execution plan',
  'Review this code and find risks',
  'Explain a difficult topic clearly',
  'Draft a precise professional response',
]

const makeId = () => crypto.randomUUID()
const makeTimestamp = () => new Date().getTime()

const loadState = (): StoredState => {
  const fallback: StoredState = {
    messages: [],
    settings: {
      model: defaultModel,
      temperature: 0.7,
      systemPrompt: defaultSystemPrompt,
    },
  }

  try {
    const raw = localStorage.getItem(stateKey)
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      settings: {
        ...fallback.settings,
        ...(parsed.settings ?? {}),
      },
    }
  } catch {
    return fallback
  }
}

function App() {
  const stored = useMemo(() => loadState(), [])
  const [messages, setMessages] = useState<ChatMessage[]>(stored.messages)
  const [settings, setSettings] = useState<ChatSettings>(stored.settings)
  const [config, setConfig] = useState<ProviderConfig | null>(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const modelOptions = config?.models ?? [
    {
      id: defaultModel,
      name: 'Gemini 3 Flash Preview',
      description: 'Fast frontier model for general chat, planning, and drafting.',
    },
  ]
  const activeModel = modelOptions.find((model) => model.id === settings.model)
  const selectedModel = activeModel ?? modelOptions[0]

  useEffect(() => {
    let ignore = false

    fetch('/api/config')
      .then((response) => response.json())
      .then((nextConfig: ProviderConfig) => {
        if (ignore) {
          return
        }

        setConfig(nextConfig)
        setSettings((current) => {
          const modelExists = nextConfig.models.some((model) => model.id === current.model)
          return modelExists ? current : { ...current, model: nextConfig.defaultModel }
        })
      })
      .catch(() => {
        if (!ignore) {
          setError('The local API server is not reachable.')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(stateKey, JSON.stringify({ messages, settings }))
  }, [messages, settings])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isSending])

  const sendMessages = async (nextMessages: ChatMessage[]) => {
    const assistantId = makeId()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: makeTimestamp(),
    }

    setMessages([...nextMessages, assistantMessage])
    setIsSending(true)
    setError('')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          settings: {
            ...settings,
            model: selectedModel.id,
          },
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'The model request failed.')
      }

      if (!response.body) {
        throw new Error('The model did not return a stream.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const rawEvent of events) {
          const parsed = parseServerEvent(rawEvent)
          if (!parsed) {
            continue
          }

          if (parsed.event === 'chunk') {
            const text = typeof parsed.data.text === 'string' ? parsed.data.text : ''
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + text }
                  : message,
              ),
            )
          }

          if (parsed.event === 'error') {
            throw new Error(parsed.data.error || 'The model request failed.')
          }
        }
      }
    } catch (caught) {
      if ((caught as Error).name === 'AbortError') {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId && !message.content
              ? { ...message, content: 'Stopped.' }
              : message,
          ),
        )
      } else {
        const message = caught instanceof Error ? caught.message : 'The request failed.'
        setError(message)
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? { ...item, content: `Request failed: ${message}` }
              : item,
          ),
        )
      }
    } finally {
      abortRef.current = null
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const content = input.trim()
    if (!content || isSending) {
      return
    }

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content,
      createdAt: makeTimestamp(),
    }

    const nextMessages = [...messages, userMessage]
    setInput('')
    void sendMessages(nextMessages)
  }

  const retryFrom = (index: number) => {
    if (isSending) {
      return
    }

    const nextMessages = messages.slice(0, index).filter((message) => message.content)
    if (nextMessages[nextMessages.length - 1]?.role !== 'user') {
      return
    }

    void sendMessages(nextMessages)
  }

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const copyMessage = async (message: ChatMessage) => {
    await navigator.clipboard.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(''), 1200)
  }

  const exportTranscript = () => {
    const markdown = messages
      .map((message) => {
        const role = message.role === 'user' ? 'User' : 'Astra'
        return `## ${role}\n\n${message.content}`
      })
      .join('\n\n')

    const blob = new Blob([markdown || '# Astra chat\n'], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `astra-chat-${new Date().toISOString().slice(0, 10)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    abortRef.current?.abort()
    setMessages([])
    setError('')
    setInput('')
  }

  return (
    <main className="app-shell">
      <section className="chat-workspace">
        <header className="topbar">
          <div className="identity">
            <div className="brand-mark" aria-hidden="true">
              <Bot size={21} />
            </div>
            <div>
              <h1>Astra</h1>
              <p>{selectedModel.name}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <span className={clsx('status-pill', config?.configured ? 'ready' : 'missing')}>
              {config?.configured ? <Check size={15} /> : <KeyRound size={15} />}
              {config?.configured ? 'Live' : 'Key needed'}
            </span>
            <button type="button" className="icon-button" onClick={clearChat} title="New chat">
              <Plus size={18} />
            </button>
            <button type="button" className="icon-button" onClick={exportTranscript} title="Export transcript">
              <Download size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setSettingsOpen((open) => !open)}
              title={settingsOpen ? 'Hide settings' : 'Show settings'}
            >
              {settingsOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </button>
          </div>
        </header>

        {config && !config.configured && (
          <div className="setup-banner" role="status">
            <AlertTriangle size={18} />
            <span>
              Set <code>GEMINI_API_KEY</code> in <code>.env.local</code>.
            </span>
            <a href={config.setupUrl} target="_blank" rel="noreferrer">
              Open AI Studio
            </a>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-mark" aria-hidden="true">
                <Bot size={36} />
              </div>
              <h2>Astra is ready.</h2>
              <div className="starter-grid">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => setInput(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <article key={message.id} className={clsx('message', message.role)}>
                <div className="message-avatar" aria-hidden="true">
                  {message.role === 'user' ? <User size={17} /> : <Bot size={17} />}
                </div>
                <div className="message-body">
                  <div className="message-meta">
                    <strong>{message.role === 'user' ? 'You' : 'Astra'}</strong>
                    <span>{formatTime(message.createdAt)}</span>
                  </div>
                  <div className="markdown">
                    {message.content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    ) : (
                      <span className="typing">Thinking</span>
                    )}
                  </div>
                  <div className="message-actions">
                    <button type="button" onClick={() => void copyMessage(message)} title="Copy message">
                      {copiedId === message.id ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    {message.role === 'assistant' && index > 0 && (
                      <button
                        type="button"
                        onClick={() => retryFrom(index)}
                        disabled={isSending}
                        title="Retry response"
                      >
                        <RotateCcw size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
          <div ref={scrollRef} />
        </section>

        <form className="composer" onSubmit={submit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onComposerKeyDown}
            rows={1}
            placeholder="Message Astra"
            aria-label="Message Astra"
          />
          {isSending ? (
            <button type="button" className="send-button stop" onClick={() => abortRef.current?.abort()} title="Stop">
              <Square size={18} />
            </button>
          ) : (
            <button type="submit" className="send-button" disabled={!input.trim()} title="Send message">
              <SendHorizontal size={18} />
            </button>
          )}
        </form>
      </section>

      {settingsOpen && (
        <aside className="settings-panel">
          <div className="panel-heading">
            <Settings2 size={18} />
            <h2>Settings</h2>
          </div>

          <label className="field">
            <span>Model</span>
            <select
              value={selectedModel.id}
              onChange={(event) => setSettings((current) => ({ ...current, model: event.target.value }))}
            >
              {modelOptions.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>

          <div className="model-note">{selectedModel.description}</div>

          <label className="field">
            <span>Creativity</span>
            <div className="range-row">
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={settings.temperature}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, temperature: Number(event.target.value) }))
                }
              />
              <output>{settings.temperature.toFixed(1)}</output>
            </div>
          </label>

          <label className="field">
            <span>Behavior</span>
            <textarea
              value={settings.systemPrompt}
              onChange={(event) => setSettings((current) => ({ ...current, systemPrompt: event.target.value }))}
              rows={8}
            />
          </label>

          <button
            type="button"
            className="danger-button"
            onClick={() => setSettings((current) => ({ ...current, systemPrompt: defaultSystemPrompt }))}
          >
            <Trash2 size={16} />
            Reset behavior
          </button>
        </aside>
      )}
    </main>
  )
}

function parseServerEvent(rawEvent: string) {
  const lines = rawEvent.split('\n')
  const eventLine = lines.find((line) => line.startsWith('event:'))
  const dataLine = lines.find((line) => line.startsWith('data:'))

  if (!eventLine || !dataLine) {
    return null
  }

  try {
    return {
      event: eventLine.slice(6).trim(),
      data: JSON.parse(dataLine.slice(5).trim()) as Record<string, string>,
    }
  } catch {
    return null
  }
}

function formatTime(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

export default App
