import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading.jsx'
import TrustedBy from '../components/TrustedBy.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import Reviews from '../components/Reviews.jsx'
import Icon from '../components/Icon.jsx'
import AnimatedStat from '../components/AnimatedStat.jsx'
import MaterialExplorer from '../components/MaterialExplorer.jsx'
import FaqSection from '../components/FaqSection.jsx'
import ThreeDTilt from '../components/ThreeDTilt.jsx'
import Reveal from '../components/Reveal.jsx'
import { services } from '../data/services.js'
import { stats } from '../data/company.js'
import { team } from '../data/team.js'
import { contact, contactEmailHref, googleMapsUrl } from '../data/contact.js'
import { useSeo } from '../lib/seo.js'

const approaches = [
  {
    num: '01',
    title: 'In-Person & Remote Consultation',
    text: 'Visit our Ghansoli atelier to touch and feel authentic paper swatches, foil samples, and acrylic finishes, or collaborate virtually with rapid digital proofing.',
  },
  {
    num: '02',
    title: 'Single-Source Ownership',
    text: 'Zero vendor friction. Design, prepress, offset printing, signage fabrication, and web engineering run seamlessly under one dedicated roof.',
  },
  {
    num: '03',
    title: 'Tactile Materiality & Precision',
    text: 'Archival boards, weather-proof UV inks, laser CNC acrylics, and rigid multi-tier quality inspections ensure every deliverable reflects excellence.',
  },
  {
    num: '04',
    title: 'Guaranteed On-Time Delivery',
    text: 'Dedicated logistics across Mumbai, Navi Mumbai, and pan-India with certified signage technicians for hassle-free on-site installation.',
  },
]

const heroPills = [
  {
    id: 'print',
    label: 'Luxury Print & Foil',
    pill: '24-48h Dispatch',
    desc: '450 GSM velvet touch cardstocks, custom gold/copper foil stamping, spot UV & corporate suites.',
    link: '/services/printing',
    tag: 'Offset & Digital Press',
  },
  {
    id: 'signage',
    label: '3D LED Signages',
    pill: 'Pan-Mumbai Installation',
    desc: 'Architectural cast acrylics, backlit halo letters, ACP panels, and IP67 weather-proof illumination.',
    link: '/services/signages',
    tag: 'Storefront Fabrication',
  },
  {
    id: 'packaging',
    label: 'Rigid Box Packaging',
    pill: 'Custom Batches',
    desc: 'Magnetic closure luxury boxes, custom EVA foam inserts, food-grade packaging & premium retail cartons.',
    link: '/services/branding',
    tag: 'Bespoke Unboxing',
  },
  {
    id: 'digital',
    label: 'Modern Web & Apps',
    pill: 'Turnkey Code & SEO',
    desc: 'High-speed business web applications, custom UI/UX design, lead systems & 1-year free maintenance.',
    link: '/services/website-development',
    tag: 'Digital Engineering',
  },
]

