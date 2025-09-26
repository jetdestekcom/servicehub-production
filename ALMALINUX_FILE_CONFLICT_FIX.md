# 🔧 AlmaLinux Dosya Çakışması Çözümü

## ❌ Karşılaştığınız Hata:
```
file /usr/lib/node_modules/npm/docs from install of npm-1:8.19.4-1.16.20.2.8.el9_4.x86_64 conflicts with file from package nodejs-2:20.19.5-1nodesource.x86_64
Error: Could not run transaction.
```

## 🔍 Sorun:
- NodeSource'dan kurulan Node.js 20.x ile AlmaLinux'tan kurulmaya çalışılan NPM arasında dosya çakışması
- `/usr/lib/node_modules/npm/docs` dosyası iki farklı paketten gelmeye çalışıyor

## ✅ Çözüm: Tam Temizlik ve Yeniden Kurulum

### 1. Tüm Node.js/NPM Paketlerini Kaldır:

```bash
# Tüm Node.js ve NPM paketlerini kaldır
sudo dnf remove -y nodejs npm

# NodeSource repository'lerini kaldır
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo rm -f /etc/yum.repos.d/nsolid*.repo

# DNF cache'i tamamen temizle
sudo dnf clean all
sudo dnf clean packages
sudo dnf clean metadata

# Sistem paket veritabanını yenile
sudo dnf makecache
```

### 2. Alternatif 1: AlmaLinux Varsayılan Node.js (En Basit):

```bash
# AlmaLinux AppStream'den temiz kurulum
sudo dnf install -y nodejs npm

# Versiyonları kontrol et
node --version
npm --version
```

### 3. Alternatif 2: NodeSource Temiz Kurulum:

```bash
# NodeSource 20 LTS repository ekle
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Node.js 20 LTS kur (npm dahil)
sudo dnf install -y nodejs

# Versiyonları kontrol et
node --version
npm --version
```

### 4. Alternatif 3: Manuel Dosya Temizliği:

```bash
# Manuel dosya temizliği (dikkatli olun!)
sudo rm -rf /usr/lib/node_modules/npm
sudo rm -rf /usr/share/doc/npm
sudo rm -rf /usr/share/man/man1/npm*

# Paket veritabanını temizle
sudo dnf clean all
sudo dnf makecache

# Yeniden kur
sudo dnf install -y nodejs npm
```

## 🚀 Önerilen Çözüm (En Güvenli):

```bash
# 1. Tam temizlik
sudo dnf remove -y nodejs npm
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo rm -f /etc/yum.repos.d/nsolid*.repo
sudo dnf clean all
sudo dnf clean packages

# 2. AlmaLinux varsayılan Node.js 18 LTS kur
sudo dnf install -y nodejs npm

# 3. Kontrol et
node --version
npm --version

# 4. Diğer paketleri kur
sudo dnf install -y nginx snapd git redis
```

## 🔧 Eğer Node.js 20 LTS Gerekliyse:

```bash
# 1. Tam temizlik
sudo dnf remove -y nodejs npm
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo dnf clean all
sudo dnf clean packages

# 2. NodeSource 20 LTS repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 3. Node.js 20 LTS kur (npm dahil)
sudo dnf install -y nodejs

# 4. Kontrol et
node --version  # v20.x.x olmalı
npm --version   # v10.x.x olmalı
```

## 📋 Paket Kurulum Sırası (Önerilen):

```bash
# 1. Temel araçlar
sudo dnf install -y curl wget git unzip epel-release

# 2. Docker
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Node.js (AlmaLinux varsayılan - çakışma yok)
sudo dnf install -y nodejs npm

# 4. Web sunucu
sudo dnf install -y nginx

# 5. SSL araçları
sudo dnf install -y snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# 6. Veritabanı
sudo dnf install -y redis

# 7. PostgreSQL
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql15-server postgresql15 postgresql15-contrib

# 8. PM2
sudo npm install -g pm2

# 9. Certbot
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 🔍 Kontrol Komutları:

```bash
# Node.js ve NPM versiyonlarını kontrol et
node --version
npm --version

# Repository'leri kontrol et
dnf repolist | grep -E "(nodesource|appstream)"

# Çakışan paketleri kontrol et
dnf check

# Kurulu Node.js paketlerini listele
rpm -qa | grep -E "(nodejs|npm)"
```

## ⚠️ Önemli Notlar:

### 1. AlmaLinux vs NodeSource:
- **AlmaLinux AppStream**: Node.js 18 LTS, kararlı, çakışma yok
- **NodeSource**: Node.js 20 LTS, en yeni, bazen çakışma olabilir

### 2. Proje Gereksinimleri:
- **Next.js 15**: Node.js 18+ gerekli
- **React 19**: Node.js 18+ gerekli
- **AlmaLinux Node.js 18 LTS**: Projeniz için yeterli

### 3. Temizlik Önemi:
- Repository çakışmaları yaygın
- Her zaman tam temizlik yapın
- Cache'i temizleyin

## 🎯 Sonuç:

**En güvenli çözüm**: AlmaLinux varsayılan Node.js 18 LTS kullanın. Bu çakışma olmadan çalışır ve projeniz için yeterlidir.

```bash
# Tek komutla güvenli çözüm
sudo dnf remove -y nodejs npm && sudo rm -f /etc/yum.repos.d/nodesource*.repo && sudo dnf clean all && sudo dnf install -y nodejs npm
```

Node.js 18 LTS ile projenizi başarıyla çalıştırabilirsiniz!
