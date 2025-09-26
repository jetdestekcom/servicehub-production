# 🚀 VPS Server İlk Kurulum Rehberi - SSH Üzerinden

Bu rehber, yeni bir VPS server'da SSH üzerinden ilk kurulum yapmak için gerekli tüm adımları içerir.

## 📋 Ön Gereksinimler

### VPS Gereksinimleri
- **Minimum**: 2 CPU, 4GB RAM, 50GB SSD
- **Önerilen**: 4 CPU, 8GB RAM, 100GB SSD
- **İşletim Sistemi**: Ubuntu 22.04 LTS (önerilen)
- **SSH Erişimi**: Root veya sudo yetkili kullanıcı

### Gerekli Bilgiler
- VPS IP adresi
- SSH anahtarı veya root şifresi
- Domain adı (opsiyonel, ilk kurulum için gerekli değil)

---

## 🔐 1. SSH Bağlantısı ve İlk Güvenlik

### SSH ile Bağlanma
```bash
# Root kullanıcı ile bağlanma
ssh root@YOUR_VPS_IP

# Veya kullanıcı adı ile
ssh username@YOUR_VPS_IP
```

### İlk Güvenlik Ayarları
```bash
# Sistem güncelleme
apt update && apt upgrade -y

# Güvenlik paketleri
apt install -y ufw fail2ban unattended-upgrades

# Firewall aktifleştirme
ufw enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443

# Fail2ban yapılandırması
systemctl enable fail2ban
systemctl start fail2ban

# Otomatik güncellemeler
dpkg-reconfigure -plow unattended-upgrades
```

### Yeni Kullanıcı Oluşturma (Root yerine)
```bash
# Yeni kullanıcı oluştur
adduser jetdestek
usermod -aG sudo jetdestek

# SSH anahtarı ekleme (önerilen)
mkdir -p /home/jetdestek/.ssh
nano /home/jetdestek/.ssh/authorized_keys
# SSH public key'inizi buraya yapıştırın
chmod 700 /home/jetdestek/.ssh
chmod 600 /home/jetdestek/.ssh/authorized_keys
chown -R jetdestek:jetdestek /home/jetdestek/.ssh

# Root SSH'ı devre dışı bırakma (güvenlik için)
nano /etc/ssh/sshd_config
# PermitRootLogin no
systemctl restart ssh
```

---

## 🛠️ 2. Temel Sistem Araçları

### Gerekli Paketlerin Kurulumu
```bash
# Temel araçlar
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Sistem izleme araçları
apt install -y htop iotop nethogs tree vim nano

# Network araçları
apt install -y net-tools dnsutils iputils-ping

# Dosya sistem araçları
apt install -y rsync tar gzip
```

### Zaman Dilimi Ayarlama
```bash
# Türkiye saat dilimi
timedatectl set-timezone Europe/Istanbul
timedatectl set-ntp true
```

---

## 🐳 3. Docker Kurulumu

### Docker Repository Ekleme
```bash
# Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Paket listesini güncelle
apt update
```

### Docker Kurulumu
```bash
# Docker kurulumu
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker servisini başlat
systemctl enable docker
systemctl start docker

# Kullanıcıyı docker grubuna ekle
usermod -aG docker $USER

# Docker Compose kurulumu (eski yöntem)
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Docker kurulumunu test et
docker --version
docker-compose --version
```

---

## 🟢 4. Node.js Kurulumu

### Node.js 20 LTS Kurulumu
```bash
# NodeSource repository ekleme
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Node.js kurulumu
apt install -y nodejs

# NPM güncelleme
npm install -g npm@latest

# PM2 kurulumu (Process Manager)
npm install -g pm2

# Kurulumu test et
node --version
npm --version
pm2 --version
```

---

## 🌐 5. Nginx Kurulumu

