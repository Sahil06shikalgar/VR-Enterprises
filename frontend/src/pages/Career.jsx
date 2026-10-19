import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Icon from '../components/Icon.jsx'
import CareerForm from '../components/CareerForm.jsx'
import { team } from '../data/team.js'

function Career() {
  return (
    <div className="page-career">
      <PageHero
        breadcrumb="Career"
        eyebrow="Career"
        title="Work with VR Enterprises"
        intro="We are a growing design and technology studio in Ghansoli, Navi Mumbai. If you would like to be part of our team, get in touch — we are always happy to speak with talented people."
        documentTitle="Career"
        description="Build your career with VR Enterprises — a growing creative and technology studio in Ghansoli, Navi Mumbai."
      />

      <section className="career-band" aria-labelledby="career-title">
        <div className="container career-grid">
          <Reveal className="career-copy">
            <SectionHeading
              id="career-title"
              eyebrow="About working with us"
              title="A full-service team under one roof"
            />
            <p>
              Established in 2017, VR Enterprises brings together creative design
              thinking and technical expertise to deliver end-to-end solutions —
              from brand identity and print collaterals to signages, video
              creation, digital marketing, websites, apps, and custom business
              software.
            </p>
            <p>
              Today we serve 450+ happy clients across 15+ industries and 3
              countries, delivering premium, customized work with a focus on
              quality, transparency, and on-time delivery.
            </p>
            <p>
              Our leadership team includes Founder Rajesh Yadav (Judicious),
              Co-Founder Asha Kutty (Passionate), and Technical Partner Rohit
              Jadhav.
            </p>
            <div className="career-actions">
              <a className="btn btn-primary" href="#career-apply">
                Share your profile
                <Icon name="arrow" size={17} />
              </a>
              <Link className="btn btn-outline" to="/contact-us">
                Contact Us
              </Link>
            </div>
          </Reveal>

          <div className="career-team">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.1}>
                <div className="career-team__card">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={member.img}
                    alt={member.alt}
                    width="88"
                    height="88"
                  />
                  <div>
                    <strong>{member.name}</strong>
                    <span>
                      {member.role}
                      {member.trait ? ` · ${member.trait}` : ''}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="career-apply" id="career-apply" aria-labelledby="career-apply-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="career-apply-title"
              eyebrow="Apply"
              title="Send us your application"
              intro="Tell us about yourself and attach your résumé. We review every application and reach out if there is a fit."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="career-apply__form">
              <CareerForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="career-cta" aria-labelledby="career-cta-title">
        <div className="container">
          <Reveal>
            <div className="career-cta__panel">
              <h2 id="career-cta-title">Prefer to introduce yourself in person?</h2>
              <p>
                Visit our office in Ghansoli, Navi Mumbai — we are open Monday to
                Saturday, 10:00 AM to 6:00 PM.
              </p>
              <Link className="btn btn-light" to="/contact-us">
                Find our office
                <Icon name="arrow" size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Career