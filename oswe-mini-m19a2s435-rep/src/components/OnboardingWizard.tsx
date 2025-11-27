import React, { useState, useRef, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import Handbook from './Handbook'
import useUIEventLogger from './UIEventLogger'

import mockApi from '../../mocks/mock_api.json'

export default function OnboardingWizard(){
  const [step, setStep] = useState<number>(0)
  const { logEvent, sessionId } = useUIEventLogger() as any
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(()=>{
    logEvent('page.load', {step})
  }, [])

  useEffect(()=>{
    // when step changes, focus on step container for keyboard users
    mainRef.current?.focus()
    logEvent('step.change', {step})
  }, [step])

  function next(){
    setStep((s:number)=> Math.min(s+1, 2))
    logEvent('cta.click', { name: 'next', step })
  }
  function prev(){
    setStep((s:number)=> Math.max(s-1, 0))
    logEvent('cta.click', { name: 'prev', step })
  }
  function submit(){
    logEvent('cta.click', { name: 'submit', step })
    // mock submit
    logEvent('form.submit', { success: true })
    alert('Submitted — check console logs for UI event payloads')
  }

  // Accessible keyboard nav
  function onKeyDown(e: React.KeyboardEvent){
    if(e.key === 'Enter') next()
    if(e.key === 'ArrowLeft') prev()
    if(e.key === 'ArrowRight') next()
  }

  const handbookHtml: string = (mockApi as any).handbook.content

  return (
    <div className="app-shell">
      <Header />
      <main ref={mainRef as any} tabIndex={-1} className="content" role="main" onKeyDown={onKeyDown} aria-live="polite">
        <section className="onboarding-panel" aria-roledescription="onboarding wizard" aria-label="onboarding panel">
          {step===0 && (
            <div>
              <h2>Profile Setup</h2>
              <p>Enter your profile details — mocked from API</p>
              <div><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" /></div>
            </div>
          )}
          {step===1 && (
            <div>
              <h2>Company Handbook</h2>
              <Handbook markdown={handbookHtml} />
            </div>
          )}
          {step===2 && (
            <div>
              <h2>Review & Submit</h2>
              <p>Review details and submit.</p>
            </div>
          )}
        </section>

        {/* Anchor CTA to be visible above sticky footer (mobile Safari safe area considered) */}
        <div className="anchor-cta" aria-hidden={false}>
          {step>0 && <button className="primary-button" onClick={prev} aria-label="Previous">Back</button>}
          {step<2 && <button className="primary-button" onClick={next} aria-label="Next">Next</button>}
          {step===2 && <button className="primary-button" onClick={submit} aria-label="Submit">Submit</button>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
