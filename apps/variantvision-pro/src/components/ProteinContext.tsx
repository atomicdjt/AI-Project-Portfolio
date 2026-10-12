import type { VariantCase } from '../types/variant'

export function ProteinContext({ variantCase }: { variantCase?: VariantCase }) {
  if (!variantCase) return <p className="analysis-note">No curated protein or transcript is mapped to this custom input. Verify the gene, transcript and residue numbering before attaching protein context.</p>
  return <>
    <dl className="compact-facts">
      <div><dt>Protein</dt><dd>{variantCase.protein}</dd></div>
      <div><dt>UniProt</dt><dd>{variantCase.uniprot}</dd></div>
      <div><dt>Transcript</dt><dd>{variantCase.transcript}</dd></div>
      <div><dt>Position</dt><dd>{variantCase.position}{variantCase.id === 'hbb-hbs' ? ' (mature chain; HGVS p.Glu7Val)' : ''}</dd></div>
    </dl>
    <p className="analysis-note">{variantCase.structuralContext}</p>
  </>
}
