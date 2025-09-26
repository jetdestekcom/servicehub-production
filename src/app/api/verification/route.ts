import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// POST - Verifizierungsantrag einreichen
const verificationRequestSchema = z.object({
  type: z.enum(['identity', 'business', 'professional', 'insurance', 'certification']),
  data: z.record(z.any())
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = verificationRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid verification request data', 
        details: validationResult.error.errors 
      }, { status: 400 })
    }

    const { type, data } = validationResult.data

    // Prüfen ob bereits ein Verifizierungsantrag für diesen Typ aussteht
    const existingVerification = await prisma.verificationRequest.findFirst({
      where: {
        userId: session.user.id,
        type,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    })

    if (existingVerification) {
      return NextResponse.json({ 
        error: `Verification request for ${type} already exists` 
      }, { status: 409 })
    }

    // Verifizierungsantrag erstellen
    const verificationRequest = await prisma.verificationRequest.create({
      data: {
        userId: session.user.id,
        type,
        data: JSON.stringify(data),
        status: 'PENDING'
      }
    })

    // Admin-Benachrichtigung erstellen
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'Neuer Verifizierungsantrag',
          message: `Benutzer ${session.user.name || session.user.email} hat einen ${type}-Verifizierungsantrag eingereicht.`,
          type: 'VERIFICATION_REQUEST'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully',
      verificationId: verificationRequest.id
    })

  } catch (error) {
    console.error('Verification request error:', error)
    return NextResponse.json({ 
      error: 'Failed to submit verification request' 
    }, { status: 500 })
  }
}

// GET - Verifizierungsstatus abrufen
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const whereClause: any = { userId: session.user.id }
    if (type) {
      whereClause.type = type
    }

    const verifications = await prisma.verificationRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(verifications)

  } catch (error) {
    console.error('Verification status fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch verification status' 
    }, { status: 500 })
  }
}