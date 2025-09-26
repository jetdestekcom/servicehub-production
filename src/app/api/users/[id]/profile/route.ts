import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Kullanıcı profilini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        phone: true,
        role: true,
        isVerified: true,
        verifiedAt: true,
        rating: true,
        responseTime: true,
        completionRate: true,
        joinDate: true,
        lastActive: true,
        socialLinks: true,
        languages: true,
        skills: true,
        experience: true,
        education: true,
        certifications: true,
        portfolio: true,
        availability: true,
        workingHours: true,
        serviceRadius: true,
        _count: {
          select: {
            services: true,
            bookings: true,
            reviews: true,
            sentMessages: true,
            receivedMessages: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Hizmetleri getir
    const services = await prisma.service.findMany({
      where: { 
        providerId: id,
        isActive: true,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        rating: true,
        image: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    })

    // Yorumları getir
    const reviews = await prisma.review.findMany({
      where: { 
        service: { providerId: id }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        service: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // İstatistikler
    const stats = {
      totalServices: user._count.services,
      totalBookings: user._count.bookings,
      totalReviews: user._count.reviews,
      averageRating: user.rating,
      responseTime: user.responseTime,
      completionRate: user.completionRate
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        stats
      },
      services,
      reviews
    })

  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Kullanıcı profilini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (session.user.id !== id && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      bio,
      location,
      phone,
      socialLinks,
      languages,
      skills,
      experience,
      education,
      certifications,
      portfolio,
      availability,
      workingHours,
      serviceRadius
    } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        bio,
        location,
        phone,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        languages: languages ? JSON.stringify(languages) : null,
        skills: skills ? JSON.stringify(skills) : null,
        experience: experience ? JSON.stringify(experience) : null,
        education: education ? JSON.stringify(education) : null,
        certifications: certifications ? JSON.stringify(certifications) : null,
        portfolio: portfolio ? JSON.stringify(portfolio) : null,
        availability: availability ? JSON.stringify(availability) : null,
        workingHours: workingHours ? JSON.stringify(workingHours) : null,
        serviceRadius
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        phone: true,
        socialLinks: true,
        languages: true,
        skills: true,
        experience: true,
        education: true,
        certifications: true,
        portfolio: true,
        availability: true,
        workingHours: true,
        serviceRadius: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('User profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

