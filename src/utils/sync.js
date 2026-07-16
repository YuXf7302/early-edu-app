// 多设备同步引擎 v2 — 支持 SSE 实时 + userId + 鉴权

const STORE_KEY = 'early-edu-sync-cache'
const POLL_MS = 3000

let baseUrl = ''
try { baseUrl = window.location.origin } catch {}

let cache = null
let listeners = []
let pollTimer = null
let lastUpdate = 0

// 设备唯一标识（localStorage 持久化）
function getUserId() {
  let id = localStorage.getItem('early-edu-user-id')
  if (!id) {
    id = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem('early-edu-user-id', id)
  }
  return id
}

// 读取 SYNC_TOKEN（从环境变量或 localStorage 配置）
function getToken() {
  try { return localStorage.getItem('early-edu-sync-token') || '' } catch { return '' }
}

function headers() {
  const t = getToken()
  return t ? { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

// ====== 初始化：拉数据 + 启动轮询/SSE ======
export async function syncInit() {
  try {
    const res = await fetch(baseUrl + '/api/sync', { headers: headers(), signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      cache = await res.json()
      lastUpdate = cache.lastUpdate || 0
      saveLocal()
      startSSE()
      return cache
    }
  } catch {}
  return loadLocal()
}

// ====== 推送变更 ======
export async function syncPush(update) {
  if (!cache) cache = { profiles: {}, plans: {}, progress: {}, records: {}, milestones: {}, lastUpdate: 0 }
  // 本地合并
  if (update.profiles) Object.assign(cache.profiles, update.profiles)
  if (update.plans) Object.assign(cache.plans, update.plans)
  if (update.progress) Object.assign(cache.progress, update.progress)
  if (update.records) Object.assign(cache.records, update.records)
  if (update.milestones) Object.assign(cache.milestones, update.milestones)
  saveLocal()
  // 推服务器
  try {
    const body = JSON.stringify({ ...update, _userId: getUserId(), _at: Date.now() })
    await fetch(baseUrl + '/api/sync', { method: 'POST', headers: headers(), body, signal: AbortSignal.timeout(3000) })
  } catch {}
}

// ====== 订阅变更 ======
export function syncSubscribe(fn) {
  listeners.push(fn)
  if (cache) fn(cache)
  return () => { listeners = listeners.filter(f => f !== fn) }
}

export function syncGetCache() { return cache }
export function syncGetUserId() { return getUserId() }

// ====== SSE 实时连接 ======
function startSSE() {
  try {
    const es = new EventSource(baseUrl + '/api/stream')
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'sync' && msg.data && msg.data.lastUpdate > lastUpdate) {
          cache = msg.data
          lastUpdate = msg.data.lastUpdate
          saveLocal()
          notify()
        }
      } catch {}
    }
    es.onerror = () => { es.close(); startPoll() }
    return
  } catch {}
  startPoll()
}

function startPoll() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(baseUrl + '/api/sync', { headers: headers(), signal: AbortSignal.timeout(3000) })
      if (!res.ok) return
      const server = await res.json()
      if (server.lastUpdate > lastUpdate) { cache = server; lastUpdate = server.lastUpdate; saveLocal(); notify() }
    } catch {}
  }, POLL_MS)
}

function saveLocal() { try { localStorage.setItem(STORE_KEY, JSON.stringify(cache)) } catch {} }
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) { cache = JSON.parse(raw); lastUpdate = cache.lastUpdate || 0; return cache }
  } catch {}
  cache = { profiles: {}, plans: {}, progress: {}, records: {}, milestones: {}, lastUpdate: 0 }
  return cache
}
function notify() { listeners.forEach(fn => { try { fn(cache) } catch {} }) }

export default { syncInit, syncPush, syncSubscribe, syncGetCache, syncGetUserId }
