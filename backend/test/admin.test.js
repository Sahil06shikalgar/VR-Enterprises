import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { buildTestApp, seedAdmin, validContact, sessionCookieFrom } from './helpers.js'

const PASSWORD = 'super-secret-password'

async function setupAdmin(role = 'owner', email = 'admin@example.com') {
  const ctx = buildTestApp()
  await seedAdmin(ctx.repo, { email, password: PASSWORD, role })
  const res = await request(ctx.app).post('/api/admin/login').send({ email, password: PASSWORD })
  assert.equal(res.status, 200)
  return { ...ctx, cookie: sessionCookieFrom(res), csrfToken: res.body.data.csrfToken }
}

test('admin login rejects invalid credentials', async () => {
  const { app, repo } = buildTestApp()
  await seedAdmin(repo, { password: PASSWORD })
  const res = await request(app).post('/api/admin/login').send({ email: 'admin@example.com', password: 'wrong' })
  assert.equal(res.status, 401)
  assert.equal(res.body.error.code, 'invalid_credentials')
})

test('admin endpoints require authentication', async () => {
  const { app } = buildTestApp()
  const res = await request(app).get('/api/admin/inquiries')
  assert.equal(res.status, 401)
})

test('login issues a session cookie and csrf token', async () => {
  const { cookie, csrfToken, app } = await setupAdmin()
  assert.ok(cookie)
  assert.ok(csrfToken)
  const me = await request(app).get('/api/admin/me').set('Cookie', cookie)
  assert.equal(me.status, 200)
  assert.equal(me.body.data.user.email, 'admin@example.com')
  assert.ok(!('passwordHash' in me.body.data.user))
})

test('state-changing admin requests require a valid CSRF token', async () => {
  const { app, cookie } = await setupAdmin()
  const created = await request(app).post('/api/contact').send(validContact())
  const id = created.body.data.id
  const res = await request(app)
    .patch(`/api/admin/inquiries/${id}`)
    .set('Cookie', cookie)
    .send({ status: 'in_progress' })
  assert.equal(res.status, 403)
  assert.equal(res.body.error.code, 'csrf_failed')
})

test('owner can list admin users, admin cannot', async () => {
  const owner = await setupAdmin('owner', 'owner@example.com')
  const ok = await request(owner.app).get('/api/admin/users').set('Cookie', owner.cookie)
  assert.equal(ok.status, 200)
  assert.equal(ok.body.data.length, 1)
  assert.ok(!('passwordHash' in ok.body.data[0]))

  const admin = await setupAdmin('admin', 'staff@example.com')
  const denied = await request(admin.app).get('/api/admin/users').set('Cookie', admin.cookie)
  assert.equal(denied.status, 403)
  assert.equal(denied.body.error.code, 'role_forbidden')
})

test('admin lists, reads and updates a submission with activity logging', async () => {
  const { app, cookie, csrfToken, repo } = await setupAdmin()
  await request(app).post('/api/contact').send(validContact())

  const list = await request(app).get('/api/admin/inquiries').set('Cookie', cookie)
  assert.equal(list.status, 200)
  assert.equal(list.body.meta.total, 1)
  const id = list.body.data[0].id

  const patch = await request(app)
    .patch(`/api/admin/inquiries/${id}`)
    .set('Cookie', cookie)
    .set('X-CSRF-Token', csrfToken)
    .send({ status: 'responded', internalNotes: 'Called the client back.' })
  assert.equal(patch.status, 200)
  assert.equal(patch.body.data.status, 'responded')
  assert.equal(patch.body.data.internalNotes, 'Called the client back.')

  const detail = await request(app).get(`/api/admin/inquiries/${id}`).set('Cookie', cookie)
  assert.equal(detail.status, 200)
  assert.ok(Array.isArray(detail.body.data.activity))
  const actions = detail.body.data.activity.map((a) => a.action)
  assert.ok(actions.includes('created'))
  assert.ok(actions.includes('status_changed'))
  assert.ok(actions.includes('note_added'))

  // Archiving is stored as a timestamp.
  const archived = await request(app)
    .patch(`/api/admin/inquiries/${id}`)
    .set('Cookie', cookie)
    .set('X-CSRF-Token', csrfToken)
    .send({ archived: true })
  assert.equal(archived.status, 200)
  assert.ok(repo.__store.contact[0].archivedAt)
})

test('logout revokes the session', async () => {
  const { app, cookie, csrfToken } = await setupAdmin()
  const out = await request(app)
    .post('/api/admin/logout')
    .set('Cookie', cookie)
    .set('X-CSRF-Token', csrfToken)
  assert.equal(out.status, 200)

  const me = await request(app).get('/api/admin/me').set('Cookie', cookie)
  assert.equal(me.status, 401)
})
