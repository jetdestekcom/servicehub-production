// @ts-expect-error Twilio types are not compatible with Next.js 15
import { Twilio } from 'twilio'

interface SMSOptions {
  to: string
  message: string
}

interface SMSTemplate {
  bookingConfirmation: {
    customerName: string
    serviceName: string
    providerName: string
    date: string
    time: string
  }
  bookingReminder: {
    customerName: string
    serviceName: string
    providerName: string
    date: string
    time: string
  }
  paymentConfirmation: {
    customerName: string
    serviceName: string
    amount: number
  }
  verificationCode: {
    customerName: string
    code: string
  }
}

class SMSService {
  private client: Twilio | null = null
  private fromNumber: string

  constructor() {
    this.initializeClient()
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || ''
  }

  private initializeClient() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    }
  }

  async sendSMS(options: SMSOptions): Promise<boolean> {
    if (!this.client) {
      console.log('SMS service not configured - skipping SMS send')
      return false
    }

    try {
      await this.client.messages.create({
        body: options.message,
        from: this.fromNumber,
        to: options.to
      })
      return true
    } catch (error) {
      console.error('SMS send error:', error)
      return false
    }
  }

  // SMS Templates
  generateBookingConfirmation(data: SMSTemplate['bookingConfirmation']): SMSOptions {
    return {
      to: data.customerName, // This should be the actual phone number
      message: `Merhaba ${data.customerName}! Rezervasyonunuz onaylandı. Hizmet: ${data.serviceName}, Hizmet Veren: ${data.providerName}, Tarih: ${data.date}, Saat: ${data.time}. JetDestek`
    }
  }

  generateBookingReminder(data: SMSTemplate['bookingReminder']): SMSOptions {
    return {
      to: data.customerName, // This should be the actual phone number
      message: `Hatırlatma: Yarın ${data.time} saatinde ${data.serviceName} hizmetiniz var. Hizmet Veren: ${data.providerName}. JetDestek`
    }
  }

  generatePaymentConfirmation(data: SMSTemplate['paymentConfirmation']): SMSOptions {
    return {
      to: data.customerName, // This should be the actual phone number
      message: `Ödemeniz alındı! Hizmet: ${data.serviceName}, Tutar: ₺${data.amount}. JetDestek`
    }
  }

  generateVerificationCode(data: SMSTemplate['verificationCode']): SMSOptions {
    return {
      to: data.customerName, // This should be the actual phone number
      message: `JetDestek doğrulama kodu: ${data.code}. Bu kodu kimseyle paylaşmayın.`
    }
  }
}

export const smsService = new SMSService()
