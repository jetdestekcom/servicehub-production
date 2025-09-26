import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data, to } = body

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let emailOptions

    switch (type) {
      case 'booking_confirmation':
        emailOptions = emailService.generateBookingConfirmation(data)
        break
      case 'welcome':
        emailOptions = emailService.generateWelcomeEmail(data)
        break
      case 'password_reset':
        emailOptions = emailService.generatePasswordResetEmail(data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    // Override the 'to' field with the provided email
    emailOptions.to = to

    const success = await emailService.sendEmail(emailOptions)

    if (success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

