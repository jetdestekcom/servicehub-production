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

export async function GET(request: NextRequest) {
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

    // Get all conversations for the user
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group messages by conversation (between two users)
    const conversationMap = new Map<string, {
      id: string
      participant: {
        id: string
        name: string
        image?: string
        isOnline: boolean
      }
      lastMessage: {
        content: string
        createdAt: string
        isRead: boolean
      } | null
      unreadCount: number
    }>()

    conversations.forEach(message => {
      const otherUserId = message.senderId === userId 
        ? message.receiverId 
        : message.senderId
      
      const otherUser = message.senderId === userId 
        ? message.receiver 
        : message.sender

      const conversationKey = [userId, otherUserId].sort().join('-')

      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          id: conversationKey,
          participant: {
            id: otherUser.id,
            name: otherUser.name || 'Unknown User',
            image: otherUser.image || undefined,
            isOnline: false // In real app, check online status
          },
          lastMessage: null,
          unreadCount: 0
        })
      }

      const conversation = conversationMap.get(conversationKey)
      
      // Update last message if this is more recent
      if (conversation && (!conversation.lastMessage || message.createdAt > new Date(conversation.lastMessage.createdAt))) {
        conversation.lastMessage = {
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          isRead: message.isRead
        }
      }

      // Count unread messages from the other user
      if (conversation && message.receiverId === userId && !message.isRead) {
        conversation.unreadCount++
      }
    })

    const conversationList = Array.from(conversationMap.values())
      .sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0
        if (!a.lastMessage) return 1
        if (!b.lastMessage) return -1
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      })

    return NextResponse.json(conversationList)
  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
