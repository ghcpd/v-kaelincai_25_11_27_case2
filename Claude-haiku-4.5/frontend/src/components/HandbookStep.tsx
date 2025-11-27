import React, { useEffect, useMemo } from 'react';
import { uiLogger } from '../utils/ui-logger';
import { markdownRenderer } from '../utils/markdown-renderer';

interface HandbookSection {
  id: string;
  title: string;
  content: string;
}

interface Handbook {
  title: string;
  sections: HandbookSection[];
}

interface HandbookStepProps {
  handbook: Handbook;
  theme: 'light' | 'dark';
}

const HandbookStep: React.FC<HandbookStepProps> = ({ handbook, theme }) => {
  const [selectedSection, setSelectedSection] = React.useState(0);

  const renderedContent = useMemo(() => {
    const startTime = performance.now();
    const section = handbook.sections[selectedSection];
    const html = markdownRenderer.render(section.content, { theme, sanitize: true });
    const renderTime = performance.now() - startTime;

    uiLogger.logEvent(
      'markdown_render',
      { componentName: 'HandbookReader' },
      { step: 'handbook', markdownTheme: theme },
      { renderTime, accessibilityViolations: 0 }
    );

    return html;
  }, [selectedSection, theme]);

  useEffect(() => {
    uiLogger.logEvent(
      'page_load',
      { componentName: 'HandbookStep' },
      { step: 'handbook', section: handbook.sections[selectedSection].id }
    );
  }, [selectedSection, handbook.sections]);

  const bgItemClass = theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-gray-600';
  const activeClass = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';
  const contentBg = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50';

  return (
    <div className="space-y-6" role="region" aria-label="Handbook review">
      <div>
        <h2 className={`text-2xl font-bold ${textClass} mb-2`}>{handbook.title}</h2>
        <p className={mutedClass}>
          Review the company handbook sections below. Make sure to read through all policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Section navigation */}
        <div className="space-y-2 md:col-span-1">
          {handbook.sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(idx)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-colors
                font-medium text-sm
                ${selectedSection === idx
                  ? `${activeClass} text-white`
                  : `${bgItemClass} ${textClass}`}
              `}
              aria-pressed={selectedSection === idx}
              aria-label={`${section.title} section`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content display */}
        <div className={`md:col-span-2 p-6 rounded-lg ${contentBg} max-h-96 overflow-y-auto`}>
          <div
            className="markdown-content space-y-4"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
            role="article"
            aria-label={`${handbook.sections[selectedSection].title} content`}
          />
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-5 h-5 rounded"
            aria-label="Confirm handbook review"
            onChange={() => {
              uiLogger.logEvent(
                'form_input',
                { componentName: 'HandbookStep', elementId: 'handbook-confirm' },
                { step: 'handbook', action: 'acknowledgement' }
              );
            }}
          />
          <span className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
            I have read and understood the handbook policies
          </span>
        </label>
      </div>
    </div>
  );
};

export default HandbookStep;
