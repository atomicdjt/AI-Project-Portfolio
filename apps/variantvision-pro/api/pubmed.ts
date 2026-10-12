import type { IncomingMessage, ServerResponse } from 'node:http'
import { getPubMedSummary } from '../server/pubmedSummary'

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const result = await getPubMedSummary(request.url ?? '/', request.method ?? 'GET')
  response.statusCode = result.status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (result.status === 405) response.setHeader('Allow', 'GET')
  response.end(JSON.stringify(result.body))
}
