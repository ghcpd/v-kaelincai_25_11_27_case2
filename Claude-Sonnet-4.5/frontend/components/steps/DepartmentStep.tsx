import { Profile } from '../../services/mockApi';

interface DepartmentStepProps {
  profile: Profile;
  theme: 'light' | 'dark';
}

function DepartmentStep({ profile }: DepartmentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Department & Role
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your assignment details.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <input
            type="text"
            value={profile.department}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Manager
          </label>
          <input
            type="text"
            value={profile.manager}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Manager"
          />
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
          What's Next?
        </h3>
        <ul className="space-y-2 text-green-800 dark:text-green-200">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Your manager will schedule a 1:1 meeting within the first week</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>You'll receive access to team resources and tools</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Complete the employee handbook review in the next step</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DepartmentStep;
