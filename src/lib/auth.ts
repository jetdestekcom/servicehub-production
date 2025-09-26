import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google' // Deaktiviert für lokale Entwicklung
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Adapter für lokale Entwicklung deaktiviert
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'jetdestek-super-secret-key-2024-development-only-32-chars-minimum',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // Google Provider temporär deaktiviert für lokale Entwicklung
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('[AUTH] User not found:', credentials.email)
            return null
          }

          // Für lokale Entwicklung: Passwort-Check vereinfachen
          if (process.env.NODE_ENV === 'development') {
            // Einfacher Passwort-Check für Demo-User
            if (credentials.password === 'demo123') {
              console.log('[AUTH] Development login successful:', user.email)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
              }
            }
          }

          // Normale Passwort-Validierung für Production
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password || ''
          )

          if (!isPasswordValid) {
            console.log('[AUTH] Invalid password for:', user.email)
            return null
          }

          console.log('[AUTH] Login successful:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('[AUTH] Login error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-for-local-development-only-32-chars',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  // Für lokale Entwicklung: Debug-Modus aktivieren
  debug: process.env.NODE_ENV === 'development',
}

