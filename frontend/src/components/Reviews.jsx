import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import SectionHeading from './SectionHeading.jsx'
import Icon from './Icon.jsx'
import { reviews, googleRating } from '../data/reviews.js'
import { googleMapsUrl } from '../data/contact.js'

function Stars() {
  return (
    <span className="review-stars" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={16} />
      ))}
    </span>
  )
}

function Reviews() {
  return (
    <section className="reviews-band" aria-labelledby="reviews-title">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow="What our clients say"
            title="Feedback from businesses we've worked with"
            intro={`Rated ${googleRating.score} on Google, based on ${googleRating.count} reviews.`}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="reviews-google">
            <span className="reviews-google__score">{googleRating.score}</span>
            <span className="review-stars" aria-label="Rated 5 out of 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </span>
            <span className="reviews-google__meta">
              Rated 5.0 on Google &middot; {googleRating.count} reviews
            </span>
          </div>
        </Reveal>

        <div className="reviews-grid">
          {reviews.map(({ quote, name, role }, index) => (
            <Reveal key={name} delay={index * 0.08}>
              <figure className="review-card">
                <Stars />
                <blockquote className="review-quote">&ldquo;{quote}&rdquo;</blockquote>
                <figcaption className="review-author">
                  <span className="review-author__avatar" aria-hidden="true">
                    {name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>{role}</small>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="reviews-cta">
            <a
              className="reviews-link"
              href={googleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read and leave a review on Google
              <Icon name="arrow" size={15} />
            </a>
            <Link className="reviews-link" to="/contact-us">
              Share your project with us
              <Icon name="arrow" size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Reviews