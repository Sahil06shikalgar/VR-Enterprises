import rateLimit from 'express-rate-limit'
import { tooMany } from '../errors.js'

/*
 * Rate limiting.
 *  - public form endpoints: configurable window/max (default 10 / 15 min / IP)
 *  - login: hard cap to slow credential stuffing
 *  - authenticated admin API: generous but bounded
 */
export function formLimiter(config) {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) =>
      next(tooMany('Too many submissions from this device. Please wait a few minutes and try again.')),
  })
}

export function loginLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => next(tooMany('Too many login attempts. Please try again later.')),
  })
}

export function adminLimiter(config) {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.adminMax,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => next(tooMany()),
  })
}
