const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createComprehensiveDemo() {
  try {
    console.log('🚀 Erstelle umfassende Demo-Daten...')

    // 1. Erstelle verschiedene Benutzer
    const hashedPassword = await bcrypt.hash('demo123', 12)

    const users = await Promise.all([
      // Kunden
      prisma.user.upsert({
        where: { email: 'musteri1@demo.com' },
        update: {},
        create: {
          email: 'musteri1@demo.com',
          name: 'Ahmet Yılmaz',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'CUSTOMER',
          phone: '+90 555 111 2233',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'musteri2@demo.com' },
        update: {},
        create: {
          email: 'musteri2@demo.com',
          name: 'Fatma Demir',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'CUSTOMER',
          phone: '+90 555 222 3344',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'musteri3@demo.com' },
        update: {},
        create: {
          email: 'musteri3@demo.com',
          name: 'Mehmet Kaya',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'CUSTOMER',
          phone: '+90 555 333 4455',
          isActive: true
        }
      }),

      // Dienstleister
      prisma.user.upsert({
        where: { email: 'hizmet1@demo.com' },
        update: {},
        create: {
          email: 'hizmet1@demo.com',
          name: 'Ali Temizlik Uzmanı',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'PROVIDER',
          phone: '+90 555 444 5566',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'hizmet2@demo.com' },
        update: {},
        create: {
          email: 'hizmet2@demo.com',
          name: 'Ayşe Teknik Servis',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'PROVIDER',
          phone: '+90 555 555 6677',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'hizmet3@demo.com' },
        update: {},
        create: {
          email: 'hizmet3@demo.com',
          name: 'Mustafa Bahçıvan',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'PROVIDER',
          phone: '+90 555 666 7788',
          isActive: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'hizmet4@demo.com' },
        update: {},
        create: {
          email: 'hizmet4@demo.com',
          name: 'Zeynep Özel Ders',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'PROVIDER',
          phone: '+90 555 777 8899',
          isActive: true
        }
      }),

      // Admin
      prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
          email: 'admin@demo.com',
          name: 'Admin Kullanıcı',
          password: hashedPassword,
          emailVerified: new Date(),
          role: 'ADMIN',
          phone: '+90 555 000 0000',
          isActive: true
        }
      })
    ])

    console.log('✅ Benutzer erstellt:', users.length)

    // 2. Erstelle viele Services
    const services = await Promise.all([
      // Temizlik Services
      prisma.service.create({
        data: {
          title: 'Profesyonel Ev Temizliği',
          description: 'Ev temizliği konusunda 10 yıllık deneyimimle, evinizin her köşesini detaylıca temizlerim. Mutfak, banyo, salon ve yatak odaları dahil tüm alanlar profesyonel temizlik ürünleri ile temizlenir.',
          category: 'Temizlik',
          price: 250,
          location: 'İstanbul, Kadıköy',
          isActive: true,
          providerId: users[3].id, // Ali Temizlik Uzmanı
          images: JSON.stringify(['/api/placeholder/400/300', '/api/placeholder/400/300']),
          tags: JSON.stringify(['temizlik', 'ev', 'profesyonel', 'hızlı'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'Ofis Temizliği',
          description: 'Büro ve ofis alanları için özel temizlik hizmeti. Çalışma alanlarınızı hijyenik ve düzenli tutarım.',
          category: 'Temizlik',
          price: 300,
          location: 'İstanbul, Beşiktaş',
          isActive: true,
          providerId: users[3].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['temizlik', 'ofis', 'büro', 'hijyen'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'Cam Temizliği',
          description: 'Pencereler, balkon camları ve vitrin camları için özel temizlik hizmeti. Lekesiz ve parlak sonuç.',
          category: 'Temizlik',
          price: 150,
          location: 'İstanbul, Şişli',
          isActive: true,
          providerId: users[3].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['temizlik', 'cam', 'pencere', 'parlak'])
        }
      }),

      // Teknik Servis
      prisma.service.create({
        data: {
          title: 'Bilgisayar Tamir ve Bakım',
          description: 'Laptop ve masaüstü bilgisayarlar için tamir, bakım ve yazılım kurulum hizmeti. 15 yıllık deneyim.',
          category: 'Teknoloji',
          price: 200,
          location: 'İstanbul, Üsküdar',
          isActive: true,
          providerId: users[4].id, // Ayşe Teknik Servis
          images: JSON.stringify(['/api/placeholder/400/300', '/api/placeholder/400/300']),
          tags: JSON.stringify(['bilgisayar', 'tamir', 'bakım', 'yazılım'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'Telefon Tamiri',
          description: 'iPhone, Samsung ve diğer marka telefonlar için tamir hizmeti. Ekran değişimi, batarya değişimi ve yazılım sorunları.',
          category: 'Teknoloji',
          price: 150,
          location: 'İstanbul, Fatih',
          isActive: true,
          providerId: users[4].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['telefon', 'tamir', 'ekran', 'batarya'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'WiFi ve Ağ Kurulumu',
          description: 'Ev ve ofis için WiFi kurulumu, ağ güvenliği ve internet hızı optimizasyonu.',
          category: 'Teknoloji',
          price: 300,
          location: 'İstanbul, Bakırköy',
          isActive: true,
          providerId: users[4].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['wifi', 'ağ', 'internet', 'kurulum'])
        }
      }),

      // Bahçıvanlık
      prisma.service.create({
        data: {
          title: 'Bahçe Düzenleme ve Bakım',
          description: 'Bahçe tasarımı, çiçek dikimi, ağaç budama ve genel bahçe bakım hizmeti. Doğal ve estetik bahçeler.',
          category: 'Bahçıvanlık',
          price: 400,
          location: 'İstanbul, Sarıyer',
          isActive: true,
          providerId: users[5].id, // Mustafa Bahçıvan
          images: JSON.stringify(['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300']),
          tags: JSON.stringify(['bahçe', 'çiçek', 'ağaç', 'doğal'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'Çim Bakımı',
          description: 'Çim ekimi, sulama sistemi kurulumu ve düzenli çim bakım hizmeti.',
          category: 'Bahçıvanlık',
          price: 200,
          location: 'İstanbul, Beykoz',
          isActive: true,
          providerId: users[5].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['çim', 'sulama', 'bakım', 'yeşil'])
        }
      }),

      // Eğitim
      prisma.service.create({
        data: {
          title: 'Matematik Özel Ders',
          description: 'İlkokul, ortaokul ve lise seviyesinde matematik özel ders. 8 yıllık öğretmenlik deneyimi.',
          category: 'Eğitim',
          price: 150,
          location: 'İstanbul, Kadıköy',
          isActive: true,
          providerId: users[6].id, // Zeynep Özel Ders
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['matematik', 'özel ders', 'eğitim', 'öğretmen'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'İngilizce Konuşma Dersi',
          description: 'İngilizce konuşma pratiği ve telaffuz geliştirme dersleri. Native speaker seviyesinde.',
          category: 'Eğitim',
          price: 200,
          location: 'İstanbul, Beşiktaş',
          isActive: true,
          providerId: users[6].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['ingilizce', 'konuşma', 'telaffuz', 'pratik'])
        }
      }),

      // Diğer Services
      prisma.service.create({
        data: {
          title: 'Nakliye ve Taşıma',
          description: 'Ev eşyası, ofis malzemeleri ve diğer eşyalar için güvenli nakliye hizmeti.',
          category: 'Nakliyat',
          price: 500,
          location: 'İstanbul, Tüm İlçeler',
          isActive: true,
          providerId: users[3].id,
          images: JSON.stringify(['/api/placeholder/400/300']),
          tags: JSON.stringify(['nakliye', 'taşıma', 'eşya', 'güvenli'])
        }
      }),
      prisma.service.create({
        data: {
          title: 'Boya Badana',
          description: 'İç ve dış mekan boya badana işleri. Kaliteli malzemeler ve uzman işçilik.',
          category: 'Tadilat',
          price: 800,
          location: 'İstanbul, Avrupa Yakası',
          isActive: true,
          providerId: users[4].id,
          images: JSON.stringify(['/api/placeholder/400/300', '/api/placeholder/400/300']),
          tags: JSON.stringify(['boya', 'badana', 'tadilat', 'renk'])
        }
      })
    ])

    console.log('✅ Services erstellt:', services.length)

    // 3. Erstelle Buchungen
    const bookings = await Promise.all([
      prisma.booking.create({
        data: {
          customerId: users[0].id, // Ahmet Yılmaz
          serviceId: services[0].id, // Ev Temizliği
          status: 'COMPLETED',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 Woche ago
          totalPrice: 250
        }
      }),
      prisma.booking.create({
        data: {
          customerId: users[1].id, // Fatma Demir
          serviceId: services[3].id, // Bilgisayar Tamir
          status: 'CONFIRMED',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 Tagen
          totalPrice: 200
        }
      }),
      prisma.booking.create({
        data: {
          customerId: users[2].id, // Mehmet Kaya
          serviceId: services[6].id, // Bahçe Düzenleme
          status: 'PENDING',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 Tagen
          totalPrice: 400
        }
      }),
      prisma.booking.create({
        data: {
          customerId: users[0].id, // Ahmet Yılmaz
          serviceId: services[8].id, // Matematik Ders
          status: 'IN_PROGRESS',
          startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Gestern
          totalPrice: 150
        }
      }),
      prisma.booking.create({
        data: {
          customerId: users[1].id, // Fatma Demir
          serviceId: services[1].id, // Ofis Temizliği
          status: 'COMPLETED',
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 Tage ago
          totalPrice: 300
        }
      })
    ])

    console.log('✅ Buchungen erstellt:', bookings.length)

    // 4. Erstelle Reviews
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          customerId: users[0].id, // Ahmet Yılmaz
          serviceId: services[0].id, // Ev Temizliği
          bookingId: bookings[0].id,
          rating: 5,
          comment: 'Mükemmel bir hizmet! Evim çok temiz oldu, kesinlikle tavsiye ederim.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: users[1].id, // Fatma Demir
          serviceId: services[1].id, // Ofis Temizliği
          bookingId: bookings[4].id,
          rating: 4,
          comment: 'Çok düzenli ve temiz bir iş çıkardı. Ofisimiz çok güzel görünüyor.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: users[0].id, // Ahmet Yılmaz
          serviceId: services[3].id, // Bilgisayar Tamir
          bookingId: bookings[1].id,
          rating: 5,
          comment: 'Bilgisayarımı çok hızlı tamir etti. Çok memnun kaldım.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: users[2].id, // Mehmet Kaya
          serviceId: services[8].id, // Matematik Ders
          bookingId: bookings[3].id,
          rating: 5,
          comment: 'Çok iyi bir öğretmen. Matematik konularını çok güzel anlatıyor.'
        }
      })
    ])

    console.log('✅ Reviews erstellt:', reviews.length)

    // 5. Erstelle Messages
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          senderId: users[0].id, // Ahmet Yılmaz
          receiverId: users[3].id, // Ali Temizlik Uzmanı
          content: 'Merhaba, ev temizliği için ne zaman müsait olursunuz?'
        }
      }),
      prisma.message.create({
        data: {
          senderId: users[3].id, // Ali Temizlik Uzmanı
          receiverId: users[0].id, // Ahmet Yılmaz
          content: 'Merhaba! Yarın sabah 9:00\'da gelebilirim. Uygun mu?'
        }
      }),
      prisma.message.create({
        data: {
          senderId: users[1].id, // Fatma Demir
          receiverId: users[4].id, // Ayşe Teknik Servis
          content: 'Bilgisayarımda sorun var, yardımcı olabilir misiniz?'
        }
      })
    ])

    console.log('✅ Messages erstellt:', messages.length)

    // 6. Erstelle Notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: users[0].id, // Ahmet Yılmaz
          title: 'Rezervasyon Onaylandı',
          message: 'Ev temizliği rezervasyonunuz onaylandı.',
          type: 'booking_confirmed'
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[3].id, // Ali Temizlik Uzmanı
          title: 'Yeni Rezervasyon',
          message: 'Yeni bir ev temizliği rezervasyonu aldınız.',
          type: 'new_booking'
        }
      }),
      prisma.notification.create({
        data: {
          userId: users[1].id, // Fatma Demir
          title: 'Hizmet Tamamlandı',
          message: 'Ofis temizliği hizmetiniz tamamlandı.',
          type: 'service_completed'
        }
      })
    ])

    console.log('✅ Notifications erstellt:', notifications.length)

    console.log('\n🎉 Demo-Daten erfolgreich erstellt!')
    console.log('\n📊 Statistiken:')
    console.log(`👥 Benutzer: ${users.length}`)
    console.log(`🔧 Services: ${services.length}`)
    console.log(`📅 Buchungen: ${bookings.length}`)
    console.log(`⭐ Reviews: ${reviews.length}`)
    console.log(`💬 Messages: ${messages.length}`)
    console.log(`🔔 Notifications: ${notifications.length}`)

    console.log('\n🔑 Demo-Zugänge:')
    console.log('Kunden:')
    console.log('  - musteri1@demo.com / demo123 (Ahmet Yılmaz)')
    console.log('  - musteri2@demo.com / demo123 (Fatma Demir)')
    console.log('  - musteri3@demo.com / demo123 (Mehmet Kaya)')
    console.log('\nDienstleister:')
    console.log('  - hizmet1@demo.com / demo123 (Ali Temizlik Uzmanı)')
    console.log('  - hizmet2@demo.com / demo123 (Ayşe Teknik Servis)')
    console.log('  - hizmet3@demo.com / demo123 (Mustafa Bahçıvan)')
    console.log('  - hizmet4@demo.com / demo123 (Zeynep Özel Ders)')
    console.log('\nAdmin:')
    console.log('  - admin@demo.com / demo123 (Admin Kullanıcı)')

    console.log('\n🌐 Anwendung: http://localhost:3000')

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Demo-Daten:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createComprehensiveDemo()
