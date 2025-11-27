interface CTAStickyBarProps {
  canGoBack: boolean
  isLastStep: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  progressText: string
}

export function CTAStickyBar({
  canGoBack,
  isLastStep,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  progressText,
}: CTAStickyBarProps) {
  return (
    <div className="cta-bar" role="region" aria-label="Wizard actions">
      <div className="cta-context">
        <span className="progress-inline" aria-live="polite">{progressText}</span>
        <span>Complete all steps to submit</span>
      </div>
      <div className="cta-bar__buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          disabled={!canGoBack || isSubmitting}
        >
          Back
        </button>
        {isLastStep ? (
          <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}
