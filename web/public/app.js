'use strict';

// ---------- strings ----------
const STRINGS = {
  en: {
    brand: 'Super-agent',
    loginTitle: 'Sign in to your hub',
    loginHelp: 'On the server, run web/start.sh and open the address it prints. Or paste the token from .webui/token here.',
    loginLabel: 'Access token',
    loginWrong: 'That token was not accepted. Copy it again from .webui/token.',
    loginButton: 'Sign in',
    work: 'Work',
    close: 'Close',
    inputLabel: 'Message to the Router',
    inputPlaceholder: 'Tell the Router what you need…',
    send: 'Send',
    hint: 'Enter sends, Shift+Enter adds a line. The terminal and this page share one conversation.',
    inFlight: 'In flight',
    workers: 'Workers',
    showTerminal: 'Show the Router terminal',
    terminal: 'Router terminal',
    terminalNote: 'What the Router’s terminal shows right now. Use the keys below to answer a prompt.',
    noTasks: 'Nothing in flight. New work appears here as soon as the Router takes it on.',
    noRuns: 'No Worker has run yet.',
    emptyTitle: 'Talk to one agent',
    emptyBody: 'Describe the work in your own words. The Router hands it to a Worker in the right project and tells you when there is a result or a decision for you.',
    online: 'Router online',
    working: 'Router is working',
    asking: 'Router needs you',
    down: 'Router is not running',
    thinking: 'The Router is working on it…',
    stepOne: 'The Router took 1 step',
    steps: (n) => `The Router took ${n} steps`,
    askTitle: 'The Router is waiting for your answer',
    askBody: 'It is asking in its terminal, usually for permission to run something. The prompt is shown as it appears.',
    downTitle: 'The Router is not running',
    downBody: 'Messages cannot be delivered until it starts.',
    startRouter: 'Start the Router',
    starting: 'Starting…',
    pause: 'Pause all work',
    resume: 'Resume work',
    pausedSince: (r) => `Paused: ${r}`,
    pauseReason: 'Why are you pausing? (optional)',
    sendFailed: 'Not delivered: the Router is not running.',
    sendError: (e) => `Not delivered: ${e}`,
    lost: 'Connection lost. Reconnecting…',
    status: { open: 'In progress', waiting: 'Waiting for you', 'on hold': 'On hold', done: 'Done', dropped: 'Dropped' },
    run: { running: 'Running', queued: 'Queued', retrying: 'Retrying', paused: 'Paused', ok: 'Finished', failed: 'Failed' },
    keys: { '1': 'Option 1', '2': 'Option 2', '3': 'Option 3', enter: 'Enter', esc: 'Esc', up: '↑', down: '↓' },
    ago: { now: 'just now', m: (n) => `${n} min ago`, h: (n) => `${n} h ago`, d: (n) => `${n} d ago` },
    pending: (n) => `${n} waiting`,
  },
  zh: {
    brand: 'Super-agent',
    loginTitle: '登录你的 Super-agent',
    loginHelp: '在服务器上运行 web/start.sh，打开它打印出来的网址即可。也可以把 .webui/token 里的口令粘贴到这里。',
    loginLabel: '访问口令',
    loginWrong: '口令不对。请从 .webui/token 重新复制。',
    loginButton: '登录',
    work: '工作',
    close: '关闭',
    inputLabel: '发给 Router 的消息',
    inputPlaceholder: '告诉 Router 你要做什么…',
    send: '发送',
    hint: 'Enter 发送，Shift+Enter 换行。终端和网页是同一个对话。',
    inFlight: '进行中',
    workers: 'Worker',
    showTerminal: '查看 Router 终端',
    terminal: 'Router 终端',
    terminalNote: 'Router 终端此刻的画面。需要回答提示时，用下面的按键。',
    noTasks: '现在没有进行中的工作。Router 接下新活后会出现在这里。',
    noRuns: '还没有 Worker 运行过。',
    emptyTitle: '只跟一个助手说话',
    emptyBody: '用你自己的话描述要做的事。Router 会交给对应项目里的 Worker 去做，有结果或需要你决定时再告诉你。',
    online: 'Router 在线',
    working: 'Router 正在处理',
    asking: 'Router 在等你',
    down: 'Router 没在运行',
    thinking: 'Router 正在处理…',
    stepOne: 'Router 做了 1 步操作',
    steps: (n) => `Router 做了 ${n} 步操作`,
    askTitle: 'Router 在等你回答',
    askBody: '它在终端里提问，通常是请你允许执行某个操作。下面是提示的原样内容。',
    downTitle: 'Router 没在运行',
    downBody: '启动之前，消息发不出去。',
    startRouter: '启动 Router',
    starting: '正在启动…',
    pause: '暂停所有工作',
    resume: '恢复工作',
    pausedSince: (r) => `已暂停：${r}`,
    pauseReason: '暂停的原因（可不填）',
    sendFailed: '没发出去：Router 没在运行。',
    sendError: (e) => `没发出去：${e}`,
    lost: '连接断开，正在重连…',
    status: { open: '进行中', waiting: '等你回复', 'on hold': '已叫停', done: '已完成', dropped: '已放弃' },
    run: { running: '运行中', queued: '排队中', retrying: '重试中', paused: '已暂停', ok: '已结束', failed: '失败' },
    keys: { '1': '选项 1', '2': '选项 2', '3': '选项 3', enter: '回车', esc: 'Esc', up: '↑', down: '↓' },
    ago: { now: '刚刚', m: (n) => `${n} 分钟前`, h: (n) => `${n} 小时前`, d: (n) => `${n} 天前` },
    pending: (n) => `${n} 条待处理`,
  },
};
const lang = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
const T = STRINGS[lang];
document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = T[el.dataset.i18n]; });
document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = T[el.dataset.i18nPlaceholder]; });

