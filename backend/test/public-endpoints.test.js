import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { buildTestApp, fakeEmail, validContact, validQuote, validCareer } from './helpers.js'

test('GET /api/health reports ok', async () => {
  const { app } = buildTestApp()
  const res = await request(app).get('/api/health')
  assert.equal(res.status, 200)
  assert.equal(res.body.status, 'ok')
  assert.equal(res.body.db, 'ok')
})

test('POST /api/contact stores an enquiry and notifies the team', async () => {
  const { app, repo, emailService } = buildTestApp()
  const res = await request(app).post('/api/contact').send(validContact())
  assert.equal(res.status, 201)
  assert.match(res.body.data.reference, /^VR-C-\d{4}-[0-9A-F]{5}$/)
  assert.equal(res.body.data.kind, 'contact')
  assert.equal(repo.__store.contact.length, 1)
  assert.equal(repo.__store.contact[0].status, 'new')
  assert.equal(emailService.calls.admin.length, 1)
  assert.equal(emailService.calls.ack.length, 1)
})

test('POST /api/quote stores a quote request', async () => {
  const { app, repo } = buildTestApp()
  const res = await request(app).post('/api/quote').send(validQuote())
  assert.equal(res.status, 201)
  assert.equal(res.body.data.kind, 'quote')
  assert.equal(repo.__store.quote[0].service, 'branding')
})

test('POST /api/careers/apply stores an application', async () => {
  const { app, repo } = buildTestApp()
  const res = await request(app).post('/api/careers/apply').send(validCareer())
  assert.equal(res.status, 201)
  assert.equal(repo.__store.career[0].position, 'General Application')
})

test('POST /api/contact rejects invalid input with field errors', async () => {
  const { app } = buildTestApp()
  const res = await request(app)
    .post('/api/contact')
    .send(validContact({ email: 'not-an-email', consent: false }))
  assert.equal(res.status, 422)
  assert.equal(res.body.error.code, 'validation_error')
  assert.ok(res.body.error.fields.email)
  assert.ok(res.body.error.fields.consent)
})

test('POST /api/quote rejects an unknown service', async () => {
  const { app } = buildTestApp()
  const res = await request(app).post('/api/quote').send(validQuote({ service: 'time-travel' }))
  assert.equal(res.status, 422)
  assert.ok(res.body.error.fields.service)
})

test('POST /api/contact blocks a filled honeypot', async () => {
  const { app, repo } = buildTestApp()
  const res = await request(app).post('/api/contact').send(validContact({ website: 'http://spam.example' }))
  assert.equal(res.status, 400)
  assert.equal(res.body.error.code, 'spam_blocked')
  assert.equal(repo.__store.contact.length, 0)
})

test('POST /api/contact blocks a submission completed too quickly', async () => {
  const { app } = buildTestApp()
  const res = await request(app)
    .post('/api/contact')
    .send(validContact({ formStartedAt: Date.now() }))
  assert.equal(res.status, 400)
  assert.equal(res.body.error.code, 'spam_blocked')
})

test('POST /api/contact blocks a duplicate submission in the window', async () => {
  const { app } = buildTestApp()
  assert.equal((await request(app).post('/api/contact').send(validContact())).status, 201)
  const dup = await request(app).post('/api/contact').send(validContact())
  assert.equal(dup.status, 409)
  assert.equal(dup.body.error.code, 'duplicate_submission')
})

test('POST /api/contact returns 500 without leaking details on a database failure', async () => {
  const { app, repo } = buildTestApp()
  repo.__failNext({ code: 'DB_UNAVAILABLE' })
  const res = await request(app).post('/api/contact').send(validContact())
  assert.equal(res.status, 500)
  assert.equal(res.body.error.code, 'internal_error')
  assert.ok(!/DB_UNAVAILABLE|select|insert/i.test(JSON.stringify(res.body)))
})

test('POST /api/contact does not report success when notification delivery fails', async () => {
  const { app, repo } = buildTestApp({ email: fakeEmail({ failAdmin: true }) })
  const res = await request(app).post('/api/contact').send(validContact())
  assert.equal(res.status, 502)
  assert.equal(res.body.error.code, 'email_failed')
  // The record was still persisted, but the caller was not told "success".
  assert.equal(repo.__store.contact.length, 1)
  assert.equal(repo.__store.contact[0].emailStatus, 'failed')
})

test('public form endpoints are rate limited', async () => {
  const { app } = buildTestApp({ env: { RATE_LIMIT_MAX: '2' } })
  assert.equal((await request(app).post('/api/contact').send(validContact({ email: 'a@example.com' }))).status, 201)
  assert.equal((await request(app).post('/api/contact').send(validContact({ email: 'b@example.com' }))).status, 201)
  const third = await request(app).post('/api/contact').send(validContact({ email: 'c@example.com' }))
  assert.equal(third.status, 429)
  assert.equal(third.body.error.code, 'rate_limited')
})

test('unknown API routes return a structured 404', async () => {
  const { app } = buildTestApp()
  const res = await request(app).get('/api/does-not-exist')
  assert.equal(res.status, 404)
  assert.equal(res.body.error.code, 'not_found')
})
