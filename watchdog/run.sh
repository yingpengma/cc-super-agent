#!/usr/bin/env bash
# One Watchdog pass. Meant to be run by cron; see watchdog/install.sh.
#
# A pass is skipped, without calling the model, when no Worker run is active
# and every open task is waiting on the user or on hold. Passes never overlap.
set -euo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

hub="$(cd "$(dirname "$0")/.." && pwd)"
cd "$hub"
mkdir -p .watchdog/logs

exec 9> .watchdog/lock
flock -n 9 || exit 0

# While the hub is paused, nothing is expected to progress.
[ -f .paused ] && exit 0

# A task counts as in progress unless its task file says it waits on the user
# or is on hold. A line whose task file is missing or unreadable counts too.
in_progress=0
if [ -f INDEX.md ]; then
  while IFS= read -r f; do
    s=$(grep -m1 '^- Status:' "$f" 2>/dev/null | sed 's/^- Status:[[:space:]]*//' || true)
    case "$s" in
      waiting*|"on hold"*) ;;
      *) in_progress=$((in_progress + 1)) ;;
    esac
  done < <(grep '^- ' INDEX.md | grep -o '(tasks/[^)]*)' | tr -d '()' || true)
fi
active_runs=$(grep -lE '^(running|queued|retrying)' .runs/*/status 2>/dev/null | wc -l || true)
if [ "$in_progress" -eq 0 ] && [ "$active_runs" -eq 0 ]; then
  exit 0
fi

# Resolve each run's transcript path so the pass needs no filesystem search.
for d in .runs/*/; do
  [ -f "$d/session-id" ] || continue
  t=$(ls "$HOME"/.claude/projects/*/"$(cat "$d/session-id")".jsonl 2>/dev/null | head -1 || true)
  [ -n "$t" ] && echo "$t" > "$d/transcript"
done

if [ -f .router/session-id ]; then
  t=$(ls "$HOME"/.claude/projects/*/"$(cat .router/session-id)".jsonl 2>/dev/null | head -1 || true)
  [ -n "$t" ] && echo "$t" > .router/transcript
fi
if tmux -L ccsa has-session -t ccsa-router 2>/dev/null; then echo yes > .router/tmux-alive; else echo no > .router/tmux-alive; fi

log=".watchdog/logs/$(date +%Y%m%d-%H%M%S).log"
# --no-session-persistence: a pass leaves no session behind, so passes do not
# fill the hub's session list (/resume) every 15 minutes.
claude -p "$(cat watchdog/prompt.md)" --no-session-persistence --add-dir "$HOME/.claude/projects" \
  --allowedTools "Read" "Grep" "Glob" "Edit" "Write" \
    "Bash(ps:*)" "Bash(cat:*)" "Bash(tail:*)" "Bash(stat:*)" "Bash(date:*)" "Bash(ls:*)" \
    "ListAgents" "SendMessage" \
  < /dev/null > "$log" 2>&1 || true

# Keep the last 200 pass logs.
ls -1t .watchdog/logs/*.log 2>/dev/null | tail -n +201 | xargs -r rm -f
