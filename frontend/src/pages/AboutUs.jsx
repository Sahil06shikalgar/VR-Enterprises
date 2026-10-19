import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import WhyBento from '../components/WhyBento.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import MediaFrame from '../components/MediaFrame.jsx'
import Reviews from '../components/Reviews.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Icon from '../components/Icon.jsx'
import AnimatedStat from '../components/AnimatedStat.jsx'
import { stats, story } from '../data/company.js'
import { team, officePhoto } from '../data/team.js'
import { appreciationLetters } from '../data/reviews.js'

function AboutUs() {
  return (
    <div className="page-about">
      <PageHero
        breadcrumb="About Us"
        eyebrow="About VR Enterprises"
        title="Your reliable creative & technology solutions company"
        intro="Headquartered in Navi Mumbai, VR Enterprises is a full-service creative and technology solutions company."
        documentTitle="About Us"
        description="Learn about VR Enterprises — a Navi Mumbai based creative and technology solutions company established in 2017, offering design, printing, branding, and software services under one roof."
      />

      <section className="story-band" aria-labelledby="story-title">
        <div className="container story-grid">
          <div className="story-content" data-gsap-animate data-gsap-y="30" data-gsap-duration="0.8">
            <SectionHeading id="story-title" eyebrow={story.eyebrow} title={story.title} />
            {story.paragraphs.map((para, i) => (
              <p key={para.slice(0, 24)} data-gsap-animate data-gsap-y="20" data-gsap-delay={0.1 + i * 0.08} data-gsap-duration="0.6">{para}</p>
            ))}
            <div className="story-actions" data-gsap-animate data-gsap-y="20" data-gsap-delay="0.3" data-gsap-duration="0.6">
              <Link className="btn btn-primary" to="/services">
                Explore Our Services
                <Icon name="arrow" size={17} />
              </Link>
              <Link className="btn btn-outline" to="/contact-us">
                Get a Quote
              </Link>
            </div>
          </div>

          <div className="story-media" data-gsap-animate data-gsap-delay="0.1" data-gsap-y="30" data-gsap-duration="0.8">
            <MediaFrame
              variant="panel"
              fit="cover"
              position="center"
              src={officePhoto.src}
              alt={officePhoto.alt}
              width="1092"
              height="1415"
              reveal={false}
            />
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="VR Enterprises in numbers">
        <div className="container">
          <div className="stats-grid" data-gsap-animate data-gsap-y="30" data-gsap-duration="0.8">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                displayValue={stat.displayValue}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <WhyBento />

      <section className="team-band" aria-labelledby="team-title">
        <div className="container">
          <div data-gsap-animate data-gsap-y="30" data-gsap-duration="0.8">
            <SectionHeading
              id="team-title"
              eyebrow="Leadership & Management Team"
              title="The people who lead our work"
              align="center"
            />
          </div>

          <div className={`team-grid team-grid--${team.length}`}>
            {team.map((member, index) => (
              <article
                key={member.name}
                className="team-card"
                data-gsap-animate
                data-gsap-y="30"
                data-gsap-duration="0.8"
                data-gsap-delay={index * 0.1}
              >
                <div className="team-card__photo" data-gsap-image-reveal data-gsap-scale="1.06">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={member.img}
                    alt={member.alt}
                    width="400"
                    height="400"
                  />
                </div>
                <div className="team-card__body">
                  <h3>{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  {member.trait ? <span className="team-card__trait">{member.trait}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="letters-band" aria-labelledby="letters-title">
        <div className="container">
          <div data-gsap-animate data-gsap-y="30" data-gsap-duration="0.8">
            <SectionHeading
              id="letters-title"
              eyebrow="Testimonials & Letters"
              title="Appreciation from our clients"
              intro="Letters of appreciation from clients we have partnered with over the years."
              align="center"
            />
          </div>

          <div className="letters-grid">
            {appreciationLetters.map((letter, index) => (
              <figure
                key={letter.name}
                className="letter-card"
                data-gsap-animate
                data-gsap-y="30"
                data-gsap-duration="0.8"
                data-gsap-delay={index * 0.1}
              >
                <div className="letter-card__media" data-gsap-image-reveal data-gsap-scale="1.06">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={letter.src}
                    alt={letter.alt}
                    width="800"
                    height="566"
                  />
                </div>
                <figcaption>{letter.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <CtaBand
        title="Let's build your brand together"
        text="Whether it is print, branding, signage, or a full digital platform — tell us what you need and we will take it from there."
      />
    </div>
  )
}

export default AboutUs
