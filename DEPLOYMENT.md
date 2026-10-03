# ticket-admin 服务器维护手册

这份文档按“照着敲就能恢复”的思路写。当前线上机器是：

- 公网 IP：`47.119.130.91`
- 服务器目录：`/opt/ticket-admin`
- 运行方式：Node.js + PM2，进程名 `ticket-admin`
- 入口：nginx 监听 `80`，反代到本机 `4173`
- 开机自启：`pm2-root` 和 `nginx` 已启用
- 当前队列：Node 内存异步队列。暂时不使用 Redis/Celery

## 先记住两个网址

正式入口：

```text
http://47.119.130.91/
```

临时测试直连入口。正式使用稳定后可以关闭：

```text
http://47.119.130.91:4173/
```

## 平时更新代码

在自己电脑的项目目录执行：

```bash
cd /Users/macbook/Documents/pw
npm run deploy:server
```

如果本机没有 `npm`，用这组命令：

```bash
cd /Users/macbook/Documents/pw
/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check server.js
/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check script.js
bash tools/deploy-server.sh
```

部署脚本会做这些事：

- 检查 `server.js` 和 `script.js` 语法
- 要求本地代码已经提交，避免把半成品发上去
- 推送 GitHub
- 让服务器 `git pull`
- 安装依赖
- 写入 PaddleOCR CPU 参数
- 更新 nginx 配置
- 重启 PM2
- 保存 PM2 开机恢复列表
- 检查本机 API 是否正常
- 默认保持 `4173` 公网直连关闭，只让 nginx 访问 Node

## 服务器重启后怎么检查

SSH 到服务器：

```bash
ssh root@47.119.130.91
```

看服务是否已经自动起来：

```bash
pm2 list
systemctl is-active pm2-root nginx
curl -fsS http://127.0.0.1:4173/api/status
```

正常情况应该看到：

- `ticket-admin` 是 `online`
- `pm2-root` 是 `active`
- `nginx` 是 `active`
- `curl` 返回一段 JSON，里面有 `provider` 和 `hasKey`

如果没有自动起来，在服务器执行：

```bash
cd /opt/ticket-admin
git pull --ff-only
npm install --omit=dev
pm2 start server.js --name ticket-admin || true
pm2 restart ticket-admin --update-env
pm2 save
systemctl enable pm2-root nginx
systemctl restart nginx
curl -fsS http://127.0.0.1:4173/api/status
```

## OCR CPU 配置

当前服务器是 8 核 16G 纯 CPU。`.env` 里保持：

```bash
TICKET_OCR_CONCURRENCY=1
TICKET_LOCAL_OCR_PARALLEL_JOBS=1
PADDLE_CPU_THREADS=8
PADDLE_ENABLE_MKLDNN=1
OMP_NUM_THREADS=8
MKL_NUM_THREADS=8
OPENBLAS_NUM_THREADS=8
NUMEXPR_NUM_THREADS=8
EXTERNAL_AI_FEATURES=0
EXTERNAL_API_MAX_CONCURRENCY=5
EXTERNAL_API_RETRIES=3
EXTERNAL_API_RETRY_DELAY_MS=2000
```

含义：票源 PDF 按页处理，默认全局一次只跑 1 个本地 OCR 页面进程；这个进程最多用 8 个 CPU 线程，并启用 MKL-DNN。
`EXTERNAL_AI_FEATURES=0` 表示票源 OCR、行底色和校对默认不走外部 AI 接口。

不要急着调高并发。只有当 CPU 和内存都很稳、但排队明显变慢时，再考虑测试：

```bash
TICKET_LOCAL_OCR_PARALLEL_JOBS=2
PADDLE_CPU_THREADS=4
```

## 测试完 80 后关闭 4173 公网直连

先确认这个网址能正常用：

```text
http://47.119.130.91/
```

确认没问题后，再执行下面命令。它会让 Node 只监听本机 `127.0.0.1`，公网只能通过 nginx 访问。

在自己电脑执行：

```bash
cd /Users/macbook/Documents/pw
LOCKDOWN_DIRECT_PORT=1 bash tools/deploy-server.sh
```

现在服务器已经进入这个正式状态。以后普通部署直接运行下面命令即可，脚本默认也会保持 `4173` 关闭：

```bash
cd /Users/macbook/Documents/pw
bash tools/deploy-server.sh
```

只有临时排查时才打开公网直连：

```bash
cd /Users/macbook/Documents/pw
ALLOW_DIRECT_PORT=1 bash tools/deploy-server.sh
```

如果想手动在服务器执行，也可以：

```bash
ssh root@47.119.130.91
cd /opt/ticket-admin
cp .env ".env.backup.$(date +%Y%m%d-%H%M%S)"
if grep -q '^HOST=' .env; then
  sed -i 's/^HOST=.*/HOST=127.0.0.1/' .env
else
  echo 'HOST=127.0.0.1' >> .env
fi
pm2 restart ticket-admin --update-env
pm2 save
ufw delete allow 4173/tcp || true
ufw deny 6379/tcp || true
ufw status verbose
```

关闭后验证：

```bash
curl -fsS http://127.0.0.1:4173/api/status
curl -fsS http://47.119.130.91/api/status
ss -ltnp | egrep ':(22|80|443|4173|6379)\b' || true
```

正确状态：

- `127.0.0.1:4173` 能访问
- `47.119.130.91/api/status` 能访问
- `4173` 如果还在监听，也只能是 `127.0.0.1:4173`
- `6379` 不应该对外监听

## 防火墙规则

正式阶段只需要：

- `22/tcp`：SSH
- `80/tcp`：网页入口
- `443/tcp`：以后加 HTTPS
- `6379/tcp`：明确拒绝。以后如果加 Redis，也只能内网/本机访问

查看防火墙：

```bash
ufw status verbose
```

当前测试阶段可以保留：

```bash
4173/tcp ALLOW
```

正式稳定后删除：

```bash
ufw delete allow 4173/tcp
```

## Redis/Celery 迁移说明

现在不用 Redis/Celery。当前业务量下，Node 内存异步队列 + PM2 足够。

以后如果出现这些现象，再迁移：

- 多个人同时上传大 PDF，任务明显排队
- 服务器重启时，希望未完成 OCR 任务不中断
- 需要多台服务器共同处理 OCR
- 需要后台任务失败后自动重试和持久化记录