const featuredWork = [
  {
    src: '/images/portfolio/visiting-cards/visiting-cards-1.webp',
    alt: 'Luxury visiting cards with gold foil stamping',
    title: 'Corporate Stationery Suite',
    cat: 'Printing & Packaging',
    specs: '450 GSM Velvet Matte · Thermal Gold Foil · Spot Gloss',
    turnaround: '24 Hours',
  },
  {
    src: '/images/portfolio/logo-design/logos-1.webp',
    alt: 'Minimalist brand identity design',
    title: 'Minimalist Brand Identity',
    cat: 'Brand Identity',
    specs: 'Comprehensive Vector Identity · Typography System · Brand Guide',
    turnaround: '3–5 Days',
  },
  {
    src: '/images/portfolio/packaging-labels/package-labels-1.webp',
    alt: 'Custom product packaging and labels',
    title: 'Artisanal Product Packaging',
    cat: 'Packaging Design',
    specs: 'Custom Dieline · Kappa Board · Metallic Embellishment',
    turnaround: '4–6 Days',
  },
  {
    src: '/images/portfolio/restaurant-menus/menu-1.webp',
    alt: 'Bespoke restaurant menu design',
    title: 'Bespoke Hospitality Menus',
    cat: 'Commercial Print',
    specs: '300 GSM Archival Textured Paper · Raised 3D Spot UV',
    turnaround: '48 Hours',
  },
  {
    src: '/images/portfolio/flyers-posters/flyers-1.webp',
    alt: 'Marketing flyers and promotional posters',
    title: 'Retail Campaign Collaterals',
    cat: 'Commercial Print',
    specs: '170 GSM Gloss Art Paper · High Definition CMYK Offset',
    turnaround: '24–48 Hours',
  },
  {
    src: '/images/portfolio/presentations/ppt-1.webp',
    alt: 'Corporate keynote presentations',
    title: 'Investor Pitch Presentations',
    cat: 'Digital Design',
    specs: 'Interactive Figma / Keynote Deck · Infographic Assets',
    turnaround: '3 Days',
  },
]

const portfolioCategories = [
  'All Works',
  'Printing & Packaging',
  'Brand Identity',
  'Packaging Design',
  'Commercial Print',
  'Digital Design',
]

