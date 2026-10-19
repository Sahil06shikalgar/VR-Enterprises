import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

/*
 * drizzle-kit config. `generate` does not require a live database; `migrate`
 * is run through src/db/migrate.js (npm run db:migrate).
 */
export default defineConfig({
  schema: './src/db/schema.js',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/vr_enterprises',
  },
  strict: true,
  verbose: true,
})
