// Demo kullanıcılar ve hizmetler için test verileri

export const demoUsers = [
  {
    id: 'demo-customer-1',
    name: 'Ayşe Yılmaz',
    email: 'ayse@demo.com',
    password: 'demo123',
    role: 'CUSTOMER',
    phone: '+90 532 123 45 67',
    image: '/api/placeholder/150/150',
    isVerified: true,
    rating: 4.9,
    reviewCount: 23,
    createdAt: new Date('2024-01-15'),
    location: 'Kadıköy, İstanbul'
  },
  {
    id: 'demo-provider-1',
    name: 'Ahmet Temizlik Uzmanı',
    email: 'ahmet@demo.com',
    password: 'demo123',
    role: 'PROVIDER',
    phone: '+90 533 234 56 78',
    image: '/api/placeholder/150/150',
    isVerified: true,
    rating: 4.8,
    reviewCount: 156,
    createdAt: new Date('2024-01-10'),
    location: 'Beşiktaş, İstanbul',
    specialties: ['Ev Temizliği', 'Ofis Temizliği', 'Cam Temizliği'],
    experience: '5 yıl',
    languages: ['Türkçe', 'İngilizce']
  },
  {
    id: 'demo-provider-2',
    name: 'Mehmet Bahçıvan',
    email: 'mehmet@demo.com',
    password: 'demo123',
    role: 'PROVIDER',
    phone: '+90 534 345 67 89',
    image: '/api/placeholder/150/150',
    isVerified: true,
    rating: 4.7,
    reviewCount: 89,
    createdAt: new Date('2024-01-12'),
    location: 'Şişli, İstanbul',
    specialties: ['Bahçe Bakımı', 'Ağaç Dikimi', 'Çim Bakımı'],
    experience: '8 yıl',
    languages: ['Türkçe']
  },
  {
    id: 'demo-provider-3',
    name: 'Fatma Teknik Uzman',
    email: 'fatma@demo.com',
    password: 'demo123',
    role: 'PROVIDER',
    phone: '+90 535 456 78 90',
    image: '/api/placeholder/150/150',
    isVerified: true,
    rating: 4.9,
    reviewCount: 203,
    createdAt: new Date('2024-01-08'),
    location: 'Beyoğlu, İstanbul',
    specialties: ['Bilgisayar Tamiri', 'Telefon Tamiri', 'Yazılım Desteği'],
    experience: '6 yıl',
    languages: ['Türkçe', 'İngilizce', 'Almanca']
  },
  {
    id: 'demo-customer-2',
    name: 'Ali Demir',
    email: 'ali@demo.com',
    password: 'demo123',
    role: 'CUSTOMER',
    phone: '+90 536 567 89 01',
    image: '/api/placeholder/150/150',
    isVerified: true,
    rating: 4.8,
    reviewCount: 12,
    createdAt: new Date('2024-01-20'),
    location: 'Üsküdar, İstanbul'
  }
]

export const demoCategories = [
  {
    id: 'ev-temizligi',
    name: 'Ev Temizliği',
    icon: '🏠',
    description: 'Profesyonel ev temizlik hizmetleri',
    serviceCount: 245,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'bahce-bakimi',
    name: 'Bahçe Bakımı',
    icon: '🌱',
    description: 'Bahçe düzenleme ve bakım hizmetleri',
    serviceCount: 89,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'teknik-destek',
    name: 'Teknik Destek',
    icon: '💻',
    description: 'Bilgisayar ve elektronik tamir hizmetleri',
    serviceCount: 156,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'nakliye',
    name: 'Nakliye',
    icon: '🚚',
    description: 'Eşya taşıma ve nakliye hizmetleri',
    serviceCount: 78,
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'boyama',
    name: 'Boyama',
    icon: '🎨',
    description: 'Ev ve ofis boyama hizmetleri',
    serviceCount: 134,
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'ozel-ders',
    name: 'Özel Ders',
    icon: '📚',
    description: 'Kişisel eğitim ve özel ders hizmetleri',
    serviceCount: 201,
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'tamir',
    name: 'Tamir Hizmetleri',
    icon: '🔧',
    description: 'Genel tamir ve bakım hizmetleri',
    serviceCount: 167,
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'guzellik',
    name: 'Güzellik & Bakım',
    icon: '💄',
    description: 'Kişisel bakım ve güzellik hizmetleri',
    serviceCount: 98,
    color: 'bg-rose-100 text-rose-800'
  }
]

