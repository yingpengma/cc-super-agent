#!/usr/bin/env bash
# Start the Router in a detached tmux session named ccsa-router, unless it is
# already running. Attach with:  tmux -L ccsa attach -t ccsa-router
set -euo pipefail
hub="$(cd "$(dirname "$0")/.." && pwd)"
tmux -L ccsa has-session -t ccsa-router 2>/dev/null && exit 0
exec tmux -L ccsa new-session -d -s ccsa-router -c "$hub" "$hub/router/loop.sh"
