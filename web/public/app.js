'use strict';

// ---------- strings ----------
const STRINGS = {
  en: {
    loginTitle: 'Sign in to your hub',
    loginHelp: 'On the server, run web/start.sh and open the address it prints. Or paste the token from .webui/token here.',
    loginLabel: 'Access token',
    loginWrong: 'That token was not accepted. Copy it again from .webui/token.',
    loginButton: 'Sign in',
    work: 'Work',
    close: 'Close',
    chat: 'Chat',
    terminal: 'Terminal',
    inputLabel: 'Message to the Router',
    inputPlaceholder: 'Tell the Router what you need…',
    send: 'Send',
    hint: 'Enter to send · Shift+Enter for a new line · the terminal shares this conversation',
    inFlight: 'Tasks',
    groupOpen: 'In flight',
    collapse: 'Collapse the sidebar',
    expand: 'Expand the sidebar',
    group: 'Work group',
    groupSub: (w, m) => `Router and ${w} Worker${w === 1 ? '' : 's'} · ${m} messages`,
    all: 'All',
    flag: 'Not right',
    more: 'Show all',
    less: 'Show less',
    stepsOf: (id, n) => `${n} progress note${n === 1 ? '' : 's'} from Worker ${id}`,
    kindBrief: 'Brief',
    kindReport: 'Report',
    kindSend: 'Message',
    workerName: (id) => `Worker ${id}`,
    noFeed: 'No messages between the Router and its Workers yet.',
    noFeedTask: 'No messages for this task yet.',
    viewTask: 'Task details',
    quoting: 'Quoting',
    removeQuote: 'Remove quote',
    quotePlaceholder: 'Say what is not right…',
    quoteIntro: 'About this message in the work group, which I think is not right:',
    quoteWhere: (desc, when, src) => `(${desc}, ${when}; full text in ${src})`,
    quoteDefault: '(Please check this message.)',
    groupEnded: 'Ended',
    workers: 'Workers',
    terminalNote: 'What the Router’s terminal shows right now. Use the keys below to answer a prompt.',
    noTasks: 'Nothing in flight.\nNew work appears here once the Router takes it on.',
    noRuns: 'No Worker has run yet.',
    emptyTitle: 'Talk to one agent',
    emptyBody: 'Describe the work in your own words. The Router hands it to a Worker in the right project and tells you when there is a result or a decision for you.',
    online: 'Online',
    working: 'Working…',
    asking: 'Waiting for your answer',
    down: 'Not running',
    thinking: 'The Router is working on it…',
    stepOne: 'Took 1 step',
    steps: (n) => `Took ${n} steps`,
    askTitle: 'Permission required',
    askBody: 'The Router is asking in its terminal.',
    showPrompt: 'Show the prompt',
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
    keys: { '1': '1', '2': '2', '3': '3', enter: 'Enter', esc: 'Esc', up: '↑', down: '↓' },
    ago: { now: 'now', m: (n) => `${n}m`, h: (n) => `${n}h`, d: (n) => `${n}d` },
    pending: (n) => `${n} queued`,
  },
  zh: {
    loginTitle: '登录你的 Super-agent',
    loginHelp: '在服务器上运行 web/start.sh，打开它打印出来的网址即可。也可以把 .webui/token 里的口令粘贴到这里。',
    loginLabel: '访问口令',
    loginWrong: '口令不对。请从 .webui/token 重新复制。',
    loginButton: '登录',
    work: '工作',
    close: '关闭',
    chat: '聊天',
    terminal: '终端',
    inputLabel: '发给 Router 的消息',
    inputPlaceholder: '告诉 Router 你要做什么…',
    send: '发送',
    hint: 'Enter 发送 · Shift+Enter 换行 · 终端和网页是同一个对话',
    inFlight: '任务',
    groupOpen: '进行中',
    collapse: '收起侧边栏',
    expand: '展开侧边栏',
    group: '工作群',
    groupSub: (w, m) => `Router 与 ${w} 个 Worker · ${m} 条消息`,
    all: '全部',
    flag: '不对',
    more: '展开全文',
    less: '收起',
    stepsOf: (id, n) => `Worker ${id} 的 ${n} 条进展`,
    kindBrief: '任务说明',
    kindReport: '回报',
    kindSend: '消息',
    workerName: (id) => `Worker ${id}`,
    noFeed: 'Router 和 Worker 之间还没有往来消息。',
    noFeedTask: '这个任务还没有往来消息。',
    viewTask: '查看任务详情',
    quoting: '引用',
    removeQuote: '取消引用',
    quotePlaceholder: '说说哪里不对…',
    quoteIntro: '关于工作群里的这条消息，我觉得不对：',
    quoteWhere: (desc, when, src) => `（${desc}，${when}；全文在 ${src}）`,
    quoteDefault: '（请先核对这条消息。）',
    groupEnded: '已结束',
    workers: 'Worker',
    terminalNote: 'Router 终端此刻的画面。需要回答提示时，用下面的按键。',
    noTasks: '现在没有进行中的工作。\nRouter 接下新活后会出现在这里。',
    noRuns: '还没有 Worker 运行过。',
    emptyTitle: '只跟一个助手说话',
    emptyBody: '用你自己的话描述要做的事。Router 会交给对应项目里的 Worker 去做，有结果或需要你决定时再告诉你。',
    online: '在线',
    working: '正在处理…',
    asking: '在等你回答',
    down: '没在运行',
    thinking: 'Router 正在处理…',
    stepOne: '做了 1 步操作',
    steps: (n) => `做了 ${n} 步操作`,
    askTitle: '需要你的许可',
    askBody: 'Router 在终端里提问。',
    showPrompt: '查看原始提示',
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
    keys: { '1': '1', '2': '2', '3': '3', enter: '回车', esc: 'Esc', up: '↑', down: '↓' },
    ago: { now: '刚刚', m: (n) => `${n}分钟`, h: (n) => `${n}小时`, d: (n) => `${n}天` },
    pending: (n) => `${n} 条待处理`,
  },
};
const lang = ((navigator.languages && navigator.languages[0]) || navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
const T = STRINGS[lang];
document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = T[el.dataset.i18n]; });
document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = T[el.dataset.i18nPlaceholder]; });
document.querySelectorAll('[data-i18n-label]').forEach((el) => { el.setAttribute('aria-label', T[el.dataset.i18nLabel]); el.title = T[el.dataset.i18nLabel]; });

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
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}
const dot = (cls = '') => h('span', { class: `dot ${cls}` });
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
  s = s.replace(/\[([^\]]+)\]\((?!https?:)[^\s)]+\)/g, '$1');
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
let group = null; // current run of tool steps
let pendingEls = [];

