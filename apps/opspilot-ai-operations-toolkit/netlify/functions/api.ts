import type { Config, Context } from '@netlify/functions'
import { OpsPilotApi, demoAdminSession } from '../../server/api'
import { badRequest, toErrorBody } from '../../server/errors'
import { apiRouteSchema } from '../../src/schemas'
import type { WorkspaceSession } from '../../src/types'

const api = new OpsPilotApi()

interface ApiPayload {
  session?: WorkspaceSession
  documentId?: unknown
  gapId?: unknown
  trainingItemId?: unknown
  intake?: unknown
  update?: unknown
}

export default async function handler(request: Request, context: Context): Promise<Response> {
  try {
    const route = apiRouteSchema.parse(context.params.route ?? new URL(request.url).pathname.split('/').filter(Boolean).at(-1))
    const payload = await parsePayload(request)
    const session = payload.session ?? demoAdminSession
    const data = await dispatch(route, session, payload, request, context)
    return json(200, { data })
  } catch (error) {
    const body = toErrorBody(error)
    return json(body.statusCode, body.body)
  }
}

export const config: Config = {
  path: [
    '/api/listDocuments',
    '/api/aiGenerate',
    '/api/createDocument',
    '/api/updateDocument',
    '/api/createVersion',
    '/api/publishDocument',
    '/api/fixGap',
    '/api/toggleTraining',
    '/api/listAuditEvents',
    '/api/exportWorkspace',
  ],
}

async function parsePayload(request: Request): Promise<ApiPayload> {
  if (request.method === 'GET') return {}
  const text = await request.text()
  if (!text.trim()) return {}
  try {
    return JSON.parse(text) as ApiPayload
  } catch {
    throw badRequest('Request body must be valid JSON.')
  }
}

async function dispatch(route: string, session: WorkspaceSession, payload: ApiPayload, request: Request, context: Context) {
  if (route === 'health') return api.health()
  if (route === 'listDocuments') return api.listDocuments(session)
  if (route === 'aiGenerate') return api.aiGenerate(session, payload.intake as never, { rateLimitKey: rateLimitKey(request, context, session) })
  if (route === 'createDocument') return api.createDocument(session, payload.intake as never)
  if (route === 'updateDocument') return api.updateDocument(session, String(payload.documentId), payload.update as never)
  if (route === 'createVersion') return api.createVersion(session, String(payload.documentId))
  if (route === 'publishDocument') return api.publishDocument(session, String(payload.documentId))
  if (route === 'fixGap') return api.fixGap(session, String(payload.documentId), String(payload.gapId))
  if (route === 'toggleTraining') return api.toggleTraining(session, String(payload.documentId), String(payload.trainingItemId))
  if (route === 'listAuditEvents') return api.listAuditEvents(session)
  return api.exportWorkspace(session)
}

function rateLimitKey(request: Request, context: Context, session: WorkspaceSession): string {
  const contextWithIp = context as Context & { ip?: string }
  return (
    contextWithIp.ip ??
    request.headers.get('x-nf-client-connection-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    `${session.organizationId}:${session.userId}`
  )
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
