/*
 * Shared test helpers.
 *
 * Tests run against the real Express app with an in-memory repository and a
 * fake mailer, so no PostgreSQL or SMTP server is required. (This file is not a
 * test itself; it only exports helpers.)
 */
import { createApp } from '../src/app.js'
import { createMemoryRepository } from '../src/repositories/memory.js'
import { loadConfig } from '../src/config.js'
import { createLogger } from '../src/logger.js'
import { hashPassword } from '../src/services/auth.js'

export function testConfig(env = {}) {
  return loadConfig({
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
    SESSION_SECRET: 'test-session-secret-0123456789abcdefghij',
    CSRF_SECRET: 'test-csrf-secret-0123456789abcdefghijkl',
    ...env,
  })
}

export function fakeEmail({ failAdmin = false } = {}) {
  const calls = { admin: [], ack: [] }
  return {
    provider: 'fake',
    calls,
    async sendAdminNotification(kind, record) {
      calls.admin.push({ kind, id: record.id })
      if (failAdmin) return { ok: false, error: 'simulated smtp failure' }
      return { ok: true }
    },
    async sendAcknowledgement(kind, record) {
      calls.ack.push({ kind, id: record.id })
      return { ok: true }
    },
  }
}

export function buildTestApp({ env, email, repo } = {}) {
  const config = testConfig(env)
  const repository = repo || createMemoryRepository()
  const emailService = email || fakeEmail()
  const logger = createLogger({ level: 'silent' })
  const app = createApp({ config, repo: repository, emailService, logger })
  return { app, repo: repository, config, emailService, logger }
}

export async function seedAdmin(
  repo,
  { email = 'admin@example.com', password = 'super-secret-password', role = 'owner', name = 'Test Admin' } = {},
) {
  const passwordHash = await hashPassword(password)
  return repo.createUser({ email, passwordHash, name, role })
}

export function validContact(overrides = {}) {
  return {
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 99302 81240',
    subject: 'Signage enquiry',
    message: 'We need signage for our new office in Navi Mumbai.',
    consent: true,
    ...overrides,
  }
}

export function validQuote(overrides = {}) {
  return {
    fullName: 'Rahul Verma',
    email: 'rahul@example.com',
    phone: '9876543210',
    service: 'branding',
    projectDescription: 'We need complete branding for a new retail outlet.',
    consent: true,
    ...overrides,
  }
}

export function validCareer(overrides = {}) {
  return {
    fullName: 'Anita Rao',
    email: 'anita@example.com',
    phone: '9123456780',
    position: 'General Application',
    experience: '3 years',
    coverMessage: 'I would love to join your design team.',
    consent: true,
    ...overrides,
  }
}

export const sessionCookieFrom = (res) => {
  const raw = res.headers['set-cookie'] || []
  const cookie = raw.find((c) => c.startsWith('vr_admin_session='))
  return cookie ? cookie.split(';')[0] : null
}
