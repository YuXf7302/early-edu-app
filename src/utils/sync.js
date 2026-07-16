// 轻量同步层 —— 通过 HTTP POST + SSE 实现多设备数据共享
// fallback：服务器不可用时自动降级到 localStorage

const STORE_KEY = 'early-edu-sync-cache'
const POLL_MS = 3000

// 服务器地址：部署到同一服务器时用当前 origin，跨域开发时可手动改
let baseUrl = ''
try { baseUrl = window.location.origin } catch {}

// 内存缓存
let cache = null
let listeners = []
let pollTimer = null
let lastUpdate = 0

// ====== 同步引擎 ======

// 初始化：从服务器拉数据
export async function syncInit() {
  try {
    const res = await fetch(baseUrl + '/api/sync', { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      cache = await res.json()
      lastUpdate = cache.lastUpdate || 0
      saveLocal()
      startPoll()
      return cache
    }
  } catch {}
  // 服务器不可用 → 从本地缓存恢复
  return loadLocal()
}

// 推送变更到服务器（其他用户通过 SSE / 轮询收到）
export async function syncPush(update) {
  // 先合并到本地
  if (!cache) cache = { profiles: {}, plans: {}, progress: {}, lastUpdate: 0 }
  if (update.profiles) Object.assign(cache.profiles, update.profiles)
  if (update.plans)    Object.assign(cache.plans, update.plans)
  if (update.progress) Object.assign(cache.progress, update.progress)
  saveLocal()

  // 推送到服务器
  try {
    await fetch(baseUrl + '/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
      signal: AbortSignal.timeout(3000),
    })
  } catch {} // 静默降级
}

// 订阅数据变更
export function syncSubscribe(fn) {
  listeners.push(fn)
  // 立即发一次当前数据
  if (cache) fn(cache)
  return () => { listeners = listeners.filter(f => f !== fn) }
}

// 获取当前缓存
export function syncGetCache() { return cache }

// ====== 内部 ======

function notify() {
  listeners.forEach(fn => { try { fn(cache) } catch {} })
}

// 长轮询：定期从服务器拉取最新数据
function startPoll() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(baseUrl + '/api/sync', { signal: AbortSignal.timeout(3000) })
      if (!res.ok) return
      const server = await res.json()
      if (server.lastUpdate > lastUpdate) {
        cache = server
        lastUpdate = server.lastUpdate
        saveLocal()
        notify()
      }
    } catch { /* ignore */ }
  }, POLL_MS)
}

function saveLocal() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(cache)) } catch {}
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) { cache = JSON.parse(raw); lastUpdate = cache.lastUpdate || 0; return cache }
  } catch {}
  cache = { profiles: {}, plans: {}, progress: {}, lastUpdate: 0 }
  return cache
}

export default { syncInit, syncPush, syncSubscribe, syncGetCache }
