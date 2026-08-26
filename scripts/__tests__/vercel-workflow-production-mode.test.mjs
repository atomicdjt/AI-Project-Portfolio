import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const workflow = readFileSync(new URL('../../.github/workflows/vercel-affected-plan.yml', import.meta.url), 'utf8').replaceAll('\r\n', '\n')

test('manual dispatch defaults to preview and exposes an explicit production target', () => {
  assert.match(workflow, /deployment_target:\n\s+description:.*\n\s+required: true\n\s+default: preview\n\s+type: choice\n\s+options:\n\s+- preview\n\s+- production/)
})

test('manual production is gated to an explicit project on main with execution and orchestration enabled', () => {
  for (const requirement of [
    "github.event_name == 'workflow_dispatch'",
    "inputs.execute_deployment == true",
    "inputs.deployment_target == 'production'",
    "inputs.project_id != 'auto'",
    "github.ref == 'refs/heads/main'",
    "vars.VERCEL_DEPLOYMENT_ORCHESTRATION_ENABLED == 'true'",
  ]) assert.ok(workflow.includes(requirement), `Missing production gate: ${requirement}`)
})

test('production mode drives Vercel pull, build, and deploy while pull requests remain plan-only', () => {
  assert.match(workflow, /PRODUCTION_DEPLOYMENT:/)
  assert.match(workflow, /if \[\[ "\$PRODUCTION_DEPLOYMENT" == "true" \]\]; then/)
  assert.match(workflow, /--environment="\$environment"/)
  assert.equal((workflow.match(/production_flag="--prod"/g) ?? []).length, 2)
  assert.match(workflow, /vercel@\$VERCEL_CLI_VERSION" build \\\n+\s+\$production_flag/)
  assert.match(workflow, /vercel@\$VERCEL_CLI_VERSION" deploy \\\n+\s+--prebuilt \\\n+\s+\$production_flag/)
  assert.match(workflow, /github\.event_name != 'pull_request'/)
  assert.doesNotMatch(workflow, /if \[\[ "\$\{\{ github\.event_name \}\}" == "push"/)
})

test('production smoke uses the canonical public alias instead of the protected deployment URL', () => {
  assert.equal((workflow.match(/verification_url="\$\{\{ matrix\.productionUrl \}\}"/g) ?? []).length, 2)
  assert.match(workflow, /verification_url="\$DEPLOYMENT_URL"/)
  assert.match(workflow, /verification_url="\$\{verification_url%\//)
})
