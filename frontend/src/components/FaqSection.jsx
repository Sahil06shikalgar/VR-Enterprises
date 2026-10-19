import { useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import Icon from './Icon.jsx'

const faqs = [
  {
    q: 'Can I visit your Ghansoli atelier to touch and feel physical paper and signage samples?',
    a: 'Absolutely! Our studio is located at 2nd Floor, Plot No. 79, Sector-5, Ghansoli, Navi Mumbai. We keep swatch books of 50+ imported paper stocks, foil stamping foils, acrylic thicknesses, and LED brightness samples so you can see and feel everything before placing your order.',
  },
  {
    q: 'What is your standard turnaround time for printing and architectural signages?',
    a: 'Standard digital printing (visiting cards, flyers, menus) takes 24 to 48 hours. Bulk offset printing takes 2 to 4 working days. Custom 3D acrylic LED signages and structural box packaging typically require 3 to 6 working days from final artwork approval.',
  },
  {
    q: 'Do you provide on-site installation for retail signages across Mumbai and Navi Mumbai?',
    a: 'Yes. Our experienced in-house installation crew handles complete on-site mounting, electrical cabling, ACP cladding, and safety compliance across Ghansoli, Vashi, Belapur, Thane, and greater Mumbai.',
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHeading
          id="faq-title"
          eyebrow="Questions & Answers"
          title="Frequently Asked Questions"
          intro="Everything you need to know about production timelines, material proofs, and studio collaboration."
          align="center"
        />

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-icon-wrapper" aria-hidden="true">
                    <Icon name={isOpen ? 'close' : 'chevron'} size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="faq-bottom-cta">
          <p>Have a custom requirement not listed here?</p>
          <a
            className="btn btn-outline"
            href="https://wa.me/919930281240?text=Hi%20VR%20Enterprises,%20I%20have%20a%20question%20about%20a%20custom%20project."
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask Us Directly on WhatsApp
            <Icon name="arrow" size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
