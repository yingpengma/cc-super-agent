#!/usr/bin/env bash
# Keep the Router session alive. Runs inside the tmux session that
# router/start.sh creates.
#
# The Router has a fixed session id, kept in .router/session-id, so a restart
# resumes the same conversation. (`claude --continue` would not do: the
# Watchdog's passes also run in this directory and are often more recent.)
# When the Router exits for any reason, it is started again after 5 seconds.
# To stop it for good, stop the service, or kill the tmux session.
set -uo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

hub="$(cd "$(dirname "$0")/.." && pwd)"
cd "$hub"
mkdir -p .router
[ -f .router/session-id ] || uuidgen > .router/session-id
sid="$(cat .router/session-id)"

while :; do
  if ls "$HOME"/.claude/projects/*/"$sid".jsonl >/dev/null 2>&1; then
    claude --resume "$sid" --name ccsa-router
  else
    claude --session-id "$sid" --name ccsa-router
  fi
  echo "$(date -Is) Router exited with code $?; restarting in 5 seconds." | tee -a .router/restarts.log
  sleep 5
done
