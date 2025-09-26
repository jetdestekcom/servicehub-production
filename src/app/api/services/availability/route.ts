import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Müsaitlik durumu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!serviceId) {
      return NextResponse.json({ error: 'Hizmet ID gerekli' }, { status: 400 })
    }

    const availability = await prisma.serviceAvailability.findMany({
      where: {
        serviceId,
        isAvailable: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json({ success: true, data: availability })
  } catch (error) {
    console.error('Müsaitlik durumu hatası:', error)
    return NextResponse.json({ error: 'Müsaitlik durumu yüklenemedi' }, { status: 500 })
  }
}

// Müsaitlik durumu güncelle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const { serviceId, availability } = await request.json()

    // Hizmet sahibi kontrolü
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        providerId: session.user.id
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Hizmet bulunamadı veya yetkiniz yok' }, { status: 404 })
    }

    // Mevcut müsaitlik durumlarını sil
    await prisma.serviceAvailability.deleteMany({
      where: { serviceId }
    })

    // Yeni müsaitlik durumlarını ekle
    const availabilityRecords = availability.map((avail: any) => ({
      serviceId,
      dayOfWeek: avail.dayOfWeek,
      startTime: avail.startTime,
      endTime: avail.endTime,
      isAvailable: avail.isAvailable
    }))

    await prisma.serviceAvailability.createMany({
      data: availabilityRecords
    })

    return NextResponse.json({ success: true, message: 'Müsaitlik durumu güncellendi' })
  } catch (error) {
    console.error('Müsaitlik durumu güncelleme hatası:', error)
    return NextResponse.json({ error: 'Müsaitlik durumu güncellenemedi' }, { status: 500 })
  }
}

