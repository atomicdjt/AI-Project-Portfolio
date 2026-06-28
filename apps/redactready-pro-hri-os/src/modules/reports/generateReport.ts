import type { HriAnalysisResult, ReportData } from '../../types/hri'

export function createReportData(analysis: Omit<HriAnalysisResult, 'report'>): ReportData {
  const criticalFindings = analysis.allFindings.filter((finding) => finding.severity === 'Critical').length
  return {
    executiveSummary: `This packet contains ${analysis.documents.length} document${
      analysis.documents.length === 1 ? '' : 's'
    } with ${analysis.allFindings.length} sensitive finding${
      analysis.allFindings.length === 1 ? '' : 's'
    }. The overall HRI Score is ${analysis.overallScore}/100 (${analysis.overallBand}), framed as a privacy, organization, and sharing-readiness signal.`,
    documentsReviewed: analysis.documents,
    overallScore: analysis.overallScore,
    categoryScores: analysis.categoryScores,
    evidenceMap: analysis.evidenceMap,
    checklist: analysis.checklist,
    redactionSummary: `${criticalFindings} critical finding${criticalFindings === 1 ? '' : 's'} and ${
      analysis.allFindings.length
    } total finding${analysis.allFindings.length === 1 ? '' : 's'} are available for redaction review.`,
    limitations:
      'This MVP uses deterministic local pattern matching and heuristics. It does not provide legal, medical, financial, benefits, or official agency advice, and users should manually verify redactions and conclusions.',
  }
}

export function generateMarkdownReport(report: ReportData): string {
  const findings = report.documentsReviewed
    .flatMap((document) => document.detectedEntities.map((finding) => `- ${document.title}: ${finding.label} (${finding.severity}) -> ${finding.suggestedRedaction}`))
    .join('\n')

  return `# Human Risk Intelligence Report

## 1. Executive Summary
${report.executiveSummary}

## 2. Documents Reviewed
${report.documentsReviewed.map((document) => `- ${document.title} - ${document.classification.type} (${Math.round(document.classification.confidence * 100)}% confidence)`).join('\n')}

## 3. Overall HRI Score
${report.overallScore}/100

## 4. Sensitive Information Findings
${findings || '- No sensitive findings detected by the deterministic engine.'}

## 5. Risk Category Breakdown
${report.categoryScores.map((score) => `- ${score.category}: ${score.score}/100 (${score.band}). ${score.explanation}`).join('\n')}

## 6. Evidence Map
${report.evidenceMap.map((item) => `- ${item.documentTitle}: ${item.supportLevel}. ${item.claim}`).join('\n')}

## 7. Missing or Weak Areas
${report.evidenceMap.flatMap((item) => item.missingInformation.map((missing) => `- ${item.documentTitle}: ${missing}`)).join('\n') || '- No major missing areas were detected.'}

## 8. Recommended Actions
${report.checklist.map((item) => `- [${item.priority}] ${item.group}: ${item.explanation}`).join('\n')}

## 9. Redaction Summary
${report.redactionSummary}

## 10. Limitations and Disclaimer
${report.limitations}
`
}
