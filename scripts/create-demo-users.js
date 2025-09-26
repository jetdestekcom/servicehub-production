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
        location: 'İstanbul, Türkiye',
        bio: 'Demo müşteri hesabı - hizmet almak için kullanın'
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
        location: 'Ankara, Türkiye',
        bio: 'Demo hizmet veren hesabı - hizmet sunmak için kullanın',
        rating: 4.8,
        reviewCount: 25
      }
    })

    console.log('✅ Hizmet veren kullanıcısı oluşturuldu:', provider.email)

    // Create some services for the provider
    const services = [
      {
        title: 'Ev Temizliği',
        description: 'Profesyonel ev temizliği hizmeti',
        category: 'Temizlik',
        price: 250,
        duration: 120,
        location: 'Ankara, Türkiye',
        isActive: true,
        providerId: provider.id,
        images: '/api/placeholder/400/300,/api/placeholder/400/300',
        tags: 'temizlik,ev,profesyonel',
        rating: 4.9,
        reviewCount: 15
      },
      {
        title: 'Boya Badana',
        description: 'Uzman boya ve badana hizmeti',
        category: 'Tadilat',
        price: 500,
        duration: 240,
        location: 'Ankara, Türkiye',
        isActive: true,
        providerId: provider.id,
        images: '/api/placeholder/400/300',
        tags: 'boya,badana,tadilat',
        rating: 4.7,
        reviewCount: 10
      }
    ]

    for (const service of services) {
      await prisma.service.create({
        data: service
      })
    }

    console.log('✅ Hizmet veren için örnek hizmetler oluşturuldu')

    console.log('\n📧 Giriş Bilgileri:')
    console.log('Müşteri: musteri@demo.com / demo123')
    console.log('Hizmet Veren: hizmet@demo.com / demo123')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUsers()
