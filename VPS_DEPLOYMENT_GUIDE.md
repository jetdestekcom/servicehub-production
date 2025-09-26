# 🚀 JETDESTEK Platform VPS Deployment Rehberi

Bu rehber, JETDESTEK Platform'unuzu VPS sunucunuza taşıyıp production ortamında çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Ön Gereksinimler

### VPS Gereksinimleri
- **Minimum**: 2 CPU, 4GB RAM, 50GB SSD
- **Önerilen**: 4 CPU, 8GB RAM, 100GB SSD
- **İşletim Sistemi**: Ubuntu 22.04 LTS veya 20.04 LTS
- **Domain**: Kendi domain adınız (örn: jetdestek.com)

### Güncellenen Teknolojiler
✅ **React**: 18.2.0 → 19.0.0 (En yeni)  
✅ **Node.js**: >=18.0.0 → >=20.0.0 (LTS)  
✅ **PostgreSQL**: 15 → 16 (En yeni)  
✅ **NextAuth**: 4.24.11 → 5.0.0-beta.22  
✅ **TypeScript**: 5 → 5.6.0  
✅ **TailwindCSS**: 3.3.5 → 3.4.0  

## 🔧 VPS Kurulum Adımları

### 1. VPS'e Bağlanma
```bash
ssh root@YOUR_VPS_IP
# veya
ssh username@YOUR_VPS_IP
```

### 2. Sistem Güncellemesi
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
```

### 3. Docker Kurulumu
```bash
# Docker GPG key ekleme
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker repository ekleme
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker kurulumu
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Kullanıcıyı docker grubuna ekleme
sudo usermod -aG docker $USER
```

### 4. Node.js 20 LTS Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 5. PM2 Kurulumu (Process Manager)
```bash
sudo npm install -g pm2
```

### 6. Nginx Kurulumu
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 7. SSL Sertifikası (Certbot)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8. PostgreSQL ve Redis Araçları
```bash
sudo apt install -y postgresql-client redis-tools
```

## 🔒 Güvenlik Konfigürasyonu

### Firewall Ayarları
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

### SSH Güvenliği
```bash
# SSH config düzenleme
sudo nano /etc/ssh/sshd_config

# Aşağıdaki ayarları yapın:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 2222 (isteğe bağlı)

