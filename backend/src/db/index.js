/*
 * Opens the configured database and returns a ready-to-use repository.
 *
 * The database client is chosen in config (config.database.client):
 *   - 'sqlite'   -> embedded SQLite via node:sqlite (no external service)
 *   - 'postgres' -> PostgreSQL via the pg pool + Drizzle
 *
 * Callers get a uniform { client, repo, raw, close } shape so the server, the
 * migration script and the admin CLI can all share the same wiring.
 */
import { createDatabase } from './client.js'
import { createSqliteDatabase } from './sqlite.js'
import { createPostgresRepository } from '../repositories/postgres.js'
import { createSqliteRepository } from '../repositories/sqlite.js'

export function openDatabase(config) {
  if (config.database.client === 'sqlite') {
    const sqlite = createSqliteDatabase(config)
    return {
      client: 'sqlite',
      raw: sqlite.db,
      filePath: sqlite.filePath,
      repo: createSqliteRepository(sqlite.db),
      close: () => sqlite.close(),
    }
  }

  const postgres = createDatabase(config)
  return {
    client: 'postgres',
    raw: postgres.db,
    pool: postgres.pool,
    repo: createPostgresRepository(postgres.db),
    close: () => postgres.close(),
  }
}

export default openDatabase
