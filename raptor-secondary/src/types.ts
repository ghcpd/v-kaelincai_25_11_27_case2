export type OnboardingStep = {
  id: string
  title: string
  contentMarkdown: string
  ariaDescription?: string
}

export type Profile = {
  id: string
  name: string
  role: string
}

export type MockApiData = {
  profile: Profile
  steps: OnboardingStep[]
  handbookMarkdown: string
}

export type UiEvent = {
  sessionId: string
  requestId: string
  event: string
  stepId?: string
  action?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

declare global {
  interface Window {
    __UI_LOGS__?: UiEvent[]
  }
}
