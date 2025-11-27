import { Profile } from '../../services/mockApi';

interface CompleteStepProps {
  profile: Profile;
  isSubmitting: boolean;
  submitSuccess: boolean;
  onSubmit: () => void;
  theme: 'light' | 'dark';
}

function CompleteStep({ profile, isSubmitting, submitSuccess, onSubmit }: CompleteStepProps) {
  if (submitSuccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome Aboard, {profile.firstName}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your onboarding is complete. We're excited to have you on the team!
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Next Steps
          </h3>
          <ul className="text-left space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="mr-2">📧</span>
              <span>Check your email for calendar invites and access credentials</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💬</span>
              <span>Join our team Slack channels and introduce yourself</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🗓️</span>
              <span>Attend orientation sessions scheduled for your first week</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🤝</span>
              <span>Meet with your manager to discuss goals and expectations</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Ready to Complete Onboarding
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your information and submit to finish the process.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Summary
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <p className="font-medium text-gray-900 dark:text-white">{profile.email}</p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Department:</span>
            <p className="font-medium text-gray-900 dark:text-white">{profile.department}</p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Manager:</span>
            <p className="font-medium text-gray-900 dark:text-white">{profile.manager}</p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(profile.startDate).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Handbook:</span>
            <p className="font-medium text-green-600 dark:text-green-400">✓ Acknowledged</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <p className="text-center text-gray-800 dark:text-gray-200 mb-6">
          By submitting, you confirm that all information is correct and you're ready to begin your journey with us.
        </p>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto mx-auto block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-lg disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          data-testid="submit-button"
          aria-label="Submit onboarding"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Complete Onboarding'
          )}
        </button>
      </div>
    </div>
  );
}

export default CompleteStep;
