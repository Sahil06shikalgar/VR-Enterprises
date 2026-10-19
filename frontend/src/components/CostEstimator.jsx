import { useState } from 'react'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

const serviceOptions = [
  {
    id: 'cards',
    name: 'Visiting Cards & Stationery',
    icon: 'badge',
    turnaround: '24–48 Hours',
    basePrice: '₹450',
    unitText: 'per 100 premium cards',
    deliverables: ['Custom layout design', '350 GSM Art card stock', 'Matte or Gloss thermal lamination', 'Doorstep delivery'],
    finishOptions: [
      { id: 'matte', name: 'Thermal Matte Lamination', add: 'Included' },
      { id: 'velvet', name: 'Velvet Touch Soft Coat', add: '+₹250' },
      { id: 'foil', name: 'Thermal Gold Foil Stamping', add: '+₹400' },
      { id: 'spotuv', name: 'Raised 3D Spot UV', add: '+₹350' },
    ],
  },
  {
    id: 'signage',
    name: '3D LED Architectural Signage',
    icon: 'box',
    turnaround: '3–5 Days',
    basePrice: '₹4,500',
    unitText: 'starter shopfront fascia',
    deliverables: ['On-site laser measurement', 'Laser CNC cut cast acrylic', 'Weatherproof IP67 LED modules', 'Professional on-site installation'],
    finishOptions: [
      { id: 'acrylic', name: 'Solid Cast Acrylic (Front-Lit)', add: 'Included' },
      { id: 'halo', name: 'Backlit Halo Glow (Warm/Cool)', add: '+₹1,200' },
      { id: 'brass', name: 'Brushed Brass Metal Face', add: '+₹2,200' },
      { id: 'acp', name: 'Heavy-Duty ACP Cladding Panel', add: '+₹1,800' },
    ],
  },
  {
    id: 'brochures',
    name: 'Corporate Brochures & Catalogs',
    icon: 'printer',
    turnaround: '2–3 Days',
    basePrice: '₹1,800',
    unitText: 'for 100 multi-page booklets',
    deliverables: ['High-res digital proofing', '170–300 GSM imported art paper', 'Center pin or perfect binding', 'Sharp color calibrated offset'],
    finishOptions: [
      { id: 'standard', name: 'Standard Gloss Finish', add: 'Included' },
      { id: 'covermatte', name: 'Heavy Cover Matte Lamination', add: '+₹300' },
      { id: 'foiltitle', name: 'Foil Stamped Title on Cover', add: '+₹600' },
      { id: 'crease', name: 'Gatefold / Die-cut Reveal', add: '+₹500' },
    ],
  },
  {
    id: 'packaging',
    name: 'Custom Product Packaging & Boxes',
    icon: 'sparkle',
    turnaround: '4–6 Days',
    basePrice: '₹3,200',
    unitText: 'starter batch of 100 boxes',
    deliverables: ['Dieline structural design', 'Food-grade & rigid board options', 'High-definition offset print', 'Custom die-cutting & creasing'],
    finishOptions: [
      { id: 'mattebox', name: 'Matte Lamination Wrap', add: 'Included' },
      { id: 'window', name: 'Transparent PVC Product Window', add: '+₹400' },
      { id: 'metallic', name: 'Metallic Foil Stamped Logo', add: '+₹750' },
      { id: 'magnetic', name: 'Rigid Box Magnetic Closure', add: '+₹1,400' },
    ],
  },
  {
    id: 'digital',
    name: 'Modern Website & Web Portal',
    icon: 'globe',
    turnaround: '7–10 Days',
    basePrice: '₹14,999',
    unitText: 'turnkey business website',
    deliverables: ['Custom UI design (no templates)', 'Fast responsive mobile experience', 'SEO & Google Maps setup', '1 Year Free Technical AMC'],
    finishOptions: [
      { id: 'standardweb', name: '5-Page Corporate Web App', add: 'Included' },
      { id: 'ecom', name: 'Online Store & Payment Gateway', add: '+₹8,000' },
      { id: 'crm', name: 'Custom Lead Management Dashboard', add: '+₹6,500' },
      { id: 'seo', name: 'Local Search Optimization (GMB)', add: '+₹3,500' },
    ],
  },
]

const quantities = [
  { id: 'small', label: 'Express Starter Run', multiplier: 1, note: 'Ideal for startups & urgent launches' },
  { id: 'medium', label: 'Growth Standard Batch', multiplier: 1.8, note: 'Best balance of cost and volume' },
  { id: 'large', label: 'Bulk Corporate Enterprise', multiplier: 3.2, note: 'Lowest cost per unit + priority dispatch' },
]

