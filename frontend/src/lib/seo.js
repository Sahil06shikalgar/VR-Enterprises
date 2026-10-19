import { useEffect } from 'react'

/*
 * Lightweight SEO hook — no dependency, works with client-side routing.
 *
 * Sets the document title, meta description, Open Graph / Twitter tags, and a
 * canonical URL for the current route. Values are only ever factual company
 * metadata; no fabricated structured data is injected here.
 */
export const SITE_URL = 'https://www.thevrenterprises.com'
export const SITE_NAME = 'VR Enterprises'

export const DEFAULT_DESCRIPTION =
  'VR Enterprises is your printing & digital partner in Ghansoli, Navi Mumbai — designing, printing, branding, signages, video creation, digital marketing, websites, apps, and software development under one roof.'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo({ title, description, path = '' } = {}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Your Printing & Digital Partner`
    const desc = description || DEFAULT_DESCRIPTION
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    upsertMeta('name', 'description', desc)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', desc)

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', url)
  }, [title, description, path])
}
