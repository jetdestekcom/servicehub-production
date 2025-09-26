import { PrismaClient } from '@prisma/client'

// Prisma Client konfigürasyonu - güvenli ve optimize
const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty'
}

// Global Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma Client oluştur
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaConfig)

// Development'ta global'e kaydet
if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma
}

// Prisma hata yakalayıcı (nur wenn $use verfügbar ist)
// prisma.$use(async (params, next) => {
//   try {
//     return await next(params)
//   } catch (error) {
//     // Database hatalarını işle
//     const appError = ErrorHandler.handleDatabaseError(error)
//     throw appError
//   }
// })

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('[DATABASE] Connection failed:', error)
    return false
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
    console.log('[DATABASE] Disconnected successfully')
  } catch (error) {
    console.error('[DATABASE] Disconnect error:', error)
  }
}

// Process exit handler
if (typeof process !== 'undefined') {
  process.on('beforeExit', disconnectDatabase)
  process.on('SIGINT', disconnectDatabase)
  process.on('SIGTERM', disconnectDatabase)
}

