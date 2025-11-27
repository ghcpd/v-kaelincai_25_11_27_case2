import React, { useEffect, useState, useRef } from 'react'
import './Wizard.css'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

type Step = {
  id: string
  title: string
  content: string
}

import mockData from '../../mocks/mock_api.json'

const stepsData: Step[] = [
  {
    id: 'profile',
    title: 'Profile',
    content: `Name: ${mockData.profile.name}\nRole: ${mockData.profile.role}`
  },
  {
    id: 'handbook',
    title: 'Handbook',
    content: mockData.handbook.content
  },
  {
    id: 'review',
    title: 'Review',
    content: 'Review and submit.'
  }
]


function useSessionId() {
  const [sessionId] = useState(() => {
    return 'sess_' + Math.random().toString(36).substring(2, 10)
  })
  return sessionId
}

export default function Wizard() {
  const [active, setActive] = useState(0)
  const sessionId = useSessionId()
  const mainRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // keyboard navigation
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive((s: number) => Math.min(s + 1, stepsData.length - 1))
      if (e.key === 'ArrowLeft') setActive((s: number) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    // focus main panel when step changes
    mainRef.current?.focus()
    // emit event log (structured)
    const payload = {
      sessionId,
      requestId: 'req_' + Math.random().toString(36).slice(2, 12),
      event: 'step_change',
      step: stepsData[active].id,
      timestamp: new Date().toISOString(),
      meta: { viewport: { width: window.innerWidth, height: window.innerHeight } }
    }
    console.log(JSON.stringify(payload))
  }, [active, sessionId])

  const logEvent = (event: string, extra?: any) => {
    const payload = {
      sessionId,
      requestId: 'req_' + Math.random().toString(36).slice(2, 12),
      event,
      step: stepsData[active].id,
      timestamp: new Date().toISOString(),
      meta: extra || {}
    }
    console.log(JSON.stringify(payload))
  }

  const goNext = () => {
    logEvent('click_next')
    setActive((s: number) => Math.min(s + 1, stepsData.length - 1))
  }
  const goPrev = () => {
    logEvent('click_back')
    setActive((s: number) => Math.max(s - 1, 0))
  }

  return (
    <div className="container">
      <header className="header" role="banner">
        <div className="headerContent">
          <h1 className="title">Onboarding Wizard</h1>
        </div>
      </header>

      <main className="main" tabIndex={-1} ref={mainRef} role="main" data-session-id={sessionId}>
        <nav aria-label="Onboarding Steps" className="stepsNav">
          {stepsData.map((st, idx) => (
            <button
              key={st.id}
              className={`stepButton ${active === idx ? 'active' : ''}`}
              aria-current={active === idx}
              onClick={() => setActive(idx)}
            >
              {st.title}
            </button>
          ))}
        </nav>

        <section className="panel" aria-live="polite">
          <h2>{stepsData[active].title}</h2>
          {stepsData[active].id === 'handbook' ? (
            <article className="handbook">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{stepsData[active].content}</ReactMarkdown>
            </article>
          ) : (
            <p>{stepsData[active].content}</p>
          )}
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footerInner">
          <button
            className="secondary"
            data-testid="prev-cta"
            onClick={goPrev}
            aria-label="Previous Step"
            disabled={active === 0}
          >
            Back
          </button>

          <button
            className={`primary ${active === stepsData.length - 1 ? 'cta-anchored' : ''}`}
            data-testid="primary-cta"
            onClick={goNext}
            aria-label="Next Step"
          >
            {active === stepsData.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </footer>
    </div>
  )
}

