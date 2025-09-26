import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Abonelik hizmetleri - UrbanCompany özellikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const frequency = searchParams.get('frequency')
    const providerId = searchParams.get('providerId')

    const where: any = { isActive: true }
    
    if (category) where.category = category
    if (frequency) where.frequency = frequency
    if (providerId) where.providerId = providerId

    const subscriptions = await prisma.subscriptionService.findMany({
      where,
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
      orderBy: { price: 'asc' }
    })

    return NextResponse.json({ success: true, data: subscriptions })
  } catch (error) {
    console.error('Abonelik hizmetleri hatası:', error)
    return NextResponse.json({ error: 'Abonelik hizmetleri yüklenemedi' }, { status: 500 })
  }
}

// Yeni abonelik hizmeti oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      frequency,
      features
    } = await request.json()

    const subscription = await prisma.subscriptionService.create({
      data: {
        name,
        description,
        category,
        price,
        duration,
        frequency,
        features: features ? JSON.stringify(features) : null,
        providerId: 'demo-provider-id' // Gerçek uygulamada session'dan alınacak
      }
    })

    return NextResponse.json({ success: true, data: subscription })
  } catch (error) {
    console.error('Abonelik hizmeti oluşturma hatası:', error)
    return NextResponse.json({ error: 'Abonelik hizmeti oluşturulamadı' }, { status: 500 })
  }
}

