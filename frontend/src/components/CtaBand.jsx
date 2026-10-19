import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

/*
 * Shared closing call-to-action band used at the end of inner pages.
 */
function CtaBand({
  title = 'Ready to start your project?',
  text = 'Tell us what you need and our team will get back to you within 24 hours with a clear plan and quote.',
  primaryLabel = 'Get a Quote',
  primaryTo = '/contact-us',
  secondaryLabel = 'Explore Our Services',
  secondaryTo = '/services',
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <Reveal>
          <div className="cta-panel">
            <div className="cta-copy">
              <h2 id="cta-title">{title}</h2>
              <p>{text}</p>
            </div>
            <div className="cta-actions">
              <Link className="btn btn-light" to={primaryTo}>
                {primaryLabel}
                <Icon name="arrow" size={17} />
              </Link>
              {secondaryLabel && secondaryTo ? (
                <Link className="btn btn-ghost" to={secondaryTo}>
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CtaBand
