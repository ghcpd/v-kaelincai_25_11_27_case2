import React, { useEffect, useState } from 'react'
import OnboardingWizard from './components/OnboardingWizard'
import './styles/global.css'

export default function App(){
  const [theme, setTheme] = useState<'light'|'dark'>(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  useEffect(() => {
    document.documentElement.style.colorScheme = theme
  }, [theme])
  return (
    <div className="app-grid" data-theme={theme}>
      <header className="header">
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <h1 style={{fontSize:16,margin:0}}>Employee Onboarding Portal</h1>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button aria-pressed={theme==='light'} onClick={() => setTheme(theme==='light'?'dark':'light')} className="button">Toggle theme</button>
        </div>
      </header>
      <main className="content">
        <OnboardingWizard/>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div style={{fontSize:12,color:'var(--muted)'}}>© Company</div>
          <div style={{display:'flex',gap:8}}>
            <button className="button" aria-label="help">Help</button>
            <a className="button" href="#">Cancel</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
