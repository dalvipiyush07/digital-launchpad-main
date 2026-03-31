#!/bin/bash
set -e

DOMAIN="cloudbuild.tech"
EMAIL="shivam.garud2011@gmail.com"
DIR="/home/ec2-user/digital-launchpad"

cd $DIR

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     CloudBuild Deploy Script         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────
echo "▶ [1/7] Pull latest code"
# ─────────────────────────────────────────
git pull origin main

# ─────────────────────────────────────────
echo "▶ [2/7] Stop & remove old containers"
# ─────────────────────────────────────────
sudo docker stop cloudbuild_nginx cloudbuild_frontend cloudbuild_admin 2>/dev/null || true
sudo docker rm   cloudbuild_nginx cloudbuild_frontend cloudbuild_admin 2>/dev/null || true

# Remove old images
sudo docker rmi cloudbuild_frontend cloudbuild_admin 2>/dev/null || true

# ─────────────────────────────────────────
echo "▶ [3/7] Create network & volumes"
# ─────────────────────────────────────────
sudo docker network create app_network 2>/dev/null || true
sudo docker volume create admin_uploads 2>/dev/null || true
sudo docker volume create admin_data    2>/dev/null || true
sudo docker volume create certbot_www   2>/dev/null || true
sudo docker volume create certbot_certs 2>/dev/null || true

# ─────────────────────────────────────────
echo "▶ [4/7] Build fresh images"
# ─────────────────────────────────────────
sudo docker build --no-cache -t cloudbuild_admin    ./admin
sudo docker build --no-cache -t cloudbuild_frontend .

# ─────────────────────────────────────────
echo "▶ [5/7] Start Admin & Frontend"
# ─────────────────────────────────────────
sudo docker run -d \
  --name cloudbuild_admin \
  --network app_network \
  --restart unless-stopped \
  --env-file $DIR/.env \
  -v admin_uploads:/app/public/uploads \
  -v admin_data:/app/data \
  cloudbuild_admin

sudo docker run -d \
  --name cloudbuild_frontend \
  --network app_network \
  --restart unless-stopped \
  cloudbuild_frontend

# ─────────────────────────────────────────
echo "▶ [6/7] SSL Certificate"
# ─────────────────────────────────────────
CERT_PATH=$(sudo docker run --rm -v certbot_certs:/etc/letsencrypt alpine test -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem && echo "exists" || echo "missing")
[ "$CERT_PATH" = "exists" ] && CERT_EXISTS=true || CERT_EXISTS=false

if [ "$CERT_EXISTS" = "true" ]; then
  echo "✅ SSL certificate already exists — skipping"
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  SSL Setup via DNS Challenge"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "  Certbot will ask you to add TXT records"
  echo "  in your domain registrar."
  echo ""
  echo "  For EACH record shown:"
  echo "  1. Go to your domain registrar"
  echo "  2. Add TXT record: _acme-challenge"
  echo "  3. Wait 30 seconds"
  echo "  4. Press Enter"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  sudo docker run -it --rm \
    -v certbot_certs:/etc/letsencrypt \
    -v certbot_www:/var/www/certbot \
    certbot/certbot certonly \
    --manual \
    --preferred-challenges dns \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN \
    -d admin.$DOMAIN

  echo "✅ SSL certificate obtained!"
fi

# ─────────────────────────────────────────
echo "▶ [7/7] Start Nginx (HTTP + HTTPS)"
# ─────────────────────────────────────────

# Check if SSL exists — use HTTPS config or HTTP-only fallback
if [ "$CERT_EXISTS" = "true" ]; then
  NGINX_CONF="$DIR/nginx-proxy.conf"
  echo "✅ Using HTTPS config"
else
  # Fallback: HTTP only
  cat > /tmp/nginx-fallback.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://cloudbuild_admin:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads/ {
        proxy_pass http://cloudbuild_admin:3001/uploads/;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://cloudbuild_frontend:80;
        proxy_set_header Host $host;
    }
}
EOF
  NGINX_CONF="/tmp/nginx-fallback.conf"
  echo "⚠️  No SSL cert — running HTTP only"
fi

sudo docker run -d \
  --name cloudbuild_nginx \
  --network app_network \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v $NGINX_CONF:/etc/nginx/conf.d/default.conf \
  -v certbot_www:/var/www/certbot \
  -v certbot_certs:/etc/letsencrypt \
  nginx:alpine

# Cleanup dangling images
sudo docker image prune -f 2>/dev/null || true

sleep 2

echo ""
echo "╔══════════════════════════════════════╗"
sudo docker ps --format "  ║ {{.Names}} → {{.Status}}"
echo "╚══════════════════════════════════════╝"
echo ""

if [ "$CERT_EXISTS" = "true" ]; then
  echo "  🌐  https://$DOMAIN"
  echo "  🔧  https://admin.$DOMAIN"
else
  echo "  🌐  http://13.61.3.32  (HTTP only)"
  echo "  Run ./deploy.sh again after SSL setup"
fi
echo ""
