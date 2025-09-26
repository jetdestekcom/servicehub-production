#!/bin/bash

# JetDestek VPS Deployment Script
# Bu script VPS'te çalıştırılacak

echo "🚀 JetDestek VPS Deployment Başlıyor..."

# 1. Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
dnf update -y

# 2. Node.js 18.x kurulumu
echo "🔧 Node.js 18.x kuruluyor..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# 3. PM2 kurulumu
echo "⚙️ PM2 kuruluyor..."
npm install -g pm2

# 4. Nginx kurulumu
echo "🌐 Nginx kuruluyor..."
dnf install -y nginx

# 5. PostgreSQL kurulumu
echo "🗄️ PostgreSQL kuruluyor..."
dnf install -y postgresql-server postgresql-contrib
postgresql-setup --initdb
systemctl enable postgresql
systemctl start postgresql

# 6. Redis kurulumu
echo "🔴 Redis kuruluyor..."
dnf install -y redis
systemctl enable redis
systemctl start redis

# 7. Git ve diğer araçlar
echo "🛠️ Ek araçlar kuruluyor..."
dnf install -y git curl wget unzip

# 8. Firewall ayarları
echo "🔥 Firewall yapılandırılıyor..."
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload

# 9. Nginx başlatma
echo "🌐 Nginx başlatılıyor..."
systemctl enable nginx
systemctl start nginx

# 10. Proje klasörü oluşturma
echo "📁 Proje klasörü oluşturuluyor..."
mkdir -p /var/www/jetdestek
cd /var/www/jetdestek

# 11. Git clone
echo "📥 Proje klonlanıyor..."
git clone https://github.com/kullaniciadi/servicehub.git .

# 12. Bağımlılıkları yükleme
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# 13. Environment dosyası
echo "⚙️ Environment yapılandırılıyor..."
cp .env.production .env.local

# 14. Prisma setup
echo "🗄️ Veritabanı yapılandırılıyor..."
npx prisma generate
npx prisma db push

# 15. Build
echo "🔨 Proje build ediliyor..."
npm run build

# 16. PM2 ile başlatma
echo "🚀 Uygulama başlatılıyor..."
pm2 start npm --name "jetdestek" -- start
pm2 startup
pm2 save

# 17. Nginx konfigürasyonu
echo "🌐 Nginx yapılandırılıyor..."
cat > /etc/nginx/conf.d/jetdestek.conf << 'EOF'
server {
    listen 80;
    server_name jetdestek.com www.jetdestek.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 18. Nginx restart
systemctl restart nginx

echo "✅ Deployment tamamlandı!"
echo "🌐 Site: http://jetdestek.com"
echo "📊 PM2 Status: pm2 status"
echo "📝 Logs: pm2 logs jetdestek"
