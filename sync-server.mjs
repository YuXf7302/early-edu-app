import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '5173', 10);
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'data-sync.json');
const SYNC_TOKEN = process.env.SYNC_TOKEN || '';

// 确保数据目录存在
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

let store = { profiles: {}, plans: {}, progress: {}, records: {}, milestones: {}, lastUpdate: 0 };
function loadData() { try { store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch { saveData(); } }
function saveData() { store.lastUpdate = Date.now(); fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2)); }
loadData();

// SSE 客户端
const sseClients = [];
function broadcast() {
  const msg = 'data: ' + JSON.stringify({ type: 'sync', data: store }) + '\n\n';
  sseClients.forEach((res, i) => { try { res.write(msg); } catch { sseClients.splice(i, 1); } });
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.json': 'application/json',
};

// 鉴权中间件
function checkAuth(req, res) {
  if (!SYNC_TOKEN) return true;
  const auth = req.headers['authorization'] || '';
  if (auth === 'Bearer ' + SYNC_TOKEN) return true;
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Unauthorized' }));
  return false;
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  const p = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // API 路由（需鉴权）
  if (p.startsWith('/api/')) {
    if (!checkAuth(req, res)) return;

    if (p === '/api/sync' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(store));
      return;
    }

    if (p === '/api/sync' && req.method === 'POST') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const update = JSON.parse(body);
          // 字段级合并
          if (update.profiles) {
            for (const [k, v] of Object.entries(update.profiles)) {
              if (!store.profiles[k] || (v.updatedAt || '') > (store.profiles[k].updatedAt || '')) store.profiles[k] = v;
            }
          }
          if (update.plans) {
            for (const [k, v] of Object.entries(update.plans)) {
              if (!store.plans[k] || (v.updatedAt || '') > (store.plans[k].updatedAt || '')) store.plans[k] = v;
            }
          }
          if (update.progress) Object.assign(store.progress, update.progress);
          if (update.records) Object.assign(store.records, update.records);
          if (update.milestones) Object.assign(store.milestones, update.milestones);
          saveData();
          broadcast();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, lastUpdate: store.lastUpdate }));
        } catch (e) { res.writeHead(400); res.end('Bad Request: ' + e.message); }
      });
      return;
    }

    if (p === '/api/stream') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive',
      });
      res.write('data: {"type":"connected"}\n\n');
      sseClients.push(res);
      req.on('close', () => { const i = sseClients.indexOf(res); if (i >= 0) sseClients.splice(i, 1); });
      return;
    }

    res.writeHead(404); res.end('Not Found');
    return;
  }

  // 静态文件
  let filePath = p === '/' ? '/index.html' : p;
  let file = path.join(dist, filePath);
  if (!fs.existsSync(file)) file = path.join(dist, 'index.html');
  const ext = path.extname(file);
  try {
    const content = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not Found'); }
}).listen(PORT, '0.0.0.0', () => {
  console.log('✅ 早教协同服务 v2 已启动');
  console.log('📍 http://localhost:' + PORT);
  console.log('📁 ' + (SYNC_TOKEN ? '鉴权已开启' : '鉴权未开启（建议设置 SYNC_TOKEN）'));
});
