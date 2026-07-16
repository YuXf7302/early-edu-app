// 早教计划 —— 轻量协同服务器（零外部依赖，只用 Node.js 内置模块）
// 同时提供静态文件服务 + 数据同步 API

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const DATA_FILE = path.join(__dirname, 'data-sync.json');
const PORT = process.env.PORT || 5173;

// ====== 数据存储（内存 + JSON 文件持久化） ======
let store = {
  profiles: {},    // 按用户 ID 存储（每人可以有自己的设置）
  plans: {},       // 按 planKey 存储
  progress: {},    // 按日期存储打卡记录
  lastUpdate: 0,
};

function loadData() {
  try { store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch { saveData(); }
}
function saveData() {
  store.lastUpdate = Date.now();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}
loadData();

// ====== SSE 客户端连接池 ======
const sseClients = [];
function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((res, i) => {
    try { res.write(msg); } catch { sseClients.splice(i, 1); }
  });
}

// ====== MIME 类型 ======
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

// ====== HTTP 服务 ======
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;

  // CORS（前端可能部署在不同域名上）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ====== API：获取全量数据 ======
  if (p === '/api/sync' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store));
    return;
  }

  // ====== API：推送本地变更 ======
  if (p === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        // 合并数据，不覆盖其他人的（按 key 级别合并）
        if (update.profiles) Object.assign(store.profiles, update.profiles);
        if (update.plans)    Object.assign(store.plans, update.plans);
        if (update.progress) Object.assign(store.progress, update.progress);
        saveData();
        broadcast({ type: 'sync', data: store, changedBy: update._userId || 'unknown', at: store.lastUpdate });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, lastUpdate: store.lastUpdate }));
      } catch (e) {
        res.writeHead(400);
        res.end('Bad Request: ' + e.message);
      }
    });
    return;
  }

  // ====== API：SSE 实时推送 ======
  if (p === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(':ok\n\n');
    sseClients.push(res);
    req.on('close', () => {
      const i = sseClients.indexOf(res);
      if (i >= 0) sseClients.splice(i, 1);
    });
    return;
  }

  // ====== 静态文件服务 ======
  let filePath = p === '/' ? '/index.html' : p;
  let file = path.join(dist, filePath);
  if (!fs.existsSync(file)) file = path.join(dist, 'index.html'); // SPA fallback
  const ext = path.extname(file);
  try {
    const content = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ✅ 早教协同服务已启动！`);
  console.log(`  📍 地址: http://localhost:${PORT}/`);
  console.log(`  🔄 同步 API: http://localhost:${PORT}/api/sync`);
  console.log(`  📡 SSE: http://localhost:${PORT}/api/stream\n`);
});
