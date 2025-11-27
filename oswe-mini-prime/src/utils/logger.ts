import { v4 as uuidv4 } from 'uuid'

let sessionId: string | null = null
export function initLogger(){
  if(!sessionId) sessionId = uuidv4()
  console.info('UI Logger initialized', {sessionId})
}

export function uiLog(event:string, payload:any={}){
  if(!sessionId) initLogger()
  const log = {
    sessionId,
    event,
    payload,
    timestamp: new Date().toISOString()
  }
  // redacted: no PII in logs; mask email
  if(log.payload && (log.payload.email || (log.payload?.payload && log.payload.payload.email))) {
    const email = log.payload.email ?? log.payload.payload.email
    const masked = maskEmail(email)
    if(log.payload.email) log.payload.email = masked
    if(log.payload.payload && log.payload.payload.email) log.payload.payload.email = masked
  }
  console.info('uiLog', log)
}

function maskEmail(email: string){
  if(!email) return email
  const [local,domain] = email.split('@')
  const maskedLocal = local.length > 2 ? local.slice(0,1) + '***' + local.slice(-1) : local
  return `${maskedLocal}@${domain}`
}
