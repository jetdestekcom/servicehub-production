import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(128, 'Şifre en fazla 128 karakter olabilir'),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Kullanım şartlarını kabul etmelisiniz'
  })
})

async function registerHandler(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[REGISTER] Request body:', JSON.stringify(body, null, 2))
    
    // Input validation
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('[REGISTER] Validation error:', validationResult.error.errors)
      return NextResponse.json({ 
        error: 'Geçersiz kayıt verisi', 
        details: validationResult.error.errors 
      }, { status: 400 })
    }

    const { name, email, password, role, phone } = validationResult.data

    // Basit email kontrolü
    const sanitizedEmail = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json({ error: 'Geçersiz email formatı' }, { status: 400 })
    }

    // Kullanıcı varlık kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 409 })
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(password, 12)

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: sanitizedEmail,
        password: hashedPassword,
        role,
        phone: phone ? phone.trim() : null,
        isActive: true,
        emailVerified: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log(`[REGISTER] Yeni kullanıcı kaydı: ${user.email} - ${user.role}`)

    return NextResponse.json({
      user,
      message: 'Kayıt başarılı. Email doğrulama gerekli.'
    }, { status: 201 })
  } catch (error) {
    console.error('[REGISTER] Error:', error)
    return NextResponse.json({ 
      error: 'Kayıt sırasında hata oluştu' 
    }, { status: 500 })
  }
}

export const POST = registerHandler