// ---------- tiny helpers ----------
const $ = (id) => document.getElementById(id);
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) el.append(k instanceof Node ? k : String(k));
  return el;
}
function ago(iso) {
  const t = Date.parse(iso);
  if (!t) return '';
  const s = (Date.now() - t) / 1000;
  if (s < 60) return T.ago.now;
  if (s < 3600) return T.ago.m(Math.floor(s / 60));
  if (s < 86400) return T.ago.h(Math.floor(s / 3600));
  return T.ago.d(Math.floor(s / 86400));
}
function clock(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ---------- markdown (escape first, then a small safe subset) ----------
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, p, u) => `${p}<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}
function markdown(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isTableSep = (l) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(l);
  const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => inline(c.trim()));
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
    } else if (/^\s*$/.test(l)) { i++; }
    else if (/^#{1,6}\s/.test(l)) { out.push(`<h3>${inline(l.replace(/^#+\s*/, ''))}</h3>`); i++; }
    else if (/^\s*>/.test(l)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${markdown(buf.join('\n'))}</blockquote>`);
    } else if (/\|/.test(l) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = cells(l);
      i += 2;
      const rows = [];
      while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) rows.push(cells(lines[i++]));
      out.push(`<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) {
      const ordered = /^\s*\d/.test(l);
      const items = [];
      while (i < lines.length && (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, ''));
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</${tag}>`);
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(```|#{1,6}\s|\s*>|\s*([-*+]|\d+[.)])\s+)/.test(lines[i])) buf.push(inline(lines[i++]));
      out.push(`<p>${buf.join('<br>')}</p>`);
    }
  }
  return out.join('');
}

// ---------- API ----------
let token = '';
const fromHash = new URLSearchParams(location.hash.slice(1)).get('t');
if (fromHash) {
  localStorage.setItem('ccsa-token', fromHash);
  history.replaceState(null, '', location.pathname);
}
token = localStorage.getItem('ccsa-token') || '';

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (res.status === 401) { showLogin(true); throw new Error('unauthorized'); }
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) { const e = new Error(data.error || res.statusText); e.data = data; throw e; }
  return data;
}
const post = (path, data = {}) => api(path, { method: 'POST', body: JSON.stringify(data) });

// ---------- login ----------
function showLogin(wrong) {
  $('app').hidden = true;
  $('login').hidden = false;
  $('login-error').hidden = !wrong;
  $('login-token').focus();
}
$('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  token = $('login-token').value.trim();
  localStorage.setItem('ccsa-token', token);
  start();
});

