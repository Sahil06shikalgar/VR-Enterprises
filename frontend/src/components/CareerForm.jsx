import { useState } from 'react'
import Icon from './Icon.jsx'
import { contact } from '../data/contact.js'
import { submitCareer } from '../lib/api.js'

const MAX_UPLOAD_MB = 5
const DEFAULT_POSITIONS = ['General Application']

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  position: DEFAULT_POSITIONS[0],
  experience: '',
  portfolioUrl: '',
  coverMessage: '',
  consent: false,
  website: '',
}

/*
 * Career application form. Sends multipart/form-data (including the résumé) to
 * /api/careers/apply. Only positions passed in are offered — by default just a
 * "General Application" because no vacancies are published (we never invent
 * jobs).
 */
function CareerForm({ positions = DEFAULT_POSITIONS }) {
  const [form, setForm] = useState(initialForm)
  const [resume, setResume] = useState(null)
  const [status, setStatus] = useState('idle')
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFile = (event) => {
    setResume(event.target.files && event.target.files[0] ? event.target.files[0] : null)
  }

  const reset = () => {
    setForm(initialForm)
    setResume(null)
    setStatus('idle')
    setError('')
    setFieldErrors({})
    setStartedAt(Date.now())
  }

  const buildFormData = () => {
    const data = new FormData()
    data.append('fullName', form.fullName)
    data.append('phone', form.phone)
    data.append('email', form.email)
    data.append('position', form.position)
    data.append('experience', form.experience)
    if (form.portfolioUrl) data.append('portfolioUrl', form.portfolioUrl)
    data.append('coverMessage', form.coverMessage)
    data.append('consent', String(form.consent))
    data.append('website', form.website)
    data.append('formStartedAt', String(startedAt))
    if (typeof window !== 'undefined') data.append('sourcePage', window.location.pathname)
    if (resume) data.append('resume', resume)
    return data
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    if (resume && resume.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setFieldErrors({ resume: `Your résumé must be ${MAX_UPLOAD_MB} MB or smaller.` })
      return
    }

    setStatus('submitting')
    try {
      const payload = await submitCareer(buildFormData())
      setReference((payload && payload.data && payload.data.reference) || '')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Unable to submit your application right now.')
      if (err.fields) setFieldErrors(err.fields)
    }
  }

  const fieldError = (name) => fieldErrors && fieldErrors[name]

  return (
    <div className="hero-quote career-form">
      <div className="hero-quote__head">
        <span className="hero-quote__title">Apply to VR Enterprises</span>
        <span className="hero-quote__sub">We review every application.</span>
      </div>

      <div className="hero-quote__body">
        {status === 'success' ? (
          <div className="hero-quote__done" role="status">
            <span className="hero-quote__done-icon" aria-hidden="true">
              <Icon name="check" size={22} strokeWidth={2.4} />
            </span>
            <h3>Application received</h3>
            <p>
              Thank you{reference ? ` (ref ${reference})` : ''}. Our team will review your profile
              and reach out if there is a match.
            </p>
            <a className="btn btn-outline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Submit another application
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                aria-invalid={Boolean(fieldError('fullName'))}
                required
              />
              {fieldError('fullName') && <span className="field-error">{fieldError('fullName')}</span>}
            </label>
            <label>
              Mobile Number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9XXXX XXXXX"
                autoComplete="tel"
                aria-invalid={Boolean(fieldError('phone'))}
                required
              />
              {fieldError('phone') && <span className="field-error">{fieldError('phone')}</span>}
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldError('email'))}
                required
              />
              {fieldError('email') && <span className="field-error">{fieldError('email')}</span>}
            </label>
            <label>
              Position
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                aria-invalid={Boolean(fieldError('position'))}
                required
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {fieldError('position') && <span className="field-error">{fieldError('position')}</span>}
            </label>
            <label>
              Relevant experience
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 3 years in graphic design"
                aria-invalid={Boolean(fieldError('experience'))}
                required
              />
              {fieldError('experience') && <span className="field-error">{fieldError('experience')}</span>}
            </label>
            <label>
              Portfolio / LinkedIn (optional)
              <input
                type="url"
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                placeholder="https://…"
                autoComplete="url"
                aria-invalid={Boolean(fieldError('portfolioUrl'))}
              />
              {fieldError('portfolioUrl') && <span className="field-error">{fieldError('portfolioUrl')}</span>}
            </label>
            <label>
              Résumé (PDF or Word, max {MAX_UPLOAD_MB} MB)
              <input
                type="file"
                name="resume"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFile}
                aria-invalid={Boolean(fieldError('resume'))}
                required
              />
              {fieldError('resume') && <span className="field-error">{fieldError('resume')}</span>}
            </label>
            <label>
              Cover message
              <textarea
                name="coverMessage"
                rows="4"
                value={form.coverMessage}
                onChange={handleChange}
                placeholder="Tell us a little about yourself"
                aria-invalid={Boolean(fieldError('coverMessage'))}
                required
              />
              {fieldError('coverMessage') && <span className="field-error">{fieldError('coverMessage')}</span>}
            </label>

            {/* Honeypot: hidden from humans, tempting to bots. */}
            <div className="hp" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                aria-invalid={Boolean(fieldError('consent'))}
                required
              />
              <span>
                I agree to VR Enterprises storing my details for this application.
                {fieldError('consent') && <span className="field-error"> {fieldError('consent')}</span>}
              </span>
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : 'Submit application'}
              {status !== 'submitting' && <Icon name="arrow" size={17} />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default CareerForm
