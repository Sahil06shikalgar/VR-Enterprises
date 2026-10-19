import { ValidationError } from '../errors.js'

/*
 * Validates req.body / req.query / req.params with a Zod schema and stores the
 * parsed result on req.validated. Returns structured, field-level errors.
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const input = source === 'body' ? req.body ?? {} : source === 'query' ? req.query ?? {} : req.params ?? {}
    const result = schema.safeParse(input)
    if (!result.success) {
      const fields = {}
      for (const issue of result.error.issues) {
        const key = issue.path.length ? issue.path.join('.') : '_'
        if (!fields[key]) fields[key] = issue.message
      }
      return next(new ValidationError(fields))
    }
    req.validated = req.validated || {}
    req.validated[source] = result.data
    next()
  }
}

export const validateBody = (schema) => validate(schema, 'body')
export const validateQuery = (schema) => validate(schema, 'query')
