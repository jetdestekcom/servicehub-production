# ⚡ AlmaLinux 9.6.0 Hızlı VPS Deployment

## 🚀 Tek Komutla Kurulum

AlmaLinux VPS'inizde aşağıdaki komutu çalıştırın:

```bash
curl -fsSL https://raw.githubusercontent.com/yourrepo/almalinux-deploy.sh | bash
```

## 📋 Manuel Hızlı Kurulum

### 1. Sistem Hazırlığı
```bash
# Sistem güncelleme
sudo dnf update -y

# Gerekli paketler
sudo dnf install -y epel-release
sudo dnf install -y docker docker-compose nginx snapd nodejs npm git

# Docker başlatma
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### 2. SELinux Konfigürasyonu
```bash
# SELinux durumunu kontrol et
sestatus

# Geçici olarak permissive yap (test için)
sudo setenforce 0

# Web servisleri için SELinux booleans
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_can_network_connect_db 1
sudo setsebool -P container_manage_cgroup on
```

### 3. Firewall Ayarları
```bash
# Firewalld başlat
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Portları aç
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

### 4. SSL Sertifikası
```bash
# Snapd kurulumu
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# Certbot kurulumu
sudo snap install core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Self-signed (test için)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=JETDESTEK/CN=yourdomain.com"

# Let's Encrypt (production için)
sudo certbot --nginx -d yourdomain.com
```

### 5. Proje Kurulumu
```bash
# Proje dizini
sudo mkdir -p /opt/servicehub
sudo chown $USER:$USER /opt/servicehub
cd /opt/servicehub

# Proje dosyalarını kopyalayın (SCP, Git, vs.)

# Gerekli dizinler
mkdir -p uploads logs backups ssl

# Environment dosyası
cp env.production.template .env.production.local
nano .env.production.local  # Değerlerinizi girin
```

### 6. Çalıştırma
```bash
# Servisleri başlat
docker compose -f docker-compose.production.yml up -d

# Migration çalıştır
docker compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# Durum kontrolü
docker compose -f docker-compose.production.yml ps
```

## 🔧 AlmaLinux Özel Komutlar

```bash
# SELinux durumu
sestatus
getenforce

# Firewall durumu
sudo firewall-cmd --state
sudo firewall-cmd --list-all

# Systemd servisleri
sudo systemctl status docker nginx
sudo systemctl restart docker nginx

# DNF paket yöneticisi
sudo dnf update
sudo dnf install package-name
sudo dnf remove package-name
```

## 🐳 Docker Komutları

```bash
# Servisleri başlat
docker compose -f docker-compose.production.yml up -d

# Servisleri durdur
docker compose -f docker-compose.production.yml down

# Logları görüntüle
docker compose -f docker-compose.production.yml logs -f

# Servisleri yeniden başlat
docker compose -f docker-compose.production.yml restart

# Backup al
docker compose -f docker-compose.production.yml exec postgres pg_dump -U jetdestek jetdestek_prod > backup.sql
```

## ⚠️ AlmaLinux Özel Notlar

### SELinux Konfigürasyonu
```bash
# Production için SELinux ayarları
sudo nano /etc/selinux/config

# Aşağıdaki seçeneklerden birini seçin:
# SELINUX=disabled     (En kolay, güvenlik riski)
# SELINUX=permissive   (Orta seviye güvenlik)
# SELINUX=enforcing    (En güvenli, daha karmaşık)
```

### Firewalld Komutları
```bash
# Servis ekleme
sudo firewall-cmd --permanent --add-service=http

# Port ekleme
sudo firewall-cmd --permanent --add-port=3000/tcp

# Kuralları yenile
sudo firewall-cmd --reload

# Tüm kuralları listele
sudo firewall-cmd --list-all
```

### Snapd Kullanımı
```bash
# Snap servisini başlat
sudo systemctl start snapd

# Snap paketlerini listele
snap list

# Snap paketini güncelle
sudo snap refresh package-name
```

## 🆘 AlmaLinux Sorun Giderme

### Yaygın Sorunlar

**1. SELinux Permission Denied**
```bash
# SELinux context'ini düzelt
sudo setsebool -P httpd_can_network_connect 1
sudo restorecon -R /opt/servicehub
```

**2. Firewall Blokajı**
```bash
# Firewall durumunu kontrol et
sudo firewall-cmd --state

# Portları yeniden ekle
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

**3. Docker Permission Denied**
```bash
# Docker grup üyelik kontrolü
groups $USER

# Yeni terminal oturumu başlat
newgrp docker
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

## 📊 Performance İpuçları

### 1. DNF Optimizasyonu
```bash
# /etc/dnf/dnf.conf dosyasına ekleyin:
echo "fastestmirror=true" | sudo tee -a /etc/dnf/dnf.conf
echo "max_parallel_downloads=10" | sudo tee -a /etc/dnf/dnf.conf
```

### 2. Systemd Journal Optimizasyonu
```bash
# /etc/systemd/journald.conf dosyasına ekleyin:
echo "SystemMaxUse=1G" | sudo tee -a /etc/systemd/journald.conf
```

### 3. Nginx Optimizasyonu
```bash
# /etc/nginx/nginx.conf düzenleme
sudo nano /etc/nginx/nginx.conf

# Worker process sayısını CPU core sayısına eşitleyin
worker_processes auto;
worker_connections 2048;
```

## 🔐 Güvenlik Kontrol Listesi

- [ ] SELinux yapılandırılmış (disabled/permissive/enforcing)
- [ ] Firewalld aktif ve yapılandırılmış
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
   journalctl -u docker -f
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Sistem durumunu kontrol edin:**
   ```bash
   ./monitor.sh
   sestatus
   sudo firewall-cmd --list-all
   ```

3. **Servisleri yeniden başlatın:**
   ```bash
   docker compose -f docker-compose.production.yml restart
   sudo systemctl restart docker nginx
   ```
