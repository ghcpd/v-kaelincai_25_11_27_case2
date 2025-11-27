import React, { useState, useEffect, useCallback } from 'react';
import { uiLogger } from '../utils/ui-logger';
import OnboardingWizard from './OnboardingWizard';
import '../styles/global.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    
    // Log page load
    uiLogger.logEvent(
      'page_load',
      { componentName: 'App' },
      undefined,
      {
        theme: prefersDark ? 'dark' : 'light',
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }
    );
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    uiLogger.logEvent(
      'theme_change',
      { componentName: 'App' },
      { newTheme }
    );
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-white text-gray-900'} style={{ minHeight: '100vh' }}>
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className={`
            px-3 py-2 rounded-lg font-medium text-sm
            ${theme === 'light' 
              ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
              : 'bg-slate-800 text-white hover:bg-slate-700'}
            transition-colors
          `}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Main content */}
      <OnboardingWizard theme={theme} />
    </div>
  );
};

export default App;
