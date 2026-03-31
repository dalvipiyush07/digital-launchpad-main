#!/bin/bash
set -e
cd /home/ec2-user/digital-launchpad

git pull origin main

# Stop and remove all
sudo docker stop cloudbuild_nginx cloudbuild_frontend cloudbuild_admin 2>/dev/null || true
sudo docker rm cloudbuild_nginx cloudbuild_frontend cloudbuild_admin 2>/dev/null || true

# Rebuild
sudo docker build -t cloudbuild_admin ./admin
sudo docker build -t cloudbuild_frontend .

# Start admin
sudo docker run -d \
  --name cloudbuild_admin \
  --network app_network \
  --restart unless-stopped \
  --env-file .env \
  -v admin_uploads:/app/public/uploads \
  -v admin_data:/app/data \
  cloudbuild_admin

# Start frontend
sudo docker run -d \
  --name cloudbuild_frontend \
  --network app_network \
  --restart unless-stopped \
  cloudbuild_frontend

# Start nginx
sudo docker run -d \
  --name cloudbuild_nginx \
  --network app_network \
  --restart unless-stopped \
  -p 80:80 -p 443:443 \
  -v $(pwd)/nginx-proxy.conf:/etc/nginx/conf.d/default.conf \
  -v certbot_www:/var/www/certbot \
  -v certbot_certs:/etc/letsencrypt \
  nginx:alpine

sleep 3
sudo docker ps
echo ""
echo "Site live at: http://16.171.154.28"