function nearBottom() { return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120; }
function toBottom() { scroller.scrollTop = scroller.scrollHeight; }

function renderItem(it) {
  if (it.role === 'tool') {
    if (!group) {
      group = h('details', { class: 'activity' }, h('summary', { class: 'line' }, dot(), h('span')), h('ol'));
      messages.append(group);
    }
    group.querySelector('ol').append(h('li', {}, h('b', {}, it.name), h('span', { title: it.text }, it.text)));
    const n = group.querySelectorAll('li').length;
    group.querySelector('summary span:last-child').textContent = n === 1 ? T.stepOne : T.steps(n);
    return;
  }
  group = null;
  if (it.role === 'user') {
    const i = pendingEls.findIndex((p) => p.dataset.text === it.text.trim());
    if (i >= 0) { pendingEls[i].remove(); pendingEls.splice(i, 1); }
    messages.append(h('div', { class: 'msg user' }, h('div', { class: 'bubble' }, it.text), h('time', { datetime: it.ts }, clock(it.ts))));
  } else if (it.role === 'assistant') {
    const el = h('div', { class: 'msg prose' });
    el.innerHTML = markdown(it.text);
    messages.append(el);
  } else if (it.role === 'event') {
    const bad = it.status && it.status !== 'completed';
    messages.append(h('div', { class: 'line' }, dot(bad ? 'wait' : 'go'), h('span', {}, it.text)));
  }
}

function emptyState() {
  return h('div', { class: 'empty' }, h('div', { class: 'badge' }, icon('chat')), h('h2', {}, T.emptyTitle), h('p', {}, T.emptyBody));
}

