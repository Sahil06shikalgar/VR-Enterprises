/*
 * Database schema (PostgreSQL / Drizzle ORM).
 *
 * Entities: User/Admin, Session, ContactInquiry, QuoteRequest,
 * CareerApplication, Attachment, ActivityLog.
 *
 * Every submission table shares the same "common" columns: unique id,
 * created/updated timestamps, status, internal notes, optional assigned admin,
 * archive timestamp, plus request metadata (source page, IP, user agent,
 * correlation id) and email delivery status.
 */
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  bigint,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['admin', 'owner'])
export const submissionStatus = pgEnum('submission_status', [
  'new',
  'in_progress',
  'responded',
  'closed',
  'spam',
])
export const submissionKind = pgEnum('submission_kind', ['contact', 'quote', 'career'])
export const emailStatus = pgEnum('email_status', ['pending', 'sent', 'failed', 'skipped'])
export const actorKind = pgEnum('actor_kind', ['system', 'admin', 'customer'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: userRole('role').notNull().default('admin'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenHash: text('token_hash').notNull().unique(),
    csrfToken: text('csrf_token').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)],
)

function submissionColumns() {
  return {
    id: uuid('id').primaryKey().defaultRandom(),
    reference: text('reference').notNull().unique(),
    status: submissionStatus('status').notNull().default('new'),
    internalNotes: text('internal_notes'),
    assignedAdminId: uuid('assigned_admin_id').references(() => users.id, { onDelete: 'set null' }),
    sourcePage: text('source_page'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    correlationId: text('correlation_id'),
    emailStatus: emailStatus('email_status').notNull().default('pending'),
    notifiedAt: timestamp('notified_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }
}

export const contactInquiries = pgTable(
  'contact_inquiries',
  {
    ...submissionColumns(),
    fullName: text('full_name').notNull(),
    company: text('company'),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    consent: boolean('consent').notNull().default(false),
  },
  (table) => [
    index('contact_status_idx').on(table.status),
    index('contact_created_idx').on(table.createdAt),
    index('contact_email_idx').on(table.email),
  ],
)

export const quoteRequests = pgTable(
  'quote_requests',
  {
    ...submissionColumns(),
    fullName: text('full_name').notNull(),
    company: text('company'),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    service: text('service').notNull(),
    projectDescription: text('project_description').notNull(),
    budgetRange: text('budget_range'),
    preferredDeadline: text('preferred_deadline'),
    consent: boolean('consent').notNull().default(false),
  },
  (table) => [
    index('quote_status_idx').on(table.status),
    index('quote_created_idx').on(table.createdAt),
    index('quote_service_idx').on(table.service),
    index('quote_email_idx').on(table.email),
  ],
)

export const careerApplications = pgTable(
  'career_applications',
  {
    ...submissionColumns(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    position: text('position').notNull(),
    experience: text('experience').notNull(),
    portfolioUrl: text('portfolio_url'),
    coverMessage: text('cover_message').notNull(),
    consent: boolean('consent').notNull().default(false),
  },
  (table) => [
    index('career_status_idx').on(table.status),
    index('career_created_idx').on(table.createdAt),
    index('career_email_idx').on(table.email),
  ],
)

export const attachments = pgTable(
  'attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionKind: submissionKind('submission_kind').notNull(),
    submissionId: uuid('submission_id').notNull(),
    originalName: text('original_name').notNull(),
    storedName: text('stored_name').notNull(),
    mimeType: text('mime_type').notNull(),
    extension: text('extension').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    uploadedByKind: text('uploaded_by_kind').notNull().default('customer'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('attachments_submission_idx').on(table.submissionKind, table.submissionId)],
)

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionKind: submissionKind('submission_kind'),
    submissionId: uuid('submission_id'),
    actorKind: actorKind('actor_kind').notNull().default('system'),
    actorAdminId: uuid('actor_admin_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    detail: jsonb('detail'),
    correlationId: text('correlation_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('activity_submission_idx').on(table.submissionKind, table.submissionId),
    index('activity_created_idx').on(table.createdAt),
  ],
)
