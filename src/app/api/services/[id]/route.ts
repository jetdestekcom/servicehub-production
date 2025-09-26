import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { APISecurityMiddleware } from '@/lib/api-middleware'
import { z } from 'zod'

// GET - Get single service
async function getService(request: NextRequest, context: any) {
  const { id } = await context.params

  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = service.reviews.length > 0 
      ? service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.reviews.length 
      : 0

    const formattedService = {
      ...service,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: service.reviews.length,
      images: service.images ? JSON.parse(service.images) : [],
      tags: service.tags ? JSON.parse(service.tags) : []
    }

    return NextResponse.json({
      success: true,
      data: {
        service: formattedService
      }
    })

  } catch (error) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Hizmet alınamadı' },
      { status: 500 }
    )
  }
}

// PUT - Update service
const updateServiceSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  category: z.string().min(1).max(100).optional(),
  price: z.number().min(0).max(1000000).optional(),
  location: z.string().max(500).optional(),
  images: z.string().optional(),
  tags: z.string().optional(),
  isActive: z.boolean().optional()
})

async function updateService(request: NextRequest, context: any) {
  const { id } = await context.params
  const userId = context.user.id

  try {
    const body = await request.json()
    const validationResult = updateServiceSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    // Check if service exists and belongs to user
    const existingService = await prisma.service.findUnique({
      where: { id },
      select: { providerId: true }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    if (existingService.providerId !== userId) {
      return NextResponse.json(
        { error: 'Bu hizmeti düzenleme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Update service
    const updatedService = await prisma.service.update({
      where: { id },
      data: validationResult.data,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      service: updatedService,
      message: 'Hizmet başarıyla güncellendi'
    })

  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: 'Hizmet güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
async function deleteService(request: NextRequest, context: any) {
  const { id } = await context.params
  const userId = context.user.id

  try {
    // Check if service exists and belongs to user
    const existingService = await prisma.service.findUnique({
      where: { id },
      select: { providerId: true }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    if (existingService.providerId !== userId) {
      return NextResponse.json(
        { error: 'Bu hizmeti silme yetkiniz yok' },
        { status: 403 }
      )
    }

    // Delete service (cascade will handle related records)
    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Hizmet başarıyla silindi'
    })

  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Hizmet silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: any) {
  return APISecurityMiddleware.wrap({
    requireAuth: false,
    handler: getService
  })(request, context)
}

export async function PUT(request: NextRequest, context: any) {
  return APISecurityMiddleware.wrap({
    requireAuth: true,
    handler: updateService
  })(request, context)
}

export async function DELETE(request: NextRequest, context: any) {
  return APISecurityMiddleware.wrap({
    requireAuth: true,
    handler: deleteService
  })(request, context)
}