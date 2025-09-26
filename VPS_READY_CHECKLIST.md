# ✅ VPS Hazırlık Kontrol Listesi

## 🎉 Başarılı Kurulumlar:

### ✅ Node.js ve NPM:
- **Node.js**: v18.20.8 (LTS) ✅
- **NPM**: 10.8.2 ✅

### ✅ Uyumluluk Durumu:
- **Next.js 15**: ✅ Uyumlu
- **React 19**: ✅ Uyumlu  
- **TypeScript 5.6**: ✅ Uyumlu
- **Prisma 6**: ✅ Uyumlu

## 🚀 Şimdi Yapmanız Gerekenler:

### 1. Proje Dizini Oluşturun:
```bash
# Proje dizini
sudo mkdir -p /opt/servicehub
sudo chown $USER:$USER /opt/servicehub
cd /opt/servicehub
```

### 2. Proje Dosyalarını Kopyalayın:
```bash
# SCP ile (yerel bilgisayarınızdan):
scp -r /path/to/your/project/* username@YOUR_VPS_IP:/opt/servicehub/

# Veya Git ile:
git clone https://github.com/yourusername/servicehub.git .
```

### 3. Gerekli Dizinleri Oluşturun:
```bash
mkdir -p uploads logs backups ssl
```

### 4. Environment Dosyasını Hazırlayın:
```bash
# Environment template'ini kopyalayın
cp env.production.template .env.production.local

# Düzenleyin
nano .env.production.local
```

### 5. Environment Değişkenlerini Doldurun:
```env
# Domain ayarları
NEXTAUTH_URL="https://yourdomain.com"
DOMAIN="yourdomain.com"

# Veritabanı
DATABASE_URL="postgresql://jetdestek:STRONG_PASSWORD@postgres:5432/jetdestek_prod"

# Güvenlik
NEXTAUTH_SECRET="your-super-secret-key-here"
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-encryption-key"

# Redis
REDIS_URL="redis://:STRONG_REDIS_PASSWORD@redis:6379"

# Email (Gmail örneği)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Payment (Stripe)
STRIPE_PUBLISHABLE_KEY="pk_live_your_key"
STRIPE_SECRET_KEY="sk_live_your_key"
```

### 6. SSL Sertifikası Oluşturun:
```bash
# Self-signed sertifika (test için)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=JETDESTEK/CN=yourdomain.com"

# Let's Encrypt (production için)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. Docker Servislerini Başlatın:
```bash
# Servisleri başlat
docker compose -f docker-compose.production.yml up -d

# Migration çalıştır
docker compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# Durum kontrolü
docker compose -f docker-compose.production.yml ps
```

### 8. PM2 ile Otomatik Restart:
```bash
# PM2 kurulumu
sudo npm install -g pm2

# PM2 konfigürasyonu
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'servicehub',
    script: 'docker-compose.production.yml',
    args: 'up -d',
    cwd: '/opt/servicehub',
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

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔍 Kontrol Komutları:

### Sistem Durumu:
```bash
# Node.js versiyonları
node --version
npm --version

# Docker durumu
docker --version
docker compose --version
sudo systemctl status docker

# Nginx durumu
nginx -v
sudo systemctl status nginx

# Redis durumu
redis-cli --version
sudo systemctl status redis
```

### Proje Durumu:
```bash
# Docker servisleri
docker compose -f docker-compose.production.yml ps

# Logları görüntüle
docker compose -f docker-compose.production.yml logs -f

# Health check
curl -f http://localhost:3000/api/health/check
```

## 📋 Kalan Görevler:

### 1. Domain DNS Ayarları:
```
A Record: yourdomain.com → VPS_IP
CNAME: www.yourdomain.com → yourdomain.com
```

### 2. Firewall Kontrolü:
```bash
# Firewall durumu
sudo firewall-cmd --state
sudo firewall-cmd --list-all

# Gerekli portları açın
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. Monitoring Kurulumu:
```bash
# Monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status Check ==="

if docker compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Services are down - restarting..."
    docker compose -f docker-compose.production.yml restart
fi

DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Disk usage is high: $DISK_USAGE%"
else
    echo "✅ Disk usage is normal: $DISK_USAGE%"
fi

MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "⚠️  Memory usage is high: $MEMORY_USAGE%"
else
    echo "✅ Memory usage is normal: $MEMORY_USAGE%"
fi

echo "=========================="
EOF

chmod +x monitor.sh

# Cron job ekle
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/servicehub/monitor.sh >> /opt/servicehub/logs/monitor.log 2>&1") | crontab -
```

## 🎯 Sonraki Adımlar:

1. **Proje dosyalarını kopyalayın**
2. **Environment dosyasını düzenleyin**
3. **SSL sertifikası alın**
4. **Docker servislerini başlatın**
5. **Domain DNS ayarlarını yapın**
6. **Monitoring kurulumunu tamamlayın**

## 🚀 Test:

```bash
# Projenizi test edin
curl -I https://yourdomain.com
curl -I http://localhost:3000

# API endpoint'lerini test edin
curl https://yourdomain.com/api/health/check
```

Artık VPS'inizde JETDESTEK Platform'unu çalıştırmaya hazırsınız! 🎉
