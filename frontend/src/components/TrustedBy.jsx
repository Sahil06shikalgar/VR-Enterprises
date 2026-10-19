import Reveal from './Reveal.jsx'
import SectionHeading from './SectionHeading.jsx'

const clients = [
  ['3s', '3S'],
  ['Aditi', 'Aditi'],
  ['Ayyappans', 'Ayyappans'],
  ['BNI', 'BNI'],
  ['Blackburn', 'Blackburn'],
  ['Capitaland', 'CapitaLand'],
  ['Degender', 'Degender'],
  ['Dhwaneer', 'Dhwaneer'],
  ['Dream', 'Dream'],
  ['GH', 'GH'],
  ['HR-Search', 'HR Search'],
  ['ICICI-Lombard', 'ICICI Lombard'],
  ['JS', 'JS'],
  ['Maharashtra', 'Maharashtra'],
  ['OSFS', 'OSFS'],
  ['Pharmax', 'Pharmax'],
  ['Queens', 'Queens'],
  ['SB-Scaffolding', 'SB Scaffolding'],
  ['SCGT', 'SCGT'],
  ['Southern', 'Southern'],
  ['Synergy', 'Synergy'],
  ['T4H', 'T4H'],
  ['TQMech', 'TQMech'],
  ['VIBA', 'VIBA'],
  ['VR-Mittal', 'VR Mittal'],
  ['Vensure', 'Vensure'],
  ['fitnastic', 'Fitnastic'],
  ['kidss', 'Kidss'],
  ['maxim-Shipping', 'Maxim Shipping'],
]

function ClientGroup({ duplicate = false }) {
  return (
    <div
      className={duplicate ? 'clients-group clients-group--duplicate' : 'clients-group'}
      aria-hidden={duplicate || undefined}
    >
      {clients.map(([file, name]) => (
        <div className="clients-card" key={file}>
          <img
            src={`/images/clients/${file}.webp`}
            alt={`${name} logo`}
            width="900"
            height="425"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  )
}

function TrustedBy() {
  return (
    <section className="clients-section" aria-labelledby="clients-title">
      <div className="container clients-head">
        <Reveal>
          <SectionHeading
            id="clients-title"
            eyebrow="Trusted by"
            title="Our esteemed clients"
            align="center"
          />
        </Reveal>
      </div>

      <div className="clients-viewport">
        <div className="clients-track">
          <ClientGroup />
          <ClientGroup duplicate />
        </div>
      </div>
    </section>
  )
}

export default TrustedBy
