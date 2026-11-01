#!/usr/bin/env bash
# One Watchdog pass. Meant to be run by cron; see watchdog/install.sh.
#
# A pass is skipped, without calling the model, when no task is open and no
# Worker run is active. Passes never overlap.
set -euo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

hub="$(cd "$(dirname "$0")/.." && pwd)"
cd "$hub"
mkdir -p .watchdog/logs

exec 9> .watchdog/lock
flock -n 9 || exit 0

open_tasks=0
[ -f INDEX.md ] && open_tasks=$(grep -c '^- ' INDEX.md || true)
active_runs=$(grep -l '^running' .runs/*/status 2>/dev/null | wc -l || true)
if [ "$open_tasks" -eq 0 ] && [ "$active_runs" -eq 0 ]; then
  exit 0
fi

# Resolve each run's transcript path so the pass needs no filesystem search.
for d in .runs/*/; do
  [ -f "$d/session-id" ] || continue
  t=$(ls "$HOME"/.claude/projects/*/"$(cat "$d/session-id")".jsonl 2>/dev/null | head -1 || true)
  [ -n "$t" ] && echo "$t" > "$d/transcript"
done

log=".watchdog/logs/$(date +%Y%m%d-%H%M%S).log"
claude -p "$(cat watchdog/prompt.md)" --add-dir "$HOME/.claude/projects" \
  --allowedTools "Read" "Grep" "Glob" "Edit" "Write" \
    "Bash(ps:*)" "Bash(cat:*)" "Bash(tail:*)" "Bash(stat:*)" "Bash(date:*)" "Bash(ls:*)" \
    "ListAgents" "SendMessage" \
  < /dev/null > "$log" 2>&1 || true

# Keep the last 200 pass logs.
ls -1t .watchdog/logs/*.log 2>/dev/null | tail -n +201 | xargs -r rm -f
