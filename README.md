<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
  <img alt="cc-super-agent: Super-agent for Claude Code. Talk to one agent; it runs every other Claude Code session for you." src="assets/hero-light.svg">
</picture>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-2f7fcf)](https://claude.com/claude-code)
[![Architecture: Router–Worker](https://img.shields.io/badge/architecture-Router%E2%80%93Worker-6f42c1)](#how-it-works)
[![Status: experimental](https://img.shields.io/badge/status-experimental-orange)](#roadmap)

English | [简体中文](README.zh-CN.md)

</div>

---

You have five projects and five Claude Code sessions open. You switch tabs, scroll back to remember where each one was, answer a permission prompt in one, forget another for an hour. **The model is not the bottleneck any more. Your attention is.**

cc-super-agent is an open-source implementation of the **Super-agent** design that DeepSeek published in October 2026, built for **Claude Code** from nothing but what Claude Code already ships with: no fork, no patch, no extra service.

You keep **one** conversation. Behind it, a Router hands each piece of work to its own Worker session in the right project, keeps track of everything in plain Markdown, and only speaks up when there is a result you can use or a decision only you can make.

## Before and after

| | Juggling sessions yourself | With cc-super-agent |
| --- | --- | --- |
| Where you talk | One tab per project | One conversation, always the same |
| Who remembers what each session was doing | You | The Router, in Markdown files you can read |
| Starting work in another project | Open a terminal, `cd`, explain the context again | Say it in one sentence |
| A session stuck on a permission prompt or a loop | You find out when you happen to look | The Watchdog flags it within 15 minutes |
| Closing your laptop | Everything stops | The Router keeps running on your server |
| What reaches you | Every step of every session | A result, or one question |

## Features

- 🧭 **One Router, many Workers.** The Router never does the work itself, so it is always free to take your next message. Each task gets its own Worker session in its own project, loading that project's `CLAUDE.md` and memory.
- 🗣️ **Your words, not a summary.** Workers receive your request verbatim and read the original material themselves. The Router adds no plans of its own. Standing rules reach every Worker through its system prompt, so a brief carries only what is new.
- 🔁 **Follow-ups reach the same Worker.** Every task keeps a fixed session id, so "also make the button blue" resumes the Worker that already has the context. A follow-up sent while it is busy is queued, not lost.
- 🐕 **A Watchdog outside the system.** A separate process, driven by cron, notices Workers that died, went silent, loop, drift off course, or wait on a prompt nobody answers. It watches the Router too.
- ♾️ **Always on.** On a server, the Router lives in tmux under systemd, resumes its own session after any restart, and picks up from its records.
- 🧠 **A memory you can read.** Your preferences go into Claude Code's memory. Your work goes into a three-layer Markdown wiki: an index, one file per task, one per project. The Router follows links one hop at a time instead of loading everything.
- 🪞 **A digital twin of you.** The hub learns where you differ from what the model would do by default: every place you corrected, refused or overrode an agent. Reviewed with you, these become a written model of your judgment and taste, so an agent can decide as you would while you are away, and knows which calls stay yours. See [`twin/README.md`](twin/README.md).
- 🛑 **You stay in control.** "Hold this" survives Worker restarts until you lift it. `bin/pause` stops everything at once. Workers never get permissions you did not grant.
- 🌐 **In the terminal or in the browser.** Talk to the Router in its terminal, or open the Web UI: your chat with the Router on one side, and on the other a work group showing every message between the Router and its Workers, where you can flag any message as not right and send it back to the Router. Both are the same conversation.
- 🔒 **Private by default.** The repository tracks a whitelist of framework files. Your tasks, projects, logs and memory never leave your machine.

## How it works

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/architecture-dark.svg">
  <img alt="Architecture diagram" src="assets/architecture-light.svg">
</picture>

1. **You say something.** The Router decides whether it is new work, a follow-up to existing work, or neither.
2. **The Router records first, then acts.** It writes the task file and its line in `INDEX.md`, confirms in one sentence what it understood, then dispatches.
3. **A Worker does the work** in the project's own directory, carries local changes through to a verified result, and stops to ask the moment a decision belongs to you.
4. **The Worker reports** `ready`, `blocked`, `failed` or `dropped`, with a one-line result and at most one question. The Router writes you a fresh, short message. It never forwards the raw report.
5. **The Watchdog** checks every 15 minutes for anything that stopped without telling anyone.

The rules the Router follows are in [AGENTS.md](AGENTS.md). They are the whole system: read them to know exactly what the agent will and will not do.

## What a session looks like

An illustrative exchange:

<p align="center"><img alt="An illustrative session with the Router" src="assets/session.svg" width="820"></p>

<details>
<summary>Text version</summary>

```text
You:    The homepage title is too small, make it bigger.
Router: On it: the homepage Worker will make the title font larger.

You:    Also, did the CI fix in the api repo go through?
Router: Not yet. That Worker is still running the test suite.

        … twenty minutes later …

Router: The homepage title is larger; PR #42 is ready for review.
        Question: the larger title wraps on mobile. Shorten it, or allow two lines?
```

</details>

## Quick start

**Requirements:** Linux with bash, `flock` and `uuidgen` (util-linux), and the Claude Code CLI, signed in (tested with 2.1.316). The Watchdog needs cron. An always-on Router needs tmux, systemd and root. The Web UI needs Node.js, which Claude Code already installs.

There are two ways to talk to the Router. Both reach the same Router and the same records, so you can switch at any time.

### In the browser (Web UI)

On the server:

```sh
git clone https://github.com/yingpengma/cc-super-agent.git ~/super-agent
cd ~/super-agent
watchdog/install.sh        # a Watchdog pass every 15 minutes
sudo router/install.sh     # keep the Router running under systemd
sudo web/install.sh        # serve the Web UI; prints the address to open
```

The Web UI listens on the server itself (`127.0.0.1:8787`). From your own computer, open a tunnel, then open the printed address:

```sh
ssh -L 8787:localhost:8787 <your server>
```

The address carries an access token, also kept in `.webui/token`; your browser remembers it. Without root, run `router/start.sh` and then `web/start.sh` in place of the two `install.sh` lines.

### In the terminal (CLI)

```sh
git clone https://github.com/yingpengma/cc-super-agent.git ~/super-agent
cd ~/super-agent
claude            # this is your Router from now on
```

That is all you need to start. Two optional steps make it autonomous:

```sh
watchdog/install.sh                    # a Watchdog pass every 15 minutes
sudo router/install.sh                 # keep the Router running under systemd
tmux -L ccsa attach -t ccsa-router     # talk to it; detach with Ctrl-b d
```

Close any other Claude Code session in this directory before installing the Router service.

## Repository layout

| Path | Contents |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | The rules the Router follows. `CLAUDE.md` loads it |
| [`templates/brief.md`](templates/brief.md) | The template every brief to a Worker starts from |
| [`templates/worker-rules.md`](templates/worker-rules.md) | Standing rules that `bin/dispatch` adds to every Worker's system prompt |
| [`twin/README.md`](twin/README.md) | The method for building your digital twin |
| [`bin/dispatch`](bin/dispatch) | Starts or resumes a task's Worker, with queueing, a concurrency cap and retries |
| [`bin/pause`](bin/pause), [`bin/resume`](bin/resume) | Pause and resume all automatic processing |
| [`watchdog/`](watchdog) | The Watchdog's instructions, its runner and its cron installer |
| [`router/`](router) | The scripts that keep the Router running |
| [`web/`](web) | The Web UI: a dependency-free Node server, the page, and its systemd installer |

Created at run time and never committed: `INDEX.md`, `tasks/`, `projects/`, the twin itself in `twin/` (everything but its `README.md`), `.runs/`, `.watchdog/`, `.router/`, `.webui/`.

## Design

The architecture follows [*Exploring Super-agent Design: Towards a More Autonomous Agent System*](https://mp.weixin.qq.com/s/zoS7GlReWPhfCjENGxXCdg) by the DeepSeek Harness team, and their reference implementation [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype). In their experiments, a two-layer Router–Worker system finished concurrent work faster and more predictably than a single session with a subagent tool (p95 of 15.7 versus 29.5 minutes), because a single session tends to do the work itself and keeps getting interrupted.

Their experiment, which this project's design rests on:

<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/benchmark-dark.svg">
  <img alt="Dot plot of task completion time: Super-agent p50 12.4 and p95 15.7 minutes; without pass-through 12.6 and 15.5; single session with subagent tool, delegate-first prompt, 13.8 and 29.0; neutral prompt, 20.4 and 29.5." src="assets/benchmark-light.svg" width="820">
</picture>
</p>

cc-super-agent has no pass-through, so the second row is the one closest to it: the same completion times, with more Router decisions.

How their modules map onto Claude Code:

| Super-agent module | In cc-super-agent |
| --- | --- |
| Two layers: Router and Workers | ✅ The hub session routes; `claude -p` sessions in project directories do the work |
| Full-duplex interaction | ✅ Workers run as background commands; the Router keeps talking |
| Chain of recall | ✅ A linked Markdown wiki, read one hop at a time |
| Separating compute from state | ✅ All state on disk; the Router resumes its fixed session after any restart |
| Watchdog | ✅ An independent cron-driven pass over Workers and the Router |
| Event-driven triggers | 🚧 Not yet: work starts when you ask |
| Remote execution environments | 🚧 Not yet: Workers run on the same machine |

cc-super-agent is an independent project, not affiliated with DeepSeek or Anthropic.

## Roadmap

- [ ] Event sources, so the Router can notice work without being asked
- [ ] Workers on other machines
- [ ] Automated tests for the dispatch and Watchdog scripts
- [ ] Build the twin from every past Claude Code transcript on the machine, not only the hub's own

Ideas and issues are welcome.

## FAQ

**Does this modify Claude Code?**
No. It uses `claude -p`, `--session-id`, `--resume`, `SendMessage`, cron, tmux and systemd, all as they ship.

**Do Workers run with elevated permissions?**
No. Each Worker uses your own Claude Code settings for its project. The hub never grants more, and never sends work refused in one session to another.

**Will it spam me?**
It is designed not to. The Router speaks only for a result, a decision or a failure, asks one question at a time, and confirms each new task in a single sentence.

**Is the Web UI safe to expose?**
By default it listens only on the server, and every request needs the token. To reach it without an SSH tunnel, put it behind HTTPS (a reverse proxy) and start it with `--host 0.0.0.0`. Anyone with the token can talk to your Router, so keep it like a password.

**Does my data end up in the repository?**
No. `.gitignore` is a whitelist of framework files. Everything else, including your tasks, projects, logs and your digital twin, stays local.

## Uninstall

```sh
watchdog/install.sh --remove
sudo router/install.sh --remove
sudo web/install.sh --remove
```

## Citation

If you use this project, please cite it:

```bibtex
@software{cc_super_agent_2026,
  author = {Ma, Yingpeng},
  title  = {cc-super-agent: Super-agent for Claude Code},
  year   = {2026},
  url    = {https://github.com/yingpengma/cc-super-agent}
}
```

GitHub also reads [CITATION.cff](CITATION.cff).

## License

[MIT](LICENSE)
