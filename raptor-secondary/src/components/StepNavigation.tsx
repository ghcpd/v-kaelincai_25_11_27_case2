import clsx from 'clsx'
import type { OnboardingStep } from '@/types'

interface StepNavigationProps {
  steps: OnboardingStep[]
  currentStepIndex: number
  onSelect: (index: number) => void
}

export function StepNavigation({ steps, currentStepIndex, onSelect }: StepNavigationProps) {
  return (
    <nav aria-label="Onboarding steps">
      <ol className="step-nav" role="list">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              className={clsx('step-pill')}
              aria-current={index === currentStepIndex ? 'step' : undefined}
              aria-label={`Step ${index + 1}: ${step.title}`}
              onClick={() => onSelect(index)}
            >
              {step.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
