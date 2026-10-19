import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAuthService } from './services/auth.js'
import { createSubmissionService } from './services/submissions.js'
import { createAuthMiddleware } from './middleware/auth.js'
import { correlationMiddleware } from './middleware/correlation.js'
import { securityHeaders, corsMiddleware, originGuard } from './middleware/security.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'
import { createPublicRouter } from './routes/public.js'
import { createAdminRouter } from './routes/admin.js'
import { buildSubmissionSchemas } from './validation/schemas.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const adminDir = path.resolve(here, '..', 'public', 'admin')

/*
 * Builds the Express app from injected dependencies. Because the repository and
 * mailer are injected, the exact same wiring runs against PostgreSQL in
 * production and an in-memory repository (with a fake mailer) in tests.
 */
export function createApp({ config, repo, emailService, logger }) {
  const authService = createAuthService({ repo, config, logger })
  const submissionService = createSubmissionService({ repo, emailService, config, logger })
  const authMiddleware = createAuthMiddleware({ config, authService })
  const schemas = buildSubmissionSchemas({ careerPositions: config.careerPositions })

  const app = express()
  app.disable('x-powered-by')
  if (config.trustProxy) app.set('trust proxy', 1)

  app.use(correlationMiddleware(logger))

  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      req.log?.info('request', {
        status: res.statusCode,
        durationMs: Date.now() - start,
      })
    })
    next()
  })

  app.use(securityHeaders())
  app.use(corsMiddleware(config))
  app.use(originGuard(config))
  app.use(express.json({ limit: '100kb' }))
  app.use(express.urlencoded({ extended: false, limit: '100kb' }))
  app.use(cookieParser())

  // Optional self-hosted admin dashboard.
  app.use('/admin', express.static(adminDir, { index: 'index.html', extensions: ['html'] }))

  app.use(
    '/api',
    createPublicRouter({ config, logger, submissionService, schemas, repo }),
  )
  app.use(
    '/api/admin',
    createAdminRouter({ config, logger, submissionService, authService, authMiddleware, repo }),
  )

  app.get('/', (_req, res) => {
    res.json({ name: 'VR Enterprises API', health: '/api/health', admin: '/admin' })
  })

  app.use(notFoundHandler)
  app.use(errorHandler())
  return app
}

export default createApp
