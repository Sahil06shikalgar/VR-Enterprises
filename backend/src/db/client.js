/*
 * PostgreSQL connection + Drizzle client.
 *
 * A single connection pool is created for the process. SQL is always built by
 * Drizzle (parameterised), which prevents SQL injection.
 */
import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'

const { Pool } = pg

export function createDatabase(config) {
  if (!config.database.url) {
    throw new Error('DATABASE_URL is not configured')
  }

  const pool = new Pool({
    connectionString: config.database.url,
    max: config.database.poolMax,
    ssl: config.database.ssl ? { rejectUnauthorized: false } : undefined,
    application_name: 'vr-enterprises-api',
  })

  const db = drizzle(pool, { schema })

  return {
    db,
    pool,
    schema,
    async close() {
      await pool.end()
    },
  }
}

export default createDatabase
