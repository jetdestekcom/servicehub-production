import { prisma } from './prisma'
import { NotificationType } from '@prisma/client'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  content: string
  data?: Record<string, unknown>
}

export async function createNotification({
  userId,
  type,
  title,
  content,
  data
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        data: data ? JSON.stringify(data) : null,
        isRead: false
      }
    })

    return notification
  } catch (error) {
    console.error('Notification creation error:', error)
    throw error
  }
}

export async function createBookingNotification(
  userId: string,
  bookingId: string,
  type: 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'booking_completed',
  bookingData: Record<string, unknown>
) {
  const notificationTypes = {
    booking_created: NotificationType.BOOKING,
    booking_confirmed: NotificationType.BOOKING,
    booking_cancelled: NotificationType.BOOKING,
    booking_completed: NotificationType.BOOKING
  }

  const titles = {
    booking_created: 'Yeni Rezervasyon',
    booking_confirmed: 'Rezervasyon Onaylandı',
    booking_cancelled: 'Rezervasyon İptal Edildi',
    booking_completed: 'Rezervasyon Tamamlandı'
  }

  const contents = {
    booking_created: `Yeni bir rezervasyon talebi aldınız: ${bookingData.serviceTitle}`,
    booking_confirmed: `Rezervasyonunuz onaylandı: ${bookingData.serviceTitle}`,
    booking_cancelled: `Rezervasyonunuz iptal edildi: ${bookingData.serviceTitle}`,
    booking_completed: `Rezervasyonunuz tamamlandı: ${bookingData.serviceTitle}`
  }

  return createNotification({
    userId,
    type: notificationTypes[type],
    title: titles[type],
    content: contents[type],
    data: { bookingId, ...bookingData }
  })
}

export async function createMessageNotification(
  userId: string,
  messageId: string,
  senderName: string,
  messageContent: string
) {
  return createNotification({
    userId,
    type: NotificationType.MESSAGE,
    title: 'Yeni Mesaj',
    content: `${senderName}: ${messageContent}`,
    data: { messageId, senderName }
  })
}

export async function createReviewNotification(
  userId: string,
  reviewId: string,
  serviceTitle: string,
  rating: number,
  reviewerName: string
) {
  return createNotification({
    userId,
    type: NotificationType.REVIEW,
    title: 'Yeni Değerlendirme',
    content: `${reviewerName} hizmetinizi ${rating} yıldızla değerlendirdi: ${serviceTitle}`,
    data: { reviewId, serviceTitle, rating, reviewerName }
  })
}

export async function createPaymentNotification(
  userId: string,
  paymentId: string,
  amount: number,
  type: 'payment_received' | 'payment_failed'
) {
  const titles = {
    payment_received: 'Ödeme Alındı',
    payment_failed: 'Ödeme Başarısız'
  }

  const contents = {
    payment_received: `₺${amount} tutarında ödeme alındı`,
    payment_failed: `₺${amount} tutarında ödeme işlemi başarısız oldu`
  }

  return createNotification({
    userId,
    type: NotificationType.PAYMENT,
    title: titles[type],
    content: contents[type],
    data: { paymentId, amount, type }
  })
}

export async function createSystemNotification(
  userId: string,
  title: string,
  content: string,
  data?: Record<string, unknown>
) {
  return createNotification({
    userId,
    type: NotificationType.SYSTEM,
    title,
    content,
    data
  })
}
