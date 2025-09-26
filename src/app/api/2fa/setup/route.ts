import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { TwoFactorAuth } from '@/lib/2fa'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'generate') {
      // Generate new 2FA setup
      const secret = TwoFactorAuth.generateSecret(session.user.email!)
      const qrCodeUrl = await TwoFactorAuth.generateQRCode(session.user.email!, secret)
      const backupCodes = TwoFactorAuth.generateBackupCodes()

      return NextResponse.json({
        success: true,
        secret,
        qrCodeUrl,
        backupCodes
      })
    }

    if (action === 'verify') {
      const { secret, token } = await request.json()

      if (!secret || !token) {
        return NextResponse.json(
          { error: 'Missing secret or token' },
          { status: 400 }
        )
      }

      const isValid = TwoFactorAuth.verifyToken(secret, token)

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'enable') {
      const { secret, backupCodes } = await request.json()

      if (!secret || !backupCodes) {
        return NextResponse.json(
          { error: 'Missing secret or backup codes' },
          { status: 400 }
        )
      }

      const success = await TwoFactorAuth.enable2FA(session.user.id, secret, backupCodes)

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to enable 2FA' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

