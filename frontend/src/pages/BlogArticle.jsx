import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { blogPosts, blogPostsBySlug } from '../data/blogs.js'
import { contactEmailHref } from '../data/contact.js'
import { useSeo } from '../lib/seo.js'

function BlogArticle() {
  const { slug } = useParams()
  const post = blogPostsBySlug[slug]
  const [id] = useState(() => (post ? post.slug : 'article'))

  useSeo({
    title: post?.title,
    description: post?.excerpt,
    path: `/blog/${slug}`,
  })

  if (!post) {
    return <Navigate to="/blogs" replace />
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article className="page-article">
      <div className="container article-wrap">
        <nav className="article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/blogs">Blogs</Link>
          <span aria-hidden="true">/</span>
          <span>{post.category}</span>
        </nav>

        <header className="article-head">
          <Reveal>
            <div className="article-meta">
              <span className="blog-card__category">{post.category}</span>
              <span>{post.date}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readTime}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="article-lead">{post.excerpt}</p>
          </Reveal>
        </header>

        <Reveal>
          <img
            className="article-hero-img"
            src={post.image}
            alt={`Cover image for ${post.title}`}
            width="1280"
            height="720"
            loading="eager"
          />
        </Reveal>

        <div className="article-body">
          {post.content.map((block, index) => (
            <div key={index}>
              {block.heading ? <h2>{block.heading}</h2> : null}
              {block.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
              {block.list ? (
                <ul>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        {post.faqs?.length ? (
          <section className="article-faq" aria-labelledby={`${id}-faq-title`}>
            <h2 id={`${id}-faq-title`}>Frequently asked questions</h2>
            <div className="faq-list">
              {post.faqs.map(({ q, a }, index) => (
                <details className="faq-item" key={q} open={index === 0}>
                  <summary>
                    <span>{q}</span>
                    <Icon name="chevron" size={18} />
                  </summary>
                  <div className="faq-a">
                    <div>
                      <p>{a}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="article-footer">
          <div className="article-cta">
            <h2>Working on a similar project?</h2>
            <p>Talk to our team — we respond within 24 hours.</p>
            <div className="article-cta__actions">
              <Link className="btn btn-primary" to="/contact-us">
                Get a Quote
                <Icon name="arrow" size={17} />
              </Link>
              <a className="btn btn-outline" href={contactEmailHref()}>
                Email Us
              </a>
            </div>
          </div>
        </section>

        <section className="article-related" aria-labelledby="article-related-title">
          <h2 id="article-related-title">Related articles</h2>
          <div className="blog-grid">
            {related.map((p) => (
              <Link className="blog-card" to={`/blog/${p.slug}`} key={p.slug}>
                <div className="blog-card__media">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={p.image}
                    alt={`Cover image for ${p.title}`}
                    width="640"
                    height="400"
                  />
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="blog-card__category">{p.category}</span>
                    <span className="blog-card__date">{p.date}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <span className="blog-card__more">
                    Read article
                    <Icon name="arrow" size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}

export default BlogArticle