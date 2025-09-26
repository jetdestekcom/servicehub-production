import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Favori hizmetler
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const favorites = await prisma.serviceFavorite.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
                reviewCount: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: favorites })
  } catch (error) {
    console.error('Favori listesi hatası:', error)
    return NextResponse.json({ error: 'Favoriler yüklenemedi' }, { status: 500 })
  }
}

// Favoriye ekle/çıkar
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const { serviceId, action } = await request.json()

    if (action === 'add') {
      // Favoriye ekle
      const favorite = await prisma.serviceFavorite.upsert({
        where: {
          userId_serviceId: {
            userId: session.user.id,
            serviceId
          }
        },
        update: {},
        create: {
          userId: session.user.id,
          serviceId
        }
      })

      return NextResponse.json({ success: true, data: favorite, message: 'Favorilere eklendi' })
    } else if (action === 'remove') {
      // Favoriden çıkar
      await prisma.serviceFavorite.deleteMany({
        where: {
          userId: session.user.id,
          serviceId
        }
      })

      return NextResponse.json({ success: true, message: 'Favorilerden çıkarıldı' })
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 })
  } catch (error) {
    console.error('Favori işlemi hatası:', error)
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 })
  }
}