### Nginx Kurulumu
```bash
# Nginx kurulumu
apt install -y nginx

# Nginx servisini başlat
systemctl enable nginx
systemctl start nginx

# Nginx durumunu kontrol et
systemctl status nginx

# Firewall'da Nginx portlarını aç
ufw allow 'Nginx Full'
```

### Nginx Temel Yapılandırması
```bash
# Nginx yapılandırma dosyasını düzenle
nano /etc/nginx/nginx.conf

# Worker process sayısını CPU core sayısına eşitle
# worker_processes auto;
# worker_connections 1024;

# Nginx'i yeniden başlat
systemctl restart nginx
```

---

## 🗄️ 6. Veritabanı Araçları

### PostgreSQL Client Kurulumu
```bash
# PostgreSQL client kurulumu
apt install -y postgresql-client

# Redis araçları
apt install -y redis-tools

# Veritabanı yönetim araçları
apt install -y postgresql-contrib
```

---

## 🔒 7. SSL Sertifikası (Certbot)

### Let's Encrypt Kurulumu
```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx

# Certbot'u test et
certbot --version
```

---

## 📁 8. Proje Dizini Hazırlığı

### Proje Dizini Oluşturma
```bash
# Proje dizini oluştur
mkdir -p /opt/servicehub
chown $USER:$USER /opt/servicehub
cd /opt/servicehub

# Gerekli alt dizinleri oluştur
mkdir -p uploads logs backups ssl config

# Dizin izinlerini ayarla
chmod 755 uploads logs backups ssl config
```

---

## 🔧 9. Sistem İzleme ve Loglama

### Log Rotation Ayarları
```bash
# Logrotate yapılandırması
nano /etc/logrotate.d/servicehub

# İçeriği:
/opt/servicehub/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
```

### Sistem İzleme Scripti
```bash
# Monitoring script oluştur
cat > /opt/servicehub/monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status Check - $(date) ==="

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

# Load average
LOAD_AVG=$(uptime | awk -F'load average:' '{ print $2 }')
echo "📊 Load Average: $LOAD_AVG"

# Docker servisleri
if command -v docker &> /dev/null; then
    if docker ps | grep -q "Up"; then
        echo "✅ Docker services are running"
    else
        echo "❌ No Docker services running"
    fi
fi

echo "================================"
EOF

# Script'i çalıştırılabilir yap
chmod +x /opt/servicehub/monitor.sh

# Cron job ekle (her 5 dakikada bir çalışsın)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/servicehub/monitor.sh >> /opt/servicehub/logs/monitor.log 2>&1") | crontab -
```

---

## 🔄 10. Otomatik Güncellemeler

### Sistem Güncellemeleri
```bash
# Otomatik güncellemeleri yapılandır
nano /etc/apt/apt.conf.d/50unattended-upgrades

# Aşağıdaki satırları ekle:
# Unattended-Upgrade::Automatic-Reboot "true";
# Unattended-Upgrade::Automatic-Reboot-Time "02:00";

# Güncelleme zamanlaması
nano /etc/apt/apt.conf.d/20auto-upgrades

# İçeriği:
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Automatic-Remove "1";
```

---

## 🛡️ 11. Güvenlik Kontrol Listesi

### Güvenlik Ayarlarını Kontrol Et
```bash
# Firewall durumu
ufw status verbose

# SSH ayarları
ss -tlnp | grep :22

# Fail2ban durumu
fail2ban-client status

# Sistem güncellemeleri
apt list --upgradable

# Disk kullanımı
df -h

# Memory kullanımı
free -h

# CPU bilgisi
lscpu
```

---

## 📊 12. Sistem Performansı

### Sistem Bilgilerini Görüntüle
```bash
# Sistem bilgileri
echo "=== System Information ==="
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "CPU: $(lscpu | grep "Model name" | cut -d: -f2 | xargs)"
echo "Memory: $(free -h | awk 'NR==2{print $2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $2}')"
echo "Uptime: $(uptime -p)"
```

---

## 🚀 13. Proje Deployment Hazırlığı

