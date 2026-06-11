import { Check } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'

const steps = ['Start', 'Evidence', 'Assessment', 'Timeline and actions', 'Report and export']

export function Stepper() {
  const currentStep = useCaseStore((state) => state.currentStep)
  const setStep = useCaseStore((state) => state.setStep)
  const hasAnalysis = useCaseStore((state) => Boolean(state.caseData.analysis))

  return (
    <nav className="stepper" aria-label="Case workflow">
      {steps.map((label, index) => {
        const disabled = index >= 2 && !hasAnalysis
        return (
          <button
            key={label}
            type="button"
            className={currentStep === index ? 'active' : currentStep > index ? 'complete' : ''}
            aria-current={currentStep === index ? 'step' : undefined}
            disabled={disabled}
            onClick={() => setStep(index)}
          >
            <span>{currentStep > index ? <Check size={15} aria-hidden="true" /> : index + 1}</span>
            {label}
          </button>
        )
      })}
    </nav>
  )
}
