/*
 * Verified contact data for VR Enterprises.
 *
 * Source of truth: https://www.thevrenterprises.com (contact page + footer).
 * All values below are copied from the official site.
 */
export const contact = {
  email: 'sales@thevrenterprises.com',
  emailAlt: 'vrenterprises.nm@gmail.com',
  phone: '+91 99302 81240',
  address: '2nd Floor, Plot No. 79, Sector-5, Near Lokmanya Tilak School, Ghansoli, Navi Mumbai - 400701',
  hours: 'Monday to Saturday, 10:00 AM – 6:00 PM',
}

export const contactEmailHref = () => `mailto:${contact.email}`

/*
 * Public Google Maps embed URL, no API key required.
 * Taken from the official contact page iframe for VR Enterprises.
 */
export const mapEmbedSrc = () =>
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1543856079463!2d73.0013863!3d19.1142724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1c9b7f9a7a7%3A0x7a1afb17e8334f6c!2sVR%20Enterprises!5e0!3m2!1sen!2sin!4v1690000000000'

/*
 * "Get Directions" deep link, no API key required.
 */
export const directionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`

/*
 * Link to the company page on Google Maps (used for the rating badge).
 */
export const googleMapsUrl = () =>
  'https://www.google.com/maps/search/?api=1&query=VR%20Enterprises%20Ghansoli%20Navi%20Mumbai'

/*
 * Public YouTube channel link (from the official site footer/nav).
 */
export const youtubeChannelUrl = 'https://www.youtube.com/@vrenterprisesnm'