
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Demo Pipeline...');

  // 1. Get or Create Organization
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.error('No organization found. Please run existing seeds first.');
    return;
  }

  // 2. Create Account
  const account = await prisma.account.create({
    data: {
      organizationId: org.id,
      name: 'Tesla Inc. (Demo)',
      industry: 'Automotive',
      website: 'https://tesla.com',
      phone: '+1 888 518 3752',
      address: 'Austin, TX'
    }
  });

  // 3. Create Contact
  const contact = await prisma.contact.create({
    data: {
      organizationId: org.id,
      accountId: account.id,
      firstName: 'Elon',
      lastName: 'Musk',
      email: 'elon.demo@tesla.com'
    }
  });

  // 4. Create Deal (Closed Won)
  const deal = await prisma.deal.create({
    data: {
      organizationId: org.id,
      accountId: account.id,
      contactId: contact.id,
      name: 'Gigafactory AI Upgrade',
      amount: 5000000,
      stage: 'Closed Won',
      dealType: 'New Business',
      probability: 100,
      expectedCloseDate: new Date(),
    }
  });

  // 5. Create Pipeline
  // We need to use the PipelineService logic, but we can just insert directly for speed if we mimic the steps
  // Or better, let's just insert the OrderPipeline and Steps manually to match the structure
  
  const stepsList = [
      { name: 'Lead', role: 'Sales' },
      { name: 'Account', role: 'Sales' },
      { name: 'Deal / Opportunity', role: 'Sales' },
      { name: 'Customer PO', role: 'Sales' },
      { name: 'Procurement / Vendor PO', role: 'SCM' },
      { name: 'Delivery & Logistics', role: 'Logistics' },
      { name: 'Physical Verification', role: 'Field Engineer' },
      { name: 'Deployment', role: 'Deployment' },
      { name: 'Invoicing', role: 'Finance' },
      { name: 'Closure & Support Handover', role: 'Support' }
  ];

  const pipeline = await prisma.orderPipeline.create({
    data: {
      organizationId: org.id,
      accountId: account.id,
      dealId: deal.id,
      currentStage: 'Procurement / Vendor PO',
      status: 'Active',
      steps: {
        create: stepsList.map((step, index) => ({
           stepName: step.name,
           assignedRole: step.role,
           // First 4 completed, 5th in progress, rest pending
           status: index < 4 ? 'COMPLETED' : (index === 4 ? 'IN_PROGRESS' : 'PENDING'),
           completedAt: index < 4 ? new Date() : null,
           data: index === 3 ? { poNumber: 'PO-998877', value: 5000000 } : undefined 
        }))
      }
    },
    include: {
        steps: true
    }
  });

  console.log(`Created Demo Pipeline: ${pipeline.id}`);
  console.log(`Deal: ${deal.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
