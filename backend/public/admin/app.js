/* VR Enterprises admin dashboard — dependency-free, no inline scripts (CSP-safe). */

const RESOURCES = {
  inquiries: { kind: 'contact', label: 'Contact Inquiries' },
  quotes: { kind: 'quote', label: 'Quote Requests' },
  applications: { kind: 'career', label: 'Career Applications' },
}

const STATUSES = ['new', 'in_progress', 'responded', 'closed', 'spam']

const FIELD_ORDER = [
  ['fullName', 'Name'],
  ['company', 'Company'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['subject', 'Subject'],
  ['service', 'Service'],
  ['budgetRange', 'Budget'],
  ['preferredDeadline', 'Preferred deadline'],
  ['position', 'Position'],
  ['experience', 'Experience'],
  ['portfolioUrl', 'Portfolio'],
  ['projectDescription', 'Project description'],
  ['coverMessage', 'Cover message'],
  ['message', 'Message'],
  ['sourcePage', 'Source page'],
  ['createdAt', 'Received'],
  ['ipAddress', 'IP address'],
]

const HIDDEN = new Set([
  'id',
  'status',
  'internalNotes',
  'assignedAdminId',
  'userAgent',
  'correlationId',
  'emailStatus',
  'notifiedAt',
  'archivedAt',
  'updatedAt',
  'reference',
])

const state = {
  user: null,
  csrfToken: null,
  resource: 'inquiries',
  status: '',
  search: '',
  offset: 0,
  limit: 20,
  total: 0,
  items: [],
  selected: null,
  selectedActivity: [],
  selectedAttachments: [],
  message: null,
  loading: false,
}

const root = document.getElementById('app')

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const fmtDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString()
}

async function api(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET' && state.csrfToken) headers['X-CSRF-Token'] = state.csrfToken

  const options = { method, headers, credentials: 'same-origin' }
  if (body !== undefined) options.body = JSON.stringify(body)
  const res = await fetch(`/api/admin${path}`, options)

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (res.status === 401) {
    state.user = null
    state.csrfToken = null
    throw { status: 401, body: payload }
  }
  if (!res.ok) throw { status: res.status, body: payload }
  return payload
}

async function loadList() {
  const params = new URLSearchParams()
  if (state.status) params.set('status', state.status)
  if (state.search) params.set('search', state.search)
  params.set('limit', String(state.limit))
  params.set('offset', String(state.offset))

  const payload = await api(`/${state.resource}?${params.toString()}`)
  state.items = payload.data || []
  state.total = payload.meta ? payload.meta.total : state.items.length
}

async function openDetail(id) {
  const payload = await api(`/${state.resource}/${id}`)
  state.selected = payload.data.record
  state.selectedActivity = payload.data.activity || []
  state.selectedAttachments = payload.data.attachments || []
  state.message = null
  render()
}

function loginForm() {
  root.innerHTML = `
    <div class="login">
      <h1>VR Enterprises <span>Admin</span></h1>
      <p class="sub">Sign in to review website submissions.</p>
      <form id="login-form">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="username" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required />
        <button class="primary" type="submit">Sign in</button>
      </form>
      <div class="note-msg err" id="login-msg"></div>
    </div>`

  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const button = event.target.querySelector('button')
    const msg = document.getElementById('login-msg')
    button.disabled = true
    msg.textContent = ''
    try {
      const payload = await api('/login', {
        method: 'POST',
        body: {
          email: document.getElementById('email').value.trim(),
          password: document.getElementById('password').value,
        },
      })
      state.user = payload.data.user
      state.csrfToken = payload.data.csrfToken
      await refresh()
    } catch (err) {
      msg.textContent = (err.body && err.body.error && err.body.error.message) || 'Sign in failed.'
      button.disabled = false
    }
  })
}

function fieldValue(key, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (key === 'createdAt' || key === 'preferredDeadline') return fmtDate(value)
  if (key === 'portfolioUrl') return `<a href="${esc(value)}" target="_blank" rel="noopener noreferrer">${esc(value)}</a>`
  return esc(value)
}

