import type { GenomeBuild, VariantCase, VariantInput } from '../../types/variant'
import { parseRsId } from './normalizeVariant'

export function inputFromCase(variantCase: VariantCase, build = variantCase.build): VariantInput {
  return {
    gene: variantCase.gene,
    variant: variantCase.variant,
    ...variantCase.coordinatesByBuild[build],
    build,
    condition: variantCase.condition,
  }
}

export function isCaseIdentityMatch(input: VariantInput, variantCase: VariantCase): boolean {
  const expected = inputFromCase(variantCase, input.build)
  return input.gene.trim().toUpperCase() === expected.gene.toUpperCase()
    && input.variant.trim().toUpperCase() === expected.variant.toUpperCase()
    && input.hgvs.trim() === expected.hgvs
    && input.gnomadId.trim() === expected.gnomadId
}

export function changeInputBuild(input: VariantInput, variantCase: VariantCase, build: GenomeBuild): VariantInput {
  if (build === input.build) return input
  if (isCaseIdentityMatch(input, variantCase)) return { ...input, ...variantCase.coordinatesByBuild[build], build }
  // Coordinates entered by a user cannot be lifted between assemblies locally.
  return { ...input, build, hgvs: '', gnomadId: parseRsId(input.gnomadId) ?? '' }
}
