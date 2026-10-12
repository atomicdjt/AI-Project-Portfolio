import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const typescript = require('typescript')

const missingApi = []

if (typeof typescript.sys?.readFile !== 'function') {
  missingApi.push('ts.sys.readFile')
}

if (typeof typescript.readConfigFile !== 'function') {
  missingApi.push('ts.readConfigFile')
}

if (missingApi.length > 0) {
  console.error(
    `VariantVision's Vercel Node function requires the legacy TypeScript compiler API. Missing: ${missingApi.join(', ')}. Pin TypeScript to a compatible release (currently ~6.0.3).`,
  )
  process.exitCode = 1
}
