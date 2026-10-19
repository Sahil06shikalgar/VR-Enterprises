/*
 * Small shared helpers.
 */
import { createHash } from 'node:crypto'

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export function clientIp(req) {
  return (req.ip || req.socket?.remoteAddress || '').toString().slice(0, 64) || null
}

export function clientUserAgent(req) {
  const ua = req.get('user-agent') || ''
  return ua.slice(0, 400) || null
}

/*
 * Spam heuristics: a hidden honeypot field must stay empty, and the form must
 * have been on screen for at least `minMs` before submission.
 */
export function looksLikeSpam(body, minMs) {
  const honeypot = (body?.website ?? body?.company_website ?? body?.hp ?? '').toString().trim()
  if (honeypot) return { spam: true, reason: 'honeypot' }

  const started = Number(body?.formStartedAt)
  if (Number.isFinite(started) && started > 0) {
    if (Date.now() - started < minMs) return { spam: true, reason: 'too_fast' }
  }
  return { spam: false }
}

export function sha256Short(value) {
  return createHash('sha256').update(String(value)).digest('hex').slice(0, 40)
}
