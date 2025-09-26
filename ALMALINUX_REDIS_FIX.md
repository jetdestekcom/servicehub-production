# 🔧 AlmaLinux Redis-Tools Sorunu ve Çözümü

## ❌ Karşılaştığınız Hata:
```
No match for argument: redis-tools
Error: Unable to find a match: redis-tools
```

## ✅ Çözüm: AlmaLinux'ta Redis Kurulumu

### 1. Redis Paketlerini Ayrı Ayrı Kurun:

```bash
# Önce temel redis paketini kurun
sudo dnf install -y redis

# redis-tools yerine redis-cli zaten redis paketi ile gelir
# Kontrol edin:
redis-cli --version
```

### 2. Redis Araçlarını Kontrol Edin:

```bash
# Redis komutlarını test edin
redis-cli ping
redis-cli info
redis-server --version
```

### 3. Eksik Redis Araçları için Alternatif:

```bash
# Eğer ek araçlar gerekiyorsa, Python redis-tools kurabilirsiniz:
sudo dnf install -y python3-pip
pip3 install redis-tools
```

## 🚀 Düzeltilmiş Kurulum Komutları:

### Adım Adım AlmaLinux Kurulumu:

```bash
# 1. Sistem güncelleme
sudo dnf update -y

# 2. EPEL repository
sudo dnf install -y epel-release

# 3. Temel araçlar
sudo dnf install -y curl wget git unzip

# 4. Docker repository ve kurulumu
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 5. Docker Compose standalone
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 6. Docker servisleri
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# 7. NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 8. Node.js ve NPM
sudo dnf install -y nodejs npm

# 9. Nginx
sudo dnf install -y nginx

# 10. Snapd
sudo dnf install -y snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# 11. PostgreSQL repository ve kurulumu
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql15-server postgresql15 postgresql15-contrib

# 12. Redis (redis-tools olmadan)
sudo dnf install -y redis

# 13. PM2
sudo npm install -g pm2

# 14. Certbot
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 🔍 Redis Kurulumunu Test Edin:

```bash
# Redis servisini başlatın
sudo systemctl enable redis
sudo systemctl start redis

# Redis'i test edin
redis-cli ping
# Beklenen çıktı: PONG

# Redis bilgilerini görün
redis-cli info server

# Redis servis durumu
sudo systemctl status redis
```

## 📋 AlmaLinux Paket İsimleri Referansı:

| Ubuntu/Debian | AlmaLinux/RHEL | Notlar |
|---------------|----------------|---------|
| `redis-tools` | `redis` | redis-cli dahil |
| `docker-compose` | `docker-compose-plugin` | Plugin olarak |
| `postgresql-15` | `postgresql15` | Repository gerekli |
| `python3-certbot-nginx` | `python3-certbot-nginx` | EPEL'den |

## ⚠️ AlmaLinux Özel Notlar:

### 1. Redis Tools Alternatifleri:
```bash
# Redis CLI (zaten redis paketi ile gelir)
redis-cli

# Redis monitoring için
redis-cli monitor

# Redis benchmark
redis-benchmark

# Redis server
redis-server
```

### 2. Eğer Ek Araçlar Gerekiyorsa:
```bash
# Python tabanlı redis araçları
sudo dnf install -y python3-pip
pip3 install redis redis-tools

# veya
pip3 install redis-cli
```

### 3. Docker ile Redis (Önerilen Production için):
```bash
# Redis'yi Docker container olarak çalıştırın
docker run --name redis -p 6379:6379 -d redis:7-alpine

# Test edin
docker exec -it redis redis-cli ping
```

## 🎯 Sonuç:

AlmaLinux'ta `redis-tools` paketi yoktur, ancak `redis` paketi ile `redis-cli` gelir. Bu yeterlidir. Eğer ek araçlar gerekiyorsa Python pip ile kurabilirsiniz veya Docker kullanabilirsiniz.

## ✅ Kontrol Komutları:

```bash
# Tüm kurulumları test edin
docker --version
docker compose --version
nginx -v
node --version
npm --version
psql --version
redis-cli --version
pm2 --version
certbot --version

# Servis durumları
sudo systemctl status docker nginx redis snapd
```
