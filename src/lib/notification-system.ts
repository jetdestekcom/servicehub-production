// Gelişmiş bildirim sistemi - Rakiplerden daha kapsamlı
export interface NotificationTemplate {
  id: string
  type: 'booking' | 'message' | 'review' | 'payment' | 'system' | 'marketing' | 'reminder'
  title: string
  message: string
  icon: string
  color: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  channels: ('email' | 'sms' | 'push' | 'in-app')[]
  actions?: NotificationAction[]
}

export interface NotificationAction {
  id: string
  label: string
  url?: string
  action?: string
  style: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  // Rezervasyon Bildirimleri
  BOOKING_REQUEST: {
    id: 'BOOKING_REQUEST',
    type: 'booking',
    title: 'Yeni Rezervasyon Talebi',
    message: '{{customerName}} tarafından {{serviceTitle}} hizmeti için rezervasyon talebi alındı.',
    icon: '📅',
    color: 'blue',
    priority: 'high',
    channels: ['email', 'push', 'in-app'],
    actions: [
      { id: 'accept', label: 'Kabul Et', action: 'accept_booking', style: 'success' },
      { id: 'reject', label: 'Reddet', action: 'reject_booking', style: 'danger' }
    ]
  },
  BOOKING_CONFIRMED: {
    id: 'BOOKING_CONFIRMED',
    type: 'booking',
    title: 'Rezervasyon Onaylandı',
    message: '{{serviceTitle}} hizmeti için rezervasyonunuz onaylandı. Tarih: {{bookingDate}}',
    icon: '✅',
    color: 'green',
    priority: 'normal',
    channels: ['email', 'sms', 'push', 'in-app'],
    actions: [
      { id: 'view', label: 'Detayları Gör', url: '/bookings/{{bookingId}}', style: 'primary' }
    ]
  },
  BOOKING_CANCELLED: {
    id: 'BOOKING_CANCELLED',
    type: 'booking',
    title: 'Rezervasyon İptal Edildi',
    message: '{{serviceTitle}} hizmeti için rezervasyon iptal edildi.',
    icon: '❌',
    color: 'red',
    priority: 'high',
    channels: ['email', 'sms', 'push', 'in-app'],
    actions: [
      { id: 'rebook', label: 'Yeniden Rezerve Et', url: '/services/{{serviceId}}', style: 'primary' }
    ]
  },
  BOOKING_REMINDER: {
    id: 'BOOKING_REMINDER',
    type: 'reminder',
    title: 'Rezervasyon Hatırlatması',
    message: '{{serviceTitle}} hizmeti {{timeUntil}} sonra başlayacak.',
    icon: '⏰',
    color: 'orange',
    priority: 'normal',
    channels: ['email', 'sms', 'push', 'in-app'],
    actions: [
      { id: 'view', label: 'Detayları Gör', url: '/bookings/{{bookingId}}', style: 'primary' }
    ]
  },

  // Mesaj Bildirimleri
  MESSAGE_RECEIVED: {
    id: 'MESSAGE_RECEIVED',
    type: 'message',
    title: 'Yeni Mesaj',
    message: '{{senderName}} tarafından yeni mesaj alındı: {{messagePreview}}',
    icon: '💬',
    color: 'blue',
    priority: 'normal',
    channels: ['push', 'in-app'],
    actions: [
      { id: 'reply', label: 'Yanıtla', url: '/messages/{{conversationId}}', style: 'primary' }
    ]
  },

  // Değerlendirme Bildirimleri
  REVIEW_RECEIVED: {
    id: 'REVIEW_RECEIVED',
    type: 'review',
    title: 'Yeni Değerlendirme',
    message: '{{customerName}} tarafından {{serviceTitle}} hizmeti için {{rating}} yıldız değerlendirme alındı.',
    icon: '⭐',
    color: 'yellow',
    priority: 'normal',
    channels: ['email', 'push', 'in-app'],
    actions: [
      { id: 'view', label: 'Değerlendirmeyi Gör', url: '/reviews/{{reviewId}}', style: 'primary' }
    ]
  },

  // Ödeme Bildirimleri
  PAYMENT_RECEIVED: {
    id: 'PAYMENT_RECEIVED',
    type: 'payment',
    title: 'Ödeme Alındı',
    message: '{{serviceTitle}} hizmeti için {{amount}} TL ödeme alındı.',
    icon: '💰',
    color: 'green',
    priority: 'high',
    channels: ['email', 'sms', 'push', 'in-app'],
    actions: [
      { id: 'view', label: 'Detayları Gör', url: '/payments/{{paymentId}}', style: 'primary' }
    ]
  },
  PAYMENT_FAILED: {
    id: 'PAYMENT_FAILED',
    type: 'payment',
    title: 'Ödeme Başarısız',
    message: '{{serviceTitle}} hizmeti için ödeme işlemi başarısız oldu.',
    icon: '💳',
    color: 'red',
    priority: 'urgent',
    channels: ['email', 'sms', 'push', 'in-app'],
    actions: [
      { id: 'retry', label: 'Tekrar Dene', url: '/payments/{{paymentId}}/retry', style: 'primary' }
    ]
  },

