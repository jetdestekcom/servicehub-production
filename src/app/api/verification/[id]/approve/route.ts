import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Admin: Doğrulama onaylama
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { notes } = await request.json()

    // Doğrulama kaydını bul
    const verification = await prisma.verification.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 })
    }

    // Doğrulama durumunu güncelle
    const updatedVerification = await prisma.verification.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes
      }
    })

    // Kullanıcının doğrulama durumunu güncelle
    await prisma.user.update({
      where: { id: verification.userId },
      data: {
        isVerified: true,
        verifiedAt: new Date()
      }
    })

    // Bildirim oluştur
    await prisma.notification.create({
      data: {
        userId: verification.userId,
        type: 'VERIFICATION',
        title: 'Kimlik Doğrulama Onaylandı',
        content: 'Kimlik doğrulama işleminiz başarıyla onaylandı.',
        data: JSON.stringify({ verificationId: id })
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Verification approved successfully' 
    })

  } catch (error) {
    console.error('Verification approval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