export const demoServices = [
  {
    id: 'service-1',
    title: 'Profesyonel Ev Temizliği',
    description: '3 yatak odalı ev için kapsamlı temizlik hizmeti. Mutfak, banyo, salon ve yatak odaları dahil.',
    providerId: 'demo-provider-1',
    providerName: 'Ahmet Temizlik Uzmanı',
    category: 'ev-temizligi',
    price: 200,
    duration: '3-4 saat',
    rating: 4.8,
    reviewCount: 156,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    features: [
      'Mutfak temizliği',
      'Banyo temizliği',
      'Salon temizliği',
      'Yatak odası temizliği',
      'Cam temizliği',
      'Toz alma'
    ],
    availability: 'Hafta içi 09:00-18:00',
    location: 'İstanbul - Avrupa Yakası',
    isVerified: true,
    createdAt: new Date('2024-01-10'),
    views: 2340,
    bookings: 45
  },
  {
    id: 'service-2',
    title: 'Bahçe Düzenleme ve Bakım',
    description: 'Bahçenizi yeniden düzenleyin! Çim bakımı, ağaç budama, çiçek dikimi ve genel bahçe bakımı.',
    providerId: 'demo-provider-2',
    providerName: 'Mehmet Bahçıvan',
    category: 'bahce-bakimi',
    price: 350,
    duration: '4-6 saat',
    rating: 4.7,
    reviewCount: 89,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    features: [
      'Çim biçme',
      'Ağaç budama',
      'Çiçek dikimi',
      'Gübreleme',
      'Sulama sistemi',
      'Bahçe düzenleme'
    ],
    availability: 'Hafta sonu 08:00-17:00',
    location: 'İstanbul - Anadolu Yakası',
    isVerified: true,
    createdAt: new Date('2024-01-12'),
    views: 1890,
    bookings: 23
  },
  {
    id: 'service-3',
    title: 'Bilgisayar ve Telefon Tamiri',
    description: 'Bilgisayar, laptop, telefon ve tablet tamir hizmetleri. Hızlı ve güvenilir çözümler.',
    providerId: 'demo-provider-3',
    providerName: 'Fatma Teknik Uzman',
    category: 'teknik-destek',
    price: 150,
    duration: '1-2 saat',
    rating: 4.9,
    reviewCount: 203,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    features: [
      'Bilgisayar tamiri',
      'Telefon tamiri',
      'Yazılım kurulumu',
      'Virüs temizleme',
      'Veri kurtarma',
      'Donanım değişimi'
    ],
    availability: 'Hafta içi 10:00-19:00',
    location: 'İstanbul - Tüm İlçeler',
    isVerified: true,
    createdAt: new Date('2024-01-08'),
    views: 3450,
    bookings: 67
  },
  {
    id: 'service-4',
    title: 'Ev ve Ofis Boyama',
    description: 'Profesyonel boyama hizmetleri. İç ve dış mekan boyama, dekoratif boyama teknikleri.',
    providerId: 'demo-provider-1',
    providerName: 'Ahmet Temizlik Uzmanı',
    category: 'boyama',
    price: 800,
    duration: '2-3 gün',
    rating: 4.6,
    reviewCount: 78,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    features: [
      'İç mekan boyama',
      'Dış mekan boyama',
      'Dekoratif boyama',
      'Astarlama',
      'Zımparalama',
      'Temizlik'
    ],
    availability: 'Hafta içi 08:00-17:00',
    location: 'İstanbul - Avrupa Yakası',
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    views: 1560,
    bookings: 12
  },
  {
    id: 'service-5',
    title: 'Matematik Özel Ders',
    description: 'İlkokul, ortaokul ve lise seviyesinde matematik özel ders. Deneyimli öğretmen ile.',
    providerId: 'demo-provider-2',
    providerName: 'Mehmet Bahçıvan',
    category: 'ozel-ders',
    price: 120,
    duration: '1 saat',
    rating: 4.8,
    reviewCount: 45,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    features: [
      'İlkokul matematik',
      'Ortaokul matematik',
      'Lise matematik',
      'Sınav hazırlığı',
      'Ev ödevi yardımı',
      'Online ders'
    ],
    availability: 'Hafta içi 16:00-20:00',
    location: 'İstanbul - Tüm İlçeler',
    isVerified: true,
    createdAt: new Date('2024-01-18'),
    views: 980,
    bookings: 34
  }
]

