#!/bin/bash

# VPS Deployment Script for JETDESTEK Platform
# This script automates the deployment process on your VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="yourdomain.com"
EMAIL="your-email@domain.com"
PROJECT_NAME="servicehub"

echo -e "${BLUE}🚀 Starting JETDESTEK Platform Deployment${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    print_warning "Docker installed. You may need to log out and back in for group changes to take effect."
fi

# Install Node.js 20 LTS
print_status "Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install PM2 for process management
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Install Certbot for SSL
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Install PostgreSQL client tools
print_status "Installing PostgreSQL client tools..."
sudo apt install -y postgresql-client

# Install Redis tools
print_status "Installing Redis tools..."
sudo apt install -y redis-tools

# Configure firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5432  # PostgreSQL (only if needed for external access)
sudo ufw allow 6379  # Redis (only if needed for external access)

# Create project directory
print_status "Creating project directory..."
sudo mkdir -p /opt/$PROJECT_NAME
sudo chown $USER:$USER /opt/$PROJECT_NAME
cd /opt/$PROJECT_NAME

# Clone or copy project files
if [ -d ".git" ]; then
    print_status "Updating existing project..."
    git pull origin main
else
    print_warning "Please copy your project files to /opt/$PROJECT_NAME"
    print_warning "You can use:"
    print_warning "  scp -r /path/to/your/project/* user@$DOMAIN:/opt/$PROJECT_NAME/"
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p uploads logs backups ssl

# Set up environment file
if [ ! -f ".env.production.local" ]; then
    print_warning "Creating environment file template..."
    cp env.production.template .env.production.local
    print_warning "Please edit .env.production.local with your actual values!"
fi

# Generate SSL certificates
print_status "Generating SSL certificates..."
if [ ! -f "ssl/cert.pem" ]; then
    print_warning "Generating self-signed certificate for initial setup..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=TR/ST=Istanbul/L=Istanbul/O=JETDESTEK/CN=$DOMAIN"
    
    print_warning "For production, replace with Let's Encrypt certificates:"
    print_warning "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# Build and start services
print_status "Building and starting services..."
docker compose -f docker-compose.production.yml down --remove-orphans
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
docker compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'docker-compose.production.yml',
    args: 'up -d',
    cwd: '/opt/$PROJECT_NAME',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Setup systemd service for PM2
print_status "Setting up systemd service..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
pm2 save

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/$PROJECT_NAME << EOF
/opt/$PROJECT_NAME/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker compose -f /opt/$PROJECT_NAME/docker-compose.production.yml restart nginx
    endscript
}
EOF

# Setup monitoring script
print_status "Setting up monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash
# Simple monitoring script

check_service() {
    if docker compose -f docker-compose.production.yml ps | grep -q "Up"; then
        echo "✅ Services are running"
    else
        echo "❌ Services are down - restarting..."
        docker compose -f docker-compose.production.yml restart
    fi
}

check_disk() {
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        echo "⚠️  Disk usage is high: $DISK_USAGE%"
    else
        echo "✅ Disk usage is normal: $DISK_USAGE%"
    fi
}

check_memory() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $MEMORY_USAGE -gt 80 ]; then
        echo "⚠️  Memory usage is high: $MEMORY_USAGE%"
    else
        echo "✅ Memory usage is normal: $MEMORY_USAGE%"
    fi
}

echo "=== System Status Check ==="
check_service
check_disk
check_memory
echo "=========================="
EOF

chmod +x monitor.sh

# Setup cron job for monitoring
print_status "Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/$PROJECT_NAME/monitor.sh >> /opt/$PROJECT_NAME/logs/monitor.log 2>&1") | crontab -

print_status "🎉 Deployment completed successfully!"
print_warning "Next steps:"
print_warning "1. Edit /opt/$PROJECT_NAME/.env.production.local with your actual values"
print_warning "2. Get real SSL certificates: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
print_warning "3. Configure your domain DNS to point to this server"
print_warning "4. Test your application at https://$DOMAIN"

echo -e "${GREEN}🚀 JETDESTEK Platform is ready!${NC}"

