
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Debugging Meeting Creation...');

  // 1. Get a user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found!');
    return;
  }
  console.log('User found:', user.email, user.id);

  // 2. Prepare meeting data
  const meetingData = {
    title: 'Debug Meeting',
    description: 'Created via debug script',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // +1 hour
    status: 'Scheduled',
    organizationId: user.organizationId,
    hostId: user.id,
    dealId: null, // Explicit null
    leadId: null  // Explicit null
  };

  console.log('Attempting to create meeting with data:', JSON.stringify(meetingData, null, 2));

  try {
    const meeting = await prisma.meeting.create({
      data: meetingData
    });
    console.log('SUCCESS: Meeting created:', meeting.id);
  } catch (e: any) {
    console.error('FAILURE: Failed to create meeting');
    console.error('Error code:', e.code);
    console.error('Error message:', e.message);
    if (e.meta) {
        console.error('Error meta:', e.meta);
    }
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
