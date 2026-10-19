/*
 * Environment configuration.
 *
 * Parsed and validated with Zod at startup. Required secrets are enforced in
 * production so the process fails fast instead of booting in an insecure state.
 * Tests build their own config object via loadConfig({ ... }).
 */
import { z } from 'zod'
import { DEFAULT_CAREER_POSITIONS } from './constants.js'

function csvList(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function formatIssues(error) {
  return error.issues.map((i) => `${i.path.join('.') || 'env'}: ${i.message}`).join('; ')
}

/*
 * Which SQL engine to use.
 *   DB_CLIENT=postgres|sqlite forces a driver; `auto` (default) infers from the
 *   connection string (file:/sqlite: => SQLite, anything else -> PostgreSQL) and
 *   falls back to embedded SQLite when no DATABASE_URL is set, so a fresh clone
 *   runs with zero external services.
 */
const DEFAULT_SQLITE_URL = 'file:./storage/vr.sqlite'

function resolveDatabaseClient(raw) {
  if (raw.DB_CLIENT === 'postgres' || raw.DB_CLIENT === 'sqlite') return raw.DB_CLIENT
  const url = String(raw.DATABASE_URL || '')
  if (/^(file:|sqlite:|sqlite3:)/i.test(url)) return 'sqlite'
  if (url) return 'postgres'
  return 'sqlite'
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  APP_URL: z.string().url().default('http://localhost:5176'),
  CORS_ORIGINS: z.string().optional().default(''),
  TRUST_PROXY: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'silent']).default('info'),

  DB_CLIENT: z.enum(['postgres', 'sqlite', 'auto']).default('auto'),
  DATABASE_URL: z.string().optional().default(''),
  DATABASE_SSL: z.coerce.boolean().default(false),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),

  SESSION_SECRET: z.string().optional().default(''),
  CSRF_SECRET: z.string().optional().default(''),
  SESSION_TTL_HOURS: z.coerce.number().positive().default(12),
  COOKIE_DOMAIN: z.string().optional().default(''),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),

  EMAIL_PROVIDER: z.enum(['smtp', 'console', 'none']).optional(),
  EMAIL_FROM: z.string().optional().default('VR Enterprises <no-reply@thevrenterprises.com>'),
  EMAIL_TO: z.string().optional().default('sales@thevrenterprises.com'),
  EMAIL_CC: z.string().optional().default('vrenterprises.nm@gmail.com'),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),

  UPLOAD_DIR: z.string().optional().default('storage/uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_ADMIN_MAX: z.coerce.number().int().positive().default(300),

  CAPTCHA_ENABLED: z.coerce.boolean().default(false),
  CAPTCHA_PROVIDER: z.enum(['recaptcha', 'hcaptcha', 'turnstile', 'none']).default('none'),
  CAPTCHA_SECRET: z.string().optional().default(''),

  CAREER_POSITIONS: z.string().optional().default(''),
})

export function loadConfig(env = process.env) {
  const parsed = schema.safeParse(env)
  if (!parsed.success) {
    throw new Error('Invalid environment configuration: ' + formatIssues(parsed.error))
  }
  const raw = parsed.data

  const databaseClient = resolveDatabaseClient(raw)
  const databaseUrl = raw.DATABASE_URL || (databaseClient === 'sqlite' ? DEFAULT_SQLITE_URL : '')

  const problems = []
  if (raw.NODE_ENV === 'production') {
    if (!databaseUrl) problems.push('DATABASE_URL is required in production')
    if (raw.SESSION_SECRET.length < 32) problems.push('SESSION_SECRET (>=32 chars) is required in production')
    if (!raw.CSRF_SECRET || raw.CSRF_SECRET.length < 32)
      problems.push('CSRF_SECRET (>=32 chars) is required in production')
    if (!raw.EMAIL_PROVIDER && raw.EMAIL_PROVIDER !== 'smtp' && !raw.SMTP_HOST)
      problems.push('A real email provider (EMAIL_PROVIDER=smtp with SMTP_* settings) is required in production')
  }
  if (problems.length) {
    throw new Error('Invalid environment configuration:\n- ' + problems.join('\n- '))
  }

  const provider =
    raw.EMAIL_PROVIDER || (raw.SMTP_HOST ? 'smtp' : 'console')

  const devOrigins =
    raw.NODE_ENV === 'production'
      ? []
      : ['http://localhost:5176', 'http://localhost:5173', 'http://127.0.0.1:5176']

  const corsOrigins = Array.from(
    new Set([raw.APP_URL, ...devOrigins, ...csvList(raw.CORS_ORIGINS)].filter(Boolean)),
  )

  const careerPositions = csvList(raw.CAREER_POSITIONS)

  return {
    env: raw.NODE_ENV,
    isProduction: raw.NODE_ENV === 'production',
    isTest: raw.NODE_ENV === 'test',
    port: raw.PORT,
    appUrl: raw.APP_URL,
    corsOrigins,
    trustProxy: raw.TRUST_PROXY,
    logLevel: raw.LOG_LEVEL,
    database: {
      client: databaseClient,
      url: databaseUrl,
      ssl: raw.DATABASE_SSL,
      poolMax: raw.DATABASE_POOL_MAX,
    },
    session: {
      secret: raw.SESSION_SECRET || 'dev-insecure-session-secret-change-me-please-32',
      csrfSecret: raw.CSRF_SECRET || raw.SESSION_SECRET || 'dev-insecure-csrf-secret-change-me-please-32',
      ttlMs: Math.round(raw.SESSION_TTL_HOURS * 60 * 60 * 1000),
      cookieName: 'vr_admin_session',
      cookieDomain: raw.COOKIE_DOMAIN || undefined,
      secure: raw.NODE_ENV === 'production',
      sameSite: raw.COOKIE_SAME_SITE,
    },
    email: {
      provider,
      from: raw.EMAIL_FROM,
      to: raw.EMAIL_TO,
      cc: raw.EMAIL_CC,
      smtp: {
        host: raw.SMTP_HOST,
        port: raw.SMTP_PORT,
        secure: raw.SMTP_SECURE,
        user: raw.SMTP_USER,
        pass: raw.SMTP_PASS,
      },
    },
    uploads: {
      dir: raw.UPLOAD_DIR,
      maxBytes: Math.round(raw.MAX_UPLOAD_MB * 1024 * 1024),
    },
    rateLimit: {
      windowMs: raw.RATE_LIMIT_WINDOW_MS,
      max: raw.RATE_LIMIT_MAX,
      adminMax: raw.RATE_LIMIT_ADMIN_MAX,
    },
    captcha: {
      enabled: raw.CAPTCHA_ENABLED,
      provider: raw.CAPTCHA_PROVIDER,
      secret: raw.CAPTCHA_SECRET,
    },
    careerPositions: careerPositions.length ? careerPositions : [...DEFAULT_CAREER_POSITIONS],
  }
}

export { formatIssues as formatConfigIssues }