### Proje Dosyalarını Kopyalama Seçenekleri

**Seçenek A: Git ile**
```bash
cd /opt/servicehub
git clone https://github.com/yourusername/servicehub.git .
```

**Seçenek B: SCP ile (Yerel bilgisayarınızdan)**
```bash
# Yerel bilgisayarınızda çalıştırın:
scp -r /path/to/your/project/* username@YOUR_VPS_IP:/opt/servicehub/
```

**Seçenek C: SFTP ile**
```bash
# FileZilla, WinSCP veya başka bir SFTP client kullanın
```

### Environment Dosyası Hazırlığı
```bash
# Environment template'ini kopyala
cp env.production.template .env.production.local

# Environment dosyasını düzenle
nano .env.production.local
```

---

## ✅ 14. Kurulum Sonrası Kontroller

### Tüm Servislerin Durumunu Kontrol Et
```bash
# Sistem servisleri
systemctl status nginx
systemctl status docker
systemctl status fail2ban

# Port dinleme durumu
netstat -tlnp | grep -E ':(80|443|22|3000|5432|6379)'

# Disk ve memory
df -h
free -h

# Network bağlantıları
ss -tuln
```

### Test Komutları
```bash
# Docker test
docker run hello-world

# Node.js test
node -e "console.log('Node.js çalışıyor!')"

# Nginx test
curl -I http://localhost

# Monitoring script test
/opt/servicehub/monitor.sh
```

---

## 🎯 15. Sonraki Adımlar

### Proje Deployment
1. **Proje dosyalarını kopyalayın**
2. **Environment dosyasını yapılandırın**
3. **Docker servislerini başlatın**
4. **SSL sertifikası alın**
5. **Domain DNS ayarlarını yapın**

### Güvenlik
1. **SSH anahtarlarını yapılandırın**
2. **Firewall kurallarını gözden geçirin**
3. **Fail2ban ayarlarını optimize edin**
4. **Düzenli backup stratejisi kurun**

### Monitoring
1. **Log dosyalarını izleyin**
2. **Sistem performansını takip edin**
3. **Uyarı sistemleri kurun**
4. **Backup'ları test edin**

---

## 🆘 Sorun Giderme

### Yaygın Sorunlar

**1. SSH Bağlantı Sorunu**
```bash
# SSH servisini kontrol et
systemctl status ssh
systemctl restart ssh

# Port kontrolü
ss -tlnp | grep :22
```

**2. Docker Çalışmıyor**
```bash
# Docker servisini başlat
systemctl start docker
systemctl enable docker

# Kullanıcıyı docker grubuna ekle
usermod -aG docker $USER
newgrp docker
```

**3. Nginx 502 Hatası**
```bash
# Nginx loglarını kontrol et
tail -f /var/log/nginx/error.log

# Nginx yapılandırmasını test et
nginx -t
```

**4. Disk Alanı Dolu**
```bash
# Disk kullanımını kontrol et
df -h
du -sh /*

# Gereksiz dosyaları temizle
apt autoremove -y
apt autoclean
```

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. **Log dosyalarını kontrol edin:**
   ```bash
   journalctl -xe
   tail -f /var/log/syslog
   ```

2. **Sistem durumunu kontrol edin:**
   ```bash
   /opt/servicehub/monitor.sh
   systemctl status
   ```

3. **Servisleri yeniden başlatın:**
   ```bash
   systemctl restart nginx docker
   ```

---

## 🎉 Tebrikler!

VPS server'ınız artık production ortamı için hazır! 

**Sonraki adım:** Proje dosyalarınızı kopyalayıp deployment sürecine geçebilirsiniz.

**Önemli Notlar:**
- Bu rehber Ubuntu 22.04 LTS için optimize edilmiştir
- Tüm komutlar root veya sudo yetkisi gerektirir
- Güvenlik ayarlarını mutlaka gözden geçirin
- Düzenli backup almayı unutmayın
