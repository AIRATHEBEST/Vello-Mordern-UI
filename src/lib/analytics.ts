/**
 * Analytics and Monitoring System
 * Tracks user interactions, performance, and errors
 */

export interface AnalyticsEvent {
  event_type: string
  timestamp: string
  user_id?: string
  session_id: string
  properties: Record<string, any>
  duration?: number
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: string
}

export interface ErrorLog {
  error_type: string
  message: string
  stack?: string
  timestamp: string
  context: Record<string, any>
}

class Analytics {
  private sessionId: string
  private userId: string | null = null
  private events: AnalyticsEvent[] = []
  private metrics: PerformanceMetric[] = []
  private errors: ErrorLog[] = []
  private analyticsUrl = import.meta.env.VITE_ANALYTICS_ENDPOINT || 'https://analytics.example.com'

  constructor() {
    this.sessionId = this.generateSessionId()
    this.userId = localStorage.getItem('user_id')
    this.setupPerformanceMonitoring()
    this.setupErrorTracking()
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Track user event
   */
  trackEvent(eventType: string, properties: Record<string, any> = {}, duration?: number) {
    const event: AnalyticsEvent = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      user_id: this.userId || undefined,
      session_id: this.sessionId,
      properties,
      duration,
    }

    this.events.push(event)

    // Send to analytics backend
    this.sendEvent(event)

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', eventType, properties)
    }
  }

  /**
   * Track model selection
   */
  trackModelSelection(modelId: string, modelName: string) {
    this.trackEvent('model_selected', {
      model_id: modelId,
      model_name: modelName,
      timestamp: Date.now(),
    })
  }

  /**
   * Track cognitive mode selection
   */
  trackModeSelection(mode: string) {
    this.trackEvent('mode_selected', {
      mode,
      timestamp: Date.now(),
    })
  }

  /**
   * Track tool usage
   */
  trackToolUsage(toolName: string, config?: Record<string, any>) {
    this.trackEvent('tool_used', {
      tool_name: toolName,
      config,
      timestamp: Date.now(),
    })
  }

  /**
   * Track conversation start
   */
  trackConversationStart(modelId: string, intent: string) {
    this.trackEvent('conversation_started', {
      model_id: modelId,
      intent,
      timestamp: Date.now(),
    })
  }

  /**
   * Track message sent
   */
  trackMessageSent(modelId: string, messageLength: number) {
    this.trackEvent('message_sent', {
      model_id: modelId,
      message_length: messageLength,
      timestamp: Date.now(),
    })
  }

  /**
   * Track message received
   */
  trackMessageReceived(modelId: string, responseLength: number, duration: number) {
    this.trackEvent('message_received', {
      model_id: modelId,
      response_length: responseLength,
      duration,
      timestamp: Date.now(),
    })
  }

  /**
   * Track orchestration pipeline execution
   */
  trackPipelineExecution(pipelineType: string, stepCount: number, duration: number) {
    this.trackEvent('pipeline_executed', {
      pipeline_type: pipelineType,
      step_count: stepCount,
      duration,
      timestamp: Date.now(),
    })
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName: string, metadata?: Record<string, any>) {
    this.trackEvent('feature_used', {
      feature_name: featureName,
      metadata,
      timestamp: Date.now(),
    })
  }

  /**
   * Track performance metric
   */
  trackMetric(name: string, value: number, unit: string = 'ms') {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
    }

    this.metrics.push(metric)
    this.sendMetric(metric)

    if (import.meta.env.DEV) {
      console.log(`⏱️ Performance Metric: ${name} = ${value}${unit}`)
    }
  }

  /**
   * Track error
   */
  trackError(errorType: string, message: string, context: Record<string, any> = {}, stack?: string) {
    const error: ErrorLog = {
      error_type: errorType,
      message,
      stack,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        session_id: this.sessionId,
        user_id: this.userId,
      },
    }

    this.errors.push(error)
    this.sendError(error)

    console.error('❌ Error Tracked:', errorType, message, context)
  }

  /**
   * Set user ID
   */
  setUserId(userId: string) {
    this.userId = userId
    localStorage.setItem('user_id', userId)
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Track page load time
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const perfData = window.performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        this.trackMetric('page_load_time', pageLoadTime)

        // Track other performance metrics
        const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart
        this.trackMetric('dom_content_loaded', domContentLoaded)

        const resourcesLoaded = perfData.responseEnd - perfData.fetchStart
        this.trackMetric('resources_loaded', resourcesLoaded)
      })
    }

    // Track long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackMetric('long_task_duration', entry.duration)
          }
        })
        observer.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Long task observer not supported
      }
    }
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking() {
    // Track uncaught errors
    window.addEventListener('error', (event) => {
      this.trackError('uncaught_error', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_rejection', String(event.reason), {
        promise: event.promise,
      })
    })
  }

  /**
   * Send event to analytics backend
   */
  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch(`${this.analyticsUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {
        // Silently fail if analytics endpoint not available
      })
    } catch (e) {
      // Ignore errors
    }
  }

  /**
   * Send metric to analytics backend
   */
  private async sendMetric(metric: PerformanceMetric) {
    try {
      await fetch(`${this.analyticsUrl}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(() => {
        // Silently fail
      })
    } catch (e) {
      // Ignore errors
    }
  }

  /**
   * Send error to analytics backend
   */
  private async sendError(error: ErrorLog) {
    try {
      await fetch(`${this.analyticsUrl}/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      }).catch(() => {
        // Silently fail
      })
    } catch (e) {
      // Ignore errors
    }
  }

  /**
   * Get analytics summary
   */
  getSummary() {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      total_events: this.events.length,
      total_metrics: this.metrics.length,
      total_errors: this.errors.length,
      events: this.events,
      metrics: this.metrics,
      errors: this.errors,
    }
  }

  /**
   * Export analytics data
   */
  exportData() {
    return JSON.stringify(this.getSummary(), null, 2)
  }
}

// Export singleton instance
export const analytics = new Analytics()
