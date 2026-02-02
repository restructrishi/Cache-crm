import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Super Admin seed...');

  // 1. Ensure SUPER_ADMIN Role exists (Global System Role)
  const roleName = 'SUPER_ADMIN';
  
  // Note: We use findFirst because upsert with nullable unique fields can be tricky depending on Prisma version/driver
  let superAdminRole = await prisma.role.findFirst({
    where: {
      organizationId: null,
      name: roleName,
    },
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: roleName,
        organizationId: null, // Global
        isSystemRole: true,
        description: 'Global System Administrator with full access',
      },
    });
    console.log(`Created Role: ${roleName}`);
  } else {
    console.log(`Role ${roleName} already exists.`);
  }

  // 2. Ensure Super Admin User exists
  const email = 'superadmin@cachecrm.com';
  const defaultPassword = 'securepassword123';
  
  let user = await prisma.user.findFirst({
    where: {
      email: email,
      organizationId: null,
    },
  });

  if (!user) {
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: 'Super Administrator',
        organizationId: null,
        isActive: true,
        accessLevel: 'FULL_ACCESS',
        department: 'IT',
      },
    });
    console.log(`Created User: ${email} (Password: ${defaultPassword})`);
  } else {
    console.log(`User ${email} already exists.`);
  }

  // 3. Assign Role to User
  const userRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
  });

  if (!userRole) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    });
    console.log(`Assigned ${roleName} role to ${email}`);
  } else {
    console.log(`User already has ${roleName} role.`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
