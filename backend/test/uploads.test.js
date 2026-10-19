import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { buildTestApp, validCareer, validQuote } from './helpers.js'

const PDF = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n')
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d])

function multipart(req, fields) {
  let out = req
  for (const [key, value] of Object.entries(fields)) out = out.field(key, String(value))
  return out
}

test('accepts a valid PDF resume and stores it privately', async () => {
  const { app, repo } = buildTestApp()
  const req = multipart(request(app).post('/api/careers/apply'), validCareer()).attach('resume', PDF, {
    filename: 'cv.pdf',
    contentType: 'application/pdf',
  })
  const res = await req
  assert.equal(res.status, 201)
  assert.equal(repo.__store.attachments.length, 1)
  assert.equal(repo.__store.attachments[0].originalName, 'cv.pdf')
  assert.equal(repo.__store.attachments[0].extension, '.pdf')
})

test('accepts a valid PNG attachment on a quote', async () => {
  const { app, repo } = buildTestApp()
  const req = multipart(request(app).post('/api/quote'), validQuote()).attach('attachment', PNG, {
    filename: 'logo.png',
    contentType: 'image/png',
  })
  const res = await req
  assert.equal(res.status, 201)
  assert.equal(repo.__store.attachments.length, 1)
  assert.equal(repo.__store.attachments[0].extension, '.png')
})

test('rejects an executable disguised as a resume without storing a record', async () => {
  const { app, repo } = buildTestApp()
  const req = multipart(request(app).post('/api/careers/apply'), validCareer()).attach('resume', PDF, {
    filename: 'payload.exe',
    contentType: 'application/octet-stream',
  })
  const res = await req
  assert.equal(res.status, 422)
  assert.ok(res.body.error.fields.resume)
  assert.equal(repo.__store.career.length, 0)
})

test('rejects a file whose contents do not match its extension', async () => {
  const { app, repo } = buildTestApp()
  const req = multipart(request(app).post('/api/careers/apply'), validCareer()).attach('resume', PNG, {
    filename: 'fake.pdf',
    contentType: 'application/pdf',
  })
  const res = await req
  assert.equal(res.status, 422)
  assert.equal(repo.__store.career.length, 0)
})

test('rejects an oversized upload', async () => {
  const { app, repo } = buildTestApp({ env: { MAX_UPLOAD_MB: '0.0002' } })
  const big = Buffer.concat([PDF, Buffer.alloc(2000, 0x41)])
  const req = multipart(request(app).post('/api/careers/apply'), validCareer()).attach('resume', big, {
    filename: 'cv.pdf',
    contentType: 'application/pdf',
  })
  const res = await req
  assert.equal(res.status, 422)
  assert.ok(res.body.error.fields.resume)
  assert.equal(repo.__store.career.length, 0)
})
