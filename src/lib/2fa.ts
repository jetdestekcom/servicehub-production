import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { prisma } from './prisma'

// Configure OTP
authenticator.options = {
  window: 2, // Allow 2 time steps (60 seconds) of tolerance
  step: 30, // 30 second time steps
}

export class TwoFactorAuth {
  /**
   * Generate a secret for a user
   */
  static generateSecret(userEmail: string): string {
    return authenticator.generateSecret()
  }

  /**
   * Generate a QR code URL for the user to scan
   */
  static async generateQRCode(userEmail: string, secret: string): Promise<string> {
    const serviceName = 'JetDestek'
    const otpAuthUrl = authenticator.keyuri(userEmail, serviceName, secret)
    
    try {
      const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl)
      return qrCodeUrl
    } catch (error) {
      console.error('QR Code generation error:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Verify a TOTP token
   */
  static verifyToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      console.error('Token verification error:', error)
      return false
    }
  }

  /**
   * Generate backup codes for a user
   */
  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }

  /**
   * Enable 2FA for a user
   */
  static async enable2FA(
    userId: string,
    secret: string,
    backupCodes: string[]
  ): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: secret,
          twoFactorBackupCodes: backupCodes.join(','),
          twoFactorEnabled: true
        }
      })
      return true
    } catch (error) {
      console.error('Enable 2FA error:', error)
      return false
    }
  }

  /**
   * Disable 2FA for a user
   */
  static async disable2FA(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: null,
          twoFactorBackupCodes: null,
          twoFactorEnabled: false
        }
      })
      return true
    } catch (error) {
      console.error('Disable 2FA error:', error)
      return false
    }
  }

  /**
   * Verify 2FA token or backup code
   */
  static async verify2FA(userId: string, token: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          twoFactorSecret: true,
          twoFactorBackupCodes: true,
          twoFactorEnabled: true
        }
      })

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return false
      }

      // Check if it's a backup code
      if (user.twoFactorBackupCodes) {
        const backupCodes = user.twoFactorBackupCodes.split(',')
        const codeIndex = backupCodes.indexOf(token)
        
        if (codeIndex !== -1) {
          // Remove used backup code
          backupCodes.splice(codeIndex, 1)
          await prisma.user.update({
            where: { id: userId },
            data: {
              twoFactorBackupCodes: backupCodes.join(',')
            }
          })
          return true
        }
      }

      // Verify TOTP token
      return this.verifyToken(user.twoFactorSecret, token)
    } catch (error) {
      console.error('2FA verification error:', error)
      return false
    }
  }

  /**
   * Check if user has 2FA enabled
   */
  static async is2FAEnabled(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { twoFactorEnabled: true }
      })
      return user?.twoFactorEnabled || false
    } catch (error) {
      console.error('2FA check error:', error)
      return false
    }
  }

  /**
   * Get user's backup codes
   */
  static async getBackupCodes(userId: string): Promise<string[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { twoFactorBackupCodes: true }
      })
      
      if (!user?.twoFactorBackupCodes) {
        return []
      }
      
      return user.twoFactorBackupCodes.split(',').filter(code => code.length > 0)
    } catch (error) {
      console.error('Get backup codes error:', error)
      return []
    }
  }
}