function addItems(items, { initial } = {}) {
  const stick = initial || nearBottom();
  for (const it of items) {
    if (it.seq <= lastSeq) continue;
    messages.querySelector('.empty')?.remove();
    renderItem(it);
    lastSeq = it.seq;
  }
  if (!messages.querySelector('.msg, .line, .activity')) messages.replaceChildren(emptyState());
  placeThinking();
  if (stick) toBottom();
}

let thinkingEl = null;
let routerState = 'idle';
function placeThinking() {
  thinkingEl?.remove();
  thinkingEl = null;
  if (routerState === 'working') {
    thinkingEl = h('div', { class: 'line' }, dot('go pulse'), h('span', {}, T.thinking));
    messages.append(thinkingEl);
  }
}

// ---------- state rendering ----------
let current = null;

function taskDot(t) {
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
  if (s.startsWith('running')) return { dot: 'go pulse', text: T.run.running, active: true };
  if (s.startsWith('queued')) return { dot: 'wait', text: T.run.queued, active: true };
  if (s.startsWith('retrying')) return { dot: 'wait pulse', text: T.run.retrying, active: true };
  if (s.startsWith('paused')) return { dot: '', text: T.run.paused, active: true };
  if (s === 'exited 0') return { dot: '', text: T.run.ok, active: false };
  return { dot: 'stop', text: T.run.failed, active: false };
}

// Buttons for a terminal prompt. Numbered options ("❯ 1. Yes") become buttons
// labelled with their own text; without them, offer the generic keys.
function promptButtons(screen) {
  const opts = [];
  for (const line of screen.split('\n')) {
    const m = line.match(/^\s*(?:[❯>]\s*)?([1-9])\.\s+(.+?)\s*$/);
    if (m && ['1', '2', '3'].includes(m[1]) && !opts.some((o) => o.key === m[1])) opts.push({ key: m[1], text: m[2] });
  }
  if (!opts.length) {
    return ['esc', 'up', 'down', 'enter'].map((k) => h('button', { class: `btn${k === 'enter' ? ' primary' : ''}`, onclick: () => pressKey(k) }, T.keys[k]));
  }
  return [
    h('button', { class: 'btn', onclick: () => pressKey('esc') }, T.keys.esc),
    ...opts.slice().reverse().map((o) => h('button', { class: `btn${o.key === '1' ? ' primary' : ''}`, title: o.text, onclick: () => pressKey(o.key) }, h('span', {}, o.text))),
  ];
}

function renderState(s) {
  current = s;
  const r = s.router;
  routerState = r.state;

  // header
  const label = { idle: T.online, working: T.working, asking: T.asking, down: T.down }[r.state];
  const d = { idle: 'go', working: 'go pulse', asking: 'wait pulse', down: 'stop' }[r.state];
  $('router-status').replaceChildren(dot(d), h('span', {}, label));
  $('send').disabled = r.state === 'down';

  // card above the composer
  const banner = $('banner');
  if (r.state === 'down') {
    banner.className = 'card down';
    banner.replaceChildren(
      h('p', { class: 'card-title' }, icon('power'), h('span', {}, h('strong', {}, T.downTitle), h('span', { class: 'sub' }, T.downBody))),
      h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: startRouter }, T.startRouter)),
    );
    banner.hidden = false;
  } else if (r.state === 'asking') {
    const tail = r.screen.split('\n').slice(-16).join('\n');
    const wasOpen = banner.querySelector('details')?.open;
    banner.className = 'card alerting';
    banner.replaceChildren(
      h('p', { class: 'card-title' }, icon('shield'), h('span', {}, h('strong', {}, T.askTitle), h('span', { class: 'sub' }, T.askBody))),
      h('details', { open: wasOpen || undefined }, h('summary', {}, T.showPrompt), h('pre', { class: 'screen' }, tail)),
      h('div', { class: 'actions' }, ...promptButtons(tail)),
    );
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }

  // alerts
  $('alerts').replaceChildren(...s.index.alerts.map((a) => h('p', { class: 'alert' }, icon('alert'), h('span', {}, a))));

  // pause
  const pa = $('pause-area');
  if (s.paused) {
    pa.replaceChildren(h('button', { class: 'pause-btn on', title: T.pausedSince(s.paused.replace(/^\S+\s*/, '') || s.paused), onclick: resumeHub }, icon('play'), h('span', {}, T.resume)));
  } else {
    pa.replaceChildren(h('button', { class: 'pause-btn', onclick: pauseHub }, icon('pause'), h('span', {}, T.pause)));
  }

  renderChips();
  renderSide();
  renderTerminal();
  placeThinking();
}

