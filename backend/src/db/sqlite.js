/*
 * SQLite connection (node:sqlite — built into Node.js, no native dependency).
 *
 * A single synchronous database handle is opened for the process. All SQL is
 * parameterised (see repositories/sqlite.js), so user input is never
 * concatenated into a query (SQL-injection safe).
 *
 * The schema is applied idempotently on open so a fresh clone runs with zero
 * setup: `npm run dev` creates storage/vr.sqlite automatically.
 */
import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { SQLITE_SCHEMA_SQL } from './sqlite-schema.js'

const DEFAULT_SQLITE_URL = 'file:./storage/vr.sqlite'

/*
 * Accepts `file:./path.sqlite`, `file:/abs/path.sqlite`, `sqlite:./path` or a
 * plain path. `:memory:` / `file::memory:` are supported for tests.
 */
export function sqliteFilePath(url) {
  const raw = String(url || '').trim() || DEFAULT_SQLITE_URL
  if (raw === ':memory:' || raw === 'file::memory:') return ':memory:'
  const withoutScheme = raw.replace(/^(file:|sqlite:|sqlite3:)/i, '')
  if (withoutScheme === ':memory:') return ':memory:'
  return path.resolve(withoutScheme)
}

export function applySqliteSchema(db) {
  db.exec(SQLITE_SCHEMA_SQL)
}

export function createSqliteDatabase(config) {
  const url = config?.database?.url || DEFAULT_SQLITE_URL
  const filePath = sqliteFilePath(url)

  if (filePath !== ':memory:') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  }

  const db = new DatabaseSync(filePath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  db.exec('PRAGMA busy_timeout = 5000')
  applySqliteSchema(db)

  return {
    client: 'sqlite',
    db,
    filePath,
    async close() {
      db.close()
    },
  }
}

export default createSqliteDatabase
