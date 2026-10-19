import { Link, Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import EnquirySection from '../components/EnquirySection.jsx'
import Icon from '../components/Icon.jsx'
import { services, servicesBySlug } from '../data/services.js'

function ServicePage() {
  const { slug } = useParams()
  const service = servicesBySlug[slug]

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const isVideoService = service.viz.type === 'video'

  return (
    <div className="page-service">
      <PageHero
        breadcrumb={service.label}
        eyebrow="Our Services"
        title={service.label}
        intro={service.intro}
        documentTitle={service.label}
        description={`${service.intro} Talk to VR Enterprises for ${service.label.toLowerCase()} services in Navi Mumbai.`}
      />

      <section className="svc-detail" aria-labelledby="svc-detail-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="svc-detail-title"
              eyebrow="What we offer"
              title={`${service.label} — delivered for your brand`}
              intro={service.intro}
              align="center"
            />
          </Reveal>

          <div className={`svc-items${isVideoService ? ' svc-items--videos' : ''}`}>
            {service.items.map((item, index) => (
              <Reveal key={item.name} delay={(index % 4) * 0.06}>
                {isVideoService ? (
                  <figure className="svc-item">
                    <div className="svc-item__media svc-item__media--video">
                      <video
                        src={`/videos/${item.video}.mp4`}
                        controls
                        preload="metadata"
                        playsInline
                      />
                    </div>
                    <figcaption>{item.name}</figcaption>
                  </figure>
                ) : item.img ? (
                  <figure className="svc-item">
                    <div className="svc-item__media">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={`/images/services/${service.slug}/${item.img}.webp`}
                        alt={`${item.name} — ${service.label} by VR Enterprises`}
                        width="1280"
                        height="640"
                      />
                    </div>
                    <figcaption>{item.name}</figcaption>
                  </figure>
                ) : (
                  <div className="svc-item svc-item--plain">
                    <span className="svc-item__chip">{item.name}</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection
        defaultService={service.slug}
        intro={`Tell us what you need for ${service.label.toLowerCase()} and our team will get back to you within 24 business hours.`}
      />

      <section className="svc-more-band" aria-labelledby="svc-more-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="svc-more-title"
              eyebrow="Related services"
              title="Explore more services"
              align="center"
            />
          </Reveal>

          <div className="svc-more-grid">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 6)
              .map((s, index) => (
                <Reveal key={s.slug} delay={index * 0.06} className="svc-more-item">
                  <Link className="svc-more-card" to={`/services/${s.slug}`}>
                    <div className="svc-more-card__left">
                      <span className="svc-more-card__icon" aria-hidden="true">
                        <Icon name={s.icon} size={20} />
                      </span>
                      <span className="svc-more-card__label">{s.label}</span>
                    </div>
                    <span className="svc-more-card__arrow" aria-hidden="true">
                      <Icon name="arrow" size={16} />
                    </span>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicePage