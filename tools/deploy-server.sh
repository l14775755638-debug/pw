#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-47.119.130.91}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_DIR="${SERVER_DIR:-/opt/ticket-admin}"
PM2_APP="${PM2_APP:-ticket-admin}"
APP_PORT="${APP_PORT:-4173}"
APP_HOST="${APP_HOST:-}"
PADDLE_CPU_THREADS="${PADDLE_CPU_THREADS:-4}"
EXTERNAL_API_MAX_CONCURRENCY="${EXTERNAL_API_MAX_CONCURRENCY:-5}"
EXTERNAL_API_RETRIES="${EXTERNAL_API_RETRIES:-3}"
EXTERNAL_API_RETRY_DELAY_MS="${EXTERNAL_API_RETRY_DELAY_MS:-2000}"
ALLOW_DIRECT_PORT="${ALLOW_DIRECT_PORT:-0}"
LOCKDOWN_DIRECT_PORT="${LOCKDOWN_DIRECT_PORT:-0}"
REMOTE="${SERVER_USER}@${SERVER_HOST}"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
elif [ -x "/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]; then
  NODE_BIN="/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
else
  echo "找不到 node，无法做部署前检查。" >&2
  exit 1
fi

echo "1/4 本地语法检查..."
"$NODE_BIN" --check server.js
"$NODE_BIN" --check script.js

if [ -n "$(git status --porcelain)" ]; then
  echo "本地还有未提交改动，先提交并推送后再部署：" >&2
  git status --short >&2
  exit 1
fi

echo "2/4 推送本地 main 到 GitHub..."
git push

echo "3/4 连接服务器并更新代码..."
ssh "${REMOTE}" "set -e
cd '${SERVER_DIR}'
git pull --ff-only
if [ -f package-lock.json ]; then
  npm ci --omit=dev
else
  npm install --omit=dev
fi

ensure_env() {
  key=\"\$1\"
  value=\"\$2\"
  if [ ! -f .env ]; then
    touch .env
    chmod 600 .env
  fi
  if grep -q \"^\${key}=\" .env; then
    sed -i \"s|^\${key}=.*|\${key}=\${value}|\" .env
  else
    printf '%s=%s\n' \"\${key}\" \"\${value}\" >> .env
  fi
}

ensure_env PORT '${APP_PORT}'
if [ '${LOCKDOWN_DIRECT_PORT}' = '1' ] || [ '${ALLOW_DIRECT_PORT}' != '1' ]; then
  ensure_env HOST 127.0.0.1
elif [ -n '${APP_HOST}' ]; then
  ensure_env HOST '${APP_HOST}'
else
  ensure_env HOST 0.0.0.0
fi
ensure_env PADDLE_CPU_THREADS '${PADDLE_CPU_THREADS}'
ensure_env PADDLE_ENABLE_MKLDNN 1
ensure_env OMP_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env MKL_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env OPENBLAS_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env NUMEXPR_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env EXTERNAL_API_MAX_CONCURRENCY '${EXTERNAL_API_MAX_CONCURRENCY}'
ensure_env EXTERNAL_API_RETRIES '${EXTERNAL_API_RETRIES}'
ensure_env EXTERNAL_API_RETRY_DELAY_MS '${EXTERNAL_API_RETRY_DELAY_MS}'

if [ -f deploy/nginx-ticket-admin.conf ]; then
  cp deploy/nginx-ticket-admin.conf /etc/nginx/sites-available/ticket-admin
  ln -sf /etc/nginx/sites-available/ticket-admin /etc/nginx/sites-enabled/ticket-admin
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx
fi

pm2 describe '${PM2_APP}' >/dev/null 2>&1 || pm2 start server.js --name '${PM2_APP}'
pm2 restart '${PM2_APP}' --update-env
pm2 save
pm2 startup systemd -u '${SERVER_USER}' --hp \"\$HOME\" >/dev/null || true
systemctl enable nginx >/dev/null 2>&1 || true
ufw allow OpenSSH >/dev/null || true
ufw allow 80/tcp >/dev/null || true
ufw allow 443/tcp >/dev/null || true
ufw deny 6379/tcp >/dev/null || true
if [ '${LOCKDOWN_DIRECT_PORT}' = '1' ] || [ '${ALLOW_DIRECT_PORT}' != '1' ]; then
  ufw delete allow '${APP_PORT}'/tcp >/dev/null 2>&1 || true
else
  ufw allow '${APP_PORT}'/tcp >/dev/null || true
fi
ufw --force enable >/dev/null || true
curl -fsS --max-time 8 http://127.0.0.1:${APP_PORT}/api/status >/dev/null
"

if [ "${LOCKDOWN_DIRECT_PORT}" = "1" ] || [ "${ALLOW_DIRECT_PORT}" != "1" ]; then
  echo "4/4 部署完成：http://${SERVER_HOST}/index.html?admin=1 （4173 公网直连已关闭）"
else
  echo "4/4 部署完成：http://${SERVER_HOST}/index.html?admin=1"
  echo "测试直连仍可用：http://${SERVER_HOST}:${APP_PORT}/index.html?admin=1"
fi
