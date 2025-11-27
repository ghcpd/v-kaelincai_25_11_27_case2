import { v4 as uuidv4 } from 'uuid';

export interface UIEvent {
  sessionId: string;
  requestId: string;
  timestamp: string;
  eventType: 'page_load' | 'user_interaction' | 'navigation' | 'form_submit' | 'error' | 'performance';
  component: string;
  action: string;
  metadata?: {
    viewport?: {
      width: number;
      height: number;
      deviceType: 'desktop' | 'laptop' | 'tablet' | 'mobile';
    };
    stepId?: number;
    success?: boolean;
    errorCode?: string;
    duration?: number;
    theme?: 'light' | 'dark';
  };
}

class UILogger {
  private sessionId: string;
  private logs: UIEvent[] = [];

  constructor() {
    this.sessionId = uuidv4();
  }

  log(event: Omit<UIEvent, 'sessionId' | 'requestId' | 'timestamp'>): void {
    const logEntry: UIEvent = {
      sessionId: this.sessionId,
      requestId: uuidv4(),
      timestamp: new Date().toISOString(),
      ...event
    };

    this.logs.push(logEntry);
    
    // Output to console in development
    if (typeof window !== 'undefined') {
      console.log('[UI Event]', logEntry);
    }
  }

  getLogs(): UIEvent[] {
    return [...this.logs];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const uiLogger = new UILogger();

// Helper to determine device type from viewport
export function getDeviceType(width: number): 'desktop' | 'laptop' | 'tablet' | 'mobile' {
  if (width < 640) return 'mobile';
  if (width < 768) return 'tablet';
  if (width < 1440) return 'laptop';
  return 'desktop';
}

// Helper to get current viewport metadata
export function getViewportMetadata() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: getDeviceType(window.innerWidth)
  };
}
