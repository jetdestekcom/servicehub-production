import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Bildirim ayarlarını getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        notificationSettings: true,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Varsayılan ayarlar
    const defaultSettings = {
      booking: {
        email: true,
        sms: true,
        push: true
      },
      message: {
        email: true,
        sms: false,
        push: true
      },
      payment: {
        email: true,
        sms: true,
        push: true
      },
      review: {
        email: true,
        sms: false,
        push: true
      },
      promotion: {
        email: true,
        sms: false,
        push: true
      },
      system: {
        email: true,
        sms: false,
        push: true
      }
    }

    const settings = user.notificationSettings 
      ? JSON.parse(user.notificationSettings)
      : defaultSettings

    return NextResponse.json({
      success: true,
      settings,
      globalSettings: {
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications,
        pushNotifications: user.pushNotifications
      }
    })

  } catch (error) {
    console.error('Notification settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Bildirim ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      settings,
      globalSettings
    }: {
      settings?: Record<string, unknown>;
      globalSettings?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
      };
    } = await request.json()

    const updateData: Record<string, unknown> = {}

    if (settings) {
      updateData.notificationSettings = JSON.stringify(settings)
    }

    if (globalSettings) {
      updateData.emailNotifications = globalSettings.emailNotifications
      updateData.smsNotifications = globalSettings.smsNotifications
      updateData.pushNotifications = globalSettings.pushNotifications
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        notificationSettings: true,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Notification settings updated successfully'
    })

  } catch (error) {
    console.error('Notification settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
