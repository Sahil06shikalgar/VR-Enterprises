import 'dotenv/config'
import { loadConfig } from './config.js'
import { createLogger } from './logger.js'
import { openDatabase } from './db/index.js'
import { createEmailService } from './services/email/index.js'
import { createApp } from './app.js'

const config = loadConfig()
const logger = createLogger({ level: config.logLevel })

const database = openDatabase(config)
const { repo } = database
const emailService = createEmailService(config, logger)
const app = createApp({ config, repo, emailService, logger })

const server = app.listen(config.port, () => {
  logger.info('VR Enterprises API listening', {
    port: config.port,
    env: config.env,
    db: database.client,
    emailProvider: config.email.provider,
  })
})

let shuttingDown = false
async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info('Shutting down', { signal })
  server.close(() => {
    database
      .close()
      .catch((err) => logger.errorObj('Error closing database pool', err))
      .finally(() => process.exit(0))
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (err) => logger.errorObj('Unhandled promise rejection', err))
process.on('uncaughtException', (err) => {
  logger.errorObj('Uncaught exception', err)
  shutdown('uncaughtException')
})
