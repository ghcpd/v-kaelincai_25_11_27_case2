import React from 'react';
import { uiLogger } from '../utils/ui-logger';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  startDate: string;
  manager: string;
  title: string;
}

interface ProfileStepProps {
  profile: Profile;
  theme: 'light' | 'dark';
}

const ProfileStep: React.FC<ProfileStepProps> = ({ profile, theme }) => {
  React.useEffect(() => {
    uiLogger.logEvent(
      'page_load',
      { componentName: 'ProfileStep' },
      { step: 'profile' }
    );
  }, []);

  const bgItemClass = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-gray-600';

  const fields = [
    { label: 'First Name', value: profile.firstName },
    { label: 'Last Name', value: profile.lastName },
    { label: 'Email', value: profile.email },
    { label: 'Department', value: profile.department },
    { label: 'Title', value: profile.title },
    { label: 'Manager', value: profile.manager },
    { label: 'Start Date', value: new Date(profile.startDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6" role="region" aria-label="Profile verification">
      <div>
        <h2 className={`text-2xl font-bold ${textClass} mb-2`}>Verify Your Information</h2>
        <p className={mutedClass}>
          Please confirm that the following information is correct. Contact HR if you need to make changes.
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-lg ${bgItemClass}`}>
        {fields.map(({ label, value }) => (
          <div key={label} className="space-y-2">
            <label className={`text-sm font-medium ${mutedClass}`}>{label}</label>
            <p className={`text-lg ${textClass}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
          ℹ️ By proceeding, you acknowledge that the above information is accurate and agree to the terms of employment.
        </p>
      </div>
    </div>
  );
};

export default ProfileStep;
