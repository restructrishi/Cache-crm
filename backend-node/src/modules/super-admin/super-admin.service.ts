import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const SuperAdminService = {
  async createOrganization(
    orgData: { name: string; domain?: string; address?: string; phone?: string; subscriptionPlan?: string },
    adminData?: { email: string; password?: string; fullName?: string }
  ) {
    // Check for domain uniqueness before transaction
    if (orgData.domain) {
      const existingOrg = await prisma.organization.findUnique({
        where: { domain: orgData.domain }
      });
      if (existingOrg) {
        throw new Error('Organization with this domain already exists');
      }
    }

    // Transaction to create Org, Roles, and Admin User (if provided)
    return prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.organization.create({
        data: {
            name: orgData.name,
            domain: orgData.domain,
            address: orgData.address,
            phone: orgData.phone,
            subscriptionPlan: orgData.subscriptionPlan || 'FREE',
            isActive: true
        }
      });

      // 2. Create default roles for this organization
      await tx.role.createMany({
        data: [
            { organizationId: org.id, name: 'ORG_ADMIN', description: 'Organization Administrator' },
            { organizationId: org.id, name: 'USER', description: 'Standard User' }
        ]
      });

      // 3. Find the ORG_ADMIN role we just created
      const adminRole = await tx.role.findFirst({
        where: { organizationId: org.id, name: 'ORG_ADMIN' }
      });

      if (!adminRole) {
        throw new Error('Failed to create default roles');
      }

      // 4. Create Admin User IF adminData is provided
      let user: any = null;
      if (adminData && adminData.email) {
        const passwordHash = await bcrypt.hash(adminData.password || 'Welcome@123', 10);
        user = await tx.user.create({
          data: {
            organizationId: org.id,
            email: adminData.email,
            fullName: adminData.fullName || 'Admin',
            passwordHash,
            accessLevel: 'ADMIN',
            isActive: true
          }
        });

        // 5. Assign ORG_ADMIN role to user
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRole.id
          }
        });
      }

      // Return composite result
      return {
        organization: org,
        admin: user ? {
          id: user.id,
          email: user.email,
          role: 'ORG_ADMIN'
        } : null
      };
    });
  },

  async createOrgAdmin(data: { organizationId: string; email: string; fullName: string; password?: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Check if user exists
      const existingUser = await tx.user.findFirst({
        where: { email: data.email, organizationId: data.organizationId }
      });
      if (existingUser) throw new Error('User already exists in this organization');

      // 2. Find ORG_ADMIN role
      const adminRole = await tx.role.findFirst({
        where: { organizationId: data.organizationId, name: 'ORG_ADMIN' }
      });
      if (!adminRole) throw new Error('ORG_ADMIN role not found for this organization');

      // 3. Create User
      const passwordHash = await bcrypt.hash(data.password || 'Welcome@123', 10);
      const user = await tx.user.create({
        data: {
          organizationId: data.organizationId,
          email: data.email,
          fullName: data.fullName,
          passwordHash,
          accessLevel: 'ADMIN', // Or whatever default
          isActive: true
        }
      });

      // 4. Assign Role
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id
        }
      });

      return user;
    });
  },

  async getAllOrganizations() {
    return prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
