import PolicyPage from './PolicyPage.jsx'
import { contact } from '../data/contact.js'

const blocks = [
  {
    heading: '1. Your Privacy Matters',
    paragraphs: ['We respect your privacy and ensure your personal information is protected.'],
  },
  {
    heading: '2. Information We Collect',
    paragraphs: [
      'We collect basic details like name, contact information, and project files only to provide our services.',
    ],
  },
  {
    heading: '3. How We Use Your Data',
    paragraphs: [
      'Your data is used for communication, project execution, billing, and service improvement.',
    ],
  },
  {
    heading: '4. Confidentiality',
    paragraphs: [
      'All files, designs, and information you share remain confidential and are not shared with anyone outside our team.',
    ],
  },
  {
    heading: '5. Third-Party Services',
    paragraphs: [
      'Secure third-party services (for payments, hosting, storage, etc.) may be used, each with their own privacy standards.',
    ],
  },
  {
    heading: '6. Portfolio & Marketing Use',
    paragraphs: [
      'We may use completed work such as brochures, flyers, and other publicly viewable designs for our portfolio or marketing purposes. Any confidential client information will strictly not be shared.',
    ],
  },
  {
    heading: '7. Cookies',
    paragraphs: [
      'Cookies may be used on our website to improve user experience. You can choose to disable cookies in your browser settings if you wish.',
    ],
  },
  {
    heading: '8. Your Rights',
    paragraphs: ['You may request access, correction, or deletion of your data any time.'],
  },
  {
    heading: '9. Updates to This Policy',
    paragraphs: ['We may update this policy occasionally; the latest version will always apply.'],
  },
  {
    heading: '10. Contact Us',
    paragraphs: [
      `If you have any questions regarding this Privacy Policy, please email us at ${contact.email} or visit our office at Ghansoli, Navi Mumbai.`,
    ],
  },
]

function PrivacyPolicy() {
  return (
    <PolicyPage
      breadcrumb="Privacy Policy"
      eyebrow="Legal Info"
      title="Privacy Policy"
      documentTitle="Privacy Policy"
      description="Read the Privacy Policy of VR Enterprises — how we collect, use, and protect the information you share with us."
      blocks={blocks}
    />
  )
}

export default PrivacyPolicy