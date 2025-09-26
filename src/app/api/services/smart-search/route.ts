import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Akıllı arama - AI destekli öneriler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const location = searchParams.get('location') || ''
    const budget = searchParams.get('budget') ? Number(searchParams.get('budget')) : undefined
    const urgency = searchParams.get('urgency') || 'normal'
    const category = searchParams.get('category') || ''
    const features = searchParams.get('features') ? searchParams.get('features')!.split(',') : []
    const preferences = {}

    // Temel arama kriterleri
    const where: any = {
      isActive: true
      // isVerified: true - Entfernt für lokale Entwicklung
    }

    // Metin araması
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Kategori filtresi
    if (category) {
      where.category = category
    }

    // Bütçe filtresi
    if (budget) {
      where.price = {
        lte: budget
      }
    }

    // Aciliyet filtresi
    if (urgency === 'urgent') {
      where.isUrgent = true
    }

    // Özellik filtresi
    if (features.length > 0) {
      where.AND = features.map((feature: string) => ({
        OR: [
          { tags: { contains: feature, mode: 'insensitive' } }
        ]
      }))
    }

    // Konum filtresi (basit mesafe hesaplama)
    if (location) {
      // Burada gerçek konum hesaplama yapılabilir
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Hizmetleri getir
    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
            isVerified: true,
            responseTime: true,
            completionRate: true
          }
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: [
        { isPremium: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    // AI destekli skorlama (basit algoritma)
    const scoredServices = services.map(service => {
      let score = 50 // Basis-Score

      // Temel skorlar
      score += service.rating * 20 // 0-100 puan
      score += Math.min(service.reviewCount * 2, 50) // Maksimum 50 puan
      score += service.isVerified ? 10 : 0
      score += service.isPremium ? 15 : 0
      score += service.completionRate ? service.completionRate * 10 : 0

      // Yanıt süresi bonusu
      if (service.provider.responseTime && service.provider.responseTime < 60) {
        score += 10
      }

      // Aciliyet bonusu
      if (urgency === 'urgent' && service.isUrgent) {
        score += 20
      }

      return {
        ...service,
        aiScore: Math.min(score, 100)
      }
    })

    // Skora göre sırala
    scoredServices.sort((a, b) => b.aiScore - a.aiScore)

    // Öneriler oluştur
    const recommendations = scoredServices.slice(0, 10).map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      rating: service.rating,
      reviewCount: service.reviewCount,
      location: service.location,
      duration: service.duration,
      isVerified: service.isVerified,
      isPremium: service.isPremium,
      isUrgent: service.isUrgent,
      isPackage: service.isPackage,
      warranty: service.warranty,
      insurance: service.insurance,
      responseTime: service.provider.responseTime,
      completionRate: service.provider.completionRate,
      images: service.images,
      provider: service.provider,
      aiScore: service.aiScore,
      reason: getRecommendationReason(service, preferences)
    }))

    return NextResponse.json({
      success: true,
      data: {
        services: recommendations,
        total: services.length,
        searchCriteria: {
          query,
          location,
          budget,
          urgency,
          category,
          features
        }
      }
    })
  } catch (error) {
    console.error('Akıllı arama hatası:', error)
    return NextResponse.json({ error: 'Arama yapılamadı' }, { status: 500 })
  }
}

function getRecommendationReason(service: any, preferences: any): string {
  const reasons = []

  if (service.rating >= 4.5) {
    reasons.push('Yüksek puanlı')
  }

  if (service.reviewCount >= 50) {
    reasons.push('Çok değerlendirilmiş')
  }

  if (service.isVerified) {
    reasons.push('Doğrulanmış')
  }

  if (service.isPremium) {
    reasons.push('Premium hizmet')
  }

  if (service.isUrgent) {
    reasons.push('Acil hizmet')
  }

  if (service.completionRate && service.completionRate >= 95) {
    reasons.push('Yüksek tamamlanma oranı')
  }

  if (service.provider.responseTime && service.provider.responseTime < 30) {
    reasons.push('Hızlı yanıt')
  }

  return reasons.join(', ') || 'Kaliteli hizmet'
}

