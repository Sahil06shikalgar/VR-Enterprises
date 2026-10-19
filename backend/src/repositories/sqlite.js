/*
 * SQLite repository (node:sqlite).
 *
 * Implements exactly the same method surface as the PostgreSQL repository, so
 * the app can run on an embedded SQL database with zero external services.
 *
 * All values are passed as bound parameters (never string-concatenated), which
 * keeps queries safe from SQL injection. Values are mapped between the app's
 * JavaScript shapes and SQLite storage:
 *   - Date      <-> INTEGER (epoch ms)
 *   - boolean   <-> INTEGER (0/1)
 *   - JSON obj  <-> TEXT
 */
import { randomUUID } from 'node:crypto'

const now = () => new Date()

const TO_SNAKE = (key) => key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
const TO_CAMEL = (key) => key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())

const TIMESTAMP_COLUMNS = new Set([
  'last_login_at',
  'created_at',
  'updated_at',
  'last_seen_at',
  'expires_at',
  'revoked_at',
  'notified_at',
  'archived_at',
])
const BOOLEAN_COLUMNS = new Set(['is_active', 'consent'])

function toDb(value) {
  if (value === undefined) return null
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'boolean') return value ? 1 : 0
  if (value && typeof value === 'object') return JSON.stringify(value)
  return value
}

function toDate(value) {
  return value === null || value === undefined ? null : new Date(Number(value))
}

function fromRow(row) {
  if (!row) return null
  const out = {}
  for (const [column, value] of Object.entries(row)) {
    const key = TO_CAMEL(column)
    if (column === 'detail') out[key] = value === null || value === undefined ? null : JSON.parse(value)
    else if (BOOLEAN_COLUMNS.has(column)) out[key] = Boolean(value)
    else if (TIMESTAMP_COLUMNS.has(column)) out[key] = toDate(value)
    else out[key] = value
  }
  return out
}

const USER_COLUMNS = [
  'id',
  'email',
  'passwordHash',
  'name',
  'role',
  'isActive',
  'lastLoginAt',
  'createdAt',
  'updatedAt',
]

const SESSION_COLUMNS = [
  'id',
  'tokenHash',
  'csrfToken',
  'userId',
  'ipAddress',
  'userAgent',
  'createdAt',
  'lastSeenAt',
  'expiresAt',
  'revokedAt',
]

const COMMON_SUBMISSION_COLUMNS = [
  'id',
  'reference',
  'status',
  'internalNotes',
  'assignedAdminId',
  'sourcePage',
  'ipAddress',
  'userAgent',
  'correlationId',
  'emailStatus',
  'notifiedAt',
  'archivedAt',
  'createdAt',
  'updatedAt',
]

const SUBMISSION_COLUMNS = {
  contact: [...COMMON_SUBMISSION_COLUMNS, 'fullName', 'company', 'email', 'phone', 'subject', 'message', 'consent'],
  quote: [
    ...COMMON_SUBMISSION_COLUMNS,
    'fullName',
    'company',
    'email',
    'phone',
    'service',
    'projectDescription',
    'budgetRange',
    'preferredDeadline',
    'consent',
  ],
  career: [
    ...COMMON_SUBMISSION_COLUMNS,
    'fullName',
    'email',
    'phone',
    'position',
    'experience',
    'portfolioUrl',
    'coverMessage',
    'consent',
  ],
}

const ATTACHMENT_COLUMNS = [
  'id',
  'submissionKind',
  'submissionId',
  'originalName',
  'storedName',
  'mimeType',
  'extension',
  'sizeBytes',
  'uploadedByKind',
  'createdAt',
]

const ACTIVITY_COLUMNS = [
  'id',
  'submissionKind',
  'submissionId',
  'actorKind',
  'actorAdminId',
  'action',
  'detail',
  'correlationId',
  'createdAt',
]

const SUBMISSION_TABLE = {
  contact: 'contact_inquiries',
  quote: 'quote_requests',
  career: 'career_applications',
}

