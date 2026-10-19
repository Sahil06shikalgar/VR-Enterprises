/*
 * Frontend API client.
 *
 * The base URL is configured with VITE_API_URL. In local development it points
 * at the backend (http://localhost:8787); in production set it to the API
 * origin, or leave it empty to use the same origin (e.g. behind a reverse
 * proxy that serves the API at /api).
 */
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8787').replace(/\/+$/, '')

class ApiError extends Error {
  constructor(message, { status, code, fields } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

async function request(path, { body, isForm = false } = {}) {
  const options = { method: 'POST' }
  if (isForm) {
    options.body = body
  } else {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new ApiError('We could not reach the server. Please check your connection and try again.', {
      status: 0,
      code: 'network_error',
    })
  }

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok) {
    const error = (payload && payload.error) || {}
    throw new ApiError(error.message || 'Something went wrong. Please try again.', {
      status: res.status,
      code: error.code,
      fields: error.fields,
    })
  }

  return payload
}

export const submitQuote = (data) => request('/api/quote', { body: data })
export const submitContact = (data) => request('/api/contact', { body: data })
export const submitCareer = (formData) => request('/api/careers/apply', { body: formData, isForm: true })
