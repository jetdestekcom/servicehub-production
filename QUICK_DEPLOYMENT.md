# ⚡ Hızlı VPS Deployment

## 🚀 Tek Komutla Kurulum

VPS'inizde aşağıdaki komutu çalıştırın:

```bash
curl -fsSL https://raw.githubusercontent.com/yourrepo/deploy.sh | bash
```

## 📋 Manuel Hızlı Kurulum

### 1. Sistem Hazırlığı
```bash
# Sistem güncelleme
sudo apt update && sudo apt upgrade -y

# Gerekli paketler
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx nodejs npm git

# Docker başlatma
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### 2. Proje Kurulumu
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

### 3. SSL Sertifikası
```bash
# Self-signed (test için)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=JETDESTEK/CN=yourdomain.com"

# Let's Encrypt (production için)
sudo certbot --nginx -d yourdomain.com
```

### 4. Çalıştırma
```bash
# Servisleri başlat
docker compose -f docker-compose.production.yml up -d

# Migration çalıştır
docker compose -f docker-compose.production.yml exec app npx prisma migrate deploy

# Durum kontrolü
docker compose -f docker-compose.production.yml ps
```

## 🔧 Temel Komutlar

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

## ⚠️ Önemli Notlar

1. **Environment dosyasını mutlaka düzenleyin**
2. **Güçlü şifreler kullanın**
3. **SSL sertifikası alın**
4. **Firewall ayarlarını yapın**
5. **Backup stratejinizi kurun**

## 🆘 Sorun Giderme

**502 Bad Gateway:** App servisi çalışmıyor, logları kontrol edin
**Database Error:** PostgreSQL servisi çalışmıyor, restart edin
**SSL Error:** Sertifika dosyalarını kontrol edin

