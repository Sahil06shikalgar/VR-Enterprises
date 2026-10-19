/*
 * In-memory repository implementation.
 *
 * Used by the automated test-suite (and only there) so the full HTTP stack can
 * be exercised without a live PostgreSQL instance. It mirrors the exact method
 * surface of the Postgres repository. It is NOT used in production.
 */
import { randomUUID } from 'node:crypto'

function now() {
  return new Date()
}

const KINDS = { contact: 'contact', quote: 'quote', career: 'career' }

export function createMemoryRepository() {
  const store = {
    users: [],
    sessions: [],
    contact: [],
    quote: [],
    career: [],
    attachments: [],
    activity: [],
  }

  // Allow tests to simulate infrastructure failures.
  let failNext = null

  const submissionsOf = (kind) => {
    if (!KINDS[kind]) throw new Error(`Unknown submission kind: ${kind}`)
    return store[kind]
  }

  return {
    __store: store,
    __failNext(flag) {
      failNext = flag
    },
    __assertOk() {
      if (failNext) {
        const err = new Error(failNext.message || 'simulated database failure')
        err.code = failNext.code || 'DB_UNAVAILABLE'
        failNext = null
        throw err
      }
    },

    // ---- users -----------------------------------------------------------
    async createUser(data) {
      this.__assertOk()
      const user = {
        id: randomUUID(),
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role || 'admin',
        isActive: true,
        lastLoginAt: null,
        createdAt: now(),
        updatedAt: now(),
      }
      store.users.push(user)
      return user
    },
    async findUserByEmail(email) {
      this.__assertOk()
      return store.users.find((u) => u.email === email) || null
    },
    async findUserById(id) {
      this.__assertOk()
      return store.users.find((u) => u.id === id) || null
    },
    async listUsers() {
      this.__assertOk()
      return [...store.users]
    },
    async updateUserLastLogin(id, ts = now()) {
      this.__assertOk()
      const user = store.users.find((u) => u.id === id)
      if (user) {
        user.lastLoginAt = ts
        user.updatedAt = now()
      }
      return user
    },
    async updateUserPassword(id, passwordHash, role) {
      this.__assertOk()
      const user = store.users.find((u) => u.id === id)
      if (!user) return null
      user.passwordHash = passwordHash
      if (role) user.role = role
      user.updatedAt = now()
      return user
    },

    // ---- sessions --------------------------------------------------------
    async createSession(data) {
      this.__assertOk()
      const session = {
        id: randomUUID(),
        tokenHash: data.tokenHash,
        csrfToken: data.csrfToken,
        userId: data.userId,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        createdAt: now(),
        lastSeenAt: now(),
        expiresAt: data.expiresAt,
        revokedAt: null,
      }
      store.sessions.push(session)
      return session
    },
    async findSessionByTokenHash(tokenHash) {
      this.__assertOk()
      return store.sessions.find((s) => s.tokenHash === tokenHash) || null
    },
    async touchSession(id) {
      this.__assertOk()
      const s = store.sessions.find((x) => x.id === id)
      if (s) s.lastSeenAt = now()
      return s
    },
    async revokeSession(id) {
      this.__assertOk()
      const s = store.sessions.find((x) => x.id === id)
      if (s) s.revokedAt = now()
      return s
    },
    async revokeUserSessions(userId) {
      this.__assertOk()
      for (const s of store.sessions) if (s.userId === userId && !s.revokedAt) s.revokedAt = now()
    },

    // ---- submissions -----------------------------------------------------
    async createSubmission(kind, data) {
      this.__assertOk()
      const record = {
        id: randomUUID(),
        ...data,
        status: data.status || 'new',
        internalNotes: data.internalNotes ?? null,
        assignedAdminId: data.assignedAdminId ?? null,
        archivedAt: data.archivedAt ?? null,
        createdAt: now(),
        updatedAt: now(),
      }
      submissionsOf(kind).push(record)
      return record
    },
    async getSubmission(kind, id) {
      this.__assertOk()
      return submissionsOf(kind).find((r) => r.id === id) || null
    },
    async listSubmissions(kind, filters = {}) {
      this.__assertOk()
      let items = [...submissionsOf(kind)]
      if (filters.status) items = items.filter((r) => r.status === filters.status)
      if (filters.service) items = items.filter((r) => r.service === filters.service)
      if (filters.archived === true) items = items.filter((r) => r.archivedAt)
      else if (filters.archived === false) items = items.filter((r) => !r.archivedAt)
      if (filters.assignedAdminId) items = items.filter((r) => r.assignedAdminId === filters.assignedAdminId)
      if (filters.from) items = items.filter((r) => r.createdAt >= filters.from)
      if (filters.to) items = items.filter((r) => r.createdAt <= filters.to)
      if (filters.search) {
        const q = String(filters.search).toLowerCase()
        items = items.filter((r) =>
          [r.fullName, r.email, r.reference, r.subject, r.phone]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q)),
        )
      }
      items.sort((a, b) => b.createdAt - a.createdAt)
      const total = items.length
      const offset = filters.offset || 0
      const limit = filters.limit || 20
      return { items: items.slice(offset, offset + limit), total }
    },
    async updateSubmission(kind, id, patch) {
      this.__assertOk()
      const record = submissionsOf(kind).find((r) => r.id === id)
      if (!record) return null
      Object.assign(record, patch, { updatedAt: now() })
      return record
    },
    async findRecentSubmission(kind, { email, windowMs }) {
      this.__assertOk()
      const threshold = new Date(Date.now() - windowMs)
      return (
        submissionsOf(kind)
          .filter((r) => r.email === email && r.createdAt >= threshold)
          .sort((a, b) => b.createdAt - a.createdAt)[0] || null
      )
    },

    // ---- attachments -----------------------------------------------------
    async createAttachment(data) {
      this.__assertOk()
      const att = { id: randomUUID(), createdAt: now(), ...data }
      store.attachments.push(att)
      return att
    },
    async listAttachments(kind, submissionId) {
      this.__assertOk()
      return store.attachments.filter((a) => a.submissionKind === kind && a.submissionId === submissionId)
    },
    async getAttachment(id) {
      this.__assertOk()
      return store.attachments.find((a) => a.id === id) || null
    },

    // ---- activity --------------------------------------------------------
    async addActivity(entry) {
      this.__assertOk()
      const record = { id: randomUUID(), createdAt: now(), ...entry }
      store.activity.push(record)
      return record
    },
    async listActivity(kind, submissionId) {
      this.__assertOk()
      return store.activity
        .filter((a) => a.submissionKind === kind && a.submissionId === submissionId)
        .sort((a, b) => a.createdAt - b.createdAt)
    },

    async ping() {
      return true
    },
  }
}

export default createMemoryRepository
