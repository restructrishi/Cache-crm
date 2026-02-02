import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'superadmin@cachecrm.com'
  const password = 'Admin@123'

  const passwordHash = await bcrypt.hash(password, 12)

  const existingUser = await prisma.user.findFirst({
    where: { email }
  })

  if (existingUser) {
    console.log('Super Admin already exists')
    return
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName: 'Cache CRM Super Admin',
      isActive: true,
      userRoles: {
        create: {
          role: {
            create: {
              name: 'SUPER_ADMIN',
              isSystemRole: true
            }
          }
        }
      }
    }
  })

  console.log('✅ Super Admin created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