export const demoBookings = [
  {
    id: 'booking-1',
    customerId: 'demo-customer-1',
    customerName: 'Ayşe Yılmaz',
    serviceId: 'service-1',
    serviceTitle: 'Profesyonel Ev Temizliği',
    providerId: 'demo-provider-1',
    providerName: 'Ahmet Temizlik Uzmanı',
    status: 'confirmed',
    scheduledDate: new Date('2024-01-26T10:00:00'),
    duration: '3-4 saat',
    price: 200,
    address: 'Kadıköy, İstanbul',
    notes: '3 yatak odalı ev, mutfak ve banyo dahil',
    createdAt: new Date('2024-01-25T14:30:00'),
    paymentStatus: 'pending'
  },
  {
    id: 'booking-2',
    customerId: 'demo-customer-2',
    customerName: 'Ali Demir',
    serviceId: 'service-2',
    serviceTitle: 'Bahçe Düzenleme ve Bakım',
    providerId: 'demo-provider-2',
    providerName: 'Mehmet Bahçıvan',
    status: 'completed',
    scheduledDate: new Date('2024-01-24T09:00:00'),
    duration: '4-6 saat',
    price: 350,
    address: 'Üsküdar, İstanbul',
    notes: 'Bahçe düzenleme ve çim bakımı',
    createdAt: new Date('2024-01-23T16:45:00'),
    paymentStatus: 'completed'
  },
  {
    id: 'booking-3',
    customerId: 'demo-customer-1',
    customerName: 'Ayşe Yılmaz',
    serviceId: 'service-3',
    serviceTitle: 'Bilgisayar ve Telefon Tamiri',
    providerId: 'demo-provider-3',
    providerName: 'Fatma Teknik Uzman',
    status: 'in-progress',
    scheduledDate: new Date('2024-01-25T15:00:00'),
    duration: '1-2 saat',
    price: 150,
    address: 'Kadıköy, İstanbul',
    notes: 'Laptop tamiri ve yazılım kurulumu',
    createdAt: new Date('2024-01-25T10:20:00'),
    paymentStatus: 'pending'
  }
]

export const demoReviews = [
  {
    id: 'review-1',
    customerId: 'demo-customer-1',
    customerName: 'Ayşe Yılmaz',
    serviceId: 'service-1',
    providerId: 'demo-provider-1',
    rating: 5,
    comment: 'Çok memnun kaldım! Evim tertemiz oldu. Ahmet bey çok dikkatli ve titiz çalıştı. Kesinlikle tavsiye ederim.',
    createdAt: new Date('2024-01-20T18:30:00')
  },
  {
    id: 'review-2',
    customerId: 'demo-customer-2',
    customerName: 'Ali Demir',
    serviceId: 'service-2',
    providerId: 'demo-provider-2',
    rating: 4,
    comment: 'Bahçe düzenleme işi çok güzel oldu. Mehmet bey deneyimli ve işini biliyor. Fiyat da uygun.',
    createdAt: new Date('2024-01-22T14:15:00')
  },
  {
    id: 'review-3',
    customerId: 'demo-customer-1',
    customerName: 'Ayşe Yılmaz',
    serviceId: 'service-3',
    providerId: 'demo-provider-3',
    rating: 5,
    comment: 'Laptopum çok hızlı tamir edildi. Fatma hanım çok profesyonel. Teknik bilgisi çok iyi.',
    createdAt: new Date('2024-01-18T20:45:00')
  }
]

export const demoNotifications = [
  {
    id: 'notif-1',
    userId: 'demo-customer-1',
    type: 'booking',
    title: 'Yeni Rezervasyon',
    message: 'Ev temizliği hizmeti için rezervasyonunuz onaylandı.',
    isRead: false,
    createdAt: new Date('2024-01-25T10:30:00'),
    actionUrl: '/dashboard/bookings',
    actionText: 'Görüntüle'
  },
  {
    id: 'notif-2',
    userId: 'demo-provider-1',
    type: 'payment',
    title: 'Ödeme Alındı',
    message: '₺200 ödeme başarıyla alındı. Hesabınıza yatırıldı.',
    isRead: false,
    createdAt: new Date('2024-01-25T09:15:00'),
    actionUrl: '/dashboard/earnings',
    actionText: 'Detaylar'
  },
  {
    id: 'notif-3',
    userId: 'demo-customer-1',
    type: 'message',
    title: 'Yeni Mesaj',
    message: 'Ahmet Temizlik Uzmanı size mesaj gönderdi.',
    isRead: true,
    createdAt: new Date('2024-01-25T08:45:00'),
    actionUrl: '/dashboard/messages',
    actionText: 'Yanıtla'
  }
]



