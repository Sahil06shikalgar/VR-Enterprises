import 'dotenv/config'
import { loadConfig } from '../config.js'
import { createLogger } from '../logger.js'
import { openDatabase } from '../db/index.js'
import { hashPassword } from '../services/auth.js'
import { ROLES } from '../constants.js'

/*
 * Creates (or, with --update, resets) an admin account.
 *
 *   node src/cli/create-admin.js --email admin@example.com --password '...' --name "Jane" --role owner
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node src/cli/create-admin.js
 *
 * The password is never echoed. Prefer the env vars over --password so it does
 * not end up in your shell history.
 */
function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}
const flag = (name) => process.argv.includes(`--${name}`)

const email = String(arg('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const password = arg('password') || process.env.ADMIN_PASSWORD || ''
const name = arg('name') || process.env.ADMIN_NAME || 'Administrator'
const role = String(arg('role') || 'owner').toLowerCase()
const update = flag('update')

function fail(message) {
  console.error(`\n  Error: ${message}\n`)
  process.exit(1)
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail('a valid --email (or ADMIN_EMAIL) is required')
if (password.length < 12) fail('--password (or ADMIN_PASSWORD) must be at least 12 characters')
if (!ROLES.includes(role)) fail(`--role must be one of: ${ROLES.join(', ')}`)

const config = loadConfig()
const logger = createLogger({ level: 'warn' })

const database = openDatabase(config)
const { repo } = database

try {
  const existing = await repo.findUserByEmail(email)
  const passwordHash = await hashPassword(password)

  if (existing) {
    if (!update) {
      fail(`an account for ${email} already exists (pass --update to reset its password)`)
    }
    const updated = await repo.updateUserPassword(existing.id, passwordHash, role)
    if (!updated) fail('failed to update the account')
    console.log(`\n  Updated admin account: ${email} (role: ${role})\n`)
  } else {
    await repo.createUser({ email, passwordHash, name, role })
    console.log(`\n  Created admin account: ${email} (role: ${role})\n`)
  }
} catch (err) {
  logger.errorObj('Failed to create admin', err)
  process.exitCode = 1
} finally {
  await database.close()
}