sudo systemctl restart ssh
```

## 📁 Proje Kurulumu

### 1. Proje Dizini Oluşturma
```bash
sudo mkdir -p /opt/servicehub
sudo chown $USER:$USER /opt/servicehub
cd /opt/servicehub
```

### 2. Proje Dosyalarını Kopyalama
**Seçenek A: Git ile**
```bash
git clone https://github.com/yourusername/servicehub.git .
```

**Seçenek B: SCP ile (Yerel bilgisayarınızdan)**
```bash
# Yerel bilgisayarınızda çalıştırın:
scp -r /path/to/your/project/* username@YOUR_VPS_IP:/opt/servicehub/
```

**Seçenek C: SFTP ile**
```bash
# FileZilla veya WinSCP kullanarak dosyaları kopyalayın
```

### 3. Gerekli Dizinleri Oluşturma
```bash
mkdir -p uploads logs backups ssl
```

### 4. Environment Dosyası Oluşturma
```bash
cp env.production.template .env.production.local
nano .env.production.local
```

**Önemli Environment Değişkenleri:**
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

### 5. SSL Sertifikası Oluşturma
```bash
# Self-signed sertifika (test için)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=JETDESTEK/CN=yourdomain.com"

# Let's Encrypt sertifikası (production için)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🐳 Docker ile Çalıştırma

### 1. Production Build
```bash
docker compose -f docker-compose.production.yml build --no-cache
```

### 2. Servisleri Başlatma
```bash
docker compose -f docker-compose.production.yml up -d
```

### 3. Veritabanı Migration
```bash
docker compose -f docker-compose.production.yml exec app npx prisma migrate deploy
```

### 4. Servis Durumunu Kontrol Etme
```bash
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs -f
```

## 🔄 Otomatik Deployment

### 1. PM2 Konfigürasyonu
```bash
# PM2 ecosystem dosyası oluşturma
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

# PM2 ile başlatma
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Systemd Servis
```bash
# PM2 systemd servisi oluşturma
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 📊 Monitoring ve Loglama

### 1. Log Rotation
```bash
sudo tee /etc/logrotate.d/servicehub << EOF
/opt/servicehub/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker compose -f /opt/servicehub/docker-compose.production.yml restart nginx
    endscript
}
EOF
```

### 2. Monitoring Script
```bash
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status Check ==="

# Servis kontrolü
if docker compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Services are down - restarting..."
    docker compose -f docker-compose.production.yml restart
fi

# Disk kullanımı
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Disk usage is high: $DISK_USAGE%"
else
    echo "✅ Disk usage is normal: $DISK_USAGE%"
fi

# Memory kullanımı
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "⚠️  Memory usage is high: $MEMORY_USAGE%"
else
    echo "✅ Memory usage is normal: $MEMORY_USAGE%"
fi

echo "=========================="
EOF

chmod +x monitor.sh

# Cron job ekleme
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/servicehub/monitor.sh >> /opt/servicehub/logs/monitor.log 2>&1") | crontab -
```

## 🔄 Backup Stratejisi

### 1. Otomatik Veritabanı Backup
```bash
# Backup script zaten hazır: scripts/backup.sh
# Docker Compose'da backup servisi otomatik çalışır
```

### 2. Manuel Backup
```bash
# Veritabanı backup
docker compose -f docker-compose.production.yml exec postgres pg_dump -U jetdestek jetdestek_prod > backup_$(date +%Y%m%d).sql

# Dosya backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

## 🚨 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

**1. Docker servisleri başlamıyor**
```bash
# Log kontrolü
docker compose -f docker-compose.production.yml logs

# Servisleri yeniden başlatma
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

**2. Veritabanı bağlantı hatası**
```bash
# PostgreSQL durumu
docker compose -f docker-compose.production.yml exec postgres pg_isready -U jetdestek

# Veritabanı yeniden oluşturma
docker compose -f docker-compose.production.yml down -v
docker compose -f docker-compose.production.yml up -d
```

**3. SSL sertifika sorunu**
```bash
# Let's Encrypt sertifika yenileme
sudo certbot renew --dry-run
sudo certbot renew
```

**4. Nginx 502 Bad Gateway**
```bash
# Nginx log kontrolü
sudo tail -f /var/log/nginx/error.log

# App servisi kontrolü
docker compose -f docker-compose.production.yml exec app curl localhost:3000/api/health/check
```

## 📈 Performance Optimizasyonu

### 1. Nginx Optimizasyonu
```bash
# /etc/nginx/nginx.conf düzenleme
sudo nano /etc/nginx/nginx.conf

# Worker process sayısını CPU core sayısına eşitleyin
worker_processes auto;
worker_connections 2048;
```

### 2. PostgreSQL Optimizasyonu
```bash
# postgresql.conf düzenleme
docker compose -f docker-compose.production.yml exec postgres nano /var/lib/postgresql/data/postgresql.conf

# Önemli ayarlar:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# maintenance_work_mem = 64MB
```

### 3. Redis Optimizasyonu
```bash
# redis.conf düzenleme
docker compose -f docker-compose.production.yml exec redis nano /usr/local/etc/redis/redis.conf

# Önemli ayarlar:
# maxmemory 256mb
# maxmemory-policy allkeys-lru
```

## 🔐 Güvenlik Kontrol Listesi

- [ ] Firewall aktif ve yapılandırılmış
- [ ] SSH güvenliği yapılandırılmış
- [ ] SSL sertifikası kurulu
- [ ] Güçlü şifreler kullanılıyor
- [ ] Environment dosyası güvenli
- [ ] Düzenli backup yapılıyor
- [ ] Sistem güncellemeleri otomatik
- [ ] Monitoring aktif

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. **Log dosyalarını kontrol edin:**
   ```bash
   docker compose -f docker-compose.production.yml logs -f
   tail -f /opt/servicehub/logs/monitor.log
   ```

2. **Sistem durumunu kontrol edin:**
   ```bash
   ./monitor.sh
   docker compose -f docker-compose.production.yml ps
   ```

3. **Servisleri yeniden başlatın:**
   ```bash
   docker compose -f docker-compose.production.yml restart
   ```

---

## 🎉 Tebrikler!

JETDESTEK Platform'unuz artık VPS'inizde production ortamında çalışıyor! 

**Sonraki adımlar:**
1. Domain DNS ayarlarını yapın
2. SSL sertifikasını Let's Encrypt ile alın
3. Monitoring sistemini kurun
4. Backup stratejinizi test edin
5. Performance optimizasyonlarını yapın

**Platform URL:** `https://yourdomain.com`