// ---------- work group ----------
let feedData = { items: [], tasks: {} };
let filter = null;          // task id, or null for all
const expanded = new Set(); // post ids shown in full
const openSteps = new Set(); // progress groups left open
let quoteItem = null;
const feedScroll = $('feed-scroll');

// Every task the page knows of: open ones first, then ended ones, then any
// task that only appears in the feed.
function allTasks() {
  const s = current || { index: { tasks: [] }, past: [], runs: [] };
  const out = [];
  const seen = new Set();
  for (const t of s.index.tasks) { out.push({ ...t, dot: taskDot(t) }); seen.add(t.id); }
  for (const t of s.past || []) { if (!seen.has(t.id)) { out.push({ ...t, dot: /^dropped/i.test(t.status) ? '' : 'done' }); seen.add(t.id); } }
  for (const [id, t] of Object.entries(feedData.tasks || {})) {
    if (!seen.has(id) && feedData.items.some((i) => i.task === id)) { out.push({ id, title: t.title, file: t.file, dot: '' }); seen.add(id); }
  }
  // A running Worker overrides the task's dot.
  for (const r of s.runs || []) {
    const t = out.find((x) => x.id === r.id);
    if (t && /^running/.test(r.status)) t.dot = 'go pulse';
  }
  return out;
}

// ---------- sidebar ----------
function selectTask(id) {
  filter = id;
  renderChips();
  renderSide();
  renderFeed(true);
  if (window.matchMedia('(max-width: 1000px)').matches) showPane('group');
}

function renderSide() {
  if (!current) return;
  const s = current;
  const past = s.past || [];
  const runningIds = new Set(s.runs.filter((r) => /^running/.test(r.status)).map((r) => r.id));
  const sel = (id) => String(filter === id);

  // tasks: open, then ended
  $('count-tasks').textContent = s.index.tasks.length || '';
  const openRows = s.index.tasks.map((t) => h('li', {},
    h('button', { class: 'row', 'aria-current': sel(t.id), onclick: () => selectTask(filter === t.id ? null : t.id) },
      h('div', {},
        h('div', { class: 'name' }, dot(runningIds.has(t.id) ? 'go pulse' : taskDot(t)), h('span', {}, t.title)),
        h('div', { class: `sub${t.warn ? ' warn' : ''}` }, [t.id, t.project, t.note || taskStatusText(t)].filter(Boolean).join(' · ')),
      ),
      icon('chev'),
    )));
  const pastRows = past.map((t) => h('li', { class: 'past' },
    h('button', { class: 'row', 'aria-current': sel(t.id), title: t.outcome || '', onclick: () => selectTask(filter === t.id ? null : t.id) },
      h('div', {},
        h('div', { class: 'name' }, dot(/^dropped/i.test(t.status) ? '' : 'done'), h('span', {}, t.title)),
        h('div', { class: 'sub' }, [t.id, t.project, taskStatusText(t)].filter(Boolean).join(' · ')),
      ),
      h('span', { class: 'meta' }, ago(t.updated)),
    )));
  $('tasks').replaceChildren(
    h('li', { class: 'group' }, T.groupOpen),
    ...(openRows.length ? openRows : [h('li', {}, h('p', { class: 'none' }, T.noTasks))]),
    ...(pastRows.length ? [h('li', { class: 'group' }, T.groupEnded), ...pastRows] : []),
  );

  // Worker runs
  const runs = s.runs.map((x) => ({ ...x, info: runInfo(x) }));
  const shown = [...runs.filter((x) => x.info.active), ...runs.filter((x) => !x.info.active).slice(0, 8)];
  $('count-runs').textContent = runs.filter((x) => x.info.active).length || '';
  $('runs').replaceChildren(...(shown.length ? shown.map((x) => h('li', { class: x.info.active ? '' : 'past' },
    h('button', { class: 'row', title: x.project, 'aria-current': sel(x.id), onclick: () => selectTask(filter === x.id ? null : x.id) },
      h('div', {},
        h('div', { class: 'name' }, dot(x.info.dot), h('span', {}, x.project.split('/').pop() || x.project)),
        h('div', { class: 'sub' }, [x.id, x.info.text, x.pending ? T.pending(x.pending) : ''].filter(Boolean).join(' · ')),
      ),
      h('span', { class: 'meta' }, ago(x.info.active ? x.started : (x.ended || x.started))),
    ))) : [h('li', {}, h('p', { class: 'none' }, T.noRuns))]));

  // collapsed rail: one button per task, status dot in the corner
  const railBtn = (t, d) => h('li', {}, h('button', { title: `${t.id} ${t.title}`, 'aria-label': `${t.id} ${t.title}`, 'aria-current': sel(t.id), onclick: () => selectTask(filter === t.id ? null : t.id) }, t.id, dot(d)));
  $('rail').replaceChildren(
    ...s.index.tasks.map((t) => railBtn(t, runningIds.has(t.id) ? 'go pulse' : taskDot(t))),
    ...(past.length && s.index.tasks.length ? [h('li', { class: 'sep', 'aria-hidden': 'true' })] : []),
    ...past.map((t) => railBtn(t, /^dropped/i.test(t.status) ? '' : 'done')),
  );
}

