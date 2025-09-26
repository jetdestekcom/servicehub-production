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

// GET - Nachrichten für spezifische Konversation abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
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

    const { conversationId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Nachrichten für Konversation abrufen
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: conversationId
          },
          {
            senderId: conversationId,
            receiverId: userId
          }
        ]
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
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    })

    // Nachrichten als gelesen markieren
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: conversationId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json(messages)

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch messages' 
    }, { status: 500 })
  }
}