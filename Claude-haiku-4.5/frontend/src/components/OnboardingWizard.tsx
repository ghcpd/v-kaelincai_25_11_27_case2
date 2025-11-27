import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uiLogger } from '../utils/ui-logger';
import mockData from '../../../mocks/mock_api.json';
import ProfileStep from './ProfileStep';
import HandbookStep from './HandbookStep';
import EquipmentStep from './EquipmentStep';
import ConfirmationStep from './ConfirmationStep';

interface OnboardingWizardProps {
  theme: 'light' | 'dark';
}

const steps = ['profile', 'handbook', 'equipment', 'confirmation'];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [layoutShift, setLayoutShift] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if CTA is visible
  const checkCtaVisibility = useCallback(() => {
    if (footerRef.current) {
      const rect = footerRef.current.getBoundingClientRect();
      const isVisible = rect.bottom <= window.innerHeight;
      return isVisible;
    }
    return true;
  }, []);

  // Check for header overlap
  const checkHeaderOverlap = useCallback(() => {
    const header = document.querySelector('.wizard-header');
    const content = document.querySelector('.wizard-content');
    if (header && content) {
      const headerRect = header.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      return headerRect.bottom > contentRect.top + 20; // 20px threshold
    }
    return false;
  }, []);

  // Monitor layout stability (CLS)
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        setLayoutShift(prev => prev + (entry as any).value);
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('Layout Shift Observer not supported');
    }

    return () => observer.disconnect();
  }, []);

  const handleNext = useCallback(() => {
    const ctaVisible = checkCtaVisibility();
    const headerOverlap = checkHeaderOverlap();
    
    uiLogger.logEvent(
      'button_click',
      { componentName: 'OnboardingWizard', elementId: 'next-button', elementClass: 'btn-primary' },
      {
        step: steps[currentStep],
        direction: 'next',
        action: 'navigate'
      },
      {
        ctaVisible,
        headerOverlap,
        layoutShift
      }
    );

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, checkCtaVisibility, checkHeaderOverlap, layoutShift]);

  const handlePrev = useCallback(() => {
    uiLogger.logEvent(
      'button_click',
      { componentName: 'OnboardingWizard', elementId: 'prev-button', elementClass: 'btn-secondary' },
      {
        step: steps[currentStep],
        direction: 'prev',
        action: 'navigate'
      }
    );

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleNext();
      uiLogger.logEvent(
        'keyboard_navigation',
        { componentName: 'OnboardingWizard', elementClass: 'wizard-nav' },
        { step: steps[currentStep], keyCode: e.key, action: 'next' }
      );
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrev();
      uiLogger.logEvent(
        'keyboard_navigation',
        { componentName: 'OnboardingWizard', elementClass: 'wizard-nav' },
        { step: steps[currentStep], keyCode: e.key, action: 'prev' }
      );
    }
  }, [currentStep, handleNext, handlePrev]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProfileStep profile={mockData.profile} theme={theme} />;
      case 1:
        return <HandbookStep handbook={mockData.handbook} theme={theme} />;
      case 2:
        return <EquipmentStep theme={theme} />;
      case 3:
        return <ConfirmationStep profile={mockData.profile} theme={theme} />;
      default:
        return null;
    }
  };

  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const headerBgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextClass = theme === 'dark' ? 'text-slate-300' : 'text-gray-600';

  return (
    <div 
      className={`wizard-container ${bgClass} flex flex-col min-h-screen`}
      onKeyDown={handleKeyDown}
      role="main"
      aria-label="Employee Onboarding Wizard"
    >
      {/* Header - Fixed positioning with proper z-index */}
      <div 
        className={`wizard-header ${headerBgClass} border-b sticky top-0 z-20 transition-all duration-200`}
        role="banner"
        aria-live="polite"
        aria-label={`Step ${currentStep + 1} of ${steps.length}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>
                Employee Onboarding
              </h1>
              <p className={`text-sm sm:text-base ${mutedTextClass} mt-1`}>
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 sm:gap-3">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`
                    h-2 flex-1 rounded-full transition-colors duration-300
                    ${idx <= currentStep
                      ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                      : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}
                  `}
                  role="progressbar"
                  aria-valuenow={idx <= currentStep ? 100 : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${step} ${idx <= currentStep ? 'completed' : 'not completed'}`}
                />
                {idx < steps.length - 1 && <div className="w-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content - Dynamic padding to prevent CTA overlap */}
      <div 
        className={`wizard-content flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8`}
        style={{
          paddingBottom: 'calc(120px + 1rem)',
          minHeight: 'calc(100vh - 200px)'
        }}
        ref={contentRef}
        role="region"
        aria-label="Wizard content"
      >
        {renderStep()}
      </div>

      {/* Footer with CTA - Fixed at bottom with safe area consideration */}
      <div 
        className="wizard-footer"
        ref={footerRef}
        role="contentinfo"
        aria-label="Navigation buttons"
      >
        <button
          id="prev-button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`
            px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors
            ${currentStep === 0
              ? theme === 'dark' 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : theme === 'dark'
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}
          `}
          aria-label="Previous step"
          aria-disabled={currentStep === 0}
        >
          ← Back
        </button>

        <button
          id="submit-button"
          onClick={handleNext}
          className={`
            px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors
            ${theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
          aria-label={currentStep === steps.length - 1 ? 'Complete onboarding' : 'Next step'}
        >
          {currentStep === steps.length - 1 ? 'Complete ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
