import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue,
      pendingApprovals,
      activeUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED' }
      }),
      prisma.service.count({
        where: { isVerified: false }
      }),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])

    const stats = {
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingApprovals,
      activeUsers
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