document.querySelectorAll('[data-side-tab]').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('[data-side-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  $('tasks').hidden = b.dataset.sideTab !== 'tasks';
  $('runs').hidden = b.dataset.sideTab !== 'runs';
}));

function setCollapsed(on) {
  $('app').classList.toggle('collapsed', on);
  const b = $('side-toggle');
  b.setAttribute('aria-expanded', String(!on));
  b.title = on ? T.expand : T.collapse;
  b.setAttribute('aria-label', b.title);
  localStorage.setItem('ccsa-side', on ? 'collapsed' : 'open');
}
$('side-toggle').addEventListener('click', () => setCollapsed(!$('app').classList.contains('collapsed')));
{
  const saved = localStorage.getItem('ccsa-side');
  setCollapsed(saved ? saved === 'collapsed' : window.innerWidth < 1280);
}

function renderChips() {
  const tasks = allTasks();
  const chip = (id, kids, label) => h('button', { class: 'chip', 'aria-pressed': String(filter === id), title: label, onclick: () => selectTask(id) }, ...kids);
  $('chips').replaceChildren(
    chip(null, [h('span', {}, T.all)], T.all),
    ...tasks.map((t) => chip(t.id, [dot(t.dot), h('span', { class: 'n' }, t.id), h('span', {}, t.title)], `${t.id} ${t.title}`)),
  );
  const bar = $('task-bar');
  const t = tasks.find((x) => x.id === filter);
  if (t) {
    bar.replaceChildren(dot(t.dot), h('span', {}, [t.project, t.note || taskStatusText(t)].filter(Boolean).join(' · ') || t.title),
      t.file ? h('button', { class: 'link', onclick: () => openTask(t) }, T.viewTask) : null);
    bar.hidden = false;
  } else bar.hidden = true;
}

function who(id) { return id === 'router' ? 'Router' : (/^\d+$/.test(id) ? T.workerName(id) : id); }
function kindLabel(k) { return { brief: T.kindBrief, report: T.kindReport, send: T.kindSend }[k] || ''; }
function taskTitle(id) { return (feedData.tasks[id] && feedData.tasks[id].title) || ''; }