export function createSqliteRepository(db) {
  const insert = (table, columns, data) => {
    const cols = columns.map(TO_SNAKE).join(', ')
    const placeholders = columns.map(() => '?').join(', ')
    const values = columns.map((column) => toDb(data[column]))
    db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`).run(...values)
  }

  return {
    // ---- users -----------------------------------------------------------
    async createUser(data) {
      const user = {
        ...data,
        id: data.id || randomUUID(),
        role: data.role || 'admin',
        isActive: data.isActive ?? true,
        lastLoginAt: data.lastLoginAt ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      insert('users', USER_COLUMNS, user)
      return fromRow(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id))
    },
    async findUserByEmail(email) {
      return fromRow(db.prepare('SELECT * FROM users WHERE email = ?').get(email))
    },
    async findUserById(id) {
      return fromRow(db.prepare('SELECT * FROM users WHERE id = ?').get(id))
    },
    async listUsers() {
      return db.prepare('SELECT * FROM users ORDER BY created_at').all().map(fromRow)
    },
    async updateUserLastLogin(id, ts = now()) {
      db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(
        toDb(ts),
        toDb(now()),
        id,
      )
      return fromRow(db.prepare('SELECT * FROM users WHERE id = ?').get(id))
    },
    async updateUserPassword(id, passwordHash, role) {
      if (role) db.prepare('UPDATE users SET password_hash = ?, role = ?, updated_at = ? WHERE id = ?').run(passwordHash, role, toDb(now()), id)
      else db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(passwordHash, toDb(now()), id)
      return fromRow(db.prepare('SELECT * FROM users WHERE id = ?').get(id))
    },

    // ---- sessions --------------------------------------------------------
    async createSession(data) {
      const session = {
        ...data,
        id: data.id || randomUUID(),
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        createdAt: new Date(),
        lastSeenAt: new Date(),
        expiresAt: data.expiresAt,
        revokedAt: null,
      }
      insert('sessions', SESSION_COLUMNS, session)
      return fromRow(db.prepare('SELECT * FROM sessions WHERE id = ?').get(session.id))
    },
    async findSessionByTokenHash(tokenHash) {
      return fromRow(db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(tokenHash))
    },
    async touchSession(id) {
      db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(toDb(now()), id)
      return fromRow(db.prepare('SELECT * FROM sessions WHERE id = ?').get(id))
    },
    async revokeSession(id) {
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?').run(toDb(now()), id)
      return fromRow(db.prepare('SELECT * FROM sessions WHERE id = ?').get(id))
    },
    async revokeUserSessions(userId) {
      db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(
        toDb(now()),
        userId,
      )
    },

    // ---- submissions -----------------------------------------------------
    async createSubmission(kind, data) {
      const table = SUBMISSION_TABLE[kind]
      if (!table) throw new Error(`Unknown submission kind: ${kind}`)
      const record = {
        ...data,
        id: data.id || randomUUID(),
        status: data.status || 'new',
        internalNotes: data.internalNotes ?? null,
        assignedAdminId: data.assignedAdminId ?? null,
        emailStatus: data.emailStatus || 'pending',
        notifiedAt: data.notifiedAt ?? null,
        archivedAt: data.archivedAt ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      insert(table, SUBMISSION_COLUMNS[kind], record)
      return fromRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(record.id))
    },
    async getSubmission(kind, id) {
      return fromRow(db.prepare(`SELECT * FROM ${SUBMISSION_TABLE[kind]} WHERE id = ?`).get(id))
    },
    async listSubmissions(kind, filters = {}) {
      const table = SUBMISSION_TABLE[kind]
      const where = []
      const params = []
      if (filters.status) {
        where.push('status = ?')
        params.push(filters.status)
      }
      if (filters.service) {
        where.push('service = ?')
        params.push(filters.service)
      }
      if (filters.archived === true) where.push('archived_at IS NOT NULL')
      else if (filters.archived === false) where.push('archived_at IS NULL')
      if (filters.assignedAdminId) {
        where.push('assigned_admin_id = ?')
        params.push(filters.assignedAdminId)
      }
      if (filters.from) {
        where.push('created_at >= ?')
        params.push(toDb(filters.from))
      }
      if (filters.to) {
        where.push('created_at <= ?')
        params.push(toDb(filters.to))
      }
      if (filters.search) {
        const q = `%${filters.search}%`
        where.push('(lower(full_name) LIKE lower(?) OR lower(email) LIKE lower(?) OR lower(reference) LIKE (?))')
        params.push(q, q, q)
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
      const limit = Math.min(Math.max(filters.limit || 20, 1), 100)
      const offset = Math.max(filters.offset || 0, 0)

      const items = db
        .prepare(`SELECT * FROM ${table} ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .all(...params, limit, offset)
        .map(fromRow)
      const { total } = db.prepare(`SELECT count(*) AS total FROM ${table} ${whereSql}`).get(...params)
      return { items, total }
    },
    async updateSubmission(kind, id, patch) {
      const table = SUBMISSION_TABLE[kind]
      const sets = []
      const params = []
      for (const [key, value] of Object.entries(patch)) {
        sets.push(`${TO_SNAKE(key)} = ?`)
        params.push(toDb(value))
      }
      sets.push('updated_at = ?')
      params.push(toDb(now()))
      db.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).run(...params, id)
      return fromRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id))
    },
    async findRecentSubmission(kind, { email, windowMs }) {
      const table = SUBMISSION_TABLE[kind]
      const threshold = toDb(new Date(Date.now() - windowMs))
      return fromRow(
        db
          .prepare(`SELECT * FROM ${table} WHERE email = ? AND created_at >= ? ORDER BY created_at DESC LIMIT 1`)
          .get(email, threshold),
      )
    },

    // ---- attachments -----------------------------------------------------
    async createAttachment(data) {
      const attachment = {
        ...data,
        id: data.id || randomUUID(),
        uploadedByKind: data.uploadedByKind || 'customer',
        createdAt: new Date(),
      }
      insert('attachments', ATTACHMENT_COLUMNS, attachment)
      return fromRow(db.prepare('SELECT * FROM attachments WHERE id = ?').get(attachment.id))
    },
    async listAttachments(kind, submissionId) {
      return db
        .prepare('SELECT * FROM attachments WHERE submission_kind = ? AND submission_id = ? ORDER BY created_at')
        .all(kind, submissionId)
        .map(fromRow)
    },
    async getAttachment(id) {
      return fromRow(db.prepare('SELECT * FROM attachments WHERE id = ?').get(id))
    },

    // ---- activity --------------------------------------------------------
    async addActivity(entry) {
      const record = { ...entry, id: entry.id || randomUUID(), createdAt: new Date() }
      insert('activity_logs', ACTIVITY_COLUMNS, record)
      return fromRow(db.prepare('SELECT * FROM activity_logs WHERE id = ?').get(record.id))
    },
    async listActivity(kind, submissionId) {
      return db
        .prepare('SELECT * FROM activity_logs WHERE submission_kind = ? AND submission_id = ? ORDER BY created_at')
        .all(kind, submissionId)
        .map(fromRow)
    },

    async ping() {
      db.prepare('SELECT 1 AS ok').get()
      return true
    },
  }
}

export default createSqliteRepository