function CostEstimator() {
  const [selectedServiceId, setSelectedServiceId] = useState('cards')
  const [selectedQuantityId, setSelectedQuantityId] = useState('small')
  const [selectedFinishes, setSelectedFinishes] = useState(['matte'])

  const service = serviceOptions.find((s) => s.id === selectedServiceId) || serviceOptions[0]
  const quantity = quantities.find((q) => q.id === selectedQuantityId) || quantities[0]

  const toggleFinish = (finishId) => {
    setSelectedFinishes((prev) =>
      prev.includes(finishId)
        ? prev.filter((id) => id !== finishId)
        : [...prev, finishId]
    )
  }

  const whatsappMessage = encodeURIComponent(
    `Hello VR Enterprises! I estimated a project on your website:\n\n• Service: ${service.name}\n• Batch: ${quantity.label}\n• Finishes: ${selectedFinishes.join(', ')}\n• Turnaround: ${service.turnaround}\n\nPlease share the official quotation and sample details.`
  )

  return (
    <section className="estimator-section" id="estimator" aria-labelledby="estimator-title">
      <div className="container">
        <SectionHeading
          id="estimator-title"
          eyebrow="Interactive Pricing Tool"
          title="Instant Project Cost & Turnaround Estimator"
          intro="Configure your requirements below to see estimated turnaround timelines, included deliverables, and transparent starter pricing."
          align="center"
        />

        <div className="estimator-container">
          {/* Step 1: Service Type Tabs */}
          <div className="estimator-step">
            <span className="estimator-step-label">Step 1: Choose Your Core Service</span>
            <div className="estimator-services-row">
              {serviceOptions.map((s) => {
                const isSelected = s.id === selectedServiceId
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`estimator-svc-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedServiceId(s.id)
                      setSelectedFinishes([s.finishOptions[0].id])
                    }}
                  >
                    <Icon name={s.icon} size={18} />
                    <span>{s.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="estimator-main-grid">
            {/* Step 2 & 3: Configuration Column */}
            <div className="estimator-config-col">
              {/* Scale / Quantity */}
              <div className="estimator-step">
                <span className="estimator-step-label">Step 2: Select Quantity / Volume Tier</span>
                <div className="estimator-qty-grid">
                  {quantities.map((q) => {
                    const isSelected = q.id === selectedQuantityId
                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`estimator-qty-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedQuantityId(q.id)}
                      >
                        <strong>{q.label}</strong>
                        <span>{q.note}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Finishes */}
              <div className="estimator-step">
                <span className="estimator-step-label">Step 3: Select Finishes &amp; Customizations</span>
                <div className="estimator-finishes-grid">
                  {service.finishOptions.map((finish) => {
                    const isChecked = selectedFinishes.includes(finish.id)
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        className={`estimator-finish-card ${isChecked ? 'active' : ''}`}
                        onClick={() => toggleFinish(finish.id)}
                      >
                        <span className={`estimator-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Icon name="check" size={13} strokeWidth={3} />}
                        </span>
                        <div className="estimator-finish-details">
                          <span className="estimator-finish-name">{finish.name}</span>
                          <span className="estimator-finish-add">{finish.add}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="estimator-summary-col">
              <div className="estimator-summary-card">
                <div className="estimator-summary-header">
                  <span className="estimator-badge">Live Estimated Configuration</span>
                  <div className="estimator-turnaround-pill">
                    <Icon name="clock" size={15} />
                    <span>Turnaround: {service.turnaround}</span>
                  </div>
                </div>

                <h3 className="estimator-summary-title">{service.name}</h3>
                <p className="estimator-summary-sub">{quantity.label}</p>

                <div className="estimator-price-block">
                  <span className="estimator-price-starter">Starting from</span>
                  <div className="estimator-price-amount">
                    {service.basePrice}
                    <small> {service.unitText}</small>
                  </div>
                </div>

                <div className="estimator-deliverables">
                  <h4>What's Included In Every Order:</h4>
                  <ul>
                    {service.deliverables.map((item) => (
                      <li key={item}>
                        <Icon name="check" size={15} strokeWidth={2.4} />
                        <span>{item}</span>
                      </li>
                    ))}
                    <li>
                      <Icon name="check" size={15} strokeWidth={2.4} />
                      <span>Free pre-press proof check &amp; color calibration</span>
                    </li>
                  </ul>
                </div>

                <div className="estimator-actions">
                  <a
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    href={`https://wa.me/919930281240?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lock in on WhatsApp
                    <Icon name="arrow" size={16} />
                  </a>
                  <a className="btn btn-secondary" style={{ width: '100%' }} href="#consultation">
                    Request Official Written Proposal
                  </a>
                </div>

                <p className="estimator-guarantee">
                  <Icon name="shield" size={14} />
                  <span>Transparent pricing &middot; Zero hidden prepress charges</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CostEstimator
