#!/usr/bin/env bash
# Install (or replace) the cron entry that runs the Watchdog.
#   watchdog/install.sh [minutes]     default: every 15 minutes
#   watchdog/install.sh --remove
set -euo pipefail
hub="$(cd "$(dirname "$0")/.." && pwd)"
tag="# cc-super-agent watchdog: $hub"
current="$(crontab -l 2>/dev/null | grep -vF "$tag" || true)"

if [ "${1:-}" = "--remove" ]; then
  printf '%s\n' "$current" | sed '/^$/d' | crontab -
  echo "Watchdog removed."
  exit 0
fi

every="${1:-15}"
line="*/$every * * * * $hub/watchdog/run.sh >/dev/null 2>&1 $tag"
{ printf '%s\n' "$current" | sed '/^$/d'; echo "$line"; } | crontab -
echo "Watchdog runs every $every minutes."