// ---------- chat rendering ----------
const messages = $('messages');
const scroller = $('chat-scroll');
let lastSeq = 0;
let group = null; // current activity group element
let pendingEls = [];

function nearBottom() { return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120; }
function toBottom() { scroller.scrollTop = scroller.scrollHeight; }

function renderItem(it) {
  if (it.role === 'tool') {
    if (!group) {
      group = h('details', { class: 'activity' }, h('summary'), h('ol'));
      messages.append(group);
    }
    group.querySelector('ol').append(h('li', {}, h('span', { class: 'tool' }, it.name), ' ', it.text));
    const n = group.querySelectorAll('li').length;
    group.querySelector('summary').textContent = n === 1 ? T.stepOne : T.steps(n);
    return;
  }
  group = null;
  if (it.role === 'user') {
    const i = pendingEls.findIndex((p) => p.dataset.text === it.text.trim());
    if (i >= 0) { pendingEls[i].remove(); pendingEls.splice(i, 1); }
    messages.append(h('div', { class: 'msg user' }, it.text, h('time', { datetime: it.ts }, clock(it.ts))));
  } else if (it.role === 'assistant') {
    const el = h('div', { class: 'msg assistant md' });
    el.innerHTML = markdown(it.text);
    messages.append(el);
  } else if (it.role === 'event') {
    const bad = it.status && it.status !== 'completed';
    messages.append(h('div', { class: 'event' }, h('span', { class: `lamp ${bad ? 'stop' : 'go'}` }), it.text));
  }
}

function addItems(items, { initial } = {}) {
  const stick = initial || nearBottom();
  const empty = messages.querySelector('.empty');
  for (const it of items) {
    if (it.seq <= lastSeq) continue;
    if (empty && empty.isConnected) empty.remove();
    renderItem(it);
    lastSeq = it.seq;
  }
  placeThinking();
  if (!messages.children.length) {
    messages.append(h('div', { class: 'empty' }, h('strong', {}, T.emptyTitle), T.emptyBody));
  }
  if (stick) toBottom();
}

let thinkingEl = null;
let routerState = 'idle';
function placeThinking() {
  if (thinkingEl) thinkingEl.remove();
  thinkingEl = null;
  if (routerState === 'working') {
    thinkingEl = h('div', { class: 'thinking' }, h('span', { class: 'lamp go pulse' }), T.thinking);
    messages.append(thinkingEl);
  }
}

// ---------- state rendering ----------
let current = null;

function taskLamp(t) {
  if (t.warn) return 'stop';
  const s = (t.status || '').toLowerCase();
  if (s.startsWith('waiting')) return 'wait';
  if (s.startsWith('on hold')) return '';
  return 'go';
}
function taskStatusText(t) {
  const s = (t.status || '').toLowerCase();
  const key = Object.keys(T.status).find((k) => s.startsWith(k));
  return key ? T.status[key] : t.status;
}
function runInfo(r) {
  const s = r.status;
  if (s.startsWith('running')) return { lamp: 'go pulse', text: T.run.running, active: true };
  if (s.startsWith('queued')) return { lamp: 'wait', text: T.run.queued, active: true };
  if (s.startsWith('retrying')) return { lamp: 'wait pulse', text: T.run.retrying, active: true };
  if (s.startsWith('paused')) return { lamp: '', text: T.run.paused, active: true };
  if (s === 'exited 0') return { lamp: '', text: T.run.ok, active: false };
  return { lamp: 'stop', text: T.run.failed, active: false };
}

