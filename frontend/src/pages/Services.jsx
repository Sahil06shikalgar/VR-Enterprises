import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Icon from '../components/Icon.jsx'
import { servicesBySlug } from '../data/services.js'
import { serviceGroups } from '../data/company.js'

const groups = serviceGroups.map((group) => ({
  ...group,
  items: group.slugs.map((slug) => servicesBySlug[slug]).filter(Boolean),
}))

function ServiceVisual({ service }) {
  if (service.viz.type === 'video') {
    return (
      <video
        className="svc-illus"
        src={service.viz.src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${service.label} showreel`}
      />
    )
  }
  return (
    <img
      className="svc-illus"
      loading="lazy"
      decoding="async"
      src={service.viz.src}
      alt={service.viz.alt}
      width="1280"
      height="640"
    />
  )
}

function Services() {
  return (
    <div className="page-services">
      <PageHero
        breadcrumb="Services"
        eyebrow="Our Services"
        title="Creative & technology solutions under one roof"
        intro="Nine official services across two disciplines — creative & print, and digital & technology — delivered end-to-end by one team."
        documentTitle="Services"
        description="Explore the nine official services of VR Enterprises: designing, printing, branding, signages, video creation, digital marketing, website development & AMC, app development, and software development."
      />

      <div className="svc-overview">
        {groups.map((group) => (
          <section
            key={group.id}
            className="svc-overview-group"
            aria-labelledby={`svc-group-${group.id}`}
          >
            <div className="container">
              <Reveal>
                <SectionHeading
                  id={`svc-group-${group.id}`}
                  eyebrow={group.eyebrow}
                  title={group.title}
                  intro={group.blurb}
                />
              </Reveal>

              <div className="svc-grid">
                {group.items.map((service, index) => (
                  <Reveal key={service.slug} delay={(index % 3) * 0.08}>
                    <Link className="svc-card" to={`/services/${service.slug}`}>
                      <div className="svc-card__visual">
                        <ServiceVisual service={service} />
                      </div>
                      <div className="svc-card__content">
                        <h3>{service.label}</h3>
                        <p>{service.intro}</p>
                        <span className="svc-card__action">
                          Learn More
                          <Icon name="arrow" size={15} />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <CtaBand
        title="Not sure which service you need?"
        text="Share your requirement and we will recommend the right mix of print, branding, and digital services for your goals."
        secondaryLabel="See Our Work"
        secondaryTo="/portfolio"
      />
    </div>
  )
}

export default Services
