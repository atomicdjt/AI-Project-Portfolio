import type { Config, Context } from '@netlify/functions'
import { OpsPilotApi, demoAdminSession } from '../../server/api'
import { toErrorBody } from '../../server/errors'
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
    const data = dispatch(route, session, payload)
    return json(200, { data })
  } catch (error) {
    const body = toErrorBody(error)
    return json(body.statusCode, body.body)
  }
}

export const config: Config = {
  path: '/api/:route',
}

async function parsePayload(request: Request): Promise<ApiPayload> {
  if (request.method === 'GET') return {}
  const text = await request.text()
  if (!text.trim()) return {}
  return JSON.parse(text) as ApiPayload
}

function dispatch(route: string, session: WorkspaceSession, payload: ApiPayload) {
  if (route === 'listDocuments') return api.listDocuments(session)
  if (route === 'createDocument') return api.createDocument(session, payload.intake as never)
  if (route === 'updateDocument') return api.updateDocument(session, String(payload.documentId), payload.update as never)
  if (route === 'createVersion') return api.createVersion(session, String(payload.documentId))
  if (route === 'publishDocument') return api.publishDocument(session, String(payload.documentId))
  if (route === 'fixGap') return api.fixGap(session, String(payload.documentId), String(payload.gapId))
  if (route === 'toggleTraining') return api.toggleTraining(session, String(payload.documentId), String(payload.trainingItemId))
  if (route === 'listAuditEvents') return api.listAuditEvents(session)
  return api.exportWorkspace(session)
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