function postEl(it) {
  const long = it.text.length > 600 || it.text.split('\n').length > 12;
  const open = expanded.has(it.id);
  const body = h('div', { class: `post-body prose${long && !open ? ' clamped' : ''}` });
  body.innerHTML = markdown(it.text);
  const isRouter = it.from === 'router';
  return h('article', { class: `post ${it.kind}${quoteItem && quoteItem.id === it.id ? ' flagged' : ''}`, 'data-id': it.id },
    h('div', { class: `avatar ${isRouter ? 'router' : 'worker'}` }, isRouter ? 'R' : it.from),
    h('div', {},
      h('div', { class: 'post-head' },
        h('b', {}, who(it.from)), h('span', { class: 'to' }, `→ ${who(it.to)}`),
        h('span', { class: 'kind' }, kindLabel(it.kind)),
        it.task && !filter ? h('span', { class: 'task' }, taskTitle(it.task)) : null,
        h('time', { datetime: it.ts, title: new Date(it.ts).toLocaleString() }, clock(it.ts)),
      ),
      h('div', { class: 'post-card' }, body,
        h('div', { class: 'post-foot' },
          long ? h('button', { class: 'more', onclick: () => { open ? expanded.delete(it.id) : expanded.add(it.id); renderFeed(); } }, open ? T.less : T.more) : null,
          h('button', { class: 'flag', title: T.flag, onclick: () => setQuote(it) }, icon('flag'), h('span', {}, T.flag)),
        ),
      ),
    ),
  );
}

function steps(group) {
  const key = group[0].id;
  const d = h('details', { class: 'steps', open: openSteps.has(key) || undefined },
    h('summary', {}, dot(), h('span', {}, T.stepsOf(group[0].from, group.length))),
    h('ol', {}, ...group.map((x) => h('li', {}, h('time', { datetime: x.ts }, clock(x.ts)), x.text))));
  d.addEventListener('toggle', () => { d.open ? openSteps.add(key) : openSteps.delete(key); });
  return d;
}

function renderFeed(jump) {
  const stick = jump || feedScroll.scrollHeight - feedScroll.scrollTop - feedScroll.clientHeight < 120;
  const items = feedData.items.filter((i) => !filter || i.task === filter);
  const nodes = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.kind === 'progress') {
      const g = [it];
      while (i + 1 < items.length && items[i + 1].kind === 'progress' && items[i + 1].from === it.from) g.push(items[++i]);
      nodes.push(steps(g));
    } else nodes.push(postEl(it));
  }
  $('feed').replaceChildren(...(nodes.length ? nodes : [h('p', { class: 'none' }, filter ? T.noFeedTask : T.noFeed)]));
  const workers = new Set(feedData.items.map((i) => i.task).filter(Boolean)).size;
  $('group-sub').textContent = T.groupSub(workers, feedData.items.filter((i) => i.kind !== 'progress').length);
  if (stick) feedScroll.scrollTop = feedScroll.scrollHeight;
}

function setFeed(data) {
  feedData = data;
  renderFeed();
  renderChips();
}

// ---------- quoting a work-group message into the Router chat ----------
function quoteDesc(it) { return `${who(it.from)} → ${who(it.to)} · ${kindLabel(it.kind)}`; }
function setQuote(it) {
  quoteItem = it;
  const q = $('quote');
  if (!it) {
    q.hidden = true;
    input.placeholder = T.inputPlaceholder;
  } else {
    q.replaceChildren(
      h('div', {},
        h('div', { class: 'q-head' }, icon('quote'), h('span', {}, `${T.quoting} · ${quoteDesc(it)} · ${clock(it.ts)}`)),
        h('div', { class: 'q-text' }, it.text.replace(/\s+/g, ' ').slice(0, 300)),
      ),
      h('button', { type: 'button', class: 'icon-btn', title: T.removeQuote, 'aria-label': T.removeQuote, onclick: () => setQuote(null) }, icon('x')),
    );
    q.hidden = false;
    input.placeholder = T.quotePlaceholder;
    showPane('chat');
    showView('chat');
    input.focus();
  }
  renderFeed();
}
function quotedText(it, note) {
  const lines = it.text.split('\n');
  let body = lines.slice(0, 12).join('\n');
  if (body.length > 800) body = body.slice(0, 800);
  const cutShort = body.length < it.text.length;
  const quoted = body.split('\n').map((l) => `> ${l}`).join('\n') + (cutShort ? '\n> …' : '');
  const when = new Date(it.ts).toLocaleString();
  const where = T.quoteWhere(`${quoteDesc(it)}${it.task ? ` (${it.task} ${taskTitle(it.task)})` : ''}`, when, it.src || '?');
  return `${T.quoteIntro}\n${where}\n${quoted}\n\n${note.trim() || T.quoteDefault}`;
}

