import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import './App.css'
import mockData from '@mocks/mock_api.json'
import type { MockApiData } from './types'
import { StepNavigation } from './components/StepNavigation'
import { CTAStickyBar } from './components/CTAStickyBar'
import { MarkdownContent } from './components/MarkdownContent'
import { createUiLogger } from './utils/logger'

const data = mockData as MockApiData

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const profile = data.profile
  const steps = useMemo(
    () =>
      data.steps.map((step) => ({
        ...step,
        contentMarkdown: step.contentMarkdown.replaceAll('{{name}}', profile.name),
      })),
    [profile.name],
  )
  const currentStep = steps[currentStepIndex]
  const logger = useMemo(() => createUiLogger(), [])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }
    logger.logEvent({ event: 'theme_change', action: 'set_theme', metadata: { theme } })
  }, [theme, logger])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      logger.logEvent({
        event: 'load_success',
        metadata: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
        },
      })
    }
  }, [logger])

  useEffect(() => {
    headingRef.current?.focus()
    logger.logEvent({ event: 'step_view', stepId: currentStep.id })
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Step ${currentStepIndex + 1} of ${steps.length}: ${currentStep.title}`
    }
  }, [currentStepIndex, currentStep, steps.length, logger])

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1)
      logger.logEvent({ event: 'navigation', action: 'next', stepId: currentStep.id })
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1)
      logger.logEvent({ event: 'navigation', action: 'back', stepId: currentStep.id })
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    logger.logEvent({ event: 'submit_attempt', stepId: currentStep.id })
    // Simulate async submit
    setTimeout(() => {
      setIsSubmitting(false)
      logger.logEvent({ event: 'submit_success' })
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = 'Submission successful'
      }
    }, 800)
  }

  const handleThemeToggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
      logger.logEvent({ event: 'keyboard_navigation', action: 'arrow_right', stepId: currentStep.id })
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handleBack()
      logger.logEvent({ event: 'keyboard_navigation', action: 'arrow_left', stepId: currentStep.id })
    }
  }

  const progressText = `Step ${currentStepIndex + 1} of ${steps.length}`

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="app-body" onKeyDown={handleKeyDown}>
        <header className="wizard-header">
          <h1 className="wizard-title" tabIndex={-1} ref={headingRef}>
            Employee Onboarding
          </h1>
          <div className="theme-toggle">
            <span className="sr-only">Toggle theme</span>
            <button type="button" onClick={handleThemeToggle} aria-label="Toggle dark mode">
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </header>

        <main id="main" className="wizard-main" role="main">
          <div ref={liveRegionRef} className="sr-only" aria-live="polite" />
          <div className="wizard-content">
            <StepNavigation
              steps={steps}
              currentStepIndex={currentStepIndex}
              onSelect={setCurrentStepIndex}
            />

            <article className="wizard-panel" aria-label={currentStep.title}>
              <h2 tabIndex={-1}>{currentStep.title}</h2>
              <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>
                {profile.role && <span>{profile.role}</span>}
              </p>
              <MarkdownContent markdown={currentStep.contentMarkdown} />
            </article>
          </div>
        </main>

        <CTAStickyBar
          canGoBack={currentStepIndex > 0}
          isLastStep={currentStepIndex === steps.length - 1}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          progressText={progressText}
        />
      </div>
    </div>
  )
}

export default App
