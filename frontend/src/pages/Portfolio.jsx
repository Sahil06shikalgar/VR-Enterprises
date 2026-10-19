import { useEffect, useState, useMemo } from 'react'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'

const categories = [
  { slug: 'all', label: 'All Work', count: 138 },
  { slug: 'visiting-cards', label: 'Visiting Cards', count: 13 },
  { slug: 'logo-design', label: 'Logo Design', count: 32 },
  { slug: 'flyers-posters', label: 'Flyers & Posters', count: 25 },
  { slug: 'restaurant-menus', label: 'Restaurant Menus', count: 18 },
  { slug: 'packaging-labels', label: 'Packaging & Labels', count: 18 },
  { slug: 'presentations', label: 'Presentations (PPT)', count: 7 },
  { slug: 'invitations', label: 'Invitations', count: 17 },
  { slug: 'social-media', label: 'Social Media Posts', count: 8 },
]

const counts = {
  'visiting-cards': 13,
  'logo-design': 32,
  'packaging-labels': 18,
  'flyers-posters': 25,
  'restaurant-menus': 18,
  presentations: 7,
  invitations: 17,
  'social-media': 8,
}

const prefixes = {
  'flyers-posters': 'flyers',
  invitations: 'invitations',
  'logo-design': 'logos',
  'packaging-labels': 'package-labels',
  presentations: 'ppt',
  'restaurant-menus': 'menu',
  'social-media': 'smp',
  'visiting-cards': 'visiting-cards',
}

function formatItemTitle(slug, index, label) {
  const num = index + 1
  switch (slug) {
    case 'visiting-cards':
      return `Visiting Card Specimen #${num}`
    case 'logo-design':
      return `Brand Identity & Logo #${num}`
    case 'flyers-posters':
      return `Promotional Flyer & Poster #${num}`
    case 'restaurant-menus':
      return `Culinary Menu Design #${num}`
    case 'packaging-labels':
      return `Packaging & Label Suite #${num}`
    case 'presentations':
      return `Corporate Deck (PPT) #${num}`
    case 'invitations':
      return `Bespoke Event Invitation #${num}`
    case 'social-media':
      return `Social Media Creative #${num}`
    default:
      return `${label} #${num}`
  }
}

function filesFor(slug) {
  const cat = categories.find((c) => c.slug === slug)
  const label = cat ? cat.label : slug
  return Array.from({ length: counts[slug] || 0 }, (_, index) => {
    const file = `${prefixes[slug]}-${index + 1}`
    return {
      file,
      slug,
      src: `/images/portfolio/${slug}/${file}.webp`,
      label,
      title: formatItemTitle(slug, index, label),
    }
  })
}

// Build interleaved list for "All Work" so the user experiences a rich, diverse showcase
function buildInterleavedAllItems() {
  const categoryOrder = [
    'visiting-cards',
    'logo-design',
    'packaging-labels',
    'flyers-posters',
    'restaurant-menus',
    'presentations',
    'invitations',
    'social-media',
  ]
  const lists = categoryOrder.map((slug) => filesFor(slug))
  const maxLen = Math.max(...lists.map((l) => l.length))
  const result = []

  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) {
      if (i < list.length) {
        result.push(list[i])
      }
    }
  }
  return result
}

const allItems = buildInterleavedAllItems()

function Portfolio() {
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  const items = useMemo(() => {
    if (active === 'all') return allItems
    return filesFor(active)
  }, [active])

  const currentIndex = lightbox !== null ? items.findIndex((item) => item.file === lightbox.file) : -1

  useEffect(() => {
    if (lightbox === null) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightbox(null)
      } else if (event.key === 'ArrowRight') {
        setLightbox(items[(currentIndex + 1) % items.length])
      } else if (event.key === 'ArrowLeft') {
        setLightbox(items[(currentIndex - 1 + items.length) % items.length])
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightbox, currentIndex, items])

  return (
    <div className="page-portfolio">
      <PageHero
        breadcrumb="Portfolio"
        eyebrow="Our Work Portfolio"
        title="Work that speaks for itself"
        intro="Explore the design, printing, branding, packaging, and marketing collateral created by VR Enterprises."
        documentTitle="Portfolio"
        description="Browse the portfolio of VR Enterprises — visiting cards, logo design, flyers, menus, packaging, invitations, presentations, and social media creatives."
      />

      <section className="folio-band" aria-label="Portfolio gallery">
        <div className="container">
          {/* Category Filter Pills */}
          <div className="folio-filters" role="group" aria-label="Filter portfolio by category">
            {categories.map((cat) => {
              const isActive = active === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`folio-filter${isActive ? ' active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setActive(cat.slug)}
                >
                  <span>{cat.label}</span>
                  <span className="folio-filter__count">{cat.count}</span>
                </button>
              )
            })}
          </div>

          {/* Gallery Status & Counter */}
          <div className="folio-meta-bar">
            <span className="folio-meta-count">
              Showing <strong>{items.length}</strong> {active === 'all' ? 'total creations' : `${categories.find((c) => c.slug === active)?.label || ''} projects`}
            </span>
            <span className="folio-meta-badge">
              <Icon name="sparkles" size={14} />
              <span>In-House Production &amp; Craft</span>
            </span>
          </div>

          {/* Guaranteed Visible Portfolio Grid */}
          <div className="folio-grid">
            {items.map((item) => (
              <button
                type="button"
                className="folio-item"
                key={`${item.slug}-${item.file}`}
                onClick={() => setLightbox(item)}
                aria-label={`Open preview for ${item.title}`}
              >
                <div className="folio-item__media">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.src}
                    alt={`${item.label} piece by VR Enterprises`}
                    width="640"
                    height="480"
                  />
                  <div className="folio-item__overlay" aria-hidden="true">
                    <span className="folio-item__zoom-btn">
                      <Icon name="eye" size={18} />
                      <span>Quick Preview</span>
                    </span>
                  </div>
                </div>
                <div className="folio-item__info">
                  <span className="folio-item__cat">{item.label}</span>
                  <h3 className="folio-item__title">{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* High-Resolution Lightbox Modal */}
        {lightbox !== null ? (
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio image viewer"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="lightbox__close"
              aria-label="Close image viewer"
              onClick={() => setLightbox(null)}
            >
              <Icon name="close" size={22} />
            </button>

            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation()
                setLightbox(items[(currentIndex - 1 + items.length) % items.length])
              }}
            >
              <Icon name="chevron" size={24} />
            </button>

            <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
              <img
                src={lightbox.src}
                alt={`${lightbox.label} portfolio piece by VR Enterprises`}
                className="lightbox__img"
              />
              <figcaption className="lightbox__caption">
                <span className="lightbox__cat">{lightbox.label}</span>
                <span className="lightbox__title">{lightbox.title}</span>
                <span className="lightbox__counter">
                  {currentIndex + 1} of {items.length}
                </span>
              </figcaption>
            </figure>

            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation()
                setLightbox(items[(currentIndex + 1) % items.length])
              }}
            >
              <Icon name="chevron" size={24} />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Portfolio