function renderState(s) {
  current = s;
  const r = s.router;
  routerState = r.state;

  // header
  const label = { idle: T.online, working: T.working, asking: T.asking, down: T.down }[r.state];
  const lamp = { idle: 'go', working: 'go pulse', asking: 'wait pulse', down: 'stop' }[r.state];
  $('router-status').replaceChildren(h('span', { class: `lamp ${lamp}` }), h('span', { class: 'label' }, label));
  $('send').disabled = r.state === 'down';

  // banner
  const banner = $('banner');
  if (r.state === 'down') {
    banner.className = 'banner down';
    banner.replaceChildren(
      h('h3', {}, T.downTitle), h('p', {}, T.downBody),
      h('div', { class: 'row' }, h('button', { class: 'primary', onclick: startRouter }, T.startRouter)),
    );
    banner.hidden = false;
  } else if (r.state === 'asking') {
    banner.className = 'banner';
    const tail = r.screen.split('\n').slice(-16).join('\n');
    banner.replaceChildren(h('h3', {}, T.askTitle), h('p', {}, T.askBody), h('pre', { class: 'screen' }, tail), keyRow(tail));
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }

  // tasks
  const alerts = $('alerts');
  alerts.replaceChildren(...s.index.alerts.map((a) => h('p', { class: 'alert' }, a)));
  const tasks = $('tasks');
  if (!s.index.tasks.length) tasks.replaceChildren(h('li', {}, h('p', { class: 'none' }, T.noTasks)));
  else tasks.replaceChildren(...s.index.tasks.map((t) => h('li', {},
    h('button', { onclick: () => openTask(t) },
      h('span', { class: `lamp ${taskLamp(t)}` }),
      h('span', { class: 't' }, h('span', { class: 'n' }, t.id), t.title),
      h('span', { class: 'p' }, [t.project, taskStatusText(t)].filter(Boolean).join(' / ')),
      t.note ? h('span', { class: `s${t.warn ? ' warn' : ''}` }, t.note) : null,
    ))));

  // runs
  const runs = s.runs.map((x) => ({ ...x, info: runInfo(x) }));
  const shown = [...runs.filter((x) => x.info.active), ...runs.filter((x) => !x.info.active).slice(0, 5)];
  const runsEl = $('runs');
  if (!shown.length) runsEl.replaceChildren(h('li', {}, h('p', { class: 'none' }, T.noRuns)));
  else runsEl.replaceChildren(...shown.map((x) => h('li', { class: x.info.active ? '' : 'past', title: x.project },
    h('span', { class: `lamp ${x.info.lamp}` }),
    h('span', { class: 'where' }, `${x.id} · ${x.project.split('/').pop() || x.project} · ${x.info.text}${x.pending ? ` · ${T.pending(x.pending)}` : ''}`),
    h('span', { class: 'when' }, ago(x.info.active ? x.started : (x.ended || x.started))),
  )));

  // pause
  const pa = $('pause-area');
  if (s.paused) {
    pa.replaceChildren(
      h('p', { class: 'pause-note' }, T.pausedSince(s.paused.replace(/^\S+\s*/, '') || s.paused)),
      h('button', { class: 'ghost', onclick: resumeHub }, T.resume),
    );
  } else {
    pa.replaceChildren(h('button', { class: 'ghost', onclick: pauseHub }, T.pause));
  }

  // terminal dialog, if open
  if ($('term-dialog').open) $('term-screen').textContent = r.screen || '';
  placeThinking();
}

// Buttons for a terminal prompt. Numbered options ("❯ 1. Yes") become buttons
// labelled with their own text; without them, offer the generic keys.
function keyRow(screen) {
  const opts = [];
  for (const line of screen.split('\n')) {
    const m = line.match(/^\s*(?:[❯>]\s*)?([1-9])\.\s+(.+?)\s*$/);
    if (m && ['1', '2', '3'].includes(m[1]) && !opts.some((o) => o.key === m[1])) opts.push({ key: m[1], text: m[2] });
  }
  const buttons = opts.length
    ? [...opts.map((o, i) => h('button', { class: i === 0 ? 'primary' : 'ghost', onclick: () => pressKey(o.key) }, o.text)),
       h('button', { class: 'ghost', onclick: () => pressKey('esc') }, T.keys.esc)]
    : ['enter', 'esc', 'up', 'down'].map((k) => h('button', { class: k === 'enter' ? 'primary' : 'ghost', onclick: () => pressKey(k) }, T.keys[k]));
  return h('div', { class: 'row' }, ...buttons);
}

