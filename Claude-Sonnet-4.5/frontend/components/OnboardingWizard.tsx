import { useState, useEffect, useRef } from 'react';
import { mockApi, Profile, Step } from '../services/mockApi';
import { uiLogger, getViewportMetadata } from '../utils/logger';
import StepIndicator from './StepIndicator';
import PersonalInfoStep from './steps/PersonalInfoStep';
import DepartmentStep from './steps/DepartmentStep';
import HandbookStep from './steps/HandbookStep';
import CompleteStep from './steps/CompleteStep';

interface OnboardingWizardProps {
  theme: 'light' | 'dark';
}

function OnboardingWizard({ theme }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [handbookAcknowledged, setHandbookAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const stepContentRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Focus management when step changes
    if (stepContentRef.current) {
      stepContentRef.current.focus();
    }
  }, [currentStep]);

  const loadInitialData = async () => {
    const startTime = Date.now();
    
    try {
      const [profileData, stepsData] = await Promise.all([
        mockApi.getProfile(),
        mockApi.getSteps()
      ]);
      
      setProfile(profileData);
      setSteps(stepsData);
      
      uiLogger.log({
        eventType: 'page_load',
        component: 'OnboardingWizard',
        action: 'data_loaded',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: 1,
          duration: Date.now() - startTime,
          theme
        }
      });
    } catch (error) {
      uiLogger.log({
        eventType: 'error',
        component: 'OnboardingWizard',
        action: 'data_load_failed',
        metadata: {
          viewport: getViewportMetadata(),
          errorCode: 'LOAD_ERROR',
          theme
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      
      uiLogger.log({
        eventType: 'navigation',
        component: 'OnboardingWizard',
        action: 'step_next',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: nextStep,
          theme
        }
      });
      
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      
      uiLogger.log({
        eventType: 'navigation',
        component: 'OnboardingWizard',
        action: 'step_previous',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: prevStep,
          theme
        }
      });
      
      setCurrentStep(prevStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const startTime = Date.now();

    try {
      await mockApi.submitOnboarding({
        profileId: profile?.id,
        handbookAcknowledged,
        completedAt: new Date().toISOString()
      });

      setSubmitSuccess(true);
      
      uiLogger.log({
        eventType: 'form_submit',
        component: 'OnboardingWizard',
        action: 'complete_onboarding',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: currentStep,
          success: true,
          duration: Date.now() - startTime,
          theme
        }
      });
    } catch (error) {
      uiLogger.log({
        eventType: 'error',
        component: 'OnboardingWizard',
        action: 'submit_failed',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: currentStep,
          success: false,
          errorCode: 'SUBMIT_ERROR',
          theme
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 3) {
      return handbookAcknowledged;
    }
    return true;
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-[400px]"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-600 dark:text-red-400" role="alert">
        Failed to load profile data. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="w-full" role="region" aria-label="Onboarding wizard">
      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Main Content Area - Fixed responsive layout */}
      <div 
        ref={stepContentRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-6 sm:mt-8 overflow-hidden"
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Content with proper spacing to prevent overlap */}
        <div className="p-4 sm:p-6 lg:p-8 min-h-[400px] pb-24 sm:pb-28">
          {currentStep === 1 && <PersonalInfoStep profile={profile} theme={theme} />}
          {currentStep === 2 && <DepartmentStep profile={profile} theme={theme} />}
          {currentStep === 3 && (
            <HandbookStep 
              theme={theme}
              acknowledged={handbookAcknowledged}
              onAcknowledgeChange={setHandbookAcknowledged}
            />
          )}
          {currentStep === 4 && (
            <CompleteStep 
              profile={profile}
              isSubmitting={isSubmitting}
              submitSuccess={submitSuccess}
              onSubmit={handleSubmit}
              theme={theme}
            />
          )}
        </div>

        {/* Sticky Footer with CTAs - Fixed for mobile Safari */}
        {currentStep < 4 && (
          <div 
            className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 z-10"
            style={{ 
              // Ensure visibility on mobile Safari with safe-area-inset
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center max-w-full">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
                aria-label="Go to previous step"
              >
                Previous
              </button>
              
              <button
                ref={nextButtonRef}
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium shadow-sm"
                aria-label={`Continue to ${steps[currentStep]?.title || 'next step'}`}
                data-testid="next-button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingWizard;
