/*
 * Central error handling.
 *
 * Unexpected errors (status >= 500) are logged with a correlation id but the
 * client only ever receives a generic message — never stack traces, SQL errors,
 * filesystem paths or credentials.
 */
import { AppError } from '../errors.js'

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'not_found', message: 'Resource not found.' } })
}

function classify(err) {
  if (err && err.type === 'entity.parse.failed') {
    return { status: 400, code: 'bad_request', message: 'Malformed request body.' }
  }
  if (err && err.type === 'entity.too.large') {
    return { status: 413, code: 'payload_too_large', message: 'Request body is too large.' }
  }
  return null
}

export function errorHandler() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, _next) => {
    const classified = classify(err)
    const status = classified?.status || err.status || 500
    const code = classified?.code || (err instanceof AppError ? err.code : 'internal_error')
    const expose = classified ? true : err.expose !== false && status < 500

    if (status >= 500) {
      req.log?.errorObj?.('Unhandled request error', err)
    } else {
      req.log?.warn?.('Request rejected', { code, status, message: err.message })
    }

    const error = {
      code,
      message: expose ? err.message : 'Something went wrong on our side. Please try again.',
    }
    if (req.id) error.correlationId = req.id
    if (err.fields && expose) error.fields = err.fields

    res.status(status).json({ error })
  }
}
