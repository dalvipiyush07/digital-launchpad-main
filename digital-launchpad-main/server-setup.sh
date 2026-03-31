#!/bin/bash
# ============================================
# CloudBuild.tech — AWS Linux Server Setup
# Run this ONCE on a fresh server
# ============================================

set -e

echo "======================================"
echo "  CloudBuild Server Setup"
echo "======================================"

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Add current user to docker group
sudo usermod -aG docker $USER

# 4. Install Git
sudo apt install -y git

# 5. Clone project
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git cloudbuild
cd cloudbuild

# 6. Create .env file
cat > .env << 'EOF'
GMAIL_USER=shivam.garud2011@gmail.com
GMAIL_APP_PASSWORD=tqpsbkrqnfoojopu
ADMIN_EMAIL=shivam.garud2011@gmail.com
WHATSAPP_LINK=https://wa.me/917709646107
PORT=3001
EOF

echo "======================================"
echo "  Setup complete!"
echo "  Now run: bash ssl-setup.sh"
echo "======================================"
