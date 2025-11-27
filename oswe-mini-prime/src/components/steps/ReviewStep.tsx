import React from 'react'
import { uiLog } from '../../utils/logger'

type Props = { onPrev:()=>void; onSubmit:()=>void; value:any }
export default function ReviewStep({onPrev,onSubmit,value}:Props){
  const {name,email,handbook} = value || {}
  const submitRef = React.useRef<HTMLButtonElement|null>(null)
  React.useEffect(()=>{ submitRef.current?.focus() }, [])
  const onClickSubmit = () => {
    uiLog('action',{action:'final_submit',payload:value})
    onSubmit()
  }
  return (
    <div className="card" role="region" aria-labelledby="reviewHeading">
      <h2 id="reviewHeading">Review</h2>
      <div style={{margin:'12px 0'}}>
        <div><strong>Name:</strong> {name}</div>
        <div><strong>Email:</strong> {email}</div>
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <button className="button" onClick={onPrev}>Back</button>
        <button aria-label="submit-step" ref={submitRef} className="button" onClick={onClickSubmit}>Submit</button>
      </div>
    </div>
  )
}
