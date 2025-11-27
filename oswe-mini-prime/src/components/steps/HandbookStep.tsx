import React, {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import rehypeRaw from 'rehype-raw'
import { uiLog } from '../../utils/logger'

type Props = { onNext:(payload:any)=>void; onPrev?:()=>void; value:any }

export default function HandbookStep({onNext,onPrev,value}:Props){
  const [handbook, setHandbook] = useState<string>('')
  const ackRef = React.useRef<HTMLButtonElement|null>(null)
  useEffect(()=>{
    uiLog('render',{component:'HandbookStep'})
    fetch('/api/handbook')
      .then(r=>r.json())
      .then(j=>setHandbook(j.content))
      .catch(e=>setHandbook('Failed to load handbook'))
  },[])
  React.useEffect(()=>{ ackRef.current?.focus() }, [handbook])

  return (
    <div className="card" role="region" aria-labelledby="handbookHeading">
      <h2 id="handbookHeading">Handbook</h2>
      <div className="markdown" style={{margin:'12px 0'}}>
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize] as any} children={handbook} />
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,color:'var(--muted)'}}>Read thoroughly before proceeding</div>
        <div style={{display:'flex',gap:8}}>
          <button className="button" onClick={()=>onPrev && onPrev()}>Back</button>
          <button ref={ackRef} className="button" onClick={()=>{uiLog('action',{action:'ack_handbook'}); onNext({handbook})}}>Acknowledge</button>
        </div>
      </div>
    </div>
  )
}
