#!/usr/bin/env node
// Web UI for the hub. A second front end to the same Router that the CLI
// reaches through tmux: messages typed here are pasted into the Router's tmux
// pane, and the conversation is read back from the Router's session transcript.
// Both front ends therefore see one conversation and one set of work records.
//
//   web/server.mjs [--host 127.0.0.1] [--port 8787]
//
// Environment: CCSA_WEB_HOST, CCSA_WEB_PORT, CCSA_HUB (hub directory; defaults
// to the parent of this file's directory), CCSA_TMUX_SOCKET (default ccsa).
//
// Access needs the token in .webui/token, created on first start. Open the URL
// that the server prints; the browser keeps the token afterwards.
// No dependencies beyond Node itself.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hub = path.resolve(process.env.CCSA_HUB || path.join(here, '..'));
const pub = path.join(here, 'public');
const HOME = process.env.HOME || '/root';
const TMUX = ['-L', process.env.CCSA_TMUX_SOCKET || 'ccsa'];
const PANE = 'ccsa-router';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const host = arg('host', process.env.CCSA_WEB_HOST || '127.0.0.1');
const port = Number(arg('port', process.env.CCSA_WEB_PORT || 8787));

// ---------- token ----------
const tokenFile = path.join(hub, '.webui', 'token');
fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
if (!fs.existsSync(tokenFile)) {
  fs.writeFileSync(tokenFile, crypto.randomBytes(24).toString('base64url') + '\n', { mode: 0o600 });
}
const token = fs.readFileSync(tokenFile, 'utf8').trim();

function authorized(req, url) {
  const h = req.headers.authorization || '';
  const given = h.startsWith('Bearer ') ? h.slice(7) : url.searchParams.get('t') || '';
  const a = Buffer.from(given), b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------- helpers ----------
const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const rel = (...p) => path.join(hub, ...p);

function run(cmd, args, { input, timeout = 15000 } = {}) {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { cwd: hub, timeout, maxBuffer: 4 << 20 }, (err, stdout, stderr) => {
      resolve({ code: err ? (typeof err.code === 'number' ? err.code : 1) : 0, stdout: String(stdout), stderr: String(stderr) });
    });
    if (input !== undefined) { child.stdin.end(input); }
  });
}

// ---------- Router transcript ----------
function sessionId() { return (read(rel('.router', 'session-id')) || '').trim(); }

