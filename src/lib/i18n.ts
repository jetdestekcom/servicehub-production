interface Translations {
  [key: string]: string | Translations
}

const translations: Record<string, Translations> = {
  tr: {
    // Navigation
    'nav.search': 'Hizmet Ara',
    'nav.services': 'Hizmetler',
    'nav.providers': 'Hizmet Verenler',
    'nav.about': 'Hakkımızda',
    'nav.dashboard': 'Dashboard',
    'nav.signin': 'Giriş Yap',
    'nav.signup': 'Kayıt Ol',
    'nav.signout': 'Çıkış Yap',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.success': 'Başarılı',
    'common.cancel': 'İptal',
    'common.save': 'Kaydet',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'common.confirm': 'Onayla',
    'common.back': 'Geri',
    'common.next': 'İleri',
    'common.previous': 'Önceki',
    'common.close': 'Kapat',
    
    // Auth
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.confirmPassword': 'Şifre Tekrar',
    'auth.name': 'Ad Soyad',
    'auth.phone': 'Telefon',
    'auth.signin': 'Giriş Yap',
    'auth.signup': 'Kayıt Ol',
    'auth.forgotPassword': 'Şifremi Unuttum',
    'auth.resetPassword': 'Şifre Sıfırla',
    'auth.signinWithGoogle': 'Google ile Giriş',
    'auth.signupWithGoogle': 'Google ile Kayıt',
    
    // Services
    'services.title': 'Hizmetler',
    'services.search': 'Hizmet Ara',
    'services.category': 'Kategori',
    'services.price': 'Fiyat',
    'services.rating': 'Puan',
    'services.location': 'Konum',
    'services.duration': 'Süre',
    'services.bookNow': 'Hemen Al',
    'services.viewDetails': 'Detayları Gör',
    'services.addService': 'Hizmet Ekle',
    'services.editService': 'Hizmet Düzenle',
    'services.deleteService': 'Hizmet Sil',
    
    // Booking
    'booking.title': 'Rezervasyon',
    'booking.selectDate': 'Tarih Seç',
    'booking.selectTime': 'Saat Seç',
    'booking.notes': 'Notlar',
    'booking.address': 'Adres',
    'booking.totalPrice': 'Toplam Fiyat',
    'booking.commission': 'Komisyon',
    'booking.finalPrice': 'Son Fiyat',
    'booking.confirm': 'Rezervasyonu Onayla',
    'booking.success': 'Rezervasyon başarıyla oluşturuldu!',
    
    // Payment
    'payment.title': 'Ödeme',
    'payment.method': 'Ödeme Yöntemi',
    'payment.cardNumber': 'Kart Numarası',
    'payment.expiryDate': 'Son Kullanma Tarihi',
    'payment.cvv': 'CVV',
    'payment.cardholderName': 'Kart Sahibi Adı',
    'payment.payNow': 'Ödeme Yap',
    'payment.success': 'Ödeme başarılı!',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Genel Bakış',
    'dashboard.bookings': 'Rezervasyonlar',
    'dashboard.services': 'Hizmetler',
    'dashboard.earnings': 'Kazançlar',
    'dashboard.rating': 'Puan',
    'dashboard.reviews': 'Değerlendirmeler',
    
    // Messages
    'messages.title': 'Mesajlar',
    'messages.send': 'Gönder',
    'messages.typeMessage': 'Mesaj yazın...',
    'messages.noMessages': 'Henüz mesaj yok',
    
    // Notifications
    'notifications.title': 'Bildirimler',
    'notifications.markAsRead': 'Okundu Olarak İşaretle',
    'notifications.noNotifications': 'Bildirim yok',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'Kullanıcılar',
    'admin.services': 'Hizmetler',
    'admin.bookings': 'Rezervasyonlar',
    'admin.analytics': 'Analitik',
    'admin.settings': 'Ayarlar',
    
    // Errors
    'error.unauthorized': 'Yetkisiz erişim',
    'error.notFound': 'Bulunamadı',
    'error.serverError': 'Sunucu hatası',
    'error.networkError': 'Ağ hatası',
    'error.validationError': 'Doğrulama hatası',
    
    // Success
    'success.saved': 'Başarıyla kaydedildi',
    'success.updated': 'Başarıyla güncellendi',
    'success.deleted': 'Başarıyla silindi',
    'success.sent': 'Başarıyla gönderildi'
  },
  
  en: {
    // Navigation
    'nav.search': 'Search Services',
    'nav.services': 'Services',
    'nav.providers': 'Providers',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.signout': 'Sign Out',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.forgotPassword': 'Forgot Password',
    'auth.resetPassword': 'Reset Password',
    'auth.signinWithGoogle': 'Sign in with Google',
    'auth.signupWithGoogle': 'Sign up with Google',
    
    // Services
    'services.title': 'Services',
    'services.search': 'Search Services',
    'services.category': 'Category',
    'services.price': 'Price',
    'services.rating': 'Rating',
    'services.location': 'Location',
    'services.duration': 'Duration',
    'services.bookNow': 'Book Now',
    'services.viewDetails': 'View Details',
    'services.addService': 'Add Service',
    'services.editService': 'Edit Service',
    'services.deleteService': 'Delete Service',
    
    // Booking
    'booking.title': 'Booking',
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.notes': 'Notes',
    'booking.address': 'Address',
    'booking.totalPrice': 'Total Price',
    'booking.commission': 'Commission',
    'booking.finalPrice': 'Final Price',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking created successfully!',
    
    // Payment
    'payment.title': 'Payment',
    'payment.method': 'Payment Method',
    'payment.cardNumber': 'Card Number',
    'payment.expiryDate': 'Expiry Date',
    'payment.cvv': 'CVV',
    'payment.cardholderName': 'Cardholder Name',
    'payment.payNow': 'Pay Now',
    'payment.success': 'Payment successful!',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.bookings': 'Bookings',
    'dashboard.services': 'Services',
    'dashboard.earnings': 'Earnings',
    'dashboard.rating': 'Rating',
    'dashboard.reviews': 'Reviews',
    
    // Messages
    'messages.title': 'Messages',
    'messages.send': 'Send',
    'messages.typeMessage': 'Type a message...',
    'messages.noMessages': 'No messages yet',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAsRead': 'Mark as Read',
    'notifications.noNotifications': 'No notifications',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'Users',
    'admin.services': 'Services',
    'admin.bookings': 'Bookings',
    'admin.analytics': 'Analytics',
    'admin.settings': 'Settings',
    
    // Errors
    'error.unauthorized': 'Unauthorized access',
    'error.notFound': 'Not found',
    'error.serverError': 'Server error',
    'error.networkError': 'Network error',
    'error.validationError': 'Validation error',
    
    // Success
    'success.saved': 'Successfully saved',
    'success.updated': 'Successfully updated',
    'success.deleted': 'Successfully deleted',
    'success.sent': 'Successfully sent'
  }
}

class I18nService {
  private currentLanguage: string = 'tr'

  setLanguage(language: string) {
    this.currentLanguage = language
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }

  getLanguage(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'tr'
    }
    return this.currentLanguage
  }

  t(key: string, params?: Record<string, string>): string {
    const language = this.getLanguage()
    const translation = this.getNestedTranslation(translations[language], key)
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }

    if (params) {
      return this.interpolate(translation, params)
    }

    return translation
  }

  private getNestedTranslation(obj: Record<string, unknown>, key: string): string | null {
    const result = key.split('.').reduce((current: Record<string, unknown> | null, keyPart: string) => {
      return current && current[keyPart] ? current[keyPart] as Record<string, unknown> : null
    }, obj)
    return typeof result === 'string' ? result : null
  }

  private interpolate(template: string, params: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] || match
    })
  }

  getAvailableLanguages(): Array<{ code: string; name: string; flag: string }> {
    return [
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  }
}

export const i18n = new I18nService()
