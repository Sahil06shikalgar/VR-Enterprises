import PolicyPage from './PolicyPage.jsx'

const terms = [
  'VR Enterprises provides all creative designing and branding solutions with a 100% advance payment policy.',
  'VR Enterprises customises designs and services to meet individual needs. Please note that payments made for any services, including design and branding, are non-refundable under any circumstances.',
  'To receive the final quote and confirmation from us, all inquiries concerning features, modifications, customization, or payment need to be submitted via email. While phone discussions regarding these aspects are acceptable, receiving an email acknowledgment is mandatory.',
  'The client is required to furnish all essential content, including images before starting the project.',
  'Any Photo / Image editing will be done at an additional charge.',
  'After the necessary content is provided, our standard practice is to commence work on the project within two working days. To ensure any changes or additions to the design, kindly communicate them before the project initiation. Once the project is underway, any requested additions or modifications will incur an additional cost.',
  'In case clients need stock images, an additional cost will be incurred.',
  'VR Enterprises reserves the right to modify the above terms and conditions and pricing for our services without any prior notice to anyone.',
  'We offer an additional grace period of two working days for any further modifications required in the shared files. Any request beyond this will incur an additional cost.',
  'Upon finishing your design projects, all the open files will be provided to you via email upon payment. Please note that any complimentary designs offered will not include the open files.',
  'We retain your files in our server/system for up to seven (7) days to one (1) month from the time of sharing. After this period, they will be automatically deleted from our server/system to release the space. We kindly request you to ensure you have saved all necessary files for your records before this timeframe lapses.',
  'We appreciate your understanding regarding the terms and conditions outlined above. Thank you.',
]

function TermsOfService() {
  return (
    <PolicyPage
      breadcrumb="Terms & Conditions"
      eyebrow="Legal Info"
      title="Terms & Conditions"
      documentTitle="Terms & Conditions"
      description="The terms and conditions governing design, branding, development, and printing services provided by VR Enterprises."
      list={terms}
    />
  )
}

export default TermsOfService