import PageHero from '../components/PageHero.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import LazyMap from '../components/LazyMap.jsx'
import Icon from '../components/Icon.jsx'
import { contact, contactEmailHref, directionsUrl, mapEmbedSrc } from '../data/contact.js'

function ContactUs() {
  const mapSrc = mapEmbedSrc()
  const dirsHref = directionsUrl()

  return (
    <div className="page-contact">
      <PageHero
        breadcrumb="Contact Us"
        eyebrow="Let's Connect"
        title="Start Your Project"
        intro="Whether you want a bulk printing cost sheet, a detailed catalog redesign plan, or want to discuss custom CRM/web setups, submit your details. Our team will get back to you within 24 business hours."
        documentTitle="Contact Us"
        description="Contact VR Enterprises in Ghansoli, Navi Mumbai — call +91 99302 81240, email sales@thevrenterprises.com, or send us a quote request. Open Monday to Saturday, 10 AM to 6 PM."
      />

      <section className="contact-section" aria-label="Contact details and enquiry form">
        <div className="container">
          <div className="contact-layout">
            <div
              className="contact-layout__form"
              data-gsap-animate
              data-gsap-y="30"
              data-gsap-duration="0.8"
              data-gsap-delay="0"
            >
              <EnquiryForm title="Send a Request" subtitle="We'll get back within 24 hours." />
            </div>

            <div className="contact-layout__info">
              <div
                className="contact-info"
                data-gsap-animate
                data-gsap-y="30"
                data-gsap-duration="0.8"
                data-gsap-delay="0.1"
              >
                <h2 data-gsap-animate data-gsap-y="20" data-gsap-delay="0.2" data-gsap-duration="0.6">Office Address</h2>
                <ul className="info-list">
                  <li data-gsap-animate data-gsap-y="20" data-gsap-delay="0.3" data-gsap-duration="0.6">
                    <span className="info-icon" aria-hidden="true">
                      <Icon name="pin" size={18} />
                    </span>
                    <span>{contact.address}</span>
                  </li>
                </ul>

                <h2 data-gsap-animate data-gsap-y="20" data-gsap-delay="0.35" data-gsap-duration="0.6">Call Us Directly</h2>
                <ul className="info-list">
                  <li data-gsap-animate data-gsap-y="20" data-gsap-delay="0.4" data-gsap-duration="0.6">
                    <span className="info-icon" aria-hidden="true">
                      <Icon name="phone" size={18} />
                    </span>
                    <a className="contact-link" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                      {contact.phone}
                    </a>
                  </li>
                </ul>

                <h2 data-gsap-animate data-gsap-y="20" data-gsap-delay="0.45" data-gsap-duration="0.6">Send Email</h2>
                <ul className="info-list">
                  <li data-gsap-animate data-gsap-y="20" data-gsap-delay="0.5" data-gsap-duration="0.6">
                    <span className="info-icon" aria-hidden="true">
                      <Icon name="mail" size={18} />
                    </span>
                    <a className="contact-link" href={contactEmailHref()}>
                      {contact.email}
                    </a>
                  </li>
                  <li data-gsap-animate data-gsap-y="20" data-gsap-delay="0.55" data-gsap-duration="0.6">
                    <span className="info-icon" aria-hidden="true">
                      <Icon name="mail" size={18} />
                    </span>
                    <a className="contact-link" href={`mailto:${contact.emailAlt}`}>
                      {contact.emailAlt}
                    </a>
                  </li>
                </ul>

                <h2 data-gsap-animate data-gsap-y="20" data-gsap-delay="0.6" data-gsap-duration="0.6">Business Hours</h2>
                <ul className="info-list">
                  <li data-gsap-animate data-gsap-y="20" data-gsap-delay="0.65" data-gsap-duration="0.6">
                    <span className="info-icon" aria-hidden="true">
                      <Icon name="clock" size={18} />
                    </span>
                    <span>{contact.hours}</span>
                  </li>
                </ul>

                <h2 data-gsap-animate data-gsap-y="20" data-gsap-delay="0.7" data-gsap-duration="0.6">Connect With Us</h2>
                <SocialLinks />
              </div>

              <div
                className="contact-map-wrap"
                data-gsap-animate
                data-gsap-y="30"
                data-gsap-duration="0.8"
                data-gsap-delay="0.2"
              >
                <div className="contact-map-header">
                  <div>
                    <h3 className="contact-map-title">Atelier &amp; Studio Location</h3>
                    <p className="contact-map-sub">Sector-5, Ghansoli, Navi Mumbai</p>
                  </div>
                  <span className="contact-map-badge">
                    <Icon name="pin" size={14} />
                    <span>Visits Welcome</span>
                  </span>
                </div>

                <LazyMap src={mapSrc} title="Map to VR Enterprises, Ghansoli, Navi Mumbai" />

                <a
                  className="find-dir"
                  href={dirsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="compass" size={16} />
                  <span>Get Directions on Google Maps</span>
                  <Icon name="arrow" size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs