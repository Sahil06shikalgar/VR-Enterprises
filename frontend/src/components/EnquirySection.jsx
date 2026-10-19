import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import EnquiryForm from './EnquiryForm.jsx'
import { contact, contactEmailHref } from '../data/contact.js'

/*
 * Premium two-column enquiry section: a business/contact panel on the left and
 * the enquiry form card on the right. Copy is factual company information only.
 */
const reassurances = [
  {
    icon: 'compass',
    title: 'Clear consultation',
    text: 'We understand your goal first, then recommend the right approach.',
  },
  {
    icon: 'sparkle',
    title: 'Customized solutions',
    text: 'Every plan is tailored to your brand, timeline, and budget.',
  },
  {
    icon: 'shield',
    title: 'Transparent communication',
    text: 'Clear scope and updates at every step of the project.',
  },
]

function EnquirySection({
  defaultService = '',
  showHead = true,
  eyebrow = "Let's Connect",
  heading = 'Start your brand transformation',
  intro = 'Tell us what you need, and our team will help you plan the right creative, print, branding, or technology solution.',
}) {
  return (
    <section className="enq-section" {...(showHead ? { 'aria-labelledby': 'enq-section-title' } : { 'aria-label': 'Enquiry section' })}>
      <div className="container enq-section__grid">
        <Reveal className="enq-info">
          {showHead ? (
            <>
              <span className="section-eyebrow">{eyebrow}</span>
              <h2 id="enq-section-title" className="enq-info__title">
                {heading}
              </h2>
              <p className="enq-info__lead">{intro}</p>
            </>
          ) : null}

          <ul className="enq-contacts">
            <li>
              <span className="enq-contact-icon" aria-hidden="true">
                <Icon name="phone" size={18} />
              </span>
              <div className="enq-contact-body">
                <span className="enq-contact-label">Call us</span>
                <a className="enq-contact-value" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  {contact.phone}
                </a>
              </div>
            </li>
            <li>
              <span className="enq-contact-icon" aria-hidden="true">
                <Icon name="mail" size={18} />
              </span>
              <div className="enq-contact-body">
                <span className="enq-contact-label">Email</span>
                <a className="enq-contact-value" href={contactEmailHref()}>
                  {contact.email}
                </a>
              </div>
            </li>
            <li>
              <span className="enq-contact-icon" aria-hidden="true">
                <Icon name="clock" size={18} />
              </span>
              <div className="enq-contact-body">
                <span className="enq-contact-label">Office hours</span>
                <span className="enq-contact-value">{contact.hours}</span>
              </div>
            </li>
          </ul>

          <p className="enq-response">
            <Icon name="check" size={16} strokeWidth={2.4} />
            <span>We usually respond within 24 business hours.</span>
          </p>

          <ul className="enq-reassure">
            {reassurances.map((item) => (
              <li key={item.title} className="enq-reassure__item">
                <span className="enq-reassure__icon" aria-hidden="true">
                  <Icon name={item.icon} size={18} />
                </span>
                <div className="enq-reassure__body">
                  <strong className="enq-reassure__title">{item.title}</strong>
                  <span className="enq-reassure__text">{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="enq-section__form" delay={0.12}>
          <EnquiryForm defaultService={defaultService} />
        </Reveal>
      </div>
    </section>
  )
}

export default EnquirySection
