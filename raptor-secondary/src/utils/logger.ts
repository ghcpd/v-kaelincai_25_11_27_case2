import type { UiEvent } from '@/types'

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function hashString(input: string) {
  try {
    if (typeof crypto !== 'undefined' && 'subtle' in crypto) {
      // Non-blocking hash; best-effort
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then((buf) =>
        Array.from(new Uint8Array(buf))
          .slice(0, 8)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
      )
    }
  } catch (e) {
    // ignore
  }
  // Fallback: simple (non-cryptographic) hash
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return `h${Math.abs(hash)}`
}

export type Logger = {
  sessionId: string
  logEvent: (event: Omit<UiEvent, 'sessionId' | 'requestId' | 'timestamp'> & { metadata?: UiEvent['metadata'] }) => void
  getEvents: () => UiEvent[]
}

export function createUiLogger(sessionId?: string): Logger {
  const sid = sessionId || makeId()
  const events: UiEvent[] = []
  if (typeof window !== 'undefined') {
    window.__UI_LOGS__ = window.__UI_LOGS__ || []
  }

  const emit = (event: UiEvent) => {
    events.push(event)
    if (typeof window !== 'undefined') {
      window.__UI_LOGS__!.push(event)
    }
    // eslint-disable-next-line no-console
    console.info('[ui-event]', JSON.stringify(event))
  }

  const logEvent: Logger['logEvent'] = (partial) => {
    const requestId = makeId()
    const uiEvent: UiEvent = {
      sessionId: sid,
      requestId,
      timestamp: new Date().toISOString(),
      ...partial,
    }
    emit(uiEvent)
  }

  return {
    sessionId: sid,
    logEvent,
    getEvents: () => [...events],
  }
}

// Utility to redact potentially sensitive strings
export async function redactPII(value: string | undefined) {
  if (!value) return undefined
  const hashed = await hashString(value)
  return typeof hashed === 'string' ? hashed : 'redacted'
}
