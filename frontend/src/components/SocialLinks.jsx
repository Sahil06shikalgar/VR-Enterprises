import Icon from './Icon.jsx'
import { socialLinks } from '../data/social.js'

function SocialLinks({ heading = '', className = '', size = 20 }) {
  if (!socialLinks.length) return null

  return (
    <div className={`social-block${className ? ` ${className}` : ''}`}>
      {heading ? <p className="social-block__heading">{heading}</p> : null}
      <ul className="social-links">
        {socialLinks.map(({ id, name, url, ariaLabel }) => (
          <li key={id}>
            <a
              className={`social-link social-link--${id}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
            >
              <span className="social-link__icon" aria-hidden="true">
                <Icon name={id} size={size} />
              </span>
              <span className="social-link__tooltip" aria-hidden="true">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SocialLinks
