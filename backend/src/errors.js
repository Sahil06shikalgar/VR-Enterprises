/*
 * Application error type + helpers.
 *
 * Only `expose: true` errors reveal their message to the client. Anything else
 * (unexpected failures, database errors, mail errors) is reported as a generic
 * 500 so internal details never leak.
 */
export class AppError extends Error {
  constructor(message, { status = 500, code = 'internal_error', fields, expose = true, cause } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.fields = fields
    this.expose = expose
    if (cause) this.cause = cause
  }
}

export class ValidationError extends AppError {
  constructor(fields, message = 'Please correct the highlighted fields.') {
    super(message, { status: 422, code: 'validation_error', fields })
  }
}

export const badRequest = (message = 'Bad request', code = 'bad_request') =>
  new AppError(message, { status: 400, code })

export const unauthorized = (message = 'Authentication required.', code = 'unauthorized') =>
  new AppError(message, { status: 401, code })

export const forbidden = (message = 'You are not allowed to do that.', code = 'forbidden') =>
  new AppError(message, { status: 403, code })

export const notFound = (message = 'Not found.', code = 'not_found') =>
  new AppError(message, { status: 404, code })

export const conflict = (message = 'Conflict.', code = 'conflict') =>
  new AppError(message, { status: 409, code })

export const tooMany = (message = 'Too many requests. Please try again later.', code = 'rate_limited') =>
  new AppError(message, { status: 429, code })

export const serverError = (cause) =>
  new AppError('Something went wrong on our side.', {
    status: 500,
    code: 'internal_error',
    expose: false,
    cause,
  })
