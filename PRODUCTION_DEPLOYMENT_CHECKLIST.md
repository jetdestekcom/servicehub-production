# Production Deployment Checklist

## Änderungen für Online-Bereitstellung

Diese Datei dokumentiert alle Änderungen, die für die lokale Entwicklung gemacht wurden und für die Production-Bereitstellung rückgängig gemacht werden müssen.

### 1. NextAuth.js Konfiguration

**Datei:** `src/lib/auth.ts`

**Änderungen für Production:**
- [ ] GoogleProvider aktivieren (auskommentieren)
- [ ] PrismaAdapter aktivieren (auskommentieren)
- [ ] Mock-User für Development entfernen
- [ ] Echte CredentialsProvider für Production konfigurieren
- [ ] JWT Secret für Production konfigurieren (nicht Development-Fallback verwenden)
- [ ] NEXTAUTH_SECRET für Production konfigurieren (nicht Development-Fallback verwenden)

**Aktueller Zustand:**
```typescript
// Google Provider temporär deaktiviert für lokale Entwicklung
// GoogleProvider({
//   clientId: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// }),

// Adapter für lokale Entwicklung deaktiviert
// adapter: PrismaAdapter(prisma),

// Development-Fallbacks für Secrets
secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-local-development-only-32-chars',
jwt: {
  secret: process.env.JWT_SECRET || 'your-jwt-secret-for-local-development-only-32-chars',
  maxAge: 30 * 24 * 60 * 60, // 30 days
},
```

### 2. Session Management

**Datei:** `src/lib/session-utils.ts`

**Änderungen für Production:**
- [ ] `useMockSession()` und `useSessionSafe()` entfernen
- [ ] Alle Components auf echte `useSession()` umstellen

**Betroffene Dateien:**
- `src/components/Navigation.tsx`
- `src/components/MobileNavigation.tsx`
- `src/app/favorites/page.tsx`
- `src/app/admin/users/page.tsx`
- `src/app/messages/page.tsx`
- `src/app/bookings/manage/page.tsx`
- `src/app/services/manage/page.tsx`
- `src/app/profile/page.tsx`
- `src/components/Chat.tsx`

### 3. Redis Konfiguration

**Dateien:** 
- `src/lib/redis-client.ts`
- `src/lib/advanced-rate-limiter.ts`
- `src/lib/security-config.ts`

**Änderungen für Production:**
- [ ] Redis-Verbindung für Production aktivieren
- [ ] Rate Limiting für Production aktivieren
- [ ] Security Utils für Production aktivieren

**Aktueller Zustand:**
```typescript
// Redis für lokale Entwicklung deaktiviert
if (process.env.NODE_ENV === 'development') {
  return null
}

// Für lokale Entwicklung: immer erlauben
if (process.env.NODE_ENV === 'development') {
  return true
}
```

### 4. Content Security Policy (CSP)

**Dateien:**
- `next.config.js`
- `src/lib/csp-generator.ts`
- `src/lib/security-config.ts`

**Änderungen für Production:**
- [ ] CSP für Production aktivieren
- [ ] Unsafe-Eval und Unsafe-Inline entfernen
- [ ] Strikte CSP-Regeln implementieren

**Aktueller Zustand:**
```typescript
// CSP für lokale Entwicklung deaktiviert
if (process.env.NODE_ENV === 'development') {
  return ""
}
```

### 5. Environment Variables

**Datei:** `src/lib/env.ts`

**Änderungen für Production:**
- [ ] Strikte Validation für Production aktivieren
- [ ] Alle erforderlichen Environment Variables setzen
- [ ] Development-spezifische Fallbacks entfernen
- [ ] JWT_SECRET und NEXTAUTH_SECRET für Production konfigurieren
- [ ] ENCRYPTION_KEY für Production konfigurieren

**Aktueller Zustand:**
```typescript
// Development-Fallbacks für lokale Entwicklung
if (!parsed.success) {
  console.error('[ENV] Kritik environment değişkenleri eksik!')
  console.error('[ENV] Eksik değişkenler:', parsed.error.flatten().fieldErrors)
  
  // Für Development: Warnung aber kein Fehler
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ENV] Development-Modus: Verwende Standardwerte für fehlende Variablen')
  } else {
    throw new Error('Environment değişkenleri eksik veya geçersiz')
  }
} else {
  console.log('[ENV] Environment variables loaded successfully!')
}

// Development-Fallbacks für kritische Secrets
NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
NEXTAUTH_SECRET: z.string().min(32).default('your-secret-key-for-local-development-only-32-chars'),
DATABASE_URL: z.string().min(1).default('file:./dev.db'),
JWT_SECRET: z.string().min(32).default('your-jwt-secret-for-local-development-only-32-chars'),
ENCRYPTION_KEY: z.string().min(32).default('your-encryption-key-for-local-development-only-32-chars'),
```

### 6. Database Konfiguration

**Dateien:**
- `prisma/schema.prisma`
- `src/lib/prisma.ts`

**Änderungen für Production:**
- [ ] SQLite durch PostgreSQL/MySQL ersetzen
- [ ] Production Database URL konfigurieren
- [ ] Connection Pooling für Production optimieren

**Aktueller Zustand:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 7. Image Konfiguration

**Datei:** `next.config.js`

**Änderungen für Production:**
- [ ] `images.domains` durch `images.remotePatterns` ersetzen
- [ ] `dangerouslyAllowSVG` für Production deaktivieren
- [ ] Image Optimization für Production optimieren

**Aktueller Zustand:**
```javascript
images: {
  domains: ['localhost'], // Deprecated
  dangerouslyAllowSVG: true, // Nur für Development
}
```

### 8. Providers Konfiguration

**Datei:** `src/components/Providers.tsx`

**Änderungen für Production:**
- [ ] SessionProvider für Production aktivieren

**Aktueller Zustand:**
```typescript
// Für lokale Entwicklung: SessionProvider deaktivieren
if (process.env.NODE_ENV === 'development') {
  return <>{children}</>
}
```

## Environment Variables

### **Lokale Entwicklung (Fallback-Werte)**
```typescript
// Keine .env.local Datei erforderlich - Fallback-Werte werden verwendet
// Alle kritischen Environment Variables haben Development-Fallbacks in:
// - src/lib/env.ts
// - src/lib/auth.ts
```

### **Production Environment Variables**

**Erforderliche Environment Variables für Production:**

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT & Encryption
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-encryption-key"

# App URL
APP_URL="https://yourdomain.com"

# Redis
REDIS_URL="redis://host:port"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@yourdomain.com"

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"

# Stripe (optional)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Deployment Steps

1. **Environment Setup:**
   - [ ] Production Database erstellen (PostgreSQL/MySQL)
   - [ ] Redis Server einrichten
   - [ ] Domain und SSL konfigurieren

2. **Code Changes:**
   - [ ] Alle Development-spezifischen Änderungen rückgängig machen
   - [ ] Production Environment Variables setzen
   - [ ] Database Migration ausführen

3. **Testing:**
   - [ ] Alle Features in Production testen
   - [ ] Performance optimieren
   - [ ] Security audit durchführen

4. **Monitoring:**
   - [ ] Error tracking einrichten
   - [ ] Performance monitoring aktivieren
   - [ ] Logging konfigurieren

## Wichtige Hinweise

- **Niemals** Development-Konfigurationen in Production verwenden
- **Immer** Environment-spezifische Konfigurationen verwenden
- **Regelmäßig** Security Updates durchführen
- **Backup-Strategie** für Production Database implementieren
- **Monitoring** und **Alerting** einrichten
