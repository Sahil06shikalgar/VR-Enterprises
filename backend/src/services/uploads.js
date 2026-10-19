/*
 * File upload handling.
 *
 * Files are held in memory by Multer, validated (extension + MIME + size + a
 * magic-byte sniff), then written to a private directory OUTSIDE any public web
 * root with a random UUID filename. Server paths are never returned to clients;
 * downloads are streamed by an authenticated admin route using the DB record.
 */
import path from 'node:path'
import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { ValidationError, badRequest } from '../errors.js'

export const ALLOWED_BY_PURPOSE = {
  resume: {
    extensions: ['.pdf', '.docx'],
    mimes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
  },
  attachment: {
    extensions: ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.xlsx'],
    mime: true,
    mimes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
}

// Explicitly rejected regardless of allowlist (defence in depth).
const DENYLIST = new Set([
  '.exe', '.dll', '.bat', '.cmd', '.com', '.msi', '.scr', '.ps1', '.sh', '.js', '.mjs', '.cjs',
  '.vbs', '.vbe', '.jar', '.app', '.deb', '.rpm',
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.tgz',
  '.docm', '.xlsm', '.pptm', '.xltm', '.dotm',
  '.php', '.asp', '.aspx', '.jsp', '.cgi', '.svg', '.html', '.htm',
])

const MAGIC = [
  { name: 'pdf', test: (b) => b.length > 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { name: 'png', test: (b) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { name: 'jpeg', test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { name: 'zip', test: (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07) },
]

const EXT_TO_MAGIC = {
  '.pdf': 'pdf',
  '.png': 'png',
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.docx': 'zip',
  '.xlsx': 'zip',
}

function sniff(buffer) {
  for (const entry of MAGIC) if (entry.test(buffer)) return entry.name
  return null
}

export function sanitizeFileName(name) {
  const base = path.basename(String(name || 'file'))
  const withoutControl = Array.from(base)
    .filter((ch) => ch.charCodeAt(0) > 31 && ch.charCodeAt(0) !== 127)
    .join('')
  return withoutControl.replace(/[^A-Za-z0-9._ ()-]/g, '_').slice(0, 180) || 'file'
}

export function validateUpload(file, purpose) {
  const rules = ALLOWED_BY_PURPOSE[purpose] || ALLOWED_BY_PURPOSE.attachment
  const original = sanitizeFileName(file.originalname)
  const ext = path.extname(original).toLowerCase()

  const errors = []
  if (DENYLIST.has(ext)) errors.push('This file type is not allowed.')
  if (!rules.extensions.includes(ext)) errors.push(`Allowed file types: ${rules.extensions.join(', ')}`)
  if (rules.mimes && !rules.mimes.includes(file.mimetype)) errors.push('The file type does not match its contents.')

  const magic = sniff(file.buffer)
  const expectedMagic = EXT_TO_MAGIC[ext]
  if (!magic) errors.push('The file could not be verified and was rejected.')
  else if (expectedMagic && magic !== expectedMagic) errors.push('The file type does not match its contents.')

  if (errors.length) {
    const err = new ValidationError({ file: errors[0], [purpose === 'resume' ? 'resume' : 'attachment']: errors[0] }, errors[0])
    throw err
  }

  return { original, ext, magic }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

export function resolveUploadPath(config, storedName) {
  const base = path.resolve(config.uploads.dir)
  const resolved = path.resolve(base, path.basename(String(storedName)))
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw badRequest('Invalid file reference.', 'invalid_file')
  }
  return resolved
}

/*
 * Validates an uploaded file (extension + MIME + magic bytes) WITHOUT writing it
 * to disk, so a request can be rejected before any database row is created. On
 * success the normalised descriptor is attached to req.validatedUpload.
 */
export function validateUploadMiddleware(field) {
  return (req, _res, next) => {
    if (!req.file) return next()
    const purpose = field === 'resume' ? 'resume' : 'attachment'
    try {
      const validated = validateUpload(req.file, purpose)
      req.validatedUpload = { file: req.file, validated, purpose }
      next()
    } catch (err) {
      next(err)
    }
  }
}

/*
 * Writes an already-validated upload to the private directory and returns the
 * metadata needed for the attachment record. Server paths are never returned.
 */
export async function persistValidatedUpload(config, logger, { file, validated, purpose }) {
  const storedName = `${randomUUID()}${validated.ext}`
  const dir = path.resolve(config.uploads.dir)
  await ensureDir(dir)
  await fs.writeFile(resolveUploadPath(config, storedName), file.buffer, { mode: 0o600 })
  logger.info('Stored upload', { purpose, sizeBytes: file.size, ext: validated.ext })
  return {
    originalName: validated.original,
    storedName,
    mimeType: file.mimetype,
    extension: validated.ext,
    sizeBytes: file.size,
  }
}

/*
 * Multer middleware factory. Files stay in memory until validated.
 * `field` is the expected form field name.
 */
export function uploadMiddleware(config, field) {
  const uploader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.uploads.maxBytes, files: 1 },
  }).single(field)

  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (!err) return next()
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new ValidationError(
            { [field]: `File is too large. Maximum size is ${Math.round(config.uploads.maxBytes / (1024 * 1024))} MB.` },
            'File is too large.',
          ),
        )
      }
      return next(new ValidationError({ [field]: 'The upload could not be processed.' }, 'Upload rejected.'))
    })
  }
}
