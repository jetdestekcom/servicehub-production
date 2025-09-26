import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceId, rating, comment } = await request.json()

    if (!serviceId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: true
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Check if user has a completed booking for this service
    const completedBooking = await prisma.booking.findFirst({
      where: {
        serviceId,
        customerId: session.user.id,
        status: 'COMPLETED'
      }
    })

    if (!completedBooking) {
      return NextResponse.json({ 
        error: 'You can only review services you have completed' 
      }, { status: 403 })
    }

    // Check if user already reviewed this service
    const existingReview = await prisma.review.findFirst({
      where: {
        serviceId,
        customerId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json({ 
        error: 'You have already reviewed this service' 
      }, { status: 409 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        serviceId,
        customerId: session.user.id,
        rating,
        comment: comment.trim(),
        bookingId: completedBooking.id
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Update service rating and review count
    const allReviews = await prisma.review.findMany({
      where: { serviceId },
      select: { rating: true }
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.service.update({
      where: { id: serviceId },
      data: {
        rating: averageRating,
        reviewCount: allReviews.length
      }
    })

    // Update provider rating and review count
    const providerServices = await prisma.service.findMany({
      where: { providerId: service.providerId },
      select: { id: true }
    })

    const serviceIds = providerServices.map(s => s.id)
    const providerReviews = await prisma.review.findMany({
      where: { 
        serviceId: { in: serviceIds }
      },
      select: { rating: true }
    })

    const providerAverageRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length

    await prisma.user.update({
      where: { id: service.providerId },
      data: {
        rating: providerAverageRating,
        reviewCount: providerReviews.length
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { serviceId },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({
        where: { serviceId }
      })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
