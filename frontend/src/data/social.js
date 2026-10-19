/*
 * Official VR Enterprises social profiles.
 *
 * Verified against the company's own website (thevrenterprises.com): the
 * footer social row and the JSON-LD "sameAs" array on the About page list
 * exactly these profiles. Only verified, live URLs are listed here so they can
 * be reused everywhere (footer, contact page, mobile menu).
 *
 * Twitter/X is intentionally NOT included: no official X profile is published
 * anywhere on the official website, and we do not link to guessed accounts.
 */
export const socialLinks = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@vrenterprisesofficial',
    url: 'https://www.instagram.com/vrenterprisesofficial',
    ariaLabel: 'Follow VR Enterprises on Instagram',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'vrenterprisesofficial',
    url: 'https://www.facebook.com/vrenterprisesofficial',
    ariaLabel: 'Follow VR Enterprises on Facebook',
  },
]

export default socialLinks
