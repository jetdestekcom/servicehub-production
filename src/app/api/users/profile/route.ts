import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            rating: true,
            reviewCount: true
          }
        },
        bookings: {
          select: {
            id: true,
            service: {
              select: {
                title: true
              }
            },
            status: true,
            startDate: true,
            totalAmount: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Transform the data for the frontend
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
      isVerified: user.isVerified,
      rating: user.rating,
      reviewCount: user.reviewCount,
      createdAt: user.createdAt.toISOString(),
      location: user.location,
      bio: user.bio,
      services: user.services.map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        rating: service.rating,
        reviewCount: service.reviewCount
      })),
      bookings: user.bookings.map(booking => ({
        id: booking.id,
        serviceTitle: booking.service.title,
        status: booking.status,
        scheduledDate: booking.startDate.toISOString(),
        totalAmount: booking.totalAmount
      }))
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const bio = formData.get('bio') as string

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        updatedAt: new Date()
      },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            rating: true,
            reviewCount: true
          }
        },
        bookings: {
          select: {
            id: true,
            service: {
              select: {
                title: true
              }
            },
            status: true,
            startDate: true,
            totalAmount: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    // Transform the data for the frontend
    const profile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      rating: updatedUser.rating,
      reviewCount: updatedUser.reviewCount,
      createdAt: updatedUser.createdAt.toISOString(),
      location: updatedUser.location,
      bio: updatedUser.bio,
      services: updatedUser.services.map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        rating: service.rating,
        reviewCount: service.reviewCount
      })),
      bookings: updatedUser.bookings.map(booking => ({
        id: booking.id,
        serviceTitle: booking.service.title,
        status: booking.status,
        scheduledDate: booking.startDate.toISOString(),
        totalAmount: booking.totalAmount
      }))
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


