import { Step } from '../services/mockApi';

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-6 sm:mb-8">
      <ol className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <li 
              key={step.id}
              className="flex-1"
            >
              <div
                className={`relative flex items-center p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : isCompleted
                    ? 'border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="flex items-center w-full">
                  <div 
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                      isCurrent
                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-green-600 dark:bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={`Step ${stepNumber}`}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <p className={`text-sm sm:text-base font-medium truncate ${
                      isCurrent
                        ? 'text-blue-900 dark:text-blue-100'
                        : isCompleted
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs sm:text-sm truncate ${
                      isCurrent
                        ? 'text-blue-700 dark:text-blue-300'
                        : isCompleted
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default StepIndicator;