function transcriptPath(sid) {
  if (!sid) return null;
  const root = path.join(HOME, '.claude', 'projects');
  let dirs = [];
  try { dirs = fs.readdirSync(root); } catch { return null; }
  for (const d of dirs) {
    const p = path.join(root, d, `${sid}.jsonl`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function toolSummary(name, input = {}) {
  const pick = input.description || input.file_path || input.path || input.pattern || input.command || input.prompt || input.url || input.query || '';
  return String(pick).split('\n')[0].slice(0, 160);
}

function textOf(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  return '';
}

// Turn one transcript entry into zero or more chat items.
function itemsFrom(o) {
  const out = [];
  if (o.isSidechain || o.isCompactSummary || o.isMeta) return out;
  const ts = o.timestamp;
  if (o.type === 'user') {
    const kind = o.origin && typeof o.origin === 'object' ? o.origin.kind : undefined;
    const content = o.message && o.message.content;
    if (Array.isArray(content) && content.some((b) => b.type === 'tool_result')) return out;
    const text = textOf(content).trim();
    if (!text) return out;
    if (kind === 'task-notification' || text.startsWith('<task-notification>')) {
      const summary = (text.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || 'Background task finished';
      const status = (text.match(/<status>([\s\S]*?)<\/status>/) || [])[1] || '';
      out.push({ id: o.uuid, role: 'event', ts, text: summary.trim(), status });
    } else if (kind === undefined || kind === 'human') {
      if (text.startsWith('<') && /^<(system-reminder|local-command|command-|bash-)/.test(text)) return out;
      out.push({ id: o.uuid, role: 'user', ts, text });
    }
  } else if (o.type === 'assistant') {
    const blocks = (o.message && o.message.content) || [];
    blocks.forEach((b, i) => {
      if (b.type === 'text' && b.text.trim()) out.push({ id: `${o.uuid}:${i}`, role: 'assistant', ts, text: b.text });
      else if (b.type === 'tool_use') out.push({ id: `${o.uuid}:${i}`, role: 'tool', ts, name: b.name, text: toolSummary(b.name, b.input) });
    });
  }
  return out;
}

const chat = { file: null, offset: 0, rest: '', items: [], seq: 0 };
const MAX_ITEMS = 3000;

function refreshChat() {
  const file = transcriptPath(sessionId());
  if (file !== chat.file) { Object.assign(chat, { file, offset: 0, rest: '', items: [] }); }
  if (!file) return [];
  let size;
  try { size = fs.statSync(file).size; } catch { return []; }
  if (size < chat.offset) { Object.assign(chat, { offset: 0, rest: '', items: [] }); }
  if (size === chat.offset) return [];
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(size - chat.offset);
  fs.readSync(fd, buf, 0, buf.length, chat.offset);
  fs.closeSync(fd);
  chat.offset = size;
  const lines = (chat.rest + buf.toString('utf8')).split('\n');
  chat.rest = lines.pop();
  const fresh = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    for (const it of itemsFrom(o)) { it.seq = ++chat.seq; fresh.push(it); }
  }
  chat.items.push(...fresh);
  if (chat.items.length > MAX_ITEMS) chat.items.splice(0, chat.items.length - MAX_ITEMS);
  return fresh;
}

// ---------- Router pane ----------
async function routerPane() {
  const alive = (await run('tmux', [...TMUX, 'has-session', '-t', PANE])).code === 0;
  if (!alive) return { alive: false, state: 'down', screen: '' };
  const cap = await run('tmux', [...TMUX, 'capture-pane', '-p', '-J', '-t', PANE, '-S', '-60']);
  const screen = cap.stdout.replace(/\s+$/, '');
  const tail = screen.split('\n').slice(-25).join('\n');
  let state = 'idle';
  if (/Do you want to|Would you like to|\(y\/n\)|❯\s*1\.\s|Enter to confirm|Esc to cancel/i.test(tail)) state = 'asking';
  else if (/esc to interrupt/i.test(tail)) state = 'working';
  return { alive: true, state, screen };
}

// ---------- work records ----------
function taskStatus(file) {
  const t = read(rel(file));
  if (t === null) return null;
  const m = t.match(/^- Status:\s*(.+)$/m);
  return m ? m[1].trim() : '';
}

function parseIndex() {
  const text = read(rel('INDEX.md')) || '';
  const alerts = [], tasks = [];
  for (const line of text.split('\n')) {
    if (/⚠\s*Router:/.test(line)) { alerts.push(line.replace(/^[-*\s]+/, '').trim()); continue; }
    if (!line.startsWith('- ')) continue;
    const m = line.match(/\[([^\]]+)\]\((tasks\/[^)]+)\)/);
    if (!m) continue;
    const [, label, file] = m;
    const parts = line.split(' · ');
    const proj = (parts[1] || '').match(/\[([^\]]+)\]/);
    const note = parts.slice(2).join(' · ').trim();
    const idm = label.match(/^(\d+)\s+(.*)$/);
    tasks.push({
      id: idm ? idm[1] : label, title: idm ? idm[2] : label, file,
      project: proj ? proj[1] : (parts[1] || '').trim(),
      note: note.replace(/^⚠\s*/, ''), warn: line.includes('⚠'),
      status: taskStatus(file),
    });
  }
  return { alerts, tasks };
}

