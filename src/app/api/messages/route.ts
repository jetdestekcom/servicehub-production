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

export async function POST(request: NextRequest) {
  try {
    // JWT token kontrolü
    const sessionToken = request.cookies.get('auth_token')
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(sessionToken.value)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, content, type = 'text' } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content: content.trim(),
        type: type as 'text' | 'image' | 'file',
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


