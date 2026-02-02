import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const AdminUsersService = {
  async createUser(organizationId: string, data: { email: string; fullName: string; department?: string; roleName: string; password?: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Check if user exists in this org
      const existingUser = await tx.user.findFirst({
        where: { email: data.email, organizationId }
      });
      if (existingUser) throw new Error('User already exists in this organization');

      // 2. Find Role
      const role = await tx.role.findFirst({
        where: { organizationId, name: data.roleName }
      });
      if (!role) throw new Error(`Role '${data.roleName}' not found`);

      // 3. Create User
      const passwordHash = await bcrypt.hash(data.password || 'Welcome@123', 10);
      const user = await tx.user.create({
        data: {
          organizationId,
          email: data.email,
          fullName: data.fullName,
          department: data.department,
          passwordHash,
          accessLevel: 'VIEW_ONLY', // Default, real permissions come from Role
          isActive: true
        }
      });

      // 4. Assign Role
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id
        }
      });

      return user;
    });
  },

  async listUsers(organizationId: string) {
    return prisma.user.findMany({
      where: { organizationId },
      include: {
        userRoles: {
          include: { role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async updateUserStatus(organizationId: string, userId: string, isActive: boolean) {
    // Verify user belongs to org
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId }
    });
    if (!user) throw new Error('User not found');

    return prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
  }
};
