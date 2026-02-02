import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { email, isActive: true },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  })

  if (!user) throw new Error('Invalid credentials')

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) throw new Error('Invalid credentials')

  const roles = user.userRoles.map(ur => ur.role.name)

  const token = jwt.sign(
    {
      userId: user.id,
      roles,
      organizationId: user.organizationId
    },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '1h' }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
      organizationId: user.organizationId
    }
  }
}
