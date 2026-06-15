# VPS Setup — TPT Flow

Self-hosted deployment guide for a fresh Ubuntu 22.04/24.04 VPS.
Stack: Docker + Docker Compose + nginx (in-container) + Let's Encrypt (Certbot).

---

## 1. Provision the VPS

- Min spec: 1 vCPU, 1 GB RAM, 20 GB disk (2 GB RAM recommended for build)
- Open firewall ports: **22** (SSH), **80** (HTTP), **443** (HTTPS)
- Point your domain A-record at the VPS IP before proceeding (DNS must resolve before Certbot will issue a cert)

---

## 2. Install Docker & Docker Compose

```bash
# Update packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker (official script)
curl -fsSL https://get.docker.com | sudo sh

# Add your user to the docker group (avoids sudo on every command)
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

---

## 3. Clone the Repository

```bash
git clone https://github.com/PhillipC05/tpt-flow.git /opt/tpt-flow
cd /opt/tpt-flow
```

---

## 4. Environment Variables

The app currently has no secrets (no database, no API keys). The only runtime env vars are
set directly in [docker-compose.yml](../docker-compose.yml):

| Variable | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Next.js production mode |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disable Next.js telemetry |

If you add secrets later (e.g. a database URL, auth secret), **do not commit them**. Instead:

1. Create `/opt/tpt-flow/.env.production` (git-ignored):
   ```env
   DATABASE_URL=postgres://...
   NEXTAUTH_SECRET=...
   ```
2. Add to [docker-compose.yml](../docker-compose.yml) under the `web` service:
   ```yaml
   env_file:
     - .env.production
   ```

---

## 5. SSL — Let's Encrypt via Certbot

Certbot runs **on the host** (not in Docker) and writes certs to a directory that nginx mounts.

```bash
# Install Certbot
sudo apt-get install -y certbot

# Obtain certificate (standalone mode — temporarily binds port 80)
# docker compose must be stopped first if already running
sudo certbot certonly --standalone \
  --non-interactive \
  --agree-tos \
  --email you@example.com \
  -d yourdomain.com \
  -d www.yourdomain.com
```

Certs land in `/etc/letsencrypt/live/yourdomain.com/`.

### Mount certs into Docker

Update [docker-compose.yml](../docker-compose.yml) — replace the `ssl` volume on the `nginx` service:

```yaml
  nginx:
    volumes:
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro   # full letsencrypt dir (includes live/ and archive/)
```

### Update nginx.conf for HTTPS

Edit [docker/nginx.conf](../docker/nginx.conf):

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # ... existing upstream proxy_pass blocks ...
}
```

Remove the `# Redirect HTTP to HTTPS (uncomment when SSL is configured)` comment block from the HTTP server block (or delete the plain HTTP `location /` block entirely — it's replaced by the 301 above).

### Auto-renewal

Certbot installs a systemd timer automatically. Verify it:

```bash
sudo systemctl status certbot.timer
```

Because nginx runs inside Docker, you need a renewal hook to signal nginx to reload after cert renewal:

```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/bash
cd /opt/tpt-flow
docker compose exec nginx nginx -s reload
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Test renewal dry-run:

```bash
sudo certbot renew --dry-run
```

---

## 6. First Deploy

```bash
cd /opt/tpt-flow
docker compose up --build -d
```

Check status:

```bash
docker compose ps
docker compose logs -f
```

Health check endpoint: `https://yourdomain.com/api/health`

---

## 7. Subsequent Deploys

```bash
cd /opt/tpt-flow
git pull
docker compose up --build -d
```

Old image layers are replaced; nginx and the cert volume are unaffected.

---

## 8. Useful Commands

```bash
# Tail app logs
docker compose logs -f web

# Tail nginx logs
docker compose logs -f nginx

# Restart only the app (no rebuild)
docker compose restart web

# Stop everything
docker compose down

# Remove everything including images
docker compose down --rmi all
```

---

## Directory Layout on VPS

```
/opt/tpt-flow/
├── docker-compose.yml
├── Dockerfile
├── docker/
│   ├── nginx.conf          ← edit this for domain/SSL
│   └── ssl/                ← unused once /etc/letsencrypt is mounted
└── .env.production         ← secrets (git-ignored, create manually)

/etc/letsencrypt/live/yourdomain.com/
├── fullchain.pem
└── privkey.pem
```
