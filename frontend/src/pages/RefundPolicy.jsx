import PolicyPage from './PolicyPage.jsx'

const blocks = [
  {
    heading: '1. Advance Payment / Booking Amount',
    paragraphs: [
      'All projects require an advance payment to begin the work. Advance or booking payments are non-refundable, as they cover initial planning, concept development, and resource allocation.',
    ],
  },
  {
    heading: '2. Graphic Design Services',
    paragraphs: [
      'Refunds are not applicable once initial concepts, drafts, or designs have been shared.',
      'If no work has been initiated, a partial refund may be considered after deducting administrative charges.',
      'If the client discontinues the project mid-way, the amount paid will be adjusted for the completed stages, and remaining balance (if any) is non-refundable.',
    ],
  },
  {
    heading: '3. Web Development Services',
    paragraphs: [
      'Once the project structure, wireframe, design layout, or coding work has started, the payment is non-refundable.',
      'If the client requests project cancellation before any work begins, only partial refunds may be offered.',
      'Once your refund is approved, the amount will be automatically credited to your original payment method within 15 business days.',
      "If the delay is caused due to the client's lack of communication, approvals, or content submission, no refund will be issued.",
    ],
  },
  {
    heading: '4. Printing Services',
    paragraphs: [
      'Printing orders cannot be refunded once the printing process has started or final approval has been given for print.',
      'In case of errors caused from the client side (incorrect content, low-quality images, wrong specifications), no refund or reprint will be issued.',
      'If there is an error from our end, we will offer reprint or partial refund, depending on the situation.',
    ],
  },
  {
    heading: '5. Digital Product Delivery',
    paragraphs: ['Once final files, creatives, or digital assets are delivered, no refund is applicable.'],
  },
  {
    heading: '6. Turnaround Time and Delays',
    paragraphs: [
      'Deadlines may shift if the client delays approvals, content, or payments. Such delays are not grounds for a refund.',
    ],
  },
  {
    heading: '7. Dissatisfaction Clause',
    paragraphs: [
      'Creative work is subjective. While we offer reasonable revisions as per the package, dissatisfaction after completion does not qualify for a refund.',
    ],
  },
  {
    heading: '8. Force Majeure',
    paragraphs: [
      'Projects affected by unforeseen events (natural disasters, emergencies, etc.) will not qualify for refunds, but schedules may be adjusted.',
    ],
  },
]

function RefundPolicy() {
  return (
    <PolicyPage
      breadcrumb="Refund Policy"
      eyebrow="Legal Info"
      title="Refund Policy"
      documentTitle="Refund Policy"
      description="The Refund Policy of VR Enterprises covering design, web development, printing, and digital product delivery."
      intro="At VR Enterprises, we strive to deliver high-quality design, development, and printing solutions. Since our services involve significant time, effort, and creative work, our refund policy is structured as follows:"
      blocks={blocks}
    />
  )
}

export default RefundPolicy