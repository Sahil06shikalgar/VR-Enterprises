import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Icon from './Icon.jsx'
import SocialLinks from './SocialLinks.jsx'
import ScrollAnimations from './ScrollAnimations.jsx'
import FloatingWidget from './FloatingWidget.jsx'
import CustomCursor from './CustomCursor.jsx'
import FluidWaterBackground from './FluidWaterBackground.jsx'
import { usePageTransition } from '../hooks/usePageTransition.js'
import { scrollToTop } from '../hooks/useLenis.js'
import { contact, contactEmailHref } from '../data/contact.js'
import { services } from '../data/services.js'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services', mega: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about-us', label: 'Our Story' },
  { to: '/blogs', label: 'Journal' },
  { to: '/contact-us', label: 'Contact' },
]

const creativeServices = services.filter((s) =>
  ['designing', 'printing', 'branding', 'signages'].includes(s.slug),
)
const techServices = services.filter((s) =>
  ['video-creation', 'digital-marketing', 'website-development', 'app-development', 'software-development'].includes(
    s.slug,
  ),
)

const policyLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/terms-of-service', label: 'Terms & Conditions' },
]

const year = new Date().getFullYear()

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 12)
  const location = useLocation()
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const [prevPath, setPrevPath] = useState(location.pathname)

  usePageTransition()

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    setMenuOpen(false)
    setSubOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 991) {
        setMenuOpen(false)
        setSubOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Universal handler: closes drawers and guarantees scrolling to top (0, 0)
  const handleNavClick = (to) => {
    setMenuOpen(false)
    setSubOpen(false)
    if (location.pathname === to) {
      scrollToTop(false) // Smooth scroll to top if already on this page
    } else {
      scrollToTop(true)  // Instant top alignment on new route
    }
  }

  return (
    <>
      {/* Ambient Flowing Water & Granules Background Engine */}
      <FluidWaterBackground />

      <ScrollAnimations />

      {/* Luxury Redesigned Floating Island Header */}
      <header
        ref={headerRef}
        className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}
        data-test="header"
      >
        <div className="site-header__outer">
          <div className="site-header__island">
            {/* Clove Brand Medallion & Atelier Wordmark */}
            <Link
              to="/"
              className="brand"
              onClick={() => handleNavClick('/')}
              title="VR Enterprises — Creative & Print Atelier"
            >
              <div className="brand-logo-wrap">
                <img
                  src="/images/brand/vr-logo.webp"
                  alt="VR Enterprises logo"
                  width="36"
                  height="36"
                  className="brand-logo"
                />
              </div>
              <div className="brand-text">
                <span className="brand-name">VR Enterprises</span>
                <span className="brand-status">
                  <span className="brand-status-dot" aria-hidden="true" />
                  Atelier Mumbai
                </span>
              </div>
            </Link>

            {/* Sculpted Segmented Nav Rail */}
            <nav className="header-nav" aria-label="Main navigation">
              <div className="nav-rail">
                {navLinks.map(({ to, label, mega }) =>
                  mega ? (
                    <div
                      key={to}
                      className={`nav-item--mega${subOpen ? ' is-open' : ''}`}
                      onMouseEnter={() => setSubOpen(true)}
                      onMouseLeave={() => setSubOpen(false)}
                    >
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `nav-link nav-link--mega${isActive ? ' active' : ''}`
                        }
                        onClick={() => handleNavClick(to)}
                      >
                        <span>{label}</span>
                        <Icon name="chevron" size={12} className="nav-chevron" />
                      </NavLink>

                      {/* Architectural Floating Mega Dropdown */}
                      <div className="mega-dropdown" role="region" aria-label="Services directory">
                        <div className="mega-grid">
                          <div className="mega-col">
                            <div className="mega-col__head">
                              <span className="mega-col__badge">Craft &bull; Physical</span>
                              <h4>Print &amp; Fabrication</h4>
                            </div>
                            <div className="mega-col__links">
                              {creativeServices.map((s) => (
                                <Link
                                  key={s.slug}
                                  to={`/services/${s.slug}`}
                                  className="mega-link"
                                  onClick={() => handleNavClick(`/services/${s.slug}`)}
                                >
                                  <span className="mega-link__icon" aria-hidden="true">
                                    <Icon name={s.icon} size={15} />
                                  </span>
                                  <div className="mega-link__body">
                                    <span className="mega-link__title">{s.label}</span>
                                    <span className="mega-link__sub">Bespoke atelier</span>
                                  </div>
                                  <Icon name="arrow" size={12} className="mega-link__arrow" />
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="mega-col">
                            <div className="mega-col__head">
                              <span className="mega-col__badge mega-col__badge--tech">Code &bull; Media</span>
                              <h4>Digital &amp; Technology</h4>
                            </div>
                            <div className="mega-col__links">
                              {techServices.map((s) => (
                                <Link
                                  key={s.slug}
                                  to={`/services/${s.slug}`}
                                  className="mega-link"
                                  onClick={() => handleNavClick(`/services/${s.slug}`)}
                                >
                                  <span className="mega-link__icon mega-link__icon--tech" aria-hidden="true">
                                    <Icon name={s.icon} size={15} />
                                  </span>
                                  <div className="mega-link__body">
                                    <span className="mega-link__title">{s.label}</span>
                                    <span className="mega-link__sub">Full-stack suite</span>
                                  </div>
                                  <Icon name="arrow" size={12} className="mega-link__arrow" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mega-footer-bar">
                          <div className="mega-footer-bar__left">
                            <span className="mega-footer-sparkle" aria-hidden="true">✦</span>
                            <span>Looking for tailored enterprise production?</span>
                          </div>
                          <Link
                            to="/contact-us"
                            className="mega-footer-bar__btn"
                            onClick={() => handleNavClick('/contact-us')}
                          >
                            <span>Request Atelier Quote</span>
                            <Icon name="arrow" size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `nav-link${isActive ? ' active' : ''}`
                      }
                      onClick={() => handleNavClick(to)}
                    >
                      <span>{label}</span>
                    </NavLink>
                  ),
                )}
              </div>
            </nav>

            {/* Header Right Action Desk */}
            <div className="header-actions">
              <a
                className="header-call-pill"
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                title="Direct studio telephone"
              >
                <span className="live-call-dot" aria-hidden="true" />
                <Icon name="phone" size={13} />
                <span className="call-number">{contact.phone}</span>
              </a>

              <Link
                to="/contact-us"
                className="header-cta-pill"
                onClick={() => handleNavClick('/contact-us')}
              >
                <span>Consultation</span>
                <span className="cta-arrow-circle" aria-hidden="true">
                  <Icon name="arrow" size={12} />
                </span>
              </Link>

              <button
                ref={toggleRef}
                type="button"
                className={`menu-toggle${menuOpen ? ' is-active' : ''}`}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className="menu-toggle__box">
                  <span className="menu-toggle__line" />
                  <span className="menu-toggle__line" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Luxury Atelier Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                className="mobile-nav-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mobile-drawer-head">
                  <div className="brand" onClick={() => handleNavClick('/')}>
                    <div className="brand-logo-wrap">
                      <img
                        src="/images/brand/vr-logo.webp"
                        alt="VR Enterprises logo"
                        width="30"
                        height="30"
                      />
                    </div>
                    <div className="brand-text">
                      <span className="brand-name">VR Enterprises</span>
                      <span className="brand-status">
                        <span className="brand-status-dot" />
                        Atelier Mumbai
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mobile-drawer-close"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>

                <div className="mobile-nav-links">
                  {navLinks.map(({ to, label, mega }, index) => (
                    <div key={to} className="mobile-nav-item">
                      <div className="mobile-nav-row">
                        <NavLink
                          to={to}
                          className="mobile-nav-link"
                          onClick={() => handleNavClick(to)}
                        >
                          <span className="mobile-nav-index">0{index + 1}</span>
                          <span className="mobile-nav-title">{label}</span>
                        </NavLink>
                        {mega && (
                          <button
                            type="button"
                            className={`mobile-sub-toggle${mobileServicesOpen ? ' is-open' : ''}`}
                            onClick={() => setMobileServicesOpen((o) => !o)}
                            aria-label="Toggle all services"
                          >
                            <Icon name="chevron" size={14} />
                          </button>
                        )}
                      </div>

                      {mega && mobileServicesOpen && (
                        <div className="mobile-sub-services">
                          <p className="mobile-sub-label">Print &amp; Fabrication</p>
                          {creativeServices.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/services/${s.slug}`}
                              className="mobile-sub-link"
                              onClick={() => handleNavClick(`/services/${s.slug}`)}
                            >
                              <Icon name={s.icon} size={14} />
                              <span>{s.label}</span>
                            </Link>
                          ))}

                          <p className="mobile-sub-label" style={{ marginTop: '14px' }}>Digital &amp; Technology</p>
                          {techServices.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/services/${s.slug}`}
                              className="mobile-sub-link"
                              onClick={() => handleNavClick(`/services/${s.slug}`)}
                            >
                              <Icon name={s.icon} size={14} />
                              <span>{s.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mobile-drawer-footer">
                  <Link
                    to="/contact-us"
                    className="mobile-cta-btn"
                    onClick={() => handleNavClick('/contact-us')}
                  >
                    <span>Book Atelier Consultation</span>
                    <Icon name="arrow" size={15} />
                  </Link>

                  <div className="mobile-contact-chips">
                    <a
                      className="mobile-chip"
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    >
                      <Icon name="phone" size={14} />
                      <span>{contact.phone}</span>
                    </a>
                    <a
                      className="mobile-chip"
                      href={contactEmailHref()}
                    >
                      <Icon name="mail" size={14} />
                      <span>{contact.email}</span>
                    </a>
                  </div>

                  <p className="mobile-address-note">
                    Sector-5, Ghansoli, Navi Mumbai &bull; Mon &ndash; Sat 10AM &ndash; 6PM
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      {/* Clove Editorial Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col footer-col--brand">
            <Link to="/" className="brand" onClick={() => handleNavClick('/')}>
              <div className="brand-logo-wrap">
                <img
                  src="/images/brand/vr-logo.webp"
                  alt="VR Enterprises logo"
                  width="36"
                  height="36"
                  className="brand-logo"
                />
              </div>
              <div className="brand-text">
                <span className="brand-name">VR Enterprises</span>
                <span className="brand-tagline">Print &amp; Digital Atelier</span>
              </div>
            </Link>
            <p className="footer-bio">
              Premium print, signage, branding, and digital solutions atelier in Navi Mumbai.
              Transforming corporate and retail brand presence since 2018.
            </p>
          </div>

          <div className="footer-col">
            <h4>Physical Atelier</h4>
            <ul className="footer-links">
              {creativeServices.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} onClick={() => handleNavClick(`/services/${s.slug}`)}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Digital Studio</h4>
            <ul className="footer-links">
              {techServices.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} onClick={() => handleNavClick(`/services/${s.slug}`)}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Studio Hours</h4>
            <p className="footer-address">
              Monday &ndash; Saturday<br />
              10:00 AM &ndash; 6:00 PM IST<br />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Closed on Sundays
              </span>
            </p>
            <h4 style={{ marginTop: '20px' }}>Connect</h4>
            <SocialLinks />
          </div>
        </div>

        <div className="container footer-bottom">
          <div>
            &copy; {year} VR Enterprises. All rights reserved.
          </div>
          <div className="footer-legal-links">
            {policyLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => handleNavClick(to)}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Dynamic Floating Chat & Action Desk */}
      <FloatingWidget />

      {/* Luxury Interactive Cursor */}
      <CustomCursor />
    </>
  )
}

export default Layout