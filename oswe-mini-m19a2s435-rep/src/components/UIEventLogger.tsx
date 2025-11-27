import { useRef } from 'react'

export type UIEvent = {
  eventType: string
  details?: Record<string, any>
  sessionId: string
  timestamp: string
}

export function createSessionId(){
  // simple unique id
  return `sid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,9)}`
}

export default function useUIEventLogger(){
  const sessionRef = useRef<string>(createSessionId())

  function logEvent(eventType: string, details?: Record<string, any>){
    const ev: UIEvent = {
      eventType,
      details: details || {},
      sessionId: sessionRef.current,
      timestamp: new Date().toISOString()
    }
    // Emit structured logs to console or save to localStorage (no PII)
    console.log('[UI-LOG]', JSON.stringify(ev))
    try{
      const key = `ui_events_${sessionRef.current}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(ev)
      localStorage.setItem(key, JSON.stringify(existing))
    }catch(e){ /* ignore in server envs */ }
  }

  return { logEvent, sessionId: sessionRef.current }
}
