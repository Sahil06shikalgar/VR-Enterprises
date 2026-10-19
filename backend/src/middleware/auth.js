import { asyncHandler } from '../utils.js'
import { unauthorized, forbidden } from '../errors.js'

/*
 * Admin authentication / authorization middleware.
 *   requireAuth  - resolves the session cookie to req.admin (+ req.session)
 *   requireRole  - role gate (e.g. ['owner'])
 *   requireCsrf  - double-submit token check for state-changing requests
 */
export function createAuthMiddleware({ config, authService }) {
  const requireAuth = asyncHandler(async (req, _res, next) => {
    const token = req.cookies?.[config.session.cookieName]
    const result = await authService.authenticate(token)
    if (!result) throw unauthorized('Please sign in to continue.', 'unauthenticated')
    req.admin = result.user
    req.session = result.session
    next()
  })

  const requireRole = (roles) => (req, _res, next) => {
    if (!req.admin) return next(unauthorized())
    if (!roles.includes(req.admin.role)) return next(forbidden('Your role cannot perform this action.', 'role_forbidden'))
    next()
  }

  const requireCsrf = (req, _res, next) => {
    const provided = req.get('x-csrf-token') || (req.body && req.body._csrf)
    if (!req.session || !authService.verifyCsrf(req.session, provided)) {
      return next(forbidden('Invalid or missing CSRF token.', 'csrf_failed'))
    }
    next()
  }

  return { requireAuth, requireRole, requireCsrf }
}

export default createAuthMiddleware
