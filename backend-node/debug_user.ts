
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@cachecrm.com';
  console.log(`Checking user with email: ${email}`);
  const user = await prisma.user.findFirst({
    where: { email },
  });
  
  if (user) {
    console.log('User found:', user);
    const userById = await prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log('User found by ID:', userById);
  } else {
    console.log('User NOT found');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
