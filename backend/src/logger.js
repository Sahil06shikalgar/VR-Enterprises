/*
 * Minimal structured JSON logger.
 *
 * Emits one JSON object per line so logs are easy to ship/aggregate. It never
 * throws and never serialises secrets: only the values a caller passes are
 * emitted, and a small redaction list guards common secret keys.
 *
 * Deliberately dependency-free to avoid pulling a large logging stack for a
 * small API.
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 }

const REDACT_KEYS = new Set([
  'password',
  'passwordHash',
  'password_hash',
  'pass',
  'token',
  'sessionToken',
  'csrf',
  'csrfToken',
  'authorization',
  'cookie',
  'secret',
  'SESSION_SECRET',
  'smtpPass',
  'SMTP_PASS',
  'DATABASE_URL',
])

function redact(value, depth = 0) {
  if (depth > 4 || value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1))
  const out = {}
  for (const [k, v] of Object.entries(value)) {
    out[k] = REDACT_KEYS.has(k) ? '[redacted]' : redact(v, depth + 1)
  }
  return out
}

function normaliseError(err) {
  if (!err) return undefined
  if (err instanceof Error) {
    return { name: err.name, message: err.message, code: err.code }
  }
  return err
}

export function createLogger({ level = 'info', base = {} } = {}) {
  const threshold = LEVELS[level] ?? LEVELS.info

  function emit(lvl, msg, fields) {
    if (LEVELS[lvl] < threshold) return
    const record = {
      ts: new Date().toISOString(),
      level: lvl,
      msg,
      ...redact(base),
      ...redact(fields),
    }
    const line = JSON.stringify(record)
    if (lvl === 'error') process.stderr.write(line + '\n')
    else process.stdout.write(line + '\n')
  }

  const logger = {
    level,
    child(extra) {
      return createLogger({ level, base: { ...base, ...extra } })
    },
    debug: (msg, fields) => emit('debug', msg, fields),
    info: (msg, fields) => emit('info', msg, fields),
    warn: (msg, fields) => emit('warn', msg, fields),
    error: (msg, fields) => emit('error', msg, fields),
    errorObj(msg, err, fields) {
      emit('error', msg, { ...fields, err: normaliseError(err) })
    },
  }

  return logger
}

export const logger = createLogger({ level: process.env.LOG_LEVEL || 'info' })

export default logger
