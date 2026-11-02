#!/usr/bin/env bash
# Run the Web UI in the foreground and print the address to open.
#   web/start.sh [--host 127.0.0.1] [--port 8787]
# To keep it running after you log out, install it as a service: web/install.sh
set -euo pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"
hub="$(cd "$(dirname "$0")/.." && pwd)"
command -v node >/dev/null || { echo "Node.js is required (it comes with Claude Code)." >&2; exit 1; }
exec node "$hub/web/server.mjs" "$@"
