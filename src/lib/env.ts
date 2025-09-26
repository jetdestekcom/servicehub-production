import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // NextAuth - ZORUNLU
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(32).default('your-secret-key-for-local-development-only-32-chars'),
  
  // Database - ZORUNLU
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  
  // Google OAuth - OPSIYONEL
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Stripe - OPSIYONEL
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // AWS S3 - OPSIYONEL
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Email - OPSIYONEL
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // SMS - OPSIYONEL
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  // Maps - OPSIYONEL
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  // App URL - ZORUNLU
  APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Security - ZORUNLU
  JWT_SECRET: z.string().min(32).default('your-jwt-secret-for-local-development-only-32-chars'),
  ENCRYPTION_KEY: z.string().min(32).default('your-encryption-key-for-local-development-only-32-chars'),
  
  // Redis - OPSIYONEL
  REDIS_URL: z.string().optional(),
  
  // Monitoring - OPSIYONEL
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
})

const parsed = EnvSchema.safeParse(process.env)

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

export const env = {
  // Sadece güvenli değişkenleri export et
  ...((parsed.success ? parsed.data : {}) as z.infer<typeof EnvSchema>),
  
  // Özellik durumları
  features: {
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
    s3Configured: Boolean(
      process.env.AWS_ACCESS_KEY_ID && 
      process.env.AWS_SECRET_ACCESS_KEY && 
      process.env.AWS_REGION && 
      process.env.AWS_S3_BUCKET
    ),
    emailConfigured: Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_PORT && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS
    ),
    smsConfigured: Boolean(
      process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_PHONE_NUMBER
    ),
    mapsConfigured: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    googleOAuthConfigured: Boolean(
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET
    ),
    redisConfigured: Boolean(process.env.REDIS_URL),
    monitoringConfigured: Boolean(process.env.SENTRY_DSN)
  },
  
  // Güvenlik kontrolleri
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test'
}


