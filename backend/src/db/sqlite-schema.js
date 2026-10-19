/*
 * SQLite schema (DDL).
 *
 * Mirrors src/db/schema.js (the PostgreSQL/Drizzle schema) so the exact same
 * application code and repository interface run on an embedded SQL database
 * with zero external setup. All statements are idempotent, so applying this on
 * every boot is safe.
 *
 * Type mapping:
 *   uuid/text        -> TEXT (UUIDs are generated in the application layer)
 *   timestamptz      -> INTEGER (Unix epoch milliseconds; sorts correctly)
 *   boolean          -> INTEGER 0/1
 *   jsonb            -> TEXT (JSON-encoded)
 *   enums            -> TEXT (validated by the application layer)
 */
export const SQLITE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_token TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  assigned_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  source_page TEXT,
  ip_address TEXT,
  user_agent TEXT,
  correlation_id TEXT,
  email_status TEXT NOT NULL DEFAULT 'pending',
  notified_at INTEGER,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS contact_status_idx ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS contact_created_idx ON contact_inquiries(created_at);
CREATE INDEX IF NOT EXISTS contact_email_idx ON contact_inquiries(email);

CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  assigned_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  source_page TEXT,
  ip_address TEXT,
  user_agent TEXT,
  correlation_id TEXT,
  email_status TEXT NOT NULL DEFAULT 'pending',
  notified_at INTEGER,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  project_description TEXT NOT NULL,
  budget_range TEXT,
  preferred_deadline TEXT,
  consent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS quote_status_idx ON quote_requests(status);
CREATE INDEX IF NOT EXISTS quote_created_idx ON quote_requests(created_at);
CREATE INDEX IF NOT EXISTS quote_service_idx ON quote_requests(service);
CREATE INDEX IF NOT EXISTS quote_email_idx ON quote_requests(email);

CREATE TABLE IF NOT EXISTS career_applications (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  assigned_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  source_page TEXT,
  ip_address TEXT,
  user_agent TEXT,
  correlation_id TEXT,
  email_status TEXT NOT NULL DEFAULT 'pending',
  notified_at INTEGER,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  portfolio_url TEXT,
  cover_message TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS career_status_idx ON career_applications(status);
CREATE INDEX IF NOT EXISTS career_created_idx ON career_applications(created_at);
CREATE INDEX IF NOT EXISTS career_email_idx ON career_applications(email);

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  submission_kind TEXT NOT NULL,
  submission_id TEXT NOT NULL,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  extension TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  uploaded_by_kind TEXT NOT NULL DEFAULT 'customer',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS attachments_submission_idx ON attachments(submission_kind, submission_id);

CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  submission_kind TEXT,
  submission_id TEXT,
  actor_kind TEXT NOT NULL DEFAULT 'system',
  actor_admin_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  detail TEXT,
  correlation_id TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS activity_submission_idx ON activity_logs(submission_kind, submission_id);
CREATE INDEX IF NOT EXISTS activity_created_idx ON activity_logs(created_at);
`

export default SQLITE_SCHEMA_SQL
