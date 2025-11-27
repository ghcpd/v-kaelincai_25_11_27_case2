import React, {useState,useEffect,FormEvent} from 'react'
import { uiLog } from '../../utils/logger'

type Props = { onNext:(payload:any)=>void; value:any }

export default function ProfileStep({onNext,value}:Props){
  const [name,setName] = useState(value?.name ?? '')
  const [email,setEmail] = useState(value?.email ?? '')
  const nameRef = React.useRef<HTMLInputElement|null>(null)
  React.useEffect(()=>{ nameRef.current?.focus() }, [])
  useEffect(()=>{uiLog('render', {component:'ProfileStep'})}, [])

  const onSubmit = (e:FormEvent) => {
    e.preventDefault()
    uiLog('action', {action:'submit_profile', payload:{name,email}})
    onNext({name,email})
  }

  return (
    <div className="card" role="region" aria-labelledby="profileHeading">
      <h2 id="profileHeading">Profile</h2>
      <form onSubmit={onSubmit}>
        <label style={{display:'block',margin:'12px 0'}}>
          Name
          <input ref={nameRef} aria-label="name" value={name} onChange={e=>setName(e.target.value)} style={{display:'block',width:'100%',padding:8}} />
        </label>
        <label style={{display:'block',margin:'12px 0'}}>
          Email
          <input aria-label="email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',width:'100%',padding:8}} />
        </label>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button aria-label="next-step" type="submit" className="button">Next</button>
        </div>
      </form>
    </div>
  )
}
