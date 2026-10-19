/*
 * Applies the database schema.
 *
 *   PostgreSQL -> runs the generated SQL migrations in /migrations
 *   SQLite     -> applies the embedded schema (created automatically on open,
 *                 this just makes it explicit)
 *
 * DB engine is chosen from config (DB_CLIENT / DATABASE_URL). Usage:
 *   npm run db:migrate
 */
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { loadConfig } from '../config.js'
import { createDatabase } from './client.js'
import { createSqliteDatabase } from './sqlite.js'
import { logger } from '../logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.resolve(__dirname, '../../migrations')

async function main() {
  const config = loadConfig()

  if (config.database.client === 'sqlite') {
    const { filePath, close } = createSqliteDatabase(config)
    try {
      logger.info('SQLite schema is up to date', { file: filePath })
    } finally {
      await close()
    }
    return
  }

  const { db, close } = createDatabase(config)
  try {
    logger.info('Applying migrations', { folder: migrationsFolder })
    await migrate(db, { migrationsFolder })
    logger.info('Migrations applied successfully')
  } finally {
    await close()
  }
}

main().catch((err) => {
  logger.errorObj('Migration failed', err)
  process.exitCode = 1
})
