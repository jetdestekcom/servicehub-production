# 🔧 AlmaLinux Paket Kurulum Sorunları ve Çözümleri

## ❌ Karşılaştığınız Sorunlar:

1. **`docker-compose` bulunamadı**
2. **`postgresql15` bulunamadı** (muhtemelen `postgresql15` yazım hatası)

## ✅ Doğru AlmaLinux Paket Kurulum Komutları:

### 1. Önce Repository'leri Ekleyin:

```bash
# EPEL repository ekleyin
sudo dnf install -y epel-release

# Docker repository ekleyin
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# NodeSource repository ekleyin
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# PostgreSQL repository ekleyin
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

### 2. Doğru Paket İsimleri ile Kurulum:

```bash
# Temel paketler
sudo dnf install -y curl wget git unzip

# Docker (docker-compose plugin dahil)
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker Compose ayrı kurulum (eğer plugin çalışmazsa)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Nginx
sudo dnf install -y nginx

# Snapd (Certbot için)
sudo dnf install -y snapd

# Node.js ve NPM
sudo dnf install -y nodejs npm

# PostgreSQL (doğru isim)
sudo dnf install -y postgresql15-server postgresql15

# Redis
sudo dnf install -y redis

# Diğer gerekli araçlar
sudo dnf install -y postgresql15-contrib redis-tools
```

## 🔄 Alternatif Kurulum Yöntemleri:

### Docker Compose Alternatifleri:

**Seçenek 1: Docker Compose Plugin (Önerilen)**
```bash
# Docker Compose Plugin zaten docker-ce ile gelir
docker compose --version  # Test edin
```

**Seçenek 2: Standalone Docker Compose**
```bash
# Manuel kurulum
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version  # Test edin
```

**Seçenek 3: Python pip ile**
```bash
sudo dnf install -y python3-pip
sudo pip3 install docker-compose
```

### PostgreSQL Alternatifleri:

**Seçenek 1: PostgreSQL 15 (Önerilen)**
```bash
# Repository ekleme
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# PostgreSQL 15 kurulumu
sudo dnf install -y postgresql15-server postgresql15 postgresql15-contrib
```

**Seçenek 2: AlmaLinux Repository'den**
```bash
# AlmaLinux varsayılan repository'den
sudo dnf install -y postgresql postgresql-server postgresql-contrib
```

**Seçenek 3: Docker ile (Önerilen Production için)**
```bash
# PostgreSQL'yi Docker container olarak çalıştır
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16
```

## 🚀 Düzeltilmiş Tam Kurulum Script'i:

```bash
#!/bin/bash

echo "🔧 AlmaLinux 9.6.0 için JETDESTEK Platform Kurulumu"

# Sistem güncelleme
sudo dnf update -y

# EPEL repository ekleme
sudo dnf install -y epel-release

# Temel araçlar
sudo dnf install -y curl wget git unzip

# Docker repository ekleme
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Docker kurulumu
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker Compose standalone (backup)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Docker servisleri
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Node.js ve NPM
sudo dnf install -y nodejs npm

# Nginx
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Snapd (Certbot için)
sudo dnf install -y snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# PostgreSQL repository ekleme
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# PostgreSQL 15
sudo dnf install -y postgresql15-server postgresql15 postgresql15-contrib

# Redis
sudo dnf install -y redis redis-tools

# PM2
sudo npm install -g pm2

# Certbot
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

echo "✅ Kurulum tamamlandı!"
echo "🔄 Yeni terminal oturumu başlatın veya logout/login yapın"
```

## 🔍 Paket Kontrol Komutları:

```bash
# Kurulu paketleri kontrol et
docker --version
docker compose --version
docker-compose --version
nginx -v
node --version
npm --version
psql --version
redis-cli --version
pm2 --version
certbot --version

# Servis durumlarını kontrol et
sudo systemctl status docker nginx snapd
```

## ⚠️ Yaygın Hatalar ve Çözümleri:

### 1. "No match for argument" Hatası:
```bash
# Repository'leri güncelleyin
sudo dnf update

# Paket isimlerini kontrol edin
dnf search docker-compose
dnf search postgresql
```

### 2. Docker Permission Denied:
```bash
# Kullanıcıyı docker grubuna ekleyin
sudo usermod -aG docker $USER

# Yeni terminal oturumu başlatın
newgrp docker
```

### 3. Snapd Sorunları:
```bash
# Snapd servisini yeniden başlatın
sudo systemctl restart snapd

# Snap mount sorunları için
sudo snap refresh
```

### 4. PostgreSQL Başlatma:
```bash
# PostgreSQL'yi ilk kez başlatma
sudo postgresql-15-setup initdb
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15
```

## 🎯 Sonuç:

Artık AlmaLinux 9.6.0'da tüm gerekli paketler doğru şekilde kurulmuş olmalı. Docker Compose plugin kullanımını tercih edin, çünkü daha güncel ve bakımı kolaydır.
