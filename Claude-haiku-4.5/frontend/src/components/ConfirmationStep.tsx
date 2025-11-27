import React from 'react';
import { uiLogger } from '../utils/ui-logger';

interface Profile {
  firstName: string;
  lastName: string;
  department: string;
  startDate: string;
}

interface ConfirmationStepProps {
  profile: Profile;
  theme: 'light' | 'dark';
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ profile, theme }) => {
  React.useEffect(() => {
    uiLogger.logEvent(
      'page_load',
      { componentName: 'ConfirmationStep' },
      { step: 'confirmation' }
    );
  }, []);

  const bgItemClass = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-gray-600';
  const successClass = theme === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className="space-y-6" role="region" aria-label="Onboarding confirmation">
      <div className="text-center space-y-4">
        <div className="text-5xl mb-4">✓</div>
        <h2 className={`text-3xl font-bold ${textClass}`}>All Set!</h2>
        <p className={mutedClass}>
          Your onboarding process is ready to be submitted. Review the summary below.
        </p>
      </div>

      <div className={`p-6 rounded-lg ${bgItemClass} space-y-4`}>
        <div>
          <p className={`text-sm font-medium ${mutedClass}`}>Employee Name</p>
          <p className={`text-lg ${textClass}`}>{profile.firstName} {profile.lastName}</p>
        </div>
        <div>
          <p className={`text-sm font-medium ${mutedClass}`}>Department</p>
          <p className={`text-lg ${textClass}`}>{profile.department}</p>
        </div>
        <div>
          <p className={`text-sm font-medium ${mutedClass}`}>Start Date</p>
          <p className={`text-lg ${textClass}`}>{new Date(profile.startDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
        <div className="flex gap-3">
          <span className={`text-2xl ${successClass}`}>→</span>
          <div>
            <p className={`font-medium ${successClass}`}>Next Steps</p>
            <ul className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'} mt-2 list-disc list-inside`}>
              <li>HR will send welcome email with access credentials</li>
              <li>IT will set up your equipment within 24 hours</li>
              <li>Your manager will reach out to schedule a 1:1</li>
              <li>Attend team onboarding session on your second day</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}>
        <p className={`text-sm ${mutedClass}`}>
          By clicking "Complete", you confirm that you have reviewed all onboarding materials and agree to company policies.
          A confirmation email will be sent to your work email address.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
