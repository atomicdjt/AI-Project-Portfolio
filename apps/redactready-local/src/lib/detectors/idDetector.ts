import type { SensitiveDetector } from './detectorTypes'
import { runRegex } from './utils'

export function createIdDetector(): SensitiveDetector {
  return {
    id: 'case-reference',
    label: 'Case and reference numbers',
    detect(text) {
      const caseIds = runRegex(
        text,
        /\b(?:case|claim|invoice|order|reference|ref|ticket)\s*(?:no\.?|number|#)?\s*[:#-]?\s*([A-Z]{0,5}[- ]?\d{4,}[-A-Z0-9]*)\b/gi,
        'case_id',
        'Case/reference number',
        0.78,
        1,
      )

      const employeeIds = runRegex(
        text,
        /\b(?:employee|client|student|patient)\s*(?:id|number|#)\s*[:#-]?\s*([A-Z]{1,6}[- ]?\d{3,}[-A-Z0-9]*)\b/gi,
        'employee_client_id',
        'Employee/client ID',
        0.74,
        1,
      )

      const medicalIds = runRegex(
        text,
        /\b(?:mrn|medical record|patient id|rx|prescription|member id|health plan)\s*(?:number|no\.?|#|id)?\s*[:#-]?\s*([A-Z0-9-]{5,24})\b/gi,
        'medical_identifier',
        'Medical identifier',
        0.8,
        1,
      )

      return [...caseIds, ...employeeIds, ...medicalIds]
    },
  }
}
