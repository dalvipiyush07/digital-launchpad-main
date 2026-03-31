#!/bin/bash
set -e

DOMAIN="cloudbuild.tech"
EMAIL="shivam.garud2011@gmail.com"

echo "======================================"
echo "  Step 1: Start HTTP nginx for certbot"
echo "======================================"

# Temp HTTP-only nginx config
cat > /tmp/nginx-http-only.conf << 'EOF'
server {
    listen 80;
    server_name cloudbuild.tech www.cloudbuild.tech admin.cloudbuild.tech;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'waiting for ssl';
        add_header Content-Type text/plain;
    }
}
EOF

# Backup real config, use temp
cp nginx-proxy.conf nginx-proxy.conf.bak
cp /tmp/nginx-http-only.conf nginx-proxy.conf

# Start nginx only
sudo docker-compose up -d nginx
sleep 5

echo "======================================"
echo "  Step 2: Get SSL Certificate"
echo "======================================"

sudo docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN \
  -d admin.$DOMAIN

echo "======================================"
echo "  Step 3: Restore nginx config + start all"
echo "======================================"

cp nginx-proxy.conf.bak nginx-proxy.conf
sudo docker-compose up -d --build

echo ""
echo "======================================"
echo "  LIVE at https://cloudbuild.tech"
echo "  Admin: https://admin.cloudbuild.tech"
echo "======================================"
