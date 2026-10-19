/*
 * Authentication service.
 *
 * - Passwords hashed with bcrypt (work factor 12).
 * - Sessions use an opaque random token; only its SHA-256 hash is stored, so a
 *   database leak cannot be replayed as a login.
 * - Sessions are rotated on login (existing sessions revoked).
 * - CSRF uses a per-session token compared in constant time.
 */
import bcrypt from 'bcryptjs'
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'

const BCRYPT_ROUNDS = 12

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

export function hashToken(value) {
  return createHash('sha256').update(String(value)).digest('hex')
}

export async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash)
  } catch {
    return false
  }
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''))
  const bufB = Buffer.from(String(b || ''))
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    lastLoginAt: user.lastLoginAt ?? null,
  }
}

export function createAuthService({ repo, config, logger }) {
  // Used to equalise timing between "unknown user" and "wrong password".
  const dummyHash = bcrypt.hashSync('timing-equaliser-not-a-real-password', BCRYPT_ROUNDS)

  return {
    async login({ email, password, ipAddress, userAgent }) {
      const user = await repo.findUserByEmail(email)
      const hashToCheck = user ? user.passwordHash : dummyHash

      let passwordOk = false
      try {
        passwordOk = await bcrypt.compare(password, hashToCheck)
      } catch {
        passwordOk = false
      }

      if (!user || !user.isActive || !passwordOk) {
        logger.warn('Failed admin login attempt', { email })
        return null
      }

      await repo.revokeUserSessions(user.id)

      const token = generateToken(32)
      const csrfToken = generateToken(24)
      const expiresAt = new Date(Date.now() + config.session.ttlMs)

      await repo.createSession({
        tokenHash: hashToken(token),
        csrfToken,
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt,
      })
      await repo.updateUserLastLogin(user.id)

      return { user: publicUser(user), token, csrfToken, expiresAt }
    },

    async authenticate(token) {
      if (!token) return null
      const session = await repo.findSessionByTokenHash(hashToken(token))
      if (!session || session.revokedAt) return null
      if (session.expiresAt && new Date(session.expiresAt) <= new Date()) return null

      const user = await repo.findUserById(session.userId)
      if (!user || !user.isActive) return null

      await repo.touchSession(session.id)
      return { user: publicUser(user), session }
    },

    async logout(token) {
      if (!token) return
      const session = await repo.findSessionByTokenHash(hashToken(token))
      if (session && !session.revokedAt) await repo.revokeSession(session.id)
    },

    verifyCsrf(session, provided) {
      if (!session || !provided) return false
      return safeEqual(session.csrfToken, provided)
    },
  }
}

export default createAuthService
