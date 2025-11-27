import React, {useState, useEffect, useRef} from 'react'
import ProfileStep from './steps/ProfileStep'
import HandbookStep from './steps/HandbookStep'
import ReviewStep from './steps/ReviewStep'
import {initLogger, uiLog} from '../utils/logger'

export default function OnboardingWizard(){
  const [step, setStep] = useState(0)
  const [data, setData] = useState<{name?:string,email?:string,handbook?:string}>({})
  const stepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  useEffect(() => {initLogger(); uiLog('view', {step})}, [])
  useEffect(() => { uiLog('view', {step});
    // focus first focusable element in current step
    const el = stepRefs[step]?.current?.querySelector('input,button,a') as HTMLElement
    el?.focus()
  }, [step])

  const next = () => setStep(s => Math.min(s+1,2))
  const prev = () => setStep(s => Math.max(s-1,0))
  const submit = () => {
    uiLog('submit', {step,data})
    alert('Submitted!')
  }

  return (
    <div>
      <div role="navigation" aria-label="Onboarding steps" style={{display:'flex',gap:8,marginBottom:12}}>
        <button aria-current={step===0} className="button" onClick={()=>setStep(0)}>Profile</button>
        <button aria-current={step===1} className="button" onClick={()=>setStep(1)}>Handbook</button>
        <button aria-current={step===2} className="button" onClick={()=>setStep(2)}>Review</button>
      </div>

      <div>
        <div ref={stepRefs[0]} style={{display: step===0 ? 'block' : 'none'}}>
          <ProfileStep onNext={(payload)=>{setData(d=>({...d,...payload})); next();}} value={data} />
        </div>
        <div ref={stepRefs[1]} style={{display: step===1 ? 'block' : 'none'}}>
          <HandbookStep onNext={(payload)=>{setData(d=>({...d,...payload})); next();}} onPrev={prev} value={data} />
        </div>
        <div ref={stepRefs[2]} style={{display: step===2 ? 'block' : 'none'}}>
          <ReviewStep onPrev={prev} onSubmit={submit} value={data} />
        </div>
      </div>

      {/* CTA footer anchored to content */}
      <div style={{position:'sticky',bottom:calcSafeArea(),marginTop:8}} aria-hidden={false}>
        <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:14}}>{step===0? 'Step 1: Profile': step===1? 'Step 2: Handbook' : 'Step 3: Review'}</div>
          <div style={{display:'flex',gap:10}}>
            {step>0 && <button className="button" onClick={prev} aria-label="previous">Previous</button>}
            {step<2 && <button className="button" onClick={next} aria-label="next">Next</button>}
            {step===2 && <button className="button" onClick={submit} aria-label="submit">Submit</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

function calcSafeArea(){
  // this returns a CSS var to keep the CTA above safe area when used in inline style values if needed
  return 'calc(env(safe-area-inset-bottom, 0) + 12px)'
}
