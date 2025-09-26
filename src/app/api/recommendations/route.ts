import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'jetdestek-jwt-secret-key-2024-development-only-32-chars-minimum'

// JWT token'dan user ID'yi çıkar
function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId || null
  } catch (error) {
    return null
  }
}

// GET - AI-basierte Service-Empfehlungen
export async function GET(request: NextRequest) {
  try {
    // Basit cookie tabanlı session kontrolü
    const sessionToken = request.cookies.get('auth_token')
    
    // Für nicht-angemeldete Benutzer allgemeine Empfehlungen zeigen
    if (!sessionToken) {
      return getGeneralRecommendations(request)
    }

    const userId = getUserIdFromToken(sessionToken.value)
    if (!userId) {
      return getGeneralRecommendations(request)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    // Benutzer-Präferenzen basierend auf bisherigen Bookings analysieren
    const userBookings = await prisma.booking.findMany({
      where: {
        customerId: userId,
        status: 'COMPLETED'
      },
      include: {
        service: {
          select: {
            category: true,
            price: true,
            rating: true
          }
        }
      },
      take: 20
    })

    // Beliebte Kategorien des Benutzers ermitteln
    const categoryPreferences = userBookings.reduce((acc, booking) => {
      const category = booking.service.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Durchschnittspreis des Benutzers
    const avgPrice = userBookings.length > 0 
      ? userBookings.reduce((sum, booking) => sum + booking.service.price, 0) / userBookings.length
      : 0

    // Empfehlungen basierend auf Präferenzen generieren
    const whereClause: any = {
      isActive: true
    }

    // Kategorie-Filter
    if (category) {
      whereClause.category = category
    } else if (Object.keys(categoryPreferences).length > 0) {
      // Beliebte Kategorien des Benutzers
      const topCategories = Object.entries(categoryPreferences)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat)
      whereClause.category = { in: topCategories }
    }

    // Standort-Filter
    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' }
    }

    // Services abrufen
    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
            isVerified: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit * 2 // Mehr abrufen für bessere Auswahl
    })

    // AI-basierte Scoring und Empfehlungen
    const recommendations = services.map(service => {
      let confidence = 50 // Basis-Konfidenz

      // Kategorie-Match Bonus
      if (categoryPreferences[service.category]) {
        confidence += 20
      }

      // Rating-Bonus
      if (service.rating >= 4.5) {
        confidence += 15
      } else if (service.rating >= 4.0) {
        confidence += 10
      }

      // Preis-Match Bonus
      if (avgPrice > 0) {
        const priceDiff = Math.abs(service.price - avgPrice) / avgPrice
        if (priceDiff <= 0.2) { // Innerhalb 20% des Durchschnittspreises
          confidence += 10
        }
      }

      // Review-Count Bonus
      if (service.reviewCount >= 10) {
        confidence += 10
      }

      // Premium/Verified Bonus
      if (service.isPremium) confidence += 5
      if (service.isVerified) confidence += 5
      if (service.provider.isVerified) confidence += 5

      // Zufälliger Faktor für Vielfalt
      confidence += Math.random() * 10

      // Konfidenz auf 0-100 begrenzen
      confidence = Math.min(100, Math.max(0, confidence))

      return {
        id: service.id,
        title: service.title,
        provider: service.provider.name,
        category: service.category,
        price: service.price,
        rating: service.rating,
        reviewCount: service.reviewCount,
        image: service.images ? JSON.parse(service.images)[0] : null,
        confidence: Math.round(confidence),
        distance: Math.random() * 10, // Mock distance
        isLiked: false,
        views: Math.floor(Math.random() * 1000),
        reason: getRecommendationReason(service, categoryPreferences, avgPrice)
      }
    })

    // Nach Konfidenz sortieren und limitieren
    const sortedRecommendations = recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)

    return NextResponse.json(sortedRecommendations)

  } catch (error) {
    console.error('Recommendations fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch recommendations' 
    }, { status: 500 })
  }
}

// Hilfsfunktion für Empfehlungsgrund
function getRecommendationReason(service: any, categoryPreferences: Record<string, number>, avgPrice: number): string {
  const reasons = []

  if (categoryPreferences[service.category]) {
    reasons.push('Basierend auf Ihren bisherigen Buchungen')
  }

  if (service.rating >= 4.5) {
    reasons.push('Hoch bewertet')
  }

  if (service.reviewCount >= 10) {
    reasons.push('Viele Bewertungen')
  }

  if (service.isPremium) {
    reasons.push('Premium Service')
  }

  if (service.isVerified) {
    reasons.push('Verifiziert')
  }

  if (avgPrice > 0 && Math.abs(service.price - avgPrice) / avgPrice <= 0.2) {
    reasons.push('Passend zu Ihrem Budget')
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Empfohlen für Sie'
}

// Allgemeine Empfehlungen für nicht-angemeldete Benutzer
async function getGeneralRecommendations(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    // Beliebte Services abrufen
    const whereClause: any = {
      isActive: true
    }

    if (category) {
      whereClause.category = category
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' }
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewCount: true,
            isVerified: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit * 2
    })

    // AI-basierte Scoring
    const recommendations = services.map(service => {
      let confidence = 50 // Basis-Konfidenz

      // Rating-Bonus
      if (service.rating >= 4.5) {
        confidence += 20
      } else if (service.rating >= 4.0) {
        confidence += 15
      }

      // Review-Count Bonus
      if (service.reviewCount >= 10) {
        confidence += 15
      }

      // Premium/Verified Bonus
      if (service.isPremium) confidence += 10
      if (service.isVerified) confidence += 10
      if (service.provider.isVerified) confidence += 10

      // Zufälliger Faktor für Vielfalt
      confidence += Math.random() * 10

      // Konfidenz auf 0-100 begrenzen
      confidence = Math.min(100, Math.max(0, confidence))

      return {
        id: service.id,
        title: service.title,
        provider: service.provider.name,
        category: service.category,
        price: service.price,
        rating: service.rating,
        reviewCount: service.reviewCount,
        image: service.images ? JSON.parse(service.images)[0] : null,
        confidence: Math.round(confidence),
        distance: Math.random() * 10,
        isLiked: false,
        views: Math.floor(Math.random() * 1000),
        reason: getGeneralRecommendationReason(service)
      }
    })

    // Nach Konfidenz sortieren und limitieren
    const sortedRecommendations = recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)

    return NextResponse.json(sortedRecommendations)

  } catch (error) {
    console.error('General recommendations error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch recommendations' 
    }, { status: 500 })
  }
}

function getGeneralRecommendationReason(service: any): string {
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

  return reasons.join(', ') || 'Popüler hizmet'
}