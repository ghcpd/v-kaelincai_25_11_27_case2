// Generate UUID v4 without external dependency
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate random hex string for requestId
function generateRequestId(): string {
  return Math.random().toString(16).substring(2, 18).padEnd(16, '0');
}

function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export interface UIEvent {
  timestamp: string;
  requestId: string;
  type: 'page_load' | 'navigation' | 'form_input' | 'form_submit' | 'button_click' | 'accessibility_focus' | 'keyboard_navigation' | 'scroll' | 'resize' | 'markdown_render' | 'theme_change' | 'error';
  target: {
    componentName: string;
    elementId?: string;
    elementClass?: string;
  };
  action?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  status: 'success' | 'warning' | 'error';
  errorDetails?: {
    message: string;
    code: string;
  };
}

export interface UISession {
  id: string;
  startTime: string;
  endTime?: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  events: UIEvent[];
}

export class UILogger {
  private session: UISession;
  private events: UIEvent[] = [];

  constructor() {
    const now = new Date().toISOString();
    this.session = {
      id: generateUUID(),
      startTime: now,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        deviceType: getDeviceType(window.innerWidth),
      },
      events: [],
    };
  }

  logEvent(
    type: UIEvent['type'],
    target: UIEvent['target'],
    action?: Record<string, unknown>,
    metrics?: Record<string, unknown>,
    status: UIEvent['status'] = 'success',
    errorDetails?: { message: string; code: string }
  ): void {
    const event: UIEvent = {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      type,
      target,
      action,
      metrics,
      status,
      errorDetails,
    };
    this.events.push(event);
    console.log('[UILogger]', event);
  }

  getSession(): UISession {
    return {
      ...this.session,
      endTime: new Date().toISOString(),
      events: this.events,
    };
  }

  getSummary() {
    const stepsSet = new Set<string>();
    this.events.forEach((e) => {
      if (e.action && typeof e.action === 'object' && 'step' in e.action) {
        stepsSet.add(e.action.step as string);
      }
    });

    return {
      totalEvents: this.events.length,
      stepsCompleted: Array.from(stepsSet),
      errorCount: this.events.filter(e => e.status === 'error').length,
      accessibilityScore: this.calculateAccessibilityScore(),
      layoutStabilityScore: this.calculateLayoutStability(),
      ctaVisibilityRate: this.calculateCtaVisibility(),
    };
  }

  private calculateAccessibilityScore(): number {
    const violationEvents = this.events.filter(e => e.metrics?.accessibilityViolations);
    if (violationEvents.length === 0) return 100;
    const avgViolations = violationEvents.reduce((sum, e) => sum + (typeof e.metrics?.accessibilityViolations === 'number' ? e.metrics.accessibilityViolations : 0), 0) / violationEvents.length;
    return Math.max(0, 100 - avgViolations * 5);
  }

  private calculateLayoutStability(): number {
    const layoutEvents = this.events.filter(e => typeof e.metrics?.layoutShift === 'number');
    if (layoutEvents.length === 0) return 100;
    const totalShift = layoutEvents.reduce((sum, e) => sum + (typeof e.metrics?.layoutShift === 'number' ? e.metrics.layoutShift : 0), 0);
    return Math.max(0, 100 - totalShift * 100);
  }

  private calculateCtaVisibility(): number {
    const ctaEvents = this.events.filter(e => typeof e.metrics?.ctaVisible === 'boolean');
    if (ctaEvents.length === 0) return 1;
    const visibleCount = ctaEvents.filter(e => e.metrics?.ctaVisible === true).length;
    return visibleCount / ctaEvents.length;
  }

  exportAsJSON(): string {
    const session = this.getSession();
    const summary = this.getSummary();
    return JSON.stringify({ session, summary }, null, 2);
  }
}

export const uiLogger = new UILogger();
