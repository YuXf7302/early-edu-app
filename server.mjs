import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const PORT = 5173;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let p = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  let file = path.join(dist, p);

  if (!fs.existsSync(file)) {
    file = path.join(dist, 'index.html'); // SPA fallback
  }

  const ext = path.extname(file);
  const type = MIME[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(PORT, HOST, () => {
  console.log(`\n  ✅ 早教应用已启动！
  ─────────────────────────────
  📍 本机访问:    http://localhost:${PORT}/
  📱 同 WiFi:    http://172.16.1.6:${PORT}/
  ─────────────────────────────
  📤 分享给家人（需要手动开防火墙）：
     1. 搜索 "Windows 防火墙"
     2. 点「允许应用通过防火墙」
     3. 点「更改设置」→「允许其他应用」
     4. 选择 node.exe 或添加端口 5173
     5. 手机同 WiFi 打开 http://172.16.1.6:5173/
  ─────────────────────────────`);
});
