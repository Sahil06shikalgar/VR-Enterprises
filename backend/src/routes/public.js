import { Router } from 'express'
import { createRequire } from 'node:module'
import { asyncHandler, clientIp, clientUserAgent, looksLikeSpam } from '../utils.js'
import { validateBody } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimit.js'
import { uploadMiddleware, validateUploadMiddleware } from '../services/uploads.js'
import { AppError } from '../errors.js'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

// Minimum time (ms) a human plausibly spends filling a form.
const MIN_FORM_MS = 1500

export function createPublicRouter({ config, logger, submissionService, schemas, repo }) {
  const router = Router()
  const limiter = formLimiter(config)

  const meta = (req) => ({
    ipAddress: clientIp(req),
    userAgent: clientUserAgent(req),
    correlationId: req.id,
    sourcePage: (req.body && (req.body.sourcePage || req.body.source_page)) || req.get('referer') || null,
  })

  function spamGuard(req, _res, next) {
    const { spam, reason } = looksLikeSpam(req.body, MIN_FORM_MS)
    if (spam) {
      logger.warn('Blocked likely spam submission', { reason, correlationId: req.id })
      return next(new AppError('Your submission could not be processed.', { status: 400, code: 'spam_blocked' }))
    }
    next()
  }

  router.get(
    '/health',
    asyncHandler(async (_req, res) => {
      let db = 'ok'
      try {
        await repo.ping()
      } catch (err) {
        db = 'down'
        logger.errorObj('Health check database ping failed', err)
      }
      const ok = db === 'ok'
      res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'degraded',
        db,
        version: pkg.version,
        uptimeSeconds: Math.round(process.uptime()),
        time: new Date().toISOString(),
      })
    }),
  )

  router.post(
    '/contact',
    limiter,
    uploadMiddleware(config, 'attachment'),
    validateUploadMiddleware('attachment'),
    spamGuard,
    validateBody(schemas.contactSchema),
    asyncHandler(async (req, res) => {
      const result = await submissionService.create('contact', req.validated.body, meta(req), req.validatedUpload)
      res.status(201).json({
        data: result,
        message: 'Thank you for reaching out. Our team will respond within one business day.',
      })
    }),
  )

  router.post(
    '/quote',
    limiter,
    uploadMiddleware(config, 'attachment'),
    validateUploadMiddleware('attachment'),
    spamGuard,
    validateBody(schemas.quoteSchema),
    asyncHandler(async (req, res) => {
      const result = await submissionService.create('quote', req.validated.body, meta(req), req.validatedUpload)
      res.status(201).json({
        data: result,
        message: 'Thank you — your quote request has been received. We will prepare a response shortly.',
      })
    }),
  )

  router.post(
    '/careers/apply',
    limiter,
    uploadMiddleware(config, 'resume'),
    validateUploadMiddleware('resume'),
    spamGuard,
    validateBody(schemas.careerSchema),
    asyncHandler(async (req, res) => {
      const result = await submissionService.create('career', req.validated.body, meta(req), req.validatedUpload)
      res.status(201).json({
        data: result,
        message: 'Thank you for your interest. Our team will review your application.',
      })
    }),
  )

  return router
}

export default createPublicRouter
