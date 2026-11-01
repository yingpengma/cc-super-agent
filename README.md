# cc-super-agent

English | [简体中文](README.zh-CN.md)

**Super-agent for [Claude Code](https://claude.com/claude-code).** An open-source implementation of DeepSeek's Super-agent (super agent) design, a Router–Worker multi-agent architecture, built only from what Claude Code already offers. Use it as your personal agent: talk to one agent, and let it run many Claude Code sessions for you.

## Why

A model can now carry a single task to completion with little supervision. The limit has moved to the person: one can follow only a few sessions at once. This project lets you talk to one agent, in one place, while the sessions doing the work are managed for you.

It adapts the Router–Worker architecture from [*Exploring Super-agent Design: Towards a More Autonomous Agent System*](https://mp.weixin.qq.com/s/zoS7GlReWPhfCjENGxXCdg) by the DeepSeek Harness team (2026), whose reference implementation is [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype), to Claude Code, with no changes to Claude Code itself. This project is independent and not affiliated with DeepSeek or Anthropic.

## How it works

- **One Router.** You talk only to the Claude Code session in this directory. It keeps track of you and of your work, decides where each request belongs, and does not do the work itself.
- **Many Workers.** Each piece of work goes to a Claude Code session in the relevant project directory. The Router passes on your own words, and the Worker reports back a short result or a single question.
- **Two kinds of records.** Your preferences live in Claude Code's memory. Your work lives in layered Markdown files in this directory: an index of open work, one file per task and one per project.
- **A Watchdog.** A separate process checks on a timer for work that has stopped without anyone being told, and reports it to the Router.
- **Always on.** On a server, the Router runs in tmux under systemd and comes back by itself if it exits.
- **Your attention comes first.** The Router speaks only when there is a result you can use or a decision you must make, and asks one question at a time.

The full rules the agent follows are in [AGENTS.md](AGENTS.md).

## Requirements

- Linux with bash, and `flock` and `uuidgen` from util-linux.
- The Claude Code CLI, signed in. Tested with version 2.1.316.
- For the Watchdog: cron.
- For an always-on Router: tmux, systemd, and root access to install the service.

## Layout

| Path | Contents |
| --- | --- |
| `AGENTS.md` | The rules the Router follows. `CLAUDE.md` loads it |
| `templates/brief.md` | The template for every brief sent to a Worker |
| `bin/dispatch` | Starts or continues the Worker of a task |
| `bin/pause`, `bin/resume` | Pause and resume all automatic processing |
| `watchdog/` | The Watchdog's instructions, its runner and its cron installer |
| `router/` | The scripts that keep the Router running |

## Usage

1. Clone this repository into a directory of your own, and start Claude Code in it. From then on, talk to Claude only there.
2. Optional: start the Watchdog, which runs every 15 minutes:
   ```sh
   watchdog/install.sh
   ```
3. Optional, on a server: keep the Router always on. Close any other Claude Code session in this directory first, then:
   ```sh
   sudo router/install.sh
   tmux -L ccsa attach -t ccsa-router    # detach with Ctrl-b d
   ```

## Uninstall

```sh
watchdog/install.sh --remove
sudo router/install.sh --remove
```

## Privacy

Your personal data stays on your machine. `.gitignore` tracks only the framework files listed in it and ignores everything else, including your work records, run state and logs. Claude Code's memory is stored outside this directory.

Workers run with your own Claude Code permissions. The hub never grants them more.

## Status

Early and experimental.

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