function Home() {
  useSeo({ path: '/' })
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeHeroPill, setActiveHeroPill] = useState(heroPills[0])
  const [selectedPortfolioCat, setSelectedPortfolioCat] = useState('All Works')
  const [activeLightbox, setActiveLightbox] = useState(null)

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'print') {
      return ['designing', 'printing', 'branding', 'signages'].includes(s.slug)
    }
    if (activeCategory === 'digital') {
      return [
        'video-creation',
        'digital-marketing',
        'website-development',
        'app-development',
        'software-development',
      ].includes(s.slug)
    }
    return true
  })

  const filteredPortfolio = featuredWork.filter((item) => {
    if (selectedPortfolioCat === 'All Works') return true
    return item.cat === selectedPortfolioCat
  })

  return (
    <div className="page-home">
      {/* =========================================================
          Clove Hero Band with Dynamic Live Status & Interactive Switcher
          ========================================================= */}
      <section className="hero-band" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            {/* Live Studio Status Pill */}
            <div className="hero-live-status">
              <span className="live-status-pulse" aria-hidden="true" />
              <span className="live-status-text">
                Studio Status: <strong>Open &amp; Fabricating</strong> &middot; Navi Mumbai &middot; Express 24h Delivery
              </span>
            </div>

            <span className="hero-eyebrow">
              <span className="hero-eyebrow__dot" aria-hidden="true" />
              VR Enterprises &middot; Craft Press &amp; Digital Studio &middot; Est. 2017
            </span>

            <h1 id="hero-title" className="hero-title">
              <em>Thoughtfully crafted</em> printing, branding &amp; digital solutions.
            </h1>

            <p className="hero-lead">
              From tactile offset stationery and luminous architectural signages to bespoke
              web applications and turnkey branding &mdash; designed, fabricated, and installed
              under one roof in Navi Mumbai.
            </p>

            {/* Dynamic Interactive Capability Tabs */}
            <div className="hero-dynamic-pill-nav" aria-label="Explore core capabilities">
              <span className="hero-dynamic-pill-label">Interactive Focus:</span>
              <div className="hero-pill-buttons">
                {heroPills.map((pill) => {
                  const isActive = pill.id === activeHeroPill.id
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      className={`hero-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveHeroPill(pill)}
                    >
                      {pill.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dynamic Pill Feature Callout */}
            <div className="hero-feature-callout animate-fade-in" key={activeHeroPill.id}>
              <div className="hero-feature-callout__top">
                <span className="hero-feature-tag">{activeHeroPill.tag}</span>
                <span className="hero-feature-badge">{activeHeroPill.pill}</span>
              </div>
              <p className="hero-feature-desc">{activeHeroPill.desc}</p>
              <Link to={activeHeroPill.link} className="hero-feature-link">
                View detailed specs &amp; examples
                <Icon name="arrow" size={14} />
              </Link>
            </div>

            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#consultation">
                Request a Custom Quote
                <Icon name="arrow" size={17} />
              </a>
              <a className="btn btn-secondary btn-lg" href="#materials">
                Explore Materials
              </a>
            </div>

            <div className="hero-proof">
              <span className="hero-proof__stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={15} />
                ))}
              </span>
              <span className="hero-proof__text">
                Rated 5.0 on Google &middot; 4,500+ Projects Delivered Across Mumbai
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <ThreeDTilt maxTilt={15} perspective={1100} scale={1.03}>
              <div className="hero-arch-frame">
                <img
                  src="/images/about/clove-hero-craft.jpg"
                  alt="Tactile printing craft and artisanal branding at VR Enterprises atelier"
                  width="800"
                  height="1000"
                  loading="eager"
                />
              </div>

              <div className="hero-badge-float" style={{ transform: 'translateZ(45px)' }}>
                <span className="hero-badge-icon" aria-hidden="true">
                  <Icon name="check" size={20} strokeWidth={2.4} />
                </span>
                <span className="hero-badge-text">
                  100% In-House Production &middot; Zero Middleman Delays
                </span>
              </div>
            </ThreeDTilt>
          </div>
        </div>
      </section>

      {/* =========================================================
          Stats Strip
          ========================================================= */}
      <section className="stats-strip" aria-label="Company Statistics">
        <div className="container stats-grid">
          {stats.slice(0, 4).map((stat, index) => (
            <div key={stat.label} className="stat-item">
              <span className="stat-number">
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  displayValue={stat.displayValue}
                  index={index}
                />
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          "Our Approach" Section (Clove Signature)
          ========================================================= */}
      <section className="approach-section" id="approach" aria-labelledby="approach-title">
        <div className="container">
          <SectionHeading
            id="approach-title"
            eyebrow="Our Approach"
            title="Providing you with a seamless space to create & scale"
            intro="A holistic, patient-centered discipline uniting tactile physical production with high-performance digital engineering."
            align="center"
          />

          <div className="approach-grid">
            {approaches.map((app) => (
              <ThreeDTilt key={app.num} maxTilt={12} scale={1.03}>
                <article className="approach-card" style={{ height: '100%' }}>
                  <span className="approach-number" style={{ transform: 'translateZ(30px)' }}>
                    {app.num}
                  </span>
                  <h3 style={{ transform: 'translateZ(20px)' }}>{app.title}</h3>
                  <p style={{ transform: 'translateZ(10px)' }}>{app.text}</p>
                </article>
              </ThreeDTilt>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          "Our Services" Grid with Dynamic Category Filter
          ========================================================= */}
      <section className="services-section" id="services" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            id="services-title"
            eyebrow="Our Services"
            title="Tailored capabilities for every dimension of your brand"
            intro="Select individual production services or hand us turnkey execution from concept to final delivery."
            align="center"
          />

          <div className="services-filter">
            <button
              type="button"
              className={`services-filter__btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Offerings
            </button>
            <button
              type="button"
              className={`services-filter__btn ${activeCategory === 'print' ? 'active' : ''}`}
              onClick={() => setActiveCategory('print')}
            >
              Creative &amp; Print
            </button>
            <button
              type="button"
              className={`services-filter__btn ${activeCategory === 'digital' ? 'active' : ''}`}
              onClick={() => setActiveCategory('digital')}
            >
              Digital &amp; Technology
            </button>
          </div>

          <div className="services-cards-grid">
            {filteredServices.map((service) => (
              <ThreeDTilt key={service.slug} maxTilt={10} scale={1.03}>
                <Link
                  to={`/services/${service.slug}`}
                  className="service-card"
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="service-card__top" style={{ transform: 'translateZ(30px)' }}>
                    <div className="service-card__icon" aria-hidden="true">
                      <Icon name={service.icon} size={22} />
                    </div>
                    <span className="service-card__badge">In-House</span>
                  </div>

                  <h3 style={{ transform: 'translateZ(20px)' }}>{service.title}</h3>
                  <p style={{ transform: 'translateZ(10px)' }}>{service.intro}</p>

                  <div className="service-card__items" style={{ transform: 'translateZ(15px)' }}>
                    {service.items.slice(0, 4).map((item) => (
                      <span key={item.name} className="service-item-chip">
                        {item.name}
                      </span>
                    ))}
                    {service.items.length > 4 && (
                      <span className="service-item-chip">
                        +{service.items.length - 4} more
                      </span>
                    )}
                  </div>

                  <span
                    className="service-card__link"
                    style={{ transform: 'translateZ(20px)', marginTop: 'auto' }}
                  >
                    Explore service
                    <Icon name="arrow" size={15} />
                  </span>
                </Link>
              </ThreeDTilt>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          "The Atelier & Workshop" Space Showcase
          ========================================================= */}
      <section className="atelier-section" aria-labelledby="atelier-title">
        <div className="container atelier-grid">
          <div className="atelier-photo">
            <ThreeDTilt maxTilt={10} scale={1.02}>
              <img
                src="/images/about/clove-workshop-space.jpg"
                alt="VR Enterprises design studio and signage fabrication workshop"
                width="800"
                height="600"
                loading="lazy"
              />
            </ThreeDTilt>
          </div>

          <div className="atelier-content">
            <span className="section-eyebrow">The Atelier</span>
            <h2 id="atelier-title">A sanctuary for precision craft and modern fabrication</h2>
            <p>
              Located in Sector-5, Ghansoli, our studio brings together state-of-the-art
              machinery and master craftsmen. From delicate gold foil embossing to heavy-duty
              architectural LED signages, we inspect every detail before it leaves our floor.
            </p>

            <div className="atelier-specs">
              <div className="atelier-spec-item">
                <strong>Heidelberg Offset</strong>
                <span>High-volume publications, corporate brochures &amp; luxury boxes</span>
              </div>
              <div className="atelier-spec-item">
                <strong>Roland UV &amp; Latex</strong>
                <span>Weather-resistant storefronts, translits &amp; vinyl displays</span>
              </div>
              <div className="atelier-spec-item">
                <strong>CNC Laser Routing</strong>
                <span>Sub-millimeter acrylic &amp; metal 3D letter cutting</span>
              </div>
              <div className="atelier-spec-item">
                <strong>Eco-Solvent Inks</strong>
                <span>Vibrant, fade-resistant color matching with archival safety</span>
              </div>
            </div>

            <div>
              <a
                className="btn btn-secondary"
                href={googleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan a Studio Visit
                <Icon name="arrow" size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DYNAMIC INTERACTIVE COMPONENT 1: Material & Finish Explorer
          ========================================================= */}
      <MaterialExplorer />


      {/* =========================================================
          "Selected Works" Portfolio Gallery with Dynamic Lightbox
          ========================================================= */}
      <section className="portfolio-band" id="portfolio" aria-labelledby="portfolio-title">
        <div className="container">
          <SectionHeading
            id="portfolio-title"
            eyebrow="Selected Works"
            title="Recent projects from our studio &amp; press"
            intro="Explore our craft across stationery, packaging, signages, and digital design. Click any project for specs and sample preview."
            align="center"
          />

          {/* Interactive Portfolio Filter */}
          <div className="portfolio-cat-filter" role="tablist" aria-label="Portfolio filters">
            {portfolioCategories.map((cat) => {
              const isActive = cat === selectedPortfolioCat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`portfolio-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedPortfolioCat(cat)}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="portfolio-grid">
            {filteredPortfolio.map((item) => (
              <ThreeDTilt key={item.title} maxTilt={12} scale={1.03}>
                <div
                  className="portfolio-card portfolio-card--clickable"
                  onClick={() => setActiveLightbox(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveLightbox(item)
                    }
                  }}
                  aria-label={`View details for ${item.title}`}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="portfolio-card__img" style={{ transform: 'translateZ(15px)' }}>
                    <img src={item.src} alt={item.alt} loading="lazy" />
                    <span className="portfolio-card__overlay-btn">
                      <Icon name="eye" size={18} />
                      <span>Quick Preview</span>
                    </span>
                  </div>
                  <div
                    className="portfolio-card__info"
                    style={{ transform: 'translateZ(25px)', flex: 1 }}
                  >
                    <div className="portfolio-card__topline">
                      <span className="portfolio-card__cat">{item.cat}</span>
                      <span className="portfolio-card__time">
                        <Icon name="clock" size={12} />
                        {item.turnaround}
                      </span>
                    </div>
                    <h3 className="portfolio-card__title">{item.title}</h3>
                    <p className="portfolio-card__specs-preview">{item.specs}</p>
                  </div>
                </div>
              </ThreeDTilt>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link className="btn btn-primary" to="/portfolio">
              View Complete 100+ Project Portfolio
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio Lightbox Modal */}
      {activeLightbox && (
        <div
          className="portfolio-lightbox-overlay"
          onClick={() => setActiveLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeLightbox.title}
        >
          <div
            className="portfolio-lightbox-card animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="portfolio-lightbox-close"
              onClick={() => setActiveLightbox(null)}
              aria-label="Close project modal"
            >
              <Icon name="close" size={20} />
            </button>

            <div className="portfolio-lightbox-grid">
              <div className="portfolio-lightbox-image-wrap">
                <img src={activeLightbox.src} alt={activeLightbox.alt} />
              </div>

              <div className="portfolio-lightbox-content">
                <span className="portfolio-lightbox-cat">{activeLightbox.cat}</span>
                <h3 className="portfolio-lightbox-title">{activeLightbox.title}</h3>

                <div className="portfolio-lightbox-spec-item">
                  <strong>Specifications &amp; Finishes:</strong>
                  <p>{activeLightbox.specs}</p>
                </div>

                <div className="portfolio-lightbox-spec-item">
                  <strong>Production Turnaround:</strong>
                  <p>{activeLightbox.turnaround}</p>
                </div>

                <div className="portfolio-lightbox-spec-item">
                  <strong>Fabrication Location:</strong>
                  <p>In-House Ghansoli Atelier, Navi Mumbai</p>
                </div>

                <div className="portfolio-lightbox-actions">
                  <a
                    className="btn btn-primary"
                    href={`https://wa.me/919930281240?text=Hi%20VR%20Enterprises,%20I%20saw%20the%20${encodeURIComponent(activeLightbox.title)}%20(${encodeURIComponent(activeLightbox.cat)})%20on%20your%20website%20and%20would%20like%20a%20similar%20quote.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Inquire About This Style on WhatsApp
                    <Icon name="arrow" size={16} />
                  </a>
                  <a
                    className="btn btn-secondary"
                    href="#consultation"
                    onClick={() => setActiveLightbox(null)}
                  >
                    Request Custom Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          "Meet the Team" Section (Clove Team Grid)
          ========================================================= */}
      <section className="team-section" aria-labelledby="team-title">
        <div className="container">
          <SectionHeading
            id="team-title"
            eyebrow="Meet the Craftspeople"
            title="The experienced team behind your brand execution"
            intro="Our multidisciplinary leadership blends decades of production craftsmanship with modern software engineering."
            align="center"
          />

          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name} className="team-card">
                <div className="team-avatar">
                  <img src={member.img} alt={member.alt} loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">
                  Dedicated to delivering exceptional quality, personalized attention, and
                  reliable timelines on every single project.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          Testimonials & Google 5.0 Rating (Clove Style)
          ========================================================= */}
      <Reviews />

      {/* =========================================================
          Trusted By Clients Marquee
          ========================================================= */}
      <TrustedBy />

      {/* =========================================================
          DYNAMIC INTERACTIVE COMPONENT 3: Frequently Asked Questions Accordion
          ========================================================= */}
      <FaqSection />

      {/* =========================================================
          Interactive Consultation & Quote Request (Clove Form)
          ========================================================= */}
      {/* =========================================================
          Interactive Consultation & Quote Request (Atelier Suite)
          ========================================================= */}
      <section className="consultation-studio-band" id="consultation" aria-labelledby="quote-title">
        <div className="container consultation-studio-grid">
          {/* Left Column: Studio Atelier & Direct Desk */}
          <Reveal className="consultation-info-col">
            <span className="section-eyebrow">Get In Touch</span>
            <h2 id="quote-title" className="consultation-title">
              Book a consultation or request a quote
            </h2>
            <p className="consultation-lead">
              Tell us about your upcoming project. Our atelier team will review your requirements
              and provide personalized recommendations with estimated timelines within 24 hours.
            </p>

            {/* Atelier Trust & Scope Pillars */}
            <div className="consultation-pillars">
              <div className="consultation-pillar">
                <span className="pillar-icon" aria-hidden="true">
                  <Icon name="clock" size={20} />
                </span>
                <div className="pillar-body">
                  <strong>24-Hour Scope &amp; Itemized Estimates</strong>
                  <p>Detailed cost breakdown, production timelines, and material specs.</p>
                </div>
              </div>

              <div className="consultation-pillar">
                <span className="pillar-icon" aria-hidden="true">
                  <Icon name="sparkle" size={20} />
                </span>
                <div className="pillar-body">
                  <strong>Physical Material &amp; Finish Guidance</strong>
                  <p>Paper stocks, vinyl swatches, metal finishes, and structural proofs.</p>
                </div>
              </div>

              <div className="consultation-pillar">
                <span className="pillar-icon" aria-hidden="true">
                  <Icon name="shield" size={20} />
                </span>
                <div className="pillar-body">
                  <strong>Zero-Obligation Atelier Review</strong>
                  <p>Direct architectural, branding, and technical feasibility guidance.</p>
                </div>
              </div>
            </div>

            {/* Direct Studio Desk Card */}
            <div className="consultation-direct-card">
              <div className="direct-card-head">
                <span className="direct-status-dot" aria-hidden="true" />
                <span className="direct-status-label">Studio Direct Desk &bull; Ghansoli Atelier</span>
              </div>
              <div className="direct-card-channels">
                <a className="direct-channel-item" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  <Icon name="phone" size={16} />
                  <span>{contact.phone}</span>
                </a>
                <a className="direct-channel-item" href={contactEmailHref()}>
                  <Icon name="mail" size={16} />
                  <span>{contact.email}</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Redesigned Consultation Card */}
          <Reveal className="consultation-form-col" delay={0.12}>
            <div className="consultation-form-card">
              <div className="form-card-header">
                <span className="form-card-badge">✦ Project Specifications</span>
                <h3 className="form-card-title">Share your requirements</h3>
                <p className="form-card-sub">Choose a service and outline your vision below.</p>
              </div>

              <EnquiryForm
                submitLabel="Request Free Consultation &amp; Quote"
                className="enq-card--embedded"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          Clove Closing Call-To-Action Band (Deep Forest Olive)
          ========================================================= */}
      <section className="cta-band" aria-labelledby="cta-heading">
        <div className="container cta-panel">
          <div className="cta-copy">
            <h2 id="cta-heading">Get started with VR Enterprises, today.</h2>
            <p>
              Take the first step toward lasting brand presence. Request free material samples,
              visit our Ghansoli atelier, or speak directly with our production specialists.
            </p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-light btn-lg" href="#consultation">
              Book a Consultation
              <Icon name="arrow" size={17} />
            </a>
            <a
              className="btn btn-ghost btn-lg"
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
            >
              <Icon name="phone" size={17} />
              Call {contact.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
