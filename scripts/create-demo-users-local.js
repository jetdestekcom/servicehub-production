const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createDemoUsers() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('demo123', 12)

    // Create customer user
    const customer = await prisma.user.upsert({
      where: { email: 'musteri@demo.com' },
      update: {},
      create: {
        email: 'musteri@demo.com',
        name: 'Demo Müşteri',
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'CUSTOMER',
        phone: '+90 555 111 2233',
        isActive: true
      }
    })

    console.log('✅ Müşteri kullanıcısı oluşturuldu:', customer.email)

    // Create service provider user
    const provider = await prisma.user.upsert({
      where: { email: 'hizmet@demo.com' },
      update: {},
      create: {
        email: 'hizmet@demo.com',
        name: 'Demo Hizmet Veren',
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'PROVIDER',
        phone: '+90 555 333 4455',
        isActive: true
      }
    })

    console.log('✅ Hizmet veren kullanıcısı oluşturuldu:', provider.email)

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        email: 'admin@demo.com',
        name: 'Demo Admin',
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'ADMIN',
        phone: '+90 555 000 0000',
        isActive: true
      }
    })

    console.log('✅ Admin kullanıcısı oluşturuldu:', admin.email)

    // Create some services for the provider
    const services = [
      {
        title: 'Ev Temizliği',
        description: 'Profesyonel ev temizliği hizmeti. Evinizin her köşesini detaylıca temizleriz.',
        category: 'Temizlik',
        price: 250,
        location: 'Ankara, Türkiye',
        isActive: true,
        providerId: provider.id,
        images: '["/api/placeholder/400/300","/api/placeholder/400/300"]',
        tags: '["temizlik","ev","profesyonel"]'
      },
      {
        title: 'Boya Badana',
        description: 'Uzman boya ve badana hizmeti. Kaliteli malzemeler kullanarak evinizi yenileriz.',
        category: 'Tadilat',
        price: 500,
        location: 'Ankara, Türkiye',
        isActive: true,
        providerId: provider.id,
        images: '["/api/placeholder/400/300"]',
        tags: '["boya","badana","tadilat"]'
      },
      {
        title: 'Elektrik Tesisatı',
        description: 'Elektrik arızaları ve tesisat işleri için profesyonel hizmet.',
        category: 'Elektrik',
        price: 300,
        location: 'İstanbul, Türkiye',
        isActive: true,
        providerId: provider.id,
        images: '["/api/placeholder/400/300"]',
        tags: '["elektrik","tesisat","arıza"]'
      }
    ]

    for (const service of services) {
      await prisma.service.create({
        data: service
      })
    }

    console.log('✅ Hizmet veren için örnek hizmetler oluşturuldu')

    // Create some sample bookings
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceId: (await prisma.service.findFirst({ where: { title: 'Ev Temizliği' } }))?.id || '',
        status: 'CONFIRMED',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        totalPrice: 250
      }
    })

    console.log('✅ Örnek buchung oluşturuldu')

    console.log('\n📧 Giriş Bilgileri:')
    console.log('Müşteri: musteri@demo.com / demo123')
    console.log('Hizmet Veren: hizmet@demo.com / demo123')
    console.log('Admin: admin@demo.com / demo123')
    console.log('\n🌐 Anwendung läuft auf: http://localhost:3000')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUsers()
