# 🔧 AlmaLinux Node.js/NPM Sürüm Çakışması Çözümü

## ❌ Karşılaştığınız Hata:
```
package npm-1:8.19.4-1.16.20.2.8.el9_4.x86_64 from appstream requires nodejs = 1:16.20.2-8.e19_4
nsolid packages conflict with nodejs provided by nodejs-2:20.19.5-1nodesource.x86_64
```

## 🔍 Sorun Analizi:
- AlmaLinux AppStream'den `npm` paketi Node.js 16.x istiyor
- NodeSource repository'den Node.js 20.x kurulu
- Bu iki sürüm çakışıyor

## ✅ Çözüm: Repository'leri Temizle ve Doğru Sırayla Kur

### 1. Mevcut Node.js Repository'lerini Temizle:

```bash
# NodeSource repository'lerini kaldır
sudo dnf remove -y nodejs npm

# NodeSource repository dosyalarını sil
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo rm -f /etc/yum.repos.d/nsolid*.repo

# DNF cache'i temizle
sudo dnf clean all
sudo dnf makecache
```

### 2. Alternatif 1: AlmaLinux Varsayılan Node.js Kullanın (Önerilen):

```bash
# AlmaLinux AppStream'den Node.js 18.x kurun (LTS)
sudo dnf install -y nodejs npm

# Versiyonları kontrol edin
node --version
npm --version

# Diğer paketleri kurun
sudo dnf install -y nginx snapd git redis
```

### 3. Alternatif 2: NodeSource Repository'yi Doğru Şekilde Kurun:

```bash
# Önce mevcut Node.js'i kaldır
sudo dnf remove -y nodejs npm

# NodeSource repository'yi ekle (sadece Node.js 20 LTS)
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -

# npm'i NodeSource'den kur (çakışmayı önlemek için)
sudo dnf install -y nodejs npm --enablerepo=nodesource

# Diğer paketleri kur
sudo dnf install -y nginx snapd git redis
```

### 4. Alternatif 3: Sadece Node.js 20 LTS (NPM Olmadan):

```bash
# Sadece Node.js kur, NPM'i ayrı kur
sudo dnf remove -y nodejs npm

# NodeSource LTS repository
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -

# Sadece Node.js kur
sudo dnf install -y nodejs

# NPM'i Node.js ile birlikte gelen versiyonla kullan
# veya ayrı kur
sudo dnf install -y npm --allowerasing

# Diğer paketleri kur
sudo dnf install -y nginx snapd git redis
```

## 🚀 Önerilen Çözüm (En Basit):

```bash
# 1. Temizlik
sudo dnf remove -y nodejs npm
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo dnf clean all

# 2. AlmaLinux varsayılan Node.js 18 LTS kur
sudo dnf install -y nodejs npm

# 3. Diğer paketleri kur
sudo dnf install -y nginx snapd git redis

# 4. Kontrol et
node --version
npm --version
```

## 🔧 Eğer Node.js 20 LTS İstiyorsanız:

```bash
# 1. Temizlik
sudo dnf remove -y nodejs npm
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo dnf clean all

# 2. NodeSource 20 LTS repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 3. Node.js 20 LTS kur (npm dahil)
sudo dnf install -y nodejs

# 4. NPM'i ayrı kur (çakışma olursa)
sudo dnf install -y npm --allowerasing

# 5. Diğer paketleri kur
sudo dnf install -y nginx snapd git redis
```

## 📋 Paket Kurulum Sırası (Önerilen):

```bash
# 1. Temel araçlar
sudo dnf install -y curl wget git unzip epel-release

# 2. Docker
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Node.js (AlmaLinux varsayılan)
sudo dnf install -y nodejs npm

# 4. Web sunucu
sudo dnf install -y nginx

# 5. SSL araçları
sudo dnf install -y snapd

# 6. Veritabanı
sudo dnf install -y redis

# 7. PostgreSQL (repository ekleyerek)
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql15-server postgresql15 postgresql15-contrib

# 8. PM2
sudo npm install -g pm2
```

## 🔍 Kontrol Komutları:

```bash
# Node.js ve NPM versiyonlarını kontrol et
node --version
npm --version

# Repository'leri kontrol et
dnf repolist

# Çakışan paketleri kontrol et
dnf check
```

## ⚠️ Önemli Notlar:

### 1. Node.js 18 LTS vs 20 LTS:
- **Node.js 18 LTS**: AlmaLinux varsayılan, daha kararlı
- **Node.js 20 LTS**: En yeni, daha fazla özellik

### 2. NPM Versiyonu:
- Node.js 18 → NPM 9.x
- Node.js 20 → NPM 10.x

### 3. Proje Uyumluluğu:
- Next.js 15 → Node.js 18+ gerekli
- React 19 → Node.js 18+ gerekli

## 🎯 Sonuç:

**En basit çözüm**: AlmaLinux varsayılan Node.js 18 LTS kullanın. Bu çakışma olmadan çalışır ve projeniz için yeterlidir.

```bash
# Hızlı çözüm
sudo dnf remove -y nodejs npm
sudo rm -f /etc/yum.repos.d/nodesource*.repo
sudo dnf clean all
sudo dnf install -y nodejs npm nginx snapd git redis
```
