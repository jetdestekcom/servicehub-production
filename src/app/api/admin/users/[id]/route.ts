import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { action } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admin from modifying other admins
    if (user.role === 'ADMIN' && user.id !== session.user.id) {
      return NextResponse.json({ error: 'Cannot modify other admins' }, { status: 403 })
    }

    let updatedUser

    switch (action) {
      case 'verify':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { isVerified: true }
        })
        break

      case 'unverify':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { isVerified: false }
        })
        break

      case 'delete':
        // Soft delete by deactivating the user
        updatedUser = await prisma.user.update({
          where: { id },
          data: { 
            isVerified: false,
            // Add a deleted flag if you have one in your schema
            // deletedAt: new Date()
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
