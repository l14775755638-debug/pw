#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-47.119.130.91}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_DIR="${SERVER_DIR:-/opt/ticket-admin}"
PM2_APP="${PM2_APP:-ticket-admin}"
APP_PORT="${APP_PORT:-4173}"
PADDLE_CPU_THREADS="${PADDLE_CPU_THREADS:-4}"
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
ensure_env PADDLE_CPU_THREADS '${PADDLE_CPU_THREADS}'
ensure_env PADDLE_ENABLE_MKLDNN 1
ensure_env OMP_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env MKL_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env OPENBLAS_NUM_THREADS '${PADDLE_CPU_THREADS}'
ensure_env NUMEXPR_NUM_THREADS '${PADDLE_CPU_THREADS}'

pm2 describe '${PM2_APP}' >/dev/null 2>&1 || pm2 start server.js --name '${PM2_APP}'
pm2 restart '${PM2_APP}' --update-env
pm2 save
pm2 startup systemd -u '${SERVER_USER}' --hp \"\$HOME\" >/dev/null || true
systemctl enable nginx >/dev/null 2>&1 || true
"

echo "4/4 部署完成：http://${SERVER_HOST}:${APP_PORT}/index.html?admin=1"
