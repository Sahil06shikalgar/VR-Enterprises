import helmet from 'helmet'
import cors from 'cors'
import { forbidden } from '../errors.js'

/*
 * Secure HTTP headers. CSP is explicit (no inline scripts) so the admin
 * dashboard must load its script externally. Inline styles are permitted only
 * to allow small layout tweaks in email-fallback HTML.
 */
export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
        'img-src': ["'self'", 'data:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'"],
        'connect-src': ["'self'"],
        'form-action': ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
}

/* Strict CORS allowlist (no wildcard). */
export function corsMiddleware(config) {
  const allow = new Set(config.corsOrigins)
  return cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true)
      return cb(null, allow.has(origin))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Requested-With', 'X-Correlation-Id'],
    exposedHeaders: ['X-Correlation-Id'],
    maxAge: 600,
  })
}

/*
 * Rejects cross-origin state-changing requests outright (defence in depth on
 * top of CORS + SameSite cookies).
 */
export function originGuard(config) {
  const allow = new Set(config.corsOrigins)
  return (req, _res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next()
    const origin = req.get('origin')
    if (!origin) return next()
    if (allow.has(origin) || origin === config.appUrl) return next()
    return next(forbidden('Request blocked by origin policy.', 'origin_blocked'))
  }
}
