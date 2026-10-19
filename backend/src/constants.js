/*
 * Shared domain constants for the VR Enterprises backend.
 *
 * The nine service slugs MUST stay in sync with the frontend
 * (frontend/src/data/services.js). The public quote endpoint rejects any
 * service value that is not in this list.
 */

export const SERVICES = [
  { slug: 'designing', label: 'Designing' },
  { slug: 'printing', label: 'Printing' },
  { slug: 'branding', label: 'Branding' },
  { slug: 'signages', label: 'Signages' },
  { slug: 'video-creation', label: 'Video Creation' },
  { slug: 'digital-marketing', label: 'Digital Marketing' },
  { slug: 'website-development', label: 'Website Development & AMC' },
  { slug: 'app-development', label: 'App Development' },
  { slug: 'software-development', label: 'Software Development' },
]

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug)

export const SERVICE_LABELS = Object.fromEntries(SERVICES.map((s) => [s.slug, s.label]))

/*
 * There are no genuine open vacancies published by VR Enterprises, so the only
 * default position is a "General Application". Real openings can be added later
 * through the CAREER_POSITIONS environment variable (comma separated) without a
 * code change — we never invent vacancies.
 */
export const DEFAULT_CAREER_POSITIONS = ['General Application']

export const SUBMISSION_STATUSES = ['new', 'in_progress', 'responded', 'closed', 'spam']

export const STATUS_LABELS = {
  new: 'New',
  in_progress: 'In Progress',
  responded: 'Responded',
  closed: 'Closed',
  spam: 'Spam',
}

export const SUBMISSION_KINDS = ['contact', 'quote', 'career']

export const ROLES = ['admin', 'owner']

export const ROLE_RANK = { admin: 1, owner: 2 }

export const ACTOR_KINDS = ['system', 'admin', 'customer']

export const EMAIL_STATUSES = ['pending', 'sent', 'failed', 'skipped']
