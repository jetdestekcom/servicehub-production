import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'jetdestek-jwt-secret-key-2024-development-only-32-chars-minimum'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 })
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 })
    }

    // Development modunda demo123 şifresini kabul et
    let isValidPassword = false
    if (process.env.NODE_ENV === 'development' && password === 'demo123') {
      isValidPassword = true
    } else if (user.password) {
      isValidPassword = await bcrypt.compare(password, user.password)
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Geçersiz email veya şifre' }, { status: 401 })
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Response oluştur
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Cookie'ye token'ı kaydet
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 gün
    })

    return response

  } catch (error) {
    console.error('[LOGIN] Error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
