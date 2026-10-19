import { useState, useEffect } from 'react'
import Icon from './Icon.jsx'
import { contact } from '../data/contact.js'

function FloatingWidget() {
  const [open, setOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="floating-widget-wrap" aria-label="Quick contact and actions">
      {/* Scroll to Top Pill */}
      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          title="Back to top"
        >
          <Icon name="arrow" size={16} />
        </button>
      )}

      {/* Popover Card */}
      {open && (
        <div className="floating-popover-card animate-fade-in">
          <div className="floating-popover-header">
            <div className="floating-popover-avatar">
              <span>VR</span>
              <span className="floating-status-dot" title="Online now" />
            </div>
            <div>
              <strong>VR Production Desk</strong>
              <small>Online &middot; Typically replies in 5 mins</small>
            </div>
            <button
              type="button"
              className="floating-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close quick chat"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="floating-popover-body">
            <p>
              Hi there! Looking for print samples, signage quotes, or website consultations?
              Chat directly with our production specialists.
            </p>

            <a
              className="floating-wa-action"
              href="https://wa.me/919930281240?text=Hi%20VR%20Enterprises,%20I%20would%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <span>Chat on WhatsApp</span>
              <Icon name="arrow" size={15} />
            </a>

            <a
              className="floating-call-action"
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              onClick={() => setOpen(false)}
            >
              <Icon name="phone" size={14} />
              <span>Call: {contact.phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        className={`floating-trigger-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open quick contact options"
        aria-expanded={open}
      >
        <span className="floating-pulse-ring" aria-hidden="true" />
        <span className="floating-btn-icon">
          <Icon name={open ? 'close' : 'chat'} size={22} />
        </span>
        <span className="floating-btn-text">Quick Chat</span>
      </button>
    </div>
  )
}

export default FloatingWidget
