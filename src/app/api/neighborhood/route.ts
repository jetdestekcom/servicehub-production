import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mahalle hizmetleri - Nextdoor, Neighborly özellikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const category = searchParams.get('category')
    const radius = parseInt(searchParams.get('radius') || '10')

    const services = await prisma.neighborhoodService.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(location && { 
          location: { 
            contains: location, 
            mode: 'insensitive' 
          } 
        })
      },
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
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Mahalle hizmetleri hatası:', error)
    return NextResponse.json({ error: 'Mahalle hizmetleri yüklenemedi' }, { status: 500 })
  }
}

// Yeni mahalle hizmeti oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      category,
      location,
      radius
    } = await request.json()

    const service = await prisma.neighborhoodService.create({
      data: {
        name,
        description,
        category,
        location,
        radius: radius || 10,
        providerId: 'demo-provider-id' // Gerçek uygulamada session'dan alınacak
      }
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Mahalle hizmeti oluşturma hatası:', error)
    return NextResponse.json({ error: 'Mahalle hizmeti oluşturulamadı' }, { status: 500 })
  }
}

