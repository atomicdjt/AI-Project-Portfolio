import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Connect } from 'vite'
import pubmedHandler from './api/pubmed'

const pubmedMiddleware: Connect.NextHandleFunction = (request, response, next) => {
  if (new URL(request.url ?? '/', 'http://localhost').pathname !== '/api/pubmed') return next()
  void pubmedHandler(request, response).catch(next)
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), {
    name: 'pubmed-metadata-endpoint',
    configureServer(server) { server.middlewares.use(pubmedMiddleware) },
    configurePreviewServer(server) { server.middlewares.use(pubmedMiddleware) },
  }],
})
