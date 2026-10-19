import { Router } from 'express'
import path from 'node:path'
import { createReadStream, existsSync } from 'node:fs'
import { asyncHandler, clientIp, clientUserAgent } from '../utils.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { adminLoginSchema, adminUpdateSchema, adminListQuerySchema } from '../validation/schemas.js'
import { loginLimiter, adminLimiter } from '../middleware/rateLimit.js'
import { unauthorized, notFound } from '../errors.js'

const KIND_BY_RESOURCE = { inquiries: 'contact', quotes: 'quote', applications: 'career' }

function safeDownloadName(name) {
  const base = String(name || 'download').replace(/[\r\n"]/g, '')
  return base.replace(/[^A-Za-z0-9._ ()-]/g, '_').slice(0, 180) || 'download'
}

export function createAdminRouter({ config, logger, submissionService, authService, authMiddleware, repo }) {
  const router = Router()
  const { requireAuth, requireRole, requireCsrf } = authMiddleware

  router.post(
    '/login',
    loginLimiter(),
    validateBody(adminLoginSchema),
    asyncHandler(async (req, res) => {
      const { email, password } = req.validated.body
      const result = await authService.login({
        email,
        password,
        ipAddress: clientIp(req),
        userAgent: clientUserAgent(req),
      })
      if (!result) throw unauthorized('Invalid email or password.', 'invalid_credentials')

      res.cookie(config.session.cookieName, result.token, {
        httpOnly: true,
        secure: config.session.secure,
        sameSite: config.session.sameSite,
        domain: config.session.cookieDomain,
        maxAge: config.session.ttlMs,
        path: '/',
      })
      res.json({ data: { user: result.user, csrfToken: result.csrfToken, expiresAt: result.expiresAt } })
    }),
  )

  router.post(
    '/logout',
    requireAuth,
    requireCsrf,
    asyncHandler(async (req, res) => {
      await authService.logout(req.cookies?.[config.session.cookieName])
      res.clearCookie(config.session.cookieName, {
        path: '/',
        secure: config.session.secure,
        sameSite: config.session.sameSite,
        domain: config.session.cookieDomain,
      })
      res.json({ data: { ok: true } })
    }),
  )

  router.get('/me', requireAuth, (req, res) => {
    res.json({ data: { user: req.admin, csrfToken: req.session.csrfToken } })
  })

  // Everything below requires an authenticated admin session.
  router.use(requireAuth, adminLimiter(config))

  // Owner-only: list admin accounts (never exposes password hashes).
  router.get(
    '/users',
    requireRole(['owner']),
    asyncHandler(async (_req, res) => {
      const rows = await repo.listUsers()
      const users = rows.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt ?? null,
        createdAt: u.createdAt,
      }))
      res.json({ data: users })
    }),
  )

  for (const [resource, kind] of Object.entries(KIND_BY_RESOURCE)) {
    router.get(
      `/${resource}`,
      validateQuery(adminListQuerySchema),
      asyncHandler(async (req, res) => {
        const query = req.validated.query
        const { items, total } = await submissionService.list(kind, query)
        res.json({
          data: items,
          meta: { total, limit: query.limit || 20, offset: query.offset || 0 },
        })
      }),
    )

    router.get(
      `/${resource}/:id`,
      asyncHandler(async (req, res) => {
        const detail = await submissionService.detail(kind, req.params.id)
        if (!detail) throw notFound('Submission not found.')
        res.json({ data: detail })
      }),
    )

    router.patch(
      `/${resource}/:id`,
      requireCsrf,
      validateBody(adminUpdateSchema),
      asyncHandler(async (req, res) => {
        const updated = await submissionService.update(kind, req.params.id, req.validated.body, req.admin)
        if (!updated) throw notFound('Submission not found.')
        res.json({ data: updated })
      }),
    )
  }

  router.get(
    '/attachments/:id/download',
    asyncHandler(async (req, res) => {
      const attachment = await repo.getAttachment(req.params.id)
      if (!attachment) throw notFound('Attachment not found.')

      const dir = path.resolve(config.uploads.dir)
      const full = path.resolve(dir, attachment.storedName)
      if (!full.startsWith(dir + path.sep)) throw notFound('Attachment not found.')
      if (!existsSync(full)) throw notFound('This file is no longer available.')

      res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream')
      res.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName(attachment.originalName)}"`)
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Cache-Control', 'private, no-store')
      createReadStream(full).on('error', (err) => {
        logger.errorObj('Attachment stream failed', err, { attachmentId: attachment.id })
        if (!res.headersSent) res.status(500).json({ error: { code: 'download_failed', message: 'Download failed.' } })
        else res.destroy()
      }).pipe(res)
    }),
  )

  return router
}

export default createAdminRouter