function detailPanel() {
  const r = state.selected
  if (!r) return '<aside class="detail"><p class="empty">Select a submission to view details.</p></aside>'

  const rows = FIELD_ORDER.filter(([key]) => !HIDDEN.has(key) && key in r)
    .map(([key, label]) => `<dt>${esc(label)}</dt><dd>${fieldValue(key, r[key])}</dd>`)
    .join('')

  const attachments = state.selectedAttachments.length
    ? `<div class="section"><strong>Attachments</strong><ul class="activity">${state.selectedAttachments
        .map(
          (a) =>
            `<li><a href="/api/admin/attachments/${esc(a.id)}/download">${esc(a.originalName)}</a> · ${Math.round(
              (a.sizeBytes || 0) / 1024,
            )} KB</li>`,
        )
        .join('')}</ul></div>`
    : ''

  const activity = `<div class="section"><strong>Activity</strong><ul class="activity">${
    state.selectedActivity.length
      ? state.selectedActivity
          .map((a) => `<li>${esc(a.action)} · ${fmtDate(a.createdAt)}</li>`)
          .join('')
      : '<li>No activity yet.</li>'
  }</ul></div>`

  const statusOptions = STATUSES.map(
    (s) => `<option value="${s}"${s === r.status ? ' selected' : ''}>${s.replace('_', ' ')}</option>`,
  ).join('')

  const noteMsg = state.message
    ? `<p class="note-msg ${esc(state.message.type)}">${esc(state.message.text)}</p>`
    : ''

  return `<aside class="detail">
    <h2>${esc(r.fullName || 'Submission')}</h2>
    <div class="ref">${esc(r.reference)} · ${esc(r.status)}</div>
    <dl>${rows}</dl>
    <div class="section">
      <label for="status">Status</label>
      <select id="status">${statusOptions}</select>
      <label for="notes">Internal notes</label>
      <textarea id="notes">${esc(r.internalNotes || '')}</textarea>
      <div class="actions">
        <button class="primary" id="save">Save</button>
        <button id="archive" class="danger">${r.archivedAt ? 'Restore' : 'Archive'}</button>
      </div>
      ${noteMsg}
    </div>
    ${attachments}
    ${activity}
  </aside>`
}

function render() {
  if (!state.user) return loginForm()

  const tabs = Object.entries(RESOURCES)
    .map(
      ([key, def]) =>
        `<button class="${key === state.resource ? 'active' : ''}" data-resource="${key}">${esc(def.label)}</button>`,
    )
    .join('')

  const statusFilter = `<select id="status-filter"><option value="">All statuses</option>${STATUSES.map(
    (s) => `<option value="${s}"${s === state.status ? ' selected' : ''}>${s.replace('_', ' ')}</option>`,
  ).join('')}</select>`

  const rows = state.items.length
    ? state.items
        .map((item) => {
          const extra = RESOURCES[state.resource].kind === 'quote' ? item.service : item.position || '—'
          return `<tr data-id="${esc(item.id)}" class="${state.selected && state.selected.id === item.id ? 'selected' : ''}">
            <td>${esc(item.reference)}</td>
            <td>${esc(item.fullName)}</td>
            <td>${esc(item.email)}</td>
            <td>${esc(extra)}</td>
            <td><span class="badge ${esc(item.status)}">${esc(item.status)}</span></td>
            <td>${fmtDate(item.createdAt)}</td>
          </tr>`
        })
        .join('')
    : `<tr><td colspan="6" class="empty">No submissions found.</td></tr>`

  const page = Math.floor(state.offset / state.limit) + 1
  const pages = Math.max(1, Math.ceil(state.total / state.limit))

  root.innerHTML = `
    <header class="topbar">
      <div class="brand">VR <span>Enterprises</span> Admin</div>
      <div class="spacer"></div>
      <div class="who">${esc(state.user.name)} · ${esc(state.user.role)}</div>
      <button id="logout">Sign out</button>
    </header>
    <main>
      <section>
        <div class="tabs">${tabs}</div>
        <div class="filters">
          <input class="search" id="search" type="search" placeholder="Search name, email or reference…" value="${esc(
            state.search,
          )}" />
          ${statusFilter}
        </div>
        <table>
          <thead><tr><th>Reference</th><th>Name</th><th>Email</th><th>Service / Position</th><th>Status</th><th>Received</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="pager">
          <span>${state.total} total · page ${page} of ${pages}</span>
          <span>
            <button id="prev" ${state.offset === 0 ? 'disabled' : ''}>Previous</button>
            <button id="next" ${state.offset + state.limit >= state.total ? 'disabled' : ''}>Next</button>
          </span>
        </div>
      </section>
      ${detailPanel()}
    </main>`

  wireDashboard()
}

