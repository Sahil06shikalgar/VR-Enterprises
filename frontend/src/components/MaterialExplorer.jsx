import { useState } from 'react'
import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'

const materials = [
  {
    id: 'foil',
    index: '01',
    category: 'Metallic Foils',
    name: 'Thermal Gold & Copper Foil',
    badge: 'Luxury Stamping',
    headline: 'Reflective metallic brilliance that commands executive attention',
    desc: 'Precision heat-stamped foil transferred at 140°C onto 350–450 GSM velvet matte or imported cotton stocks. Creates razor-sharp micro-embossed reflective highlights that resist tarnishing, rubbing, and moisture.',
    swatches: [
      { id: 'gold', name: 'Imperial Gold 24K', hex: '#D4AF37', border: '#b89225', type: 'Mirror Gloss', desc: 'Classic 24-karat mirror luster for flagship corporate identity.' },
      { id: 'rosegold', name: 'Champagne Rose Gold', hex: '#B76E79', border: '#9e5963', type: 'Warm Satin', desc: 'Subtle blush metallic sheen favored by luxury retail & hospitality.' },
      { id: 'silver', name: 'Platinum Silver', hex: '#E5E4E2', border: '#c5c3c0', type: 'Chrome Sheen', desc: 'Ultra-crisp chrome reflection for modern tech & architecture.' },
      { id: 'copper', name: 'Burnished Copper', hex: '#B87333', border: '#995924', type: 'Warm Bronze', desc: 'Deep earthy metallic resonance for artisanal packaging.' },
      { id: 'holo', name: 'Prism Holographic', hex: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a1c4fd 100%)', border: '#c8a2c8', type: 'Prismatic Diffraction', desc: 'Dynamic rainbow color shift under direct ambient light.' },
    ],
    quickSpecs: [
      { label: 'Substrates', val: '350–450 GSM Velvet Matte & Cotton Felt' },
      { label: 'Craft Technique', val: '140°C Micro-Embossed Thermal Stamp' },
      { label: 'Turnaround', val: '24–48 Hours Express Press Dispatch' },
      { label: 'Curated For', val: 'Visiting Cards, Certificates & Luxury Tags' },
    ],
    images: [
      {
        url: '/images/portfolio/visiting-cards/visiting-cards-1.webp',
        label: 'Isometric Stack',
        alt: 'Gold foil stamped visiting cards stack by VR Enterprises',
      },
      {
        url: '/images/portfolio/visiting-cards/visiting-cards-2.webp',
        label: 'Identity Front Angle',
        alt: 'Hot stamped business card front angle by VR Enterprises',
      },
      {
        url: '/images/portfolio/visiting-cards/visiting-cards-3.webp',
        label: 'Macro Foil Emboss',
        alt: 'Detailed gold foil emboss macro photography by VR Enterprises',
      },
    ],
  },
  {
    id: 'signage',
    index: '02',
    category: '3D Signage',
    name: '3D Acrylic & Brushed Brass',
    badge: 'Architectural Craft',
    headline: 'Architectural dimension with internal IP67 LED illumination',
    desc: 'High-precision laser CNC routing on 5mm–25mm Virgin Cast acrylic, mounted onto composite ACP backing panels. Fitted with high-efficiency Samsung IP67 LEDs and weather-sealed against Navi Mumbai coastal humidity.',
    swatches: [
      { id: 'warm-led', name: 'Warm 3000K Halo', hex: '#FFE4B5', border: '#deb887', type: 'Architectural Halo', desc: 'Soft golden back-lit illumination for executive reception desks.' },
      { id: 'cool-led', name: 'Pure 6000K Ice LED', hex: '#E0FFFF', border: '#afeeee', type: 'Front-Lit Daylight', desc: 'High-visibility daylight white illumination for outdoor storefronts.' },
      { id: 'brass-face', name: 'Brushed Brass Face', hex: '#C5A059', border: '#9e7b36', type: 'Satin Metal Face', desc: 'Jewelry-grade brushed electroplated finish without glare.' },
      { id: 'gloss-black', name: 'Jet Mirror Acrylic', hex: '#1C1C1C', border: '#444444', type: 'Gloss Depth', desc: 'Deep black cast acrylic with polished beveled edges.' },
    ],
    quickSpecs: [
      { label: 'Material Core', val: '5mm–25mm Cast Acrylic & Solid Brass' },
      { label: 'Illumination', val: 'IP67 Waterproof Warm & Daylight LEDs' },
      { label: 'Durability', val: '5+ Years UV & Weather Resistance' },
      { label: 'Installation', val: 'Certified Crew Across Mumbai & MMR' },
    ],
    images: [
      {
        url: '/images/portfolio/logo-design/logos-1.webp',
        label: 'Storefront Facade',
        alt: '3D Acrylic architectural signage by VR Enterprises',
      },
      {
        url: '/images/portfolio/logo-design/logos-2.webp',
        label: 'Letter Depth Detail',
        alt: 'Precision cut acrylic letter close-up by VR Enterprises',
      },
      {
        url: '/images/portfolio/logo-design/logos-3.webp',
        label: 'Reception Halo Sign',
        alt: 'Corporate illuminated sign mounted in Mumbai office',
      },
    ],
  },
  {
    id: 'spotuv',
    index: '03',
    category: 'Tactile Relief',
    name: 'Spot UV & Raised 3D Emboss',
    badge: 'Tactile Contrast',
    headline: 'Liquid high-gloss contrast that begs to be touched',
    desc: 'Targeted polymer varnish cured instantly under ultraviolet light over thermal velvet matte lamination. Creates an unforgettable sensory contrast between silk-smooth matte paper and high-gloss 3D raised details.',
    swatches: [
      { id: 'raised-uv', name: 'High-Build 3D Raised', hex: '#688b77', border: '#466453', type: '100μm Tactile Relief', desc: 'Noticeably elevated polymer layer that creates tangible 3D texture.' },
      { id: 'flush-gloss', name: 'Flush Mirror Gloss', hex: '#a8c2b0', border: '#7c9b86', type: 'Flat Liquid Sheen', desc: 'Ultra-thin reflective polymer flush with substrate surface.' },
      { id: 'matte-velvet', name: 'Velvet Soft-Touch', hex: '#2B3831', border: '#17201c', type: 'Zero-Reflect Matte', desc: 'Silky tactile base lamination with velvet hand-feel.' },
    ],
    quickSpecs: [
      { label: 'Relief Caliper', val: 'Up to 120 Microns Raised Polymer Layer' },
      { label: 'Substrate Match', val: 'Sappi 350 GSM Velvet Soft-Touch Card' },
      { label: 'Registration', val: '0.2mm Camera-Guided Precision Alignment' },
      { label: 'Curated For', val: 'Fine Dining Menus, Lookbooks & Catalog Covers' },
    ],
    images: [
      {
        url: '/images/portfolio/restaurant-menus/menu-1.webp',
        label: 'Cover Presentation',
        alt: 'Spot UV embossed restaurant menu cover by VR Enterprises',
      },
      {
        url: '/images/portfolio/restaurant-menus/menu-2.webp',
        label: 'Specular Light Angle',
        alt: 'Glossy spot UV varnish reflecting light on matte menu',
      },
      {
        url: '/images/portfolio/restaurant-menus/menu-3.webp',
        label: 'Full Spread Layout',
        alt: 'Premium menu spread with tactile finish by VR Enterprises',
      },
    ],
  },
  {
    id: 'boxes',
    index: '04',
    category: 'Rigid Boxes',
    name: 'Rigid Kappa Board Packaging',
    badge: 'Structural Luxury',
    headline: 'Heavyweight structural packaging for memorable unboxing ceremonies',
    desc: 'Constructed with 1.8mm–3.5mm European high-density Kappa board wrapped in custom embossed imported papers. Engineered with hidden neodymium magnetic snap closures and precision die-cut velvet-lined EVA foam beds.',
    swatches: [
      { id: 'magnetic-book', name: 'Magnetic Book-Fold', hex: '#3b2f2f', border: '#5c4848', type: 'Flap Snap Closure', desc: 'Triple-magnet folding closure with satisfying tactile snap.' },
      { id: 'shoulder-neck', name: 'Shoulder & Neck Reveal', hex: '#C87A5E', border: '#a65e45', type: 'Two-Piece Reveal', desc: 'Contrasting inner neck collar with snug hydraulic air-release.' },
      { id: 'eva-velvet', name: 'Die-Cut Velvet Foam', hex: '#1a1f1c', border: '#2d3732', type: 'Precision Cavity', desc: 'Dense shock-absorbent EVA foam lined with black velvet flocking.' },
    ],
    quickSpecs: [
      { label: 'Board Caliper', val: '1.8mm–3.5mm Unbending Rigid Board' },
      { label: 'Closure Hardware', val: 'Hidden N52 Neodymium Magnetic Snaps' },
      { label: 'Interior Fit', val: 'Precision Die-Cut Velvet-Lined EVA Foam' },
      { label: 'Minimum Batch', val: 'From 100 Units with 48h Prototyping' },
    ],
    images: [
      {
        url: '/images/portfolio/packaging-labels/package-labels-1.webp',
        label: 'Rigid Presentation Box',
        alt: 'Custom luxury rigid packaging box crafted by VR Enterprises',
      },
      {
        url: '/images/portfolio/packaging-labels/package-labels-2.webp',
        label: 'Label & Texture Detail',
        alt: 'High precision product label packaging by VR Enterprises',
      },
      {
        url: '/images/portfolio/packaging-labels/package-labels-3.webp',
        label: 'Bespoke Packaging Set',
        alt: 'Branded packaging set designed and printed by VR Enterprises',
      },
    ],
  },
]

