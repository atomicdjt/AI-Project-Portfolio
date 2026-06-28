import type { DocumentItem, HriAnalysisResult } from '../../types/hri'
import { buildChecklist } from '../checklist/buildChecklist'
import { classifyDocument } from '../classification/classifyDocument'
import { detectSensitiveInfo } from '../detection/detectSensitiveInfo'
import { buildEvidenceMap } from '../evidence/buildEvidenceMap'
import { createReportData } from '../reports/generateReport'
import { scoreHri } from '../scoring/scoreHri'

export interface DocumentInput {
  id?: string
  title: string
  source: DocumentItem['source']
  rawText: string
}

export function analyzePacket(inputs: DocumentInput[]): HriAnalysisResult {
  const documents = inputs.map<DocumentItem>((input, index) => {
    const id = input.id ?? `doc-${index + 1}`
    const classification = classifyDocument(input.rawText)
    const detectedEntities = detectSensitiveInfo(input.rawText, id)
    const confidenceLevel = classification.confidence > 0.75 ? 'High' : classification.confidence > 0.5 ? 'Medium' : 'Low'

    return {
      id,
      title: input.title,
      documentType: classification.type,
      source: input.source,
      dateAdded: new Date().toISOString(),
      rawText: input.rawText,
      classification,
      detectedEntities,
      riskFindings: detectedEntities.map((finding) => `${finding.label}: ${finding.explanation}`),
      recommendedActions: detectedEntities.length
        ? ['Review detected sensitive items.', 'Generate a redacted copy before sharing.']
        : ['Add context if this document will be shared outside a trusted workflow.'],
      confidenceLevel,
    }
  })

  const allFindings = documents.flatMap((document) => document.detectedEntities)
  const scoreResult = scoreHri(documents)
  const evidenceMap = buildEvidenceMap(documents)
  const checklist = buildChecklist(documents, scoreResult.categoryScores)
  const analysisWithoutReport = {
    documents,
    allFindings,
    categoryScores: scoreResult.categoryScores,
    overallScore: scoreResult.overallScore,
    overallBand: scoreResult.overallBand,
    evidenceMap,
    checklist,
  }

  return {
    ...analysisWithoutReport,
    report: createReportData(analysisWithoutReport),
  }
}