// ---------- panes on narrow screens ----------
function showPane(name) {
  $('app').classList.toggle('show-chat', name === 'chat');
  $('app').classList.toggle('show-group', name === 'group');
  $('app').classList.toggle('show-side', name === 'side');
  document.querySelectorAll('[data-pane]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.pane === name)));
  if (name === 'group') renderFeed(true);
}
document.querySelectorAll('[data-pane]').forEach((b) => b.addEventListener('click', () => showPane(b.dataset.pane)));

// ---------- terminal view ----------
function renderTerminal() {
  if ($('view-term').hidden || !current) return;
  const sc = $('term-screen');
  const atEnd = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 40;
  sc.textContent = current.router.screen || '';
  if (atEnd) sc.scrollTop = sc.scrollHeight;
}
$('term-keys').replaceChildren(...['1', '2', '3', 'up', 'down', 'esc', 'enter'].map((k) =>
  h('button', { class: `btn${k === 'enter' ? ' primary' : ''}`, onclick: () => pressKey(k) }, T.keys[k])));

function showView(v) {
  document.querySelectorAll('[data-view]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.view === v)));
  if ($('view-chat').hidden === (v !== 'chat') && $('view-term').hidden === (v !== 'term')) return;
  $('view-chat').hidden = v !== 'chat';
  $('view-term').hidden = v !== 'term';
  if (v === 'term') { renderTerminal(); const sc = $('term-screen'); sc.scrollTop = sc.scrollHeight; }
  else { toBottom(); input.focus(); }
}
document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

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
document.querySelectorAll('dialog [data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

// composer
const input = $('input');
function grow() { input.style.height = 'auto'; input.style.height = `${Math.max(input.scrollHeight, 52)}px`; }
input.addEventListener('input', grow);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
    e.preventDefault();
    $('composer').requestSubmit();
  }
});
$('composer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const note = input.value;
  if ((!note.trim() && !quoteItem) || $('send').disabled) return;
  const quoted = quoteItem;
  const text = quoted ? quotedText(quoted, note) : note;
  const el = h('div', { class: 'msg user pending', 'data-text': text.trim() }, h('div', { class: 'bubble' }, text));
  messages.querySelector('.empty')?.remove();
  messages.append(el);
  pendingEls.push(el);
  input.value = ''; grow(); toBottom();
  if (quoted) setQuote(null);
  try {
    await post('/api/send', { text });
  } catch (err) {
    el.remove(); pendingEls = pendingEls.filter((p) => p !== el);
    input.value = note; grow();
    if (quoted) setQuote(quoted);
    const msg = err.data && err.data.error === 'router-down' ? T.sendFailed : T.sendError(err.message);
    messages.append(h('div', { class: 'line' }, dot('stop'), h('span', {}, msg)));
    toBottom();
  }
});

// ---------- live updates ----------
async function refreshState() {
  try { renderState(await api('/api/state')); } catch {}
}
let source = null;
let lostEl = null;
function connect() {
  source?.close();
  source = new EventSource(`/api/events?t=${encodeURIComponent(token)}`);
  source.addEventListener('chat', (e) => addItems(JSON.parse(e.data).items));
  source.addEventListener('state', (e) => renderState(JSON.parse(e.data)));
  source.addEventListener('feed', (e) => setFeed(JSON.parse(e.data)));
  source.addEventListener('open', () => { lostEl?.remove(); lostEl = null; resync(); });
  source.addEventListener('error', () => {
    if (!lostEl) { lostEl = h('div', { class: 'line' }, dot('wait pulse'), h('span', {}, T.lost)); messages.append(lostEl); }
  });
}
async function resync() {
  try {
    const c = await api('/api/chat');
    if (c.seq < lastSeq) { messages.replaceChildren(); lastSeq = 0; group = null; }
    addItems(c.items, { initial: lastSeq === 0 });
    setFeed(await api('/api/feed'));
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
    setFeed(await api('/api/feed'));
    renderFeed(true);
    connect();
    grow();
    input.focus();
  } catch (e) {
    if (e.message !== 'unauthorized') showLogin(false);
  }
}
if (token) start(); else showLogin(false);
setInterval(() => { if (current) renderState(current); }, 60000);
