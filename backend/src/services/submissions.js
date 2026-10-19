/*
 * Submissions service — shared logic for contact inquiries, quote requests and
 * career applications.
 *
 * Order of operations for a new submission:
 *   1. duplicate-window check (same kind + email within a short window)
 *   2. persist the record (unique reference)
 *   3. persist attachment (if any)
 *   4. activity log
 *   5. send admin notification (required) + customer acknowledgement
 *   6. record email status
 *
 * If the required admin notification cannot be delivered we DO NOT report
 * success — we return a 502 so the UI shows a real error instead of a fake
 * success, while the record remains stored.
 */
import { randomBytes } from 'node:crypto'
import { AppError, conflict } from '../errors.js'
import { persistValidatedUpload } from './uploads.js'

const PREFIX = { contact: 'C', quote: 'Q', career: 'A' }
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000

function makeReference(kind) {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const rand = randomBytes(4).toString('hex').toUpperCase().slice(0, 5)
  return `VR-${PREFIX[kind]}-${y}${m}-${rand}`
}

function isUniqueViolation(err) {
  return err && (err.code === '23505' || /duplicate key|unique constraint/i.test(err.message || ''))
}

export function createSubmissionService({ repo, emailService, config, logger }) {
  async function create(kind, data, meta, upload) {
    const recent = await repo.findRecentSubmission(kind, { email: data.email, windowMs: DUPLICATE_WINDOW_MS })
    if (recent) {
      throw conflict(
        'We already received this submission a moment ago. Please wait before sending it again.',
        'duplicate_submission',
      )
    }

    let record = null
    for (let attempt = 0; attempt < 3 && !record; attempt += 1) {
      const reference = makeReference(kind)
      try {
        record = await repo.createSubmission(kind, {
          ...data,
          reference,
          status: 'new',
          sourcePage: meta.sourcePage || null,
          ipAddress: meta.ipAddress ?? null,
          userAgent: meta.userAgent ?? null,
          correlationId: meta.correlationId ?? null,
        })
      } catch (err) {
        if (isUniqueViolation(err) && attempt < 2) continue
        throw err
      }
    }

    if (upload) {
      const descriptor = await persistValidatedUpload(config, logger, upload)
      await repo.createAttachment({
        submissionKind: kind,
        submissionId: record.id,
        ...descriptor,
        uploadedByKind: 'customer',
      })
    }

    await repo.addActivity({
      submissionKind: kind,
      submissionId: record.id,
      actorKind: 'customer',
      action: 'created',
      detail: { reference: record.reference },
      correlationId: meta.correlationId ?? null,
    })

    const admin = await emailService.sendAdminNotification(kind, record)
    const acknowledgement = await emailService.sendAcknowledgement(kind, record)

    await repo.updateSubmission(kind, record.id, {
      emailStatus: admin.ok ? 'sent' : 'failed',
      notifiedAt: admin.ok ? new Date() : null,
    })

    await repo.addActivity({
      submissionKind: kind,
      submissionId: record.id,
      actorKind: 'system',
      action: admin.ok ? 'email_sent' : 'email_failed',
      detail: { adminNotified: admin.ok, acknowledgementSent: acknowledgement.ok },
      correlationId: meta.correlationId ?? null,
    })

    if (!admin.ok) {
      logger.error('Required admin notification failed', {
        reference: record.reference,
        correlationId: meta.correlationId,
        error: admin.error,
      })
      throw new AppError(
        'Your request was saved, but we could not notify our team automatically. Please email sales@thevrenterprises.com directly.',
        { status: 502, code: 'email_failed', expose: true },
      )
    }

    return {
      id: record.id,
      reference: record.reference,
      kind,
      status: record.status,
      createdAt: record.createdAt,
    }
  }

  async function list(kind, filters) {
    return repo.listSubmissions(kind, filters)
  }

  async function detail(kind, id) {
    const record = await repo.getSubmission(kind, id)
    if (!record) return null
    const attachments = await repo.listAttachments(kind, id)
    const activity = await repo.listActivity(kind, id)
    return { record, attachments, activity }
  }

  async function update(kind, id, patch, actor) {
    const existing = await repo.getSubmission(kind, id)
    if (!existing) return null

    const updateData = {}
    let statusChanged = false
    if (patch.status && patch.status !== existing.status) {
      updateData.status = patch.status
      statusChanged = true
    }
    if (patch.internalNotes !== undefined) updateData.internalNotes = patch.internalNotes
    if (patch.assignedAdminId !== undefined) updateData.assignedAdminId = patch.assignedAdminId
    if (patch.archived !== undefined) updateData.archivedAt = patch.archived ? new Date() : null

    const updated = await repo.updateSubmission(kind, id, updateData)

    const base = {
      submissionKind: kind,
      submissionId: id,
      actorKind: 'admin',
      actorAdminId: actor?.id ?? null,
    }
    if (statusChanged) {
      await repo.addActivity({ ...base, action: 'status_changed', detail: { from: existing.status, to: patch.status } })
    }
    if (patch.internalNotes !== undefined) {
      await repo.addActivity({ ...base, action: 'note_added' })
    }
    if (patch.assignedAdminId !== undefined) {
      await repo.addActivity({ ...base, action: 'assigned', detail: { assignedAdminId: patch.assignedAdminId } })
    }
    if (patch.archived !== undefined) {
      await repo.addActivity({ ...base, action: patch.archived ? 'archived' : 'restored' })
    }

    return updated
  }

  return { create, list, detail, update }
}

export default createSubmissionService
