#!/bin/bash
set -e

echo "======================================"
echo "  Step 1: Update Docker + buildx"
echo "======================================"
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Update buildx
mkdir -p ~/.docker/cli-plugins
curl -sSL https://github.com/docker/buildx/releases/latest/download/buildx-$(uname -s)-$(uname -m | sed 's/x86_64/amd64/') -o ~/.docker/cli-plugins/docker-buildx 2>/dev/null || \
curl -sSL "https://github.com/docker/buildx/releases/download/v0.17.0/buildx-v0.17.0.linux-amd64" -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx

echo "======================================"
echo "  Step 2: Create Docker network"
echo "======================================"
sudo docker network create app_network 2>/dev/null || true

echo "======================================"
echo "  Step 3: Create volumes"
echo "======================================"
sudo docker volume create admin_uploads 2>/dev/null || true
sudo docker volume create admin_data 2>/dev/null || true

echo "======================================"
echo "  Step 4: Build Admin image"
echo "======================================"
sudo docker build -t cloudbuild_admin ./admin

echo "======================================"
echo "  Step 5: Build Frontend image"
echo "======================================"
sudo docker build -t cloudbuild_frontend .

echo "======================================"
echo "  Step 6: Stop old containers"
echo "======================================"
sudo docker stop cloudbuild_admin cloudbuild_frontend cloudbuild_nginx 2>/dev/null || true
sudo docker rm cloudbuild_admin cloudbuild_frontend cloudbuild_nginx 2>/dev/null || true

echo "======================================"
echo "  Step 7: Start Admin"
echo "======================================"
sudo docker run -d \
  --name cloudbuild_admin \
  --network app_network \
  --restart unless-stopped \
  --env-file .env \
  -v admin_uploads:/app/public/uploads \
  -v admin_data:/app/data \
  cloudbuild_admin

echo "======================================"
echo "  Step 8: Start Frontend"
echo "======================================"
sudo docker run -d \
  --name cloudbuild_frontend \
  --network app_network \
  --restart unless-stopped \
  cloudbuild_frontend

echo "======================================"
echo "  Step 9: Start Nginx"
echo "======================================"
sudo docker run -d \
  --name cloudbuild_nginx \
  --network app_network \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/nginx-proxy.conf:/etc/nginx/conf.d/default.conf:ro \
  -v certbot_www:/var/www/certbot \
  -v certbot_certs:/etc/letsencrypt \
  nginx:alpine

echo ""
echo "======================================"
echo "  Done! Check: http://16.171.154.28"
echo "======================================"
