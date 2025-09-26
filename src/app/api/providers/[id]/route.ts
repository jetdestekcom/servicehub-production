import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { APISecurityMiddleware } from '@/lib/api-middleware'

export async function GET(request: NextRequest, context: any) {
  return APISecurityMiddleware.wrap({
    requireAuth: false, // Provider details should be public
    handler: async (req: NextRequest, ctx: any) => {
    try {
      const { id } = await context.params

      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Provider ID gerekli'
        }, { status: 400 })
      }

      // Provider'ı getir
      const provider = await prisma.user.findUnique({
        where: {
          id: id,
          role: 'PROVIDER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          rating: true,
          reviewCount: true,
          isVerified: true,
          responseTime: true,
          completionRate: true,
          services: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              price: true,
              rating: true,
              reviewCount: true,
              location: true,
              images: true,
              duration: true,
              isVerified: true,
              createdAt: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  rating: true
                }
              }
            },
            where: {
              isActive: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      if (!provider) {
        return NextResponse.json({
          success: false,
          error: 'Provider bulunamadı'
        }, { status: 404 })
      }

      // Provider bilgilerini dönüştür
      const transformedProvider = {
        ...provider,
        services: provider.services.map(service => ({
          ...service,
          images: service.images ? (typeof service.images === 'string' ? service.images : service.images.join(',')) : '',
          provider: {
            ...service.provider,
            rating: service.provider.rating || 0
          }
        }))
      }

      return NextResponse.json({
        success: true,
        data: {
          provider: transformedProvider
        }
      })

    } catch (error) {
      console.error('Provider detay hatası:', error)
      return NextResponse.json({
        success: false,
        error: 'Sunucu hatası'
      }, { status: 500 })
    }
    }
  })(request, context)
}
