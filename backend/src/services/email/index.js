/*
 * Email provider abstraction.
 *
 * Providers:
 *   - smtp    : real delivery via Nodemailer (any SMTP / transactional service)
 *   - console : development transport that logs a summary only (no secrets)
 *   - none    : delivery disabled
 *
 * Credentials come exclusively from configuration (environment variables) and
 * are never logged. A failed delivery is reported to the caller so the API does
 * not claim success when notification requirements are unmet.
 */
import nodemailer from 'nodemailer'
import { buildAdminNotification, buildAcknowledgement } from './templates.js'

export function createEmailService(config, logger) {
  const provider = config.email.provider
  let transporter = null

  if (provider === 'smtp') {
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure,
      auth: config.email.smtp.user
        ? { user: config.email.smtp.user, pass: config.email.smtp.pass }
        : undefined,
      // Loose timeouts so a stuck provider cannot hang the request forever.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
  }

  async function deliver({ to, cc, replyTo, subject, text, html }) {
    if (provider === 'none') {
      logger.warn('Email delivery skipped (provider disabled)', { subject })
      return { ok: false, skipped: true, error: 'email provider is disabled' }
    }

    if (provider === 'console') {
      logger.info('email (console transport)', { to, cc: cc || undefined, subject })
      return { ok: true, transport: 'console' }
    }

    try {
      await transporter.sendMail({
        from: config.email.from,
        to,
        cc: config.email.cc || undefined,
        replyTo,
        subject,
        text,
        html,
      })
      return { ok: true, transport: 'smtp' }
    } catch (err) {
      logger.errorObj('Email delivery failed', err, { subject })
      return { ok: false, error: err.message, transport: 'smtp' }
    }
  }

  return {
    provider,

    async sendAdminNotification(kind, record) {
      const message = buildAdminNotification(config, kind, record)
      return deliver({
        to: config.email.to,
        cc: config.email.cc || undefined,
        replyTo: record.email,
        subject: message.subject,
        text: message.text,
        html: message.html,
      })
    },

    async sendAcknowledgement(kind, record) {
      const message = buildAcknowledgement(config, kind, record)
      return deliver({
        to: record.email,
        subject: message.subject,
        text: message.text,
        html: message.html,
      })
    },

    async verify() {
      if (provider !== 'smtp' || !transporter) return { ok: true, provider }
      try {
        await transporter.verify()
        return { ok: true, provider }
      } catch (err) {
        return { ok: false, provider, error: err.message }
      }
    },
  }
}

export default createEmailService
