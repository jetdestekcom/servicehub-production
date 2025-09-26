import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Paket listesi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    const packages = await prisma.servicePackage.findMany({
      where: {
        isActive: true,
        ...(serviceId && { serviceId })
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            provider: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: packages })
  } catch (error) {
    console.error('Paket listesi hatası:', error)
    return NextResponse.json({ error: 'Paketler yüklenemedi' }, { status: 500 })
  }
}

// Yeni paket oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const {
      serviceId,
      name,
      description,
      price,
      duration,
      items
    } = await request.json()

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

    const servicePackage = await prisma.servicePackage.create({
      data: {
        serviceId,
        name,
        description,
        price,
        duration,
        items: items ? JSON.stringify(items) : null
      }
    })

    return NextResponse.json({ success: true, data: servicePackage })
  } catch (error) {
    console.error('Paket oluşturma hatası:', error)
    return NextResponse.json({ error: 'Paket oluşturulamadı' }, { status: 500 })
  }
}

