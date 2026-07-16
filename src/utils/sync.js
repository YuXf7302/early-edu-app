// 多设备同步引擎 v3 — 支持鉴权 + SSE

const STORE_KEY = 'early-edu-sync-cache'
const TOKEN_KEY = 'early-edu-sync-token'
const POLL_MS = 3000

let baseUrl = ''
try { baseUrl = window.location.origin } catch {}

let cache = null
let listeners = []
let pollTimer = null
let lastUpdate = 0

// 每次请求重新读 token，无需刷新页面
function authHeaders(extra) {
  let token = ''
  try { token = localStorage.getItem(TOKEN_KEY)?.trim() || '' } catch {}
  return token ? { ...extra, Authorization: 'Bearer ' + token } : extra || {}
}

function getUserId() {
  let id = localStorage.getItem('early-edu-user-id')
  if (!id) {
    id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem('early-edu-user-id', id)
  }
  return id
}

export async function syncInit() {
  try {
    const res = await fetch(baseUrl + '/api/sync', { headers: authHeaders(), signal: AbortSignal.timeout(4000) })
    if (res.ok) { cache = await res.json(); lastUpdate = cache.lastUpdate || 0; saveLocal(); startSSE(); return cache }
  } catch {}
  return loadLocal()
}

export async function syncPush(update) {
  if (!cache) cache = { profiles: {}, plans: {}, progress: {}, records: {}, milestones: {}, lastUpdate: 0 }
  if (update.profiles) Object.assign(cache.profiles, update.profiles)
  if (update.plans) Object.assign(cache.plans, update.plans)
  if (update.progress) Object.assign(cache.progress, update.progress)
  if (update.records) Object.assign(cache.records, update.records)
  if (update.milestones) Object.assign(cache.milestones, update.milestones)
  saveLocal()
  try {
    const body = JSON.stringify({ ...update, _userId: getUserId(), _at: Date.now() })
    await fetch(baseUrl + '/api/sync', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body, signal: AbortSignal.timeout(3000) })
  } catch {}
}

export function syncSubscribe(fn) { listeners.push(fn); if (cache) fn(cache); return () => { listeners = listeners.filter(f => f !== fn) } }
export function syncGetCache() { return cache }
export function syncGetUserId() { return getUserId() }

function startSSE() {
  try {
    const es = new EventSource(baseUrl + '/api/stream')
    es.onmessage = e => { try { const msg = JSON.parse(e.data); if (msg.type === 'sync' && msg.data?.lastUpdate > lastUpdate) { cache = msg.data; lastUpdate = msg.data.lastUpdate; saveLocal(); notify() } } catch {} }
    es.onerror = () => { es.close(); startPoll() }
    return
  } catch {}
  startPoll()
}

function startPoll() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(baseUrl + '/api/sync', { headers: authHeaders(), signal: AbortSignal.timeout(3000) })
      if (!res.ok) return
      const server = await res.json()
      if (server.lastUpdate > lastUpdate) { cache = server; lastUpdate = server.lastUpdate; saveLocal(); notify() }
    } catch {}
  }, POLL_MS)
}

function saveLocal() { try { localStorage.setItem(STORE_KEY, JSON.stringify(cache)) } catch {} }
function loadLocal() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) { cache = JSON.parse(raw); lastUpdate = cache.lastUpdate || 0; return cache } } catch {}
  cache = { profiles: {}, plans: {}, progress: {}, records: {}, milestones: {}, lastUpdate: 0 }; return cache
}
function notify() { listeners.forEach(fn => { try { fn(cache) } catch {} }) }

export default { syncInit, syncPush, syncSubscribe, syncGetCache, syncGetUserId }
