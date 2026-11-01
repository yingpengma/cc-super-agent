# cc-super-agent

[English](README.md) | 简体中文

一个基于 [Claude Code](https://claude.com/claude-code) 的个人智能体中枢，只用 Claude Code 已有的功能搭建。

## 为什么做这个项目

现在的模型已经能在很少的人工监督下独立完成单个任务，生产力的瓶颈于是转移到了人身上：一个人能同时跟进的会话只有寥寥几个。借助本项目，你只需在一个地方与一个智能体交谈，背后负责干活的各个会话则交由系统统一管理。

本项目将 DeepSeek Harness 团队（2026）在[《Super-agent 设计探索：迈向更自主的 Agent 系统》](https://mp.weixin.qq.com/s/zoS7GlReWPhfCjENGxXCdg)中提出的 Router–Worker 架构移植到 Claude Code 上，无需对 Claude Code 本身做任何修改。该架构的参考实现见 [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)。本项目为独立项目，与 DeepSeek 及 Anthropic 均无隶属关系。

## 工作方式

- **一个 Router。** 你只与本目录中的 Claude Code 会话交谈。它记录你本人的情况和你的各项工作，判断每个请求该交给谁，但自己不动手干活。
- **多个 Worker。** 每项工作交给相应项目目录中的一个 Claude Code 会话完成。Router 原样转达你的话，Worker 完成后只汇报一句简短的结果，或者提出一个需要你拍板的问题。
- **两类记录。** 你的偏好保存在 Claude Code 的记忆中。你的工作以分层的 Markdown 文件保存在本目录中，包括进行中工作的索引、每项任务一个文件、每个项目一个文件。
- **Watchdog（看门狗）。** 一个独立进程定时巡检，找出已经停滞却没有人知道的工作，并报告给 Router。
- **常驻在线。** 在服务器上，Router 由 systemd 托管在 tmux 中运行，意外退出后会自动重启。
- **你的注意力优先。** Router 只在有结果可以使用、或需要你做决定时才开口，而且每次只问一个问题。

智能体需要遵守的完整规则见 [AGENTS.md](AGENTS.md)（英文）。

## 运行要求

- Linux 系统，装有 bash，以及 util-linux 中的 `flock` 和 `uuidgen`。
- 已登录的 Claude Code 命令行工具，已在 2.1.316 版本上测试。
- 使用 Watchdog 需要 cron。
- 让 Router 常驻在线需要 tmux 和 systemd，并且要有 root 权限来安装服务。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `AGENTS.md` | Router 遵守的规则，由 `CLAUDE.md` 加载 |
| `templates/brief.md` | 派给 Worker 的任务说明模板 |
| `bin/dispatch` | 启动某项任务的 Worker，或让已有的 Worker 继续工作 |
| `watchdog/` | Watchdog 的指令、运行脚本和定时任务安装脚本 |
| `router/` | 让 Router 保持运行的脚本 |

## 使用方法

1. 把本仓库克隆到你自己的目录里，在该目录中启动 Claude Code。从此只在这里与 Claude 交谈。
2. 可选：启动 Watchdog，它每 15 分钟巡检一次：
   ```sh
   watchdog/install.sh
   ```
3. 可选，适用于服务器：让 Router 常驻在线。先关闭本目录中其他的 Claude Code 会话，然后运行：
   ```sh
   sudo router/install.sh
   tmux -L ccsa attach -t ccsa-router    # 按 Ctrl-b 再按 d 即可离开，Router 继续运行
   ```

## 卸载

```sh
watchdog/install.sh --remove
sudo router/install.sh --remove
```

## 隐私

你的个人数据始终留在你自己的机器上。`.gitignore` 只跟踪其中列出的框架文件，其余一律忽略，包括你的工作记录、运行状态和日志。Claude Code 的记忆保存在本目录之外。

Worker 使用你本人的 Claude Code 权限运行，本项目不会额外授予它们任何权限。

## 项目状态

早期实验阶段。

## 引用

如果你使用了本项目，请引用本项目及其所依据的设计：

```bibtex
@software{cc_super_agent_2026,
  author = {yingpengma},
  title  = {cc-super-agent: A Personal Agent Hub for Claude Code},
  year   = {2026},
  url    = {https://github.com/yingpengma/cc-super-agent}
}

@misc{deepseek_superagent_2026,
  author       = {Qiao, Yujia and {DeepSeek Harness Team}},
  title        = {Exploring Super-agent Design: Towards a More Autonomous Agent System},
  howpublished = {WeChat official account of the DeepSeek Harness team},
  year         = {2026},
  month        = oct,
  url          = {https://mp.weixin.qq.com/s/zoS7GlReWPhfCjENGxXCdg}
}
```

GitHub 也会读取 [CITATION.cff](CITATION.cff)。

## 许可证

[MIT](LICENSE)
