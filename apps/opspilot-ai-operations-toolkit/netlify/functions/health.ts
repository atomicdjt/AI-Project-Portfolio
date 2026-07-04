import type { Config } from '@netlify/functions'
import { ProcessHarborApi } from '../../server/api'

export default async function handler(): Promise<Response> {
  const api = new ProcessHarborApi()
  return new Response(JSON.stringify(api.health()), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}

export const config: Config = {
  path: '/api/health',
}
