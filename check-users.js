const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'demo'
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })
    
    console.log('Demo Users:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${user.role} - Password: ${user.password ? 'Set' : 'Not set'}`)
    })
    
    // Check specific demo users
    const specificUsers = [
      'musteri1@demo.com',
      'musteri2@demo.com', 
      'musteri3@demo.com',
      'hizmet1@demo.com',
      'hizmet2@demo.com',
      'hizmet3@demo.com'
    ]
    
    console.log('\nSpecific Demo Users:')
    for (const email of specificUsers) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true
        }
      })
      
      if (user) {
        console.log(`✓ ${user.email} (${user.name}) - Role: ${user.role} - Password: ${user.password ? 'Set' : 'Not set'}`)
      } else {
        console.log(`✗ ${email} - NOT FOUND`)
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
