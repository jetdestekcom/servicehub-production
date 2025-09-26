import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Push bildirimi gönder
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      userId, 
      title, 
      body, 
      data, 
      type = 'GENERAL',
      priority = 'normal',
      ttl = 3600
    }: {
      userId: string;
      title: string;
      body: string;
      data?: Record<string, unknown>;
      type?: string;
      priority?: string;
      ttl?: number;
    } = await request.json()

    // Kullanıcının push token'larını al
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        name: true, 
        pushTokens: true,
        notificationSettings: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Bildirim ayarlarını kontrol et
    const settings = user.notificationSettings ? JSON.parse(user.notificationSettings) : {}
    if (settings[type] === false) {
      return NextResponse.json({ 
        success: true, 
        message: 'Notification blocked by user settings' 
      })
    }

    // Veritabanına bildirim kaydet
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type as 'BOOKING' | 'MESSAGE' | 'PAYMENT' | 'REVIEW',
        title,
        content: body,
        data: data ? JSON.stringify(data) : null
      }
    })

    // Push token'ları varsa push bildirimi gönder
    if (user.pushTokens && user.pushTokens.length > 0) {
      // Bu kısım gerçek push notification servisi ile entegre edilecek
      // (Firebase Cloud Messaging, OneSignal, vb.)
      console.log('Sending push notification:', {
        tokens: user.pushTokens,
        title,
        body,
        data
      })
    }

    return NextResponse.json({ 
      success: true, 
      notificationId: notification.id,
      message: 'Notification sent successfully' 
    })

  } catch (error) {
    console.error('Push notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Push token kaydet
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token, platform, deviceId } = await request.json()

    // Mevcut token'ı kontrol et
    const existingToken = await prisma.pushToken.findFirst({
      where: {
        userId: session.user.id,
        deviceId
      }
    })

    if (existingToken) {
      // Token'ı güncelle
      await prisma.pushToken.update({
        where: { id: existingToken.id },
        data: {
          token,
          platform,
          lastUsed: new Date()
        }
      })
    } else {
      // Yeni token oluştur
      await prisma.pushToken.create({
        data: {
          userId: session.user.id,
          token,
          platform,
          deviceId,
          lastUsed: new Date()
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Push token saved successfully' 
    })

  } catch (error) {
    console.error('Push token save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