function wireDashboard() {
  document.getElementById('logout').addEventListener('click', async () => {
    try {
      await api('/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    state.user = null
    state.csrfToken = null
    state.selected = null
    render()
  })

  for (const tab of document.querySelectorAll('.tabs button')) {
    tab.addEventListener('click', async () => {
      state.resource = tab.dataset.resource
      state.offset = 0
      state.selected = null
      await refresh()
    })
  }

  const search = document.getElementById('search')
  let timer = null
  search.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      state.search = search.value.trim()
      state.offset = 0
      await refresh()
    }, 300)
  })

  document.getElementById('status-filter').addEventListener('change', async (e) => {
    state.status = e.target.value
    state.offset = 0
    await refresh()
  })

  for (const row of document.querySelectorAll('tbody tr[data-id]')) {
    row.addEventListener('click', () => openDetail(row.dataset.id))
  }

  document.getElementById('prev').addEventListener('click', async () => {
    state.offset = Math.max(0, state.offset - state.limit)
    await refresh()
  })
  document.getElementById('next').addEventListener('click', async () => {
    state.offset += state.limit
    await refresh()
  })

  const save = document.getElementById('save')
  if (save) {
    save.addEventListener('click', async () => {
      const status = document.getElementById('status').value
      const internalNotes = document.getElementById('notes').value
      save.disabled = true
      try {
        await api(`/${state.resource}/${state.selected.id}`, {
          method: 'PATCH',
          body: { status, internalNotes },
        })
        state.message = { type: 'ok', text: 'Saved.' }
        const id = state.selected.id
        await loadList()
        await openDetail(id)
      } catch (err) {
        state.message = {
          type: 'err',
          text: (err.body && err.body.error && err.body.error.message) || 'Could not save.',
        }
        render()
      }
    })
  }

  const archive = document.getElementById('archive')
  if (archive) {
    archive.addEventListener('click', async () => {
      const currentlyArchived = Boolean(state.selected.archivedAt)
      archive.disabled = true
      try {
        await api(`/${state.resource}/${state.selected.id}`, {
          method: 'PATCH',
          body: { archived: !currentlyArchived },
        })
        state.message = { type: 'ok', text: currentlyArchived ? 'Restored.' : 'Archived.' }
        const id = state.selected.id
        await loadList()
        await openDetail(id)
      } catch (err) {
        state.message = {
          type: 'err',
          text: (err.body && err.body.error && err.body.error.message) || 'Could not update.',
        }
        render()
      }
    })
  }
}

async function refresh() {
  render()
  if (!state.user) return
  try {
    await loadList()
    if (state.selected) {
      const payload = await api(`/${state.resource}/${state.selected.id}`)
      state.selected = payload.data.record
      state.selectedActivity = payload.data.activity || []
      state.selectedAttachments = payload.data.attachments || []
    }
  } catch (err) {
    if (!err || err.status !== 401) {
      state.message = { type: 'err', text: 'Could not load submissions.' }
    }
  }
  render()
}

async function boot() {
  try {
    const payload = await api('/me')
    state.user = payload.data.user
    state.csrfToken = payload.data.csrfToken
  } catch {
    state.user = null
  }
  if (state.user) {
    try {
      await loadList()
    } catch {
      /* ignore */
    }
  }
  render()
}

boot()
