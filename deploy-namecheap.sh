#!/bin/bash

# JETDESTEK Platform Deployment für Namecheap Stellar Business
# Optimiert für cPanel/WHM Hosting

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 JETDESTEK Platform - Namecheap Deployment${NC}"

# Configuration
DOMAIN="jetdestek.com"
FTP_HOST="ftp.jetdestek.com"
FTP_USER="cursor@jetdestek.com"
FTP_PASS="{H9Nm[f2BLoM"
DB_HOST="localhost"
DB_NAME="jetdmyqu_jetdestek_prod"
DB_USER="jetdmyqu_jetdestek_user"
DB_PASS="Tq9M7,s?x?zu"

# Check if configuration is provided
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${YELLOW}⚠️  Bitte konfiguriere die FTP Zugangsdaten in der Datei${NC}"
    echo -e "${YELLOW}   Bearbeite deploy-namecheap.sh und füge deine Daten ein${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Überprüfe Hosting-Konfiguration...${NC}"

# Test FTP connection
echo -e "${BLUE}📡 Teste FTP Verbindung...${NC}"
if ! curl -s --connect-timeout 10 ftp://$FTP_HOST > /dev/null; then
    echo -e "${RED}❌ FTP Verbindung fehlgeschlagen${NC}"
    exit 1
fi
echo -e "${GREEN}✅ FTP Verbindung erfolgreich${NC}"

# Build application for production
echo -e "${BLUE}🏗️  Baue Anwendung für Production...${NC}"
npm run build

# Create production environment file
echo -e "${BLUE}⚙️  Erstelle Production Environment...${NC}"
cat > .env.production << EOF
NODE_ENV=production
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)
APP_URL=https://$DOMAIN

# Database - Namecheap MySQL
DATABASE_URL=mysql://$DB_USER:$DB_PASS@$DB_HOST:3306/$DB_NAME

# Security Keys
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# Domain
DOMAIN=$DOMAIN
EOF

# Create .htaccess for Apache
echo -e "${BLUE}📝 Erstelle .htaccess für Apache...${NC}"
cat > .htaccess << 'EOF'
# JETDESTEK Platform - Apache Configuration

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
</IfModule>

# Enable Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Rewrite Rules for Next.js
RewriteEngine On

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security - Block access to sensitive files
<FilesMatch "\.(env|log|sql|bak|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Block access to .git directory
RedirectMatch 404 /\.git

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www (optional)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
EOF

# Create package.json for production
echo -e "${BLUE}📦 Erstelle Production package.json...${NC}"
cat > package.production.json << 'EOF'
{
  "name": "jetdestek-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "next start -p 3000",
    "build": "next build",
    "dev": "next dev"
  },
  "dependencies": {
    "next": "15.5.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "ioredis": "^5.3.0",
    "dompurify": "^3.0.0",
    "@types/dompurify": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

echo -e "${GREEN}✅ Production Build abgeschlossen${NC}"
echo -e "${BLUE}📋 Nächste Schritte:${NC}"
echo -e "  1. Lade die Dateien via FTP hoch"
echo -e "  2. Konfiguriere die Datenbank in cPanel"
echo -e "  3. Setze die Umgebungsvariablen"
echo -e "  4. Starte die Anwendung"

echo -e "${GREEN}🎉 Deployment vorbereitet!${NC}"