// ---------- actions ----------
async function pressKey(key) {
  try { await post('/api/key', { key }); } catch {}
  setTimeout(refreshState, 400);
}
async function startRouter(e) {
  const b = e.currentTarget;
  b.disabled = true; b.textContent = T.starting;
  try { await post('/api/router/start'); } catch {}
  setTimeout(refreshState, 1500);
}
async function pauseHub() {
  const reason = prompt(T.pauseReason, '');
  if (reason === null) return;
  try { await post('/api/pause', { reason }); } catch {}
  refreshState();
}
async function resumeHub() {
  try { await post('/api/resume'); } catch {}
  refreshState();
}
async function openTask(t) {
  const d = $('task-dialog');
  $('task-dialog-title').textContent = `${t.id} ${t.title}`;
  $('task-dialog-body').textContent = '…';
  d.showModal();
  try {
    const r = await api(`/api/task?file=${encodeURIComponent(t.file)}`);
    $('task-dialog-body').innerHTML = markdown(r.text.replace(/^# .*\n/, ''));
  } catch (e) { $('task-dialog-body').textContent = e.message; }
}
$('show-terminal').addEventListener('click', () => {
  $('term-screen').textContent = (current && current.router.screen) || '';
  $('term-keys').replaceChildren(...['1', '2', '3', 'up', 'down', 'enter', 'esc'].map((k) =>
    h('button', { class: 'ghost', onclick: () => pressKey(k) }, T.keys[k])));
  $('term-dialog').showModal();
  const sc = $('term-screen'); sc.scrollTop = sc.scrollHeight;
});
document.querySelectorAll('dialog [data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

// composer
const input = $('input');
function grow() { input.style.height = 'auto'; input.style.height = `${input.scrollHeight}px`; }
input.addEventListener('input', grow);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
    e.preventDefault();
    $('composer').requestSubmit();
  }
});
$('composer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value;
  if (!text.trim()) return;
  const el = h('div', { class: 'msg user pending', 'data-text': text.trim() }, text);
  messages.querySelector('.empty')?.remove();
  messages.append(el);
  pendingEls.push(el);
  input.value = ''; grow(); toBottom();
  try {
    await post('/api/send', { text });
  } catch (err) {
    el.remove(); pendingEls = pendingEls.filter((p) => p !== el);
    input.value = text; grow();
    const msg = err.data && err.data.error === 'router-down' ? T.sendFailed : T.sendError(err.message);
    messages.append(h('div', { class: 'event' }, h('span', { class: 'lamp stop' }), msg));
    toBottom();
  }
});

// side panel on narrow screens
function setPanel(open) {
  $('side').classList.toggle('open', open);
  $('panel-toggle').setAttribute('aria-expanded', String(open));
}
$('panel-toggle').addEventListener('click', () => setPanel(!$('side').classList.contains('open')));
$('panel-close').addEventListener('click', () => setPanel(false));

// ---------- live updates ----------
async function refreshState() {
  try { renderState(await api('/api/state')); } catch {}
}
let source = null;
let lostEl = null;
function connect() {
  if (source) source.close();
  source = new EventSource(`/api/events?t=${encodeURIComponent(token)}`);
  source.addEventListener('chat', (e) => addItems(JSON.parse(e.data).items));
  source.addEventListener('state', (e) => renderState(JSON.parse(e.data)));
  source.addEventListener('open', () => { lostEl?.remove(); lostEl = null; resync(); });
  source.addEventListener('error', () => {
    if (!lostEl) { lostEl = h('div', { class: 'event' }, h('span', { class: 'lamp wait pulse' }), T.lost); messages.append(lostEl); }
  });
}
async function resync() {
  try {
    const c = await api('/api/chat');
    if (c.seq < lastSeq) { messages.replaceChildren(); lastSeq = 0; group = null; }
    addItems(c.items, { initial: lastSeq === 0 });
  } catch {}
}

async function start() {
  try {
    const s = await api('/api/state');
    $('login').hidden = true;
    $('app').hidden = false;
    renderState(s);
    const c = await api('/api/chat');
    addItems(c.items, { initial: true });
    connect();
    input.focus();
  } catch (e) {
    if (e.message !== 'unauthorized') showLogin(false);
  }
}
if (token) start(); else showLogin(false);
setInterval(() => { if (current) renderState(current); }, 60000);
