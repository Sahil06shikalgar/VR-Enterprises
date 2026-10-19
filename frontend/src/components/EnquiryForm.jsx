import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { contact } from '../data/contact.js'
import { services } from '../data/services.js'
import { submitQuote } from '../lib/api.js'

/*
 * Premium enquiry / quote form (Home hero, Contact Us, Service pages).
 *
 * Submits to the VR Enterprises API (POST /api/quote). Field names map to the
 * backend schema (message -> projectDescription). Includes client-side
 * validation with focus management, a honeypot and a form-start timestamp for
 * basic bot protection, and accessible loading / success / error states.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,19}$/

const FIELD_ORDER = ['fullName', 'phone', 'email', 'service', 'message', 'consent']

const POPULAR_CHIPS = [
  { slug: 'printing', label: 'Printing' },
  { slug: 'branding', label: 'Branding' },
  { slug: 'signages', label: 'Signages' },
  { slug: 'designing', label: 'Designing' },
  { slug: 'website-development', label: 'Web Dev' },
  { slug: 'video-creation', label: 'Video' },
]

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  service: '',
  message: '',
  consent: false,
  website: '',
}

function validate(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Please enter your full name.'
  if (!form.phone.trim()) errors.phone = 'Please enter your mobile number.'
  else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid mobile number.'
  if (!form.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.service) errors.service = 'Please choose a service.'
  const message = form.message.trim()
  if (!message) errors.message = 'Please tell us about your requirement.'
  else if (message.length < 10) errors.message = 'Please add a little more detail (at least 10 characters).'
  if (!form.consent) errors.consent = 'Please agree to be contacted so we can respond.'
  return errors
}

function EnquiryForm({
  defaultService = '',
  submitLabel = 'Request Free Consultation',
  title = '',
  subtitle = '',
  className = '',
}) {
  const uid = useId()
  const fieldRefs = useRef({})
  const [form, setForm] = useState(() => ({ ...initialForm, service: defaultService }))
  const [status, setStatus] = useState('idle')
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const fid = (name) => `enq-${uid}-${name}`
  const errId = (name) => `enq-${uid}-${name}-err`
  const fieldError = (name) => fieldErrors[name]
  const describedBy = (name) => (fieldError(name) ? errId(name) : undefined)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
    if (error) setError('')
  }

  const focusFirstError = (errors) => {
    const firstField = FIELD_ORDER.find((name) => errors[name])
    if (firstField && fieldRefs.current[firstField]) {
      fieldRefs.current[firstField].focus()
    }
  }

  const reset = () => {
    setForm({ ...initialForm, service: defaultService })
    setStatus('idle')
    setReference('')
    setError('')
    setFieldErrors({})
    setStartedAt(Date.now())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      focusFirstError(errors)
      return
    }

    setStatus('submitting')
    setError('')
    setFieldErrors({})

    try {
      const payload = await submitQuote({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        service: form.service,
        projectDescription: form.message,
        consent: form.consent,
        website: form.website,
        formStartedAt: startedAt,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
      setReference((payload && payload.data && payload.data.reference) || '')
      setStatus('success')
    } catch (err) {
      const serverFields = (err && err.fields) || {}
      const mapped = { ...serverFields }
      if (serverFields.projectDescription && !mapped.message) {
        mapped.message = serverFields.projectDescription
      }
      setFieldErrors(mapped)
      setStatus('error')
      setError(err && err.message ? err.message : 'Unable to send your request right now. Please try again.')
      focusFirstError(mapped)
    }
  }

  return (
    <div className={`enq-card${className ? ` ${className}` : ''}`}>
      {(title || subtitle) && (
        <div className="enq-card__head">
          <span className="enq-card__badge" aria-hidden="true">
            <Icon name="sparkle" size={17} strokeWidth={1.9} />
          </span>
          <div className="enq-card__heading">
            {title && <h3 className="enq-card__title">{title}</h3>}
            {subtitle && <p className="enq-card__sub">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className="enq-card__body">
        {status === 'success' ? (
          <div className="enq-success" role="status">
            <span className="enq-success__icon" aria-hidden="true">
              <Icon name="check" size={26} strokeWidth={2.6} />
            </span>
            <h4 className="enq-success__title">Thank you — your enquiry is in.</h4>
            <p className="enq-success__text">
              Our atelier team will review your requirement and get back to you within 24 business hours.
            </p>
            {reference ? (
              <p className="enq-success__ref">
                Reference <strong>{reference}</strong>
              </p>
            ) : null}
            <div className="enq-success__actions">
              <a className="btn btn-outline" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                <Icon name="phone" size={16} />
                {contact.phone}
              </a>
              <button type="button" className="enq-linkish" onClick={reset}>
                Send another enquiry
              </button>
            </div>
          </div>
        ) : (
          <form className="enq-form" onSubmit={handleSubmit} noValidate>
            <div className="enq-grid">
              <div className="enq-field">
                <label htmlFor={fid('fullName')}>Full Name</label>
                <div className={`enq-control${fieldError('fullName') ? ' is-invalid' : ''}`}>
                  <span className="enq-control__icon" aria-hidden="true">
                    <Icon name="users" size={18} />
                  </span>
                  <input
                    id={fid('fullName')}
                    ref={(el) => {
                      fieldRefs.current.fullName = el
                    }}
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldError('fullName'))}
                    aria-describedby={describedBy('fullName')}
                    required
                  />
                </div>
                {fieldError('fullName') && (
                  <p className="enq-error" id={errId('fullName')}>
                    {fieldError('fullName')}
                  </p>
                )}
              </div>

              <div className="enq-field">
                <label htmlFor={fid('phone')}>Mobile Number</label>
                <div className={`enq-control${fieldError('phone') ? ' is-invalid' : ''}`}>
                  <span className="enq-control__icon" aria-hidden="true">
                    <Icon name="phone" size={18} />
                  </span>
                  <input
                    id={fid('phone')}
                    ref={(el) => {
                      fieldRefs.current.phone = el
                    }}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={Boolean(fieldError('phone'))}
                    aria-describedby={describedBy('phone')}
                    required
                  />
                </div>
                {fieldError('phone') && (
                  <p className="enq-error" id={errId('phone')}>
                    {fieldError('phone')}
                  </p>
                )}
              </div>

              <div className="enq-field">
                <label htmlFor={fid('email')}>Email Address</label>
                <div className={`enq-control${fieldError('email') ? ' is-invalid' : ''}`}>
                  <span className="enq-control__icon" aria-hidden="true">
                    <Icon name="mail" size={18} />
                  </span>
                  <input
                    id={fid('email')}
                    ref={(el) => {
                      fieldRefs.current.email = el
                    }}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={Boolean(fieldError('email'))}
                    aria-describedby={describedBy('email')}
                    required
                  />
                </div>
                {fieldError('email') && (
                  <p className="enq-error" id={errId('email')}>
                    {fieldError('email')}
                  </p>
                )}
              </div>

              <div className="enq-field">
                <div className="enq-field-header">
                  <label htmlFor={fid('service')}>Select Service</label>
                  <span className="enq-field-tip">Tap chip or choose list</span>
                </div>

                {/* Quick Select Chips */}
                <div className="enq-chips" role="group" aria-label="Popular services">
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={chip.slug}
                      type="button"
                      className={`enq-chip${form.service === chip.slug ? ' is-active' : ''}`}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, service: chip.slug }))
                        if (fieldErrors.service) {
                          setFieldErrors((prev) => {
                            const copy = { ...prev }
                            delete copy.service
                            return copy
                          })
                        }
                      }}
                    >
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                <div
                  className={`enq-control enq-control--select${fieldError('service') ? ' is-invalid' : ''}`}
                >
                  <span className="enq-control__icon" aria-hidden="true">
                    <Icon name="target" size={18} />
                  </span>
                  <select
                    id={fid('service')}
                    ref={(el) => {
                      fieldRefs.current.service = el
                    }}
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="enq-select"
                    aria-invalid={Boolean(fieldError('service'))}
                    aria-describedby={describedBy('service')}
                    required
                  >
                    <option value="" disabled>
                      Choose from all services...
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <span className="enq-control__chevron" aria-hidden="true">
                    <Icon name="chevron" size={14} />
                  </span>
                </div>
                {fieldError('service') && (
                  <p className="enq-error" id={errId('service')}>
                    {fieldError('service')}
                  </p>
                )}
              </div>

              <div className="enq-field enq-field--full">
                <label htmlFor={fid('message')}>Project Requirements</label>
                <div className={`enq-control${fieldError('message') ? ' is-invalid' : ''}`}>
                  <span className="enq-control__icon enq-control__icon--top" aria-hidden="true">
                    <Icon name="chat" size={18} />
                  </span>
                  <textarea
                    id={fid('message')}
                    ref={(el) => {
                      fieldRefs.current.message = el
                    }}
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about the scope, quantities, material preference, or timeline..."
                    aria-invalid={Boolean(fieldError('message'))}
                    aria-describedby={describedBy('message')}
                    required
                  />
                </div>
                {fieldError('message') && (
                  <p className="enq-error" id={errId('message')}>
                    {fieldError('message')}
                  </p>
                )}
              </div>
            </div>

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

            <label className="enq-consent">
              <input
                ref={(el) => {
                  fieldRefs.current.consent = el
                }}
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                aria-invalid={Boolean(fieldError('consent'))}
                aria-describedby={describedBy('consent')}
              />
              <span className="enq-consent__box" aria-hidden="true">
                <Icon name="check" size={14} strokeWidth={3} />
              </span>
              <span className="enq-consent__text">
                I agree to be contacted by VR Enterprises regarding this project estimate.
              </span>
            </label>
            {fieldError('consent') && (
              <p className="enq-error" id={errId('consent')}>
                {fieldError('consent')}
              </p>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="enq-actions">
              <button className="enq-submit" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <span className="enq-spinner" aria-hidden="true" />
                    Transmitting specifications…
                  </>
                ) : (
                  <>
                    <span>{submitLabel}</span>
                    <span className="enq-submit-circle" aria-hidden="true">
                      <Icon name="arrow" size={16} />
                    </span>
                  </>
                )}
              </button>
              <p className="enq-privacy">
                <Icon name="shield" size={15} />
                <span>
                  Strict privacy standard &bull; Zero spam &bull; Direct artisan review &bull; See our{' '}
                  <Link to="/privacy-policy">Privacy Policy</Link>.
                </span>
              </p>
            </div>

            <p className="sr-only" aria-live="polite">
              {status === 'submitting' ? 'Sending your enquiry…' : ''}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default EnquiryForm
