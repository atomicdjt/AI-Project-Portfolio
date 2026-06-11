import { reportingResources } from '../data/reportingResources'
import type { RedFlagFinding } from '../types/analysis'
import type { ChecklistItem, ScamCase, TimelineEntry } from '../types/case'

export interface EvidencePacketModel {
  title: string
  caseName: string
  createdDate: string
  preparedBy: string
  disclaimer: string
  riskSummary: {
    score: number
    label: string
    summary: string
    disclaimer: string
  }
  evidence: string[]
  findings: RedFlagFinding[]
  timeline: TimelineEntry[]
  checklist: ChecklistItem[]
  reporting: Array<{ name: string; url: string; guidance: string }>
  notes: string[]
  privacyNote: string
}

export function buildEvidencePacketModel(caseData: ScamCase, caregiverMode: boolean): EvidencePacketModel {
  const analysis = caseData.analysis
  const evidence = [
    caseData.evidenceText && `Submitted text: ${caseData.evidenceText}`,
    caseData.manualExtractedText && `Manually extracted text: ${caseData.manualExtractedText}`,
    caseData.suspiciousUrl && `Suspicious URL text: ${caseData.suspiciousUrl}`,
    caseData.paymentDestination && `Payment destination: ${caseData.paymentDestination}`,
    caseData.claimedCompany && `Claimed person or company: ${caseData.claimedCompany}`,
    caseData.contactDetails && `Contact details: ${caseData.contactDetails}`,
    caseData.amountRequested && `Amount requested: ${caseData.amountRequested}`,
    ...caseData.attachments.map((file) => `Attached evidence file: ${file.name} (${file.type || 'unknown type'})`),
  ].filter((line): line is string => Boolean(line))

  return {
    title: 'ScamShield AI Evidence Packet',
    caseName: caseData.name || 'Untitled case',
    createdDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    preparedBy: caregiverMode ? 'Prepared by caregiver/advocate' : 'Prepared by the person documenting this case',
    disclaimer: 'ScamShield AI organizes evidence and identifies possible risk signals. It does not provide legal, financial, investigative, or law-enforcement advice.',
    riskSummary: {
      score: analysis?.score ?? 0,
      label: analysis?.label ?? 'Not analyzed',
      summary: analysis?.summary ?? 'No local risk assessment has been completed.',
      disclaimer: 'This is a risk assessment, not a final determination.',
    },
    evidence,
    findings: analysis?.findings ?? [],
    timeline: [...caseData.timeline].sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
    checklist: caseData.checklist,
    reporting: reportingResources.map(({ name, displayUrl, guidance }) => ({ name, url: displayUrl, guidance })),
    notes: [caseData.notes, caregiverMode ? caseData.caregiver.notes : ''].filter(Boolean),
    privacyNote: 'This report may contain sensitive personal information. Share only with trusted official institutions or advisors.',
  }
}

export async function downloadEvidencePacket(caseData: ScamCase, caregiverMode: boolean): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const model = buildEvidencePacketModel(caseData, caregiverMode)
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 54
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const ensureSpace = (needed = 54) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
  }

  const heading = (text: string, size = 16) => {
    ensureSpace(34)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(size)
    pdf.setTextColor(13, 59, 82)
    pdf.text(text, margin, y)
    y += size + 12
  }

  const paragraph = (text: string, options: { bold?: boolean; color?: [number, number, number] } = {}) => {
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(...(options.color ?? [39, 54, 65]))
    const lines = pdf.splitTextToSize(text, contentWidth) as string[]
    for (const line of lines) {
      ensureSpace(15)
      pdf.text(line, margin, y)
      y += 14
    }
    y += 5
  }

  pdf.setFillColor(13, 59, 82)
  pdf.rect(0, 0, pageWidth, 178, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(25)
  pdf.text(model.title, margin, 78)
  pdf.setFontSize(14)
  pdf.text(model.caseName, margin, 108)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(`${model.createdDate} | ${model.preparedBy}`, margin, 134)
  y = 218
  paragraph(model.disclaimer)

  heading('1. Risk summary')
  paragraph(`${model.riskSummary.score}/100 - ${model.riskSummary.label}`, { bold: true, color: [17, 94, 89] })
  paragraph(model.riskSummary.summary)
  paragraph(model.riskSummary.disclaimer, { bold: true })

  heading('2. Evidence submitted')
  if (model.evidence.length === 0) paragraph('No evidence details were entered.')
  model.evidence.forEach((line) => paragraph(`• ${line}`))

  heading('3. Possible scam indicators')
  if (model.findings.length === 0) paragraph('No strong indicators were detected in the submitted information.')
  model.findings.forEach((finding) => {
    paragraph(`${finding.category} - ${finding.severity.toUpperCase()}`, { bold: true })
    paragraph(`Matched: ${finding.matched}`)
    paragraph(finding.explanation)
    paragraph(`Safer next step: ${finding.saferNextStep}`)
  })

  heading('4. Evidence timeline')
  if (model.timeline.length === 0) paragraph('No timeline entries were added.')
  model.timeline.forEach((entry) => paragraph(`${entry.dateTime} | ${entry.eventType} | ${entry.description}${entry.amount ? ` | ${entry.amount}` : ''}`))

  heading('5. Suggested action checklist')
  model.checklist.forEach((item) => paragraph(`${item.completed ? '[x]' : '[ ]'} ${item.label}`))

  heading('6. Reporting guidance')
  model.reporting.forEach((resource) => {
    paragraph(`${resource.name} - ${resource.url}`, { bold: true })
    paragraph(resource.guidance)
  })

  heading('7. Notes')
  if (model.notes.length === 0) paragraph('No additional notes were entered.')
  model.notes.forEach((note) => paragraph(note))

  heading('8. Privacy note')
  paragraph(model.privacyNote, { bold: true })

  const safeName = model.caseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'case'
  pdf.save(`scamshield-evidence-${safeName}.pdf`)
}
