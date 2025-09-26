# JetDestek.com - Benötigte Umgebungsvariablen

Um JetDestek.com vollständig funktionsfähig zu machen, müssen Sie die folgenden Umgebungsvariablen in einer `.env.local` Datei im `servicehub` Verzeichnis konfigurieren:

## Kritische Umgebungsvariablen (Erforderlich)

### 1. NextAuth.js (Authentifizierung)
```env
# Generieren Sie einen sicheren Secret mit: openssl rand -base64 32
NEXTAUTH_SECRET=ihr-sicherer-nextauth-secret-key

# URL Ihrer Anwendung
NEXTAUTH_URL=http://localhost:3000
```

### 2. Datenbank
```env
# SQLite (aktuell konfiguriert - keine weiteren Variablen erforderlich)
# Für Produktion empfehlen wir PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/jetdestek?schema=public
```

### 3. Google OAuth (für Social Login)
```env
# Von Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=ihre-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ihr-google-client-secret
```

## Wichtige Funktionen (Für volle Funktionalität)

### 4. Stripe (Zahlungsverarbeitung)
```env
# Von Stripe Dashboard: https://dashboard.stripe.com/
STRIPE_SECRET_KEY=sk_test_ihr-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_ihr-stripe-webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_ihr-stripe-publishable-key
```

### 5. AWS S3 (Datei-Uploads)
```env
# Von AWS Console: https://console.aws.amazon.com/
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=ihr-aws-access-key-id
AWS_SECRET_ACCESS_KEY=ihr-aws-secret-access-key
AWS_S3_BUCKET_NAME=jetdestek-uploads
```

### 6. E-Mail-Versand (Optional aber empfohlen)
```env
# Beispiel mit SendGrid
SENDGRID_API_KEY=SG.ihr-sendgrid-api-key
EMAIL_FROM=noreply@jetdestek.com

# Oder mit SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ihr-email@gmail.com
SMTP_PASSWORD=ihr-app-password
```

### 7. SMS-Benachrichtigungen (Twilio)
```env
# Von Twilio Console: https://console.twilio.com/
TWILIO_ACCOUNT_SID=ihr-twilio-account-sid
TWILIO_AUTH_TOKEN=ihr-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 8. Google Maps API
```env
# Von Google Cloud Console: https://console.cloud.google.com/
GOOGLE_MAPS_API_KEY=ihr-google-maps-api-key
```

### 9. 2FA (Two-Factor Authentication)
```env
# Für 2FA-Funktionalität (automatisch generiert)
# Keine zusätzlichen Umgebungsvariablen erforderlich
```

## Optionale Umgebungsvariablen

### 7. Analytics & Monitoring
```env
# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry für Error Tracking
SENTRY_DSN=https://ihr-sentry-dsn@sentry.io/project-id
```

### 8. Externe APIs
```env
# Für Adressvalidierung
GOOGLE_MAPS_API_KEY=ihr-google-maps-api-key

# Für SMS-Benachrichtigungen
TWILIO_ACCOUNT_SID=ihr-twilio-account-sid
TWILIO_AUTH_TOKEN=ihr-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 9. App-Konfiguration
```env
# App-spezifische Einstellungen
APP_NAME=JetDestek
APP_URL=https://jetdestek.com
SUPPORT_EMAIL=destek@jetdestek.com

# Feature Flags
ENABLE_CHAT=true
ENABLE_NOTIFICATIONS=true
ENABLE_ANALYTICS=true
```

## Beispiel `.env.local` Datei

```env
# Erstellen Sie eine .env.local Datei im servicehub Verzeichnis mit folgendem Inhalt:

# Kritisch - Minimum für lokale Entwicklung
NEXTAUTH_SECRET=IhrSuperGeheimesNextAuthSecret123!
NEXTAUTH_URL=http://localhost:3000

# Für Google Login (optional für lokale Tests)
GOOGLE_CLIENT_ID=dummy-client-id
GOOGLE_CLIENT_SECRET=dummy-client-secret

# Für Zahlungen (optional für lokale Tests)
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
STRIPE_PUBLISHABLE_KEY=pk_test_dummy

# Für Datei-Uploads (optional für lokale Tests)
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=dummy-key-id
AWS_SECRET_ACCESS_KEY=dummy-secret-key
AWS_S3_BUCKET_NAME=dummy-bucket
```

## Wichtige Hinweise

1. **Sicherheit**: Teilen Sie niemals Ihre echten API-Schlüssel oder Secrets. Die `.env.local` Datei sollte NIEMALS in Git committed werden.

2. **Entwicklung vs. Produktion**: Für die lokale Entwicklung können Sie Dummy-Werte verwenden. Für die Produktion benötigen Sie echte API-Schlüssel.

3. **Dienste aktivieren**:
   - **Google OAuth**: Erstellen Sie ein Projekt in der Google Cloud Console
   - **Stripe**: Registrieren Sie sich bei Stripe und nutzen Sie Test-Keys für Entwicklung
   - **AWS S3**: Erstellen Sie ein AWS-Konto und konfigurieren Sie einen S3-Bucket
   - **E-Mail**: Wählen Sie einen E-Mail-Dienst (SendGrid, AWS SES, etc.)

4. **Umgebungsvariablen validieren**: Das System prüft beim Start, ob kritische Variablen gesetzt sind, und zeigt hilfreiche Fehlermeldungen.

5. **Graceful Degradation**: Fehlende optionale Variablen deaktivieren nur die entsprechenden Features, die App läuft weiter.

## Nächste Schritte

1. Erstellen Sie eine `.env.local` Datei im `servicehub` Verzeichnis
2. Kopieren Sie die Beispielkonfiguration und passen Sie sie an
3. Registrieren Sie sich bei den benötigten Diensten
4. Ersetzen Sie die Dummy-Werte durch echte API-Schlüssel
5. Starten Sie die Anwendung mit `npm run dev`

Bei Fragen oder Problemen konsultieren Sie die Dokumentation der jeweiligen Dienste oder kontaktieren Sie den Support.
