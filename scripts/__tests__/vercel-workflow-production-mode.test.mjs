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

test('deployment provenance carries and verifies the exact source SHA before smoke evidence is published', () => {
  assert.match(workflow, /name: Verify exact clean source checkout/)
  assert.match(workflow, /verify-source-checkout\.mjs/)
  assert.match(workflow, /SOURCE_SHA: \$\{\{ steps\.source-checkout\.outputs\.source-sha \}\}/)
  assert.match(workflow, /--meta "source_sha=\$SOURCE_SHA"/)
  assert.match(workflow, /name: Retrieve authoritative Vercel deployment metadata/)
  assert.match(workflow, /get-vercel-deployment\.mjs/)
  assert.match(workflow, /--slug "\$VERCEL_SCOPE"/)
  assert.doesNotMatch(workflow, /vercel@\$VERCEL_CLI_VERSION" inspect/)
  assert.match(workflow, /name: Verify deployment provenance/)
  assert.match(workflow, /--expected-target "\$expected_target"/)
  assert.match(workflow, /verify-vercel-deployment-provenance\.mjs/)
  assert.match(workflow, /name: Upload deployment provenance evidence/)
})

test('preview provenance omits the production-only canonical URL argument and still writes evidence', () => {
  const provenanceStep = workflow.match(/- name: Verify deployment provenance[\s\S]*?(?=\n\s*- name: Smoke-check deployed document)/)?.[0] ?? ''
  const previewArguments = provenanceStep
    .split('provenance_args=')[1]
    ?.split('if [[ "$PRODUCTION_DEPLOYMENT" == "true" ]]; then')[0] ?? ''

  assert.match(provenanceStep, /provenance_args=\(/)
  assert.match(provenanceStep, /if \[\[ "\$PRODUCTION_DEPLOYMENT" == "true" \]\]; then\n+\s+provenance_args\+=\(--canonical-url "\$\{\{ matrix\.productionUrl \}\}"\)/)
  assert.doesNotMatch(previewArguments, /--canonical-url/)
  assert.match(previewArguments, /--output deployment-provenance\.json/)
  assert.match(provenanceStep, /node scripts\/verify-vercel-deployment-provenance\.mjs "\$\{provenance_args\[@\]\}"/)
})

test('deployment evidence uploads after failures unless the job is cancelled', () => {
  const artifactStep = workflow.match(/- name: Upload deployment provenance evidence[\s\S]*$/)?.[0] ?? ''
  assert.match(artifactStep, /if: \$\{\{ !cancelled\(\) \}\}/)
  assert.match(artifactStep, /source-checkout-provenance\.json/)
})
