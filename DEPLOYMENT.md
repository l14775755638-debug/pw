# ticket-admin deployment

## Current production shape

- Server: `47.119.130.91`
- App directory: `/opt/ticket-admin`
- Runtime: Node.js + PM2 (`ticket-admin`)
- Reverse proxy: nginx is installed and enabled. The app currently also listens on `PORT=4173` for direct testing.
- Startup: `pm2-root` is enabled in systemd and restores `/root/.pm2/dump.pm2` after a reboot.
- OCR pipeline: browser uploads the source and polls progress; PDF rendering, Aliyun OCR requests, OpenCV row-color detection, PaddleOCR anchor OCR, and PP-Structure checks run from `server.js` on the server.
- Queue state: current OCR jobs are in the Node process memory map. Redis/Celery is not installed in the current deployment.

## Deploy or recover the service

From the local repo:

```bash
npm run check
npm run deploy:server
```

nginx can use the checked-in reverse proxy config:

```bash
cp deploy/nginx-ticket-admin.conf /etc/nginx/sites-available/ticket-admin
ln -sf /etc/nginx/sites-available/ticket-admin /etc/nginx/sites-enabled/ticket-admin
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

On the server, the minimal recovery command is:

```bash
cd /opt/ticket-admin
git pull --ff-only
npm install --omit=dev
pm2 start server.js --name ticket-admin || true
pm2 restart ticket-admin --update-env
pm2 save
systemctl enable pm2-root nginx
```

## CPU OCR defaults

The deploy script keeps these CPU settings in `.env`:

```bash
PADDLE_CPU_THREADS=4
PADDLE_ENABLE_MKLDNN=1
OMP_NUM_THREADS=4
MKL_NUM_THREADS=4
OPENBLAS_NUM_THREADS=4
NUMEXPR_NUM_THREADS=4
```

For the current 8-core CPU server and `TICKET_OCR_CONCURRENCY=2`, this lets two OCR/Paddle worker processes use about four CPU threads each. If the OCR provider rate limit becomes the bottleneck, keep concurrency at 2. If local PaddleOCR becomes the bottleneck and memory remains stable, test `TICKET_OCR_CONCURRENCY=3` with `PADDLE_CPU_THREADS=2`.

## Ports and firewall

Required public ports:

- `22/tcp`: SSH administration.
- `80/tcp`: HTTP access or HTTP-to-HTTPS redirect.
- `443/tcp`: HTTPS after a certificate is configured.
- `4173/tcp`: direct test access only. Remove this after nginx is the only public entry.

Ports that must not be public:

- `6379/tcp`: Redis, if Redis is added later, must bind to `127.0.0.1` or a private network only.

Host firewall baseline:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 4173/tcp
ufw deny 6379/tcp
ufw --force enable
ufw status verbose
```

When direct testing is no longer needed, remove `4173/tcp` from the firewall and set `HOST=127.0.0.1` in `/opt/ticket-admin/.env`, then restart PM2.
