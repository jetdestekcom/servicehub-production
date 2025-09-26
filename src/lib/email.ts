import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailTemplate {
  bookingConfirmation: {
    customerName: string
    serviceName: string
    providerName: string
    date: string
    time: string
    price: number
    address: string
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
    paymentId: string
  }
  welcome: {
    name: string
    role: 'CUSTOMER' | 'PROVIDER'
  }
  passwordReset: {
    name: string
    resetLink: string
  }
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    } else if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration would go here
      console.log('SendGrid configured but not implemented yet')
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email service not configured - skipping email send')
      return false
    }

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@jetdestek.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })
      return true
    } catch (error) {
      console.error('Email send error:', error)
      return false
    }
  }

  // Email Templates
  generateBookingConfirmation(data: EmailTemplate['bookingConfirmation']): EmailOptions {
    return {
      to: data.customerName, // This should be the actual email
      subject: 'Rezervasyonunuz Onaylandı - JetDestek',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">JetDestek</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Rezervasyon Onayı</p>
          </div>
          
          <div style="padding: 30px; background: #F9FAFB;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0;">Merhaba ${data.customerName},</h2>
            <p style="color: #4B5563; line-height: 1.6; margin: 0 0 20px 0;">
              Rezervasyonunuz başarıyla onaylandı! İşte rezervasyon detaylarınız:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0;">Rezervasyon Detayları</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Hizmet:</td>
                  <td style="padding: 8px 0; color: #1F2937;">${data.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Hizmet Veren:</td>
                  <td style="padding: 8px 0; color: #1F2937;">${data.providerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Tarih:</td>
                  <td style="padding: 8px 0; color: #1F2937;">${data.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Saat:</td>
                  <td style="padding: 8px 0; color: #1F2937;">${data.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Adres:</td>
                  <td style="padding: 8px 0; color: #1F2937;">${data.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B7280; font-weight: 500;">Tutar:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: 600; font-size: 18px;">₺${data.price}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4B5563; line-height: 1.6; margin: 20px 0;">
              Hizmet verenimiz sizinle iletişime geçecek ve rezervasyonunuzu onaylayacaktır.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Dashboard'a Git
              </a>
            </div>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p style="margin: 0;">Bu e-posta otomatik olarak gönderilmiştir.</p>
            <p style="margin: 5px 0 0 0;">© 2024 JetDestek.com - Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
      text: `
        Merhaba ${data.customerName},
        
        Rezervasyonunuz başarıyla onaylandı!
        
        Hizmet: ${data.serviceName}
        Hizmet Veren: ${data.providerName}
        Tarih: ${data.date}
        Saat: ${data.time}
        Adres: ${data.address}
        Tutar: ₺${data.price}
        
        Dashboard: ${process.env.NEXTAUTH_URL}/dashboard
      `
    }
  }

  generateWelcomeEmail(data: EmailTemplate['welcome']): EmailOptions {
    const roleText = data.role === 'CUSTOMER' ? 'müşteri' : 'hizmet veren'
    
    return {
      to: data.name, // This should be the actual email
      subject: 'JetDestek\'e Hoş Geldiniz!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">JetDestek</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Hoş Geldiniz!</p>
          </div>
          
          <div style="padding: 30px; background: #F9FAFB;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0;">Merhaba ${data.name},</h2>
            <p style="color: #4B5563; line-height: 1.6; margin: 0 0 20px 0;">
              JetDestek ailesine hoş geldiniz! ${roleText} olarak kaydınız başarıyla tamamlandı.
            </p>
            
            ${data.role === 'CUSTOMER' ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1F2937; margin: 0 0 15px 0;">Müşteri Olarak Neler Yapabilirsiniz?</h3>
                <ul style="color: #4B5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>İhtiyacınıza uygun hizmetleri arayın</li>
                  <li>Güvenilir hizmet verenlerle iletişime geçin</li>
                  <li>Kolay ödeme yapın</li>
                  <li>Hizmetleri değerlendirin</li>
                </ul>
              </div>
            ` : `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1F2937; margin: 0 0 15px 0;">Hizmet Veren Olarak Neler Yapabilirsiniz?</h3>
                <ul style="color: #4B5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Hizmetlerinizi ekleyin ve yönetin</li>
                  <li>Müşteri rezervasyonlarını alın</li>
                  <li>Düşük komisyonla kazanç elde edin</li>
                  <li>Müşteri değerlendirmelerini görün</li>
                </ul>
              </div>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Dashboard'a Git
              </a>
            </div>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p style="margin: 0;">© 2024 JetDestek.com - Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
      text: `
        Merhaba ${data.name},
        
        JetDestek ailesine hoş geldiniz! ${roleText} olarak kaydınız başarıyla tamamlandı.
        
        Dashboard: ${process.env.NEXTAUTH_URL}/dashboard
      `
    }
  }

  generatePasswordResetEmail(data: EmailTemplate['passwordReset']): EmailOptions {
    return {
      to: data.name, // This should be the actual email
      subject: 'Şifre Sıfırlama - JetDestek',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">JetDestek</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Şifre Sıfırlama</p>
          </div>
          
          <div style="padding: 30px; background: #F9FAFB;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0;">Merhaba ${data.name},</h2>
            <p style="color: #4B5563; line-height: 1.6; margin: 0 0 20px 0;">
              Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetLink}" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Şifremi Sıfırla
              </a>
            </div>
            
            <p style="color: #4B5563; line-height: 1.6; margin: 20px 0; font-size: 14px;">
              Bu bağlantı 1 saat geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p style="margin: 0;">© 2024 JetDestek.com - Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
      text: `
        Merhaba ${data.name},
        
        Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:
        ${data.resetLink}
        
        Bu bağlantı 1 saat geçerlidir.
      `
    }
  }
}

export const emailService = new EmailService()
