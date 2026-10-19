/*
 * Email templates.
 *
 * All user-provided values are HTML-escaped before interpolation so a
 * submission can never inject markup into the notification or acknowledgement
 * email (XSS / header-injection safe).
 */
const LABELS = {
  contact: 'Contact Inquiry',
  quote: 'Quote Request',
  career: 'Career Application',
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

function row(label, value) {
  if (value === undefined || value === null || value === '') return ''
  return `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap"><strong>${escapeHtml(
    label,
  )}</strong></td><td style="padding:6px 0;color:#0f172a">${escapeHtml(String(value)).replace(/\n/g, '<br>')}</td></tr>`
}

function fieldRows(pairs) {
  return pairs.map(([label, value]) => row(label, value)).join('')
}

function document({ heading, pairs, footer, preheader }) {
  return `<!doctype html>
<html><body style="margin:0;background:#eef2fb;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:#0e1c46">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0">${escapeHtml(preheader || '')}</span>
  <div style="max-width:640px;margin:0 auto;padding:28px 16px">
    <div style="background:#0a1330;color:#ffffff;border-radius:16px 16px 0 0;padding:20px 24px">
      <div style="font-size:16px;font-weight:700;letter-spacing:.01em">VR Enterprises</div>
      <div style="font-size:12.5px;color:#bcc9e8;margin-top:2px">Your Printing &amp; Digital Partner</div>
    </div>
    <div style="background:#ffffff;border:1px solid #e4e9f3;border-top:none;border-radius:0 0 16px 16px;padding:24px">
      <h1 style="font-size:18px;margin:0 0 16px;color:#0e1c46">${escapeHtml(heading)}</h1>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.5">${fieldRows(pairs)}</table>
      ${footer ? `<p style="margin:20px 0 0;font-size:13px;color:#64748b">${footer}</p>` : ''}
    </div>
    <p style="font-size:12px;color:#8fa3cd;text-align:center;margin:16px 0 0">
      This message was sent by the VR Enterprises website.
    </p>
  </div>
</body></html>`
}

function commonPairs(record) {
  return [
    ['Reference', record.reference],
    ['Submitted', new Date(record.createdAt || Date.now()).toUTCString()],
    ['Source page', record.sourcePage],
  ]
}

export function buildAdminNotification(config, kind, record) {
  const type = LABELS[kind] || 'Submission'
  let pairs = []

  if (kind === 'contact') {
    pairs = [
      ['Name', record.fullName],
      ['Company', record.company],
      ['Email', record.email],
      ['Phone', record.phone],
      ['Subject', record.subject],
      ['Message', record.message],
    ]
  } else if (kind === 'quote') {
    pairs = [
      ['Name', record.fullName],
      ['Company', record.company],
      ['Email', record.email],
      ['Phone', record.phone],
      ['Service', record.service],
      ['Budget', record.budgetRange],
      ['Deadline', record.preferredDeadline],
      ['Project', record.projectDescription],
    ]
  } else {
    pairs = [
      ['Name', record.fullName],
      ['Email', record.email],
      ['Phone', record.phone],
      ['Position', record.position],
      ['Experience', record.experience],
      ['Portfolio', record.portfolioUrl],
      ['Cover message', record.coverMessage],
    ]
  }

  const allPairs = [...pairs, ...commonPairs(record)]
  const summary = `${record.fullName || 'Submission'} — ${record.reference}`

  return {
    subject: `[${type}] ${summary}`,
    text: allPairs.map(([k, v]) => (v ? `${k}: ${v}` : null)).filter(Boolean).join('\n'),
    html: document({
      heading: `New ${type}`,
      pairs: allPairs,
      footer: `<strong>Reference:</strong> ${escapeHtml(record.reference)}`,
      preheader: summary,
    }),
  }
}

export function buildAcknowledgement(config, kind, record) {
  const type = LABELS[kind] || 'submission'
  const pairs = [
    ['Reference', record.reference],
    ['Name', record.fullName],
    ...(kind === 'contact' ? [['Subject', record.subject]] : []),
    ...(kind === 'quote' ? [['Service', record.service]] : []),
    ...(kind === 'career' ? [['Position', record.position]] : []),
  ]

  const greeting = record.fullName ? `Hi ${record.fullName},` : 'Hello,'

  return {
    subject: `We've received your ${type.toLowerCase()} — ${record.reference}`,
    text: `${greeting}\n\nThank you for contacting VR Enterprises. We have received your ${type.toLowerCase()} and our team will get back to you within 24 business hours.\n\nYour reference number is ${record.reference}. Please quote it in any follow-up.\n\nRegards,\nVR Enterprises`,
    html: document({
      heading: `Thank you — we've received your ${type.toLowerCase()}`,
      pairs,
      footer: `Our team will get back to you within <strong>24 business hours</strong>. Please quote reference <strong>${escapeHtml(
        record.reference,
      )}</strong> in any follow-up.`,
      preheader: `Reference ${record.reference}`,
    }),
  }
}
