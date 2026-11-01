#!/usr/bin/env bash
# Install the Router as a systemd service, so it starts at boot and its tmux
# session is recreated if it dies.
#   router/install.sh            install and start
#   router/install.sh --remove   stop and uninstall
set -euo pipefail
hub="$(cd "$(dirname "$0")/.." && pwd)"
unit=/etc/systemd/system/ccsa-router.service

if [ "${1:-}" = "--remove" ]; then
  systemctl disable --now ccsa-router.service 2>/dev/null || true
  rm -f "$unit"
  systemctl daemon-reload
  echo "Router service removed."
  exit 0
fi

cat > "$unit" <<UNIT
[Unit]
Description=cc-super-agent Router ($hub)
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
User=$(id -un)
Environment=HOME=$HOME
Environment=TERM=xterm-256color
ExecStart=$hub/router/start.sh
ExecStop=/usr/bin/tmux -L ccsa kill-session -t ccsa-router
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now ccsa-router.service
echo "Router service installed. Attach with: tmux -L ccsa attach -t ccsa-router"
