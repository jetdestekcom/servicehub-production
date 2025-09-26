import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Proje portföyü - Porch, HomeAdvisor özellikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const category = searchParams.get('category')
    const isPublic = searchParams.get('isPublic') === 'true'

    const portfolios = await prisma.projectPortfolio.findMany({
      where: {
        ...(providerId && { providerId }),
        ...(category && { category }),
        ...(isPublic !== null && { isPublic })
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

    return NextResponse.json({ success: true, data: portfolios })
  } catch (error) {
    console.error('Proje portföyü hatası:', error)
    return NextResponse.json({ error: 'Proje portföyü yüklenemedi' }, { status: 500 })
  }
}

// Yeni proje portföyü oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      images,
      category,
      budget,
      duration,
      status = 'COMPLETED',
      isPublic = true
    } = await request.json()

    const portfolio = await prisma.projectPortfolio.create({
      data: {
        title,
        description,
        images: images ? images.join(',') : null,
        category,
        budget,
        duration,
        status,
        isPublic,
        providerId: 'demo-provider-id' // Gerçek uygulamada session'dan alınacak
      }
    })

    return NextResponse.json({ success: true, data: portfolio })
  } catch (error) {
    console.error('Proje portföyü oluşturma hatası:', error)
    return NextResponse.json({ error: 'Proje portföyü oluşturulamadı' }, { status: 500 })
  }
}

