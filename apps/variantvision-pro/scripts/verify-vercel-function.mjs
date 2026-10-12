import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const typescript = require('typescript')
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = mkdtempSync(join(tmpdir(), 'variantvision-node-smoke-'))

try {
  const program = typescript.createProgram([join(appRoot, 'api/pubmed.ts')], {
    target: typescript.ScriptTarget.ES2023,
    module: typescript.ModuleKind.ESNext,
    moduleResolution: typescript.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    types: ['node'],
    rootDir: appRoot,
    outDir: output,
  })
  const result = program.emit()
  const diagnostics = [...typescript.getPreEmitDiagnostics(program), ...result.diagnostics]
  assert.equal(diagnostics.length, 0, typescript.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => appRoot,
    getCanonicalFileName: name => name,
    getNewLine: () => '\n',
  }))
  writeFileSync(join(output, 'package.json'), JSON.stringify({ type: 'module' }))
  const { default: handler } = await import(pathToFileURL(join(output, 'api/pubmed.js')).href)
  const headers = new Map()
  let body = ''
  const response = {
    statusCode: 0,
    setHeader(name, value) { headers.set(name.toLowerCase(), value) },
    end(value) { body = value },
  }
  await handler({ url: '/api/pubmed?ids=invalid', method: 'GET' }, response)
  assert.equal(response.statusCode, 400)
  assert.equal(headers.get('content-type'), 'application/json; charset=utf-8')
  assert.match(JSON.parse(body).error, /numeric PubMed IDs/)
  console.log('Compiled PubMed function loads in Node and returns JSON validation errors.')
} finally {
  rmSync(output, { recursive: true, force: true })
}
