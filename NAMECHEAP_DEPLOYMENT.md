# 🚀 JETDESTEK Platform - Namecheap Deployment Guide

## 📋 VORBEREITUNG

### 1. **HOSTING ZUGANGSDATEN SAMMELN**
```bash
# FTP/SFTP Zugang (aus cPanel)
FTP_HOST: ftp.jetdestek.com
FTP_USER: dein-username
FTP_PASS: dein-password
FTP_PORT: 21

# cPanel Zugang
CPANEL_URL: https://jetdestek.com:2083
CPANEL_USER: dein-username
CPANEL_PASS: dein-password
```

### 2. **DATENBANK ERSTELLEN**
1. Gehe zu cPanel → MySQL Databases
2. Erstelle neue Datenbank: `jetdestek_prod`
3. Erstelle neuen Benutzer: `jetdestek_user`
4. Weise Benutzer zur Datenbank zu
5. Notiere die Zugangsdaten

### 3. **NODE.JS AKTIVIEREN**
1. Gehe zu cPanel → Node.js Selector
2. Wähle Node.js Version 18.x
3. Aktiviere Node.js für deine Domain

---

## 🛠️ DEPLOYMENT SCHRITTE

### **SCHRITT 1: LOKALE VORBEREITUNG**
```bash
# 1. Konfiguriere deploy-namecheap.sh
nano deploy-namecheap.sh

# 2. Füge deine Zugangsdaten ein:
FTP_HOST="ftp.jetdestek.com"
FTP_USER="dein-username"
FTP_PASS="dein-password"
DB_NAME="jetdestek_prod"
DB_USER="jetdestek_user"
DB_PASS="dein-db-password"

# 3. Führe das Deployment-Script aus
chmod +x deploy-namecheap.sh
./deploy-namecheap.sh
```

### **SCHRITT 2: DATEIEN HOCHLADEN**
```bash
# Verwende FileZilla oder cPanel File Manager
# Lade folgende Ordner/Dateien hoch:

# Hauptverzeichnis:
- .next/ (kompletter Ordner)
- public/ (kompletter Ordner)
- package.json
- .env.production
- .htaccess
- server.js (falls vorhanden)

# Struktur auf dem Server:
/public_html/
├── .next/
├── public/
├── package.json
├── .env.production
├── .htaccess
└── server.js
```

### **SCHRITT 3: DATENBANK MIGRATION**
```bash
# 1. Gehe zu cPanel → Terminal
# 2. Navigiere zu deinem Projektordner
cd public_html

# 3. Installiere Dependencies
npm install

# 4. Führe Prisma Migration aus
npx prisma migrate deploy

# 5. Generiere Prisma Client
npx prisma generate
```

### **SCHRITT 4: UMWELTVARIABLEN SETZEN**
```bash
# In cPanel → Node.js Selector
# Füge folgende Umgebungsvariablen hinzu:

NODE_ENV=production
NEXTAUTH_URL=https://jetdestek.com
NEXTAUTH_SECRET=dein-super-sicherer-secret
APP_URL=https://jetdestek.com
DATABASE_URL=mysql://jetdestek_user:password@localhost:3306/jetdestek_prod
JWT_SECRET=dein-jwt-secret
ENCRYPTION_KEY=dein-encryption-key
```

### **SCHRITT 5: ANWENDUNG STARTEN**
```bash
# In cPanel → Node.js Selector
# Starte die Anwendung:
npm start
```

---

## 🔧 NAMECHEAP SPEZIFISCHE KONFIGURATION

### **1. .htaccess OPTIMIERUNG**
```apache
# Für Namecheap Apache Server
RewriteEngine On

# Next.js Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/x-javascript
</IfModule>
```

### **2. MYSQL OPTIMIERUNG**
```sql
-- Für bessere Performance auf Namecheap
SET GLOBAL innodb_buffer_pool_size = 128M;
SET GLOBAL query_cache_size = 32M;
SET GLOBAL query_cache_type = 1;
```

### **3. NODE.JS KONFIGURATION**
```json
{
  "name": "jetdestek-platform",
  "version": "1.0.0",
  "scripts": {
    "start": "next start -p 3000",
    "build": "next build",
    "dev": "next dev"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

---

## 🚨 TROUBLESHOOTING

### **PROBLEM: Anwendung startet nicht**
```bash
# Lösung:
1. Überprüfe Node.js Version (muss 18+ sein)
2. Überprüfe Umgebungsvariablen
3. Überprüfe Datenbankverbindung
4. Überprüfe Logs in cPanel
```

### **PROBLEM: Datenbankverbindung fehlgeschlagen**
```bash
# Lösung:
1. Überprüfe DATABASE_URL Format
2. Überprüfe MySQL Benutzerrechte
3. Überprüfe Firewall-Einstellungen
4. Teste Verbindung in cPanel Terminal
```

### **PROBLEM: Statische Dateien laden nicht**
```bash
# Lösung:
1. Überprüfe .htaccess Konfiguration
2. Überprüfe Dateiberechtigungen (644 für Dateien, 755 für Ordner)
3. Überprüfe Rewrite Rules
4. Überprüfe MIME-Types
```

---

## ✅ NACH DEM DEPLOYMENT

### **1. FUNKTIONSTESTS**
- [ ] Homepage lädt korrekt
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Services werden angezeigt
- [ ] Buchungen funktionieren
- [ ] Zahlungen funktionieren

### **2. SICHERHEITSTESTS**
- [ ] HTTPS funktioniert
- [ ] Security Headers sind gesetzt
- [ ] Rate Limiting funktioniert
- [ ] Input Validation funktioniert
- [ ] SQL Injection Schutz aktiv

### **3. PERFORMANCE TESTS**
- [ ] Seite lädt schnell (< 3 Sekunden)
- [ ] Bilder sind optimiert
- [ ] Gzip Compression aktiv
- [ ] Caching funktioniert

---

## 🎯 FINALE KONFIGURATION

### **DOMAIN EINSTELLUNGEN**
1. **DNS Records** (in Namecheap DNS Management):
   ```
   A Record: @ → deine-server-ip
   CNAME: www → jetdestek.com
   ```

2. **SSL Zertifikat**:
   - Namecheap SSL ist bereits aktiviert
   - Überprüfe in cPanel → SSL/TLS

3. **Email Konfiguration**:
   - Erstelle Email-Accounts in cPanel
   - Konfiguriere SMTP für die Anwendung

---

## 🚀 FERTIG!

**Deine JETDESTEK Platform ist jetzt live auf Namecheap!**

**URL:** https://jetdestek.com
**Admin:** https://jetdestek.com/admin
**API:** https://jetdestek.com/api

**Nächste Schritte:**
1. Teste alle Funktionen
2. Konfiguriere Monitoring
3. Setze Backups auf
4. Überwache Performance
5. Plane Skalierung

**Viel Erfolg mit deiner Platform!** 🎉

