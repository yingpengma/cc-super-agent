# cc-super-agent

A personal agent hub for [Claude Code](https://claude.com/claude-code), using only what Claude Code already offers.

## Why

A model can now carry a single task to completion with little supervision. The limit has moved to the person: one can follow only a few sessions at once. This project lets you talk to one agent, in one place, while the sessions doing the work are managed for you.

It adapts the Router–Worker architecture from *Exploring Super-agent Design: Towards a More Autonomous Agent System* by the DeepSeek Harness team (2026) to Claude Code, with no changes to Claude Code itself.

## How it works

- **One Router.** You talk only to the Claude Code session in this directory. It keeps track of you and of your work, decides where each request belongs, and does not do the work itself.
- **Many Workers.** Each piece of work goes to a Claude Code session in the relevant project directory. The Router passes on your own words, and the Worker reports back a short result or a single question.
- **Two kinds of records.** Your preferences live in Claude Code's memory. Your work lives in layered Markdown files in this directory: an index of open work, one file per task and one per project.
- **Your attention comes first.** The Router speaks only when there is a result you can use or a decision you must make, and asks one question at a time.

The full rules the agent follows are in [AGENTS.md](AGENTS.md).

## Usage

1. Clone this repository into a directory of your own.
2. Start Claude Code in it. `CLAUDE.md` loads `AGENTS.md`.
3. From then on, talk to Claude only there.
4. Optional: on a server, run `watchdog/install.sh` to start the Watchdog, and `router/install.sh` to keep the Router running. Attach with `tmux -L ccsa attach -t ccsa-router`.

Your personal data stays local: `.gitignore` tracks only the framework files and ignores everything else.

## Status

Early and experimental.