function runs() {
  const dir = rel('.runs');
  let ids = [];
  try { ids = fs.readdirSync(dir); } catch { return []; }
  return ids.map((id) => {
    const f = (n) => (read(path.join(dir, id, n)) || '').trim();
    let pending = 0;
    try { pending = fs.readdirSync(path.join(dir, id, 'pending')).length; } catch {}
    return { id, status: f('status'), project: f('project'), started: f('started'), ended: f('ended'), pending };
  }).filter((r) => r.status).sort((a, b) => (b.started || '').localeCompare(a.started || ''));
}

// Every task file not listed in INDEX.md: work that has ended. INDEX.md only
// lists open work, so without this the page would hide everything finished.
function pastTasks(openFiles) {
  let names = [];
  try { names = fs.readdirSync(rel('tasks')).filter((n) => /^[\w.-]+\.md$/.test(n)); } catch { return []; }
  return names.map((n) => {
    const file = `tasks/${n}`;
    if (openFiles.has(file)) return null;
    const t = read(rel(file)) || '';
    const head = (t.match(/^#\s+(.+)$/m) || [])[1] || n.replace(/\.md$/, '');
    const idm = head.match(/^(\d+)\s+(.*)$/);
    const field = (k) => ((t.match(new RegExp(`^- ${k}:\\s*(.+)$`, 'm')) || [])[1] || '').trim();
    const proj = field('Project');
    const outcome = ((t.split(/^## Outcome\s*$/m)[1] || '').trim().split('\n')[0] || '').slice(0, 200);
    // When it ended: the last dated line of its log, else the file's mtime.
    const dates = [...(t.split(/^## Log\s*$/m)[1] || '').matchAll(/^- (\d{4}-\d{2}-\d{2}(?:[T ][\d:]+)?)/gm)].map((m) => m[1]);
    let mtime = dates.length ? dates[dates.length - 1] : '';
    if (!mtime) { try { mtime = fs.statSync(rel(file)).mtime.toISOString(); } catch {} }
    return {
      id: idm ? idm[1] : head, title: idm ? idm[2] : head, file,
      project: (proj.match(/\[([^\]]+)\]/) || [])[1] || proj,
      status: field('Status'), outcome, updated: mtime,
    };
  }).filter(Boolean).sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
}

async function state() {
  const paused = read(rel('.paused'));
  const index = parseIndex();
  return {
    hub: path.basename(hub),
    router: await routerPane(),
    paused: paused ? paused.trim() : null,
    index,
    past: pastTasks(new Set(index.tasks.map((t) => t.file))),
    runs: runs(),
  };
}

// ---------- actions ----------
const KEYS = { enter: 'Enter', esc: 'Escape', up: 'Up', down: 'Down', tab: 'Tab', '1': '1', '2': '2', '3': '3', y: 'y', n: 'n' };

async function sendToRouter(text) {
  const pane = await routerPane();
  if (!pane.alive) return { ok: false, error: 'router-down' };
  const buf = 'ccsa-web';
  let r = await run('tmux', [...TMUX, 'load-buffer', '-b', buf, '-'], { input: text });
  if (r.code) return { ok: false, error: r.stderr.trim() || 'load-buffer failed' };
  r = await run('tmux', [...TMUX, 'paste-buffer', '-p', '-d', '-b', buf, '-t', PANE]);
  if (r.code) return { ok: false, error: r.stderr.trim() || 'paste-buffer failed' };
  await new Promise((res) => setTimeout(res, 250));
  r = await run('tmux', [...TMUX, 'send-keys', '-t', PANE, 'Enter']);
  return r.code ? { ok: false, error: r.stderr.trim() } : { ok: true };
}

// ---------- HTTP ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'",
};

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', ...SECURITY });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function body(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1 << 20) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
  });
}

const clients = new Set();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;

  if (!p.startsWith('/api/')) {
    const name = p === '/' ? 'index.html' : p.slice(1);
    if (!/^[\w.-]+$/.test(name)) return send(res, 404, 'Not found', 'text/plain');
    const file = path.join(pub, name);
    const data = read(file);
    if (data === null) return send(res, 404, 'Not found', 'text/plain');
    return send(res, 200, data, TYPES[path.extname(name)] || 'application/octet-stream');
  }

  if (!authorized(req, url)) return send(res, 401, { error: 'unauthorized' });

  try {
    if (req.method === 'GET' && p === '/api/state') return send(res, 200, await state());

    if (req.method === 'GET' && p === '/api/chat') {
      refreshChat();
      const limit = Math.min(Number(url.searchParams.get('limit')) || 400, MAX_ITEMS);
      return send(res, 200, { items: chat.items.slice(-limit), seq: chat.seq });
    }

    if (req.method === 'GET' && p === '/api/task') {
      const file = url.searchParams.get('file') || '';
      if (!/^tasks\/[\w.-]+\.md$/.test(file)) return send(res, 400, { error: 'bad file' });
      const text = read(rel(file));
      return text === null ? send(res, 404, { error: 'not found' }) : send(res, 200, { file, text });
    }

    if (req.method === 'GET' && p === '/api/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', ...SECURITY });
      res.write('retry: 3000\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }

    if (req.method === 'POST' && p === '/api/send') {
      const { text } = await body(req);
      if (typeof text !== 'string' || !text.trim()) return send(res, 400, { error: 'empty' });
      const r = await sendToRouter(text.replace(/\r\n/g, '\n'));
      return send(res, r.ok ? 200 : 409, r);
    }

    if (req.method === 'POST' && p === '/api/key') {
      const { key } = await body(req);
      if (!KEYS[key]) return send(res, 400, { error: 'key not allowed' });
      const r = await run('tmux', [...TMUX, 'send-keys', '-t', PANE, KEYS[key]]);
      return send(res, r.code ? 409 : 200, { ok: !r.code });
    }

    if (req.method === 'POST' && p === '/api/router/start') {
      const r = await run(rel('router', 'start.sh'), []);
      return send(res, r.code ? 500 : 200, { ok: !r.code, output: (r.stdout + r.stderr).trim() });
    }

    if (req.method === 'POST' && (p === '/api/pause' || p === '/api/resume')) {
      const { reason } = await body(req);
      const script = rel('bin', p === '/api/pause' ? 'pause' : 'resume');
      const args = p === '/api/pause' && typeof reason === 'string' && reason.trim() ? [reason.trim().slice(0, 300)] : [];
      const r = await run(script, args);
      return send(res, r.code ? 500 : 200, { ok: !r.code, output: (r.stdout + r.stderr).trim() });
    }

    return send(res, 404, { error: 'not found' });
  } catch (e) {
    return send(res, 500, { error: String(e && e.message || e) });
  }
});

// Push changes to open pages.
let lastState = '';
async function tick() {
  if (!clients.size) return;
  const fresh = refreshChat();
  const s = await state();
  const sig = JSON.stringify(s);
  const msgs = [];
  if (fresh.length) msgs.push(`event: chat\ndata: ${JSON.stringify({ items: fresh, seq: chat.seq })}\n\n`);
  if (sig !== lastState) { lastState = sig; msgs.push(`event: state\ndata: ${sig}\n\n`); }
  if (!msgs.length) msgs.push(': ping\n\n');
  for (const c of clients) for (const m of msgs) c.write(m);
}
let ticking = false;
setInterval(async () => {
  if (ticking) return;
  ticking = true;
  try { await tick(); } catch {} finally { ticking = false; }
}, 1500);

server.listen(port, host, () => {
  const shown = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
  console.log(`Web UI for ${hub}`);
  console.log(`Open: http://${shown}:${port}/#t=${token}`);
  if (host === '127.0.0.1' || host === 'localhost') {
    console.log('Listening on this machine only. From another computer: ssh -L ' + port + ':localhost:' + port + ' <server>');
  }
});

