/*
 * Server-side validation schemas (Zod).
 *
 * All incoming data is validated here — the server never trusts the client.
 * Emails are lower-cased/trimmed, phones are normalised to +digits, unknown
 * service values are rejected, and URLs are validated.
 */
import { z } from 'zod'
import { SERVICE_SLUGS, SUBMISSION_STATUSES, ROLES } from '../constants.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalizePhone(value) {
  const raw = String(value || '')
  const hasPlus = raw.trim().startsWith('+')
  const digits = raw.replace(/\D/g, '')
  return (hasPlus ? '+' : '') + digits
}

const emailField = z
  .string({ message: 'Email is required' })
  .trim()
  .max(200, 'Email is too long')
  .refine((v) => emailRegex.test(v), { message: 'Please enter a valid email address' })
  .transform((v) => v.toLowerCase())

const phoneField = z
  .string({ message: 'Phone number is required' })
  .trim()
  .refine((v) => /^[+()\-.\s\d]{7,20}$/.test(v), { message: 'Please enter a valid phone number' })
  .transform(normalizePhone)
  .refine((v) => /^\+?\d{7,15}$/.test(v), { message: 'Please enter a valid phone number' })

const consentField = z
  .preprocess((v) => v === true || v === 'true' || v === 'on' || v === '1' || v === 1, z.boolean())
  .refine((v) => v === true, { message: 'Please tick the consent box to continue' })

const nameField = z
  .string({ message: 'Full name is required' })
  .trim()
  .min(2, 'Please enter your full name')
  .max(120, 'Full name is too long')

const optionalCompany = z
  .string()
  .trim()
  .max(160, 'Company name is too long')
  .optional()
  .transform((v) => (v ? v : undefined))

const optionalUrl = z
  .string()
  .trim()
  .max(500, 'URL is too long')
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^https?:\/\/[^\s]+$/i.test(v), {
    message: 'Please enter a valid URL starting with http:// or https://',
  })

const optionalShort = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

const dateField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Date must be YYYY-MM-DD' })
  .refine((v) => {
    if (v === undefined) return true
    const d = new Date(v + 'T00:00:00Z')
    return !Number.isNaN(d.getTime())
  }, { message: 'Please enter a valid date' })

export function buildSubmissionSchemas({ careerPositions }) {
  const positions = careerPositions && careerPositions.length ? careerPositions : ['General Application']

  const contactSchema = z.object({
    fullName: nameField,
    company: optionalCompany,
    email: emailField,
    phone: phoneField,
    subject: z.string().trim().min(2, 'Please add a subject').max(200, 'Subject is too long'),
    message: z.string().trim().min(10, 'Please tell us a little more (min 10 characters)').max(5000, 'Message is too long'),
    consent: consentField,
  })

  const quoteSchema = z.object({
    fullName: nameField,
    company: optionalCompany,
    email: emailField,
    phone: phoneField,
    service: z.enum(SERVICE_SLUGS, { message: 'Please choose a valid service' }),
    projectDescription: z
      .string()
      .trim()
      .min(10, 'Please describe your project (min 10 characters)')
      .max(5000, 'Description is too long'),
    budgetRange: optionalShort(60),
    preferredDeadline: dateField,
    consent: consentField,
  })

  const careerSchema = z.object({
    fullName: nameField,
    email: emailField,
    phone: phoneField,
    position: z.enum(positions, { message: 'Please choose a valid position' }),
    experience: z.string().trim().min(1, 'Please enter your experience').max(120, 'Experience is too long'),
    portfolioUrl: optionalUrl,
    coverMessage: z.string().trim().min(10, 'Please add a short cover message').max(5000, 'Cover message is too long'),
    consent: consentField,
  })

  return { contactSchema, quoteSchema, careerSchema }
}

export const adminLoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required').max(200, 'Password is too long'),
})

export const adminUpdateSchema = z
  .object({
    status: z.enum(SUBMISSION_STATUSES).optional(),
    internalNotes: z.string().max(5000, 'Note is too long').optional(),
    assignedAdminId: z.string().uuid('Invalid admin id').nullable().optional(),
    archived: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No supported fields provided' })

export const adminListQuerySchema = z.object({
  status: z.enum(SUBMISSION_STATUSES).optional(),
  service: z.string().optional(),
  search: z.string().trim().max(120).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  archived: z
    .enum(['true', 'false', 'all'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : v ? 'all' : false)),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export { ROLES }
