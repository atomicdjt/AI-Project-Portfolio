import { describe, expect, it } from 'vitest'
import { demoCases } from '../data/demoCases'
import { analyzeScam } from '../lib/analyzeScam'
import { buildEvidencePacketModel } from '../lib/pdfReport'
import { generateSafetyChecklist } from '../lib/safetyChecklist'

describe('evidence packet model', () => {
  it('prepares every required report section and caregiver attribution', () => {
    const caseData = structuredClone(demoCases[1].case)
    const analysis = analyzeScam({
      text: caseData.evidenceText,
      url: caseData.suspiciousUrl,
      claimedCompany: caseData.claimedCompany,
      paymentDestination: caseData.paymentDestination,
    })
    caseData.analysis = analysis
    caseData.checklist = generateSafetyChecklist({
      urgency: caseData.urgency,
      scamType: caseData.scamType,
      caregiverMode: true,
      evidenceText: caseData.evidenceText,
      findings: analysis.findings,
    })
    caseData.caregiver = { personHelped: 'Demo family member', relationship: 'Relative', hasConsent: true, notes: 'Synthetic notes.' }

    const report = buildEvidencePacketModel(caseData, true)

    expect(report.title).toBe('ScamShield AI Evidence Packet')
    expect(report.preparedBy).toMatch(/caregiver\/advocate/i)
    expect(report.riskSummary.disclaimer).toMatch(/not a final determination/i)
    expect(report.evidence.length).toBeGreaterThan(0)
    expect(report.findings.length).toBeGreaterThan(0)
    expect(report.timeline.length).toBeGreaterThan(0)
    expect(report.checklist.length).toBeGreaterThan(0)
    expect(report.reporting.length).toBeGreaterThan(0)
    expect(report.privacyNote).toMatch(/sensitive personal information/i)
  })
})
