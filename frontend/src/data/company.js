/*
 * Shared, verified company content for VR Enterprises.
 *
 * Source of truth: https://www.thevrenterprises.com (About page, homepage).
 * Statistics, values, story, and service groups below mirror the official site.
 */

export const stats = [
  { value: 450, suffix: '+', label: 'Happy Clients', displayValue: '450+' },
  { value: 15, suffix: '+', label: 'Industries Served', displayValue: '15+' },
  { value: 3, suffix: '+', label: 'Countries', displayValue: '3+' },
  { value: 4500, suffix: '+', label: 'Projects Delivered', displayValue: '4,500+' },
  { value: 9, suffix: '+', label: 'Professional Services', displayValue: '9+' },
  { value: 100, suffix: '%', label: 'Customized Solutions', displayValue: '100%' },
]

/*
 * "Why VR Enterprises" — presented as an asymmetric bento on the homepage and
 * the About page. Copy stays factual to the official site; each supporting
 * description is kept to one concise sentence.
 */
export const whyBento = {
  eyebrow: 'Why VR Enterprises',
  title: 'Everything your business needs, under one roof',
  intro:
    'Creative, print, branding, and technology services delivered by one coordinated team—built around your identity, goals, and deadlines.',
  featured: {
    icon: 'box',
    title: 'Complete Business Solutions',
    text: 'Design, printing, branding, signages, video, marketing, websites, apps, and software—coordinated by one experienced team.',
    nodes: [
      'Design',
      'Print',
      'Branding',
      'Signages',
      'Video',
      'Marketing',
      'Website',
      'Apps',
      'Software',
    ],
  },
  cards: [
    {
      icon: 'pen',
      accent: 'blue',
      title: 'Creative & Customized',
      text: 'Every design, website, catalog, and signage solution is tailored to your brand, audience, and objectives.',
    },
    {
      icon: 'badge',
      accent: 'gold',
      title: 'Quality You Can Trust',
      text: 'Premium materials, thoughtful design, reliable technology, and careful quality checks across every deliverable.',
    },
    {
      icon: 'clock',
      accent: 'violet',
      title: 'On-Time Delivery',
      text: 'Clear planning and disciplined execution help keep printing, branding, and technology projects on schedule.',
    },
    {
      icon: 'chat',
      accent: 'teal',
      title: 'Dedicated Support',
      text: 'Responsive communication, transparent updates, and dependable assistance throughout your project and after delivery.',
    },
  ],
}

export const story = {
  eyebrow: 'Our Story',
  title: 'Creativity & Technology, Under One Roof',
  paragraphs: [
    'Founded in 2017, VR Enterprises started as a small design and print studio in Ghansoli, Navi Mumbai. Over the years, we have grown into a full-service creative and technology solutions company, serving 450+ happy clients across 15+ industries and 3 countries.',
    'Our team combines creative design thinking with technical expertise to deliver end-to-end solutions, from brand identity and print collaterals to complex web platforms and custom business software.',
    'We believe in building long-term relationships through quality, transparency, and timely delivery. Every project, big or small, receives the same attention to detail and commitment to excellence.',
  ],
}

/*
 * The nine official services, grouped into two disciplines so the homepage and
 * the services overview can present them as an editorial bento instead of nine
 * identical cards.
 */
export const serviceGroups = [
  {
    id: 'creative',
    eyebrow: 'Creative & Print',
    title: 'Creative & Print Solutions',
    blurb: 'Brand identity, packaging, storefront branding, commercial printing, and premium signage, designed and produced in-house.',
    icon: 'printer',
    slugs: ['designing', 'printing', 'branding', 'signages'],
  },
  {
    id: 'digital',
    eyebrow: 'Digital & Technology',
    title: 'Digital & Technology Solutions',
    blurb: 'Video, performance marketing, websites with AMC, mobile and web apps, and custom business software built to scale.',
    icon: 'globe',
    slugs: [
      'video-creation',
      'digital-marketing',
      'website-development',
      'app-development',
      'software-development',
    ],
  },
]