  // Sistem Bildirimleri
  ACCOUNT_VERIFIED: {
    id: 'ACCOUNT_VERIFIED',
    type: 'system',
    title: 'Hesap Doğrulandı',
    message: 'Hesabınız başarıyla doğrulandı. Artık hizmet verebilirsiniz.',
    icon: '✅',
    color: 'green',
    priority: 'normal',
    channels: ['email', 'push', 'in-app'],
    actions: [
      { id: 'profile', label: 'Profili Güncelle', url: '/profile', style: 'primary' }
    ]
  },
  PROFILE_UPDATED: {
    id: 'PROFILE_UPDATED',
    type: 'system',
    title: 'Profil Güncellendi',
    message: 'Profil bilgileriniz başarıyla güncellendi.',
    icon: '👤',
    color: 'blue',
    priority: 'low',
    channels: ['in-app']
  },

  // Pazarlama Bildirimleri
  NEW_SERVICE_AVAILABLE: {
    id: 'NEW_SERVICE_AVAILABLE',
    type: 'marketing',
    title: 'Yeni Hizmet Mevcut',
    message: '{{categoryName}} kategorisinde yeni hizmetler eklendi.',
    icon: '🆕',
    color: 'purple',
    priority: 'low',
    channels: ['email', 'push', 'in-app'],
    actions: [
      { id: 'explore', label: 'Keşfet', url: '/services?category={{categoryId}}', style: 'primary' }
    ]
  },
  PROMOTION_AVAILABLE: {
    id: 'PROMOTION_AVAILABLE',
    type: 'marketing',
    title: 'Özel İndirim',
    message: '{{serviceTitle}} hizmeti için %{{discount}} indirim fırsatı!',
    icon: '🎉',
    color: 'orange',
    priority: 'normal',
    channels: ['email', 'push', 'in-app'],
    actions: [
      { id: 'book', label: 'Rezerve Et', url: '/services/{{serviceId}}', style: 'success' }
    ]
  }
}

export class NotificationManager {
  private templates: Record<string, NotificationTemplate>

  constructor() {
    this.templates = NOTIFICATION_TEMPLATES
  }

  // Bildirim oluştur
  createNotification(templateId: string, data: Record<string, any>, userId: string) {
    const template = this.templates[templateId]
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const notification = {
      id: this.generateId(),
      templateId,
      userId,
      title: this.replacePlaceholders(template.title, data),
      message: this.replacePlaceholders(template.message, data),
      icon: template.icon,
      color: template.color,
      priority: template.priority,
      channels: template.channels,
      actions: template.actions?.map(action => ({
        ...action,
        url: action.url ? this.replacePlaceholders(action.url, data) : undefined
      })),
      data,
      createdAt: new Date(),
      read: false
    }

    return notification
  }

  // Bildirim gönder
  async sendNotification(notification: any) {
    const promises = []

    // E-posta gönder
    if (notification.channels.includes('email')) {
      promises.push(this.sendEmail(notification))
    }

    // SMS gönder
    if (notification.channels.includes('sms')) {
      promises.push(this.sendSMS(notification))
    }

    // Push bildirimi gönder
    if (notification.channels.includes('push')) {
      promises.push(this.sendPush(notification))
    }

    // In-app bildirimi kaydet
    if (notification.channels.includes('in-app')) {
      promises.push(this.saveInApp(notification))
    }

    await Promise.all(promises)
  }

  // Toplu bildirim gönder
  async sendBulkNotification(templateId: string, data: Record<string, any>, userIds: string[]) {
    const promises = userIds.map(userId => {
      const notification = this.createNotification(templateId, data, userId)
      return this.sendNotification(notification)
    })

    await Promise.all(promises)
  }

  // Bildirim şablonu oluştur
  createTemplate(template: NotificationTemplate) {
    this.templates[template.id] = template
  }

  // Bildirim şablonu güncelle
  updateTemplate(templateId: string, updates: Partial<NotificationTemplate>) {
    if (this.templates[templateId]) {
      this.templates[templateId] = { ...this.templates[templateId], ...updates }
    }
  }

  // Bildirim şablonu sil
  deleteTemplate(templateId: string) {
    delete this.templates[templateId]
  }

  // Placeholder'ları değiştir
  private replacePlaceholders(text: string, data: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }

  // ID oluştur
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // E-posta gönder
  private async sendEmail(notification: any) {
    // E-posta gönderme implementasyonu
    console.log('Sending email notification:', notification.title)
  }

  // SMS gönder
  private async sendSMS(notification: any) {
    // SMS gönderme implementasyonu
    console.log('Sending SMS notification:', notification.title)
  }

  // Push bildirimi gönder
  private async sendPush(notification: any) {
    // Push bildirimi gönderme implementasyonu
    console.log('Sending push notification:', notification.title)
  }

  // In-app bildirimi kaydet
  private async saveInApp(notification: any) {
    // In-app bildirimi kaydetme implementasyonu
    console.log('Saving in-app notification:', notification.title)
  }
}

// Bildirim tercihleri
export interface NotificationPreferences {
  userId: string
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  categories: {
    booking: boolean
    message: boolean
    review: boolean
    payment: boolean
    system: boolean
    marketing: boolean
    reminder: boolean
  }
  frequency: 'immediate' | 'daily' | 'weekly'
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  userId: '',
  email: true,
  sms: false,
  push: true,
  inApp: true,
  categories: {
    booking: true,
    message: true,
    review: true,
    payment: true,
    system: true,
    marketing: false,
    reminder: true
  },
  frequency: 'immediate',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
}

