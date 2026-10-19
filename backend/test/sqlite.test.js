/*
 * SQLite repository + integration tests.
 *
 * These run against a real (embedded) SQL engine — no external database — and
 * prove the backend works on SQLite end-to-end through the Express app.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { createSqliteDatabase } from '../src/db/sqlite.js'
import { createSqliteRepository } from '../src/repositories/sqlite.js'
import { buildTestApp, seedAdmin, validQuote, validCareer, sessionCookieFrom } from './helpers.js'

function openRepo() {
  const database = createSqliteDatabase({ database: { url: ':memory:' } })
  return { repo: createSqliteRepository(database.db), close: () => database.close() }
}

test('sqlite: applies the schema and answers ping', async () => {
  const { repo, close } = openRepo()
  assert.equal(await repo.ping(), true)
  close()
})

test('sqlite: user lifecycle with typed values', async () => {
  const { repo, close } = openRepo()
  const user = await repo.createUser({ email: 'a@b.com', passwordHash: 'hash', name: 'A', role: 'owner' })
  assert.ok(user.id)
  assert.equal(user.isActive, true)
  assert.ok(user.createdAt instanceof Date)

  const found = await repo.findUserByEmail('a@b.com')
  assert.equal(found.id, user.id)

  const updated = await repo.updateUserLastLogin(user.id)
  assert.ok(updated.lastLoginAt instanceof Date)

  const withPassword = await repo.updateUserPassword(user.id, 'new-hash', 'admin')
  assert.equal(withPassword.passwordHash, 'new-hash')
  assert.equal(withPassword.role, 'admin')
  assert.equal((await repo.listUsers()).length, 1)
  close()
})

test('sqlite: submission create, filter, update and duplicate window', async () => {
  const { repo, close } = openRepo()
  const record = await repo.createSubmission('quote', { ...validQuote(), reference: 'VR-Q-1', status: 'new' })
  assert.equal(record.consent, true)
  assert.ok(record.createdAt instanceof Date)
  assert.equal(record.emailStatus, 'pending')
  assert.equal(record.archivedAt, null)

  const recent = await repo.findRecentSubmission('quote', { email: 'rahul@example.com', windowMs: 120000 })
  assert.equal(recent.id, record.id)

  assert.equal((await repo.listSubmissions('quote', {})).total, 1)
  assert.equal((await repo.listSubmissions('quote', { service: 'branding' })).total, 1)
  assert.equal((await repo.listSubmissions('quote', { service: 'printing' })).total, 0)
  assert.equal((await repo.listSubmissions('quote', { search: 'rahul' })).total, 1)

  await repo.updateSubmission('quote', record.id, {
    status: 'responded',
    internalNotes: 'ok',
    archivedAt: new Date(),
  })
  assert.equal((await repo.listSubmissions('quote', { status: 'responded' })).total, 1)
  assert.equal((await repo.listSubmissions('quote', { archived: true })).total, 1)
  assert.equal((await repo.listSubmissions('quote', { archived: false })).total, 0)

  const detail = await repo.getSubmission('quote', record.id)
  assert.equal(detail.internalNotes, 'ok')
  assert.ok(detail.archivedAt instanceof Date)
  close()
})

test('sqlite: attachments and activity round-trip', async () => {
  const { repo, close } = openRepo()
  const record = await repo.createSubmission('career', { ...validCareer(), reference: 'VR-A-1' })

  const attachment = await repo.createAttachment({
    submissionKind: 'career',
    submissionId: record.id,
    originalName: 'cv.pdf',
    storedName: 'stored.pdf',
    mimeType: 'application/pdf',
    extension: '.pdf',
    sizeBytes: 1234,
  })
  assert.equal(attachment.uploadedByKind, 'customer')
  assert.equal((await repo.listAttachments('career', record.id)).length, 1)
  assert.equal((await repo.getAttachment(attachment.id)).id, attachment.id)

  await repo.addActivity({
    submissionKind: 'career',
    submissionId: record.id,
    actorKind: 'system',
    action: 'created',
    detail: { reference: 'VR-A-1' },
  })
  const activity = await repo.listActivity('career', record.id)
  assert.equal(activity.length, 1)
  assert.deepEqual(activity[0].detail, { reference: 'VR-A-1' })
  assert.ok(activity[0].createdAt instanceof Date)
  close()
})

test('sqlite: sessions are created, touched and revoked', async () => {
  const { repo, close } = openRepo()
  const user = await repo.createUser({ email: 'x@y.com', passwordHash: 'h', name: 'X' })
  const session = await repo.createSession({
    tokenHash: 'token-hash',
    csrfToken: 'csrf',
    userId: user.id,
    expiresAt: new Date(Date.now() + 60_000),
  })
  assert.equal((await repo.findSessionByTokenHash('token-hash')).id, session.id)
  await repo.touchSession(session.id)
  await repo.revokeSession(session.id)
  assert.ok((await repo.findSessionByTokenHash('token-hash')).revokedAt instanceof Date)
  close()
})

test('sqlite: public submission stores and admin lists it (end-to-end)', async () => {
  const database = createSqliteDatabase({ database: { url: ':memory:' } })
  const repository = createSqliteRepository(database.db)
  const { app } = buildTestApp({ repo: repository })
  await seedAdmin(repository)

  const created = await request(app).post('/api/quote').send(validQuote())
  assert.equal(created.status, 201)
  assert.match(created.body.data.reference, /^VR-Q-/)

  const login = await request(app)
    .post('/api/admin/login')
    .send({ email: 'admin@example.com', password: 'super-secret-password' })
  assert.equal(login.status, 200)
  const cookie = sessionCookieFrom(login)

  const list = await request(app).get('/api/admin/quotes').set('Cookie', cookie)
  assert.equal(list.status, 200)
  assert.equal(list.body.meta.total, 1)
  assert.equal(list.body.data[0].email, 'rahul@example.com')

  const detail = await request(app).get(`/api/admin/quotes/${created.body.data.id}`).set('Cookie', cookie)
  assert.equal(detail.status, 200)
  assert.equal(detail.body.data.record.reference, created.body.data.reference)
  assert.ok(Array.isArray(detail.body.data.activity))

  database.close()
})
