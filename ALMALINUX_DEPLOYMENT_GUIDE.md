# 🚀 JETDESTEK Platform AlmaLinux 9.6.0 Deployment Rehberi

Bu rehber, JETDESTEK Platform'unuzu AlmaLinux 9.6.0 VPS sunucunuza taşıyıp production ortamında çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Ön Gereksinimler

### VPS Gereksinimleri
- **Minimum**: 2 CPU, 4GB RAM, 50GB SSD
- **Önerilen**: 4 CPU, 8GB RAM, 100GB SSD
- **İşletim Sistemi**: AlmaLinux 9.6.0
- **Domain**: Kendi domain adınız (örn: jetdestek.com)

## 🔧 AlmaLinux 9.6.0 Kurulum Adımları

### 1. VPS'e Bağlanma
```bash
ssh root@YOUR_VPS_IP
# veya
ssh username@YOUR_VPS_IP
```

### 2. Sistem Güncellemesi
```bash
sudo dnf update -y
sudo dnf install -y curl wget git unzip epel-release
```

### 3. Docker Kurulumu
```bash
# Docker repository ekleme
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Docker kurulumu
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker servisini başlatma
sudo systemctl enable docker
sudo systemctl start docker

# Kullanıcıyı docker grubuna ekleme
sudo usermod -aG docker $USER

# Docker Compose ayrı kurulum (eğer plugin çalışmazsa)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Node.js 20 LTS Kurulumu
```bash
# NodeSource repository ekleme
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Node.js kurulumu
sudo dnf install -y nodejs

# NPM güncelleme
sudo npm install -g npm@latest
```

### 5. PM2 Kurulumu (Process Manager)
```bash
sudo npm install -g pm2
```

### 6. Nginx Kurulumu
```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 7. SSL Sertifikası (Certbot)
```bash
# Snapd kurulumu (Certbot için)
sudo dnf install -y snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# Snapd güncelleme
sudo snap install core
sudo snap refresh core

# Certbot kurulumu
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Nginx plugin için
sudo dnf install -y python3-certbot-nginx
```

### 8. PostgreSQL ve Redis Araçları
```bash
sudo dnf install -y postgresql15 redis
```

### 9. SELinux Konfigürasyonu (AlmaLinux için önemli)
```bash
# SELinux durumunu kontrol et
sestatus

# SELinux'u geçici olarak devre dışı bırak (test için)
sudo setenforce 0

# Kalıcı olarak devre dışı bırak (production için dikkatli olun)
sudo nano /etc/selinux/config
# SELINUX=disabled olarak değiştirin
```

## 🔒 Güvenlik Konfigürasyonu

### Firewall Ayarları (firewalld)
```bash
# Firewall durumunu kontrol et
sudo systemctl status firewalld

# Firewall'u başlat ve etkinleştir
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Portları aç
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=5432/tcp  # PostgreSQL (isteğe bağlı)
sudo firewall-cmd --permanent --add-port=6379/tcp  # Redis (isteğe bağlı)

# Firewall kurallarını yeniden yükle
sudo firewall-cmd --reload

# Aktif kuralları listele
sudo firewall-cmd --list-all
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

# SSH servisini yeniden başlat
sudo systemctl restart sshd
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
echo "=== AlmaLinux System Status Check ==="

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

# SELinux durumu
SELINUX_STATUS=$(getenforce)
echo "🔒 SELinux status: $SELINUX_STATUS"

# Firewall durumu
FIREWALL_STATUS=$(sudo firewall-cmd --state)
echo "🔥 Firewall status: $FIREWALL_STATUS"

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

## 🚨 AlmaLinux Özel Troubleshooting

### Yaygın Sorunlar ve Çözümleri

**1. SELinux Permission Denied**
```bash
# SELinux context'ini düzelt
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_can_network_connect_db 1

# Docker için SELinux policy
sudo setsebool -P container_manage_cgroup on
```

**2. Firewall Blokajı**
```bash
# Firewall kurallarını kontrol et
sudo firewall-cmd --list-all

# Portları yeniden ekle
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**3. Docker Permission Denied**
```bash
# Docker grup üyelik kontrolü
groups $USER

# Kullanıcıyı docker grubuna ekle
sudo usermod -aG docker $USER

# Yeni terminal oturumu başlat veya logout/login yap
```

**4. Snapd Sorunları**
```bash
# Snapd servisini yeniden başlat
sudo systemctl restart snapd

# Snap mount sorunları için
sudo snap refresh
```

**5. Nginx Config Test**
```bash
# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

## 📈 AlmaLinux Performance Optimizasyonu

### 1. Nginx Optimizasyonu
```bash
# /etc/nginx/nginx.conf düzenleme
sudo nano /etc/nginx/nginx.conf

# Worker process sayısını CPU core sayısına eşitleyin
worker_processes auto;
worker_connections 2048;
```

### 2. Systemd Optimizasyonu
```bash
# Docker servis optimizasyonu
sudo systemctl edit docker

# Aşağıdaki içeriği ekleyin:
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --storage-driver=overlay2
```

### 3. AlmaLinux Özel Ayarlar
```bash
# DNF paket yöneticisi optimizasyonu
echo "fastestmirror=true" | sudo tee -a /etc/dnf/dnf.conf
echo "max_parallel_downloads=10" | sudo tee -a /etc/dnf/dnf.conf

# Systemd journal boyut sınırı
echo "SystemMaxUse=1G" | sudo tee -a /etc/systemd/journald.conf
```

## 🔐 AlmaLinux Güvenlik Kontrol Listesi

- [ ] SELinux yapılandırılmış (disabled/enforcing)
- [ ] Firewalld aktif ve yapılandırılmış
- [ ] SSH güvenliği yapılandırılmış
- [ ] SSL sertifikası kurulu
- [ ] Güçlü şifreler kullanılıyor
- [ ] Environment dosyası güvenli
- [ ] Düzenli backup yapılıyor
- [ ] Sistem güncellemeleri otomatik
- [ ] Monitoring aktif

## 📞 AlmaLinux Destek

Herhangi bir sorun yaşarsanız:

1. **Log dosyalarını kontrol edin:**
   ```bash
   docker compose -f docker-compose.production.yml logs -f
   tail -f /opt/servicehub/logs/monitor.log
   journalctl -u docker -f
   ```

2. **Sistem durumunu kontrol edin:**
   ```bash
   ./monitor.sh
   docker compose -f docker-compose.production.yml ps
   sudo systemctl status docker nginx
   ```

3. **SELinux ve Firewall kontrolü:**
   ```bash
   sestatus
   sudo firewall-cmd --list-all
   ```

4. **Servisleri yeniden başlatın:**
   ```bash
   docker compose -f docker-compose.production.yml restart
   sudo systemctl restart docker nginx
   ```

---

## 🎉 Tebrikler!

JETDESTEK Platform'unuz artık AlmaLinux 9.6.0 VPS'inizde production ortamında çalışıyor! 

**Sonraki adımlar:**
1. Domain DNS ayarlarını yapın
2. SSL sertifikasını Let's Encrypt ile alın
3. SELinux politikalarını optimize edin
4. Monitoring sistemini kurun
5. Backup stratejinizi test edin
6. Performance optimizasyonlarını yapın

**Platform URL:** `https://yourdomain.com`
