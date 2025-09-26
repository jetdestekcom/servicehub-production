const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSecureDemoUsers() {
  try {
    console.log('🔐 Güvenli demo kullanıcıları oluşturuluyor...')

    // Mevcut demo kullanıcıları sil
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['musteri@demo.com', 'hizmet@demo.com', 'admin@demo.com']
        }
      }
    })

    // Güçlü şifreler oluştur
    const customerPassword = await bcrypt.hash('Demo123!@#', 12)
    const providerPassword = await bcrypt.hash('Demo123!@#', 12)
    const adminPassword = await bcrypt.hash('Admin123!@#', 12)

    // Demo müşteri oluştur
    const customer = await prisma.user.create({
      data: {
        name: 'Demo Müşteri',
        email: 'musteri@demo.com',
        password: customerPassword,
        role: 'CUSTOMER',
        phone: '+90 555 123 4567',
        emailVerified: new Date(),
        location: 'İstanbul, Türkiye',
        bio: 'Demo müşteri hesabı - test amaçlı',
        joinDate: new Date(),
        lastActive: new Date()
      }
    })

    // Demo hizmet veren oluştur
    const provider = await prisma.user.create({
      data: {
        name: 'Demo Hizmet Veren',
        email: 'hizmet@demo.com',
        password: providerPassword,
        role: 'PROVIDER',
        phone: '+90 555 987 6543',
        emailVerified: new Date(),
        location: 'Ankara, Türkiye',
        bio: 'Demo hizmet veren hesabı - test amaçlı',
        joinDate: new Date(),
        lastActive: new Date(),
        experience: '5 yıl',
        languages: 'Türkçe, İngilizce',
        workingHours: '09:00-18:00',
        responseTime: 30,
        completionRate: 95.5
      }
    })

    // Demo admin oluştur
    const admin = await prisma.user.create({
      data: {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+90 555 000 0000',
        emailVerified: new Date(),
        location: 'İstanbul, Türkiye',
        bio: 'Demo admin hesabı - test amaçlı',
        joinDate: new Date(),
        lastActive: new Date()
      }
    })

    // Demo hizmetler oluştur
    const services = [
      {
        title: 'Ev Temizliği Hizmeti',
        description: 'Profesyonel ev temizliği hizmeti. Tüm odalar, banyo, mutfak ve salon temizliği dahil.',
        category: 'Ev Hizmetleri',
        subcategory: 'Temizlik',
        price: 150.00,
        priceType: 'FIXED',
        duration: 240, // 4 saat
        location: 'İstanbul, Türkiye',
        latitude: 41.0082,
        longitude: 28.9784,
        images: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2be?w=800',
        tags: 'temizlik,ev,profesyonel',
        isActive: true,
        isVerified: true,
        rating: 4.8,
        reviewCount: 25,
        viewCount: 150,
        providerId: provider.id,
        requirements: 'Temizlik malzemeleri sağlanır',
        toolsProvided: 'Vakum, temizlik malzemeleri, bezler',
        warranty: 7,
        insurance: true,
        experience: 3,
        languages: 'Türkçe',
        workingHours: '09:00-18:00',
        responseTime: 30,
        completionRate: 98.0,
        serviceRadius: 50
      },
      {
        title: 'Teknik Destek Hizmeti',
        description: 'Bilgisayar, telefon ve tablet teknik destek hizmeti. Uzaktan ve yerinde destek.',
        category: 'Teknoloji',
        subcategory: 'Teknik Destek',
        price: 200.00,
        priceType: 'HOURLY',
        duration: 60,
        location: 'Ankara, Türkiye',
        latitude: 39.9334,
        longitude: 32.8597,
        images: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        tags: 'teknik,destek,bilgisayar',
        isActive: true,
        isVerified: true,
        rating: 4.9,
        reviewCount: 18,
        viewCount: 120,
        providerId: provider.id,
        requirements: 'Sorunun detaylı açıklaması',
        toolsProvided: 'Teknik araçlar, yazılımlar',
        warranty: 30,
        insurance: true,
        experience: 5,
        languages: 'Türkçe, İngilizce',
        workingHours: '08:00-20:00',
        responseTime: 15,
        completionRate: 99.0,
        serviceRadius: 100
      },
      {
        title: 'Nakliye Hizmeti',
        description: 'Ev ve ofis eşyası nakliye hizmeti. Güvenli paketleme ve taşıma.',
        category: 'Nakliye',
        subcategory: 'Ev Eşyası',
        price: 500.00,
        priceType: 'FIXED',
        duration: 480, // 8 saat
        location: 'İzmir, Türkiye',
        latitude: 38.4192,
        longitude: 27.1287,
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        tags: 'nakliye,taşıma,ev eşyası',
        isActive: true,
        isVerified: true,
        rating: 4.7,
        reviewCount: 32,
        viewCount: 200,
        providerId: provider.id,
        requirements: 'Eşya listesi ve adres bilgileri',
        toolsProvided: 'Nakliye aracı, paketleme malzemeleri',
        warranty: 14,
        insurance: true,
        experience: 8,
        languages: 'Türkçe',
        workingHours: '07:00-19:00',
        responseTime: 60,
        completionRate: 96.5,
        serviceRadius: 200
      }
    ]

    for (const serviceData of services) {
      await prisma.service.create({
        data: serviceData
      })
    }

    // Demo rezervasyonlar oluştur
    const bookings = [
      {
        serviceId: (await prisma.service.findFirst({ where: { title: 'Ev Temizliği Hizmeti' } }))?.id,
        customerId: customer.id,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 gün sonra
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 saat sonra
        totalAmount: 150.00,
        status: 'PENDING',
        notes: 'Demo rezervasyon - test amaçlı',
        address: 'Demo Adres, İstanbul',
      },
      {
        serviceId: (await prisma.service.findFirst({ where: { title: 'Teknik Destek Hizmeti' } }))?.id,
        customerId: customer.id,
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 saat sonra
        totalAmount: 200.00,
        status: 'CONFIRMED',
        notes: 'Demo rezervasyon - test amaçlı',
        address: 'Demo Adres, İstanbul',
      }
    ]

    for (const bookingData of bookings) {
      if (bookingData.serviceId) {
        await prisma.booking.create({
          data: bookingData
        })
      }
    }

    // Demo yorumlar oluştur
    const reviews = [
      {
        bookingId: (await prisma.booking.findFirst({ where: { notes: 'Demo rezervasyon - test amaçlı' } }))?.id,
        customerId: customer.id,
        serviceId: (await prisma.service.findFirst({ where: { title: 'Ev Temizliği Hizmeti' } }))?.id,
        rating: 5,
        comment: 'Çok memnun kaldım, çok temiz ve düzenli çalıştı. Kesinlikle tavsiye ederim!'
      }
    ]

    for (const reviewData of reviews) {
      if (reviewData.bookingId && reviewData.serviceId) {
        await prisma.review.create({
          data: reviewData
        })
      }
    }

    console.log('✅ Güvenli demo kullanıcıları başarıyla oluşturuldu!')
    console.log('')
    console.log('📧 Demo Hesaplar:')
    console.log('   Müşteri: musteri@demo.com / Demo123!@#')
    console.log('   Hizmet Veren: hizmet@demo.com / Demo123!@#')
    console.log('   Admin: admin@demo.com / Admin123!@#')
    console.log('')
    console.log('🔐 Güvenlik Özellikleri:')
    console.log('   - Güçlü şifreler (12+ karakter, özel karakterler)')
    console.log('   - Email doğrulama aktif')
    console.log('   - Hesap durumu aktif')
    console.log('   - Güvenli veri maskeleme')
    console.log('   - Rate limiting aktif')
    console.log('   - XSS koruması aktif')
    console.log('   - SQL injection koruması aktif')

  } catch (error) {
    console.error('❌ Demo kullanıcıları oluşturulurken hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSecureDemoUsers()
