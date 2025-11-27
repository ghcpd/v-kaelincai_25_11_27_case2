import { useState, useEffect } from 'react';
import { mockApi, Handbook } from '../../services/mockApi';
import { uiLogger, getViewportMetadata } from '../../utils/logger';
import MarkdownRenderer from '../MarkdownRenderer';

interface HandbookStepProps {
  theme: 'light' | 'dark';
  acknowledged: boolean;
  onAcknowledgeChange: (value: boolean) => void;
}

function HandbookStep({ theme, acknowledged, onAcknowledgeChange }: HandbookStepProps) {
  const [handbook, setHandbook] = useState<Handbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    loadHandbook();
  }, []);

  const loadHandbook = async () => {
    try {
      const data = await mockApi.getHandbook();
      setHandbook(data);
      
      uiLogger.log({
        eventType: 'page_load',
        component: 'HandbookStep',
        action: 'handbook_loaded',
        metadata: {
          viewport: getViewportMetadata(),
          stepId: 3,
          theme
        }
      });
    } catch (error) {
      uiLogger.log({
        eventType: 'error',
        component: 'HandbookStep',
        action: 'handbook_load_failed',
        metadata: {
          viewport: getViewportMetadata(),
          errorCode: 'HANDBOOK_ERROR',
          theme
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = (checked: boolean) => {
    onAcknowledgeChange(checked);
    
    uiLogger.log({
      eventType: 'user_interaction',
      component: 'HandbookStep',
      action: 'handbook_acknowledged',
      metadata: {
        viewport: getViewportMetadata(),
        stepId: 3,
        success: checked,
        theme
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Loading handbook...</p>
        </div>
      </div>
    );
  }

  if (!handbook) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Failed to load handbook. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {handbook.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Version {handbook.version} • Last updated: {new Date(handbook.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex flex-wrap gap-2" aria-label="Handbook sections">
          {handbook.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeSection === index
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-current={activeSection === index ? 'page' : undefined}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content with Markdown Renderer */}
      <div 
        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 max-h-[500px] overflow-y-auto"
        role="article"
        aria-label={`${handbook.sections[activeSection].title} section`}
      >
        <MarkdownRenderer 
          content={handbook.sections[activeSection].content}
          theme={theme}
        />
      </div>

      {/* Acknowledgement Checkbox */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-6">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => handleAcknowledge(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            aria-label="Acknowledge handbook"
            data-testid="handbook-acknowledge"
          />
          <span className="ml-3 text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
            <strong>I acknowledge</strong> that I have read and understood the employee handbook, 
            including all policies, procedures, and expectations outlined above.
          </span>
        </label>
      </div>
    </div>
  );
}

export default HandbookStep;
