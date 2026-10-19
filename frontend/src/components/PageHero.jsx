import { Link, useLocation } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import { useSeo } from '../lib/seo.js'

/*
 * Shared header band for inner pages — dark navy with a content-aware glow.
 * Also applies per-route SEO (title, description, canonical, Open Graph).
 */
function PageHero({ title, eyebrow, intro, breadcrumb, documentTitle, description }) {
  const location = useLocation()
  useSeo({ title: documentTitle ?? title, description, path: location.pathname })

  return (
    <section className="page-hero" aria-labelledby="page-hero-title">
      <div className="container page-hero__inner">
        <Reveal>
          {breadcrumb ? (
            <nav className="page-hero__crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>{breadcrumb}</span>
            </nav>
          ) : null}
          {eyebrow ? <span className="section-eyebrow section-eyebrow--light">{eyebrow}</span> : null}
          <h1 id="page-hero-title">{title}</h1>
          {intro ? <p>{intro}</p> : null}
        </Reveal>
      </div>
    </section>
  )
}

export default PageHero