function MaterialExplorer() {
  const [activeId, setActiveId] = useState('foil')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeSwatchIndex, setActiveSwatchIndex] = useState(0)
  const [shimmerKey, setShimmerKey] = useState(0)

  const activeMaterial = materials.find((m) => m.id === activeId) || materials[0]
  const currentImage = activeMaterial.images[selectedImageIndex] || activeMaterial.images[0]
  const currentSwatch = activeMaterial.swatches[activeSwatchIndex] || activeMaterial.swatches[0]

  const handleMaterialChange = (id) => {
    setActiveId(id)
    setSelectedImageIndex(0)
    setActiveSwatchIndex(0)
    setShimmerKey((k) => k + 1)
  }

  const handleSwatchSelect = (idx) => {
    setActiveSwatchIndex(idx)
    setShimmerKey((k) => k + 1)
  }

  return (
    <section className="material-explorer-section" id="materials" aria-labelledby="materials-title">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="material-header-wrap">
          <SectionHeading
            id="materials-title"
            eyebrow="Tactile Materiality &amp; Finishes"
            title="The Atelier Material &amp; Finish Laboratory"
            intro="Touch, texture, and specular reflection define memorable brand presence. Explore our signature in-house finishes, substrates, and precision heat-stamped foils."
            align="center"
          />
        </div>

        {/* Sculpted Atelier Material Selector Rail */}
        <div className="material-nav-rail" role="tablist" aria-label="Material choices">
          {materials.map((m) => {
            const isActive = m.id === activeId
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                className={`material-nav-card ${isActive ? 'is-active' : ''}`}
                onClick={() => handleMaterialChange(m.id)}
              >
                <div className="nav-card-top">
                  <span className="nav-card-num">{m.index}</span>
                  <span className="nav-card-cat">{m.category}</span>
                  <span className="nav-card-dot" aria-hidden="true" />
                </div>
                <div className="nav-card-title">{m.name}</div>
                <div className="nav-card-badge">{m.badge}</div>
              </button>
            )
          })}
        </div>

        {/* Master Showcase Stage */}
        <div className="material-stage-panel">
          <div className="material-stage-grid">
            {/* Visual Column */}
            <div className="material-stage-visual">
              <div className="material-canvas-frame">
                {/* Main Specimen Image Container */}
                <div className="material-img-container">
                  <img
                    key={`${activeMaterial.id}-${selectedImageIndex}`}
                    src={currentImage.url}
                    alt={currentImage.alt}
                    className="material-showcase-img animate-fade-in"
                    loading="lazy"
                  />

                  {/* Specular Light Sweep Shimmer Effect */}
                  <div key={shimmerKey} className="material-specular-sweep" aria-hidden="true" />

                  {/* Studio Provenance Badge (Top Left) */}
                  <div className="studio-provenance-tag">
                    <span className="provenance-pulse" aria-hidden="true" />
                    <span>Ghansoli Pressroom</span>
                  </div>

                  {/* Active Angle Badge (Top Right) */}
                  <div className="angle-status-tag">
                    <span>{currentImage.label}</span>
                  </div>

                  {/* Active Selected Swatch Callout Pill (Bottom Left) */}
                  <div className="active-swatch-floating-pill">
                    <span
                      className="swatch-mini-disc"
                      style={{
                        background: currentSwatch.hex,
                        borderColor: currentSwatch.border,
                      }}
                      aria-hidden="true"
                    />
                    <div className="swatch-floating-meta">
                      <span className="swatch-floating-label">Active Finish</span>
                      <strong className="swatch-floating-name">{currentSwatch.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Studio Multi-Angle Camera Switcher */}
                <div className="material-angles-shelf">
                  <span className="angles-shelf-label">
                    <Icon name="eye" size={13} />
                    <span>Camera Angle:</span>
                  </span>
                  <div className="angles-shelf-strip">
                    {activeMaterial.images.map((img, idx) => (
                      <button
                        key={img.url}
                        type="button"
                        className={`angle-thumb-btn ${idx === selectedImageIndex ? 'is-current' : ''}`}
                        onClick={() => setSelectedImageIndex(idx)}
                        title={img.label}
                      >
                        <span className="angle-thumb-num">0{idx + 1}</span>
                        <span className="angle-thumb-text">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Specimen Dossier & Specs Column */}
            <div className="material-stage-dossier">
              {/* Material Identity Header */}
              <div className="dossier-head">
                <div className="dossier-meta-row">
                  <span className="dossier-pill-badge">{activeMaterial.badge}</span>
                  <span className="dossier-spec-ref">ARCHIVAL SPECIMEN {activeMaterial.index} / 04</span>
                </div>
                <h3 className="dossier-title">{activeMaterial.name}</h3>
                <p className="dossier-headline">{activeMaterial.headline}</p>
                <p className="dossier-desc">{activeMaterial.desc}</p>
              </div>

              {/* Interactive Finish Palette Bar */}
              <div className="atelier-swatch-station">
                <div className="swatch-station-header">
                  <span className="swatch-station-title">
                    <Icon name="sparkles" size={14} />
                    <span>Interactive Finish Palette</span>
                  </span>
                  <span className="swatch-station-hint">
                    Tap to preview specular luster
                  </span>
                </div>

                {/* Horizontal Metallic Swatch Coins */}
                <div className="swatch-coins-row" role="radiogroup" aria-label="Available finish options">
                  {activeMaterial.swatches.map((sw, idx) => {
                    const isSelected = idx === activeSwatchIndex
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`swatch-coin-btn ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleSwatchSelect(idx)}
                        title={`${sw.name} (${sw.type})`}
                      >
                        <span
                          className="swatch-coin-disc"
                          style={{
                            background: sw.hex,
                            borderColor: sw.border,
                          }}
                        />
                        <span className="swatch-coin-name">{sw.name}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Active Swatch Live Dossier Callout */}
                <div className="swatch-active-dossier animate-fade-in" key={currentSwatch.id}>
                  <div className="active-dossier-lead">
                    <span className="active-dossier-badge">{currentSwatch.type}</span>
                    <strong className="active-dossier-title">{currentSwatch.name}</strong>
                  </div>
                  <p className="active-dossier-desc">{currentSwatch.desc}</p>
                </div>
              </div>

              {/* Architectural Technical Specification Matrix */}
              <div className="atelier-specs-grid">
                {activeMaterial.quickSpecs.map((spec) => (
                  <div key={spec.label} className="atelier-spec-cell">
                    <span className="atelier-spec-label">{spec.label}</span>
                    <span className="atelier-spec-value">{spec.val}</span>
                  </div>
                ))}
              </div>

              {/* Atelier Guarantee & Action Row */}
              <div className="material-action-row">
                <div className="material-guarantee-pill">
                  <span className="guarantee-icon" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  <div className="guarantee-text">
                    <strong>Complimentary Swatch Book</strong>
                    <span>Physical sample kits delivered across Mumbai &amp; Thane</span>
                  </div>
                </div>

                <div className="material-cta-desk">
                  <a className="btn btn-primary btn--atelier-cta" href="#consultation">
                    <span>Request Physical Sample Kit</span>
                    <span className="btn-circle-arrow" aria-hidden="true">
                      <Icon name="arrow" size={15} />
                    </span>
                  </a>

                  <a
                    className="btn btn-outline btn--atelier-whatsapp"
                    href={`https://wa.me/919930281240?text=Hi%20VR%20Enterprises,%20I'm%20exploring%20your%20materials%20and%20would%20like%20to%20request%20samples%20for%20${encodeURIComponent(activeMaterial.name)}%20(${encodeURIComponent(currentSwatch.name)}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="chat" size={15} />
                    <span>Consult Master Finisher</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MaterialExplorer
