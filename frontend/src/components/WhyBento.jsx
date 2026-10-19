import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'
import { whyBento } from '../data/company.js'

function WhyBento({ id = 'why-title' }) {
  return (
    <section className="why-bento" aria-labelledby={id}>
      <div className="container">
        <div className="why-bento__head">
          <Reveal className="why-bento__intro">
            <span className="section-eyebrow">{whyBento.eyebrow}</span>
            <h2 id={id}>{whyBento.title}</h2>
          </Reveal>
          <Reveal className="why-bento__aside">
            <p>{whyBento.intro}</p>
          </Reveal>
        </div>

        <div className="why-bento__grid">
          <Reveal className="why-feature">
            <article className="why-feature__card">
              <div className="why-feature__background" aria-hidden="true" />
              <div className="why-feature__overlay" aria-hidden="true" />
              <div className="why-feature__content">
                <div className="why-feature__text">
                  <span className="why-feature__icon" aria-hidden="true">
                    <Icon name={whyBento.featured.icon} size={24} />
                  </span>
                  <h3>{whyBento.featured.title}</h3>
                  <p>{whyBento.featured.text}</p>
                </div>
                <ul className="why-feature__services">
                  {whyBento.featured.nodes.map((node) => (
                    <li key={node}>{node}</li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          {whyBento.cards.map((card, index) => (
            <Reveal
              key={card.title}
              className={`why-tile why-tile--${card.accent}`}
              delay={0.08 + index * 0.06}
            >
              <article className="why-tile__card">
                <span className="why-tile__icon" aria-hidden="true">
                  <Icon name={card.icon} size={22} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyBento
