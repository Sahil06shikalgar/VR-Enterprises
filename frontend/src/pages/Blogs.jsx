import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { blogCategories, blogPosts } from '../data/blogs.js'

const filters = ['All', ...blogCategories]

function Blogs() {
  const [active, setActive] = useState('All')
  const posts = active === 'All' ? blogPosts : blogPosts.filter((p) => p.category === active)

  return (
    <div className="page-blogs">
      <PageHero
        breadcrumb="Blogs"
        eyebrow="Our Blogs"
        title="Insights from our studio"
        intro="Design tips, branding guidance, printing know-how, and digital marketing insights from the VR Enterprises team."
        documentTitle="Blogs"
        description="Design tips, branding guidance, printing know-how, and digital marketing insights from the VR Enterprises team."
      />

      <section className="blog-band" aria-label="Blog articles">
        <div className="container">
          <div className="blog-filters" role="group" aria-label="Filter blog posts by category">
            {filters.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`blog-filter${active === cat ? ' active' : ''}`}
                aria-pressed={active === cat}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <Reveal key={active} className="blog-grid">
            {posts.map((post) => (
              <Link className="blog-card" to={`/blog/${post.slug}`} key={post.slug}>
                <div className="blog-card__media">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={post.image}
                    alt={`Cover image for ${post.title}`}
                    width="640"
                    height="400"
                  />
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="blog-card__category">{post.category}</span>
                    <span className="blog-card__date">{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-card__more">
                    Read article
                    <Icon name="arrow" size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Blogs