
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDataVisibility() {
  console.log('--- DATA VISIBILITY CHECK ---\n');

  // 1. Organizations
  console.log('--- 1. Organizations ---');
  const orgs = await prisma.organization.findMany({
    include: {
      _count: { select: { users: true } }
    }
  });
  if (orgs.length === 0) {
      console.log('No organizations found.');
  } else {
      console.table(orgs.map(o => ({
          id: o.id,
          name: o.name,
          domain: o.domain,
          userCount: o._count.users
      })));
  }
  console.log('\n');

  // 2. Users & Roles
  console.log('--- 2. Users & Roles ---');
  const users = await prisma.user.findMany({
    include: {
      organization: true,
      userRoles: {
        include: { role: true }
      }
    }
  });
  
  if (users.length === 0) {
      console.log('No users found.');
  } else {
      console.table(users.map(u => ({
          id: u.id,
          email: u.email,
          orgName: u.organization?.name || 'NULL (Super Admin?)',
          orgId: u.organizationId,
          roles: u.userRoles.map(ur => ur.role.name).join(', ')
      })));
  }
  console.log('\n');

  // 3. Leads by Organization
  console.log('--- 3. Leads by Organization ---');
  // Since Lead model is related to Organization, let's query Leads and group by Org or just list them with Org info
  // Wait, Lead model in schema:
  // model Lead { ... organization Organization ... }
  // Let's check if Lead model exists in client (it should).
  
  // Note: If Lead model name is different in Prisma client vs Schema file (map), we should use the Client name.
  // In schema.prisma provided earlier: model Lead { ... @@map("leads") }
  // So prisma.lead should work.
  
  try {
      // @ts-ignore - Lead might not be in the generated client type if I didn't regenerate, but let's try.
      const leads = await prisma.lead.findMany({
        include: {
            organization: true,
            owner: true
        },
        take: 50
      });

      if (leads.length === 0) {
          console.log('No leads found.');
      } else {
          console.table(leads.map(l => ({
              id: l.id,
              name: `${l.firstName} ${l.lastName}`,
              company: l.company,
              org: l.organization?.name || 'NULL (BUG!)',
              owner: l.owner?.email || 'NULL'
          })));
      }
  } catch (e) {
      console.log('Error querying leads (maybe model name differs?):', e.message);
  }
  console.log('\n');
}

verifyDataVisibility()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
