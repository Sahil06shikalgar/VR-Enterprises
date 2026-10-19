import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'

function NotFound() {
  return (
    <div className="page-notfound">
      <PageHero
        breadcrumb="Not found"
        eyebrow="404"
        title="We couldn't find that page"
        intro="The page you are looking for may have moved or no longer exists."
        documentTitle="Page not found"
      />
      <section className="notfound-band">
        <div className="container notfound-actions">
          <Link className="btn btn-primary" to="/">
            Back to Home
          </Link>
          <Link className="btn btn-outline" to="/services">
            Explore Services
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFound