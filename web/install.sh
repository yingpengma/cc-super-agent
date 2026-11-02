#!/usr/bin/env bash
# Install the Web UI as a systemd service, so it starts at boot and restarts
# if it stops.
#   web/install.sh [--host 127.0.0.1] [--port 8787]   install and start
#   web/install.sh --remove                            stop and uninstall
#
# By default it listens on this machine only. Reach it from another computer
# with an SSH tunnel:  ssh -L 8787:localhost:8787 <server>
# Use --host 0.0.0.0 only behind HTTPS (a reverse proxy) or on a trusted network:
# the token protects access, but plain HTTP sends it unencrypted.
set -euo pipefail
hub="$(cd "$(dirname "$0")/.." && pwd)"
unit=/etc/systemd/system/ccsa-web.service

if [ "${1:-}" = "--remove" ]; then
  systemctl disable --now ccsa-web.service 2>/dev/null || true
  rm -f "$unit"
  systemctl daemon-reload
  echo "Web UI service removed."
  exit 0
fi

host=127.0.0.1; port=8787
while [ $# -gt 0 ]; do
  case "$1" in
    --host) host="$2"; shift 2 ;;
    --port) port="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
node="$(command -v node || true)"
[ -n "$node" ] || { echo "Node.js is required (it comes with Claude Code)." >&2; exit 1; }

cat > "$unit" <<UNIT
[Unit]
Description=cc-super-agent Web UI ($hub)
After=network-online.target ccsa-router.service
Wants=network-online.target

[Service]
User=$(id -un)
Environment=HOME=$HOME
Environment=PATH=$(dirname "$node"):/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin
ExecStart=$node $hub/web/server.mjs --host $host --port $port
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now ccsa-web.service
for _ in 1 2 3 4 5 6 7 8 9 10; do [ -f "$hub/.webui/token" ] && break; sleep 0.5; done
shown=$host; [ "$host" = 0.0.0.0 ] && shown=localhost
echo "Web UI service installed."
echo "Open: http://$shown:$port/#t=$(cat "$hub/.webui/token" 2>/dev/null)"
[ "$host" = 127.0.0.1 ] && echo "From another computer, first run: ssh -L $port:localhost:$port <this server>"
exit 0
