type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
}

const SENSITIVE_KEY_RE = /(password|passwd|pwd|token|secret|authorization|cookie|appkey|api[_-]?key)/i
const URL_PASSWORD_RE = /([a-z][a-z0-9+.-]*:\/\/[^:/@\s]+:)([^@\s/]+)(@)/gi

interface LogPayload {
  event: string
  level: LogLevel
  timestamp: string
  fields: Record<string, unknown>
}

export function logDebug(event: string, fields: Record<string, unknown> = {}): void {
  writeLog('debug', event, fields)
}

export function logInfo(event: string, fields: Record<string, unknown> = {}): void {
  writeLog('info', event, fields)
}

export function logWarn(event: string, fields: Record<string, unknown> = {}): void {
  writeLog('warn', event, fields)
}

export function logError(event: string, fields: Record<string, unknown> = {}): void {
  writeLog('error', event, fields)
}

export function installBrowserErrorLogging(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('error', (event) => {
    logError('browser.error', {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      error: errorFields(event.error),
    })
  })
  window.addEventListener('unhandledrejection', (event) => {
    logError('browser.unhandled_rejection', {
      reason: errorFields(event.reason),
    })
  })
}

export function apiRequestStarted(path: string, method: string): { requestId: string; startedAt: number } {
  const requestId = createRequestId()
  logInfo('api.request.started', { requestId, method, path })
  return { requestId, startedAt: performance.now() }
}

export function apiRequestCompleted(path: string, method: string, requestId: string, startedAt: number, status: number): void {
  logInfo('api.request.completed', {
    requestId,
    method,
    path,
    status,
    elapsedMs: Math.round(performance.now() - startedAt),
  })
}

export function apiRequestFailed(path: string, method: string, requestId: string, startedAt: number, error: unknown, status?: number): void {
  logError('api.request.failed', {
    requestId,
    method,
    path,
    status,
    elapsedMs: Math.round(performance.now() - startedAt),
    error: errorFields(error),
  })
}

function writeLog(level: LogLevel, event: string, fields: Record<string, unknown>): void {
  if (!shouldLog(level)) return
  const payload: LogPayload = {
    event,
    level,
    timestamp: new Date().toISOString(),
    fields: redactRecord(fields),
  }
  const method = level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warn' ? 'warn' : 'error'
  console[method]('[app]', payload)
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[currentLevel()]
}

function currentLevel(): LogLevel {
  const configured = (
    (typeof window !== 'undefined' ? window.localStorage.getItem('app:log-level') : '') ||
    import.meta.env.VITE_APP_LOG_LEVEL ||
    (import.meta.env.DEV ? 'debug' : 'warn')
  ).toLowerCase()
  return isLogLevel(configured) ? configured : import.meta.env.DEV ? 'debug' : 'warn'
}

function isLogLevel(value: string): value is LogLevel {
  return value === 'debug' || value === 'info' || value === 'warn' || value === 'error' || value === 'silent'
}

function redactRecord(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, redactValue(key, value)]))
}

function redactValue(key: string, value: unknown): unknown {
  if (SENSITIVE_KEY_RE.test(key)) return '***'
  if (Array.isArray(value)) return value.map((item) => redactValue(key, item))
  if (value && typeof value === 'object') return redactRecord(value as Record<string, unknown>)
  if (typeof value === 'string') return value.replace(URL_PASSWORD_RE, '$1***$3')
  return value
}

function errorFields(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return { value: String(error) }
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
