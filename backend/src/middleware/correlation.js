import { randomUUID } from 'node:crypto'

/*
 * Attaches a correlation id to every request (reusing an inbound id when
 * present) and a request-scoped child logger.
 */
export function correlationMiddleware(logger) {
  return (req, res, next) => {
    const inbound = req.get('x-correlation-id') || req.get('x-request-id')
    const id = (inbound && String(inbound).slice(0, 100)) || randomUUID()
    req.id = id
    req.log = logger.child({ correlationId: id, method: req.method, path: req.path })
    res.setHeader('X-Correlation-Id', id)
    next()
  }
}

export default correlationMiddleware
